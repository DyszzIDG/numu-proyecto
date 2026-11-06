
import { NextRequest, NextResponse } from 'next/server';
import { Orchestrator } from '../../../../../lib/web-security/orchestrator';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const scanId = searchParams.get('scanId');

        if (!scanId) {
            return NextResponse.json({ success: false, error: 'Missing scanId' }, { status: 400 });
        }

        const findings = await Orchestrator.getResults(scanId);

        return NextResponse.json({ success: true, findings });
    } catch (error: any) {
        console.error('API Results Logic Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
