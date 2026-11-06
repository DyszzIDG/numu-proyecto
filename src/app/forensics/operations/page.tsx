"use client";

import ModuleDashboard from '@/components/modules/ModuleDashboard';

export default function ForensicsPage() {
    const modules = [
        { title: "Análisis de Disco", description: "Recuperación y examen de sistemas de archivos", status: "active" as const },
        { title: "Análisis de Memoria RAM", description: "Extracción de artefactos volátiles", status: "active" as const },
        { title: "Timeline Forense", description: "Reconstrucción temporal de actividades", status: "active" as const },
        { title: "Extracción de Metadatos", description: "Análisis de datos ocultos en archivos", status: "active" as const },
        { title: "Recuperación de Archivos", description: "Restauración de datos eliminados (Carving)", status: "active" as const },
        { title: "Análisis de Registros", description: "Windows Registry y logs de sistema", status: "active" as const },
        { title: "Malware Sandboxing", description: "Ejecución aislada para análisis de comportamiento", status: "active" as const },
        { title: "Network Forensics", description: "Análisis de capturas de tráfico (PCAP)", status: "active" as const },
        { title: "Gestión de Evidencia", description: "Control y preservación de pruebas digitales", status: "active" as const },
        { title: "Reporte Pericial", description: "Generación de informes técnicos legales", status: "active" as const },
    ];

    return (
        <ModuleDashboard
            title="Forense Digital"
            description="Laboratorio de análisis profundo y cadena de custodia para investigaciones digitales avanzadas."
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/cybersecurity' },
                { label: 'Forense', href: '/forensics/operations' }
            ]}
            modules={modules}
        />
    );
}
