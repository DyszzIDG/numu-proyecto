/**
 * Nikto Command Generator
 * Generates secure, validated Nikto commands from user-friendly parameters
 */

export interface NiktoScanOptions {
    target: string;
    port?: number;
    ssl?: boolean;
    tuning?: string[]; // Scan tuning options (1-9, a-b)
    timeout?: number; // Timeout in seconds
    maxTime?: number; // Maximum scan time in seconds
    noSSLCheck?: boolean; // Skip SSL certificate validation
    plugins?: string[]; // Specific plugins to run
    outputFormat?: 'txt' | 'xml' | 'csv';
}

export class NiktoGenerator {
    /**
     * Validates target (domain or IP)
     */
    private static validateTarget(target: string): boolean {
        const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;

        return domainRegex.test(target) || ipRegex.test(target);
    }

    /**
     * Sanitizes input to prevent command injection
     */
    private static sanitize(input: string): string {
        return input.replace(/[;&|`$(){}[\]<>]/g, '');
    }

    /**
     * Generates Nikto command based on options
     */
    static generateCommand(options: NiktoScanOptions): string {
        if (!this.validateTarget(options.target)) {
            throw new Error('Invalid target format');
        }

        const sanitizedTarget = this.sanitize(options.target);
        let command = 'nikto';

        // Build host URL
        const protocol = options.ssl ? 'https' : 'http';
        const port = options.port || (options.ssl ? 443 : 80);
        const hostUrl = `${protocol}://${sanitizedTarget}:${port}`;

        command += ` -h ${hostUrl}`;

        // Tuning options
        if (options.tuning && options.tuning.length > 0) {
            const tuningStr = options.tuning.join('');
            command += ` -Tuning ${tuningStr}`;
        }

        // Timeout
        if (options.timeout) {
            command += ` -timeout ${options.timeout}`;
        }

        // Max time
        if (options.maxTime) {
            command += ` -maxtime ${options.maxTime}`;
        }

        // Skip SSL check
        if (options.noSSLCheck) {
            command += ' -nossl';
        }

        // Plugins
        if (options.plugins && options.plugins.length > 0) {
            const pluginsStr = options.plugins.join(',');
            command += ` -Plugins ${pluginsStr}`;
        }

        // Output format
        switch (options.outputFormat) {
            case 'txt':
                command += ' -Format txt -output -';
                break;
            case 'csv':
                command += ' -Format csv -output -';
                break;
            case 'xml':
                command += ' -Format xml -output -';
                break;
            default:
                command += ' -output -'; // Text output to stdout
        }

        return command;
    }

    /**
     * Get preset configurations for common scans
     */
    static getPresets(): Record<string, Partial<NiktoScanOptions>> {
        return {
            quick: {
                tuning: ['1', '2', '3'], // File upload, misconfig, info disclosure
                timeout: 10,
                maxTime: 300, // 5 minutes
                outputFormat: 'txt',
            },
            full: {
                tuning: ['1', '2', '3', '4', '5', '6', '7', '8', '9'], // All tests
                timeout: 20,
                outputFormat: 'txt',
            },
            webApp: {
                tuning: ['1', '2', '3', '4', 'b'], // File upload, misconfig, info, injection, software
                timeout: 15,
                maxTime: 600, // 10 minutes
                outputFormat: 'txt',
            },
            ssl: {
                ssl: true,
                tuning: ['2', '3'], // Misconfig and info disclosure
                timeout: 10,
                outputFormat: 'txt',
            },
        };
    }

    /**
     * Get available tuning options with descriptions
     */
    static getTuningOptions(): Record<string, string> {
        return {
            '0': 'File Upload',
            '1': 'Interesting File / Seen in logs',
            '2': 'Misconfiguration / Default File',
            '3': 'Information Disclosure',
            '4': 'Injection (XSS/Script/HTML)',
            '5': 'Remote File Retrieval - Inside Web Root',
            '6': 'Denial of Service',
            '7': 'Remote File Retrieval - Server Wide',
            '8': 'Command Execution / Remote Shell',
            '9': 'SQL Injection',
            'a': 'Authentication Bypass',
            'b': 'Software Identification',
            'c': 'Remote Source Inclusion',
            'x': 'Reverse Tuning Options (exclude)',
        };
    }

    /**
     * Parses a natural language prompt to generate a Nikto command
     */
    static fromNaturalLanguage(prompt: string, target?: string): string {
        const lowerPrompt = prompt.toLowerCase();
        let finalTarget = target || '';

        const options: NiktoScanOptions = {
            target: finalTarget,
            outputFormat: 'txt'
        };

        // 1. Extract Target (simple regex for domain/ip) if not provided
        if (!options.target) {
            const words = prompt.split(' ');
            for (const word of words) {
                const cleanWord = word.replace(/[;,]/g, '');
                if (this.validateTarget(cleanWord) && !['scan', 'check', 'test', 'analyze'].includes(cleanWord)) {
                    options.target = cleanWord;
                    break;
                }
            }
        }

        // If no target found, use a placeholder
        if (!options.target) {
            options.target = 'example.com';
        }

        // 2. Extract SSL
        if (lowerPrompt.includes('ssl') || lowerPrompt.includes('https')) {
            options.ssl = true;
        }

        // 3. Extract Port
        const portMatch = prompt.match(/port\s+(\d+)/i);
        if (portMatch) {
            options.port = parseInt(portMatch[1]);
        }

        // 4. Determine Scan Type / Tuning
        if (lowerPrompt.includes('full') || lowerPrompt.includes('complete')) {
            const preset = this.getPresets().full;
            options.tuning = preset.tuning;
            options.timeout = preset.timeout;
        } else if (lowerPrompt.includes('quick') || lowerPrompt.includes('fast')) {
            const preset = this.getPresets().quick;
            options.tuning = preset.tuning;
            options.timeout = preset.timeout;
        } else if (lowerPrompt.includes('webapp') || lowerPrompt.includes('app')) {
            const preset = this.getPresets().webApp;
            options.tuning = preset.tuning;
            options.maxTime = preset.maxTime;
        } else {
            // Default to a balanced scan
            options.tuning = ['1', '2', '3', 'b'];
        }

        return this.generateCommand(options);
    }
}
