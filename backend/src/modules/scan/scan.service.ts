import prisma from '../../config/database';
import { QueueService } from '../../services/QueueService';
import { NotificationService } from '../../services/NotificationService';
import { AuditService } from '../../services/AuditService';
import { AppError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';
import { emitToUser } from '../../config/websocket';

interface CreateScanData {
    name: string;
    description?: string;
    target: string;
    type: string;
    priority: string;
    tools: string[];
    nmapOptions?: {
        flags?: string;
        ports?: string;
    };
}

export class ScanService {
    static async createScan(userId: string, data: CreateScanData, req?: AuthRequest) {
        // Get or create CSIRTUser profile
        let csirtUser = await prisma.cSIRTUser.findUnique({
            where: { userId },
        });

        if (!csirtUser) {
            csirtUser = await prisma.cSIRTUser.create({
                data: {
                    userId,
                    role: 'ANALYST',
                },
            });
        }

        // Create scan
        const scan = await prisma.cSIRTScan.create({
            data: {
                name: data.name,
                description: data.description,
                target: data.target,
                type: data.type as any,
                priority: data.priority as any,
                tools: data.tools,
                nmapOptions: data.nmapOptions || {},
                nucleiTemplates: [],
                userId: csirtUser.id,
                status: 'QUEUED',
            },
        });

        // Add to queue
        await QueueService.addScanJob({
            scanId: scan.id,
            userId: csirtUser.id,
            target: scan.target,
            tools: scan.tools,
            nmapOptions: scan.nmapOptions,
        });

        // Create notification
        await NotificationService.notifyNewScan(csirtUser.id, scan.id, scan.name);

        // Audit log
        await AuditService.logScanCreated(csirtUser.id, scan.id, req);

        // Emit WebSocket event
        emitToUser(userId, 'scan:created', scan);

        return scan;
    }

    static async listScans(userId: string, options: {
        page: number;
        limit: number;
        status?: string;
        type?: string;
    }) {
        const { page, limit, status, type } = options;
        const skip = (page - 1) * limit;

        // Get CSIRTUser
        const csirtUser = await prisma.cSIRTUser.findUnique({
            where: { userId },
        });

        if (!csirtUser) {
            return { scans: [], total: 0, page, limit };
        }

        const where: any = {
            userId: csirtUser.id,
        };

        if (status) {
            where.status = status;
        }

        if (type) {
            where.type = type;
        }

        const [scans, total] = await Promise.all([
            prisma.cSIRTScan.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: {
                            vulnerabilities: true,
                            ports: true,
                        },
                    },
                },
            }),
            prisma.cSIRTScan.count({ where }),
        ]);

        return {
            scans,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    static async getScanById(scanId: string) {
        const scan = await prisma.cSIRTScan.findUnique({
            where: { id: scanId },
            include: {
                vulnerabilities: {
                    orderBy: { severity: 'desc' },
                },
                ports: {
                    orderBy: { number: 'asc' },
                },
                services: true,
                screenshots: true,
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

        if (!scan) {
            throw new AppError('Scan not found', 404);
        }

        return scan;
    }

    static async deleteScan(scanId: string) {
        const scan = await prisma.cSIRTScan.findUnique({
            where: { id: scanId },
        });

        if (!scan) {
            throw new AppError('Scan not found', 404);
        }

        // Cancel if running
        if (scan.status === 'RUNNING') {
            throw new AppError('Cannot delete a running scan. Cancel it first.', 400);
        }

        await prisma.cSIRTScan.delete({
            where: { id: scanId },
        });

        return { success: true };
    }

    static async cancelScan(scanId: string) {
        const scan = await prisma.cSIRTScan.findUnique({
            where: { id: scanId },
        });

        if (!scan) {
            throw new AppError('Scan not found', 404);
        }

        if (scan.status !== 'RUNNING' && scan.status !== 'QUEUED') {
            throw new AppError('Can only cancel running or queued scans', 400);
        }

        const updatedScan = await prisma.cSIRTScan.update({
            where: { id: scanId },
            data: { status: 'CANCELLED' },
        });

        // TODO: Actually cancel the job in the queue

        return updatedScan;
    }

    static async getScanVulnerabilities(scanId: string) {
        const vulnerabilities = await prisma.cSIRTVulnerability.findMany({
            where: { scanId },
            orderBy: [
                { severity: 'desc' },
                { createdAt: 'desc' },
            ],
        });

        return vulnerabilities;
    }

    static async updateScanStatus(scanId: string, status: string, data?: any) {
        const scan = await prisma.cSIRTScan.update({
            where: { id: scanId },
            data: {
                status: status as any,
                ...data,
            },
        });

        // Emit WebSocket event
        const csirtUser = await prisma.cSIRTUser.findUnique({
            where: { id: scan.userId },
            include: { user: true },
        });

        if (csirtUser) {
            emitToUser(csirtUser.userId, 'scan:updated', scan);
        }

        return scan;
    }
}
