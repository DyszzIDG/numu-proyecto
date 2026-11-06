import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email y contraseña son requeridos' },
                { status: 400 }
            );
        }

        // Find client by email
        const client = await prisma.client.findUnique({
            where: { email },
            include: {
                company: true
            }
        });

        if (!client) {
            return NextResponse.json(
                { success: false, error: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        // Check if client is active
        if (!client.isActive) {
            return NextResponse.json(
                { success: false, error: 'Cuenta desactivada. Contacte a soporte.' },
                { status: 403 }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, client.passwordHash);

        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, error: 'Credenciales inválidas' },
                { status: 401 }
            );
        }

        // Update last login
        await prisma.client.update({
            where: { id: client.id },
            data: { lastLogin: new Date() }
        });

        // Return client session data
        return NextResponse.json({
            success: true,
            client: {
                id: client.id,
                email: client.email,
                companyId: client.companyId,
                companyName: client.company.name
            }
        });

    } catch (error) {
        console.error('Client login error:', error);
        return NextResponse.json(
            { success: false, error: 'Error del servidor' },
            { status: 500 }
        );
    }
}
