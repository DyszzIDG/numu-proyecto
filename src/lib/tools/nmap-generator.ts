/**
 * Nmap Command Generator
 * Generates secure, validated Nmap commands from user-friendly parameters
 */

export interface NmapScanOptions {
    target: string;
    scanType: 'quick' | 'full' | 'vuln' | 'stealth' | 'custom';
    ports?: string; // e.g., "80,443" or "1-1000"
    timing?: '0' | '1' | '2' | '3' | '4' | '5'; // T0-T5 (paranoid to insane)
    osDetection?: boolean;
    serviceVersion?: boolean;
    scriptScan?: boolean;
    outputFormat?: 'normal' | 'xml' | 'json';
    customArgs?: string;
}

export class NmapGenerator {
    /**
     * Validates target (domain or IP)
     */
    private static validateTarget(target: string): boolean {
        // Simple validation for domain or IP
        const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;

        return domainRegex.test(target) || ipRegex.test(target) || cidrRegex.test(target) || target === 'localhost';
    }

    /**
     * Sanitizes input to prevent command injection
     */
    private static sanitize(input: string): string {
        // Remove dangerous characters
        return input.replace(/[;&|`$(){}[\]<>]/g, '');
    }

    /**
     * Generates Nmap command based on options
     */
    static generateCommand(options: NmapScanOptions): string {
        if (!this.validateTarget(options.target)) {
            throw new Error('Invalid target format');
        }

        const sanitizedTarget = this.sanitize(options.target);
        let command = 'nmap';

        // Scan type presets
        switch (options.scanType) {
            case 'quick':
                command += ' -T4 -F'; // Fast scan, top 100 ports
                break;
            case 'full':
                command += ' -p- -T4'; // All ports
                break;
            case 'vuln':
                command += ' -sV --script vuln -T4'; // Vulnerability scan
                break;
            case 'stealth':
                command += ' -sS -T2'; // SYN stealth scan
                break;
            case 'custom':
                // Custom args will be added later
                break;
        }

        // Port specification
        if (options.ports && options.scanType === 'custom') {
            const sanitizedPorts = this.sanitize(options.ports);
            command += ` -p ${sanitizedPorts}`;
        }

        // Timing
        if (options.timing && options.scanType === 'custom') {
            command += ` -T${options.timing}`;
        }

        // OS Detection
        if (options.osDetection) {
            command += ' -O';
        }

        // Service Version Detection
        if (options.serviceVersion) {
            command += ' -sV';
        }

        // Script Scan
        if (options.scriptScan && options.scanType === 'custom') {
            command += ' --script default';
        }

        // Custom arguments (sanitized)
        if (options.customArgs && options.scanType === 'custom') {
            const sanitizedArgs = this.sanitize(options.customArgs);
            command += ` ${sanitizedArgs}`;
        }

        // Add target BEFORE pipe
        command += ` ${sanitizedTarget}`;

        // Output format
        switch (options.outputFormat) {
            case 'xml':
                command += ' -oX -';
                break;
            case 'json':
                command += ' -oX - | python3 /tmp/xml2json.py';
                break;
            default:
                command += ' -oN -'; // Normal output to stdout
        }

        return command;
    }

    /**
     * Get preset configurations for common scans
     */
    static getPresets(): Record<string, NmapScanOptions> {
        return {
            webServer: {
                target: '',
                scanType: 'custom',
                ports: '80,443,8080,8443',
                timing: '4',
                serviceVersion: true,
                outputFormat: 'normal',
            },
            fullScan: {
                target: '',
                scanType: 'full',
                osDetection: true,
                serviceVersion: true,
                outputFormat: 'normal',
            },
            quickScan: {
                target: '',
                scanType: 'quick',
                outputFormat: 'normal',
            },
            vulnScan: {
                target: '',
                scanType: 'vuln',
                outputFormat: 'normal',
            },
        };
    }
    /**
     * Creates an Nmap command from a natural language prompt
     */
    static fromNaturalLanguage(prompt: string, target: string): string {
        const lowerPrompt = prompt.toLowerCase();
        let finalTarget = target;

        // Try to extract target from prompt if not provided
        if (!finalTarget) {
            // Match simple domain or IP
            const targetMatch = prompt.match(/\b((?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\d{1,3}\.){3}\d{1,3}|localhost)\b/);
            if (targetMatch) {
                finalTarget = targetMatch[0];
            }
        }

        let scanType: NmapScanOptions['scanType'] = 'custom';
        let options: NmapScanOptions = {
            target: finalTarget,
            scanType: 'custom',
            outputFormat: 'normal'
        };

        // Determine scan type
        if (lowerPrompt.includes('quick') || lowerPrompt.includes('fast')) {
            options.scanType = 'quick';
        } else if (lowerPrompt.includes('full') || lowerPrompt.includes('all ports')) {
            options.scanType = 'full';
        } else if (lowerPrompt.includes('vuln') || lowerPrompt.includes('vulnerability')) {
            options.scanType = 'vuln';
        } else if (lowerPrompt.includes('stealth') || lowerPrompt.includes('quiet')) {
            options.scanType = 'stealth';
        } else {
            // Default heuristics for "custom"
            if (lowerPrompt.includes('os') || lowerPrompt.includes('operating system')) {
                options.osDetection = true;
            }
            if (lowerPrompt.includes('service') || lowerPrompt.includes('version')) {
                options.serviceVersion = true;
            }
            if (lowerPrompt.includes('script') || lowerPrompt.includes('automation')) {
                options.scriptScan = true;
            }

            // Basic port parsing (very simple)
            // If prompt says "port 80" or "ports 80,443"
            const portMatch = prompt.match(/ports?\s+([0-9,\-]+)/i);
            if (portMatch) {
                options.ports = portMatch[1];
            }
        }

        return this.generateCommand(options);
    }
}
