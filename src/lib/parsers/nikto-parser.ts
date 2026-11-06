/**
 * Nikto Output Parser
 * Parses Nikto output into structured JSON
 */

export interface NiktoFinding {
    id: string;
    severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
    category: string;
    title: string;
    description: string;
    uri?: string;
    method?: string;
    osvdbId?: string;
    cveId?: string;
}

export interface NiktoResult {
    scanInfo: {
        target: string;
        ip?: string;
        port: number;
        ssl: boolean;
        startTime: Date;
        endTime: Date;
        duration: number;
    };
    serverInfo: {
        server?: string;
        poweredBy?: string;
        cookies?: string[];
    };
    findings: NiktoFinding[];
    summary: {
        totalFindings: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
        info: number;
    };
}

export class NiktoParser {
    /**
     * Parse Nikto text output
     */
    static parseText(output: string): NiktoResult {
        const lines = output.split(/\r?\n/);

        const result: NiktoResult = {
            scanInfo: {
                target: '',
                port: 80,
                ssl: false,
                startTime: new Date(),
                endTime: new Date(),
                duration: 0,
            },
            serverInfo: {
                cookies: [],
            },
            findings: [],
            summary: {
                totalFindings: 0,
                critical: 0,
                high: 0,
                medium: 0,
                low: 0,
                info: 0,
            },
        };

        for (const line of lines) {
            // Parse target info
            if (line.includes('Target IP:')) {
                result.scanInfo.ip = line.split('Target IP:')[1].trim();
            }

            if (line.includes('Target Hostname:')) {
                result.scanInfo.target = line.split('Target Hostname:')[1].trim();
            }

            if (line.includes('Target Port:')) {
                result.scanInfo.port = parseInt(line.split('Target Port:')[1].trim());
            }

            // Parse server info
            if (line.includes('Server:')) {
                const serverMatch = line.match(/Server:\s*(.+)/);
                if (serverMatch) {
                    result.serverInfo.server = serverMatch[1].trim();
                }
            }

            if (line.includes('X-Powered-By:')) {
                const poweredByMatch = line.match(/X-Powered-By:\s*(.+)/);
                if (poweredByMatch) {
                    result.serverInfo.poweredBy = poweredByMatch[1].trim();
                }
            }

            // Parse findings (+ prefix indicates a finding)
            if (line.trim().startsWith('+')) {
                const finding = this.parseFinding(line);
                if (finding) {
                    result.findings.push(finding);
                }
            }

            // Parse OSVDB references
            if (line.includes('OSVDB-')) {
                const osvdbMatch = line.match(/OSVDB-(\d+)/);
                if (osvdbMatch && result.findings.length > 0) {
                    result.findings[result.findings.length - 1].osvdbId = osvdbMatch[1];
                }
            }
        }

        // Update summary
        result.summary.totalFindings = result.findings.length;
        for (const finding of result.findings) {
            result.summary[finding.severity]++;
        }

        return result;
    }

    /**
     * Parse individual Nikto finding
     */
    private static parseFinding(line: string): NiktoFinding | null {
        // Remove the + prefix
        const content = line.substring(1).trim();

        if (!content) return null;

        // Extract URI if present
        const uriMatch = content.match(/^([A-Z]+)\s+([^\s:]+):\s*(.+)/);

        let method: string | undefined;
        let uri: string | undefined;
        let description: string;

        if (uriMatch) {
            method = uriMatch[1];
            uri = uriMatch[2];
            description = uriMatch[3];
        } else {
            description = content;
        }

        // Determine severity based on keywords
        const severity = this.determineSeverity(description);

        // Categorize finding
        const category = this.categorize(description);

        // Extract CVE if present
        const cveMatch = description.match(/(CVE-\d{4}-\d+)/);

        return {
            id: `nikto-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            severity,
            category,
            title: this.extractTitle(description),
            description,
            uri,
            method,
            cveId: cveMatch ? cveMatch[1] : undefined,
        };
    }

    /**
     * Determine severity from description
     */
    private static determineSeverity(description: string): 'info' | 'low' | 'medium' | 'high' | 'critical' {
        const lowerDesc = description.toLowerCase();

        // Critical indicators
        if (
            lowerDesc.includes('remote code execution') ||
            lowerDesc.includes('sql injection') ||
            lowerDesc.includes('command injection') ||
            lowerDesc.includes('arbitrary file upload')
        ) {
            return 'critical';
        }

        // High indicators
        if (
            lowerDesc.includes('xss') ||
            lowerDesc.includes('cross-site scripting') ||
            lowerDesc.includes('authentication bypass') ||
            lowerDesc.includes('directory traversal') ||
            lowerDesc.includes('file inclusion')
        ) {
            return 'high';
        }

        // Medium indicators
        if (
            lowerDesc.includes('information disclosure') ||
            lowerDesc.includes('misconfiguration') ||
            lowerDesc.includes('default file') ||
            lowerDesc.includes('backup file') ||
            lowerDesc.includes('vulnerable')
        ) {
            return 'medium';
        }

        // Low indicators
        if (
            lowerDesc.includes('outdated') ||
            lowerDesc.includes('deprecated') ||
            lowerDesc.includes('missing header')
        ) {
            return 'low';
        }

        return 'info';
    }

    /**
     * Categorize finding
     */
    private static categorize(description: string): string {
        const lowerDesc = description.toLowerCase();

        if (lowerDesc.includes('injection')) return 'Injection';
        if (lowerDesc.includes('xss') || lowerDesc.includes('cross-site')) return 'XSS';
        if (lowerDesc.includes('authentication') || lowerDesc.includes('auth')) return 'Authentication';
        if (lowerDesc.includes('disclosure') || lowerDesc.includes('leak')) return 'Information Disclosure';
        if (lowerDesc.includes('misconfiguration') || lowerDesc.includes('config')) return 'Misconfiguration';
        if (lowerDesc.includes('default')) return 'Default Configuration';
        if (lowerDesc.includes('outdated') || lowerDesc.includes('version')) return 'Outdated Software';
        if (lowerDesc.includes('header')) return 'HTTP Headers';
        if (lowerDesc.includes('cookie')) return 'Cookies';
        if (lowerDesc.includes('ssl') || lowerDesc.includes('tls')) return 'SSL/TLS';

        return 'General';
    }

    /**
     * Extract title from description
     */
    private static extractTitle(description: string): string {
        // Take first sentence or first 100 chars
        const firstSentence = description.split('.')[0];
        return firstSentence.length > 100
            ? firstSentence.substring(0, 100) + '...'
            : firstSentence;
    }

    /**
     * Parse Nikto JSON output (if available)
     */
    static parseJSON(jsonOutput: string): NiktoResult {
        try {
            const data = JSON.parse(jsonOutput);
            // Transform Nikto JSON format to our format
            // This would depend on Nikto's actual JSON structure
            return data;
        } catch (error) {
            // Fallback to text parsing
            return this.parseText(jsonOutput);
        }
    }

    /**
     * Extract key findings (high severity only)
     */
    static extractKeyFindings(result: NiktoResult): NiktoFinding[] {
        return result.findings.filter(f =>
            f.severity === 'critical' || f.severity === 'high'
        );
    }
}
