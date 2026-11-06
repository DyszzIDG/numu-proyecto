import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/affiliates/track-click - Track referral click
export async function POST(request: NextRequest) {
    try {
        const { code, metadata } = await request.json();

        if (!code) {
            return NextResponse.json(
                { success: false, error: 'Código de referido requerido' },
                { status: 400 }
            );
        }

        // Find affiliate
        const affiliate = await prisma.affiliate.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!affiliate) {
            return NextResponse.json(
                { success: false, error: 'Código de referido inválido' },
                { status: 404 }
            );
        }

        // Track click
        await prisma.affiliateClick.create({
            data: {
                affiliateId: affiliate.id,
                ipAddress: metadata?.ipAddress,
                userAgent: metadata?.userAgent,
                referer: metadata?.referer,
                country: metadata?.country
            }
        });

        // Update affiliate stats
        await prisma.affiliate.update({
            where: { id: affiliate.id },
            data: {
                totalClicks: { increment: 1 }
            }
        });

        return NextResponse.json({
            success: true,
            tracked: true
        });

    } catch (error) {
        console.error('Track click error:', error);
        return NextResponse.json(
            { success: false, error: 'Error al trackear click' },
            { status: 500 }
        );
    }
}

// GET /api/affiliates/track-click?code=XXX - Get affiliate info for tracking
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');

        if (!code) {
            return NextResponse.json(
                { success: false, error: 'Código requerido' },
                { status: 400 }
            );
        }

        const affiliate = await prisma.affiliate.findUnique({
            where: { code: code.toUpperCase() },
            select: {
                id: true,
                name: true,
                code: true,
                status: true
            }
        });

        if (!affiliate || affiliate.status !== 'active') {
            return NextResponse.json({
                success: true,
                valid: false
            });
        }

        return NextResponse.json({
            success: true,
            valid: true,
            affiliate: {
                name: affiliate.name,
                code: affiliate.code
            }
        });

    } catch (error) {
        console.error('Get affiliate error:', error);
        return NextResponse.json(
            { success: false, error: 'Error del servidor' },
            { status: 500 }
        );
    }
}
