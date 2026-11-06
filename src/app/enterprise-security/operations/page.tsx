"use client";

import ModuleDashboard from '@/components/modules/ModuleDashboard';

export default function EnterpriseSecurityPage() {
    const modules = [
        { title: "Análisis UEBA", description: "User and Entity Behavior Analytics", status: "active" as const },
        { title: "Gestión de Riesgos", description: "Evaluación y tratamiento de riesgos", status: "active" as const },
        { title: "Compliance ISO/NIST", description: "Seguimiento de estándares internacionales", status: "active" as const },
        { title: "Security Awareness", description: "Concienciación y phishing simulado", status: "active" as const },
        { title: "Policy Management", description: "Gestión de políticas de seguridad", status: "active" as const },
        { title: "Vendor Risk", description: "Evaluación de seguridad en proveedores", status: "active" as const },
        { title: "Business Continuity", description: "Planes de continuidad y recuperación", status: "active" as const },
        { title: "Audit Logs", description: "Auditoría de accesos y cambios", status: "active" as const },
        { title: "Asset Inventory", description: "Inventario de activos críticos", status: "active" as const },
        { title: "Governance Dashboard", description: "Tablero de gobierno de seguridad", status: "active" as const },
    ];

    return (
        <ModuleDashboard
            title="Seguridad Empresarial"
            description="Gestión integral de riesgos corporativos, cumplimiento normativo y gobierno de seguridad."
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/cybersecurity' },
                { label: 'Seguridad Empresarial', href: '/enterprise-security/operations' }
            ]}
            modules={modules}
        />
    );
}
