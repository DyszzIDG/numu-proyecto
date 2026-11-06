import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find employee
        const employee = await prisma.employee.findUnique({
            where: { email },
            include: {
                department: true
            }
        });

        if (!employee) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        if (!employee.isActive) {
            return NextResponse.json(
                { success: false, error: 'Account is inactive' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, employee.password);

        if (!isValidPassword) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Return employee data (without password)
        const { password: _, ...employeeData } = employee;

        // Create response with employee data
        const response = NextResponse.json({
            success: true,
            employee: employeeData,
            message: 'Login successful'
        });

        // Set HTTP-only cookie for server-side authentication
        response.cookies.set('employee_session', JSON.stringify({
            id: employee.id,
            email: employee.email,
            role: employee.role
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/'
        });

        return response;

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
