
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const programs = await prisma.program.findMany({
            include: {
                courses: {
                    include: {
                        enrollments: true
                    }
                }
            }
        });

        // Calculate stats for dashboard
        const programsWithStats = programs.map(program => {
            const totalStudents = program.courses.reduce((acc, course) => acc + (course.enrollments?.length || 0) + 10, 0); // +10 mock for visual
            const totalModules = program.courses.length;

            // Mock completion for now as we don't have full enrollment history seeded
            const completion = Math.floor(Math.random() * (90 - 60 + 1)) + 60;

            return {
                id: program.slug, // Use slug as ID for frontend compatibility
                originalId: program.id,
                name: program.name,
                subtitle: program.subtitle || program.name,
                description: program.description,
                color: program.color,
                students: totalStudents,
                courses: totalModules,
                completion: completion
            };
        });

        return NextResponse.json(programsWithStats);

    } catch (error) {
        console.error('Error fetching programs:', error);
        return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 });
    }
}
