"use client";

import ModuleDashboard from '@/components/modules/ModuleDashboard';

export default function ThreatHuntingPage() {
    const modules = [
        { title: "Búsqueda de IOCs", description: "Rastreo de indicadores de compromiso conocidos", status: "active" as const },
        { title: "Análisis de Comportamiento", description: "Detección de patrones anómalos de usuario (UEBA)", status: "active" as const },
        { title: "Caza en Endpoints", description: "Búsqueda proactiva en dispositivos finales", status: "active" as const },
        { title: "MITRE ATT&CK Mapping", description: "Mapeo de tácticas y técnicas de adversarios", status: "active" as const },
        { title: "Adversary Emulation", description: "Simulación de ataques avanzados persistentes (APT)", status: "active" as const },
        { title: "Honeypots Management", description: "Gestión de sistemas de señuelo", status: "active" as const },
        { title: "Dark Web Monitoring", description: "Vigilancia de filtraciones en la red oscura", status: "active" as const },
        { title: "Insider Threat", description: "Detección de amenazas internas", status: "active" as const },
        { title: "Data Exfiltration", description: "Análisis de fuga de información", status: "active" as const },
        { title: "Threat Intel Feeds", description: "Gestión de fuentes de inteligencia", status: "active" as const },
    ];

    return (
        <ModuleDashboard
            title="Threat Hunting"
            description="Búsqueda proactiva de amenazas ocultas e identificación de actores maliciosos antes de que ataquen."
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/cybersecurity' },
                { label: 'Threat Hunting', href: '/threat-hunting/operations' }
            ]}
            modules={modules}
        />
    );
}
