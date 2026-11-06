/**
 * Nmap Output Parser
 * Parses Nmap output (XML or text) into structured JSON
 */

export interface NmapPort {
    port: number;
    protocol: string;
    state: string;
    service?: string;
    version?: string;
    product?: string;
}

export interface NmapHost {
    ip: string;
    hostname?: string;
    state: string;
    os?: string;
    ports: NmapPort[];
    vulnerabilities?: NmapVulnerability[];
}

export interface NmapVulnerability {
    id: string; // CVE ID
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    port?: number;
    service?: string;
}

export interface NmapResult {
    scanInfo: {
        target: string;
        startTime: Date;
        endTime: Date;
        duration: number; // seconds
        scanType: string;
    };
    hosts: NmapHost[];
    summary: {
        totalHosts: number;
        hostsUp: number;
        hostsDown: number;
        totalPorts: number;
        openPorts: number;
        closedPorts: number;
        filteredPorts: number;
    };
}

export class NmapParser {
    /**
     * Parse Nmap text output (or JSON if detected)
     */
    static parseText(output: string): NmapResult {
        // Remove ANSI codes
        const cleanOutput = output.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '').trim();

        // Try to detect and parse JSON output first
        if (cleanOutput.startsWith('{') || cleanOutput.startsWith('[')) {
            try {
                const jsonData = JSON.parse(cleanOutput);
                return this.parseJSON(jsonData);
            } catch (e) {
                // If JSON parsing fails, fall through to text parsing
                console.warn('JSON parse failed, falling back to text parsing:', e);
            }
        }

        const lines = cleanOutput.split(/\r?\n/);
        const result: NmapResult = {
            scanInfo: {
                target: '',
                startTime: new Date(),
                endTime: new Date(),
                duration: 0,
                scanType: 'unknown',
            },
            hosts: [],
            summary: {
                totalHosts: 0,
                hostsUp: 0,
                hostsDown: 0,
                totalPorts: 0,
                openPorts: 0,
                closedPorts: 0,
                filteredPorts: 0,
            },
        };

        let currentHost: NmapHost | null = null;

        for (const line of lines) {
            // Parse scan info
            if (line.includes('Nmap scan report for')) {
                if (currentHost) {
                    result.hosts.push(currentHost);
                }

                const match = line.match(/Nmap scan report for (.+?)( \((.+?)\))?$/);
                if (match) {
                    currentHost = {
                        ip: match[3] || match[1],
                        hostname: match[3] ? match[1] : undefined,
                        state: 'up',
                        ports: [],
                    };
                }
            }

            // Parse host state
            if (line.includes('Host is')) {
                const state = line.includes('up') ? 'up' : 'down';
                if (currentHost) {
                    currentHost.state = state;
                }
            }

            // Parse ports - allow leading whitespace
            const portMatch = line.match(/^\s*(\d+)\/(tcp|udp)\s+(\w+)\s+(.+?)$/);
            if (portMatch && currentHost) {
                const [, port, protocol, state, serviceInfo] = portMatch;
                const serviceParts = serviceInfo.trim().split(/\s+/);
                const service = serviceParts[0];
                const version = serviceParts.slice(1).join(' ') || undefined;

                currentHost.ports.push({
                    port: parseInt(port),
                    protocol,
                    state,
                    service,
                    version,
                });

                result.summary.totalPorts++;
                if (state === 'open') result.summary.openPorts++;
                else if (state === 'closed') result.summary.closedPorts++;
                else if (state === 'filtered') result.summary.filteredPorts++;
            }

            // Parse OS detection
            if (line.includes('OS details:') && currentHost) {
                currentHost.os = line.split('OS details:')[1].trim();
            }

            // Parse vulnerabilities (from vuln scripts)
            if (line.includes('CVE-') && currentHost) {
                const cveMatch = line.match(/(CVE-\d{4}-\d+)/);
                if (cveMatch) {
                    if (!currentHost.vulnerabilities) {
                        currentHost.vulnerabilities = [];
                    }

                    currentHost.vulnerabilities.push({
                        id: cveMatch[1],
                        severity: this.determineSeverity(line),
                        title: this.cleanNmapOutput(line),
                        description: this.cleanNmapOutput(line),
                    });
                }
            }
        }

        // Add last host
        if (currentHost) {
            result.hosts.push(currentHost);
        }

        // Update summary
        result.summary.totalHosts = result.hosts.length;
        result.summary.hostsUp = result.hosts.filter(h => h.state === 'up').length;
        result.summary.hostsDown = result.summary.totalHosts - result.summary.hostsUp;

        return result;
    }

    /**
     * Determine vulnerability severity from output
     */
    private static determineSeverity(line: string): 'low' | 'medium' | 'high' | 'critical' {
        const lowerLine = line.toLowerCase();

        if (lowerLine.includes('critical') || lowerLine.includes('cvss:10')) {
            return 'critical';
        } else if (lowerLine.includes('high') || lowerLine.includes('cvss:9') || lowerLine.includes('cvss:8')) {
            return 'high';
        } else if (lowerLine.includes('medium') || lowerLine.includes('cvss:7') || lowerLine.includes('cvss:6') || lowerLine.includes('cvss:5')) {
            return 'medium';
        }

        return 'low';
    }

    /**
     * Clean Nmap script output
     * Removes | and _ prefixes and extra whitespace
     */
    private static cleanNmapOutput(line: string): string {
        return line.replace(/^[\s|_]+/, '').trim();
    }


    /**
     * Parse Nmap JSON output (from xml2json.py conversion)
     */
    static parseJSON(jsonData: any): NmapResult {
        const result: NmapResult = {
            scanInfo: {
                target: '',
                startTime: new Date(),
                endTime: new Date(),
                duration: 0,
                scanType: 'unknown',
            },
            hosts: [],
            summary: {
                totalHosts: 0,
                hostsUp: 0,
                hostsDown: 0,
                totalPorts: 0,
                openPorts: 0,
                closedPorts: 0,
                filteredPorts: 0,
            },
        };

        // Handle different JSON structures from xml2json.py
        const nmaprun = jsonData.nmaprun || jsonData;

        // Extract scan info
        if (nmaprun.scaninfo) {
            result.scanInfo.scanType = nmaprun.scaninfo.type || 'unknown';
        }

        // Parse hosts
        let hosts = [];
        if (nmaprun.host) {
            hosts = Array.isArray(nmaprun.host) ? nmaprun.host : [nmaprun.host];
        }

        for (const hostData of hosts) {
            const host: NmapHost = {
                ip: '',
                state: 'unknown',
                ports: [],
            };

            // Extract IP address
            if (hostData.address) {
                const addresses = Array.isArray(hostData.address) ? hostData.address : [hostData.address];
                const ipv4 = addresses.find((a: any) => a.addrtype === 'ipv4');
                if (ipv4) {
                    host.ip = ipv4.addr;
                }
            }

            // Extract hostname
            if (hostData.hostnames?.hostname) {
                const hostname = Array.isArray(hostData.hostnames.hostname)
                    ? hostData.hostnames.hostname[0]
                    : hostData.hostnames.hostname;
                host.hostname = hostname.name;
            }

            // Extract host state
            if (hostData.status) {
                host.state = hostData.status.state || 'unknown';
            }

            // Extract OS
            if (hostData.os?.osmatch) {
                const osmatch = Array.isArray(hostData.os.osmatch)
                    ? hostData.os.osmatch[0]
                    : hostData.os.osmatch;
                host.os = osmatch.name;
            }

            // Extract ports
            if (hostData.ports?.port) {
                const ports = Array.isArray(hostData.ports.port)
                    ? hostData.ports.port
                    : [hostData.ports.port];

                for (const portData of ports) {
                    const port: NmapPort = {
                        port: parseInt(portData.portid) || 0,
                        protocol: portData.protocol || 'tcp',
                        state: portData.state?.state || 'unknown',
                        service: portData.service?.name,
                        version: portData.service?.version,
                        product: portData.service?.product,
                    };

                    host.ports.push(port);

                    // Update summary
                    result.summary.totalPorts++;
                    if (port.state === 'open') result.summary.openPorts++;
                    else if (port.state === 'closed') result.summary.closedPorts++;
                    else if (port.state === 'filtered') result.summary.filteredPorts++;
                }
            }

            result.hosts.push(host);
        }

        // Update summary
        result.summary.totalHosts = result.hosts.length;
        result.summary.hostsUp = result.hosts.filter(h => h.state === 'up').length;
        result.summary.hostsDown = result.summary.totalHosts - result.summary.hostsUp;

        return result;
    }

    /**
     * Parse Nmap XML output (more accurate)
     */
    static parseXML(xmlOutput: string): NmapResult {
        // For XML parsing, we would use a proper XML parser
        // This is a placeholder - in production, use xml2js or similar
        // For now, fallback to text parsing
        return this.parseText(xmlOutput);
    }

    /**
     * Extract key findings from scan results
     */
    static extractFindings(result: NmapResult): Array<{
        severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
        title: string;
        description: string;
    }> {
        const findings: Array<{
            severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
            title: string;
            description: string;
        }> = [];

        for (const host of result.hosts) {
            // Open ports
            const openPorts = host.ports.filter(p => p.state === 'open');
            if (openPorts.length > 0) {
                findings.push({
                    severity: 'info',
                    title: `${openPorts.length} open port(s) found on ${host.ip}`,
                    description: `Open ports: ${openPorts.map(p => `${p.port}/${p.protocol} (${p.service || 'unknown'})`).join(', ')}`,
                });
            }

            // Vulnerabilities
            if (host.vulnerabilities) {
                for (const vuln of host.vulnerabilities) {
                    findings.push({
                        severity: vuln.severity,
                        title: `${vuln.id}: ${vuln.title}`,
                        description: vuln.description,
                    });
                }
            }

            // Outdated services (heuristic)
            for (const port of host.ports) {
                if (port.version && this.isOutdatedVersion(port.service || '', port.version)) {
                    findings.push({
                        severity: 'medium',
                        title: `Potentially outdated ${port.service} version detected`,
                        description: `${port.service} ${port.version} on port ${port.port} may be outdated`,
                    });
                }
            }
        }

        return findings;
    }

    /**
     * Simple heuristic to detect outdated versions
     */
    private static isOutdatedVersion(service: string, version: string): boolean {
        // This is a very basic check - in production, use a CVE database
        const outdatedPatterns = [
            /apache\/1\./i,
            /apache\/2\.[0-2]/i,
            /nginx\/1\.[0-9]\./i,
            /openssh\/[1-6]\./i,
            /php\/[1-5]\./i,
        ];

        const serviceVersion = `${service}/${version}`;
        return outdatedPatterns.some(pattern => pattern.test(serviceVersion));
    }
}
