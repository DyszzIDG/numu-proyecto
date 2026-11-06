// lib/ai/claude-fallback.ts

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ClaudeAnalysis {
  tool: string;
  target: string;
  scanType: string;
  additionalFlags: string[];
  reasoning: string;
}

export async function analyzeWithClaude(prompt: string): Promise<ClaudeAnalysis> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    tools: [
      {
        name: 'generate_security_scan',
        description: 'Analiza una solicitud de escaneo de seguridad en lenguaje natural y determina la herramienta, objetivo y parámetros apropiados',
        input_schema: {
          type: 'object',
          properties: {
            tool: {
              type: 'string',
              enum: ['nmap', 'nikto', 'sqlmap', 'rustscan', 'theharvester', 'wpscan', 'gobuster'],
              description: 'La herramienta de seguridad más apropiada para el escaneo solicitado'
            },
            target: {
              type: 'string',
              description: 'El objetivo del escaneo (dirección IP, dominio o URL)'
            },
            scan_type: {
              type: 'string',
              enum: ['quick', 'full', 'stealth', 'vulnerability', 'service', 'aggressive', 'enumeration'],
              description: 'El tipo de escaneo a realizar'
            },
            additional_flags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Flags o parámetros adicionales específicos de la herramienta'
            },
            reasoning: {
              type: 'string',
              description: 'Explicación breve de por qué se eligió esta configuración'
            }
          },
          required: ['tool', 'target', 'scan_type', 'reasoning']
        }
      }
    ],
    messages: [
      {
        role: 'user',
        content: `Analiza esta solicitud de escaneo de seguridad y determina la mejor herramienta y configuración:

"${prompt}"

Considera:
- ¿Qué tipo de escaneo se solicita? (puertos, web, SQL, OSINT, etc.)
- ¿Cuál es el objetivo del usuario? (reconocimiento, búsqueda de vulnerabilidades, análisis de servicios)
- ¿Qué herramienta es más apropiada para este caso?
- ¿Qué nivel de agresividad/profundidad es apropiado?

Responde usando la función generate_security_scan.`
      }
    ]
  });

  // Extraer el tool use de la respuesta
  const toolUse = message.content.find(
    (block) => block.type === 'tool_use'
  );

  if (!toolUse || toolUse.type !== 'tool_use') {
    throw new Error('Claude did not return a tool use');
  }

  const analysis = toolUse.input as ClaudeAnalysis;

  return {
    tool: analysis.tool,
    target: analysis.target,
    scanType: analysis.scan_type,
    additionalFlags: analysis.additional_flags || [],
    reasoning: analysis.reasoning
  };
}

/**
 * Construye el comando final basado en el análisis de Claude
 */
export function buildCommandFromClaude(analysis: ClaudeAnalysis): string {
  const { tool, target, scanType, additionalFlags } = analysis;

  // Mapeo de scan types a flags comunes
  const scanTypeFlags: Record<string, Record<string, string[]>> = {
    nmap: {
      quick: ['-sV', '-F'],
      full: ['-p-', '-sV', '-sC'],
      stealth: ['-sS', '-sV', '-T2'],
      vulnerability: ['--script', 'vuln'],
      service: ['-sV', '-sC'],
      aggressive: ['-A', '-T4']
    },
    nikto: {
      quick: ['-h'],
      full: ['-h', '-Tuning', 'x'],
    },
    sqlmap: {
      quick: ['-u', '--batch'],
      full: ['-u', '--batch', '--level=5', '--risk=3'],
      enumeration: ['-u', '--batch', '--dbs']
    },
    rustscan: {
      quick: ['-a'],
      full: ['-a', '--ulimit', '5000']
    },
    theharvester: {
      quick: ['-d', '-b', 'google'],
      full: ['-d', '-b', 'all']
    }
  };

  const baseFlags = scanTypeFlags[tool]?.[scanType] || [];
  const allFlags = [...baseFlags, ...additionalFlags];

  // Construir comando según la herramienta
  switch (tool) {
    case 'nmap':
    case 'rustscan':
      return `${tool} ${allFlags.join(' ')} ${target}`;
    
    case 'nikto':
      return `nikto -h ${target} ${allFlags.slice(1).join(' ')}`;
    
    case 'sqlmap':
      return `sqlmap -u ${target} ${allFlags.slice(2).join(' ')}`;
    
    case 'theharvester':
      return `theharvester -d ${target} ${allFlags.slice(1).join(' ')}`;
    
    case 'wpscan':
      return `wpscan --url ${target} ${allFlags.join(' ')}`;
    
    case 'gobuster':
      return `gobuster dir -u ${target} ${allFlags.join(' ')}`;
    
    default:
      return `${tool} ${allFlags.join(' ')} ${target}`;
  }
}

/**
 * Wrapper que combina análisis y construcción de comando
 */
export async function analyzeAndBuildCommand(prompt: string) {
  const analysis = await analyzeWithClaude(prompt);
  const command = buildCommandFromClaude(analysis);

  return {
    tool: analysis.tool,
    target: analysis.target,
    scanType: analysis.scanType,
    flags: [...analysis.additionalFlags],
    command,
    explanation: analysis.reasoning,
    confidence: 95 // Claude siempre tiene alta confianza
  };
}
