// lib/ai/intent-parser.ts

export interface ParsedIntent {
  tool: string;
  target: string | null;
  scanType: string;
  flags: string[];
  confidence: number;
  explanation: string;
  command?: string;
}

interface ToolPattern {
  keywords: string[];
  scanTypes: Record<string, string[]>;
  defaultScanType: string;
  baseCommand: string;
}

// Definición de patrones para cada herramienta
const TOOL_PATTERNS: Record<string, ToolPattern> = {
  nmap: {
    keywords: ['scan', 'port', 'open', 'service', 'host', 'network', 'ping', 'tcp', 'udp'],
    scanTypes: {
      quick: ['-sV', '-F'],
      full: ['-p-', '-sV', '-sC', '-O'],
      stealth: ['-sS', '-sV', '-T2'],
      vulnerability: ['--script', 'vuln'],
      service: ['-sV', '-sC'],
      aggressive: ['-A', '-T4']
    },
    defaultScanType: 'quick',
    baseCommand: 'nmap'
  },
  nikto: {
    keywords: ['web', 'http', 'https', 'website', 'webapp', 'server', 'ssl', 'tls'],
    scanTypes: {
      quick: ['-h'],
      full: ['-h', '-Tuning', 'x'],
      ssl: ['-h', '-ssl']
    },
    defaultScanType: 'quick',
    baseCommand: 'nikto'
  },
  sqlmap: {
    keywords: ['sql', 'injection', 'database', 'sqli', 'form', 'parameter'],
    scanTypes: {
      quick: ['-u', '--batch'],
      full: ['-u', '--batch', '--level=5', '--risk=3'],
      enumeration: ['-u', '--batch', '--dbs']
    },
    defaultScanType: 'quick',
    baseCommand: 'sqlmap'
  },
  rustscan: {
    keywords: ['fast', 'quick scan', 'rapid', 'speed'],
    scanTypes: {
      quick: ['-a'],
      full: ['-a', '--ulimit', '5000']
    },
    defaultScanType: 'quick',
    baseCommand: 'rustscan'
  },
  theharvester: {
    keywords: ['email', 'domain', 'subdomain', 'osint', 'reconnaissance', 'recon'],
    scanTypes: {
      quick: ['-d', '-b', 'google'],
      full: ['-d', '-b', 'all']
    },
    defaultScanType: 'quick',
    baseCommand: 'theharvester'
  }
};

// Palabras clave para tipos de escaneo
const SCAN_TYPE_KEYWORDS: Record<string, string[]> = {
  quick: ['quick', 'fast', 'rapid', 'basic'],
  full: ['full', 'complete', 'comprehensive', 'deep', 'thorough'],
  stealth: ['stealth', 'stealthy', 'hidden', 'quiet', 'undetected'],
  vulnerability: ['vulnerability', 'vulnerabilities', 'vuln', 'exploit', 'cve'],
  service: ['service', 'services', 'version', 'banner'],
  aggressive: ['aggressive', 'intense', 'maximum']
};

/**
 * Extrae el target (IP, dominio, URL) del prompt
 */
function extractTarget(prompt: string): string | null {
  // Regex patterns para diferentes tipos de targets
  const patterns = {
    // IPv4
    ipv4: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/,
    // Domain
    domain: /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}\b/i,
    // URL
    url: /https?:\/\/[^\s]+/i
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    const match = prompt.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return null;
}

/**
 * Detecta el tipo de escaneo basado en keywords
 */
function detectScanType(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  for (const [scanType, keywords] of Object.entries(SCAN_TYPE_KEYWORDS)) {
    if (keywords.some(keyword => lowerPrompt.includes(keyword))) {
      return scanType;
    }
  }
  
  return 'quick'; // Default
}

/**
 * Calcula el score de coincidencia para una herramienta
 */
function calculateToolScore(prompt: string, toolConfig: ToolPattern): number {
  const lowerPrompt = prompt.toLowerCase();
  const matches = toolConfig.keywords.filter(keyword => 
    lowerPrompt.includes(keyword)
  );
  
  if (matches.length === 0) return 0;
  
  // Score = (matches / total keywords) * 100
  const baseScore = (matches.length / toolConfig.keywords.length) * 100;
  
  // Bonus por múltiples matches
  const matchBonus = matches.length > 2 ? 10 : 0;
  
  return Math.min(baseScore + matchBonus, 100);
}

/**
 * Parser principal - convierte lenguaje natural en intent estructurado
 */
export function parseIntent(prompt: string, manualTarget?: string): ParsedIntent {
  const lowerPrompt = prompt.toLowerCase();
  
  // 1. Detectar target
  const target = manualTarget || extractTarget(prompt);
  
  // 2. Calcular scores para cada herramienta
  const toolScores: Record<string, number> = {};
  for (const [tool, config] of Object.entries(TOOL_PATTERNS)) {
    toolScores[tool] = calculateToolScore(prompt, config);
  }
  
  // 3. Seleccionar la herramienta con mayor score
  const bestTool = Object.entries(toolScores)
    .sort(([, a], [, b]) => b - a)[0];
  
  const [selectedTool, confidence] = bestTool;
  const toolConfig = TOOL_PATTERNS[selectedTool];
  
  // 4. Detectar tipo de escaneo
  const scanType = detectScanType(prompt);
  
  // 5. Obtener flags según el tipo de escaneo
  const flags = toolConfig.scanTypes[scanType] || toolConfig.scanTypes[toolConfig.defaultScanType];
  
  // 6. Construir comando
  let command = '';
  if (target) {
    if (selectedTool === 'nmap' || selectedTool === 'rustscan') {
      command = `${toolConfig.baseCommand} ${flags.join(' ')} ${target}`;
    } else if (selectedTool === 'nikto') {
      command = `${toolConfig.baseCommand} -h ${target} ${flags.slice(1).join(' ')}`;
    } else if (selectedTool === 'sqlmap') {
      command = `${toolConfig.baseCommand} -u ${target} ${flags.slice(2).join(' ')}`;
    } else if (selectedTool === 'theharvester') {
      command = `${toolConfig.baseCommand} -d ${target} ${flags.slice(1).join(' ')}`;
    }
  }
  
  // 7. Generar explicación
  const explanation = generateExplanation(selectedTool, scanType, target, confidence);
  
  return {
    tool: selectedTool,
    target,
    scanType,
    flags,
    confidence,
    explanation,
    command: command || undefined
  };
}

/**
 * Genera una explicación human-friendly de la decisión
 */
function generateExplanation(
  tool: string, 
  scanType: string, 
  target: string | null, 
  confidence: number
): string {
  const confidenceLevel = confidence > 80 ? 'alta' : confidence > 50 ? 'media' : 'baja';
  
  const explanations: Record<string, string> = {
    nmap: `Detecté que quieres escanear puertos y servicios con Nmap. Tipo de escaneo: ${scanType}.`,
    nikto: `Detecté que quieres escanear un servidor web con Nikto. Tipo de escaneo: ${scanType}.`,
    sqlmap: `Detecté que quieres buscar vulnerabilidades SQL con SQLMap. Tipo de escaneo: ${scanType}.`,
    rustscan: `Detecté que quieres un escaneo rápido de puertos con RustScan. Tipo de escaneo: ${scanType}.`,
    theharvester: `Detecté que quieres recolectar información OSINT con TheHarvester. Tipo de escaneo: ${scanType}.`
  };
  
  let explanation = explanations[tool] || `Herramienta detectada: ${tool}`;
  
  if (!target) {
    explanation += ' ⚠️ No se detectó un objetivo específico. Por favor, proporciona una IP o dominio.';
  } else {
    explanation += ` Objetivo: ${target}.`;
  }
  
  explanation += ` (Confianza: ${confidenceLevel} - ${Math.round(confidence)}%)`;
  
  return explanation;
}

/**
 * Valida si un target es seguro para escanear
 */
export function validateTarget(target: string): { valid: boolean; reason?: string } {
  if (!target) {
    return { valid: false, reason: 'No se proporcionó un objetivo' };
  }
  
  // Validar que no sean IPs privadas (a menos que sea explícito)
  const privateIPPatterns = [
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^127\./,
    /^localhost$/i
  ];
  
  const isPrivateIP = privateIPPatterns.some(pattern => pattern.test(target));
  
  if (isPrivateIP) {
    return { 
      valid: true, 
      reason: '⚠️ Advertencia: Este es un target de red privada. Asegúrate de tener autorización.' 
    };
  }
  
  return { valid: true };
}

/**
 * Ejemplos de prompts sugeridos
 */
export const SUGGESTED_PROMPTS = [
  {
    text: "Scan {target} for open ports and services",
    category: "Network",
    tool: "nmap"
  },
  {
    text: "Quick vulnerability scan on {target}",
    category: "Vulnerability",
    tool: "nmap"
  },
  {
    text: "Find all open web ports on {target}",
    category: "Web",
    tool: "nmap"
  },
  {
    text: "Check if {target} is vulnerable to SQL injection",
    category: "Web",
    tool: "sqlmap"
  },
  {
    text: "Stealth scan {target} without being detected",
    category: "Network",
    tool: "nmap"
  },
  {
    text: "Scan web server {target} for vulnerabilities",
    category: "Web",
    tool: "nikto"
  },
  {
    text: "Fast port scan on {target}",
    category: "Network",
    tool: "rustscan"
  },
  {
    text: "Find email addresses and subdomains for {target}",
    category: "OSINT",
    tool: "theharvester"
  }
];
