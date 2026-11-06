import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding employee portal data...');

    // Create Departments
    const departments = [
        {
            name: 'RRHH',
            description: 'Recursos Humanos - Gestión de personal y casos'
        },
        {
            name: 'Seguridad',
            description: 'Departamento de Seguridad Informática'
        },
        {
            name: 'Análisis Técnico',
            description: 'Análisis de vulnerabilidades y escaneos'
        },
        {
            name: 'Gestión',
            description: 'Gestión y coordinación de proyectos'
        }
    ];

    for (const dept of departments) {
        await prisma.department.upsert({
            where: { name: dept.name },
            update: dept,
            create: dept
        });
    }

    console.log('✅ Departments created');

    // Get department IDs
    const rrhhDept = await prisma.department.findUnique({ where: { name: 'RRHH' } });
    const securityDept = await prisma.department.findUnique({ where: { name: 'Seguridad' } });
    const analysisDept = await prisma.department.findUnique({ where: { name: 'Análisis Técnico' } });
    const managementDept = await prisma.department.findUnique({ where: { name: 'Gestión' } });

    // Create Employees
    const employees = [
        {
            email: 'admin@numu.group',
            password: await bcrypt.hash('admin123', 10),
            firstName: 'Admin',
            lastName: 'Sistema',
            role: 'admin',
            departmentId: managementDept!.id,
            isActive: true
        },
        {
            email: 'hr@numu.group',
            password: await bcrypt.hash('hr123', 10),
            firstName: 'María',
            lastName: 'González',
            role: 'hr',
            departmentId: rrhhDept!.id,
            isActive: true
        },
        {
            email: 'analyst1@numu.group',
            password: await bcrypt.hash('analyst123', 10),
            firstName: 'Juan',
            lastName: 'Pérez',
            role: 'analyst',
            departmentId: securityDept!.id,
            isActive: true
        },
        {
            email: 'analyst2@numu.group',
            password: await bcrypt.hash('analyst123', 10),
            firstName: 'Ana',
            lastName: 'Martínez',
            role: 'analyst',
            departmentId: analysisDept!.id,
            isActive: true
        },
        {
            email: 'viewer@numu.group',
            password: await bcrypt.hash('viewer123', 10),
            firstName: 'Carlos',
            lastName: 'López',
            role: 'viewer',
            departmentId: managementDept!.id,
            isActive: true
        }
    ];

    for (const emp of employees) {
        await prisma.employee.upsert({
            where: { email: emp.email },
            update: emp,
            create: emp
        });
    }

    console.log('✅ Employees created');
    console.log('\n📧 Employee Credentials:');
    console.log('Admin: admin@numu.group / admin123');
    console.log('HR: hr@numu.group / hr123');
    console.log('Analyst 1: analyst1@numu.group / analyst123');
    console.log('Analyst 2: analyst2@numu.group / analyst123');
    console.log('Viewer: viewer@numu.group / viewer123');

    console.log('\n🎉 Employee portal seed data completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
