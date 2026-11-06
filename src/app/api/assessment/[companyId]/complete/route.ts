import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Complete assessment and calculate score
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

        // Calculate score
        // Each question is answered on a 0-4 scale
        // Score = (sum of all answers / (number of questions * 4)) * 100
        const totalPossible = answers.length * 4;
        const totalAchieved = answers.reduce((sum: number, a: any) => sum + a.value, 0);
        const score = Math.round((totalAchieved / totalPossible) * 100);

        // Update assessment as completed
        const updatedAssessment = await prisma.assessment.update({
            where: { id: assessment.id },
            data: {
                status: 'completed',
                score,
                completedAt: new Date()
            }
        });

        return NextResponse.json({
            success: true,
            assessment: updatedAssessment,
            score
        });

    } catch (error: any) {
        console.error('Error completing assessment:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to complete assessment' },
            { status: 500 }
        );
    }
}
