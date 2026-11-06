import { emitToUser, emitToAll } from '../config/websocket';
import prisma from '../config/database';

export class NotificationService {
    static async createNotification(userId: string, data: {
        type: string;
        title: string;
        message: string;
        link?: string;
    }) {
        const notification = await prisma.cSIRTNotification.create({
            data: {
                userId,
                ...data,
            },
        });

        // Send real-time notification via WebSocket
        emitToUser(userId, 'notification', notification);

        return notification;
    }

    static async notifyNewScan(userId: string, scanId: string, scanName: string) {
        return this.createNotification(userId, {
            type: 'scan',
            title: 'New Scan Started',
            message: `Scan "${scanName}" has been queued`,
            link: `/csirt/scans/${scanId}`,
        });
    }

    static async notifyScanCompleted(userId: string, scanId: string, scanName: string, vulnCount: number) {
        return this.createNotification(userId, {
            type: 'scan',
            title: 'Scan Completed',
            message: `Scan "${scanName}" completed. Found ${vulnCount} vulnerabilities`,
            link: `/csirt/scans/${scanId}`,
        });
    }

    static async notifyCriticalVulnerability(userId: string, vulnId: string, vulnTitle: string) {
        return this.createNotification(userId, {
            type: 'vulnerability',
            title: 'Critical Vulnerability Detected',
            message: `Critical: ${vulnTitle}`,
            link: `/csirt/vulnerabilities/${vulnId}`,
        });
    }

    static async notifyNewIncident(userId: string, incidentId: string, incidentTitle: string) {
        return this.createNotification(userId, {
            type: 'incident',
            title: 'New Incident Created',
            message: incidentTitle,
            link: `/csirt/incidents/${incidentId}`,
        });
    }

    static async markAsRead(notificationId: string) {
        return await prisma.cSIRTNotification.update({
            where: { id: notificationId },
            data: { isRead: true },
        });
    }

    static async getUnreadCount(userId: string) {
        return await prisma.cSIRTNotification.count({
            where: {
                userId,
                isRead: false,
            },
        });
    }
}
