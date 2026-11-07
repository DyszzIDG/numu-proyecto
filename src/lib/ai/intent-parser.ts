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
        keywords: ['nmap', 'scan', 'escanear', 'escaneo', 'port', 'puerto', 'puertos', 'open', 'service', 'servicios', 'host', 'network', 'red', 'ping', 'tcp', 'udp', 'abiertos'],
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
        keywords: ['nikto', 'web', 'http', 'https', 'website', 'webapp', 'server', 'ssl', 'tls', 'sitio', 'servidor', 'pagina', 'vulnerabilidades web', 'fallos web'],
        scanTypes: {
            quick: ['-h'],
            full: ['-h', '-Tuning', 'x'],
            ssl: ['-h', '-ssl']
        },
        defaultScanType: 'quick',
        baseCommand: 'nikto'
    },
    nuclei: {
        keywords: ['nuclei', 'template', 'plantilla', 'cve', 'cves', 'vulnerability', 'vulnerabilidades', 'exploits', 'automaton', 'modern'],
        scanTypes: {
            quick: ['-t', 'cves/'],
            full: ['-t', 'cves/', '-t', 'vulnerabilities/'],
            critical: ['-s', 'critical']
        },
        defaultScanType: 'quick',
        baseCommand: 'nuclei'
    },
    feroxbuster: {
        keywords: ['feroxbuster', 'dir', 'directory', 'directorios', 'path', 'rutas', 'brute force', 'fuerza bruta', 'url', 'fuzz', 'escondidos', 'ocultos', 'carpetas'],
        scanTypes: {
            quick: ['--depth', '1'],
            full: ['--depth', '2', '--wordlist', 'common.txt'],
            recursive: ['--depth', '3']
        },
        defaultScanType: 'quick',
        baseCommand: 'feroxbuster'
    },
    zap: {
        keywords: ['zap', 'owasp', 'proxy', 'spider', 'crawl', 'araña', 'zaproxy', 'owasp top 10'],
        scanTypes: {
            quick: ['-cmd', '-quickurl'],
            full: ['-cmd', '-quickurl', '-quickprogress']
        },
        defaultScanType: 'quick',
        baseCommand: 'zap-cli'
    },
    testssl: {
        keywords: ['testssl', 'ssl', 'tls', 'certificate', 'certificado', 'certificados', 'encrypt', 'cipher', 'cifrado', 'seguridad transport'],
        scanTypes: {
            quick: ['--fast'],
            full: ['--full'],
            vulnerability: ['--vulnerable']
        },
        defaultScanType: 'quick',
        baseCommand: 'testssl'
    },
    whatweb: {
        keywords: ['whatweb', 'tech', 'stack', 'technology', 'tecnologia', 'tecnologías', 'cms', 'framework', 'version', 'identificar', 'huella', 'fingerprint'],
        scanTypes: {
            quick: ['-v'],
            full: ['-a', '3', '-v']
        },
        defaultScanType: 'quick',
        baseCommand: 'whatweb'
    },
    theharvester: {
        keywords: ['theharvester', 'harvester', 'email', 'emails', 'correos', 'domain', 'dominio', 'subdomain', 'subdominios', 'osint', 'reconnaissance', 'recon', 'inteligencia'],
        scanTypes: {
            quick: ['-d', '-b', 'google'],
            full: ['-d', '-b', 'all']
        },
        defaultScanType: 'quick',
        baseCommand: 'theharvester'
    },
    sqlmap: {
        keywords: ['sqlmap', 'sql', 'injection', 'inyeccion', 'inyección', 'sqli', 'database', 'base de datos', 'dbms', 'tablas'],
        scanTypes: {
            quick: ['--batch', '--banner'],
            full: ['--batch', '--dbs'],
            aggressive: ['--batch', '--level=3', '--risk=2']
        },
        defaultScanType: 'quick',
        baseCommand: 'sqlmap'
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
        keywords: ['amass', 'subdomain', 'subdominios', 'enumerate', 'enumeration', 'asset', 'discovery', 'activos', 'superficie'],
        scanTypes: {
            passive: ['-passive'],
            active: ['-active'],
            quick: ['enum', '-d']
        },
        defaultScanType: 'passive',
        baseCommand: 'amass'
    },
    sublist3r: {
        keywords: ['sublist3r', 'subdomain', 'subdominio', 'subdominios', 'brute'],
        scanTypes: {
            quick: ['-d'],
            full: ['-d', '-b']
        },
        defaultScanType: 'quick',
        baseCommand: 'sublist3r'
    },
    dnsrecon: {
        keywords: ['dnsrecon', 'dns', 'zone', 'transfer', 'zona', 'transferencia', 'registros dns', 'mx', 'txt'],
        scanTypes: {
            quick: ['-d'],
            full: ['-d', '-a']
        },
        defaultScanType: 'quick',
        baseCommand: 'dnsrecon'
    },
    wfuzz: {
        keywords: ['wfuzz', 'fuzz', 'fuzzing', 'parameter', 'parametro', 'parametros', 'injection'],
        scanTypes: {
            quick: ['-c', '-z'],
            full: ['-c', '-z', '--hc', '404']
        },
        defaultScanType: 'quick',
        baseCommand: 'wfuzz'
    },
    commix: {
        keywords: ['commix', 'command', 'injection', 'comando', 'inyeccion', 'rce'],
        scanTypes: {
            quick: ['--url', '--batch'],
            full: ['--url', '--batch', '--all']
        },
        defaultScanType: 'quick',
        baseCommand: 'commix'
    },
    masscan: {
        keywords: ['masscan', 'fast', 'rapid', 'port', 'rapido', 'masivo', 'escaneo veloz'],
        scanTypes: {
            quick: ['-p80,443'],
            full: ['-p1-65535']
        },
        defaultScanType: 'quick',
        baseCommand: 'masscan'
    },
    gobuster: {
        keywords: ['gobuster', 'directory', 'directorios', 'dir', 'brute', 'directorio', 'fuerza bruta'],
        scanTypes: {
            quick: ['dir', '-u', '-w'],
            full: ['dir', '-u', '-w', '-x', 'php,html,js']
        },
        defaultScanType: 'quick',
        baseCommand: 'gobuster'
    },
    wpscan: {
        keywords: ['wpscan', 'wordpress', 'wp', 'plugin', 'plugins', 'theme', 'temas', 'user', 'usuario', 'cms'],
        scanTypes: {
            quick: ['--url', '-e', 'p,t,u'],
            full: ['--url', '-e', 'ap,at,u', '--plugins-detection', 'aggressive']
        },
        defaultScanType: 'quick',
        baseCommand: 'wpscan'
    },
    subfinder: {
        keywords: ['subfinder', 'subdomain', 'subdominios', 'discovery', 'passive', 'pasivo'],
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
    quick: ['quick', 'fast', 'rapid', 'basic', 'rapido', 'rápido', 'basico', 'básico', 'veloz', 'simple'],
    full: ['full', 'complete', 'comprehensive', 'deep', 'thorough', 'completo', 'profundo', 'exhaustivo', 'todo'],
    stealth: ['stealth', 'stealthy', 'hidden', 'quiet', 'undetected', 'sigiloso', 'oculto', 'silencioso'],
    vulnerability: ['vulnerability', 'vulnerabilities', 'vuln', 'exploit', 'cve', 'vulnerabilidad', 'vulnerabilidades', 'fallos', 'huecos'],
    service: ['service', 'services', 'version', 'banner', 'servicios', 'versiones'],
    aggressive: ['aggressive', 'intense', 'maximum', 'agresivo', 'intenso', 'maximo', 'máximo']
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
 * Calcula el score de coincidencia para una herramienta específica
 */
function calculateToolScore(toolKey: string, prompt: string, toolConfig: ToolPattern): number {
    const lowerPrompt = prompt.toLowerCase();
    const matches = toolConfig.keywords.filter(keyword =>
        lowerPrompt.includes(keyword)
    );

    if (matches.length === 0) return 0;

    // Bonus si el nombre exacto de la herramienta está en el prompt
    const exactMatch = lowerPrompt.includes(toolKey);
    const exactBonus = exactMatch ? 50 : 0;

    // Ponderación por palabras clave coincidentes
    const matchScore = Math.min(matches.length * 30, 60);
    const multiMatchBonus = matches.length > 1 ? 20 : 0;

    return Math.min(matchScore + multiMatchBonus + exactBonus, 100);
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
        toolScores[tool] = calculateToolScore(tool, prompt, config);
    }

    // 3. Seleccionar la herramienta con mayor score
    const bestTool = Object.entries(toolScores)
        .sort(([, a], [, b]) => b - a)[0];

    const [selectedTool, rawConfidence] = bestTool;
    const toolConfig = TOOL_PATTERNS[selectedTool] || TOOL_PATTERNS.nmap;

    // 4. Detectar tipo de escaneo
    const scanType = detectScanType(prompt);

    // 5. Obtener flags según el tipo de escaneo
    const flags = toolConfig.scanTypes[scanType] || toolConfig.scanTypes[toolConfig.defaultScanType];

    // 6. Construir comando (Simulado para display)
    const command = buildCommand(selectedTool, target, flags, scanType);

    // 7. Generar explicación
    const confidence = Math.max(Math.round(rawConfidence), 60); // Min 60 if matched
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
 * Parser con herramienta manual - bypass del AI selection
 */
export function parseIntentWithManualTool(tool: string, target: string, scanType?: string): ParsedIntent {
    const toolConfig = TOOL_PATTERNS[tool];

    if (!toolConfig) {
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
        confidence: 100,
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
        sqlmap: (t, f) => `sqlmap -u "${t}" ${f.join(' ')}`,
        'recon-ng': (t, f) => `recon-ng -w ${t}`,
        amass: (t, f) => `amass enum -d ${t} ${f.includes('-passive') ? '-passive' : ''}`,
        sublist3r: (t, f) => `sublist3r -d ${t} ${f.slice(1).join(' ')}`,
        dnsrecon: (t, f) => `dnsrecon -d ${t} ${f.slice(1).join(' ')}`,
        wfuzz: (t, f) => `wfuzz ${f.join(' ')} ${t}/FUZZ`,
        commix: (t, f) => `commix --url="${t}" ${f.slice(1).join(' ')}`,
        masscan: (t, f) => `masscan ${t} ${f.join(' ')} --rate=1000`,
        gobuster: (t, f) => `gobuster dir -u ${t} -w /usr/share/wordlists/dirb/common.txt`,
        wpscan: (t, f) => `wpscan --url ${t} ${f.join(' ')}`,
        subfinder: (t, f) => `subfinder -d ${t} ${f.join(' ')}`,
        yara: (t, f) => `yara ${f.join(' ')} ${t}`,
        hping3: (t, f) => `hping3 ${f.join(' ')} ${t}`
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
    const explanations: Record<string, string> = {
        nmap: `Detecté que quieres escanear puertos y topología de red con Nmap.`,
        nikto: `Detecté que quieres buscar vulnerabilidades web con Nikto.`,
        nuclei: `Detecté que quieres un escaneo moderno de vulnerabilidades y CVEs con Nuclei.`,
        feroxbuster: `Detecté que quieres descubrir directorios y rutas ocultas con Feroxbuster.`,
        zap: `Detecté que quieres usar OWASP ZAP para un análisis web profundo.`,
        testssl: `Detecté que quieres analizar la configuración SSL/TLS con TestSSL.`,
        whatweb: `Detecté que quieres identificar tecnologías web con WhatWeb.`,
        theharvester: `Detecté que quieres inteligencia OSINT (emails, dominios) con TheHarvester.`,
        sqlmap: `Detecté que quieres evaluar inyecciones SQL en la base de datos con SQLMap.`,
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
    },
    {
        text: "Buscar SQL injection en la aplicación",
        category: "Database",
        tool: "sqlmap"
    }
];
