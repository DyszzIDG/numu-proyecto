"use client";

import ModuleDashboard from '@/components/modules/ModuleDashboard';

export default function AppProtectionPage() {
    const modules = [
        { title: "OWASP Top 10", description: "Protección contra las vuln. web más críticas", status: "active" as const },
        { title: "API Traffic", description: "Análisis de comportamiento de APIs", status: "active" as const },
        { title: "Escaneo SAST/DAST", description: "Análisis de código estático y dinámico", status: "active" as const },
        { title: "WAF Statistics", description: "Métricas de bloqueo del Web App Firewall", status: "active" as const },
    ];

    return (
        <ModuleDashboard
            title="App Protection"
            description="Seguridad en el ciclo de vida de desarrollo de software (SSDLC) y protección en tiempo de ejecución."
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/cybersecurity' },
                { label: 'App Protection', href: '/app-protection/operations' }
            ]}
            modules={modules}
        />
    );
}
