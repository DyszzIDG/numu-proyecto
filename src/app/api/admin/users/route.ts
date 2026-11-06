import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET: List all users with plan info
export async function GET(req: Request) {
    try {
        const users = await prisma.user.findMany({
            include: {
                plan: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Safe user mapping
        const safeUsers = users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.plan?.status || 'active',
            plan: user.plan?.plan || 'free',
            lastLogin: user.updatedAt, // Using updatedAt as proxy for now
            createdAt: user.createdAt,
            isAdmin: user.isAdmin
        }));

        return NextResponse.json(safeUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

// POST: Create a new user (admin function)
export async function POST(req: Request) {
    try {
        const { name, email, password, role, plan } = await req.json();

        // Check exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'USER',
                plan: {
                    create: {
                        plan: plan || 'free'
                    }
                }
            },
            include: { plan: true }
        });

        return NextResponse.json(user);

    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
