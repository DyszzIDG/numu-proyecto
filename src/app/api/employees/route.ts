import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// POST /api/employees - Create new employee
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { firstName, lastName, email, password, role, departmentId } = body;

        // Validation
        if (!firstName || !lastName || !email || !password || !role) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if email exists
        const existing = await prisma.employee.findUnique({
            where: { email }
        });

        if (existing) {
            return NextResponse.json(
                { success: false, error: 'Email already in use' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create employee
        const employee = await prisma.employee.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role,
                departmentId: departmentId || undefined
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                department: true,
                createdAt: true
            }
        });

        return NextResponse.json({
            success: true,
            employee,
            message: 'Employee created successfully'
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error creating employee:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}

// GET /api/employees - List employees
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');
        const departmentId = searchParams.get('departmentId');

        const where: any = { isActive: true };
        if (role) where.role = role;
        if (departmentId) where.departmentId = departmentId;

        const employees = await prisma.employee.findMany({
            where,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                departmentId: true,
                department: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { firstName: 'asc' }
        });

        return NextResponse.json({
            success: true,
            data: employees,
            count: employees.length
        });

    } catch (error: any) {
        console.error('Error fetching employees:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
