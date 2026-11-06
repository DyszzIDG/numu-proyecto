import { ServiceType } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function getUserProfile(userId: string) {
    return await prisma.userProfile.findUnique({
        where: { userId },
        include: {
            serviceProfiles: true,
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    });
}

export async function getOrCreateServiceProfile(userProfileId: string, serviceType: ServiceType) {
    try {
        const existingProfile = await prisma.serviceProfile.findUnique({
            where: {
                userProfileId_service: {
                    userProfileId,
                    service: serviceType,
                },
            },
        });

        if (existingProfile) {
            return existingProfile;
        }

        return await prisma.serviceProfile.create({
            data: {
                userProfileId,
                service: serviceType,
                metadata: '{}',
                stats: '{}',
                settings: '{}',
            },
        });
    } catch (error) {
        console.error(`Error creating service profile for ${serviceType}:`, error);
        throw error;
    }
}

export async function updateServiceProfile(
    userProfileId: string,
    serviceType: ServiceType,
    data: { metadata?: any; stats?: any; settings?: any }
) {
    // Ensure it exists first
    await getOrCreateServiceProfile(userProfileId, serviceType);

    return await prisma.serviceProfile.update({
        where: {
            userProfileId_service: {
                userProfileId,
                service: serviceType,
            },
        },
        data: {
            ...(data.metadata && { metadata: JSON.stringify(data.metadata) }),
            ...(data.stats && { stats: JSON.stringify(data.stats) }),
            ...(data.settings && { settings: JSON.stringify(data.settings) }),
        },
    });
}
