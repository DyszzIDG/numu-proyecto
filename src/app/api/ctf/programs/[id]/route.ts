
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const slug = params.id;

        // Get Program details
        const programRes: any = await prisma.$queryRaw`
            SELECT 
                p.id, 
                p.slug, 
                p.name, 
                p.description, 
                p.icon, 
                p.color,
                (SELECT COUNT(*)::int FROM "Enrollment" e 
                 JOIN "Course" c ON e."courseId" = c.id 
                 WHERE c."programId" = p.id) as participants
            FROM "Program" p 
            WHERE p.slug = ${slug}
        `;

        if (!programRes || programRes.length === 0) {
            return NextResponse.json({ error: 'Program not found' }, { status: 404 });
        }
        const program = programRes[0];

        // Get Challenges
        const challengesRes: any = await prisma.$queryRaw`
            SELECT id, title, category, difficulty, points, "isActive"
            FROM "CTFChallenge"
            WHERE "programId" = ${program.id} AND "isActive" = true
            ORDER BY points ASC
        `;

        const challenges = challengesRes.map((c: any) => ({
            id: c.id,
            title: c.title,
            category: c.category,
            difficulty: c.difficulty,
            points: c.points,
            solved: false // Placeholder: requires user session to check 'CTFSolve'
        }));

        return NextResponse.json({
            program: {
                id: program.slug,
                name: program.name,
                description: program.description,
                icon: program.icon,
                color: program.color,
                participants: program.participants || 0,
                activeChallengesCount: challenges.length
            },
            challenges
        });

    } catch (error) {
        console.error('Error fetching CTF program:', error);
        return NextResponse.json({ error: 'Failed to fetch program' }, { status: 500 });
    }
}
