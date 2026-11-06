"use client";

import ModuleDashboard from '@/components/modules/ModuleDashboard';

export default function ReportsPage() {
    const modules = [
        { title: "Reporte Ejecutivo", description: "Resumen de alto nivel para directivos", status: "active" as const },
        { title: "Reporte Técnico", description: "Detalles granulares de eventos y hallazgos", status: "active" as const },
        { title: "KPIs del SOC", description: "Métricas de desempeño (MTTR, MTTD)", status: "active" as const },
        { title: "Compliance Dashboard", description: "Estado de cumplimiento normativo", status: "active" as const },
        { title: "Trend Analysis", description: "Análisis de tendencias de seguridad", status: "active" as const },
        { title: "Incident Summary", description: "Resumen acumulado de incidentes", status: "active" as const },
        { title: "Vulnerability Status", description: "Estado de parches y riesgos", status: "active" as const },
        { title: "ROI Analysis", description: "Valor y retorno de inversión en seguridad", status: "active" as const },
        { title: "Team Performance", description: "Eficiencia de analistas y turnos", status: "active" as const },
        { title: "Custom Query Builder", description: "Generador de reportes personalizados", status: "active" as const },
    ];

    return (
        <ModuleDashboard
            title="Reportes y Métricas"
            description="Generación de informes ejecutivos y técnicos, visualización de KPIs del SOC y estado de cumplimiento."
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/cybersecurity' },
                { label: 'Reportes', href: '/reports/operations' }
            ]}
            modules={modules}
        />
    );
}
