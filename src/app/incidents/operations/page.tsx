"use client";

import ModuleDashboard from '@/components/modules/ModuleDashboard';

export default function IncidentsPage() {
    const modules = [
        { title: "Registro de Incidentes", description: "Alta y seguimiento de eventos de seguridad", status: "active" as const },
        { title: "Clasificación de Severidad", description: "Matriz de impacto y urgencia automática", status: "active" as const },
        { title: "Timeline del Incidente", description: "Línea de tiempo cronológica de evidencias", status: "active" as const },
        { title: "Asignación de Tareas", description: "Delegación de responsabilidades al equipo", status: "active" as const },
        { title: "Base de Conocimiento", description: "Repositorio de soluciones y lecciones aprendidas", status: "active" as const },
        { title: "Gestión de Tickets", description: "Integración con sistemas de mesa de ayuda", status: "active" as const },
        { title: "Playbooks Automáticos", description: "Guías de respuesta predefinidas", status: "active" as const },
        { title: "Sala de Guerra Virtual", description: "Espacio de colaboración para crisis", status: "active" as const },
        { title: "Cadena de Custodia", description: "Registro inmutable de manejo de evidencia", status: "active" as const },
        { title: "Análisis Post-mortem", description: "Generación de reportes de cierre", status: "active" as const },
    ];

    return (
        <ModuleDashboard
            title="Gestión de Incidentes"
            description="Respuesta coordinada y clasificación de eventos para minimizar el impacto de las amenazas."
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/cybersecurity' },
                { label: 'Incidentes', href: '/incidents/operations' }
            ]}
            modules={modules}
        />
    );
}
