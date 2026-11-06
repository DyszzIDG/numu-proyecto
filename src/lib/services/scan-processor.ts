/**
 * Scan Processor Service
 * Automatically processes security scan results and populates CSIRT sections
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ProcessScanOptions {
    executionId: string;
    toolName: string;
    target: string;
    rawOutput: string;
    aiAnalysis?: any;
    jsonResult?: any;
}

export class ScanProcessor {
    /**
     * Main entry point - processes a completed scan and creates CSIRT records
     */
    static async processScan(options: ProcessScanOptions): Promise<string> {
        const { executionId, toolName, target, rawOutput, aiAnalysis, jsonResult } = options;

        try {
            console.log(`🔍 Processing scan: ${toolName} on ${target}`);

            // 1. Create or get ScanTarget
            const scanTarget = await this.getOrCreateTarget(target);

            // 2. Create ScanResult
            const scanResult = await this.createScanResult({
                targetId: scanTarget.id,
                toolName,
                executionId,
                rawOutput,
            });

            // 3. Parse and create findings
            const findings = await this.extractFindings({
                scanResultId: scanResult.id,
                toolName,
                rawOutput,
                aiAnalysis,
                jsonResult,
            });

            console.log(`✅ Created ${findings.length} findings for scan ${scanResult.id}`);

            // 4. Auto-create cases for critical/high severity findings
            await this.createCasesForCriticalFindings(scanResult.id, findings);


            return scanResult.id;

        } catch (error) {
            console.error('❌ Error processing scan:', error);
            throw error;
        }
    }

    /**
     * Get or create a ScanTarget
     */
    private static async getOrCreateTarget(target: string): Promise<any> {
        const type = this.detectTargetType(target);

        let scanTarget = await prisma.scanTarget.findUnique({
            where: { target },
        });

        if (!scanTarget) {
            scanTarget = await prisma.scanTarget.create({
                data: {
                    target,
                    type,
                    description: `Auto-discovered from scan`,
                },
            });
            console.log(`📍 Created new ScanTarget: ${target}`);
        }

        return scanTarget;
    }

    /**
     * Detect if target is IP or domain
     */
    private static detectTargetType(target: string): string {
        const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
        return ipRegex.test(target) ? 'ip' : 'domain';
    }

    /**
     * Create a ScanResult record
     */
    private static async createScanResult(data: {
        targetId: string;
        toolName: string;
        executionId: string;
        rawOutput?: string;
    }): Promise<any> {
        const scanType = this.mapToolToScanType(data.toolName);

        const scanResult = await prisma.scanResult.create({
            data: {
                targetId: data.targetId,
                scanType,
                status: 'success',
                startedAt: new Date(),
                completedAt: new Date(),
                metadata: JSON.stringify({
                    toolExecutionId: data.executionId,
                    toolName: data.toolName,
                    rawOutput: data.rawOutput || '',
                }),
            },
        });

        return scanResult;
    }

    /**
     * Map tool name to scan type
     */
    private static mapToolToScanType(toolName: string): string {
        const mapping: Record<string, string> = {
            nmap: 'nmap',
            nikto: 'http',
            'ssl-scan': 'ssl',
            testssl: 'ssl',
            'dns-recon': 'dns',
            whois: 'whois',
            nuclei: 'vuln',
            whatweb: 'fingerprint',
            theharvester: 'osint',
            'ai-analyst': 'ai-analysis'
        };
        return mapping[toolName.toLowerCase()] || 'full';
    }

    /**
     * Extract findings from scan results
     */
    private static async extractFindings(data: {
        scanResultId: string;
        toolName: string;
        rawOutput: string;
        aiAnalysis?: any;
        jsonResult?: any;
    }): Promise<any[]> {
        const findings: any[] = [];

        // Extract from AI analysis vulnerabilities
        if (data.aiAnalysis?.vulnerabilities) {
            for (const vuln of data.aiAnalysis.vulnerabilities) {
                findings.push(
                    await prisma.scanFinding.create({
                        data: {
                            scanId: data.scanResultId,
                            category: 'vulnerability',
                            severity: this.normalizeSeverity(vuln.severity || 'medium'),
                            title: vuln.title || vuln.name || 'Vulnerability detected',
                            description: vuln.description || 'No description provided',
                            rawData: JSON.stringify(vuln),
                        },
                    })
                );
            }
        }

        // Extract ports from Nmap scans
        if (data.toolName.toLowerCase() === 'nmap' && data.jsonResult) {
            const ports = Array.isArray(data.jsonResult) ? data.jsonResult : [];
            for (const port of ports) {
                findings.push(
                    await prisma.scanFinding.create({
                        data: {
                            scanId: data.scanResultId,
                            category: 'port',
                            severity: 'info',
                            title: `Port ${port.port || port.portid} open`,
                            description: `Service: ${port.service?.name || 'unknown'}`,
                            rawData: JSON.stringify(port),
                        },
                    })
                );
            }
        }

        // If no specific findings, create a general one
        if (findings.length === 0 && data.aiAnalysis?.summary) {
            findings.push(
                await prisma.scanFinding.create({
                    data: {
                        scanId: data.scanResultId,
                        category: 'general',
                        severity: 'info',
                        title: 'Scan completed',
                        description: data.aiAnalysis.summary,
                        rawData: data.rawOutput.substring(0, 1000),
                    },
                })
            );
        }

        return findings;
    }

    /**
     * Normalize severity levels
     */
    private static normalizeSeverity(severity: string): string {
        const normalized = severity.toLowerCase();
        const validLevels = ['info', 'low', 'medium', 'high', 'critical'];
        return validLevels.includes(normalized) ? normalized : 'medium';
    }

    /**
     * Create cases for critical/high severity findings
     */
    private static async createCasesForCriticalFindings(
        scanResultId: string,
        findings: any[]
    ): Promise<void> {
        const criticalFindings = findings.filter(
            (f) => f.severity === 'critical' || f.severity === 'high'
        );

        if (criticalFindings.length === 0) {
            return;
        }

        // Create a case for the scan with critical findings
        const scanResult = await prisma.scanResult.findUnique({
            where: { id: scanResultId },
            include: { target: true },
        });

        if (!scanResult) return;

        await prisma.case.create({
            data: {
                title: `Security findings on ${scanResult.target.target}`,
                description: `Automated case created from security scan. Found ${criticalFindings.length} critical/high severity issues.`,
                priority: criticalFindings.some((f) => f.severity === 'critical')
                    ? 'critical'
                    : 'high',
                status: 'open',
                type: 'scan_issue',
                scanResultId: scanResult.id,
            },
        });

        console.log(`🚨 Created case for ${criticalFindings.length} critical findings`);
    }
}
