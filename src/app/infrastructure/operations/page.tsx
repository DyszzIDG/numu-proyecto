"use client";

import ModuleDashboard from '@/components/modules/ModuleDashboard';

export default function InfrastructurePage() {
    const modules = [
        { title: "Topología de Red", description: "Mapa visual de activos y conexiones", status: "active" as const },
        { title: "Estado de Enlaces", description: "Monitoreo de disponibilidad y saturación", status: "active" as const },
        { title: "Monitoreo BGP", description: "Detección de secuestro de rutas", status: "active" as const },
        { title: "Firewall Audit", description: "Revisión de reglas y políticas de bloqueo", status: "active" as const },
        { title: "VPN Status", description: "Control de accesos remotos seguros", status: "active" as const },
        { title: "NAC Control", description: "Network Access Control y segmentación", status: "active" as const },
        { title: "DDoS Protection", description: "Mitigación de ataques de denegación de servicio", status: "active" as const },
        { title: "DNS Security", description: "Protección contra tunneling y poisoning", status: "active" as const },
        { title: "SSL/TLS Inspection", description: "Análisis de tráfico cifrado", status: "active" as const },
        { title: "Wireless Security", description: "Seguridad en redes WiFi corporativas", status: "active" as const },
    ];

    return (
        <ModuleDashboard
            title="Infraestructura y Red"
            description="Seguridad perimetral y topología de red para asegurar la columna vertebral de la organización."
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/cybersecurity' },
                { label: 'Infraestructura', href: '/infrastructure/operations' }
            ]}
            modules={modules}
        />
    );
}
