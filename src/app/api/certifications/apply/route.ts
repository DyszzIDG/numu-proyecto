import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/certifications/apply - Apply for certification
export async function POST(request: NextRequest) {
    try {
        const { companyId, assessmentId, tierId, isPublic } = await request.json();

        // Validate input
        if (!companyId || !assessmentId || !tierId) {
            return NextResponse.json(
                { success: false, error: 'Datos incompletos' },
                { status: 400 }
            );
        }

        // Get assessment to verify score
        const assessment = await prisma.assessment.findUnique({
            where: { id: assessmentId },
            include: { company: true }
        });

        if (!assessment) {
            return NextResponse.json(
                { success: false, error: 'Evaluación no encontrada' },
                { status: 404 }
            );
        }

        // Verify assessment belongs to company
        if (assessment.companyId !== companyId) {
            return NextResponse.json(
                { success: false, error: 'No autorizado' },
                { status: 403 }
            );
        }

        // Verify assessment is completed
        if (assessment.status !== 'completed' || !assessment.overallScore) {
            return NextResponse.json(
                { success: false, error: 'La evaluación debe estar completada' },
                { status: 400 }
            );
        }

        // Get tier
        const tier = await prisma.certificationTier.findUnique({
            where: { id: tierId }
        });

        if (!tier) {
            return NextResponse.json(
                { success: false, error: 'Nivel de certificación no encontrado' },
                { status: 404 }
            );
        }

        // Verify score qualifies for tier
        if (assessment.overallScore < tier.minScore || assessment.overallScore > tier.maxScore) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Tu puntuación (${assessment.overallScore}%) no califica para ${tier.name}. Rango requerido: ${tier.minScore}-${tier.maxScore}%`
                },
                { status: 400 }
            );
        }

        // Generate certificate number
        const year = new Date().getFullYear();
        const count = await prisma.certification.count();
        const certificateNumber = `NUMU-${year}-${String(count + 1).padStart(5, '0')}`;

        // Create certification
        const certification = await prisma.certification.create({
            data: {
                companyId,
                tierId,
                assessmentId,
                certificateNumber,
                score: assessment.overallScore,
                status: 'pending',
                isPublic: isPublic || false
            },
            include: {
                tier: true,
                company: true,
                assessment: true
            }
        });

        // TODO: Create Stripe checkout session here
        // For now, we'll return the certification without payment

        return NextResponse.json({
            success: true,
            certification: {
                id: certification.id,
                certificateNumber: certification.certificateNumber,
                status: certification.status,
                tier: {
                    name: certification.tier.name,
                    price: certification.tier.price,
                    priceFormatted: `$${(certification.tier.price / 100).toFixed(0)}`
                },
                // paymentUrl: checkoutSession.url // Will add when Stripe is integrated
                message: 'Certificación creada. Integración de pagos próximamente.'
            }
        });

    } catch (error) {
        console.error('Apply certification error:', error);
        return NextResponse.json(
            { success: false, error: 'Error al solicitar certificación' },
            { status: 500 }
        );
    }
}

// GET /api/certifications/apply - Get eligible tier for company
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const companyId = searchParams.get('companyId');

        if (!companyId) {
            return NextResponse.json(
                { success: false, error: 'Company ID requerido' },
                { status: 400 }
            );
        }

        // Get latest completed assessment
        const assessment = await prisma.assessment.findFirst({
            where: {
                companyId,
                status: 'completed',
                overallScore: { not: null }
            },
            orderBy: { completedAt: 'desc' }
        });

        if (!assessment || !assessment.overallScore) {
            return NextResponse.json({
                success: true,
                eligible: false,
                message: 'No hay evaluaciones completadas'
            });
        }

        // Find eligible tier
        const tier = await prisma.certificationTier.findFirst({
            where: {
                minScore: { lte: assessment.overallScore },
                maxScore: { gte: assessment.overallScore },
                isActive: true
            }
        });

        if (!tier) {
            return NextResponse.json({
                success: true,
                eligible: false,
                score: assessment.overallScore,
                message: 'Puntuación no califica para certificación (mínimo 50%)'
            });
        }

        return NextResponse.json({
            success: true,
            eligible: true,
            score: assessment.overallScore,
            tier: {
                ...tier,
                benefits: JSON.parse(tier.benefits),
                priceFormatted: `$${(tier.price / 100).toFixed(0)}`
            },
            assessment: {
                id: assessment.id,
                completedAt: assessment.completedAt
            }
        });

    } catch (error) {
        console.error('Get eligible tier error:', error);
        return NextResponse.json(
            { success: false, error: 'Error del servidor' },
            { status: 500 }
        );
    }
}
