import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();

// POST /api/portal/cases/[id]/attachments - Upload file
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = file.name.replace(/\s/g, '_');
        const uniqueFilename = `${Date.now()}_${filename}`;

        // Simulating upload to local storage suitable for dev
        // In prod, this should be S3 or similar
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'cases');
        await mkdir(uploadDir, { recursive: true });

        await writeFile(join(uploadDir, uniqueFilename), buffer);

        // Create DB record
        const attachment = await prisma.caseAttachment.create({
            data: {
                caseId: params.id,
                filename: file.name,
                url: `/uploads/cases/${uniqueFilename}`,
                size: file.size,
                mimeType: file.type
            }
        });

        return NextResponse.json({ success: true, attachment });

    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// GET /api/portal/cases/[id]/attachments - List attachments
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const attachments = await prisma.caseAttachment.findMany({
            where: { caseId: params.id },
            orderBy: { uploadedAt: 'desc' }
        });

        return NextResponse.json({ success: true, attachments });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
