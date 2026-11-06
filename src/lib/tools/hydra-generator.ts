/**
 * Hydra Command Generator
 * Network login cracker supporting many protocols
 */

export interface HydraOptions {
    target: string;
    service: string; // ssh, ftp, http-get, http-post, etc.
    username?: string;
    userList?: string; // Path to username list
    password?: string;
    passwordList?: string; // Path to password list
    port?: number;
    threads?: number;
    timeout?: number;
    verbose?: boolean;
    ssl?: boolean;
}

export class HydraGenerator {
    private static readonly SERVICES = [
        'ssh', 'ftp', 'telnet', 'http-get', 'http-post', 'http-post-form',
        'https-get', 'https-post', 'https-post-form', 'smb', 'mysql',
        'postgresql', 'mssql', 'rdp', 'vnc', 'pop3', 'imap', 'smtp'
    ];

    /**
     * Generate Hydra command
     */
    static generate(options: HydraOptions): string {
        const {
            target,
            service,
            username,
            userList,
            password,
            passwordList,
            port,
            threads,
            timeout,
            verbose,
            ssl
        } = options;

        if (!this.isValidTarget(target)) {
            throw new Error('Invalid target format');
        }

        if (!this.SERVICES.includes(service)) {
            throw new Error(`Invalid service. Supported: ${this.SERVICES.join(', ')}`);
        }

        let command = 'hydra';

        // Username
        if (username) {
            command += ` -l ${username}`;
        } else if (userList) {
            command += ` -L ${userList}`;
        } else {
            throw new Error('Username or user list required');
        }

        // Password
        if (password) {
            command += ` -p ${password}`;
        } else if (passwordList) {
            command += ` -P ${passwordList}`;
        } else {
            throw new Error('Password or password list required');
        }

        // Threads
        if (threads) {
            command += ` -t ${threads}`;
        }

        // Timeout
        if (timeout) {
            command += ` -w ${timeout}`;
        }

        // Verbose
        if (verbose) {
            command += ` -V`;
        }

        // SSL
        if (ssl) {
            command += ` -S`;
        }

        // Target and service
        command += ` ${this.sanitizeTarget(target)}`;

        // Port
        if (port) {
            command += ` -s ${port}`;
        }

        command += ` ${service}`;

        return command;
    }

    /**
     * Generate from natural language
     */
    static fromNaturalLanguage(prompt: string, target: string): string {
        const lowerPrompt = prompt.toLowerCase();

        const options: HydraOptions = {
            target,
            service: 'ssh', // Default
            threads: 4,
            verbose: true,
        };

        // Detect service
        if (lowerPrompt.includes('ssh')) options.service = 'ssh';
        if (lowerPrompt.includes('ftp')) options.service = 'ftp';
        if (lowerPrompt.includes('http')) options.service = 'http-post-form';
        if (lowerPrompt.includes('rdp')) options.service = 'rdp';
        if (lowerPrompt.includes('mysql')) options.service = 'mysql';
        if (lowerPrompt.includes('smtp')) options.service = 'smtp';

        // Default wordlists
        options.userList = '/usr/share/wordlists/usernames.txt';
        options.passwordList = '/usr/share/wordlists/rockyou.txt';

        // Fast mode
        if (lowerPrompt.includes('fast')) {
            options.threads = 16;
        }

        // SSL
        if (lowerPrompt.includes('ssl') || lowerPrompt.includes('https')) {
            options.ssl = true;
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
