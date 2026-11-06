
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        // 1. General Stats
        // Total Challenges
        const challengesCountRes: any = await prisma.$queryRaw`SELECT COUNT(*)::int as count FROM "CTFChallenge" WHERE "isActive" = true`;
        const challengesCount = challengesCountRes[0]?.count || 0;

        // Total Solves (Flags Capturadas)
        const solvesCountRes: any = await prisma.$queryRaw`SELECT COUNT(*)::int as count FROM "CTFSolve"`;
        const solvesCount = solvesCountRes[0]?.count || 0;

        // Total Participants (Unique users who solved at least one challenge, or total enrolled in CTF programs?)
        // The image shows "Participantes" for each program. Let's count enrollments in CTF programs as a proxy for "Participants" in the CTF eco.
        // Or simpler, sum of enrollments in courses belonging to CTF programs.
        // Actually, let's use Users who have at least one solve as "Active Participants" for the global stat.
        const participantsRes: any = await prisma.$queryRaw`SELECT COUNT(DISTINCT "userId")::int as count FROM "CTFSolve"`;
        // Fallback: If 0 solves (fresh dev), count users enrolled in 'ctf' related programs?
        // Let's stick to Solvers or just Total Users for the "Participantes" global card if solves are 0, to match "234" mock style.
        let participantsCount = participantsRes[0]?.count || 0;
        if (participantsCount === 0) {
            const userCount: any = await prisma.$queryRaw`SELECT COUNT(*)::int as count FROM "User"`;
            participantsCount = userCount[0]?.count || 0; // Use total users as baseline for demo
        }

        // Competitions (Active CTF Programs)
        // We consider a Program a "Competition" if it has CTF Challenges
        const competitionsRes: any = await prisma.$queryRaw`
            SELECT COUNT(DISTINCT "programId")::int as count 
            FROM "CTFChallenge" 
            WHERE "programId" IS NOT NULL
        `;
        const competitionsCount = competitionsRes[0]?.count || 0;


        // 2. Program Breakdown (General Section)
        // We need to fetch programs that have challenges, and count their challenges + participants
        const programsData: any = await prisma.$queryRaw`
            SELECT 
                p.id,
                p.slug,
                p.name,
                p.icon,
                p.color,
                (SELECT COUNT(*)::int FROM "CTFChallenge" c WHERE c."programId" = p.id AND c."isActive" = true) as challenges_count,
                (SELECT COUNT(*)::int FROM "Enrollment" e 
                 JOIN "Course" c ON e."courseId" = c.id 
                 WHERE c."programId" = p.id) as participants_count
            FROM "Program" p
            WHERE (SELECT COUNT(*) FROM "CTFChallenge" c WHERE c."programId" = p.id) > 0
        `;

        const formattedPrograms = programsData.map((p: any) => ({
            id: p.slug, // Use slug for frontend routing
            name: p.name,
            icon: p.icon || 'Shield',
            color: p.color || 'from-gray-500 to-slate-500',
            participants: p.participants_count || 0,
            challenges: p.challenges_count || 0,
            originalId: p.id
        }));

        return NextResponse.json({
            stats: {
                activeChallenges: challengesCount,
                participants: participantsCount,
                flagsCaptured: solvesCount,
                competitions: competitionsCount
            },
            programs: formattedPrograms
        });

    } catch (error) {
        console.error('Error fetching CTF dashboard stats:', error);
        return NextResponse.json({ error: 'Failed to fetch CTF stats' }, { status: 500 });
    }
}
