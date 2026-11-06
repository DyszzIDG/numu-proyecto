import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding certification tiers...');

    // Create certification tiers
    const tiers = [
        {
            name: 'Bronze',
            slug: 'bronze',
            minScore: 50,
            maxScore: 69,
            price: 29900, // $299 in cents
            color: '#CD7F32',
            icon: '🥉',
            benefits: JSON.stringify([
                'Professional PDF Certificate',
                'Digital Badge for Website',
                '12 Months Validity',
                'Certificate Verification Page',
                'Email Support'
            ]),
            description: 'Basic certification for companies demonstrating foundational cybersecurity practices. Perfect for organizations starting their security journey.',
            order: 1
        },
        {
            name: 'Silver',
            slug: 'silver',
            minScore: 70,
            maxScore: 84,
            price: 49900, // $499 in cents
            color: '#C0C0C0',
            icon: '🥈',
            benefits: JSON.stringify([
                'All Bronze Benefits',
                'Public Directory Listing',
                'Social Media Graphics',
                'Priority Email Support',
                'Quarterly Security Tips'
            ]),
            description: 'Intermediate certification for companies with established security controls. Shows commitment to cybersecurity excellence.',
            order: 2
        },
        {
            name: 'Gold',
            slug: 'gold',
            minScore: 85,
            maxScore: 94,
            price: 79900, // $799 in cents
            color: '#FFD700',
            icon: '🥇',
            benefits: JSON.stringify([
                'All Silver Benefits',
                'Featured Directory Listing',
                'Marketing Materials Package',
                'Priority Chat Support',
                'Monthly Security Webinars',
                'Press Release Template'
            ]),
            description: 'Advanced certification for companies with mature security programs. Demonstrates industry-leading practices.',
            order: 3
        },
        {
            name: 'Platinum',
            slug: 'platinum',
            minScore: 95,
            maxScore: 100,
            price: 99900, // $999 in cents
            color: '#E5E4E2',
            icon: '💎',
            benefits: JSON.stringify([
                'All Gold Benefits',
                'Top Featured Listing',
                'Custom Case Study',
                'Dedicated Account Manager',
                'Executive Security Briefings',
                'Speaking Opportunities',
                'Logo on NUMU Website'
            ]),
            description: 'Elite certification for companies with world-class security posture. Reserved for the top 5% of organizations.',
            order: 4
        }
    ];

    for (const tier of tiers) {
        const created = await prisma.certificationTier.upsert({
            where: { slug: tier.slug },
            update: tier,
            create: tier
        });
        console.log(`✅ Created tier: ${created.name} ($${created.price / 100})`);
    }

    console.log('\n🎉 Certification tiers seeded successfully!');
    console.log('\n📊 Summary:');
    console.log('   🥉 Bronze (50-69%): $299/year');
    console.log('   🥈 Silver (70-84%): $499/year');
    console.log('   🥇 Gold (85-94%): $799/year');
    console.log('   💎 Platinum (95-100%): $999/year');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding certification tiers:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
