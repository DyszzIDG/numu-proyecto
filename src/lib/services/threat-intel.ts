interface ThreatIntelData {
    source: 'shodan' | 'virustotal' | 'abuseipdb';
    data: any;
    fetchedAt: Date;
    confidence: number;
}

export class ThreatIntelService {

    /**
     * Lookup IP/domain in Shodan
     */
    static async lookupShodan(target: string): Promise<ThreatIntelData | null> {
        const apiKey = process.env.SHODAN_API_KEY;
        if (!apiKey) {
            console.warn('SHODAN_API_KEY not configured');
            return null;
        }

        try {
            const response = await fetch(
                `https://api.shodan.io/shodan/host/${target}?key=${apiKey}`
            );

            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`Shodan API error: ${response.statusText}`);
            }

            const data = await response.json();

            return {
                source: 'shodan',
                data: {
                    ip: data.ip_str,
                    ports: data.ports || [],
                    hostnames: data.hostnames || [],
                    organization: data.org,
                    isp: data.isp,
                    country: data.country_name,
                    city: data.city,
                    vulns: data.vulns || [],
                    services: data.data?.map((service: any) => ({
                        port: service.port,
                        protocol: service.transport,
                        product: service.product,
                        version: service.version,
                        banner: service.data
                    })) || []
                },
                fetchedAt: new Date(),
                confidence: 0.95
            };
        } catch (error) {
            console.error('Shodan lookup error:', error);
            return null;
        }
    }

    /**
     * Lookup IP/domain in VirusTotal
     */
    static async lookupVirusTotal(target: string): Promise<ThreatIntelData | null> {
        const apiKey = process.env.VIRUSTOTAL_API_KEY;
        if (!apiKey) {
            console.warn('VIRUSTOTAL_API_KEY not configured');
            return null;
        }

        try {
            // Determine if target is IP or domain
            const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(target);
            const endpoint = isIP
                ? `https://www.virustotal.com/api/v3/ip_addresses/${target}`
                : `https://www.virustotal.com/api/v3/domains/${target}`;

            const response = await fetch(endpoint, {
                headers: {
                    'x-apikey': apiKey
                }
            });

            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`VirusTotal API error: ${response.statusText}`);
            }

            const data = await response.json();
            const attributes = data.data.attributes;

            return {
                source: 'virustotal',
                data: {
                    reputation: attributes.reputation,
                    malicious: attributes.last_analysis_stats?.malicious || 0,
                    suspicious: attributes.last_analysis_stats?.suspicious || 0,
                    harmless: attributes.last_analysis_stats?.harmless || 0,
                    undetected: attributes.last_analysis_stats?.undetected || 0,
                    categories: attributes.categories || {},
                    whois: attributes.whois,
                    asn: attributes.asn,
                    country: attributes.country
                },
                fetchedAt: new Date(),
                confidence: 0.90
            };
        } catch (error) {
            console.error('VirusTotal lookup error:', error);
            return null;
        }
    }

    /**
     * Lookup IP in AbuseIPDB
     */
    static async lookupAbuseIPDB(ip: string): Promise<ThreatIntelData | null> {
        const apiKey = process.env.ABUSEIPDB_API_KEY;
        if (!apiKey) {
            console.warn('ABUSEIPDB_API_KEY not configured');
            return null;
        }

        try {
            const response = await fetch(
                `https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}&maxAgeInDays=90`,
                {
                    headers: {
                        'Key': apiKey,
                        'Accept': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`AbuseIPDB API error: ${response.statusText}`);
            }

            const result = await response.json();
            const data = result.data;

            return {
                source: 'abuseipdb',
                data: {
                    abuseConfidenceScore: data.abuseConfidenceScore,
                    usageType: data.usageType,
                    isp: data.isp,
                    domain: data.domain,
                    countryCode: data.countryCode,
                    isWhitelisted: data.isWhitelisted,
                    totalReports: data.totalReports,
                    numDistinctUsers: data.numDistinctUsers,
                    lastReportedAt: data.lastReportedAt
                },
                fetchedAt: new Date(),
                confidence: 0.85
            };
        } catch (error) {
            console.error('AbuseIPDB lookup error:', error);
            return null;
        }
    }

    /**
     * Aggregate threat intelligence from all sources
     */
    static async aggregateThreatIntel(target: string): Promise<{
        target: string;
        sources: ThreatIntelData[];
        riskScore: number;
        summary: string;
    }> {
        const results = await Promise.allSettled([
            this.lookupShodan(target),
            this.lookupVirusTotal(target),
            /^(\d{1,3}\.){3}\d{1,3}$/.test(target) ? this.lookupAbuseIPDB(target) : Promise.resolve(null)
        ]);

        const sources: ThreatIntelData[] = results
            .filter((r): r is PromiseFulfilledResult<ThreatIntelData | null> =>
                r.status === 'fulfilled' && r.value !== null
            )
            .map(r => r.value!);

        // Calculate risk score (0-100)
        let riskScore = 0;
        let summary = '';

        if (sources.length === 0) {
            summary = 'No threat intelligence data available';
        } else {
            // Shodan vulns
            const shodanData = sources.find(s => s.source === 'shodan');
            if (shodanData?.data.vulns?.length > 0) {
                riskScore += 30;
            }

            // VirusTotal malicious detections
            const vtData = sources.find(s => s.source === 'virustotal');
            if (vtData) {
                const maliciousRatio = vtData.data.malicious / (vtData.data.malicious + vtData.data.harmless + 1);
                riskScore += maliciousRatio * 40;
            }

            // AbuseIPDB score
            const abuseData = sources.find(s => s.source === 'abuseipdb');
            if (abuseData) {
                riskScore += (abuseData.data.abuseConfidenceScore / 100) * 30;
            }

            // Generate summary
            if (riskScore > 70) {
                summary = 'HIGH RISK: Multiple threat indicators detected';
            } else if (riskScore > 40) {
                summary = 'MEDIUM RISK: Some suspicious activity detected';
            } else if (riskScore > 10) {
                summary = 'LOW RISK: Minor concerns identified';
            } else {
                summary = 'CLEAN: No significant threats detected';
            }
        }

        return {
            target,
            sources,
            riskScore: Math.min(100, Math.round(riskScore)),
            summary
        };
    }
}
