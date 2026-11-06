/**
 * RustScan Command Generator
 * Ultra-fast port scanner
 */

export interface RustScanOptions {
    target: string;
    ports?: string; // e.g., "1-1000" or "22,80,443"
    ulimit?: number; // Default: 5000
    batch?: number; // Batch size
    timeout?: number; // Timeout in ms
    scripts?: boolean; // Run nmap scripts
    accessible?: boolean; // Accessible mode
}

export class RustScanGenerator {
    /**
     * Generate RustScan command
     */
    static generate(options: RustScanOptions): string {
        const { target, ports, ulimit, batch, timeout, scripts, accessible } = options;

        // Validate target
        if (!this.isValidTarget(target)) {
            throw new Error('Invalid target format');
        }

        let command = `rustscan -a ${this.sanitizeTarget(target)}`;

        // Port range
        if (ports) {
            command += ` -p ${ports}`;
        }

        // Ulimit (file descriptors)
        if (ulimit) {
            command += ` --ulimit ${ulimit}`;
        }

        // Batch size
        if (batch) {
            command += ` -b ${batch}`;
        }

        // Timeout
        if (timeout) {
            command += ` -t ${timeout}`;
        }

        // Nmap scripts
        if (scripts) {
            command += ` -- -sC -sV`;
        }

        // Accessible mode
        if (accessible) {
            command += ` --accessible`;
        }

        return command;
    }

    /**
     * Generate from natural language
     */
    static fromNaturalLanguage(prompt: string, target: string): string {
        const lowerPrompt = prompt.toLowerCase();

        const options: RustScanOptions = { target };

        // Fast scan
        if (lowerPrompt.includes('fast') || lowerPrompt.includes('quick')) {
            options.ulimit = 10000;
            options.batch = 5000;
        }

        // Common ports
        if (lowerPrompt.includes('common')) {
            options.ports = '1-1000';
        }

        // All ports
        if (lowerPrompt.includes('all ports')) {
            options.ports = '1-65535';
        }

        // With scripts
        if (lowerPrompt.includes('script') || lowerPrompt.includes('version')) {
            options.scripts = true;
        }

        return this.generate(options);
    }

    private static isValidTarget(target: string): boolean {
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z]{2,})+$/;
        return ipRegex.test(target) || domainRegex.test(target);
    }

    private static sanitizeTarget(target: string): string {
        return target.replace(/[;&|`$()]/g, '');
    }
}
