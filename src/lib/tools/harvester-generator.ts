/**
 * theHarvester Command Generator
 * Email, subdomain, and people enumeration
 */

export interface HarvesterOptions {
    domain: string;
    sources?: string[]; // Data sources: google, bing, linkedin, etc.
    limit?: number; // Limit results
    start?: number; // Start value for Google
    dns?: boolean; // DNS lookup
    virtual?: boolean; // Virtual host verification
    screenshot?: boolean; // Take screenshots
}

export class HarvesterGenerator {
    private static readonly SOURCES = [
        'baidu', 'bing', 'bingapi', 'certspotter', 'crtsh', 'dnsdumpster',
        'duckduckgo', 'github-code', 'google', 'hackertarget', 'hunter',
        'intelx', 'linkedin', 'netcraft', 'otx', 'rapiddns', 'securityTrails',
        'shodan', 'sublist3r', 'threatcrowd', 'trello', 'twitter', 'urlscan',
        'virustotal', 'yahoo'
    ];

    /**
     * Generate theHarvester command
     */
    static generate(options: HarvesterOptions): string {
        const { domain, sources, limit, start, dns, virtual, screenshot } = options;

        if (!this.isValidDomain(domain)) {
            throw new Error('Invalid domain format');
        }

        let command = `theHarvester -d ${this.sanitizeDomain(domain)}`;

        // Data sources
        if (sources && sources.length > 0) {
            const validSources = sources.filter(s => this.SOURCES.includes(s));
            if (validSources.length > 0) {
                command += ` -b ${validSources.join(',')}`;
            }
        } else {
            command += ` -b all`;
        }

        // Limit results
        if (limit) {
            command += ` -l ${limit}`;
        }

        // Start value
        if (start) {
            command += ` -s ${start}`;
        }

        // DNS lookup
        if (dns) {
            command += ` -n`;
        }

        // Virtual host verification
        if (virtual) {
            command += ` -v`;
        }

        // Screenshots
        if (screenshot) {
            command += ` -t`;
        }

        return command;
    }

    /**
     * Generate from natural language
     */
    static fromNaturalLanguage(prompt: string, domain: string): string {
        const lowerPrompt = prompt.toLowerCase();

        let targetDomain = domain;

        // Try to extract domain from prompt if not provided
        if (!targetDomain) {
            targetDomain = this.extractDomain(prompt) || '';
        }

        const options: HarvesterOptions = { domain: targetDomain };

        // Email enumeration
        if (lowerPrompt.includes('email')) {
            options.sources = ['google', 'bing', 'hunter', 'linkedin'];
        }

        // Subdomain enumeration
        if (lowerPrompt.includes('subdomain')) {
            options.sources = ['crtsh', 'dnsdumpster', 'certspotter', 'sublist3r'];
            options.dns = true;
        }

        // Social media
        if (lowerPrompt.includes('social') || lowerPrompt.includes('people')) {
            options.sources = ['linkedin', 'twitter'];
        }

        // Comprehensive scan
        if (lowerPrompt.includes('comprehensive') || lowerPrompt.includes('all')) {
            options.dns = true;
            options.virtual = true;
        }

        return this.generate(options);
    }

    private static isValidDomain(domain: string): boolean {
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z]{2,})+$/;
        return domainRegex.test(domain);
    }

    private static sanitizeDomain(domain: string): string {
        return domain.replace(/[;&|`$()]/g, '');
    }

    private static extractDomain(text: string): string | null {
        // Simple regex to find domain-like strings
        const domainRegex = /([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}/;
        const match = text.match(domainRegex);
        return match ? match[0] : null;
    }
}
