import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const assessmentId = params.id;
        const { searchParams } = new URL(request.url);
        const companyId = searchParams.get('companyId');

        if (!companyId) {
            return NextResponse.json(
                { success: false, error: 'Company ID requerido' },
                { status: 400 }
            );
        }

        // Get assessment with all details
        const assessment = await prisma.assessment.findUnique({
            where: { id: assessmentId },
            include: {
                company: true,
                answers: {
                    include: {
                        question: {
                            include: {
                                category: true
                            }
                        }
                    }
                }
            }
        });

        if (!assessment) {
            return NextResponse.json(
                { success: false, error: 'Evaluación no encontrada' },
                { status: 404 }
            );
        }

        // Verify the assessment belongs to the company
        if (assessment.companyId !== companyId) {
            return NextResponse.json(
                { success: false, error: 'No autorizado' },
                { status: 403 }
            );
        }

        return NextResponse.json({
            success: true,
            assessment
        });

    } catch (error) {
        console.error('Get assessment error:', error);
        return NextResponse.json(
            { success: false, error: 'Error del servidor' },
            { status: 500 }
        );
    }
}
