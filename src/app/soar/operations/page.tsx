"use client";

import ModuleDashboard from '@/components/modules/ModuleDashboard';

export default function SoarPage() {
    const modules = [
        { title: "Ejecución de Playbooks", description: "Flujos de trabajo automatizados", status: "active" as const },
        { title: "Integración Firewalls", description: "Bloqueo automático de IPs", status: "active" as const },
        { title: "Integración Proxies", description: "Gestión de listas negras web", status: "active" as const },
        { title: "Ticketing Sync", description: "Sincronización bidireccional de casos", status: "active" as const },
        { title: "Email Parsing", description: "Análisis automático de phishing", status: "active" as const },
        { title: "Evidence Collection", description: "Recolección forense automática", status: "active" as const },
        { title: "Automated Response", description: "Acciones de contención inmediata", status: "active" as const },
        { title: "Case Management", description: "Gestión centralizada de casos", status: "active" as const },
        { title: "Workflow Designer", description: "Editor visual de automatizaciones", status: "active" as const },
        { title: "API Connectors", description: "Integración con herramientas de terceros", status: "active" as const },
    ];

    return (
        <ModuleDashboard
            title="Automatización SOAR"
            description="Orquestación de seguridad, automatización y respuesta para agilizar operaciones repetitivas."
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/cybersecurity' },
                { label: 'SOAR', href: '/soar/operations' }
            ]}
            modules={modules}
        />
    );
}
