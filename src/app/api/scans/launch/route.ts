
import { NextRequest, NextResponse } from 'next/server';
import { Orchestrator, SecurityTool } from '../../../../../lib/web-security/orchestrator';

export async function POST(request: NextRequest) {
    try {
        const { tool, target } = await request.json();

        if (!tool || !target) {
            return NextResponse.json({ success: false, error: 'Missing tool or target' }, { status: 400 });
        }

        const validTools: SecurityTool[] = ['nuclei', 'zap', 'feroxbuster', 'whatweb', 'testssl', 'nikto'];
        if (!validTools.includes(tool as SecurityTool)) {
            return NextResponse.json({ success: false, error: 'Invalid tool' }, { status: 400 });
        }

        const result = await Orchestrator.runScan(tool as SecurityTool, target);

        if (!result.success) {
            return NextResponse.json(result, { status: 500 });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('API Scan Logic Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
