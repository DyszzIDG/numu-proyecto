
import { NextResponse } from 'next/server';
import { DockerRunner } from '@/lib/docker/DockerRunner';
import { ScanProcessor } from '@/lib/services/scan-processor';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
    try {
        const { target, prompt, tools } = await req.json();

        if (!target || !tools || !Array.isArray(tools)) {
            return NextResponse.json({ message: "Invalid request parameters" }, { status: 400 });
        }

        const results = [];
        const executionId = uuidv4(); // Group ID conceptually

        console.log(`🤖 Starting AI Operations on ${target} with prompt: "${prompt}"`);

        // Execute tools sequentially to avoid resource contention (can be parallelized later)
        for (const toolId of tools) {
            try {
                let output = "";
                let toolName = toolId;

                // Map tool ID to DockerRunner method
                switch (toolId) {
                    case 'nmap':
                        output = await DockerRunner.runNmap(target);
                        break;
                    case 'nikto':
                        output = await DockerRunner.runNikto(target);
                        break;
                    case 'whatweb':
                        output = await DockerRunner.runWhatWeb(target);
                        break;
                    case 'theharvester':
                        output = await DockerRunner.runTheHarvester(target);
                        break;
                    case 'testssl':
                        output = await DockerRunner.runTestSSL(target);
                        break;
                    case 'nuclei':
                        output = await DockerRunner.runNuclei(target);
                        break;
                    default:
                        console.warn(`Tool ${toolId} not supported in AI batch`);
                        continue;
                }

                // Process result
                await ScanProcessor.processScan({
                    executionId: uuidv4(),
                    toolName: toolId,
                    target,
                    rawOutput: output,
                    aiAnalysis: {
                        summary: `Automated execution via AI Operations. Prompt context: ${prompt.substring(0, 50)}...`
                    }
                });

                results.push({ tool: toolId, status: 'success' });

            } catch (error: any) {
                console.error(`Failed to execute ${toolId}:`, error);
                results.push({ tool: toolId, status: 'failed', error: error.message });

                // Record failure
                await ScanProcessor.processScan({
                    executionId: uuidv4(),
                    toolName: toolId,
                    target,
                    rawOutput: `Execution Failed: ${error.message}`,
                    aiAnalysis: { summary: 'Tool execution failed during AI Operation.' }
                });
            }
        }

        // Create a summary "AI" scan result
        await ScanProcessor.processScan({
            executionId: uuidv4(),
            toolName: 'ai-analyst',
            target,
            rawOutput: `AI Operation Prompt: ${prompt}\n\nTools Executed: ${tools.join(', ')}\n\nAnalysis: Based on the requested operation, the system has orchestrated the execution of the selected tools. Results from Nmap, Nikto, and others have been cataloged individually.`,
            aiAnalysis: {
                summary: `AI Operation completed for prompt: "${prompt}". Executed ${results.filter(r => r.status === 'success').length}/${tools.length} tools successfully.`,
                vulnerabilities: [
                    {
                        title: 'AI Correlation Summary',
                        severity: 'info',
                        description: 'This is an aggregated summary of the AI operation. Check individual tool results for specific technical details.'
                    }
                ]
            }
        });

        return NextResponse.json({
            message: "AI Operations completed",
            results
        });

    } catch (error: any) {
        console.error("AI Execution Error:", error);
        return NextResponse.json({ message: error.message || "Internal Execution Error" }, { status: 500 });
    }
}
