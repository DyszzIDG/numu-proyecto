import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/share/[token] - Get shared scan
export async function GET(
    req: NextRequest,
    { params }: { params: { token: string } }
) {
    try {
        const shareLink = await prisma.shareLink.findUnique({
            where: { token: params.token },
            include: {
                scan: {
                    include: {
                        findings: true,
                        target: true
                    }
                }
            }
        });

        if (!shareLink) {
            return NextResponse.json({ error: 'Share link not found' }, { status: 404 });
        }

        // Check expiration
        if (new Date() > shareLink.expiresAt) {
            return NextResponse.json({ error: 'Share link has expired' }, { status: 410 });
        }

        // Check max views
        if (shareLink.maxViews && shareLink.viewCount >= shareLink.maxViews) {
            return NextResponse.json({ error: 'Maximum views reached' }, { status: 410 });
        }

        // Increment view count
        await prisma.shareLink.update({
            where: { id: shareLink.id },
            data: { viewCount: { increment: 1 } }
        });

        return NextResponse.json({
            scan: shareLink.scan,
            shareInfo: {
                viewCount: shareLink.viewCount + 1,
                maxViews: shareLink.maxViews,
                expiresAt: shareLink.expiresAt
            }
        });
    } catch (error) {
        console.error('Error fetching shared scan:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
