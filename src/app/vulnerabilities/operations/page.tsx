"use client";

import ModuleDashboard from '@/components/modules/ModuleDashboard';

export default function VulnerabilitiesPage() {
    const modules = [
        { title: "Escaneo de Vulnerabilidades", description: "Detección automatizada de fallos conocidos", status: "active" as const },
        { title: "Gestión de Parches", description: "Control de actualizaciones de seguridad", status: "active" as const },
        { title: "Priorización de Riesgos", description: "Scoring basado en contexto de negocio", status: "active" as const },
        { title: "Web App Scanning (DAST)", description: "Análisis dinámico de aplicaciones web", status: "active" as const },
        { title: "Code Analysis (SAST)", description: "Análisis estático de código fuente", status: "active" as const },
        { title: "Container Security", description: "Seguridad en imágenes y contenedores Docker", status: "active" as const },
        { title: "Cloud Posture (CSPM)", description: "Auditoría de configuración en nube", status: "active" as const },
        { title: "Configuration Audit", description: "Hardening de servidores y servicios", status: "active" as const },
        { title: "Remediation Tracking", description: "Seguimiento de planes de corrección", status: "active" as const },
        { title: "Compliance Reporting", description: "Informes de cumplimiento normativo", status: "active" as const },
    ];

    return (
        <ModuleDashboard
            title="Gestión de Vulnerabilidades"
            description="Identificación y remediación de brechas de seguridad mediante escaneo continuo y priorización de riesgos."
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/cybersecurity' },
                { label: 'Vulnerabilidades', href: '/vulnerabilities/operations' }
            ]}
            modules={modules}
        />
    );
}
