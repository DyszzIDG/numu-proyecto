import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export class AuditService {
    static async log(data: {
        userId: string;
        action: string;
        entityType: string;
        entityId?: string;
        changes?: any;
        req?: AuthRequest;
    }) {
        return await prisma.cSIRTAuditLog.create({
            data: {
                userId: data.userId,
                action: data.action,
                entityType: data.entityType,
                entityId: data.entityId,
                changes: data.changes,
                ipAddress: data.req?.ip,
                userAgent: data.req?.get('user-agent'),
            },
        });
    }

    static async logScanCreated(userId: string, scanId: string, req?: AuthRequest) {
        return this.log({
            userId,
            action: 'scan.created',
            entityType: 'scan',
            entityId: scanId,
            req,
        });
    }

    static async logScanCompleted(userId: string, scanId: string, duration: number) {
        return this.log({
            userId,
            action: 'scan.completed',
            entityType: 'scan',
            entityId: scanId,
            changes: { duration },
        });
    }

    static async logIncidentCreated(userId: string, incidentId: string, req?: AuthRequest) {
        return this.log({
            userId,
            action: 'incident.created',
            entityType: 'incident',
            entityId: incidentId,
            req,
        });
    }

    static async logIncidentStatusChanged(userId: string, incidentId: string, oldStatus: string, newStatus: string) {
        return this.log({
            userId,
            action: 'incident.status_changed',
            entityType: 'incident',
            entityId: incidentId,
            changes: { oldStatus, newStatus },
        });
    }
}
