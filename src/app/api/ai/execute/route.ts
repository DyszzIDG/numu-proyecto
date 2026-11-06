/**
 * AI-Powered Tool Execution API
 * Handles natural language requests and converts them to security scans
 * Now supports 50+ security tools
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth/unified';
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { promisify } from 'util';
import { QuotaManager } from '@/lib/quota-manager';
import { AIAgent } from '@/lib/ai/agent';
import { UniversalToolGenerator } from '@/lib/tools/universal-generator';
import { getToolById } from '@/lib/tools/security-tools-db';
import { ScanProcessor } from '@/lib/services/scan-processor';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

export interface AIToolRequest {
    userPrompt: string;
    toolId?: string;
    target?: string;
}

export async function POST(request: NextRequest) {
    try {
        // 1. Authenticate using unified helper (supports User and Employee)
        let authUser = await getAuthenticatedUser();

        if (!authUser) {
            // In development, allow bypass for testing purposes
            if (process.env.NODE_ENV === 'development') {
                console.warn('⚠️ bypassing auth check in development mode');
                // Create a mock user for dev context
                authUser = { id: 'dev-user-id', email: 'dev@example.com', role: 'admin', type: 'user' } as any;
            } else {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        }

        if (!authUser) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse request
        const body: AIToolRequest = await request.json();
        const { userPrompt, toolId, target } = body;

        if (!userPrompt) {
            return NextResponse.json(
                { error: 'Missing userPrompt' },
                { status: 400 }
            );
        }

        // 3. Check quota (Only for standard users)
        if (authUser.type === 'user') {
            const canExecute = await QuotaManager.canExecuteScan(authUser.id);
            if (!canExecute) {
                const quotaStatus = await QuotaManager.getQuotaStatus(authUser.id);
                return NextResponse.json(
                    {
                        error: 'Scan quota exceeded',
                        quotaStatus,
                        upgradeUrl: '/dashboard/subscription',
                    },
                    { status: 403 }
                );
            }
        }

        // 4. Determine tool if not specified
        const selectedToolId = toolId || inferTool(userPrompt);
        const toolInfo = getToolById(selectedToolId);

        if (!toolInfo) {
            return NextResponse.json(
                { error: `Tool '${selectedToolId}' not found` },
                { status: 400 }
            );
        }

        // 5. Check if tool requires API key
        if (toolInfo.requiresApiKey && !process.env.FOFA_API_KEY) {
            return NextResponse.json(
                { error: `Tool '${toolInfo.name}' requires API key configuration` },
                { status: 400 }
            );
        }

        // 6. Generate command using Universal Generator
        let commandResult: any;
        try {
            commandResult = UniversalToolGenerator.generate({
                toolId: selectedToolId,
                userPrompt,
                target,
            });
        } catch (genError: any) {
            return NextResponse.json(
                { error: `Failed to generate command: ${genError.message}` },
                { status: 400 }
            );
        }

        // 7. Create execution record
        const executionData: any = {
            toolName: toolInfo.name,
            target: target || 'inferred from prompt',
            parameters: JSON.stringify({
                userPrompt,
                aiGenerated: true,
                toolId: selectedToolId,
            }),
            command: commandResult.command,
            status: 'pending',
            aiPrompt: userPrompt,
            generatedBy: 'ai',
        };

        if (authUser.type === 'user') {
            // Skip linking execution to user if it's the dev mock user (avoids FK constraint error)
            executionData.userId = authUser.id === 'dev-user-id' ? undefined : authUser.id;
        } else {
            executionData.employeeId = authUser.id;
        }

        const execution = await prisma.toolExecution.create({
            data: executionData,
        });

        // 8. Background execution function
        const runAIHelper = async () => {
            try {
                // Consume quota (Only for standard users)
                if (authUser.type === 'user') {
                    await QuotaManager.consumeQuota(authUser.id);
                }

                // Execute command (if requires Docker)
                const startTime = Date.now();
                await prisma.toolExecution.update({
                    where: { id: execution.id },
                    data: { status: 'running' },
                });

                let rawOutput: string;
                let executionError: string | null = null;

                try {
                    if (toolInfo.requiresDocker) {
                        // Execute in Docker container
                        let finalCommand: string;
                        if (commandResult.command.trim().startsWith('docker exec')) {
                            finalCommand = commandResult.command;
                        } else {
                            finalCommand = `docker exec csirt-ubuntu bash -c "${commandResult.command.replace(/"/g, '\\"')}"`;
                        }

                        // Increased timeout for background job
                        const { stdout, stderr } = await execAsync(finalCommand, {
                            timeout: 3600000, // 1 hour
                            maxBuffer: 1024 * 1024 * 50, // 50MB
                        });

                        rawOutput = stdout || stderr || '';
                    } else {
                        // For API-based tools (like FOFA)
                        // TODO: Implement actual API call logic for FOFA/others here if not just command generation
                        rawOutput = `Command: ${commandResult.command}\nNote: This tool requires API execution, not Docker.`;
                    }
                } catch (error: any) {
                    const errorMessage = error.message || '';
                    if (errorMessage.includes('npipe') || errorMessage.includes('connect to the docker API')) {
                        executionError = 'Docker Desktop is not running. Please start Docker Desktop and try again.';
                        rawOutput = 'Docker connection failed.';
                    } else {
                        rawOutput = error.stdout || error.stderr || '';
                        executionError = error.message;
                    }
                }

                const duration = Math.floor((Date.now() - startTime) / 1000);

                // Analyze results with AI (if we have output)
                let aiAnalysis = null;
                let jsonResult = null;
                if (rawOutput && !executionError) {
                    try {
                        aiAnalysis = await AIAgent.analyzeResults({
                            tool: toolInfo.name,
                            target: target || 'unknown',
                            rawOutput,
                        });
                        jsonResult = aiAnalysis?.vulnerabilities || null;
                    } catch (error: any) {
                        console.error('AI analysis error:', error);
                        // Continue without AI analysis
                    }
                }

                // Update execution record
                const updatedExecution = await prisma.toolExecution.update({
                    where: { id: execution.id },
                    data: {
                        status: executionError ? 'failed' : 'completed',
                        rawOutput,
                        jsonResult: jsonResult ? JSON.stringify(jsonResult) : null,
                        aiAnalysis: aiAnalysis ? JSON.stringify(aiAnalysis) : null,
                        completedAt: new Date(),
                        duration,
                        error: executionError,
                    },
                });

                // Process scan for CSIRT sections (async, don't wait)
                if (!executionError && updatedExecution.status === 'completed') {
                    ScanProcessor.processScan({
                        executionId: execution.id,
                        toolName: toolInfo.name,
                        target: target || 'unknown',
                        rawOutput: rawOutput || '',
                        aiAnalysis,
                        jsonResult,
                    }).catch((err) => {
                        console.error('Error processing scan for CSIRT:', err);
                    });
                }

            } catch (bgError) {
                console.error('Background AI execution error:', bgError);
                await prisma.toolExecution.update({
                    where: { id: execution.id },
                    data: {
                        status: 'failed',
                        error: 'Internal background execution error',
                        completedAt: new Date(),
                    },
                });
            }
        };

        // Fire and forget
        runAIHelper();

        // 9. Return results IMMEDIATELY (pending)
        let quotaStatus;
        if (authUser.type === 'user') {
            quotaStatus = await QuotaManager.getQuotaStatus(authUser.id);
        } else {
            // Mock unlimited quota for employees
            quotaStatus = {
                plan: 'premium',
                quota: -1,
                used: 0,
                remaining: -1,
                resetDate: new Date(),
                canExecute: true
            };
        }

        return NextResponse.json({
            success: true,
            executionId: execution.id,
            tool: toolInfo.name,
            toolId: selectedToolId,
            command: commandResult.command,
            status: 'pending',
            explanation: commandResult.explanation,
            estimatedDuration: commandResult.estimatedDuration,
            quotaStatus,
            message: 'Scan started in background',
        });

    } catch (error: any) {
        console.error('AI tool execution error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * Infer which tool to use based on user prompt
 */
function inferTool(prompt: string): string {
    const lowerPrompt = prompt.toLowerCase();

    // Web scanning
    if (lowerPrompt.includes('web') || lowerPrompt.includes('http') || lowerPrompt.includes('website')) {
        if (lowerPrompt.includes('sql') || lowerPrompt.includes('injection')) return 'sqlmap';
        if (lowerPrompt.includes('directory') || lowerPrompt.includes('files')) return 'dirb';
        return 'nikto';
    }

    // Network scanning
    if (lowerPrompt.includes('port') || lowerPrompt.includes('network') || lowerPrompt.includes('scan')) {
        if (lowerPrompt.includes('fast') || lowerPrompt.includes('quick')) return 'rustscan';
        return 'nmap';
    }

    // OSINT
    if (lowerPrompt.includes('email') || lowerPrompt.includes('subdomain') || lowerPrompt.includes('people')) {
        return 'theharvester';
    }

    // Brute force
    if (lowerPrompt.includes('brute') || lowerPrompt.includes('password') || lowerPrompt.includes('login')) {
        if (lowerPrompt.includes('hash')) return 'john';
        return 'hydra';
    }

    // Wireless
    if (lowerPrompt.includes('wifi') || lowerPrompt.includes('wireless')) {
        return 'wifite';
    }

    // Default
    return 'nmap';
}
