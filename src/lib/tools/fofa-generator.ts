/**
 * FOFA API Integration
 * FOFA is a cyberspace search engine
 */

export interface FOFAScanOptions {
    query: string; // FOFA search query
    size?: number; // Number of results (1-10000)
    page?: number; // Page number
    fields?: string[]; // Fields to return (ip, port, host, domain, etc.)
    full?: boolean; // Return full data
}

export interface FOFAResult {
    ip?: string;
    port?: number;
    host?: string;
    domain?: string;
    protocol?: string;
    title?: string;
    country?: string;
    city?: string;
    server?: string;
    banner?: string;
}

export class FOFAGenerator {
    private static readonly API_BASE = 'https://fofa.info/api/v1';

    /**
     * Sanitizes query to prevent injection
     */
    private static sanitizeQuery(query: string): string {
        // FOFA uses its own query syntax, just ensure no shell injection
        return query.replace(/[`$(){}[\]<>]/g, '');
    }

    /**
     * Generates FOFA search command (using curl or API)
     */
    static generateCommand(options: FOFAScanOptions, apiKey?: string): string {
        if (!apiKey) {
            throw new Error('FOFA API key is required');
        }

        const sanitizedQuery = this.sanitizeQuery(options.query);
        const encodedQuery = Buffer.from(sanitizedQuery).toString('base64');

        const size = options.size || 100;
        const page = options.page || 1;
        const fields = options.fields?.join(',') || 'ip,port,host,domain,protocol,title';
        const full = options.full ? 'true' : 'false';

        // Build API URL
        const url = `${this.API_BASE}/search/all?email=USER_EMAIL&key=${apiKey}&qbase64=${encodedQuery}&size=${size}&page=${page}&fields=${fields}&full=${full}`;

        // Return curl command
        return `curl -s "${url}"`;
    }

    /**
     * Get preset queries for common searches
     */
    static getPresets(): Record<string, string> {
        return {
            webServers: 'port="80" || port="443" || port="8080"',
            sshServers: 'protocol="ssh"',
            ftpServers: 'protocol="ftp"',
            databases: 'port="3306" || port="5432" || port="27017" || port="1433"',
            cameras: 'title="DVR" || title="Camera" || title="NVR"',
            routers: 'title="router" || title="gateway"',
            vpn: 'protocol="openvpn" || protocol="ipsec"',
            rdp: 'port="3389"',
            elasticsearch: 'port="9200" && product="Elasticsearch"',
            jenkins: 'title="Jenkins"',
        };
    }

    /**
     * Get available search fields
     */
    static getAvailableFields(): string[] {
        return [
            'ip',
            'port',
            'host',
            'domain',
            'protocol',
            'title',
            'country',
            'city',
            'server',
            'banner',
            'cert',
            'isp',
            'as_number',
            'as_organization',
        ];
    }

    /**
     * Build query from user-friendly parameters
     */
    static buildQuery(params: {
        domain?: string;
        ip?: string;
        port?: number;
        protocol?: string;
        country?: string;
        title?: string;
        server?: string;
    }): string {
        const conditions: string[] = [];

        if (params.domain) conditions.push(`domain="${params.domain}"`);
        if (params.ip) conditions.push(`ip="${params.ip}"`);
        if (params.port) conditions.push(`port="${params.port}"`);
        if (params.protocol) conditions.push(`protocol="${params.protocol}"`);
        if (params.country) conditions.push(`country="${params.country}"`);
        if (params.title) conditions.push(`title="${params.title}"`);
        if (params.server) conditions.push(`server="${params.server}"`);

        return conditions.join(' && ');
    }
}
