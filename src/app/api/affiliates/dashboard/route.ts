import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/affiliates/dashboard - Get affiliate dashboard data
export async function GET(request: NextRequest) {
    try {
        // TODO: Get affiliate ID from session/auth
        const { searchParams } = new URL(request.url);
        const affiliateId = searchParams.get('affiliateId');

        if (!affiliateId) {
            return NextResponse.json(
                { success: false, error: 'No autorizado' },
                { status: 401 }
            );
        }

        // Get affiliate with stats
        const affiliate = await prisma.affiliate.findUnique({
            where: { id: affiliateId },
            include: {
                referrals: {
                    where: { status: { in: ['converted', 'active'] } },
                    include: {
                        company: {
                            select: {
                                name: true,
                                industry: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 10
                },
                clicks: {
                    orderBy: { clickedAt: 'desc' },
                    take: 20
                },
                payouts: {
                    orderBy: { requestedAt: 'desc' },
                    take: 10
                }
            }
        });

        if (!affiliate) {
            return NextResponse.json(
                { success: false, error: 'Afiliado no encontrado' },
                { status: 404 }
            );
        }

        // Calculate stats
        const activeReferrals = affiliate.referrals.filter(r => r.status === 'active').length;
        const conversionRate = affiliate.totalClicks > 0
            ? (affiliate.totalReferrals / affiliate.totalClicks) * 100
            : 0;

        const availableForPayout = affiliate.pendingEarnings -
            affiliate.payouts
                .filter(p => p.status === 'pending' || p.status === 'processing')
                .reduce((sum, p) => sum + p.amount, 0);

        // Monthly earnings (last 12 months)
        const monthlyEarnings = await calculateMonthlyEarnings(affiliateId);

        return NextResponse.json({
            success: true,
            affiliate: {
                name: affiliate.name,
                email: affiliate.email,
                code: affiliate.code,
                referralLink: `${process.env.NEXT_PUBLIC_URL}?ref=${affiliate.code}`,
                status: affiliate.status,
                isVerified: affiliate.isVerified
            },
            stats: {
                totalClicks: affiliate.totalClicks,
                totalReferrals: affiliate.totalReferrals,
                activeReferrals,
                conversionRate: Number(conversionRate.toFixed(2)),
                totalEarnings: affiliate.totalEarnings,
                pendingEarnings: affiliate.pendingEarnings,
                availableForPayout
            },
            recentReferrals: affiliate.referrals.map(r => ({
                id: r.id,
                company: r.company.name,
                industry: r.company.industry,
                status: r.status,
                monthlyRevenue: r.monthlyRevenue,
                commission: r.commission,
                convertedAt: r.convertedAt,
                expiresAt: r.expiresAt
            })),
            recentClicks: affiliate.clicks.map(c => ({
                id: c.id,
                clickedAt: c.clickedAt,
                country: c.country,
                converted: c.converted
            })),
            payouts: affiliate.payouts.map(p => ({
                id: p.id,
                amount: p.amount,
                status: p.status,
                requestedAt: p.requestedAt,
                paidAt: p.paidAt
            })),
            monthlyEarnings
        });

    } catch (error) {
        console.error('Get dashboard error:', error);
        return NextResponse.json(
            { success: false, error: 'Error al obtener dashboard' },
            { status: 500 }
        );
    }
}

async function calculateMonthlyEarnings(affiliateId: string) {
    // Get all referrals with their commission history
    const referrals = await prisma.referral.findMany({
        where: { affiliateId },
        select: {
            convertedAt: true,
            commission: true,
            monthlyRevenue: true
        }
    });

    // Group by month
    const monthlyData: { [key: string]: number } = {};
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[key] = 0;
    }

    // Calculate earnings per month (simplified - in reality would track each payment)
    referrals.forEach(ref => {
        if (ref.convertedAt) {
            const key = `${ref.convertedAt.getFullYear()}-${String(ref.convertedAt.getMonth() + 1).padStart(2, '0')}`;
            if (monthlyData[key] !== undefined) {
                // Simplified: divide total commission by months active
                monthlyData[key] += ref.monthlyRevenue * 0.20; // 20% commission
            }
        }
    });

    return Object.entries(monthlyData).map(([month, earnings]) => ({
        month,
        earnings: Math.floor(earnings)
    }));
}
