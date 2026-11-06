/**
 * Tool Configurations
 * Detailed parameter configurations for each security tool
 */

export interface ToolParameter {
    id: string;
    name: string;
    type: 'text' | 'number' | 'select' | 'boolean' | 'file' | 'textarea';
    required: boolean;
    default?: any;
    options?: string[]; // For select type
    validation?: {
        pattern?: string;
        min?: number;
        max?: number;
    };
    description: string;
    placeholder?: string;
    aiHint?: string; // Hint for AI about this parameter
}

export interface ToolExample {
    description: string;
    prompt: string; // For AI
    command: string; // Resulting command
    parameters?: Record<string, any>; // Parameter values for this example
}

export interface ToolConfig {
    id: string;
    name: string;
    description: string;
    category: string;
    parameters: ToolParameter[];
    examples: ToolExample[];
    outputFormat: 'text' | 'json' | 'xml' | 'html';
    estimatedDuration?: number; // In seconds
    requiresDocker: boolean;
    requiresApiKey: boolean;
    difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    documentationUrl?: string;
}

export const TOOL_CONFIGS: Record<string, ToolConfig> = {
    // ============================================
    // NMAP - Network Scanner
    // ============================================
    nmap: {
        id: 'nmap',
        name: 'Nmap',
        description: 'Network scanner for port discovery and service detection',
        category: 'Escaneo y Enumeración',
        requiresDocker: true,
        requiresApiKey: false,
        difficulty: 'beginner',
        outputFormat: 'text',
        estimatedDuration: 60,
        documentationUrl: 'https://nmap.org/book/man.html',
        parameters: [
            {
                id: 'target',
                name: 'Target',
                type: 'text',
                required: true,
                description: 'Domain, IP address, or range (e.g., numu.group, 192.168.1.1, 192.168.1.0/24)',
                placeholder: 'example.com or 192.168.1.1',
                validation: {
                    pattern: '^[a-zA-Z0-9./-]+$',
                },
                aiHint: 'Extract domain or IP address from user prompt',
            },
            {
                id: 'scanType',
                name: 'Scan Profile',
                type: 'select',
                required: true,
                default: 'custom',
                options: [
                    'quick (Fast Scan - Top 100 ports)',
                    'full (Full Scan - All 65535 ports)',
                    'vuln (Vulnerability Scan)',
                    'stealth (Stealth SYN Scan)',
                    'custom (Custom Configuration)',
                ],
                description: 'Select a scan profile or customize your own',
                aiHint: 'Use quick for fast check, full for comprehensive, vuln for security audit',
            },
            {
                id: 'ports',
                name: 'Specific Ports',
                type: 'text',
                required: false,
                default: '',
                description: 'Specific ports (e.g., 80,443) or range. Overrides profile default if Custom is selected.',
                placeholder: '80,443,8080 or 1-1000',
                aiHint: 'Specific ports to scan',
            },
            {
                id: 'serviceVersion',
                name: 'Service Version Detection',
                type: 'boolean',
                required: false,
                default: true,
                description: 'Probe open ports to determine service/version info (-sV)',
                aiHint: 'Enable service version detection',
            },
            {
                id: 'osDetection',
                name: 'OS Detection',
                type: 'boolean',
                required: false,
                default: false,
                description: 'Enable OS detection (-O)',
                aiHint: 'Enable OS detection',
            },
            {
                id: 'timing',
                name: 'Timing Template',
                type: 'select',
                required: false,
                default: '4',
                options: [
                    '0 (Paranoid)',
                    '1 (Sneaky)',
                    '2 (Polite)',
                    '3 (Normal)',
                    '4 (Aggressive)',
                    '5 (Insane)',
                ],
                description: 'Scan timing and performance (-T0 to -T5)',
                aiHint: 'Use 4 for standard/fast, 2 for stealth',
            },
            {
                id: 'scriptScan',
                name: 'Default Scripts',
                type: 'boolean',
                required: false,
                default: false,
                description: 'Run default NSE scripts (-sC)',
                aiHint: 'Enable default scripts',
            },
            {
                id: 'customArgs',
                name: 'Custom Arguments',
                type: 'text',
                required: false,
                description: 'Additional Nmap arguments (Advanced)',
                placeholder: '--script=auth',
                aiHint: 'Extra arguments',
            },
        ],
        examples: [
            {
                description: 'Quick scan of common ports',
                prompt: 'Quick scan of numu.group',
                command: 'nmap -T4 -F numu.group',
                parameters: {
                    target: 'numu.group',
                    scanType: 'quick',
                },
            },
            {
                description: 'Full vulnerability scan',
                prompt: 'Check numu.group for vulnerabilities',
                command: 'nmap -sV --script vuln -T4 numu.group',
                parameters: {
                    target: 'numu.group',
                    scanType: 'vuln',
                },
            },
        ],
    },

    // ============================================
    // NIKTO - Web Server Scanner
    // ============================================
    nikto: {
        id: 'nikto',
        name: 'Nikto',
        description: 'Web server scanner for vulnerabilities and misconfigurations',
        category: 'Explotación y Vulnerabilidades',
        requiresDocker: true,
        requiresApiKey: false,
        difficulty: 'beginner',
        outputFormat: 'text',
        estimatedDuration: 120,
        documentationUrl: 'https://github.com/sullo/nikto/wiki',
        parameters: [
            {
                id: 'host',
                name: 'Host',
                type: 'text',
                required: true,
                description: 'Target web server hostname or IP',
                placeholder: 'example.com',
                aiHint: 'Extract hostname from user prompt',
            },
            {
                id: 'port',
                name: 'Port',
                type: 'number',
                required: false,
                default: 80,
                validation: {
                    min: 1,
                    max: 65535,
                },
                description: 'Port number to scan',
                aiHint: 'Use 80 for HTTP, 443 for HTTPS',
            },
            {
                id: 'ssl',
                name: 'Use SSL/HTTPS',
                type: 'boolean',
                required: false,
                default: false,
                description: 'Use HTTPS instead of HTTP',
                aiHint: 'Enable if user mentions HTTPS or secure connection',
            },
            {
                id: 'tuning',
                name: 'Scan Tuning',
                type: 'select',
                required: false,
                options: [
                    'All tests',
                    '1 (Interesting files)',
                    '2 (Misconfigurations)',
                    '3 (Information disclosure)',
                    '4 (Injection vulnerabilities)',
                    '5 (Remote file retrieval)',
                    '6 (Denial of Service)',
                    '7 (Remote file upload)',
                    '8 (Command execution)',
                    '9 (SQL injection)',
                    'x (Reverse tuning - all except specified)',
                ],
                description: 'Focus scan on specific vulnerability types',
                aiHint: 'Use specific tuning if user mentions vulnerability type, otherwise all tests',
            },
        ],
        examples: [
            {
                description: 'Basic web server scan',
                prompt: 'Scan numu.group web server for vulnerabilities',
                command: 'nikto -h numu.group',
                parameters: {
                    host: 'numu.group',
                    port: 80,
                },
            },
        ],
    },

    // ============================================
    // THEHARVESTER - OSINT
    // ============================================
    theharvester: {
        id: 'theharvester',
        name: 'theHarvester',
        description: 'Enumeración de correos, subdominios y personas',
        category: 'Escaneo y Enumeración',
        requiresDocker: true,
        requiresApiKey: false,
        difficulty: 'beginner',
        outputFormat: 'text',
        estimatedDuration: 45,
        documentationUrl: 'https://github.com/laramies/theHarvester',
        parameters: [
            {
                id: 'domain',
                name: 'Domain',
                type: 'text',
                required: true,
                description: 'Target domain to search',
                placeholder: 'numu.group',
                aiHint: 'Extract domain from user prompt',
            },
            {
                id: 'limit',
                name: 'Limit',
                type: 'number',
                required: false,
                default: 500,
                description: 'Limit results per source',
                aiHint: 'Use 500 as default',
            },
            {
                id: 'source',
                name: 'Data Source',
                type: 'select',
                required: true,
                default: 'all',
                options: ['all', 'google', 'bing', 'linkedin', 'twitter', 'crtsh'],
                description: 'Source to search',
                aiHint: 'Use all for comprehensive search',
            },
        ],
        examples: [
            {
                description: 'Basic domain reconnaissance',
                prompt: 'Find emails for numu.group',
                command: 'theHarvester -d numu.group -b all',
                parameters: {
                    domain: 'numu.group',
                    source: 'all',
                },
            },
        ],
    },

    // ============================================
    // RECON-NG - OSINT Framework
    // ============================================
    'recon-ng': {
        id: 'recon-ng',
        name: 'Recon-ng',
        description: 'Framework completo de reconocimiento',
        category: 'Reconocimiento y OSINT',
        requiresDocker: true,
        requiresApiKey: false,
        difficulty: 'intermediate',
        outputFormat: 'text',
        estimatedDuration: 120,
        documentationUrl: 'https://github.com/lanmaster53/recon-ng',
        parameters: [
            {
                id: 'workspace',
                name: 'Workspace',
                type: 'text',
                required: true,
                default: 'default',
                description: 'Name of the workspace to use',
                placeholder: 'my_company',
                aiHint: 'Workspace name',
            },
            {
                id: 'module',
                name: 'Module',
                type: 'select',
                required: false,
                default: 'recon/domains-hosts/hackertarget',
                options: [
                    'recon/domains-hosts/hackertarget',
                    'recon/domains-hosts/certificate_transparency',
                    'recon/hosts-hosts/reverse_resolve',
                ],
                description: 'Module to execute',
                aiHint: 'Select appropriate module',
            },
        ],
        examples: [
            {
                description: 'Run hackertarget module',
                prompt: 'Run recon-ng hackertarget on default workspace',
                command: 'recon-cli -w default -m recon/domains-hosts/hackertarget -x "run; exit"',
                parameters: {
                    workspace: 'default',
                    module: 'recon/domains-hosts/hackertarget',
                },
            },
        ],
    },

    // ============================================
    // OWASP ZAP - Web Scanner
    // ============================================
    'owasp-zap': {
        id: 'owasp-zap',
        name: 'OWASP ZAP',
        description: 'Escáner de seguridad de aplicaciones web integrado',
        category: 'Explotación y Vulnerabilidades',
        requiresDocker: true,
        requiresApiKey: false,
        difficulty: 'intermediate',
        outputFormat: 'html',
        estimatedDuration: 300,
        documentationUrl: 'https://www.zaproxy.org/docs/',
        parameters: [
            {
                id: 'target',
                name: 'Target URL',
                type: 'text',
                required: true,
                description: 'URL to scan',
                placeholder: 'http://example.com',
                aiHint: 'Extract target URL',
            },
            {
                id: 'scanType',
                name: 'Scan Type',
                type: 'select',
                required: true,
                default: 'baseline',
                options: ['baseline', 'full'],
                description: 'Type of scan to perform',
                aiHint: 'Use baseline for quick, full for deep',
            },
        ],
        examples: [
            {
                description: 'Baseline scan',
                prompt: 'Run ZAP baseline scan on http://example.com',
                command: 'zap-baseline.py -t http://example.com',
                parameters: {
                    target: 'http://example.com',
                    scanType: 'baseline',
                },
            },
        ],
    },

    // ============================================
    // BURP SUITE - Web Proxy/Scanner
    // ============================================
    'burp-suite': {
        id: 'burp-suite',
        name: 'Burp Suite',
        description: 'Plataforma líder para pruebas de seguridad de aplicaciones web',
        category: 'Explotación y Vulnerabilidades',
        requiresDocker: false,
        requiresApiKey: false,
        difficulty: 'advanced',
        outputFormat: 'text',
        estimatedDuration: 0,
        documentationUrl: 'https://portswigger.net/burp/documentation/desktop/getting-started',
        parameters: [
            {
                id: 'projectFile',
                name: 'Project File',
                type: 'file',
                required: false,
                description: 'Burp project file to open (.burp)',
                aiHint: 'Project file path',
            },
        ],
        examples: [
            {
                description: 'Launch Burp Suite',
                prompt: 'Open Burp Suite',
                command: 'burpsuite',
                parameters: {},
            },
        ],
    },


    // ============================================
    // NUCLEI - Vulnerability Scanner
    // ============================================
    nuclei: {
        id: 'nuclei',
        name: 'Nuclei',
        description: 'Escáner de vulnerabilidades rápido y basado en plantillas. Detecta CVEs, misconfiguraciones y más.',
        category: 'Explotación y Vulnerabilidades',
        requiresDocker: true,
        requiresApiKey: false,
        difficulty: 'intermediate',
        outputFormat: 'json',
        estimatedDuration: 180,
        documentationUrl: 'https://nuclei.projectdiscovery.io',
        parameters: [
            {
                id: 'target',
                name: 'Target URL',
                type: 'text',
                required: true,
                description: 'URL to scan (e.g., https://example.com)',
                placeholder: 'https://example.com',
                aiHint: 'Extract target URL',
            }
        ],
        examples: [
            {
                description: 'Basic scan',
                prompt: 'Run Nuclei on https://example.com',
                command: 'nuclei -u https://example.com -json',
                parameters: { target: 'https://example.com' },
            },
        ],
    },

    // ============================================
    // FEROXBUSTER - Content Discovery
    // ============================================
    feroxbuster: {
        id: 'feroxbuster',
        name: 'Feroxbuster',
        description: 'Herramienta de descubrimiento de contenido (fuzzing) rápida, escrita en Rust.',
        category: 'Escaneo y Enumeración',
        requiresDocker: true,
        requiresApiKey: false,
        difficulty: 'intermediate',
        outputFormat: 'json',
        estimatedDuration: 300,
        documentationUrl: 'https://epi052.github.io/feroxbuster-docs/docs/',
        parameters: [
            {
                id: 'url',
                name: 'Target URL',
                type: 'text',
                required: true,
                description: 'Base URL to fuzz',
                placeholder: 'https://example.com',
                aiHint: 'Extract target URL',
            }
        ],
        examples: [
            {
                description: 'Directory brute-force',
                prompt: 'Find directories on https://example.com',
                command: 'feroxbuster -u https://example.com --json --time-limit 5m',
                parameters: { url: 'https://example.com' },
            },
        ],
    },

    // ============================================
    // WHATWEB - Tech Fingerprinter
    // ============================================
    whatweb: {
        id: 'whatweb',
        name: 'WhatWeb',
        description: 'Identificador de tecnologías web (CMS, librerías JS, servidores, etc.).',
        category: 'Reconocimiento y OSINT',
        requiresDocker: true,
        requiresApiKey: false,
        difficulty: 'beginner',
        outputFormat: 'json',
        estimatedDuration: 30,
        documentationUrl: 'https://github.com/urbanadventurer/WhatWeb',
        parameters: [
            {
                id: 'target',
                name: 'Target',
                type: 'text',
                required: true,
                description: 'URL or Domain',
                placeholder: 'https://example.com',
                aiHint: 'Extract target',
            }
        ],
        examples: [
            {
                description: 'Identify technologies',
                prompt: 'What technologies does example.com use?',
                command: 'whatweb https://example.com --log-json=-',
                parameters: { target: 'https://example.com' },
            },
        ],
    },

    // ============================================
    // TESTSSL.SH - SSL/TLS Analyzer
    // ============================================
    testssl: {
        id: 'testssl',
        name: 'testssl.sh',
        description: 'Auditoría profunda de configuración SSL/TLS. Verifica cifrados, protocolos y certificados.',
        category: 'Escaneo y Enumeración',
        requiresDocker: true,
        requiresApiKey: false,
        difficulty: 'intermediate',
        outputFormat: 'json',
        estimatedDuration: 240,
        documentationUrl: 'https://testssl.sh',
        parameters: [
            {
                id: 'target',
                name: 'Target',
                type: 'text',
                required: true,
                description: 'Host:Port or URL',
                placeholder: 'example.com',
                aiHint: 'Extract target host',
            }
        ],
        examples: [
            {
                description: 'Check SSL configuration',
                prompt: 'Check SSL on example.com',
                command: 'testssl.sh --jsonfile - example.com',
                parameters: { target: 'example.com' },
            },
        ],
    },
};

/**
 * Get tool configuration by ID
 */
export function getToolConfig(toolId: string): ToolConfig | undefined {
    return TOOL_CONFIGS[toolId];
}

/**
 * Get all tool configurations
 */
export function getAllToolConfigs(): ToolConfig[] {
    return Object.values(TOOL_CONFIGS);
}

/**
 * Check if tool has configuration
 */
export function hasToolConfig(toolId: string): boolean {
    return toolId in TOOL_CONFIGS;
}
