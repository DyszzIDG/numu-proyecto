/**
 * Subscription Upgrade API
 * Handles premium subscription upgrades via Stripe
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { QuotaManager } from '@/lib/quota-manager';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { paymentMethod } = await request.json();

        // TODO: Integrate with Stripe
        // For now, we'll create a mock subscription
        const subscriptionId = `sub_${Date.now()}`;

        // Upgrade user to premium
        await QuotaManager.upgradeToPremium(user.id, subscriptionId);

        // Create transaction record
        await prisma.transaction.create({
            data: {
                userId: user.id,
                type: 'subscription',
                amount: 990, // $9.90 in cents
                currency: 'USD',
                status: 'completed',
                description: 'Premium subscription upgrade',
                metadata: JSON.stringify({
                    plan: 'premium',
                    subscriptionId,
                }),
            },
        });

        // Create audit log
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'subscription.upgrade',
                resource: `subscription:${subscriptionId}`,
                details: JSON.stringify({
                    plan: 'premium',
                    amount: 990,
                }),
            },
        });

        const quotaStatus = await QuotaManager.getQuotaStatus(user.id);

        return NextResponse.json({
            success: true,
            message: 'Successfully upgraded to Premium!',
            subscriptionId,
            quotaStatus,
        });

    } catch (error: any) {
        console.error('Subscription upgrade error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * GET - Check current subscription status
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                plan: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            subscription: user.plan,
        });

    } catch (error: any) {
        console.error('Error fetching subscription:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
