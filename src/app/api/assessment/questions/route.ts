import { NextRequest, NextResponse } from 'next/server';

// Security assessment questions database
const QUESTIONS = [
    // Governance & Policy
    { id: 'gov_1', category: 'Gobernanza y Políticas', text: '¿La organización tiene una política de seguridad de la información documentada y aprobada?', weight: 1 },
    { id: 'gov_2', category: 'Gobernanza y Políticas', text: '¿Existe un comité o responsable de seguridad de la información?', weight: 1 },
    { id: 'gov_3', category: 'Gobernanza y Políticas', text: '¿Se realizan revisiones periódicas de las políticas de seguridad?', weight: 0.8 },

    // Access Control
    { id: 'acc_1', category: 'Control de Acceso', text: '¿Se implementa autenticación multifactor (MFA) para accesos críticos?', weight: 1.2 },
    { id: 'acc_2', category: 'Control de Acceso', text: '¿Existe un proceso formal de alta/baja de usuarios?', weight: 1 },
    { id: 'acc_3', category: 'Control de Acceso', text: '¿Se revisan periódicamente los privilegios de acceso?', weight: 0.9 },

    // Network Security
    { id: 'net_1', category: 'Seguridad de Red', text: '¿Se utiliza un firewall para proteger la red corporativa?', weight: 1.1 },
    { id: 'net_2', category: 'Seguridad de Red', text: '¿Se segmenta la red en zonas de seguridad?', weight: 1 },
    { id: 'net_3', category: 'Seguridad de Red', text: '¿Se monitorea el tráfico de red en busca de amenazas?', weight: 1.2 },

    // Data Protection
    { id: 'data_1', category: 'Protección de Datos', text: '¿Se cifran los datos sensibles en reposo?', weight: 1.3 },
    { id: 'data_2', category: 'Protección de Datos', text: '¿Se cifran los datos en tránsito (HTTPS, VPN)?', weight: 1.2 },
    { id: 'data_3', category: 'Protección de Datos', text: '¿Existe un proceso de clasificación de datos?', weight: 0.9 },

    // Incident Response
    { id: 'inc_1', category: 'Respuesta a Incidentes', text: '¿Existe un plan de respuesta a incidentes documentado?', weight: 1.1 },
    { id: 'inc_2', category: 'Respuesta a Incidentes', text: '¿Se realizan simulacros de respuesta a incidentes?', weight: 0.9 },
    { id: 'inc_3', category: 'Respuesta a Incidentes', text: '¿Existe un equipo designado para respuesta a incidentes?', weight: 1 },

    // Backup & Recovery
    { id: 'bkp_1', category: 'Respaldo y Recuperación', text: '¿Se realizan respaldos regulares de datos críticos?', weight: 1.2 },
    { id: 'bkp_2', category: 'Respaldo y Recuperación', text: '¿Se prueban periódicamente los procesos de recuperación?', weight: 1.1 },
    { id: 'bkp_3', category: 'Respaldo y Recuperación', text: '¿Los respaldos se almacenan en ubicaciones separadas?', weight: 1 },

    // Security Awareness
    { id: 'awa_1', category: 'Concienciación', text: '¿Se brinda capacitación en seguridad a todos los empleados?', weight: 0.9 },
    { id: 'awa_2', category: 'Concienciación', text: '¿Se realizan campañas de phishing simulado?', weight: 0.8 },
    { id: 'awa_3', category: 'Concienciación', text: '¿Existe material educativo sobre seguridad disponible?', weight: 0.7 },

    // Vulnerability Management
    { id: 'vul_1', category: 'Gestión de Vulnerabilidades', text: '¿Se realizan escaneos de vulnerabilidades periódicos?', weight: 1.2 },
    { id: 'vul_2', category: 'Gestión de Vulnerabilidades', text: '¿Existe un proceso para parchear sistemas críticos?', weight: 1.3 },
    { id: 'vul_3', category: 'Gestión de Vulnerabilidades', text: '¿Se priorizan las vulnerabilidades según su criticidad?', weight: 1 },
];

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const industry = searchParams.get('industry');

    // For now, return all questions regardless of industry
    // In the future, you could filter questions based on industry
    return NextResponse.json({
        success: true,
        questions: QUESTIONS
    });
}
