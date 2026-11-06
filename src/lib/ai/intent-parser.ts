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
// Sincronizado con src/app/api/tools/execute/route.ts
const TOOL_PATTERNS: Record<string, ToolPattern> = {
    nmap: {
        keywords: ['scan', 'port', 'open', 'service', 'host', 'network', 'ping', 'tcp', 'udp', 'puerto', 'red', 'servicios', 'abiertos'],
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
        keywords: ['web', 'http', 'https', 'website', 'webapp', 'server', 'ssl', 'tls', 'sitio', 'servidor', 'pagina'],
        scanTypes: {
            quick: ['-h'],
            full: ['-h', '-Tuning', 'x'],
            ssl: ['-h', '-ssl']
        },
        defaultScanType: 'quick',
        baseCommand: 'nikto'
    },
    nuclei: {
        keywords: ['nuclei', 'template', 'cve', 'vulnerability', 'exploits', 'automaton', 'modern', 'vulnerabilidades', 'plantilla'],
        scanTypes: {
            quick: ['-t', 'cves/'],
            full: ['-t', 'cves/', '-t', 'vulnerabilities/'],
            critical: ['-s', 'critical']
        },
        defaultScanType: 'quick',
        baseCommand: 'nuclei'
    },
    feroxbuster: {
        keywords: ['dir', 'directory', 'path', 'brute force', 'url', 'fuzz', 'directorios', 'rutas', 'fuerza bruta', 'escondidos'],
        scanTypes: {
            quick: ['--depth', '1'],
            full: ['--depth', '2', '--wordlist', 'common.txt'],
            recursive: ['--depth', '3']
        },
        defaultScanType: 'quick',
        baseCommand: 'feroxbuster'
    },
    zap: {
        keywords: ['zap', 'owasp', 'proxy', 'spider', 'crawl', 'araña', 'zaproxy'],
        scanTypes: {
            quick: ['-cmd', '-quickurl'],
            full: ['-cmd', '-quickurl', '-quickprogress']
        },
        defaultScanType: 'quick',
        baseCommand: 'zap-cli'
    },
    testssl: {
        keywords: ['ssl', 'tls', 'certificate', 'encrypt', 'cipher', 'certificado', 'cifrado', 'seguridad transport'],
        scanTypes: {
            quick: ['--fast'],
            full: ['--full'],
            vulnerability: ['--vulnerable']
        },
        defaultScanType: 'quick',
        baseCommand: 'testssl'
    },
    whatweb: {
        keywords: ['tech', 'stack', 'technology', 'cms', 'framework', 'version', 'tecnologia', 'identificar', 'huella'],
        scanTypes: {
            quick: ['-v'],
            full: ['-a', '3', '-v']
        },
        defaultScanType: 'quick',
        baseCommand: 'whatweb'
    },
    theharvester: {
        keywords: ['email', 'domain', 'subdomain', 'osint', 'reconnaissance', 'recon', 'correos', 'dominios', 'inteligencia'],
        scanTypes: {
            quick: ['-d', '-b', 'google'],
            full: ['-d', '-b', 'all']
        },
        defaultScanType: 'quick',
        baseCommand: 'theharvester'
    },
    'recon-ng': {
        keywords: ['recon-ng', 'module', 'workspace', 'investigation', 'investigacion', 'modulos'],
        scanTypes: {
            quick: ['-w', 'default'],
            full: ['-w', 'campaign']
        },
        defaultScanType: 'quick',
        baseCommand: 'recon-ng'
    },
    amass: {
        keywords: ['amass', 'subdomain', 'enumerate', 'enumeration', 'asset', 'discovery', 'subdominio', 'enumerar', 'activos', 'superficie'],
        scanTypes: {
            passive: ['-passive'],
            active: ['-active'],
            quick: ['enum', '-d']
        },
        defaultScanType: 'passive',
        baseCommand: 'amass'
    },
    sublist3r: {
        keywords: ['sublist3r', 'subdomain', 'subdominio', 'brute'],
        scanTypes: {
            quick: ['-d'],
            full: ['-d', '-b']
        },
        defaultScanType: 'quick',
        baseCommand: 'sublist3r'
    },
    dnsrecon: {
        keywords: ['dnsrecon', 'dns', 'zone', 'transfer', 'zona', 'transferencia'],
        scanTypes: {
            quick: ['-d'],
            full: ['-d', '-a']
        },
        defaultScanType: 'quick',
        baseCommand: 'dnsrecon'
    },
    wfuzz: {
        keywords: ['wfuzz', 'fuzz', 'parameter', 'parametro', 'injection'],
        scanTypes: {
            quick: ['-c', '-z'],
            full: ['-c', '-z', '--hc', '404']
        },
        defaultScanType: 'quick',
        baseCommand: 'wfuzz'
    },
    commix: {
        keywords: ['commix', 'command', 'injection', 'comando', 'inyeccion'],
        scanTypes: {
            quick: ['--url', '--batch'],
            full: ['--url', '--batch', '--all']
        },
        defaultScanType: 'quick',
        baseCommand: 'commix'
    },
    masscan: {
        keywords: ['masscan', 'fast', 'rapid', 'port', 'rapido', 'masivo'],
        scanTypes: {
            quick: ['-p80,443'],
            full: ['-p1-65535']
        },
        defaultScanType: 'quick',
        baseCommand: 'masscan'
    },
    gobuster: {
        keywords: ['gobuster', 'directory', 'dir', 'brute', 'directorio', 'fuerza'],
        scanTypes: {
            quick: ['dir', '-u', '-w'],
            full: ['dir', '-u', '-w', '-x', 'php,html,js']
        },
        defaultScanType: 'quick',
        baseCommand: 'gobuster'
    },
    wpscan: {
        keywords: ['wpscan', 'wordpress', 'wp', 'plugin', 'theme', 'user', 'usuario', 'cms'],
        scanTypes: {
            quick: ['--url', '-e', 'p,t,u'],
            full: ['--url', '-e', 'ap,at,u', '--plugins-detection', 'aggressive']
        },
        defaultScanType: 'quick',
        baseCommand: 'wpscan'
    },
    subfinder: {
        keywords: ['subfinder', 'subdomain', 'discovery', 'passive', 'subdominio'],
        scanTypes: {
            quick: ['-d'],
            full: ['-d', '-all']
        },
        defaultScanType: 'quick',
        baseCommand: 'subfinder'
    },
    yara: {
        keywords: ['yara', 'rule', 'malware', 'signature', 'pattern', 'regla', 'malicioso', 'firma', 'deteccion'],
        scanTypes: {
            quick: ['--version'],
            full: ['-r', '/rules/', '/target/']
        },
        defaultScanType: 'quick',
        baseCommand: 'yara'
    },
    hping3: {
        keywords: ['hping3', 'hping', 'packet', 'craft', 'syn', 'flood', 'paquete', 'tcp syn'],
        scanTypes: {
            quick: ['-c', '3', '-S'],
            full: ['-c', '10', '-S', '--flood']
        },
        defaultScanType: 'quick',
        baseCommand: 'hping3'
    }
};

// Palabras clave para tipos de escaneo (Español e Inglés)
const SCAN_TYPE_KEYWORDS: Record<string, string[]> = {
    quick: ['quick', 'fast', 'rapid', 'basic', 'rapido', 'basico', 'veloz', 'simple'],
    full: ['full', 'complete', 'comprehensive', 'deep', 'thorough', 'completo', 'profundo', 'exhaustivo', 'todo'],
    stealth: ['stealth', 'stealthy', 'hidden', 'quiet', 'undetected', 'sigiloso', 'oculto', 'silencioso'],
    vulnerability: ['vulnerability', 'vulnerabilities', 'vuln', 'exploit', 'cve', 'vulnerabilidad', 'fallos', 'huecos'],
    service: ['service', 'services', 'version', 'banner', 'servicios', 'versiones'],
    aggressive: ['aggressive', 'intense', 'maximum', 'agresivo', 'intenso', 'maximo']
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
    // Adjusted weight to be more sensitive
    const baseScore = (matches.length / toolConfig.keywords.length) * 150;

    // Bonus por múltiples matches
    const matchBonus = matches.length > 1 ? 20 : 0;

    // Bonus si el nombre de la herramienta está explícito
    const toolName = Object.keys(TOOL_PATTERNS).find(k => k === lowerPrompt || lowerPrompt.includes(k));
    const exactMatchBonus = toolName ? 50 : 0;

    return Math.min(baseScore + matchBonus + exactMatchBonus, 100);
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

    // 6. Construir comando (Simulado para display)
    const command = buildCommand(selectedTool, target, flags, scanType);

    // 7. Generar explicación
    const explanation = generateExplanation(selectedTool, scanType, target, confidence);

    return {
        tool: selectedTool,
        target,
        scanType,
        flags,
        confidence: Math.round(confidence), // Round confidence
        explanation,
        command: command || undefined
    };
}

/**
 * Parser con herramienta manual - bypass del AI selection
 */
export function parseIntentWithManualTool(tool: string, target: string, scanType?: string): ParsedIntent {
    const toolConfig = TOOL_PATTERNS[tool];

    if (!toolConfig) {
        // Fallback for unknown tools / tools not in pattern list yet
        return {
            tool: tool,
            target: target,
            scanType: 'manual',
            flags: [],
            confidence: 100,
            explanation: `Herramienta ${tool} seleccionada manualmente.`,
            command: `${tool} ${target}`
        };
    }

    const selectedScanType = scanType || toolConfig.defaultScanType;
    const flags = toolConfig.scanTypes[selectedScanType] || toolConfig.scanTypes[toolConfig.defaultScanType];
    const command = buildCommand(tool, target, flags, selectedScanType);
    const explanation = generateExplanation(tool, selectedScanType, target, 100);

    return {
        tool,
        target,
        scanType: selectedScanType,
        flags,
        confidence: 100, // Manual selection = 100% confidence
        explanation,
        command
    };
}

/**
 * Construye el comando para display
 */
function buildCommand(tool: string, target: string | null, flags: string[], scanType: string): string {
    if (!target) return '';

    const commandMap: Record<string, (t: string, f: string[]) => string> = {
        nmap: (t, f) => `nmap ${f.join(' ')} ${t}`,
        nikto: (t, f) => `nikto -h ${t} ${f.slice(1).join(' ')}`,
        nuclei: (t, f) => `nuclei -u ${t} ${f.join(' ')}`,
        feroxbuster: (t, f) => `feroxbuster -u ${t} ${f.join(' ')}`,
        zap: (t, f) => `zap-cli quick-scan -t ${t}`,
        testssl: (t, f) => `testssl ${f.join(' ')} ${t}`,
        whatweb: (t, f) => `whatweb ${f.join(' ')} ${t}`,
        theharvester: (t, f) => `theharvester -d ${t} ${f.slice(1).join(' ')}`,
        'recon-ng': (t, f) => `recon-ng -w ${t}`,
        amass: (t, f) => `amass enum -d ${t} ${f.includes('-passive') ? '-passive' : ''}`,
        sublist3r: (t, f) => `sublist3r -d ${t} ${f.slice(1).join(' ')}`,
        dnsrecon: (t, f) => `dnsrecon -d ${t} ${f.slice(1).join(' ')}`,
        wfuzz: (t, f) => `wfuzz ${f.join(' ')} ${t}/FUZZ`,
        commix: (t, f) => `commix --url="${t}" ${f.slice(1).join(' ')}`,
        masscan: (t, f) => `masscan ${t} ${f.join(' ')} --rate=1000`,
        gobuster: (t, f) => `gobuster dir -u ${t} -w /usr/share/wordlists/dirb/common.txt`,
        wpscan: (t, f) => `wpscan --url ${t} ${f.join(' ')}`,
        subfinder: (t, f) => `subfinder -d ${t} ${f.join(' ')}`
    };

    const builder = commandMap[tool];
    return builder ? builder(target, flags) : `${tool} ${target}`;
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
        nmap: `Detecté que quieres escanear puertos y topología de red con Nmap.`,
        nikto: `Detecté que quieres buscar vulnerabilidades web básicas con Nikto.`,
        nuclei: `Detecté que quieres un escaneo moderno de vulnerabilidades con Nuclei.`,
        feroxbuster: `Detecté que quieres descubrir directorios y rutas ocultas con Feroxbuster.`,
        zap: `Detecté que quieres usar OWASP ZAP para un análisis web profundo.`,
        testssl: `Detecté que quieres analizar la configuración SSL/TLS con TestSSL.`,
        whatweb: `Detecté que quieres identificar tecnologías web con WhatWeb.`,
        theharvester: `Detecté que quieres inteligencia OSINT (emails, dominios) con TheHarvester.`,
        'recon-ng': `Detecté que quieres realizar reconocimiento avanzado con Recon-ng.`,
        amass: `Detecté que quieres enumerar subdominios y mapear superficie de ataque con AMASS.`,
        sublist3r: `Detecté que quieres encontrar subdominios con Sublist3r.`,
        dnsrecon: `Detecté que quieres realizar reconocimiento DNS con DNSRecon.`,
        wfuzz: `Detecté que quieres hacer fuzzing de parámetros con Wfuzz.`,
        commix: `Detecté que quieres buscar inyecciones de comandos con Commix.`,
        masscan: `Detecté que quieres un escaneo masivo de puertos con Masscan.`,
        gobuster: `Detecté que quieres hacer fuerza bruta de directorios con Gobuster.`,
        wpscan: `Detecté que quieres escanear un sitio WordPress con WPScan.`,
        subfinder: `Detecté que quieres descubrir subdominios pasivamente con Subfinder.`,
        yara: `Detecté que quieres usar reglas YARA para detección de malware y patrones maliciosos.`,
        hping3: `Detecté que quieres construir y enviar paquetes TCP/IP custom con hping3.`
    };

    let explanation = explanations[tool] || `Herramienta detectada: ${tool}`;
    explanation += ` Modo: ${scanType}.`;

    if (!target) {
        explanation += ' ⚠️ Falta objetivo.';
    } else {
        explanation += ` Target: ${target}.`;
    }

    // explanation += ` (Confianza: ${confidenceLevel} - ${Math.round(confidence)}%)`;

    return explanation;
}

/**
 * Valida si un target es seguro para escanear
 */
export function validateTarget(target: string): { valid: boolean; reason?: string } {
    if (!target) {
        return { valid: false, reason: 'No se proporcionó un objetivo' };
    }

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
            reason: '⚠️ Advertencia: Red privada.'
        };
    }

    return { valid: true };
}

export const SUGGESTED_PROMPTS = [
    {
        text: "Escanear puertos de numu.group",
        category: "Red",
        tool: "nmap"
    },
    {
        text: "Buscar vulnerabilidades en example.com",
        category: "Vulns",
        tool: "nuclei"
    },
    {
        text: "Encontrar directorios ocultos en el sitio",
        category: "Web",
        tool: "feroxbuster"
    },
    {
        text: "Analizar certificado SSL de la web",
        category: "Crypto",
        tool: "testssl"
    },
    {
        text: "Ver qué tecnologías usa esta página",
        category: "Info",
        tool: "whatweb"
    },
    {
        text: "OSINT para encontrar correos del dominio",
        category: "OSINT",
        tool: "theharvester"
    }
];
