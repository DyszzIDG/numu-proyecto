import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const adminEmail = 'admin@numu.com';
    const adminPassword = 'Admin123!';

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
    });

    if (existingAdmin) {
        console.log('⚠️  Admin user already exists');
        return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = await prisma.user.create({
        data: {
            email: adminEmail,
            password: hashedPassword,
            name: 'Administrator',
            role: 'admin'
        }
    });

    console.log('✅ Admin user created:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   ID: ${admin.id}`);

    // Create UserProfile for admin
    const adminProfile = await prisma.userProfile.create({
        data: {
            userId: admin.id,
            bio: 'Administrador del sistema NUMU CSIRT',
            location: 'Argentina'
        }
    });

    console.log('✅ Admin profile created');

    // Create service profiles for all services
    const services = ['CYBERSECURITY', 'EDUCATION', 'AI', 'FINTECH'];

    for (const service of services) {
        await prisma.serviceProfile.create({
            data: {
                userProfileId: adminProfile.id,
                service: service as any,
                metadata: JSON.stringify({ role: 'admin', createdBy: 'seed' })
            }
        });
        console.log(`✅ Created ${service} profile for admin`);
    }

    console.log('\n🎉 Seeding completed successfully!');
    console.log('\n📝 Login credentials:');
    console.log(`   URL: http://localhost:3100/auth/login`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
