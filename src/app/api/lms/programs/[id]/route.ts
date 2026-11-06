
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Find program by slug
        const program = await prisma.program.findUnique({
            where: { slug: params.id },
            include: {
                courses: {
                    include: {
                        enrollments: true
                    }
                }
            }
        });

        if (!program) {
            return NextResponse.json({ error: 'Program not found' }, { status: 404 });
        }

        // Format for frontend
        const formattedProgram = {
            id: program.slug,
            name: program.name,
            description: program.description,
            color: program.color,
            courses: program.courses.map(c => ({
                id: c.id,
                title: c.title,
                description: c.description,
                duration: c.duration,
                students: (c.enrollments?.length || 0) + 12, // Mock baseline
                progress: Math.floor(Math.random() * (100 - 0 + 1)) // Mock progress for list view
            }))
        };

        return NextResponse.json(formattedProgram);

    } catch (error) {
        console.error('Error fetching program detail:', error);
        return NextResponse.json({ error: 'Failed to fetch program' }, { status: 500 });
    }
}
