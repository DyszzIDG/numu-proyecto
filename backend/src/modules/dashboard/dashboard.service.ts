import prisma from '../../config/database';
import { subDays, format, startOfDay, endOfDay } from 'date-fns';

export class DashboardService {
    static async getStats(userId: string) {
        const now = new Date();
        const today = startOfDay(now);
        const weekAgo = subDays(now, 7);

        // Get scan statistics
        const [scansToday, scansThisWeek, totalScans, runningScans] = await Promise.all([
            prisma.cSIRTScan.count({
                where: { createdAt: { gte: today } },
            }),
            prisma.cSIRTScan.count({
                where: { createdAt: { gte: weekAgo } },
            }),
            prisma.cSIRTScan.count(),
            prisma.cSIRTScan.count({
                where: { status: 'RUNNING' },
            }),
        ]);

        // Get vulnerability statistics
        const vulnStats = await prisma.cSIRTVulnerability.groupBy({
            by: ['severity'],
            where: { status: 'OPEN' },
            _count: true,
        });

        const vulnerabilities = {
            critical: vulnStats.find(v => v.severity === 'CRITICAL')?._count || 0,
            high: vulnStats.find(v => v.severity === 'HIGH')?._count || 0,
            medium: vulnStats.find(v => v.severity === 'MEDIUM')?._count || 0,
            low: vulnStats.find(v => v.severity === 'LOW')?._count || 0,
            trend: 0, // TODO: Calculate trend
        };

        // Get incident statistics
        const [activeIncidents, incidentsByType, incidentsBySeverity] = await Promise.all([
            prisma.cSIRTIncident.count({
                where: {
                    status: { in: ['NEW', 'ACKNOWLEDGED', 'INVESTIGATING', 'CONTAINED'] },
                },
            }),
            prisma.cSIRTIncident.groupBy({
                by: ['type'],
                _count: true,
            }),
            prisma.cSIRTIncident.groupBy({
                by: ['severity'],
                _count: true,
            }),
        ]);

        const incidents = {
            active: activeIncidents,
            byType: Object.fromEntries(
                incidentsByType.map(i => [i.type, i._count])
            ),
            bySeverity: Object.fromEntries(
                incidentsBySeverity.map(i => [i.severity, i._count])
            ),
        };

        // TODO: Get asset statistics (placeholder for now)
        const assets = {
            total: 0,
            monitored: 0,
            byType: {},
        };

        return {
            scans: {
                today: scansToday,
                thisWeek: scansThisWeek,
                total: totalScans,
                running: runningScans,
            },
            vulnerabilities,
            incidents,
            assets,
        };
    }

    static async getVulnerabilitiesTimeline(days: number = 30) {
        const startDate = subDays(new Date(), days);

        const vulnerabilities = await prisma.cSIRTVulnerability.findMany({
            where: {
                createdAt: { gte: startDate },
            },
            select: {
                createdAt: true,
                severity: true,
            },
        });

        // Group by date and severity
        const grouped: Record<string, Record<string, number>> = {};

        vulnerabilities.forEach(vuln => {
            const date = format(vuln.createdAt, 'yyyy-MM-dd');
            if (!grouped[date]) {
                grouped[date] = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, INFO: 0 };
            }
            grouped[date][vuln.severity]++;
        });

        // Convert to array format
        return Object.entries(grouped).map(([date, severities]) => ({
            date,
            ...severities,
        }));
    }

    static async getVulnerabilityTypes(limit: number = 10) {
        const vulnerabilities = await prisma.cSIRTVulnerability.groupBy({
            by: ['cwe'],
            _count: true,
            orderBy: {
                _count: {
                    cwe: 'desc',
                },
            },
            take: limit,
            where: {
                cwe: { not: null },
            },
        });

        return vulnerabilities.map(v => ({
            cwe: v.cwe || 'Unknown',
            count: v._count,
        }));
    }

    static async getIncidentsDistribution() {
        const incidents = await prisma.cSIRTIncident.groupBy({
            by: ['type'],
            _count: true,
        });

        return incidents.map(i => ({
            type: i.type,
            count: i._count,
        }));
    }

    static async getScanActivity(days: number = 90) {
        const startDate = subDays(new Date(), days);

        const scans = await prisma.cSIRTScan.findMany({
            where: {
                createdAt: { gte: startDate },
            },
            select: {
                createdAt: true,
            },
        });

        // Group by date
        const grouped: Record<string, number> = {};

        scans.forEach(scan => {
            const date = format(scan.createdAt, 'yyyy-MM-dd');
            grouped[date] = (grouped[date] || 0) + 1;
        });

        return Object.entries(grouped).map(([date, count]) => ({
            date,
            count,
        }));
    }

    static async getRecentActivity(limit: number = 20) {
        const auditLogs = await prisma.cSIRTAuditLog.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });

        return auditLogs.map(log => ({
            id: log.id,
            action: log.action,
            entityType: log.entityType,
            entityId: log.entityId,
            user: log.user.user.name || log.user.user.email,
            timestamp: log.createdAt,
        }));
    }

    static async getCriticalAlerts(limit: number = 10) {
        const vulnerabilities = await prisma.cSIRTVulnerability.findMany({
            where: {
                severity: 'CRITICAL',
                status: 'OPEN',
            },
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                scan: {
                    select: {
                        name: true,
                        target: true,
                    },
                },
            },
        });

        return vulnerabilities.map(vuln => ({
            id: vuln.id,
            title: vuln.title,
            severity: vuln.severity,
            cve: vuln.cve,
            cvss: vuln.cvss,
            scanName: vuln.scan.name,
            target: vuln.scan.target,
            createdAt: vuln.createdAt,
        }));
    }
}
