import { NextResponse } from "next/server";
import { DockerRunner } from "@/lib/docker/DockerRunner";

export async function GET() {
    try {
        // Check Docker status
        await DockerRunner.ensureServicesRunning();

        return NextResponse.json({
            status: 'running',
            message: 'Docker services are operational'
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: error.message
        }, { status: 503 });
    }
}
