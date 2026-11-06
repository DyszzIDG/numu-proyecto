/**
 * FOFA Result Parser
 * Parses FOFA API responses into structured format
 */

export interface FOFAAsset {
    ip: string;
    port?: number;
    host?: string;
    domain?: string;
    protocol?: string;
    title?: string;
    country?: string;
    city?: string;
    server?: string;
    banner?: string;
    cert?: string;
    isp?: string;
    asNumber?: string;
    asOrganization?: string;
}

export interface FOFAResult {
    query: string;
    totalResults: number;
    assets: FOFAAsset[];
    summary: {
        uniqueIPs: number;
        uniqueDomains: number;
        topPorts: Array<{ port: number; count: number }>;
        topCountries: Array<{ country: string; count: number }>;
        topServers: Array<{ server: string; count: number }>;
    };
}

export class FOFAParser {
    /**
     * Parse FOFA API JSON response
     */
    static parseJSON(jsonOutput: string, query: string): FOFAResult {
        try {
            const data = JSON.parse(jsonOutput);

            if (data.error) {
                throw new Error(`FOFA API Error: ${data.errmsg || 'Unknown error'}`);
            }

            const assets: FOFAAsset[] = [];
            const results = data.results || [];

            // FOFA returns results as arrays matching the requested fields
            // Default fields: ip, port, host, domain, protocol, title
            for (const result of results) {
                const asset: FOFAAsset = {
                    ip: result[0] || '',
                    port: result[1] ? parseInt(result[1]) : undefined,
                    host: result[2] || undefined,
                    domain: result[3] || undefined,
                    protocol: result[4] || undefined,
                    title: result[5] || undefined,
                };

                // Additional fields if requested
                if (result.length > 6) {
                    asset.country = result[6];
                    asset.city = result[7];
                    asset.server = result[8];
                    asset.banner = result[9];
                }

                assets.push(asset);
            }

            // Generate summary
            const summary = this.generateSummary(assets);

            return {
                query,
                totalResults: data.size || assets.length,
                assets,
                summary,
            };
        } catch (error) {
            throw new Error(`Failed to parse FOFA response: ${error}`);
        }
    }

    /**
     * Generate summary statistics from assets
     */
    private static generateSummary(assets: FOFAAsset[]): FOFAResult['summary'] {
        const uniqueIPs = new Set(assets.map(a => a.ip)).size;
        const uniqueDomains = new Set(assets.map(a => a.domain).filter(Boolean)).size;

        // Count ports
        const portCounts = new Map<number, number>();
        for (const asset of assets) {
            if (asset.port) {
                portCounts.set(asset.port, (portCounts.get(asset.port) || 0) + 1);
            }
        }
        const topPorts = Array.from(portCounts.entries())
            .map(([port, count]) => ({ port, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // Count countries
        const countryCounts = new Map<string, number>();
        for (const asset of assets) {
            if (asset.country) {
                countryCounts.set(asset.country, (countryCounts.get(asset.country) || 0) + 1);
            }
        }
        const topCountries = Array.from(countryCounts.entries())
            .map(([country, count]) => ({ country, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // Count servers
        const serverCounts = new Map<string, number>();
        for (const asset of assets) {
            if (asset.server) {
                serverCounts.set(asset.server, (serverCounts.get(asset.server) || 0) + 1);
            }
        }
        const topServers = Array.from(serverCounts.entries())
            .map(([server, count]) => ({ server, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        return {
            uniqueIPs,
            uniqueDomains,
            topPorts,
            topCountries,
            topServers,
        };
    }

    /**
     * Extract findings from FOFA results
     */
    static extractFindings(result: FOFAResult): Array<{
        severity: 'info' | 'low' | 'medium' | 'high';
        title: string;
        description: string;
    }> {
        const findings: Array<{
            severity: 'info' | 'low' | 'medium' | 'high';
            title: string;
            description: string;
        }> = [];

        // Exposed services
        if (result.assets.length > 0) {
            findings.push({
                severity: 'info',
                title: `${result.assets.length} exposed asset(s) found`,
                description: `Query "${result.query}" returned ${result.assets.length} results across ${result.summary.uniqueIPs} unique IP addresses`,
            });
        }

        // Common vulnerable ports
        const vulnerablePorts = [21, 23, 445, 3389, 5900, 6379, 27017];
        for (const { port, count } of result.summary.topPorts) {
            if (vulnerablePorts.includes(port)) {
                findings.push({
                    severity: 'medium',
                    title: `${count} asset(s) with potentially vulnerable port ${port}`,
                    description: `Port ${port} is commonly associated with security risks and should be properly secured`,
                });
            }
        }

        // Outdated servers
        for (const { server, count } of result.summary.topServers) {
            if (this.isOutdatedServer(server)) {
                findings.push({
                    severity: 'low',
                    title: `${count} asset(s) running potentially outdated ${server}`,
                    description: `Server version ${server} may be outdated and should be updated`,
                });
            }
        }

        return findings;
    }

    /**
     * Check if server version appears outdated
     */
    private static isOutdatedServer(server: string): boolean {
        const outdatedPatterns = [
            /apache\/1\./i,
            /apache\/2\.[0-2]/i,
            /nginx\/1\.[0-9]\./i,
            /iis\/[1-7]\./i,
            /php\/[1-5]\./i,
        ];

        return outdatedPatterns.some(pattern => pattern.test(server));
    }

    /**
     * Filter assets by criteria
     */
    static filterAssets(
        result: FOFAResult,
        criteria: {
            country?: string;
            port?: number;
            protocol?: string;
            server?: string;
        }
    ): FOFAAsset[] {
        return result.assets.filter(asset => {
            if (criteria.country && asset.country !== criteria.country) return false;
            if (criteria.port && asset.port !== criteria.port) return false;
            if (criteria.protocol && asset.protocol !== criteria.protocol) return false;
            if (criteria.server && !asset.server?.includes(criteria.server)) return false;
            return true;
        });
    }
}
