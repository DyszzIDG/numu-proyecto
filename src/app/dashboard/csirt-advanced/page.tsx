'use client';

import React from 'react';
import {
    Activity, FileScan, Eye, Shield, Search, Crosshair,
    Lock, Bug, Database, Cloud, Globe,
    Server, Cpu, Key, FileText, Zap, Layers, Users,
    Radar, Terminal, Network, Fingerprint, Code,
    Settings, HardDrive, Smartphone, FileCode
} from 'lucide-react';

export default function CSIRTAdvancedPage() {

    // Data structure based on the detailed provided list
    const sections = [
        {
            title: "Monitoreo y Detección",
            icon: Eye,
            color: "text-blue-400",
            items: [
                { name: "Dashboard en tiempo real", status: "Active" },
                { name: "SIEM centralizado", status: "Active" },
                { name: "Alertas en vivo", status: "Active" },
                { name: "Detección de anomalías por IA", status: "Beta" },
                { name: "EDR - Endpoint Detection", status: "Active" },
                { name: "NDR - Network Detection", status: "Configuring" },
                { name: "Logs en tiempo real", status: "Active" },
                { name: "Correlación de eventos", status: "Active" },
                { name: "IDS/IPS Dashboard", status: "Active" },
                { name: "Health check infraestructura", status: "Maintenance" }
            ]
        },
        {
            title: "Gestión de Incidentes",
            icon: Shield,
            color: "text-red-400",
            items: [
                { name: "Registro de incidentes", status: "Active" },
                { name: "Clasificación de severidad", status: "Active" },
                { name: "Timeline del incidente", status: "Active" },
                { name: "Evidencias adjuntas", status: "Active" },
                { name: "Playbooks automatizados", status: "Beta" },
                { name: "Respuesta colaborativa", status: "Active" },
                { name: "Análisis RCA", status: "Manual" },
                { name: "Notificaciones automáticas", status: "Active" },
                { name: "Asignación de roles", status: "Active" },
                { name: "SLA de resolución", status: "Active" }
            ]
        },
        {
            title: "Forense Digital",
            icon: HardDrive, // Better icon for storage/forensics
            color: "text-amber-400",
            items: [
                { name: "Análisis de disco", status: "Manual" },
                { name: "Análisis de memoria RAM", status: "Manual" },
                { name: "Timeline forense", status: "Active" },
                { name: "Sandbox de malware", status: "Active" },
                { name: "VirusTotal/AnyRun", status: "Integrated" },
                { name: "Cadena de custodia", status: "Manual" },
                { name: "PCAP y análisis de tráfico", status: "Active" },
                { name: "Carving de archivos", status: "Tool" },
                { name: "Artefactos Windows", status: "Tool" },
                { name: "Reporte forense automatizado", status: "Beta" }
            ]
        },
        {
            title: "Threat Hunting",
            icon: Crosshair,
            color: "text-purple-400",
            items: [
                { name: "Búsqueda de IOCs", status: "Active" },
                { name: "Análisis de comportamiento", status: "Active" },
                { name: "Caza de amenazas en endpoints", status: "Scheduled" },
                { name: "Caza de amenazas en red", status: "Scheduled" },
                { name: "Inteligencia de amenazas (CTI)", status: "Active" },
                { name: "Análisis de campañas", status: "Manual" },
                { name: "Mapeo MITRE ATT&CK", status: "Beta" },
                { name: "Reglas YARA", status: "Active" },
                { name: "Reglas Sigma", status: "Active" },
                { name: "Investigación de actores", status: "Manual" }
            ]
        },
        {
            title: "Gestión de Vulnerabilidades",
            icon: Bug,
            color: "text-yellow-400",
            items: [
                { name: "Escaneo de vulnerabilidades", status: "Scheduled" },
                { name: "Gestión de parches", status: "External" },
                { name: "Priorización de riesgos", status: "Active" },
                { name: "Reportes de cumplimiento", status: "Active" },
                { name: "CVE Search", status: "Active" },
                { name: "Análisis de configuración", status: "Active" },
                { name: "Vulnerabilidades web", status: "Active" },
                { name: "Vulnerabilidades de red", status: "Active" },
                { name: "Vulnerabilidades cloud", status: "Active" },
                { name: "Remediación automática", status: "Off" }
            ]
        },
        {
            title: "Análisis de Malware",
            icon: FileCode,
            color: "text-green-400",
            items: [
                { name: "Análisis estático", status: "Tool" },
                { name: "Análisis dinámico", status: "Tool" },
                { name: "Ingeniería inversa", status: "Manual" },
                { name: "Desempaquetado", status: "Tool" },
                { name: "Análisis de scripts", status: "Tool" },
                { name: "Firmas de malware", status: "Active" },
                { name: "Comportamiento en sandbox", status: "Active" },
                { name: "Extracción de config", status: "Manual" },
                { name: "Análisis de macros", status: "Tool" },
                { name: "Detección de ransomware", status: "Active" }
            ]
        },
        {
            title: "OSINT e Investigación",
            icon: Globe,
            color: "text-cyan-400",
            items: [
                { name: "Búsqueda de dominios", status: "Tool" },
                { name: "Investigación de IPs", status: "Active" },
                { name: "Análisis de correos", status: "Tool" },
                { name: "Redes sociales", status: "Manual" },
                { name: "Shodan/Censys", status: "Integrated" },
                { name: "Metadatos de archivos", status: "Tool" },
                { name: "Geolocalización", status: "Tool" },
                { name: "Dark Web Monitoring", status: "Service" },
                { name: "Breach Data Search", status: "Active" },
                { name: "Reconocimiento pasivo", status: "Active" }
            ]
        },
        {
            title: "Reportes y Métricas",
            icon: FileText,
            color: "text-gray-300",
            items: [
                { name: "Reporte ejecutivo", status: "Auto" },
                { name: "Reporte técnico", status: "Auto" },
                { name: "KPIs del SOC", status: "Live" },
                { name: "Métricas de incidentes", status: "Live" },
                { name: "Tiempos de respuesta", status: "Live" },
                { name: "Efectividad de controles", status: "Beta" },
                { name: "Historial de comunicaciones", status: "Active" },
                { name: "Alertas CERT", status: "Subscribed" },
                { name: "Reportes regulatorios", status: "Manual" },
                { name: "Notificación de brechas", status: "Active" }
            ]
        },
        {
            title: "Automatización SOAR",
            icon: Zap,
            color: "text-yellow-600",
            items: [
                { name: "Ejecución de playbooks", status: "Active" },
                { name: "Integración firewalls", status: "Active" },
                { name: "Integración proxies", status: "Active" },
                { name: "Integración IAM", status: "Active" },
                { name: "Bloqueo de IPs", status: "Auto" },
                { name: "Aislamiento de hosts", status: "Manual" },
                { name: "Escaneo automático", status: "Active" },
                { name: "Auditoría SOAR", status: "Active" },
                { name: "Orquestación avanzada", status: "Beta" },
                { name: "Automatizaciones exitosas", status: "Stats" }
            ]
        },
        {
            title: "Seguridad Empresarial Avanzada",
            icon: Users,
            color: "text-indigo-400",
            items: [
                { name: "Análisis UEBA", status: "Beta" },
                { name: "Gestión de riesgos", status: "Active" },
                { name: "Compliance ISO/NIST", status: "Active" },
                { name: "Evaluación de proveedores", status: "Manual" },
                { name: "Gestión de brechas", status: "Active" },
                { name: "Auditoría continua", status: "Active" },
                { name: "Seguridad cloud", status: "Active" },
                { name: "Alertas cloud", status: "Active" },
                { name: "Gestión de secretos", status: "Vault" },
                { name: "Gobierno de datos", status: "Manual" }
            ]
        },
        {
            title: "Infraestructura y Red",
            icon: Network,
            color: "text-blue-500",
            items: [
                { name: "Topología de red", status: "Live" },
                { name: "Estado de enlaces", status: "Live" },
                { name: "Monitoreo BGP", status: "Active" },
                { name: "Panel WAF", status: "Active" },
                { name: "Gestión de ACLs", status: "Review" },
                { name: "Monitoreo VLAN", status: "Active" },
                { name: "Supervisión de servidores", status: "Active" },
                { name: "Control DNS", status: "Active" },
                { name: "DNS sospechoso", status: "Alert" },
                { name: "Puertos expuestos", status: "Scan" }
            ]
        },
        {
            title: "Protección de Identidad",
            icon: Fingerprint,
            color: "text-pink-400",
            items: [
                { name: "Autenticaciones sospechosas", status: "Alert" },
                { name: "Movimientos laterales", status: "Detect" },
                { name: "Cuentas privilegiadas", status: "Vault" },
                { name: "Panel PAM", status: "Active" },
                { name: "Protección Active Directory", status: "Active" },
                { name: "Password spraying", status: "Detect" },
                { name: "MFA Health Check", status: "Active" },
                { name: "Sesiones anómalas", status: "Alert" },
                { name: "Azure AD/Okta", status: "Linked" },
                { name: "Auditoría de contraseñas", status: "Review" }
            ]
        },
        // Adding remaining high-level categories to ensure coverage without overwhelming the UI
        {
            title: "Protección en Aplicaciones",
            icon: Code,
            color: "text-teal-400",
            items: [
                { name: "Ataques OWASP Top 10", status: "Block" },
                { name: "Tráfico API sospechoso", status: "Monitor" },
                { name: "Escaneo SAST/DAST", status: "Pipeline" },
                { name: "SCA - Dependencias", status: "Active" }
            ]
        },
        {
            title: "IA y Automatización",
            icon: Radar,
            color: "text-fuchsia-400",
            items: [
                { name: "Detección IA avanzada", status: "Active" },
                { name: "Asistente CSIRT Copilot", status: "Beta" },
                { name: "Predicción de riesgos", status: "Learning" },
                { name: "Generador de playbooks", status: "Tool" }
            ]
        }
    ];

    return (
        <div className="p-6 bg-slate-900 min-h-screen text-slate-100">
            <div className="mb-8 flex justify-between items-end border-b border-slate-700 pb-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                        CSIRT Advanced Operations
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Centro de comando unificado para ciberseguridad, respuesta y análisis forense.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <div className="text-sm text-slate-400">Estado del Sistema</div>
                        <div className="text-green-400 font-bold flex items-center justify-end gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            OPERATIONAL
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sections.map((section, idx) => (
                    <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-slate-600 hover:bg-slate-800 transition-all group">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-lg bg-slate-900 border border-slate-700 ${section.color}`}>
                                <section.icon className="w-5 h-5" />
                            </div>
                            <h3 className={`font-bold text-lg ${section.color}`}>{section.title}</h3>
                        </div>

                        <div className="space-y-2">
                            {section.items.map((item, itemIdx) => (
                                <div key={itemIdx} className="flex justify-between items-center text-sm p-2 rounded hover:bg-slate-700/50 transition cursor-default">
                                    <span className="text-slate-300">{item.name}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border
                                        ${item.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            item.status === 'Beta' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                item.status === 'Alert' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    item.status === 'Manual' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' :
                                                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
