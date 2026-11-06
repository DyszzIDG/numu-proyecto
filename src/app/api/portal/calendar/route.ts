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

// GET /api/portal/calendar - Get shifts for a range
export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const start = searchParams.get('start');
        const end = searchParams.get('end');

        if (!start || !end) {
            return NextResponse.json({ success: false, error: 'Start and end dates required' }, { status: 400 });
        }

        const shifts = await prisma.shift.findMany({
            where: {
                start: { gte: new Date(start) },
                end: { lte: new Date(end) }
            },
            include: {
                employee: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        role: true,
                        avatar: true // If avatar exists
                    }
                }
            },
            orderBy: { start: 'asc' }
        });

        return NextResponse.json({ success: true, shifts });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST /api/portal/calendar - Create shift
export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session || (session.role !== 'admin' && session.role !== 'hr')) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { employeeId, start, end, type, notes } = body;

        const shift = await prisma.shift.create({
            data: {
                employeeId,
                start: new Date(start),
                end: new Date(end),
                type,
                notes
            },
            include: {
                employee: {
                    select: { firstName: true, lastName: true }
                }
            }
        });

        // Notify employee
        await prisma.notification.create({
            data: {
                employeeId,
                title: 'Nuevo Turno Asignado',
                message: `Se te ha asignado un turno de tipo ${type} para el ${new Date(start).toLocaleDateString()}`,
                type: 'info',
                link: '/portal/soc/calendario'
            }
        });

        return NextResponse.json({ success: true, shift });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
