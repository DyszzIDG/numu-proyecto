# 🤖 Arquitectura del Ciber-Asistente IA

## 📋 Análisis de lo que veo en la imagen

### Funcionalidad Actual:
1. **Input en lenguaje natural**: "Describe tu objetivo en lenguaje natural. La IA configurará el escaneo."
2. **Ejemplo**: "Scan numu.group for open ports and services"
3. **Detección de herramienta**: "Configurando NMAP"
4. **Objetivo opcional**: "192.168.1.1" (opcional)
5. **Prompts sugeridos**:
   - "Scan numu.group for open ports and services"
   - "Quick vulnerability scan on 192.168.1.1"
   - "Find all open web ports on example.com"
6. **Botón**: "GENERAR ESCANEO CON IA"
7. **Historial**: Lista de escaneos previos en el sidebar

---

## 🎯 Objetivos del Sistema

### Funcionalidades Core:
1. **NLP (Natural Language Processing)**: Interpretar intención del usuario
2. **Tool Selection**: Seleccionar la herramienta correcta (Nmap, Nikto, SQLMap, etc.)
3. **Command Generation**: Generar el comando técnico correcto
4. **Parameter Extraction**: Extraer target, opciones, flags
5. **Validation**: Verificar que el comando es válido y seguro

---

## 🏗️ Arquitectura Técnica

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React/Next.js)                  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Ciber-Asistente IA Component                          │ │
│  │                                                         │ │
│  │  1. User Input (textarea)                              │ │
│  │  2. Optional Target (input)                            │ │
│  │  3. Suggested Prompts (buttons)                        │ │
│  │  4. Generate Button                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Display Results                                        │ │
│  │  • Detected Tool                                        │ │
│  │  • Generated Command                                    │ │
│  │  • Confidence Score                                     │ │
│  │  • Edit/Confirm buttons                                │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ POST /api/ai/analyze-intent
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API (Next.js)                     │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  /api/ai/analyze-intent                                │ │
│  │                                                         │ │
│  │  Input: { prompt: string, target?: string }            │ │
│  │  Output: {                                             │ │
│  │    tool: string,                                       │ │
│  │    command: string,                                    │ │
│  │    parameters: object,                                 │ │
│  │    confidence: number,                                 │ │
│  │    explanation: string                                 │ │
│  │  }                                                      │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  AI Intent Parser                                       │ │
│  │                                                         │ │
│  │  1. Extract keywords                                    │ │
│  │  2. Detect scan type                                    │ │
│  │  3. Identify tool                                       │ │
│  │  4. Parse parameters                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Command Generator (de tu TOOLS_IMPLEMENTATION.md)     │ │
│  │                                                         │ │
│  │  • nmap-generator.ts                                   │ │
│  │  • nikto-generator.ts                                  │ │
│  │  • sqlmap-generator.ts                                 │ │
│  │  • universal-generator.ts                              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              OPCIÓN 1: OpenAI API (GPT-4)                    │
│                                                              │
│  • Usa function calling para estructurar output             │
│  • Más inteligente, maneja casos edge                       │
│  • Costo: ~$0.03 por request                                │
└─────────────────────────────────────────────────────────────┘

                           OR

┌─────────────────────────────────────────────────────────────┐
│          OPCIÓN 2: Regex + Pattern Matching (Free)          │
│                                                              │
│  • Keywords: "scan", "ports", "vulnerability", "web"        │
│  • Tool mapping: ports → nmap, web → nikto, sql → sqlmap    │
│  • Regex para extraer targets (IPs, domains)                │
│  • 100% gratis, más rápido                                  │
└─────────────────────────────────────────────────────────────┘

                           OR

┌─────────────────────────────────────────────────────────────┐
│         OPCIÓN 3: Claude API (Anthropic) - RECOMENDADO      │
│                                                              │
│  • Tool use nativo (function calling)                       │
│  • Mejor comprensión de contexto técnico                    │
│  • Más económico que GPT-4                                  │
│  • Soporte para análisis de seguridad                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧠 Estrategia de IA: 3 Opciones

### OPCIÓN 1: OpenAI GPT-4 (Recomendado para MVP rápido)

**Pros:**
- Setup rápido (30 minutos)
- Maneja cualquier prompt
- Function calling integrado
- Excelente comprensión de contexto

**Cons:**
- Costo: $0.03 USD por request
- Requiere API key
- Latencia ~2-3 segundos

**Implementación:**
```typescript
const response = await openai.chat.completions.create({
  model: "gpt-4-turbo",
  messages: [
    {
      role: "system",
      content: "Eres un experto en ciberseguridad que convierte lenguaje natural en comandos de herramientas."
    },
    {
      role: "user",
      content: prompt
    }
  ],
  functions: [
    {
      name: "generate_scan_command",
      description: "Genera un comando de escaneo de seguridad",
      parameters: {
        type: "object",
        properties: {
          tool: { type: "string", enum: ["nmap", "nikto", "sqlmap", "rustscan"] },
          target: { type: "string" },
          scan_type: { type: "string" },
          flags: { type: "array", items: { type: "string" } }
        }
      }
    }
  ]
});
```

---

### OPCIÓN 2: Pattern Matching + Keywords (Gratis, más control)

**Pros:**
- 100% gratis
- Respuesta instantánea (<100ms)
- Control total sobre la lógica
- Sin dependencias externas

**Cons:**
- Menos flexible
- Requiere mantenimiento manual
- No maneja casos edge complejos

**Implementación:**
```typescript
const intentPatterns = {
  nmap: {
    keywords: ['scan', 'port', 'open', 'service', 'host', 'network'],
    scanTypes: {
      'quick': ['-sV'],
      'full': ['-p-', '-sV', '-sC'],
      'stealth': ['-sS', '-sV'],
      'vulnerability': ['--script', 'vuln']
    }
  },
  nikto: {
    keywords: ['web', 'http', 'website', 'webapp', 'ssl'],
    flags: ['-h']
  },
  sqlmap: {
    keywords: ['sql', 'injection', 'database', 'form'],
    flags: ['-u', '--batch']
  }
};

function parseIntent(prompt: string) {
  const lowerPrompt = prompt.toLowerCase();
  
  // Detect tool
  for (const [tool, config] of Object.entries(intentPatterns)) {
    const matches = config.keywords.filter(kw => lowerPrompt.includes(kw));
    if (matches.length >= 2) {
      return { tool, confidence: matches.length / config.keywords.length };
    }
  }
}
```

---

### OPCIÓN 3: Claude API (Anthropic) - **RECOMENDADO**

**Pros:**
- Tool use nativo (mejor que GPT-4 para esto)
- Comprende contexto técnico profundo
- Más económico (~40% vs GPT-4)
- Respuestas estructuradas

**Cons:**
- Setup un poco más complejo
- Requiere API key de Anthropic

**Implementación:**
```typescript
const message = await anthropic.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  tools: [
    {
      name: "generate_security_scan",
      description: "Genera un comando de escaneo de seguridad basado en la intención del usuario",
      input_schema: {
        type: "object",
        properties: {
          tool: {
            type: "string",
            enum: ["nmap", "nikto", "sqlmap", "rustscan", "theharvester"],
            description: "La herramienta de seguridad a usar"
          },
          target: {
            type: "string",
            description: "El objetivo del escaneo (IP, dominio, URL)"
          },
          scan_type: {
            type: "string",
            description: "Tipo de escaneo (quick, full, stealth, vulnerability)"
          },
          additional_flags: {
            type: "array",
            items: { type: "string" },
            description: "Flags adicionales para el comando"
          }
        },
        required: ["tool", "target", "scan_type"]
      }
    }
  ],
  messages: [
    {
      role: "user",
      content: prompt
    }
  ]
});
```

---

## 💡 MI RECOMENDACIÓN

### Para MVP (1-2 semanas):
**Usa OPCIÓN 2 (Pattern Matching) + OPCIÓN 3 (Claude API) en fallback**

**Por qué:**
1. **80% de casos** = Pattern matching simple (gratis, rápido)
2. **20% de casos complejos** = Claude API (inteligente, económico)
3. **Best of both worlds**: Rapidez + Inteligencia

**Flujo:**
```
User Input
    ↓
Pattern Matching intenta parsear (50ms)
    ↓
¿Confidence > 80%? ━━━ SÍ ━━→ Usar resultado
    ↓ NO
Claude API (2s) ━━→ Resultado inteligente
```

---

## 📦 Estructura de Archivos Propuesta

```
src/
├── lib/
│   └── ai/
│       ├── intent-parser.ts          # Pattern matching
│       ├── claude-fallback.ts        # Claude API
│       ├── command-builder.ts        # Construye comandos finales
│       └── validation.ts             # Valida seguridad
│
├── app/
│   └── api/
│       └── ai/
│           ├── analyze-intent/
│           │   └── route.ts          # Endpoint principal
│           └── execute-scan/
│               └── route.ts          # Ejecuta el comando
│
└── components/
    └── ai/
        ├── CiberAsistenteIA.tsx      # UI principal
        ├── SuggestedPrompts.tsx      # Prompts sugeridos
        └── CommandPreview.tsx        # Preview del comando
```

---

## 🎯 Features Esenciales

### 1. Intent Detection (debe detectar):
- **Tool**: nmap, nikto, sqlmap, rustscan, theharvester
- **Target**: IP, domain, URL, CIDR
- **Scan Type**: quick, full, stealth, vulnerability, service
- **Additional Options**: ports, timing, output format

### 2. Suggested Prompts (plantillas):
```javascript
const suggestedPrompts = [
  "Scan {target} for open ports and services",
  "Quick vulnerability scan on {target}",
  "Find all open web ports on {target}",
  "Check if {target} is vulnerable to SQL injection",
  "Stealth scan {target} without being detected",
  "Enumerate subdomains of {target}",
  "Test SSL/TLS configuration of {target}"
];
```

### 3. Safety Features:
- **Target validation**: No permitir IPs privadas sin confirmación
- **Rate limiting**: Max 10 scans/hour para usuarios free
- **Command sanitization**: Prevenir command injection
- **Scope check**: Confirmar que el usuario tiene permiso

---

## 🚀 Plan de Implementación (2 semanas)

### Semana 1:
- **Día 1-2**: Pattern matching engine
- **Día 3-4**: UI del asistente
- **Día 5**: Integración con generadores existentes

### Semana 2:
- **Día 1-2**: Claude API fallback
- **Día 3**: Validación y seguridad
- **Día 4**: Testing
- **Día 5**: Polish y deploy

---

¿Quieres que desarrolle alguna parte específica en código?
¿O prefieres ver primero un prototipo funcional del pattern matching?
