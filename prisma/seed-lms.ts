
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding LMS Data...')

    // 1. Create Programs
    const bid = await prisma.program.upsert({
        where: { slug: 'bid' },
        update: {},
        create: {
            slug: 'bid',
            name: 'BID',
            subtitle: 'Banco Interamericano de Desarrollo',
            description: 'Programas de capacitación para instituciones financieras internacionales',
            color: 'from-blue-500 to-cyan-500',
            icon: 'Landmark'
        }
    });

    const universidad = await prisma.program.upsert({
        where: { slug: 'universidad' },
        update: {},
        create: {
            slug: 'universidad',
            name: 'Universidad',
            subtitle: 'Programas Académicos',
            description: 'Cursos universitarios y programas de grado en ciberseguridad',
            color: 'from-purple-500 to-pink-500',
            icon: 'GraduationCap'
        }
    });

    const ministerio = await prisma.program.upsert({
        where: { slug: 'ministerio-panama' },
        update: {},
        create: {
            slug: 'ministerio-panama',
            name: 'Ministerio Seguridad Panamá',
            description: 'Capacitación especializada para personal del sector público',
            color: 'from-green-500 to-emerald-500',
            icon: 'Shield'
        }
    });

    const ahiba = await prisma.program.upsert({
        where: { slug: 'ahiba-honduras' },
        update: {},
        create: {
            slug: 'ahiba-honduras',
            name: 'AHIBA Honduras',
            description: 'Asociación Hondureña de Instituciones Bancarias',
            color: 'from-orange-500 to-red-500',
            icon: 'Building2'
        }
    });

    // 2. Create Courses for BID
    await createCourse(prisma, bid.id, 'Fundamentos de Ciberseguridad Financiera', '8 semanas', [
        { title: 'Introducción al Panorama de Amenazas', lessons: ['Bienvenida', 'Vectores de Ataque', 'Ingeniería Social'] },
        { title: 'Seguridad en Transacciones', lessons: ['Protocolos SWIFT', 'Encriptación', 'Prevención de Fraude'] }
    ]);

    await createCourse(prisma, bid.id, 'Gestión de Riesgos Digitales', '6 semanas', [
        { title: 'Riesgo Operacional', lessons: ['Definiciones', 'Evaluación de Impacto'] },
        { title: 'Continuidad de Negocio', lessons: ['Planes de Recuperación', 'Resiliencia'] }
    ]);

    // 3. Create Courses for Universidad
    await createCourse(prisma, universidad.id, 'Introducción a la Ciberseguridad', '12 semanas', [
        { title: 'Conceptos Básicos', lessons: ['CIA Triad', 'Autenticación', 'Control de Acceso'] },
        { title: 'Redes Seguras', lessons: ['TCP/IP', 'Firewalls', 'VPNs'] }
    ]);

    await createCourse(prisma, universidad.id, 'Ethical Hacking Avanzado', '16 semanas', [
        { title: 'Reconocimiento', lessons: ['OSINT', 'Scanning', 'Enumeration'] },
        { title: 'Explotación', lessons: ['Metasploit', 'Web Exploitation', 'Privilege Escalation'] }
    ]);

    console.log('✅ LMS Seeding Completed');
}

async function createCourse(prisma: any, programId: string, title: string, duration: string, modulesData: any[]) {
    const course = await prisma.course.create({
        data: {
            programId,
            title,
            description: `Curso completo de ${title}.`,
            duration,
            instructor: 'Dr. Expert',
            thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070',
        }
    });

    for (let i = 0; i < modulesData.length; i++) {
        const modData = modulesData[i];
        const mod = await prisma.module.create({
            data: {
                courseId: course.id,
                title: modData.title,
                order: i + 1
            }
        });

        for (let j = 0; j < modData.lessons.length; j++) {
            await prisma.lesson.create({
                data: {
                    moduleId: mod.id,
                    title: modData.lessons[j],
                    type: 'video',
                    duration: '10:00',
                    content: 'intro-video-id',
                    order: j + 1
                }
            });
        }
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
