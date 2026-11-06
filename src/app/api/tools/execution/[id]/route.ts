import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthenticatedUser } from '@/lib/auth/unified';

const prisma = new PrismaClient();

/**
 * GET /api/tools/execution/[id]
 * Fetch detailed information about a specific tool execution
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const authenticatedUser = await getAuthenticatedUser();

        if (!authenticatedUser) {
            // In development, allow bypass for testing purposes
            if (process.env.NODE_ENV === 'development') {
                console.warn('⚠️ bypassing auth check in development mode');
            } else {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        const executionId = params.id;

        // Build where clause based on user type
        const whereClause: any = {
            id: executionId,
        };

        // Ensure user can only access their own executions (unless in dev bypass)
        if (authenticatedUser) {
            if (authenticatedUser.type === 'user') {
                whereClause.userId = authenticatedUser.id;
            } else {
                whereClause.employeeId = authenticatedUser.id;
            }
        }

        const execution = await prisma.toolExecution.findFirst({
            where: whereClause,
        });

        if (!execution) {
            return NextResponse.json(
                { error: 'Execution not found' },
                { status: 404 }
            );
        }

        // Parse AI analysis if it exists
        let aiAnalysis = null;
        if (execution.aiAnalysis) {
            try {
                aiAnalysis = JSON.parse(execution.aiAnalysis);
            } catch (e) {
                console.error('Failed to parse AI analysis:', e);
            }
        }

        // Parse JSON result if it exists
        let jsonResult = null;
        if (execution.jsonResult) {
            try {
                jsonResult = JSON.parse(execution.jsonResult);
            } catch (e) {
                console.error('Failed to parse JSON result:', e);
            }
        }

        console.log(`[API] Fetching execution ${execution.id} (${execution.toolName}). RawOutput Length: ${execution.rawOutput?.length || 0}`);

        return NextResponse.json({
            id: execution.id,
            toolName: execution.toolName,
            target: execution.target,
            command: execution.command,
            status: execution.status,
            startedAt: execution.startedAt,
            completedAt: execution.completedAt,
            duration: execution.duration,
            rawOutput: execution.rawOutput,
            aiAnalysis,
            jsonResult,
            generatedBy: execution.generatedBy,
            aiPrompt: execution.aiPrompt,
            error: execution.error,
        });
    } catch (error) {
        console.error('Error fetching execution details:', error);
        return NextResponse.json(
            { error: 'Failed to fetch execution details' },
            { status: 500 }
        );
    }
}
