/**
 * Subscription Check Quota API
 * Returns user's current quota status
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { QuotaManager } from '@/lib/quota-manager';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check User first
        let user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        // Check Employee if not User
        let employee = null;
        if (!user) {
            employee = await prisma.employee.findUnique({
                where: { email: session.user.email },
            });
        }

        if (!user && !employee) {
            return NextResponse.json({ error: 'User/Employee not found' }, { status: 404 });
        }

        let quotaStatus;
        let usageStats;

        if (user) {
            quotaStatus = await QuotaManager.getQuotaStatus(user.id);
            usageStats = await QuotaManager.getUsageStats(user.id);
        } else {
            // Mock data for Employee
            quotaStatus = {
                plan: 'csirt',
                quota: -1,
                used: 0,
                remaining: -1,
                resetDate: new Date(),
                canExecute: true
            };
            usageStats = {
                totalScans: 0,
                scansThisMonth: 0,
                toolBreakdown: {}
            };
        }

        return NextResponse.json({
            success: true,
            quotaStatus,
            usageStats,
        });

    } catch (error: any) {
        console.error('Error checking quota:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
