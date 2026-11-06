
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding CTF Data...')

    // 1. Get Programs
    const ministerio = await prisma.program.findUnique({ where: { slug: 'ministerio-panama' } });
    const ahiba = await prisma.program.findUnique({ where: { slug: 'ahiba-honduras' } });
    const universidad = await prisma.program.findUnique({ where: { slug: 'universidad' } });

    // Create "ITSE Panamá" and "Otros" placeholders if they don't exist, to match UI
    const itse = await prisma.program.upsert({
        where: { slug: 'itse-panama' },
        update: {},
        create: {
            slug: 'itse-panama',
            name: 'ITSE Panamá',
            description: 'Instituto Técnico Superior Especializado',
            icon: 'BookOpen',
            color: 'from-cyan-500 to-blue-500'
        }
    });

    const otros = await prisma.program.upsert({
        where: { slug: 'otros' },
        update: {},
        create: {
            slug: 'otros',
            name: 'Otros Eventos',
            description: 'Competencias abiertas y comunitarias',
            icon: 'Users',
            color: 'from-gray-500 to-slate-500'
        }
    });

    // 2. Clear existing challenges for these programs to avoid dupes if re-running without clean
    // (Optional, skipping for safety, we'll just create new ones or upsert if we had specific IDs)

    if (ministerio) {
        console.log('Adding challenges for Ministerio...');
        await createChallenges(prisma, ministerio.id, 12, 'Ministerio');
    }

    if (ahiba) {
        console.log('Adding challenges for AHIBA...');
        await createChallenges(prisma, ahiba.id, 15, 'AHIBA');
    }

    if (itse) {
        console.log('Adding challenges for ITSE...');
        await createChallenges(prisma, itse.id, 10, 'ITSE');
    }

    if (otros) {
        console.log('Adding challenges for Otros...');
        await createChallenges(prisma, otros.id, 8, 'Community');
    }

    console.log('✅ CTF Seeding Completed');
}

async function createChallenges(prisma: any, programId: string, count: number, prefix: string) {
    const categories = ['web', 'crypto', 'forensics', 'pwn', 'osint'];
    const difficulties = ['easy', 'medium', 'hard'];

    for (let i = 1; i <= count; i++) {
        const cat = categories[Math.floor(Math.random() * categories.length)];
        const diff = difficulties[Math.floor(Math.random() * difficulties.length)];
        const points = diff === 'easy' ? 100 : diff === 'medium' ? 300 : 500;

        await prisma.cTFChallenge.create({
            data: {
                title: `${prefix} Challenge #${i} - ${cat.toUpperCase()}`,
                description: `This is a simulated ${diff} difficulty challenge for ${prefix}. Find the flag!`,
                category: cat,
                difficulty: diff,
                points: points,
                flag: `flag{${prefix.toLowerCase()}_${cat}_${i}}`,
                programId: programId,
                isActive: true
            }
        });
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
