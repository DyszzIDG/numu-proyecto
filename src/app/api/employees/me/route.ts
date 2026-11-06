import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getEmployeeSession } from '@/lib/auth/session'; // We need to verify if this can be used in API or if we need cookies
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Helper to get session from cookie in API route
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

// GET /api/employees/me - Get current employee profile
export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const employee = await prisma.employee.findUnique({
            where: { id: session.id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                phone: true,
                avatar: true,
                department: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if (!employee) {
            return NextResponse.json(
                { success: false, error: 'Employee not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            employee
        });

    } catch (error: any) {
        console.error('Error fetching profile:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/employees/me - Update profile
export async function PUT(request: NextRequest) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { firstName, lastName, phone, currentPassword, newPassword } = body;

        // If updating password
        let passwordHash = undefined;
        if (newPassword && currentPassword) {
            const employee = await prisma.employee.findUnique({
                where: { id: session.id }
            });

            if (!employee) {
                return NextResponse.json(
                    { success: false, error: 'Employee not found' },
                    { status: 404 }
                );
            }

            const isValid = await bcrypt.compare(currentPassword, employee.password);
            if (!isValid) {
                return NextResponse.json(
                    { success: false, error: 'Invalid current password' },
                    { status: 400 }
                );
            }

            passwordHash = await bcrypt.hash(newPassword, 10);
        }

        const updatedEmployee = await prisma.employee.update({
            where: { id: session.id },
            data: {
                firstName,
                lastName,
                phone,
                password: passwordHash
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
                email: true
            }
        });

        return NextResponse.json({
            success: true,
            employee: updatedEmployee,
            message: 'Profile updated successfully'
        });

    } catch (error: any) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        );
    }
}
