// Test script to verify CSIRT API integration
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testIntegration() {
    console.log('🧪 Testing CSIRT Integration...\n');

    try {
        // Test 1: Database Connection
        console.log('1️⃣ Testing database connection...');
        await prisma.$connect();
        console.log('✅ Database connected successfully\n');

        // Test 2: Create Test Scan
        console.log('2️⃣ Creating test scan...');
        const testData = {
            target: 'test-integration.com',
            targetType: 'domain',
            scanType: 'test',
            status: 'success',
            startedAt: new Date(),
            completedAt: new Date(),
            duration: 5,
            findings: [
                {
                    category: 'test',
                    severity: 'info',
                    title: 'Integration Test',
                    description: 'This is a test finding from the integration test',
                }
            ]
        };

        // Create or get target
        let scanTarget = await prisma.scanTarget.findUnique({
            where: { target: testData.target },
        });

        if (!scanTarget) {
            scanTarget = await prisma.scanTarget.create({
                data: {
                    target: testData.target,
                    type: testData.targetType,
                },
            });
            console.log(`✅ Created target: ${scanTarget.target}`);
        } else {
            console.log(`✅ Found existing target: ${scanTarget.target}`);
        }

        // Create scan result
        const scanResult = await prisma.scanResult.create({
            data: {
                targetId: scanTarget.id,
                scanType: testData.scanType,
                status: testData.status,
                startedAt: testData.startedAt,
                completedAt: testData.completedAt,
                duration: testData.duration,
                findings: {
                    create: testData.findings.map(finding => ({
                        category: finding.category,
                        severity: finding.severity,
                        title: finding.title,
                        description: finding.description,
                    })),
                },
            },
            include: {
                findings: true,
                target: true,
            },
        });

        console.log(`✅ Created scan result with ID: ${scanResult.id}`);
        console.log(`   - Findings: ${scanResult.findings.length}\n`);

        // Test 3: Query Scans
        console.log('3️⃣ Querying all scans...');
        const allScans = await prisma.scanResult.findMany({
            take: 5,
            orderBy: { startedAt: 'desc' },
            include: {
                target: true,
                findings: {
                    select: {
                        id: true,
                        severity: true,
                        category: true,
                    },
                },
            },
        });

        console.log(`✅ Found ${allScans.length} recent scans:`);
        allScans.forEach((scan, idx) => {
            console.log(`   ${idx + 1}. ${scan.target.target} - ${scan.scanType} (${scan.findings.length} findings)`);
        });

        console.log('\n✅ All tests passed! Integration is working correctly.');
        console.log('\n📊 Summary:');
        console.log(`   - Database: Connected`);
        console.log(`   - Scan Creation: Working`);
        console.log(`   - Data Retrieval: Working`);
        console.log(`   - Total Scans in DB: ${allScans.length}`);

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error('\nFull error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testIntegration();
