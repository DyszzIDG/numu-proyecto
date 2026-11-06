
import {
    Activity, Shield, Eye, Server, AlertTriangle, FileText,
    Search, Crosshair, Terminal, Database, Lock, Globe,
    Cpu, Wifi, UserCheck, Layers
} from 'lucide-react';

export type ModuleStatus =
    | 'Active'
    | 'Beta'
    | 'Operational'
    | 'Configuring'
    | 'Maintenance'
    | 'Manual'
    | 'Tool'
    | 'Integrated'
    | 'Scheduled'
    | 'External'
    | 'Off'
    | 'Service'
    | 'Auto'
    | 'Live'
    | 'Subscribed'
    | 'Block'
    | 'Monitor'
    | 'Pipeline'
    | 'Learning'
    | 'Alert'
    | 'Scan'
    | 'Detect'
    | 'Linked'
    | 'Review'
    | 'Vault'
    | 'Stats';

export interface CSIRTModule {
    name: string;
    status: ModuleStatus;
    description?: string;
    icon?: any;
}

export interface ModuleCategory {
    id: string;
    title: string;
    icon: any;
    modules: CSIRTModule[];
}

export const csirtModules: ModuleCategory[] = [
    {
        id: 'monitoring',
        title: 'Monitoreo y Detección',
        icon: Eye,
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
        id: 'incidents',
        title: 'Gestión de Incidentes',
        icon: AlertTriangle,
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
        id: 'forensics',
        title: 'Forense Digital',
        icon: Search,
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
        id: 'threat-hunting',
        title: 'Threat Hunting',
        icon: Crosshair,
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
        id: 'vulnerabilities',
        title: 'Gestión de Vulnerabilidades',
        icon: Shield,
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
        id: 'malware',
        title: 'Análisis de Malware',
        icon: Terminal,
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
        id: 'osint',
        title: 'OSINT e Investigación',
        icon: Globe,
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
        id: 'reports',
        title: 'Reportes y Métricas',
        icon: FileText,
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
        id: 'soar',
        title: 'Automatización SOAR',
        icon: Cpu,
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
        id: 'enterprise_security',
        title: 'Seguridad Empresarial Avanzada',
        icon: Layers,
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
        id: 'infrastructure',
        title: 'Infraestructura y Red',
        icon: Server,
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
        id: 'identity',
        title: 'Protección de Identidad',
        icon: UserCheck,
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
        id: 'application',
        title: 'Protección en Aplicaciones',
        icon: Globe,
        modules: [
            { name: 'Ataques OWASP Top 10', status: 'Block' },
            { name: 'Tráfico API sospechoso', status: 'Monitor' },
            { name: 'Escaneo SAST/DAST', status: 'Pipeline' },
            { name: 'SCA - Dependencias', status: 'Active' },
        ]
    },
    {
        id: 'ai_automation',
        title: 'IA y Automatización',
        icon: Cpu,
        modules: [
            { name: 'Detección IA avanzada', status: 'Active' },
            { name: 'Asistente CSIRT Copilot', status: 'Beta' },
            { name: 'Predicción de riesgos', status: 'Learning' },
            { name: 'Generador de playbooks', status: 'Tool' },
        ]
    },
];
