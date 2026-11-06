import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        // Get companyId from query params
        const { searchParams } = new URL(request.url);
        const companyId = searchParams.get('companyId');

        if (!companyId) {
            return NextResponse.json(
                { success: false, error: 'Company ID requerido' },
                { status: 400 }
            );
        }

        // Get all assessments for this company
        const assessments = await prisma.assessment.findMany({
            where: { companyId },
            include: {
                company: {
                    select: {
                        name: true,
                        industry: true
                    }
                }
            },
            orderBy: {
                startedAt: 'desc'
            }
        });

        return NextResponse.json({
            success: true,
            assessments
        });

    } catch (error) {
        console.error('Get assessments error:', error);
        return NextResponse.json(
            { success: false, error: 'Error del servidor' },
            { status: 500 }
        );
    }
}
