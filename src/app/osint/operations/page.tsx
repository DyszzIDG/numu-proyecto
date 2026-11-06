"use client";

import ModuleDashboard from '@/components/modules/ModuleDashboard';

export default function OsintPage() {
    const modules = [
        { title: "Búsqueda de Dominios", description: "Enumeración de subdominios y registros DNS", status: "active" as const },
        { title: "Investigación de IPs", description: "Geolocalización, ASN y reputación", status: "active" as const },
        { title: "Análisis de Correos", description: "Verificación de brechas de seguridad", status: "active" as const },
        { title: "Social Media (SOCMINT)", description: "Inteligencia en redes sociales", status: "active" as const },
        { title: "Reverse Image Search", description: "Rastreo de imágenes en la web", status: "active" as const },
        { title: "Whois & DNS History", description: "Historial de propiedad de dominios", status: "active" as const },
        { title: "Dark Web Scraping", description: "Monitorización de foros underground", status: "active" as const },
        { title: "Metadata Analysis", description: "Extracción de datos de documentos públicos", status: "active" as const },
        { title: "Public Records", description: "Búsqueda en registros públicos", status: "active" as const },
        { title: "Username Enumeration", description: "Rastreo de huella digital por usuario", status: "active" as const },
    ];

    return (
        <ModuleDashboard
            title="OSINT e Investigación"
            description="Inteligencia de fuentes abiertas y reconocimiento para perfilar amenazas y actores maliciosos."
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/cybersecurity' },
                { label: 'OSINT', href: '/osint/operations' }
            ]}
            modules={modules}
        />
    );
}
