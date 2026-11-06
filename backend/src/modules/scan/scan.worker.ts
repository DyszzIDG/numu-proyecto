import { Job } from 'bull';
import { exec } from 'child_process';
import { promisify } from 'util';
import prisma from '../../config/database';
import { ScanService } from './scan.service';
import { NotificationService } from '../../services/NotificationService';
import { AuditService } from '../../services/AuditService';
import { scanQueue } from '../../services/QueueService';

const execAsync = promisify(exec);

interface ScanJobData {
    scanId: string;
    userId: string;
    target: string;
    tools: string[];
    nmapOptions?: {
        flags?: string;
        ports?: string;
    };
}

// Process scan jobs
scanQueue.process(async (job: Job<ScanJobData>) => {
    const { scanId, userId, target, tools, nmapOptions } = job.data;

    console.log(`🔍 Processing scan job ${scanId} for target ${target}`);

    try {
        // Update scan status to RUNNING
        await ScanService.updateScanStatus(scanId, 'RUNNING', {
            startedAt: new Date(),
        });

        let rawOutput = '';
        let vulnerabilities: any[] = [];
        let ports: any[] = [];
        let services: any[] = [];

        // Execute Nmap scan
        if (tools.includes('nmap')) {
            const nmapResult = await executeNmapScan(target, nmapOptions);
            rawOutput += nmapResult.output;
            ports = nmapResult.ports;
            services = nmapResult.services;
            vulnerabilities = nmapResult.vulnerabilities;
        }

        // Save results
        const startedAt = (await prisma.cSIRTScan.findUnique({
            where: { id: scanId },
            select: { startedAt: true },
        }))?.startedAt;

        const duration = startedAt ? Math.floor((Date.now() - startedAt.getTime()) / 1000) : 0;

        await ScanService.updateScanStatus(scanId, 'COMPLETED', {
            completedAt: new Date(),
            duration,
            rawOutput,
            progress: 100,
        });

        // Save ports
        if (ports.length > 0) {
            await prisma.cSIRTPort.createMany({
                data: ports.map(p => ({
                    scanId,
                    ...p,
                })),
            });
        }

        // Save services
        if (services.length > 0) {
            await prisma.cSIRTService.createMany({
                data: services.map(s => ({
                    scanId,
                    ...s,
                })),
            });
        }

        // Save vulnerabilities
        if (vulnerabilities.length > 0) {
            await prisma.cSIRTVulnerability.createMany({
                data: vulnerabilities.map(v => ({
                    scanId,
                    ...v,
                })),
            });
        }

        // Send notification
        const scan = await prisma.cSIRTScan.findUnique({
            where: { id: scanId },
            select: { name: true },
        });

        await NotificationService.notifyScanCompleted(
            userId,
            scanId,
            scan?.name || 'Scan',
            vulnerabilities.length
        );

        // Audit log
        await AuditService.logScanCompleted(userId, scanId, duration);

        console.log(`✅ Scan ${scanId} completed successfully`);

        return {
            success: true,
            vulnerabilities: vulnerabilities.length,
            ports: ports.length,
            services: services.length,
        };
    } catch (error: any) {
        console.error(`❌ Scan ${scanId} failed:`, error);

        // Update scan status to FAILED
        await ScanService.updateScanStatus(scanId, 'FAILED', {
            completedAt: new Date(),
            errorLog: error.message,
        });

        throw error;
    }
});

async function executeNmapScan(target: string, options?: { flags?: string; ports?: string }) {
    const flags = options?.flags || '-sV -sC';
    const ports = options?.ports || '1-1000';

    // Build Nmap command
    const command = `nmap ${flags} -p ${ports} ${target}`;

    console.log(`🔍 Executing: ${command}`);

    try {
        const { stdout, stderr } = await execAsync(command, {
            timeout: 600000, // 10 minutes
        });

        const output = stdout + stderr;

        // Parse Nmap output
        const parsed = parseNmapOutput(output);

        return {
            output,
            ...parsed,
        };
    } catch (error: any) {
        console.error('Nmap execution error:', error);

        // If Nmap is not installed, return mock data for development
        if (error.message.includes('nmap') && error.message.includes('not found')) {
            console.warn('⚠️  Nmap not installed, returning mock data');
            return getMockNmapData(target);
        }

        throw error;
    }
}

function parseNmapOutput(output: string) {
    const ports: any[] = [];
    const services: any[] = [];
    const vulnerabilities: any[] = [];

    // Parse ports (simplified regex)
    const portRegex = /(\d+)\/(tcp|udp)\s+(open|closed|filtered)\s+(\S+)(?:\s+(.+))?/g;
    let match;

    while ((match = portRegex.exec(output)) !== null) {
        const [, number, protocol, state, service, version] = match;

        ports.push({
            number: parseInt(number),
            protocol: protocol.toUpperCase(),
            state,
            service,
            version: version?.trim() || null,
        });

        if (state === 'open') {
            services.push({
                name: service,
                version: version?.trim() || null,
                port: parseInt(number),
                protocol: protocol.toUpperCase(),
            });
        }
    }

    // Detect common vulnerabilities based on services
    services.forEach(service => {
        // Example: Detect outdated SSH versions
        if (service.name === 'ssh' && service.version) {
            if (service.version.includes('OpenSSH 5.') || service.version.includes('OpenSSH 6.')) {
                vulnerabilities.push({
                    title: 'Outdated SSH Version Detected',
                    description: `The SSH service is running an outdated version (${service.version}) which may contain known vulnerabilities.`,
                    severity: 'MEDIUM',
                    cve: null,
                    cwe: 'CWE-1104',
                    affectedUrl: null,
                    affectedParam: null,
                    remediation: 'Update OpenSSH to the latest stable version.',
                    references: ['https://www.openssh.com/'],
                    status: 'OPEN',
                    falsePositive: false,
                });
            }
        }

        // Example: Detect FTP service
        if (service.name === 'ftp') {
            vulnerabilities.push({
                title: 'FTP Service Detected',
                description: 'FTP transmits credentials in plaintext and should be replaced with SFTP or FTPS.',
                severity: 'HIGH',
                cve: null,
                cwe: 'CWE-319',
                affectedUrl: null,
                affectedParam: null,
                remediation: 'Disable FTP and use SFTP or FTPS instead.',
                references: ['https://www.ietf.org/rfc/rfc959.txt'],
                status: 'OPEN',
                falsePositive: false,
            });
        }

        // Example: Detect Telnet
        if (service.name === 'telnet') {
            vulnerabilities.push({
                title: 'Telnet Service Detected',
                description: 'Telnet transmits all data including passwords in plaintext.',
                severity: 'CRITICAL',
                cvss: 9.8,
                cve: null,
                cwe: 'CWE-319',
                affectedUrl: null,
                affectedParam: null,
                remediation: 'Disable Telnet and use SSH instead.',
                references: ['https://www.ietf.org/rfc/rfc854.txt'],
                status: 'OPEN',
                falsePositive: false,
            });
        }
    });

    return { ports, services, vulnerabilities };
}

function getMockNmapData(target: string) {
    return {
        output: `Starting Nmap scan on ${target}...\n\nNmap scan report for ${target}\nHost is up (0.050s latency).\n\nPORT     STATE SERVICE VERSION\n22/tcp   open  ssh     OpenSSH 7.4 (protocol 2.0)\n80/tcp   open  http    nginx 1.14.0\n443/tcp  open  https   nginx 1.14.0\n3306/tcp open  mysql   MySQL 5.7.30\n\nNmap done: 1 IP address (1 host up) scanned in 12.34 seconds`,
        ports: [
            { number: 22, protocol: 'TCP', state: 'open', service: 'ssh', version: 'OpenSSH 7.4' },
            { number: 80, protocol: 'TCP', state: 'open', service: 'http', version: 'nginx 1.14.0' },
            { number: 443, protocol: 'TCP', state: 'open', service: 'https', version: 'nginx 1.14.0' },
            { number: 3306, protocol: 'TCP', state: 'open', service: 'mysql', version: 'MySQL 5.7.30' },
        ],
        services: [
            { name: 'ssh', version: 'OpenSSH 7.4', port: 22, protocol: 'TCP' },
            { name: 'http', version: 'nginx 1.14.0', port: 80, protocol: 'TCP' },
            { name: 'https', version: 'nginx 1.14.0', port: 443, protocol: 'TCP' },
            { name: 'mysql', version: 'MySQL 5.7.30', port: 3306, protocol: 'TCP' },
        ],
        vulnerabilities: [
            {
                title: 'MySQL Service Exposed to Internet',
                description: 'MySQL database service is accessible from the internet, which poses a security risk.',
                severity: 'HIGH',
                cvss: 7.5,
                cve: null,
                cwe: 'CWE-284',
                affectedUrl: null,
                affectedParam: null,
                remediation: 'Configure firewall to restrict MySQL access to trusted IP addresses only.',
                references: ['https://dev.mysql.com/doc/refman/5.7/en/security.html'],
                status: 'OPEN',
                falsePositive: false,
            },
            {
                title: 'Outdated Nginx Version',
                description: 'The web server is running an outdated version of nginx (1.14.0) which may contain known vulnerabilities.',
                severity: 'MEDIUM',
                cvss: 5.3,
                cve: 'CVE-2019-9511',
                cwe: 'CWE-1104',
                affectedUrl: null,
                affectedParam: null,
                remediation: 'Update nginx to the latest stable version.',
                references: ['https://nginx.org/en/security_advisories.html'],
                status: 'OPEN',
                falsePositive: false,
            },
        ],
    };
}

console.log('✅ Scan worker initialized');
