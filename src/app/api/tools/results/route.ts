import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuthenticatedUser } from '@/lib/auth/unified';
import { TOOL_CATEGORIES, getToolsByCategory } from '@/lib/tools/security-tools-db';

const prisma = new PrismaClient();

/**
 * GET /api/tools/results
 * Fetch aggregated tool execution results grouped by category
 */
export async function GET(request: NextRequest) {
    try {
        let authenticatedUser = await getAuthenticatedUser();

        if (!authenticatedUser) {
            // In development, allow bypass for testing purposes
            if (process.env.NODE_ENV === 'development') {
                console.warn('⚠️ bypassing auth check in development mode');
                // Create a mock user for dev context
                authenticatedUser = { id: 'dev-user-id', email: 'dev@example.com', role: 'admin', type: 'user' } as any;
            } else {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        // Get user data based on type
        let user;
        if (authenticatedUser.type === 'user') {
            user = await prisma.user.findUnique({
                where: { id: authenticatedUser.id },
            });
        } else {
            // For employees, create a user-like object
            const employee = await prisma.employee.findUnique({
                where: { id: authenticatedUser.id },
            });
            if (employee) {
                user = {
                    id: employee.id,
                    email: employee.email,
                    role: employee.role,
                    isAdmin: employee.role === 'admin',
                };
            }
        }

        if (!user) {
            if (process.env.NODE_ENV === 'development' && authenticatedUser.id === 'dev-user-id') {
                // Mock user object for dev
                user = { id: 'dev-user-id', email: 'dev@example.com', role: 'admin' };
            } else {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }
        }

        const { searchParams } = new URL(request.url);
        const categoryFilter = searchParams.get('category');
        const statusFilter = searchParams.get('status');
        const daysBack = parseInt(searchParams.get('days') || '30');

        // Calculate date range
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysBack);

        // Build where clause based on user type
        const whereClause: any = {
            startedAt: {
                gte: startDate,
            },
            ...(statusFilter && { status: statusFilter }),
        };

        // Add user/employee filter
        if (process.env.NODE_ENV === 'development' && user.id === 'dev-user-id') {
            // For dev user, find executions with NO user ID (created by dev user)
            whereClause.userId = null;
        } else if (authenticatedUser.type === 'user') {
            whereClause.userId = user.id;
        } else {
            whereClause.employeeId = user.id;
        }

        // Fetch tool executions
        const executions = await prisma.toolExecution.findMany({
            where: whereClause,
            orderBy: {
                startedAt: 'desc',
            },
            take: 100,
        });

        // Group executions by category
        const categoriesData = Object.values(TOOL_CATEGORIES).map((categoryName) => {
            const categoryTools = getToolsByCategory(categoryName);
            const toolIds = categoryTools.map((t) => t.id);

            // Filter executions for this category
            const categoryExecutions = executions.filter((exec: any) =>
                toolIds.includes(exec.toolName)
            );

            // Calculate statistics
            const totalExecutions = categoryExecutions.length;
            const successfulExecutions = categoryExecutions.filter(
                (e: any) => e.status === 'completed'
            ).length;
            const failedExecutions = categoryExecutions.filter(
                (e: any) => e.status === 'failed'
            ).length;
            const successRate =
                totalExecutions > 0
                    ? Math.round((successfulExecutions / totalExecutions) * 100)
                    : 0;

            // Calculate average duration
            const completedWithDuration = categoryExecutions.filter(
                (e: any) => e.duration !== null && e.duration !== undefined
            );
            const avgDuration =
                completedWithDuration.length > 0
                    ? Math.round(
                        completedWithDuration.reduce((sum: number, e: any) => sum + (e.duration || 0), 0) /
                        completedWithDuration.length
                    )
                    : 0;

            // Get most recent execution
            const recentExecution = categoryExecutions[0];

            return {
                category: categoryName,
                toolCount: categoryTools.length,
                totalExecutions,
                successfulExecutions,
                failedExecutions,
                successRate,
                avgDuration,
                recentExecution: recentExecution
                    ? {
                        id: recentExecution.id,
                        toolName: recentExecution.toolName,
                        target: recentExecution.target,
                        status: recentExecution.status,
                        startedAt: recentExecution.startedAt,
                        duration: recentExecution.duration,
                    }
                    : null,
            };
        });

        // Filter by category if specified
        const filteredCategories = categoryFilter
            ? categoriesData.filter((c: any) => c.category === categoryFilter)
            : categoriesData;

        // Calculate overall statistics
        const totalScans = executions.length;
        const totalSuccessful = executions.filter((e: any) => e.status === 'completed').length;
        const totalFailed = executions.filter((e: any) => e.status === 'failed').length;
        const overallSuccessRate =
            totalScans > 0 ? Math.round((totalSuccessful / totalScans) * 100) : 0;

        // Get most used tools
        const toolUsage = executions.reduce((acc: Record<string, number>, exec) => {
            acc[exec.toolName] = (acc[exec.toolName] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const mostUsedTools = Object.entries(toolUsage)
            .sort(([, a], [, b]) => (b as number) - (a as number))
            .slice(0, 5)
            .map(([tool, count]) => ({ tool, count }));

        // Get recent executions (last 10)
        const recentExecutions = executions.slice(0, 10).map((exec: any) => ({
            id: exec.id,
            toolName: exec.toolName,
            target: exec.target,
            status: exec.status,
            startedAt: exec.startedAt,
            completedAt: exec.completedAt,
            duration: exec.duration,
            generatedBy: exec.generatedBy,
            rawOutput: exec.rawOutput,
            error: exec.error,
            aiAnalysis: exec.aiAnalysis
        }));

        return NextResponse.json({
            categories: filteredCategories,
            summary: {
                totalScans,
                totalSuccessful,
                totalFailed,
                overallSuccessRate,
                mostUsedTools,
                dateRange: {
                    from: startDate,
                    to: new Date(),
                    days: daysBack,
                },
            },
            recentExecutions,
        });
    } catch (error) {
        console.error('Error fetching tool results:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tool results' },
            { status: 500 }
        );
    }
}
