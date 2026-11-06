import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/assessments/[id]/answers - Submit answer
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id: assessmentId } = params;
        const body = await request.json();
        const { questionId, value, points } = body;

        if (!questionId || value === undefined || points === undefined) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if answer already exists
        const existing = await prisma.answer.findFirst({
            where: {
                assessmentId,
                questionId
            }
        });

        let answer;
        if (existing) {
            // Update existing answer
            answer = await prisma.answer.update({
                where: { id: existing.id },
                data: { value, points }
            });
        } else {
            // Create new answer
            answer = await prisma.answer.create({
                data: {
                    assessmentId,
                    questionId,
                    value,
                    points
                }
            });
        }

        return NextResponse.json({
            success: true,
            answer
        });

    } catch (error: any) {
        console.error('Error saving answer:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
