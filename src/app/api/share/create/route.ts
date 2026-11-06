import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import crypto from 'crypto';

// POST /api/share/create - Create shareable link
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { scanId, expiresInHours = 24, maxViews } = await req.json();

        if (!scanId) {
            return NextResponse.json({ error: 'scanId is required' }, { status: 400 });
        }

        // Generate unique token
        const token = crypto.randomBytes(32).toString('hex');

        // Calculate expiration
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + expiresInHours);

        const shareLink = await prisma.shareLink.create({
            data: {
                scanId,
                token,
                expiresAt,
                maxViews: maxViews || null,
                createdBy: user.id
            }
        });

        const shareUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/share/${token}`;

        return NextResponse.json({
            shareLink: {
                id: shareLink.id,
                token: shareLink.token,
                url: shareUrl,
                expiresAt: shareLink.expiresAt,
                maxViews: shareLink.maxViews
            }
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating share link:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
