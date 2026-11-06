import { NextResponse } from "next/server";
import { DockerRunner } from "@/lib/docker/DockerRunner";
import { ScanProcessor } from "@/lib/services/scan-processor";
import { PrismaClient } from "@prisma/client";
import { getAuthenticatedUser } from "@/lib/auth/unified";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    const jobId = uuidv4();
    try {
        const { targets, tool, parameters } = await req.json();

        if (!targets || !Array.isArray(targets) || targets.length === 0) {
            return NextResponse.json({ message: "Targets array is required" }, { status: 400 });
        }

        if (!tool) {
            return NextResponse.json({ message: "Tool is required" }, { status: 400 });
        }

        const user = await getAuthenticatedUser();
        const userId = user?.id;

        // Process scans in background (fire and forget pattern for response speed)
        // Note: in serverless this might be killed, but valid for Node server/MVP
        const scanPromises = targets.map(async (target: string) => {
            const executionId = uuidv4();
            try {
                // 1. Create Execution Record
                await prisma.toolExecution.create({
                    data: {
                        id: executionId,
                        toolName: tool,
                        target: target,
                        status: 'running',
                        parameters: JSON.stringify(parameters || {}),
                        command: `[BATCH ${jobId}] docker run ${tool}`,
                        userId: userId,
                        startedAt: new Date(),
                    }
                });

                let rawOutput = "";

                // 2. Execute Tool (Reusing DockerRunner logic)
                try {
                    switch (tool) {
                        case 'nmap': rawOutput = await DockerRunner.runNmap(target); break;
                        case 'nikto': rawOutput = await DockerRunner.runNikto(target); break;
                        case 'nuclei': rawOutput = await DockerRunner.runNuclei(target); break;
                        case 'theharvester': rawOutput = await DockerRunner.runTheHarvester(target); break;
                        default:
                            // Try generic toolbox if not specific
                            if (['amass', 'sublist3r', 'dnsrecon'].includes(tool)) {
                                rawOutput = await DockerRunner.runInToolbox(`${tool} -h ${target}`); // Needs specific args adaptation usually
                            } else {
                                rawOutput = await DockerRunner.runInToolbox(`${tool} ${target}`);
                            }
                    }
                } catch (statusError: any) {
                    // Handle Docker errors specifically to save them
                    throw new Error(statusError.message || "Execution error");
                }

                // 3. Update Success
                await prisma.toolExecution.update({
                    where: { id: executionId },
                    data: {
                        status: 'completed',
                        completedAt: new Date(),
                        rawOutput: rawOutput,
                        duration: 0,
                    }
                });

                // 4. Process AI Analysis
                await ScanProcessor.processScan({
                    executionId,
                    toolName: tool,
                    target,
                    rawOutput,
                    aiAnalysis: { summary: `Batch scan result for job ${jobId}` }
                });

            } catch (err: any) {
                console.error(`Error scanning target ${target}:`, err);
                await prisma.toolExecution.update({
                    where: { id: executionId },
                    data: {
                        status: 'failed',
                        completedAt: new Date(),
                        error: err.message
                    }
                });
            }
        });

        // We don't await scanPromises to return immediately
        // In a production environment with serverless, we'd use a queue (Redis/Bull)
        Promise.all(scanPromises).then(() => console.log(`Job ${jobId} completed`));

        return NextResponse.json({
            message: "Batch scan job started",
            jobId,
            targetCount: targets.length
        });

    } catch (error: any) {
        console.error("Batch scan error:", error);
        return NextResponse.json({
            message: "Failed to create scan job",
            error: error.message
        }, { status: 500 });
    }
}
