import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

async function getSession() {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('employee_session');
    if (!sessionCookie) return null;
    try {
        return JSON.parse(sessionCookie.value);
    } catch {
        return null;
    }
}

// GET /api/portal/notifications - List notifications
export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const notifications = await prisma.notification.findMany({
            where: { employeeId: session.id },
            orderBy: { createdAt: 'desc' },
            take: 20 // Limit to recent 20
        });

        // Get unread count
        const unreadCount = await prisma.notification.count({
            where: {
                employeeId: session.id,
                isRead: false
            }
        });

        return NextResponse.json({
            success: true,
            notifications,
            unreadCount
        });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST /api/portal/notifications - Create notification (System/Admin)
// Or mark as read (if body.action === 'mark_read')
export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Mark as read logic
        if (body.action === 'mark_read') {
            const { id } = body;

            // If id is provided, mark single, else mark all for user
            if (id) {
                await prisma.notification.update({
                    where: { id },
                    data: { isRead: true }
                });
            } else {
                await prisma.notification.updateMany({
                    where: { employeeId: session.id, isRead: false },
                    data: { isRead: true }
                });
            }
            return NextResponse.json({ success: true, message: 'Marked as read' });
        }

        // Create notification logic (Ideally this should be protected or internal only)
        // For now, allowing it for demo purposes, but real implementations would use internal services
        const { employeeId, title, message, type, link } = body;

        const notification = await prisma.notification.create({
            data: {
                employeeId,
                title,
                message,
                type: type || 'info',
                link
            }
        });

        return NextResponse.json({ success: true, notification });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
