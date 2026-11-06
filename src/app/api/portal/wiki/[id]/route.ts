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

// GET /api/portal/wiki/[id] - Get article
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const article = await prisma.wikiArticle.findUnique({
            where: { id: params.id },
            include: {
                author: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        if (!article) {
            return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, article });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PUT /api/portal/wiki/[id] - Update article
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { title, content, category, isPublic } = body;

        const article = await prisma.wikiArticle.update({
            where: { id: params.id },
            data: {
                title,
                content,
                category,
                isPublic
            }
        });

        return NextResponse.json({ success: true, article });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// DELETE /api/portal/wiki/[id] - Delete article
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        // Ideally check ownership or admin role here

        await prisma.wikiArticle.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true, message: 'Article deleted' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
