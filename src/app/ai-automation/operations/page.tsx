"use client";

import ModuleDashboard from '@/components/modules/ModuleDashboard';

export default function AiAutomationPage() {
    const modules = [
        { title: "Detección IA", description: "Motores de detección avanzada con Deep Learning", status: "active" as const },
        { title: "CSIRT Copilot", description: "Asistente virtual para analistas de seguridad", status: "active" as const },
        { title: "Predicción Riesgos", description: "Forecasting de probabilidad de incidentes", status: "active" as const },
        { title: "Auto Root Cause", description: "Análisis de causa raíz automatizado", status: "active" as const },
    ];

    return (
        <ModuleDashboard
            title="IA y Automatización"
            description="Next-generation security potenciada por modelos de lenguaje (LLM) y automatización cognitiva."
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/cybersecurity' },
                { label: 'IA Security', href: '/ai-automation/operations' }
            ]}
            modules={modules}
        />
    );
}
