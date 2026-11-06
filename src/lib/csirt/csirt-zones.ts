
import {
    Activity, Layout, HardDrive, Crosshair, ShieldAlert, Bug, GitBranch,
    Globe, BarChart3, Database, Network, Key, AppWindow, Cpu
} from 'lucide-react';

export type ModuleStatus = 'Active' | 'Beta' | 'Manual' | 'Tool' | 'Integrated' | 'Scheduled' | 'Maintenance' | 'Configuring' | 'Live' | 'Alert' | 'Detect' | 'Vault' | 'Pipeline' | 'Block' | 'Monitor' | 'Auto' | 'Stats' | 'Review' | 'Off' | 'Subscribed' | 'Linked' | 'Learning' | 'Service';

export interface CSIRTModule {
    name: string;
    status: ModuleStatus;
    description?: string;
    actionLabel?: string;
}

export interface CSIRTZone {
    id: string;
    slug: string;
    title: string;
    description: string;
    icon: any;
    color: string;
    modules: CSIRTModule[];
    hasDedicatedComponent?: boolean; // If true, routed to specific component. If false, uses Generic Dashboard.
}

export const CSIRT_ZONES: CSIRTZone[] = [
    {
        id: 'ZONE-01',
        slug: 'monitoreo-y-deteccion',
        title: 'Monitoreo y Detección',
        description: 'Dashboards en tiempo real y detección de anomalías.',
        icon: Activity,
        color: 'blue',
        hasDedicatedComponent: true,
        modules: [
            { name: 'Dashboard en tiempo real', status: 'Active' },
            { name: 'SIEM centralizado', status: 'Active' },
            { name: 'Alertas en vivo', status: 'Active' },
            { name: 'Detección de anomalías por IA', status: 'Beta' },
            { name: 'EDR - Endpoint Detection', status: 'Active' },
            { name: 'NDR - Network Detection', status: 'Configuring' },
            { name: 'Logs en tiempo real', status: 'Active' },
            { name: 'Correlación de eventos', status: 'Active' },
            { name: 'IDS/IPS Dashboard', status: 'Active' },
            { name: 'Health check infraestructura', status: 'Maintenance' },
        ]
    },
    {
        id: 'ZONE-02',
        slug: 'gestion-de-incidentes',
        title: 'Gestión de Incidentes',
        description: 'Respuesta coordinada y clasificación de eventos.',
        icon: Layout,
        color: 'red',
        hasDedicatedComponent: true,
        modules: [
            { name: 'Registro de incidentes', status: 'Active' },
            { name: 'Clasificación de severidad', status: 'Active' },
            { name: 'Timeline del incidente', status: 'Active' },
            { name: 'Evidencias adjuntas', status: 'Active' },
            { name: 'Playbooks automatizados', status: 'Beta' },
            { name: 'Respuesta colaborativa', status: 'Active' },
            { name: 'Análisis RCA', status: 'Manual' },
            { name: 'Notificaciones automáticas', status: 'Active' },
            { name: 'Asignación de roles', status: 'Active' },
            { name: 'SLA de resolución', status: 'Active' },
        ]
    },
    {
        id: 'ZONE-03',
        slug: 'forense-digital',
        title: 'Forense Digital',
        description: 'Laboratorio de análisis profundo y cadena de custodia.',
        icon: HardDrive,
        color: 'purple',
        hasDedicatedComponent: true,
        modules: [
            { name: 'Análisis de disco', status: 'Manual' },
            { name: 'Análisis de memoria RAM', status: 'Manual' },
            { name: 'Timeline forense', status: 'Active' },
            { name: 'Sandbox de malware', status: 'Active' },
            { name: 'VirusTotal/AnyRun', status: 'Integrated' },
            { name: 'Cadena de custodia', status: 'Manual' },
            { name: 'PCAP y análisis de tráfico', status: 'Active' },
            { name: 'Carving de archivos', status: 'Tool' },
            { name: 'Artefactos Windows', status: 'Tool' },
            { name: 'Reporte forense automatizado', status: 'Beta' },
        ]
    },
    {
        id: 'ZONE-04',
        slug: 'threat-hunting',
        title: 'Threat Hunting',
        description: 'Búsqueda proactiva de amenazas ocultas.',
        icon: Crosshair,
        color: 'orange',
        hasDedicatedComponent: true,
        modules: [
            { name: 'Búsqueda de IOCs', status: 'Active' },
            { name: 'Análisis de comportamiento', status: 'Active' },
            { name: 'Caza de amenazas en endpoints', status: 'Scheduled' },
            { name: 'Caza de amenazas en red', status: 'Scheduled' },
            { name: 'Inteligencia de amenazas (CTI)', status: 'Active' },
            { name: 'Análisis de campañas', status: 'Manual' },
            { name: 'Mapeo MITRE ATT&CK', status: 'Beta' },
            { name: 'Reglas YARA', status: 'Active' },
            { name: 'Reglas Sigma', status: 'Active' },
            { name: 'Investigación de actores', status: 'Manual' },
        ]
    },
    {
        id: 'ZONE-05',
        slug: 'gestion-de-vulnerabilidades',
        title: 'Gestión de Vulnerabilidades',
        description: 'Identificación y remediación de brechas de seguridad.',
        icon: ShieldAlert,
        color: 'yellow',
        hasDedicatedComponent: true,
        modules: [
            { name: 'Escaneo de vulnerabilidades', status: 'Scheduled' },
            { name: 'Gestión de parches', status: 'External' },
            { name: 'Priorización de riesgos', status: 'Active' },
            { name: 'Reportes de cumplimiento', status: 'Active' },
            { name: 'CVE Search', status: 'Active' },
            { name: 'Análisis de configuración', status: 'Active' },
            { name: 'Vulnerabilidades web', status: 'Active' },
            { name: 'Vulnerabilidades de red', status: 'Active' },
            { name: 'Vulnerabilidades cloud', status: 'Active' },
            { name: 'Remediación automática', status: 'Off' },
        ]
    },
    {
        id: 'ZONE-06',
        slug: 'analisis-de-malware',
        title: 'Análisis de Malware',
        description: 'Despiece seguro de código malicioso.',
        icon: Bug,
        color: 'emerald',
        hasDedicatedComponent: true,
        modules: [
            { name: 'Análisis estático', status: 'Tool' },
            { name: 'Análisis dinámico', status: 'Tool' },
            { name: 'Ingeniería inversa', status: 'Manual' },
            { name: 'Desempaquetado', status: 'Tool' },
            { name: 'Análisis de scripts', status: 'Tool' },
            { name: 'Firmas de malware', status: 'Active' },
            { name: 'Comportamiento en sandbox', status: 'Active' },
            { name: 'Extracción de config', status: 'Manual' },
            { name: 'Análisis de macros', status: 'Tool' },
            { name: 'Detección de ransomware', status: 'Active' },
        ]
    },
    {
        id: 'ZONE-07',
        slug: 'osint-e-investigacion',
        title: 'OSINT e Investigación',
        description: 'Inteligencia de fuentes abiertas y reconocimiento.',
        icon: Globe,
        color: 'indigo',
        hasDedicatedComponent: false,
        modules: [
            { name: 'Búsqueda de dominios', status: 'Tool' },
            { name: 'Investigación de IPs', status: 'Active' },
            { name: 'Análisis de correos', status: 'Tool' },
            { name: 'Redes sociales', status: 'Manual' },
            { name: 'Shodan/Censys', status: 'Integrated' },
            { name: 'Metadatos de archivos', status: 'Tool' },
            { name: 'Geolocalización', status: 'Tool' },
            { name: 'Dark Web Monitoring', status: 'Service' },
            { name: 'Breach Data Search', status: 'Active' },
            { name: 'Reconocimiento pasivo', status: 'Active' },
        ]
    },
    {
        id: 'ZONE-08',
        slug: 'reportes-y-metricas',
        title: 'Reportes y Métricas',
        description: 'KPIs del SOC y generación de informes.',
        icon: BarChart3,
        color: 'slate',
        hasDedicatedComponent: false,
        modules: [
            { name: 'Reporte ejecutivo', status: 'Auto' },
            { name: 'Reporte técnico', status: 'Auto' },
            { name: 'KPIs del SOC', status: 'Live' },
            { name: 'Métricas de incidentes', status: 'Live' },
            { name: 'Tiempos de respuesta', status: 'Live' },
            { name: 'Efectividad de controles', status: 'Beta' },
            { name: 'Historial de comunicaciones', status: 'Active' },
            { name: 'Alertas CERT', status: 'Subscribed' },
            { name: 'Reportes regulatorios', status: 'Manual' },
            { name: 'Notificación de brechas', status: 'Active' },
        ]
    },
    {
        id: 'ZONE-09',
        slug: 'automatizacion-soar',
        title: 'Automatización SOAR',
        description: 'Orquestación de seguridad y respuesta aut.',
        icon: GitBranch,
        color: 'pink',
        hasDedicatedComponent: true,
        modules: [
            { name: 'Ejecución de playbooks', status: 'Active' },
            { name: 'Integración firewalls', status: 'Active' },
            { name: 'Integración proxies', status: 'Active' },
            { name: 'Integración IAM', status: 'Active' },
            { name: 'Bloqueo de IPs', status: 'Auto' },
            { name: 'Aislamiento de hosts', status: 'Manual' },
            { name: 'Escaneo automático', status: 'Active' },
            { name: 'Auditoría SOAR', status: 'Active' },
            { name: 'Orquestación avanzada', status: 'Beta' },
            { name: 'Automatizaciones exitosas', status: 'Stats' },
        ]
    },
    {
        id: 'ZONE-10',
        slug: 'seguridad-empresarial-avanzada',
        title: 'Seguridad Empresarial',
        description: 'Gestión de riesgos corporativos y cumplimiento.',
        icon: Database,
        color: 'teal',
        hasDedicatedComponent: false,
        modules: [
            { name: 'Análisis UEBA', status: 'Beta' },
            { name: 'Gestión de riesgos', status: 'Active' },
            { name: 'Compliance ISO/NIST', status: 'Active' },
            { name: 'Evaluación de proveedores', status: 'Manual' },
            { name: 'Gestión de brechas', status: 'Active' },
            { name: 'Auditoría continua', status: 'Active' },
            { name: 'Seguridad cloud', status: 'Active' },
            { name: 'Alertas cloud', status: 'Active' },
            { name: 'Gestión de secretos', status: 'Vault' },
            { name: 'Gobierno de datos', status: 'Manual' },
        ]
    },
    {
        id: 'ZONE-11',
        slug: 'infraestructura-y-red',
        title: 'Infraestructura y Red',
        description: 'Seguridad perimetral y topología.',
        icon: Network,
        color: 'cyan',
        hasDedicatedComponent: false,
        modules: [
            { name: 'Topología de red', status: 'Live' },
            { name: 'Estado de enlaces', status: 'Live' },
            { name: 'Monitoreo BGP', status: 'Active' },
            { name: 'Panel WAF', status: 'Active' },
            { name: 'Gestión de ACLs', status: 'Review' },
            { name: 'Monitoreo VLAN', status: 'Active' },
            { name: 'Supervisión de servidores', status: 'Active' },
            { name: 'Control DNS', status: 'Active' },
            { name: 'DNS sospechoso', status: 'Alert' },
            { name: 'Puertos expuestos', status: 'Scan' },
        ]
    },
    {
        id: 'ZONE-12',
        slug: 'proteccion-de-identidad',
        title: 'Protección de Identidad',
        description: 'IAM Security y deteccion de credenciales.',
        icon: Key,
        color: 'violet',
        hasDedicatedComponent: false,
        modules: [
            { name: 'Autenticaciones sospechosas', status: 'Alert' },
            { name: 'Movimientos laterales', status: 'Detect' },
            { name: 'Cuentas privilegiadas', status: 'Vault' },
            { name: 'Panel PAM', status: 'Active' },
            { name: 'Protección Active Directory', status: 'Active' },
            { name: 'Password spraying', status: 'Detect' },
            { name: 'MFA Health Check', status: 'Active' },
            { name: 'Sesiones anómalas', status: 'Alert' },
            { name: 'Azure AD/Okta', status: 'Linked' },
            { name: 'Auditoría de contraseñas', status: 'Review' },
        ]
    },
    {
        id: 'ZONE-13',
        slug: 'proteccion-en-aplicaciones',
        title: 'App Protection',
        description: 'Seguridad en el ciclo de vida de desarrollo.',
        icon: AppWindow,
        color: 'rose',
        hasDedicatedComponent: false,
        modules: [
            { name: 'Ataques OWASP Top 10', status: 'Block' },
            { name: 'Tráfico API sospechoso', status: 'Monitor' },
            { name: 'Escaneo SAST/DAST', status: 'Pipeline' },
            { name: 'SCA - Dependencias', status: 'Active' },
        ]
    },
    {
        id: 'ZONE-14',
        slug: 'ia-y-automatizacion',
        title: 'IA y Automatización',
        description: 'Next-gen security con modelos LLM.',
        icon: Cpu,
        color: 'fuchsia',
        hasDedicatedComponent: false,
        modules: [
            { name: 'Detección IA avanzada', status: 'Active' },
            { name: 'Asistente CSIRT Copilot', status: 'Beta' },
            { name: 'Predicción de riesgos', status: 'Learning' },
            { name: 'Generador de playbooks', status: 'Tool' },
        ]
    },
];

export const getZoneBySlug = (slug: string) => CSIRT_ZONES.find(z => z.slug === slug);
