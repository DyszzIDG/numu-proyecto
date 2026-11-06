import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/departments - List departments
export async function GET(request: NextRequest) {
    try {
        const departments = await prisma.department.findMany({
            orderBy: { name: 'asc' }
        });

        return NextResponse.json({
            success: true,
            data: departments,
            count: departments.length
        });

    } catch (error: any) {
        console.error('Error fetching departments:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
