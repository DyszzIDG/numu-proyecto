/**
 * Seed CSIRT Incidents and Threat Intelligence
 */

import { PrismaClient, CSIRTIncidentType, CSIRTSeverity, CSIRTIncidentStatus, CSIRTPriority, CSIRTRole, ThreatType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🛡️ Seeding CSIRT operations data...');

    // 1. Ensure an Admin / Analyst User exists
    let user = await prisma.user.findFirst({
        where: { email: 'admin@numu.com' }
    });

    if (!user) {
        user = await prisma.user.findFirst();
    }

    if (!user) {
        console.warn('⚠️ No user found. Run npm run db:seed first.');
        return;
    }

    // 2. Create or find CSIRTUser
    let csirtUser = await prisma.cSIRTUser.findUnique({
        where: { userId: user.id }
    });

    if (!csirtUser) {
        csirtUser = await prisma.cSIRTUser.create({
            data: {
                userId: user.id,
                role: CSIRTRole.ADMIN,
                department: 'Ciberseguridad y CSIRT',
                phone: '+54 11 4000-0000',
                isActive: true,
                lastLogin: new Date()
            }
        });
        console.log('✅ CSIRTUser creado:', csirtUser.id);
    }

    // 3. Seed Realistic CSIRT Incidents
    const incidentsData = [
        {
            title: 'Detección de Ransomware LockBit 3.0 en servidor de archivos',
            description: 'Actividad sospechosa de cifrado y notas de rescate detectadas en el servidor NAS de finanzas.',
            type: CSIRTIncidentType.RANSOMWARE,
            severity: CSIRTSeverity.CRITICAL,
            status: CSIRTIncidentStatus.INVESTIGATING,
            priority: CSIRTPriority.CRITICAL,
            category: 'Malware / Ransomware',
            subcategory: 'LockBit Variant',
            source: 'CrowdStrike EDR',
            affectedAssets: ['SRV-NAS-FIN01', '192.168.10.45'],
            detectedAt: new Date(Date.now() - 1000 * 60 * 45), // 45m ago
            reportedAt: new Date(Date.now() - 1000 * 60 * 35),
            assignedTo: csirtUser.id
        },
        {
            title: 'Campaña Masiva de Spear Phishing bancario a ejecutivos',
            description: 'Múltiples correos con enlaces maliciosos clonando el portal de Microsoft 365 recibidos por directores.',
            type: CSIRTIncidentType.PHISHING,
            severity: CSIRTSeverity.HIGH,
            status: CSIRTIncidentStatus.CONTAINED,
            priority: CSIRTPriority.HIGH,
            category: 'Ingeniería Social',
            subcategory: 'Credential Harvesting',
            source: 'Microsoft Defender for O365',
            affectedAssets: ['director@numu.com', 'cfo@numu.com'],
            detectedAt: new Date(Date.now() - 1000 * 60 * 180), // 3h ago
            reportedAt: new Date(Date.now() - 1000 * 60 * 150),
            assignedTo: csirtUser.id
        },
        {
            title: 'Ataque de Fuerza Bruta SSH distribuido contra Gateway VPN',
            description: 'Más de 15,000 intentos de inicio de sesión por segundo desde botnet Mirai con diccionario estándar.',
            type: CSIRTIncidentType.UNAUTHORIZED_ACCESS,
            severity: CSIRTSeverity.MEDIUM,
            status: CSIRTIncidentStatus.RESOLVED,
            priority: CSIRTPriority.MEDIUM,
            category: 'Acceso No Autorizado',
            subcategory: 'SSH Brute Force',
            source: 'Palo Alto Firewall',
            affectedAssets: ['GW-VPN-CORP', '200.45.120.10'],
            detectedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
            reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 11),
            resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
            assignedTo: csirtUser.id
        },
        {
            title: 'Exfiltración anómala de datos hacia IP en Europa del Este',
            description: 'Tráfico HTTPS saliente de 8.4 GB hacia IP no categorizada reportado por el IDS.',
            type: CSIRTIncidentType.DATA_BREACH,
            severity: CSIRTSeverity.HIGH,
            status: CSIRTIncidentStatus.NEW,
            priority: CSIRTPriority.HIGH,
            category: 'Fuga de Información',
            subcategory: 'Data Exfiltration',
            source: 'Darktrace IDS',
            affectedAssets: ['SRV-DB-PROD', '10.0.4.15'],
            detectedAt: new Date(Date.now() - 1000 * 60 * 25), // 25m ago
            reportedAt: new Date(Date.now() - 1000 * 60 * 20),
            assignedTo: csirtUser.id
        },
        {
            title: 'Inyección de Comandos (CVE-2024-21413) en servidor Web público',
            description: 'Intentos de payload RCE detectados en el endpoint /api/v1/checkout por el WAF.',
            type: CSIRTIncidentType.MALWARE,
            severity: CSIRTSeverity.HIGH,
            status: CSIRTIncidentStatus.CONTAINED,
            priority: CSIRTPriority.HIGH,
            category: 'Explotación Web',
            subcategory: 'Command Injection',
            source: 'Cloudflare WAF',
            affectedAssets: ['https://portal.numu.com', '185.199.108.153'],
            detectedAt: new Date(Date.now() - 1000 * 60 * 90),
            reportedAt: new Date(Date.now() - 1000 * 60 * 80),
            assignedTo: csirtUser.id
        },
        {
            title: 'Intento de Denegación de Servicio (SYN Flood) en balanceador',
            description: 'Picos anormales de tráfico SYN TCP alcanzando 2.5 Gbps dirigidos al puerto 443.',
            type: CSIRTIncidentType.DOS_DDOS,
            severity: CSIRTSeverity.MEDIUM,
            status: CSIRTIncidentStatus.RESOLVED,
            priority: CSIRTPriority.MEDIUM,
            category: 'Disponibilidad',
            subcategory: 'SYN Flood',
            source: 'Palo Alto FW',
            affectedAssets: ['LB-EXTERNO-01'],
            detectedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
            reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 23),
            resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 22),
            assignedTo: csirtUser.id
        },
        {
            title: 'Violación de políticas de seguridad: Software no autorizado detectado',
            description: 'Instalación de cliente torrent BitTorrent en estación de trabajo del departamento de diseño.',
            type: CSIRTIncidentType.POLICY_VIOLATION,
            severity: CSIRTSeverity.LOW,
            status: CSIRTIncidentStatus.CLOSED,
            priority: CSIRTPriority.LOW,
            category: 'Cumplimiento',
            subcategory: 'Unauthorized Software',
            source: 'Wazuh EDR Agent',
            affectedAssets: ['WKST-DSG-04'],
            detectedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
            reportedAt: new Date(Date.now() - 1000 * 60 * 60 * 47),
            resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 46),
            closedAt: new Date(Date.now() - 1000 * 60 * 60 * 45),
            assignedTo: csirtUser.id
        }
    ];

    for (const inc of incidentsData) {
        await prisma.cSIRTIncident.create({
            data: inc
        });
    }

    console.log(`✅ ${incidentsData.length} incidentes CSIRT creados exitosamente.`);

    // 4. Seed Threat Intelligence records
    const threatIntelData = [
        {
            title: 'Campaña Activa LockBit 3.0 contra el sector financiero LATAM',
            description: 'El grupo de ransomware LockBit ha intensificado sus operaciones apuntando a credenciales VPN débiles.',
            type: ThreatType.RANSOMWARE,
            severity: CSIRTSeverity.CRITICAL,
            source: 'AlienVault OTX',
            confidence: 90,
            targetedSectors: ['Finanzas', 'Salud', 'Gobierno'],
            affectedRegions: ['LATAM', 'Norteamérica'],
            threatActor: 'LockBit Supporter Group',
            ttps: ['Initial Access: Valid Accounts', 'Execution: PowerShell', 'Impact: Data Encrypted for Impact'],
            techniques: ['T1078', 'T1059.001', 'T1486'],
            userId: csirtUser.id
        },
        {
            title: 'Botnet Mirai explotando routers hogareños y cámaras IP',
            description: 'Nueva variante de Mirai diseñada para realizar ataques DDoS masivos por amplificación DNS.',
            type: ThreatType.BOTNET,
            severity: CSIRTSeverity.HIGH,
            source: 'CISA Alert',
            confidence: 85,
            targetedSectors: ['Telecomunicaciones', 'Infraestructura Crítica'],
            affectedRegions: ['Global'],
            threatActor: 'Desconocido',
            ttps: ['Discovery: Network Service Scanning', 'Impact: Network Denial of Service'],
            techniques: ['T1046', 'T1498'],
            userId: csirtUser.id
        }
    ];

    for (const threat of threatIntelData) {
        await prisma.threatIntelligence.create({
            data: threat
        });
    }

    console.log(`✅ ${threatIntelData.length} alertas de Threat Intelligence creadas.`);
}

main()
    .catch((e) => {
        console.error('❌ Error en seed-csirt:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
