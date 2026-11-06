import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Creando usuarios de prueba para CSIRT...');

    const users = [
        {
            email: 'admin@numu.com',
            password: 'admin',
            firstName: 'Admin',
            lastName: 'CSIRT',
            role: 'admin',
        },
        {
            email: 'analista@numu.com',
            password: 'analyst',
            firstName: 'Analista',
            lastName: 'CSIRT',
            role: 'analyst',
        },
        {
            email: 'empresa@target.com',
            password: 'company',
            firstName: 'Cliente',
            lastName: 'Empresa',
            role: 'company',
        },
    ];

    for (const user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);

        await prisma.employee.upsert({
            where: { email: user.email },
            update: {
                password: hashedPassword,
                role: user.role,
                isActive: true
            },
            create: {
                email: user.email,
                password: hashedPassword,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isActive: true
            },
        });

        console.log(`✅ Usuario creado: ${user.email} (Pass: ${user.password})`);
    }
}

main()
    .catch((e) => {
        console.error('❌ Error al crear usuarios:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
