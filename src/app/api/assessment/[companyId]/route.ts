import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET current assessment for a company
export async function GET(
    request: NextRequest,
    { params }: { params: { companyId: string } }
) {
    try {
        const { companyId } = params;

        const assessment = await prisma.assessment.findFirst({
            where: {
                companyId,
                status: { in: ['in_progress', 'completed'] }
            },
            orderBy: { createdAt: 'desc' },
            include: {
                answers: true
            }
        });

        return NextResponse.json({
            success: true,
            assessment
        });

    } catch (error: any) {
        console.error('Error fetching assessment:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch assessment' },
            { status: 500 }
        );
    }
}

// POST - Save assessment progress
export async function POST(
    request: NextRequest,
    { params }: { params: { companyId: string } }
) {
    try {
        const { companyId } = params;
        const body = await request.json();
        const { answers } = body;

        // Find or create assessment
        let assessment = await prisma.assessment.findFirst({
            where: {
                companyId,
                status: 'in_progress'
            }
        });

        if (!assessment) {
            assessment = await prisma.assessment.create({
                data: {
                    companyId,
                    status: 'in_progress',
                    type: 'security_maturity'
                }
            });
        }

        // Delete existing answers and create new ones
        await prisma.assessmentAnswer.deleteMany({
            where: { assessmentId: assessment.id }
        });

        if (answers && answers.length > 0) {
            await prisma.assessmentAnswer.createMany({
                data: answers.map((a: any) => ({
                    assessmentId: assessment.id,
                    questionId: a.questionId,
                    value: String(a.value)
                }))
            });
        }

        return NextResponse.json({
            success: true,
            assessment
        });

    } catch (error: any) {
        console.error('Error saving assessment:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to save assessment' },
            { status: 500 }
        );
    }
}
