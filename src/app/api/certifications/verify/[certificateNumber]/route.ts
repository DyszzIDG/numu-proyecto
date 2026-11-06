import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/certifications/verify/[certificateNumber] - Public verification
export async function GET(
    request: NextRequest,
    { params }: { params: { certificateNumber: string } }
) {
    try {
        const certificateNumber = params.certificateNumber;

        const certification = await prisma.certification.findUnique({
            where: { certificateNumber },
            include: {
                company: {
                    select: {
                        name: true,
                        industry: true,
                        country: true,
                        website: true
                    }
                },
                tier: {
                    select: {
                        name: true,
                        color: true,
                        icon: true
                    }
                }
            }
        });

        if (!certification) {
            return NextResponse.json({
                success: true,
                valid: false,
                message: 'Certificado no encontrado'
            });
        }

        // Check if expired
        const isExpired = certification.expiresAt && new Date() > new Date(certification.expiresAt);
        const isRevoked = certification.status === 'revoked';

        return NextResponse.json({
            success: true,
            valid: certification.status === 'active' && !isExpired && !isRevoked,
            certification: {
                certificateNumber: certification.certificateNumber,
                company: {
                    name: certification.company.name,
                    industry: certification.company.industry,
                    country: certification.company.country,
                    website: certification.company.website
                },
                tier: {
                    name: certification.tier.name,
                    color: certification.tier.color,
                    icon: certification.tier.icon
                },
                score: certification.score,
                issuedAt: certification.issuedAt,
                expiresAt: certification.expiresAt,
                status: certification.status,
                isExpired,
                isRevoked: certification.status === 'revoked',
                revokedReason: certification.revokedReason
            }
        });

    } catch (error) {
        console.error('Verify certification error:', error);
        return NextResponse.json(
            { success: false, error: 'Error al verificar certificado' },
            { status: 500 }
        );
    }
}
