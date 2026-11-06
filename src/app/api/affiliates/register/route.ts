import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/affiliates/register - Register as affiliate
export async function POST(request: NextRequest) {
    try {
        const { name, email, paymentEmail, paymentMethod, preferredCode } = await request.json();

        // Validate input
        if (!name || !email || !paymentEmail) {
            return NextResponse.json(
                { success: false, error: 'Nombre, email y email de pago son requeridos' },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existing = await prisma.affiliate.findUnique({
            where: { email }
        });

        if (existing) {
            return NextResponse.json(
                { success: false, error: 'Este email ya está registrado como afiliado' },
                { status: 400 }
            );
        }

        // Generate unique code
        let code = preferredCode || generateCode(name);
        let codeExists = await prisma.affiliate.findUnique({ where: { code } });
        let attempts = 0;

        while (codeExists && attempts < 10) {
            code = `${code}${Math.floor(Math.random() * 100)}`;
            codeExists = await prisma.affiliate.findUnique({ where: { code } });
            attempts++;
        }

        if (codeExists) {
            return NextResponse.json(
                { success: false, error: 'No se pudo generar un código único. Intenta con otro nombre.' },
                { status: 400 }
            );
        }

        // Create affiliate
        const affiliate = await prisma.affiliate.create({
            data: {
                name,
                email,
                code: code.toUpperCase(),
                paymentEmail,
                paymentMethod: paymentMethod || 'paypal',
                status: 'pending' // Requires verification
            }
        });

        // TODO: Send verification email

        return NextResponse.json({
            success: true,
            affiliate: {
                id: affiliate.id,
                name: affiliate.name,
                email: affiliate.email,
                code: affiliate.code,
                referralLink: `${process.env.NEXT_PUBLIC_URL}?ref=${affiliate.code}`,
                commissionRate: affiliate.commissionRate,
                status: affiliate.status,
                message: 'Registro exitoso. Te enviaremos un email de verificación.'
            }
        });

    } catch (error) {
        console.error('Affiliate registration error:', error);
        return NextResponse.json(
            { success: false, error: 'Error al registrar afiliado' },
            { status: 500 }
        );
    }
}

// Helper function to generate code from name
function generateCode(name: string): string {
    // Take first name and add current year
    const firstName = name.split(' ')[0].toUpperCase();
    const year = new Date().getFullYear();
    return `${firstName}${year}`;
}
