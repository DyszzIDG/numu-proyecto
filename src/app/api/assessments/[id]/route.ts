import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/assessments/[id] - Get assessment details
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const assessment = await prisma.assessment.findUnique({
            where: { id },
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
                { success: false, error: 'Assessment not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: assessment
        });

    } catch (error: any) {
        console.error('Error fetching assessment:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

// PUT /api/assessments/[id] - Update assessment
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();
        const {
            status,
            overallScore,
            maturityLevel,
            categoryScores,
            recommendations,
            completedAt
        } = body;

        const assessment = await prisma.assessment.update({
            where: { id },
            data: {
                status,
                overallScore,
                maturityLevel,
                categoryScores,
                recommendations,
                completedAt: completedAt ? new Date(completedAt) : null
            }
        });

        return NextResponse.json({
            success: true,
            assessment
        });

    } catch (error: any) {
        console.error('Error updating assessment:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
