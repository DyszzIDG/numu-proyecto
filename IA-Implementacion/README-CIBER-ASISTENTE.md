# 🤖 Ciber-Asistente IA - Guía de Implementación

## 📋 Resumen

El **Ciber-Asistente IA** convierte lenguaje natural en comandos técnicos de herramientas de ciberseguridad (Nmap, Nikto, SQLMap, etc.).

**Entrada:** "Scan numu.group for open ports and services"  
**Salida:** `nmap -sV -F numu.group`

---

## 🏗️ Arquitectura

### Estrategia Híbrida (Recomendada):
1. **Pattern Matching** (80% de casos) - Gratis, instantáneo
2. **Claude API** (20% casos complejos) - Inteligente, robusto

### Flujo:
```
User Input → Pattern Matching → ¿Confianza > 50%?
                                      ↓ SÍ
                                   Resultado
                                      ↓ NO
                              Claude API Fallback
```

---

## 📁 Archivos Proporcionados

```
1. intent-parser.ts             # Pattern matching engine
2. claude-fallback.ts           # Claude API integration
3. CiberAsistenteIA.tsx         # UI Component
4. analyze-intent-route.ts      # API Endpoint
5. ciber-asistente-arquitectura.md  # Documentación técnica
```

---

## 🚀 Instalación Paso a Paso

### 1️⃣ Copiar Archivos

```bash
# Desde la raíz de tu proyecto NUMU:

# Lógica de parseo
cp intent-parser.ts src/lib/ai/intent-parser.ts
cp claude-fallback.ts src/lib/ai/claude-fallback.ts

# Componente UI
cp CiberAsistenteIA.tsx src/components/ai/CiberAsistenteIA.tsx

# API endpoint
mkdir -p src/app/api/ai/analyze-intent
cp analyze-intent-route.ts src/app/api/ai/analyze-intent/route.ts
```

### 2️⃣ Instalar Dependencias

```bash
# Si vas a usar Claude API (recomendado para casos complejos)
npm install @anthropic-ai/sdk

# O si prefieres OpenAI
npm install openai
```

### 3️⃣ Configurar Variables de Entorno

```bash
# .env.local

# Solo si usas Claude API fallback (opcional)
ANTHROPIC_API_KEY=tu_api_key_aqui

# O si usas OpenAI
# OPENAI_API_KEY=tu_api_key_aqui
```

### 4️⃣ Crear la Ruta en tu App

```typescript
// src/app/dashboard/unified-scan/page.tsx

import CiberAsistenteIA from '@/components/ai/CiberAsistenteIA';

export default function UnifiedScanPage() {
  return (
    <div>
      <CiberAsistenteIA />
    </div>
  );
}
```

### 5️⃣ Probar

```bash
npm run dev

# Navega a:
http://localhost:3100/dashboard/unified-scan
```

---

## 🧪 Testing

### Probar Pattern Matching (Sin API):

```typescript
// test-parser.ts
import { parseIntent } from '@/lib/ai/intent-parser';

const tests = [
  "Scan numu.group for open ports",
  "Quick vulnerability scan on 192.168.1.1",
  "Find SQL injection on example.com/login",
  "Check if example.com has open web ports"
];

tests.forEach(prompt => {
  const result = parseIntent(prompt);
  console.log(`Prompt: ${prompt}`);
  console.log(`Tool: ${result.tool} (${result.confidence}%)`);
  console.log(`Command: ${result.command}\n`);
});
```

Ejecutar:
```bash
npx tsx test-parser.ts
```

---

## 🎯 Funcionalidades Implementadas

### ✅ Pattern Matching Engine
- Detecta 5 herramientas: nmap, nikto, sqlmap, rustscan, theharvester
- Extrae targets: IPs, dominios, URLs
- Identifica tipos de escaneo: quick, full, stealth, vulnerability
- Score de confianza 0-100%

### ✅ UI Completa
- Input de lenguaje natural
- Target opcional
- Prompts sugeridos
- Preview del comando generado
- Indicador de confianza
- Detalles técnicos expandibles

### ✅ Validación de Seguridad
- Detecta IPs privadas
- Warning para targets sensibles
- Prevención de command injection

### ✅ Claude API Fallback (Opcional)
- Se activa cuando confianza < 50%
- Maneja casos complejos
- Function calling nativo
- Explicaciones detalladas

---

## 🔧 Personalización

### Agregar Nueva Herramienta

Edita `intent-parser.ts`:

```typescript
const TOOL_PATTERNS: Record<string, ToolPattern> = {
  // ... herramientas existentes
  
  wpscan: {  // Nueva herramienta
    keywords: ['wordpress', 'wp', 'cms', 'plugin', 'theme'],
    scanTypes: {
      quick: ['--url', '--enumerate', 'p'],
      full: ['--url', '--enumerate', 'ap,at,cb,dbe']
    },
    defaultScanType: 'quick',
    baseCommand: 'wpscan'
  }
};
```

### Agregar Prompt Sugerido

Edita `CiberAsistenteIA.tsx`:

```typescript
const SUGGESTED_PROMPTS = [
  // ... prompts existentes
  
  {
    text: "Scan WordPress site example.com for vulnerabilities",
    icon: "🔌",
    category: "CMS"
  }
];
```

### Cambiar Umbral de Confianza para Claude

Edita `analyze-intent-route.ts`:

```typescript
// Cambiar de 50% a 70%
if (result.confidence < 70) {
  // Llamar a Claude API
}
```

---

## 💰 Costos

### Pattern Matching:
- **Costo:** $0.00 (100% gratis)
- **Latencia:** ~50ms
- **Cobertura:** 80% de casos típicos

### Claude API (Fallback):
- **Costo:** ~$0.01 por request
- **Latencia:** ~2-3 segundos
- **Cobertura:** 100% de casos

### Estimación Mensual:
- 1000 requests/mes
- 800 con pattern matching = $0
- 200 con Claude API = $2
- **Total: ~$2/mes**

---

## 🐛 Troubleshooting

### Error: "Module not found: Can't resolve '@/lib/ai/intent-parser'"
```bash
# Verifica que el archivo existe:
ls src/lib/ai/intent-parser.ts

# Verifica tu tsconfig.json tiene el alias @:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Pattern Matching no detecta bien
```typescript
// Aumenta keywords en TOOL_PATTERNS
nmap: {
  keywords: [
    'scan', 'port', 'open', 'service',
    // Agrega más sinónimos:
    'network', 'host', 'ping', 'check', 'test'
  ]
}
```

### Claude API no responde
```bash
# Verifica la API key:
echo $ANTHROPIC_API_KEY

# Revisa los logs:
console.log('Claude API response:', message);
```

### Comando generado es incorrecto
```typescript
// Ajusta la lógica en parseIntent()
// O mejora el prompt del system message para Claude
```

---

## 📈 Roadmap

### Fase 1 (Actual):
- ✅ Pattern matching básico
- ✅ UI funcional
- ✅ Claude API fallback

### Fase 2 (Próximos pasos):
- [ ] Historial de escaneos con IA
- [ ] Modo "conversacional" (chat)
- [ ] Recomendaciones inteligentes basadas en resultados
- [ ] Auto-corrección de comandos

### Fase 3 (Futuro):
- [ ] Fine-tuning de modelo custom
- [ ] Multi-tool orchestration
- [ ] Reportes automáticos generados por IA
- [ ] Integración con agentes autónomos

---

## 🤝 Integración con Sistema Existente

### Conectar con tu Tool Execution:

```typescript
// En CiberAsistenteIA.tsx

const handleExecute = async () => {
  if (!result?.command) return;
  
  // Llamar a tu sistema de ejecución existente
  const response = await fetch('/api/tools/execute', {
    method: 'POST',
    body: JSON.stringify({
      toolName: result.tool,
      target: result.target,
      command: result.command,
      generatedBy: 'ai',  // Flag para tracking
      aiPrompt: prompt    // Guardar el prompt original
    })
  });
  
  // Redirigir a resultados
  if (response.ok) {
    const { executionId } = await response.json();
    router.push(`/dashboard/tools/results/${executionId}`);
  }
};
```

### Guardar en Base de Datos:

Ya tienes el modelo `ToolExecution` en Prisma. Agregar campos:

```prisma
model ToolExecution {
  // ... campos existentes
  
  generatedBy  String   @default("manual")  // "manual" | "ai"
  aiPrompt     String?  @db.Text            // Prompt original del usuario
  aiConfidence Int?                          // Score de confianza
}
```

---

## 📚 Recursos Adicionales

- [Anthropic Claude API Docs](https://docs.anthropic.com)
- [Tool Use Guide](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)
- [Nmap Reference](https://nmap.org/book/man.html)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

---

## 💬 Soporte

Si tienes dudas:
1. Revisa este README
2. Consulta `ciber-asistente-arquitectura.md`
3. Prueba los ejemplos de testing
4. Revisa los logs de la consola del navegador

---

**¡Listo para revolucionar la forma en que tus usuarios escanean!** 🚀
