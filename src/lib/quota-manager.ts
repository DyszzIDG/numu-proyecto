/**
 * Quota Management System
 * Handles user scan quotas and subscription limits
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface QuotaStatus {
    plan: 'free' | 'premium';
    quota: number; // -1 for unlimited
    used: number;
    remaining: number; // -1 for unlimited
    resetDate: Date;
    canExecute: boolean;
}

export class QuotaManager {
    /**
     * Get user's quota status
     */
    static async getQuotaStatus(userId: string): Promise<QuotaStatus> {
        // Bypass for dev mock user
        if (userId === 'dev-user-id') {
            return {
                plan: 'premium',
                quota: -1,
                used: 0,
                remaining: -1,
                resetDate: new Date(),
                canExecute: true,
            };
        }

        let userPlan = await prisma.userPlan.findUnique({
            where: { userId },
        });

        // Create default free plan if doesn't exist
        if (!userPlan) {
            const resetDate = new Date();
            resetDate.setMonth(resetDate.getMonth() + 1);

            userPlan = await prisma.userPlan.create({
                data: {
                    userId,
                    plan: 'free',
                    scanQuota: 4,
                    scansUsed: 0,
                    resetDate,
                    status: 'active',
                },
            });
        }

        // Check if quota needs reset (monthly for free users)
        if (userPlan.plan === 'free' && new Date() >= userPlan.resetDate) {
            userPlan = await this.resetQuota(userId);
        }

        const remaining = userPlan.scanQuota === -1
            ? -1
            : Math.max(0, userPlan.scanQuota - userPlan.scansUsed);

        return {
            plan: userPlan.plan as 'free' | 'premium',
            quota: userPlan.scanQuota,
            used: userPlan.scansUsed,
            remaining,
            resetDate: userPlan.resetDate,
            canExecute: userPlan.scanQuota === -1 || userPlan.scansUsed < userPlan.scanQuota,
        };
    }

    /**
     * Check if user can execute a scan
     */
    static async canExecuteScan(userId: string): Promise<boolean> {
        const status = await this.getQuotaStatus(userId);
        return status.canExecute;
    }

    /**
     * Consume one scan from user's quota
     */
    static async consumeQuota(userId: string): Promise<void> {
        // Bypass for dev mock user
        if (userId === 'dev-user-id') return;

        const userPlan = await prisma.userPlan.findUnique({
            where: { userId },
        });

        if (!userPlan) {
            throw new Error('User plan not found');
        }

        // Don't increment for premium users (unlimited)
        if (userPlan.scanQuota === -1) {
            return;
        }

        // Check if quota exceeded
        if (userPlan.scansUsed >= userPlan.scanQuota) {
            throw new Error('Scan quota exceeded. Please upgrade to premium or wait for quota reset.');
        }

        await prisma.userPlan.update({
            where: { userId },
            data: {
                scansUsed: {
                    increment: 1,
                },
            },
        });
    }

    /**
     * Reset user's quota (monthly reset for free users)
     */
    static async resetQuota(userId: string): Promise<any> {
        const resetDate = new Date();
        resetDate.setMonth(resetDate.getMonth() + 1);

        return await prisma.userPlan.update({
            where: { userId },
            data: {
                scansUsed: 0,
                resetDate,
            },
        });
    }

    /**
     * Upgrade user to premium
     */
    static async upgradeToPremium(userId: string, subscriptionId: string): Promise<void> {
        await prisma.userPlan.upsert({
            where: { userId },
            update: {
                plan: 'premium',
                scanQuota: -1, // Unlimited
                scansUsed: 0,
                subscriptionId,
                status: 'active',
            },
            create: {
                userId,
                plan: 'premium',
                scanQuota: -1,
                scansUsed: 0,
                resetDate: new Date(), // Not used for premium
                subscriptionId,
                status: 'active',
            },
        });
    }

    /**
     * Downgrade user to free plan
     */
    static async downgradeToFree(userId: string): Promise<void> {
        const resetDate = new Date();
        resetDate.setMonth(resetDate.getMonth() + 1);

        await prisma.userPlan.update({
            where: { userId },
            data: {
                plan: 'free',
                scanQuota: 4,
                scansUsed: 0,
                resetDate,
                subscriptionId: null,
                status: 'active',
            },
        });
    }

    /**
     * Cancel user's subscription
     */
    static async cancelSubscription(userId: string): Promise<void> {
        await prisma.userPlan.update({
            where: { userId },
            data: {
                status: 'cancelled',
            },
        });
    }

    /**
     * Get usage statistics for a user
     */
    static async getUsageStats(userId: string): Promise<{
        totalScans: number;
        scansThisMonth: number;
        toolBreakdown: Record<string, number>;
    }> {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const allScans = await prisma.toolExecution.findMany({
            where: { userId },
            select: { toolName: true, startedAt: true },
        });

        const scansThisMonth = allScans.filter(
            scan => scan.startedAt >= monthStart
        ).length;

        const toolBreakdown: Record<string, number> = {};
        for (const scan of allScans) {
            toolBreakdown[scan.toolName] = (toolBreakdown[scan.toolName] || 0) + 1;
        }

        return {
            totalScans: allScans.length,
            scansThisMonth,
            toolBreakdown,
        };
    }
}
