import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding incidents...');

    // Incident Types
    const types = ['Ransomware Detected', 'Phishing Campaign', 'Brute Force SSH', 'Malware Download', 'Policy Violation'];
    const severities = ['Crítico', 'Alto', 'Medio', 'Bajo'];
    const origins = ['CN', 'RU', 'US', 'BR', 'IR'];

    // Create 30 incidents
    for (let i = 0; i < 30; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const severity = severities[Math.floor(Math.random() * severities.length)];
        const origin = origins[Math.floor(Math.random() * origins.length)];

        // Status probability: 20% Cerrado, 80% Active
        const isClosed = Math.random() < 0.2;
        const status = isClosed ? 'Cerrado' : 'En Análisis';

        await prisma.incident.create({
            data: {
                type,
                severity,
                status,
                detectedAt: new Date(Date.now() - Math.floor(Math.random() * 100000000)), // Random time in last ~27 hours
                origin,
                description: `Automated alert for ${type} from source ${origin}`,
                analystId: null // Pending assignment
            }
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
