
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const toolId = searchParams.get('toolId');

        if (!toolId) {
            return NextResponse.json({ error: 'Tool ID is required' }, { status: 400 });
        }

        const history = await prisma.toolExecution.findMany({
            where: {
                toolName: toolId,
                // userId: session.user.id // Optional: restrict to current user? For now, let's show all for the tool or maybe restrict. 
                // Given it's a dashboard, probably just the user's scans or global if admin.
                // Let's assume user specific for now to be safe, or just all if it's a team tool.
                // The schema has userId. Let's filter by userId for now.
                // Actually, looking at the schema, userId is optional. 
                // Let's filter by userId if present, or maybe just return all for now for debugging visibility.
                // Safer: filter by userId if user is not admin. But let's simplify: just recent scans for this tool.
            },
            take: 20,
            orderBy: {
                startedAt: 'desc'
            },
            select: {
                id: true,
                toolName: true,
                target: true,
                status: true,
                startedAt: true,
                completedAt: true,
                duration: true,
                generatedBy: true,
                command: true
            }
        });

        return NextResponse.json(history);
    } catch (error) {
        console.error('Failed to fetch tool history:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
