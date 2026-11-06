"use client";

import ModuleDashboard from '@/components/modules/ModuleDashboard';

export default function MonitoringPage() {
    const modules = [
        { title: "Dashboard en tiempo real", description: "Visualización centralizada de eventos de seguridad", status: "active" as const },
        { title: "SIEM Centralizado", description: "Correlación y almacenamiento de logs", status: "active" as const },
        { title: "Alertas en vivo", description: "Notificaciones instantáneas de amenazas críticas", status: "active" as const },
        { title: "Detección de Intrusiones (IDS)", description: "Monitoreo de tráfico malicioso en la red", status: "active" as const },
        { title: "Análisis de Tráfico", description: "Inspección profunda de paquetes y flujos", status: "active" as const },
        { title: "Monitoreo de Endpoints", description: "Vigilancia de seguridad en dispositivos finales", status: "active" as const },
        { title: "Log Management", description: "Gestión y retención de registros de auditoría", status: "active" as const },
        { title: "Detección por IA", description: "Análisis de comportamiento anómalo con ML", status: "active" as const },
        { title: "Correlación de Eventos", description: "Motor de reglas para vincular alertas", status: "active" as const },
        { title: "Health Check", description: "Estado de salud de sensores y agentes", status: "maintenance" as const },
    ];

    return (
        <ModuleDashboard
            title="Monitoreo y Detección"
            description="Dashboards en tiempo real y detección de anomalías para una visibilidad completa de la infraestructura."
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/cybersecurity' },
                { label: 'Monitoreo', href: '/monitoring/operations' }
            ]}
            modules={modules}
        />
    );
}
