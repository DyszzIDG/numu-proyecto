// Native fetch is available in Node.js 18+

async function seedForensics() {
    console.log('🕵️ Seeding test forensics evidence...');

    const items = [
        {
            description: "Imagen de disco del servidor infectado",
            type: "disk_image",
            location: "Nube Privada - Bucket 3",
            acquiredBy: "CSIRT Auto-Response",
            custodian: "Lab Forense"
        },
        {
            description: "Dump de memoria RAM - Incidente #42",
            type: "memory_dump",
            location: "Servidor Forense Local",
            acquiredBy: "Analista Senior",
            custodian: "Analista Senior"
        }
    ];

    try {
        for (const item of items) {
            const response = await fetch('http://localhost:4000/api/csirt/forensics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(`Failed to create evidence: ${err}`);
            }

            const data = await response.json();
            console.log(`✅ Created evidence: ${data.description} (ID: ${data.id})`);
        }
        console.log('✨ Any trouble? Call the Ghostbusters! Just kidding, seeding done.');

    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
    }
}

seedForensics();
