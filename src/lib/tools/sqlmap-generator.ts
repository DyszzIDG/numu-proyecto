/**
 * SQLMap Command Generator
 * SQL injection detection and exploitation
 */

export interface SQLMapOptions {
    url: string;
    data?: string; // POST data
    cookie?: string; // HTTP Cookie header
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    level?: number; // 1-5, tests to perform
    risk?: number; // 1-3, risk of tests
    dbs?: boolean; // Enumerate databases
    tables?: boolean; // Enumerate tables
    columns?: boolean; // Enumerate columns
    dump?: boolean; // Dump data
    batch?: boolean; // Never ask for user input
    randomAgent?: boolean; // Use random User-Agent
    threads?: number; // Max threads
}

export class SQLMapGenerator {
    /**
     * Generate SQLMap command
     */
    static generate(options: SQLMapOptions): string {
        const {
            url,
            data,
            cookie,
            method,
            level,
            risk,
            dbs,
            tables,
            columns,
            dump,
            batch,
            randomAgent,
            threads
        } = options;

        if (!this.isValidUrl(url)) {
            throw new Error('Invalid URL format');
        }

        let command = `sqlmap -u "${this.sanitizeUrl(url)}"`;

        // HTTP method
        if (method && method !== 'GET') {
            command += ` --method=${method}`;
        }

        // POST data
        if (data) {
            command += ` --data="${data}"`;
        }

        // Cookie
        if (cookie) {
            command += ` --cookie="${cookie}"`;
        }

        // Level (1-5)
        if (level) {
            command += ` --level=${Math.min(5, Math.max(1, level))}`;
        }

        // Risk (1-3)
        if (risk) {
            command += ` --risk=${Math.min(3, Math.max(1, risk))}`;
        }

        // Enumerate databases
        if (dbs) {
            command += ` --dbs`;
        }

        // Enumerate tables
        if (tables) {
            command += ` --tables`;
        }

        // Enumerate columns
        if (columns) {
            command += ` --columns`;
        }

        // Dump data
        if (dump) {
            command += ` --dump`;
        }

        // Batch mode
        if (batch) {
            command += ` --batch`;
        }

        // Random User-Agent
        if (randomAgent) {
            command += ` --random-agent`;
        }

        // Threads
        if (threads) {
            command += ` --threads=${threads}`;
        }

        return command;
    }

    /**
     * Generate from natural language
     */
    static fromNaturalLanguage(prompt: string, url: string): string {
        const lowerPrompt = prompt.toLowerCase();

        const options: SQLMapOptions = {
            url,
            batch: true,
            randomAgent: true,
        };

        // Quick scan
        if (lowerPrompt.includes('quick') || lowerPrompt.includes('fast')) {
            options.level = 1;
            options.risk = 1;
        }

        // Aggressive scan
        if (lowerPrompt.includes('aggressive') || lowerPrompt.includes('thorough')) {
            options.level = 5;
            options.risk = 3;
            options.threads = 10;
        }

        // Enumerate databases
        if (lowerPrompt.includes('database')) {
            options.dbs = true;
        }

        // Enumerate tables
        if (lowerPrompt.includes('table')) {
            options.tables = true;
        }

        // Dump data
        if (lowerPrompt.includes('dump') || lowerPrompt.includes('extract')) {
            options.dump = true;
        }

        // POST request
        if (lowerPrompt.includes('post')) {
            options.method = 'POST';
        }

        return this.generate(options);
    }

    private static isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    private static sanitizeUrl(url: string): string {
        return url.replace(/[`$]/g, '');
    }
}
