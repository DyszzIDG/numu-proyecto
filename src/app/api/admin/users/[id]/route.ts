import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// PATCH: Update user (role, plan, password reset)
export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const { role, plan, password } = await req.json();

        const updateData: any = {};

        if (role) updateData.role = role;

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Transaction to update user and plan if needed
        const updatedUser = await prisma.$transaction(async (tx) => {
            let user = await tx.user.update({
                where: { id },
                data: updateData,
                include: { plan: true }
            });

            if (plan) {
                // Check if plan exists
                if (user.plan) {
                    await tx.userPlan.update({
                        where: { userId: id },
                        data: { plan }
                    });
                } else {
                    await tx.userPlan.create({
                        data: {
                            userId: id,
                            plan,
                            resetDate: new Date()
                        }
                    });
                }
            }

            return user;
        });

        return NextResponse.json(updatedUser);

    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

// DELETE: Remove user
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        await prisma.user.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
