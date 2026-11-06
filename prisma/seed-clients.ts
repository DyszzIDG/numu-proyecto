import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding client data...');

    // Create a demo company if it doesn't exist
    const demoCompany = await prisma.company.upsert({
        where: { contactEmail: 'demo@empresa.com' },
        update: {},
        create: {
            name: 'Empresa Demo S.A.',
            industry: 'Tecnología',
            size: '51-200',
            country: 'Panamá',
            contactEmail: 'demo@empresa.com',
            contactName: 'Juan Pérez',
            contactPhone: '+507 6000-0000',
            website: 'https://empresa-demo.com'
        }
    });

    console.log('✅ Demo company created:', demoCompany.name);

    // Create client account for the demo company
    const hashedPassword = await bcrypt.hash('demo123', 10);

    const demoClient = await prisma.client.upsert({
        where: { email: 'demo@empresa.com' },
        update: {},
        create: {
            companyId: demoCompany.id,
            email: 'demo@empresa.com',
            passwordHash: hashedPassword,
            isActive: true
        }
    });

    console.log('✅ Demo client created:', demoClient.email);

    // Create a completed assessment for the demo company
    const assessment = await prisma.assessment.upsert({
        where: { id: 'demo-assessment-001' },
        update: {},
        create: {
            id: 'demo-assessment-001',
            companyId: demoCompany.id,
            status: 'completed',
            overallScore: 72,
            maturityLevel: 'defined',
            categoryScores: JSON.stringify({
                'Seguridad de Aplicaciones': 75,
                'Gestión de Incidentes': 68,
                'Seguridad de Red': 80,
                'Seguridad Física': 65,
                'Auditoría y Cumplimiento': 70,
                'Protección de Datos': 78,
                'Gestión de Accesos': 72,
                'Operaciones de Seguridad': 69
            }),
            recommendations: JSON.stringify([
                'Implementar autenticación de dos factores (2FA) en todas las aplicaciones críticas',
                'Establecer un programa formal de capacitación en seguridad para todos los empleados',
                'Realizar auditorías de seguridad trimestrales con proveedores externos',
                'Mejorar los procedimientos de respuesta a incidentes con simulacros regulares',
                'Actualizar la política de control de acceso para incluir revisiones periódicas',
                'Implementar un sistema de gestión de vulnerabilidades automatizado'
            ]),
            startedAt: new Date('2025-01-15'),
            completedAt: new Date('2025-01-20')
        }
    });

    console.log('✅ Demo assessment created with score:', assessment.overallScore);

    console.log('\n🎉 Client seed data completed!');
    console.log('\n📝 Demo credentials:');
    console.log('   Email: demo@empresa.com');
    console.log('   Password: demo123');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding client data:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
