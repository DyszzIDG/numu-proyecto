import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/questions - Get all questions grouped by category
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('category');

        const categories = await prisma.assessmentCategory.findMany({
            where: categoryId ? { id: categoryId } : undefined,
            include: {
                questions: {
                    orderBy: { order: 'asc' }
                }
            },
            orderBy: { order: 'asc' }
        });

        return NextResponse.json({
            success: true,
            data: categories
        });

    } catch (error: any) {
        console.error('Error fetching questions:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
