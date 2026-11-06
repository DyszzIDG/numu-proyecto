import { NextResponse } from "next/server";
import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

export async function GET() {
    try {
        const { stdout } = await execPromise("docker ps --format \"{{.Names}}\"", { timeout: 3500 });
        const runningContainers = stdout.split(/\r?\n/).map(s => s.trim().replace(/['"]/g, '')).filter(Boolean);
        const hasToolbox = runningContainers.includes('csirt-toolbox');

        return NextResponse.json({
            status: 'running',
            dockerAvailable: true,
            toolboxRunning: hasToolbox,
            runningContainers,
            message: hasToolbox
                ? 'Docker y Kali Toolbox están activos'
                : 'Docker activo (csirt-toolbox detenido)'
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'offline',
            dockerAvailable: false,
            toolboxRunning: false,
            runningContainers: [],
            message: 'Docker Engine no detectado o fuera de servicio'
        });
    }
}
