import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/affiliates/payout/request - Request payout
export async function POST(request: NextRequest) {
    try {
        // TODO: Get affiliate ID from session/auth
        const { affiliateId, amount } = await request.json();

        if (!affiliateId || !amount) {
            return NextResponse.json(
                { success: false, error: 'Datos incompletos' },
                { status: 400 }
            );
        }

        // Minimum payout: $50 (5000 cents)
        if (amount < 5000) {
            return NextResponse.json(
                { success: false, error: 'El monto mínimo de pago es $50' },
                { status: 400 }
            );
        }

        // Get affiliate
        const affiliate = await prisma.affiliate.findUnique({
            where: { id: affiliateId },
            include: {
                payouts: {
                    where: {
                        status: { in: ['pending', 'processing'] }
                    }
                }
            }
        });

        if (!affiliate) {
            return NextResponse.json(
                { success: false, error: 'Afiliado no encontrado' },
                { status: 404 }
            );
        }

        // Check if verified
        if (!affiliate.isVerified) {
            return NextResponse.json(
                { success: false, error: 'Debes verificar tu cuenta antes de solicitar pagos' },
                { status: 403 }
            );
        }

        // Calculate available balance
        const pendingPayouts = affiliate.payouts.reduce((sum, p) => sum + p.amount, 0);
        const available = affiliate.pendingEarnings - pendingPayouts;

        if (amount > available) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Saldo insuficiente. Disponible: $${(available / 100).toFixed(2)}`
                },
                { status: 400 }
            );
        }

        // Get referrals that contributed to this payout
        const referrals = await prisma.referral.findMany({
            where: {
                affiliateId,
                status: 'active',
                commission: { gt: 0 }
            },
            select: { id: true }
        });

        // Create payout request
        const payout = await prisma.affiliatePayout.create({
            data: {
                affiliateId,
                amount,
                method: affiliate.paymentMethod,
                status: 'pending',
                referralIds: JSON.stringify(referrals.map(r => r.id))
            }
        });

        // TODO: Send notification to admin
        // TODO: Send confirmation email to affiliate

        return NextResponse.json({
            success: true,
            payout: {
                id: payout.id,
                amount: payout.amount,
                amountFormatted: `$${(payout.amount / 100).toFixed(2)}`,
                status: payout.status,
                method: payout.method,
                requestedAt: payout.requestedAt,
                estimatedDate: getEstimatedPayoutDate()
            }
        });

    } catch (error) {
        console.error('Request payout error:', error);
        return NextResponse.json(
            { success: false, error: 'Error al solicitar pago' },
            { status: 500 }
        );
    }
}

// GET /api/affiliates/payout/request - Get payout history
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const affiliateId = searchParams.get('affiliateId');

        if (!affiliateId) {
            return NextResponse.json(
                { success: false, error: 'No autorizado' },
                { status: 401 }
            );
        }

        const payouts = await prisma.affiliatePayout.findMany({
            where: { affiliateId },
            orderBy: { requestedAt: 'desc' }
        });

        return NextResponse.json({
            success: true,
            payouts: payouts.map(p => ({
                id: p.id,
                amount: p.amount,
                amountFormatted: `$${(p.amount / 100).toFixed(2)}`,
                status: p.status,
                method: p.method,
                requestedAt: p.requestedAt,
                processedAt: p.processedAt,
                paidAt: p.paidAt,
                failureReason: p.failureReason
            }))
        });

    } catch (error) {
        console.error('Get payouts error:', error);
        return NextResponse.json(
            { success: false, error: 'Error al obtener pagos' },
            { status: 500 }
        );
    }
}

function getEstimatedPayoutDate(): string {
    // Payouts processed weekly on Fridays
    const now = new Date();
    const daysUntilFriday = (5 - now.getDay() + 7) % 7 || 7;
    const nextFriday = new Date(now);
    nextFriday.setDate(now.getDate() + daysUntilFriday);
    return nextFriday.toISOString().split('T')[0];
}
