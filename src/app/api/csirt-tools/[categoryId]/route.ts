import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params }: { params: { categoryId: string } }
) {
    try {
        const { categoryId } = params;

        // Get category
        const category = await prisma.cSIRTCategory.findUnique({
            where: { id: categoryId },
        });

        if (!category) {
            return NextResponse.json(
                { error: 'Category not found' },
                { status: 404 }
            );
        }

        // Get tools for this category
        const tools = await prisma.cSIRTTool.findMany({
            where: { categoryId },
            orderBy: [
                { featured: 'desc' },
                { name: 'asc' },
            ],
        });

        return NextResponse.json({
            category: {
                id: category.id,
                name: category.name,
                description: category.description,
                icon: category.icon,
                color: category.color,
            },
            tools,
        });
    } catch (error) {
        console.error('Error fetching tools:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
