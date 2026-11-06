// Native fetch is available in Node.js 18+

async function seedIncidents() {
    console.log('🌱 Seeding test incidents...');

    const incidents = [
        {
            title: "Intento de intrusión SSH detectado",
            description: "Múltiples intentos fallidos de login desde IP 192.168.1.50 en el puerto 22.",
            priority: "high",
            type: "security_incident"
        },
        {
            title: "Vulnerabilidad crítica en Web Server",
            description: "Detectado CVE-2023-1234 en el servidor principal. Requiere parcheo inmediato.",
            priority: "critical",
            type: "scan_issue"
        },
        {
            title: "Certificado SSL próximo a expirar",
            description: "El certificado de numu.group expira en 5 días.",
            priority: "medium",
            type: "assessment_followup"
        }
    ];

    try {
        for (const inc of incidents) {
            const response = await fetch('http://localhost:4000/api/csirt/incidents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inc)
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(`Failed to create incident: ${err}`);
            }

            const data = await response.json();
            console.log(`✅ Created incident: ${data.title} (ID: ${data.id})`);
        }
        console.log('✨ Seeding completed successfully!');

    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
    }
}

seedIncidents();
