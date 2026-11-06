import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ThreatIntelService } from '@/lib/services/threat-intel';

// GET /api/threat-intel/[target] - Get threat intelligence for target
export async function GET(
    req: NextRequest,
    { params }: { params: { target: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const target = decodeURIComponent(params.target);

        if (!target) {
            return NextResponse.json({ error: 'Target is required' }, { status: 400 });
        }

        const threatIntel = await ThreatIntelService.aggregateThreatIntel(target);

        return NextResponse.json({ threatIntel });
    } catch (error) {
        console.error('Error fetching threat intelligence:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
