import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/certifications/tiers - Get all certification tiers
export async function GET(request: NextRequest) {
    try {
        const tiers = await prisma.certificationTier.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' }
        });

        // Parse benefits JSON for each tier
        const tiersWithParsedBenefits = tiers.map(tier => ({
            ...tier,
            benefits: JSON.parse(tier.benefits),
            priceFormatted: `$${(tier.price / 100).toFixed(0)}`
        }));

        return NextResponse.json({
            success: true,
            tiers: tiersWithParsedBenefits
        });

    } catch (error) {
        console.error('Get tiers error:', error);
        return NextResponse.json(
            { success: false, error: 'Error al obtener niveles de certificación' },
            { status: 500 }
        );
    }
}
