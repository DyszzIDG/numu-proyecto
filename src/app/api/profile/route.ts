import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const data = await req.json();
        const { bio, location, website, github, linkedin, name } = data;

        // Update UserProfile
        const userProfile = await prisma.userProfile.upsert({
            where: { userId: session.user.id },
            create: {
                userId: session.user.id,
                bio,
                location,
                website,
                github,
                linkedin
            },
            update: {
                bio,
                location,
                website,
                github,
                linkedin
            }
        });

        // Update User name if provided
        if (name) {
            await prisma.user.update({
                where: { id: session.user.id },
                data: { name }
            });
        }

        return NextResponse.json({ message: "Profile updated", profile: userProfile });
    } catch (error) {
        console.error("Profile update error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
