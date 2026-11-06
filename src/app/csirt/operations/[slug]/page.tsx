
"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Activity, ShieldAlert, HardDrive, Crosshair, Bug, GitBranch } from 'lucide-react';
import { getZoneBySlug } from '@/lib/csirt/csirt-zones';
import GenericZonePanel from '@/components/csirt/GenericZonePanel';

// Specialized Components
import RealTimeMonitor from '@/components/csirt/modules/monitoring/RealTimeMonitor';
import IncidentManager from '@/components/csirt/modules/incidents/IncidentManager';
import DigitalForensicsLab from '@/components/csirt/modules/forensics/DigitalForensicsLab';
import ThreatHuntingPanel from '@/components/csirt/modules/hunting/ThreatHuntingPanel';
import VulnerabilityManager from '@/components/csirt/modules/vulnerabilities/VulnerabilityManager';
import MalwareSandbox from '@/components/csirt/modules/malware/MalwareSandbox';
import SOARAutomation from '@/components/csirt/modules/automation/SOARAutomation';

export default function ModulePage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const zone = getZoneBySlug(slug);

    // Specialized Routing
    if (slug === 'monitoreo-y-deteccion') {
        return (
            <div className="p-6 bg-[#0B1120] min-h-screen text-slate-200 font-sans">
                <Header title="Monitoreo y Detección" description="Centro de monitoreo en tiempo real." icon={Activity} color="blue" backUrl="/csirt/operations" isDark />
                <RealTimeMonitor />
            </div>
        );
    }

    if (slug === 'gestion-de-incidentes') {
        return (
            <div className="p-6 bg-[#0B1120] min-h-screen text-slate-200 font-sans">
                <Header title="Gestión de Incidentes" description="Respuesta coordinada y clasificación." icon={ShieldAlert} color="red" backUrl="/csirt/operations" isDark />
                <IncidentManager />
            </div>
        );
    }

    if (slug === 'forense-digital') {
        return (
            <div className="p-6 bg-slate-900 min-h-screen text-slate-200 font-sans">
                <Header title="Forense Digital" description="Laboratorio forense y custodia." icon={HardDrive} color="purple" backUrl="/csirt/operations" isDark />
                <DigitalForensicsLab />
            </div>
        );
    }

    if (slug === 'threat-hunting') {
        return (
            <div className="p-6 bg-slate-900 min-h-screen text-slate-200 font-sans">
                <Header title="Threat Hunting" description="Búsqueda proactiva de amenazas." icon={Crosshair} color="orange" backUrl="/csirt/operations" isDark />
                <ThreatHuntingPanel />
            </div>
        );
    }

    if (slug === 'gestion-de-vulnerabilidades') {
        return (
            <div className="p-6 bg-[#0B1120] min-h-screen text-slate-200 font-sans">
                <Header title="Gestión de Vulnerabilidades" description="Escaneo y priorización de riesgos." icon={ShieldAlert} color="yellow" backUrl="/csirt/operations" isDark />
                <VulnerabilityManager />
            </div>
        );
    }

    if (slug === 'analisis-de-malware') {
        return (
            <div className="p-6 bg-slate-900 min-h-screen text-slate-200 font-sans">
                <Header title="Análisis de Malware" description="Sandbox y análisis de artefactos." icon={Bug} color="emerald" backUrl="/csirt/operations" isDark />
                <MalwareSandbox />
            </div>
        );
    }

    if (slug === 'automatizacion-soar') {
        return (
            <div className="p-6 bg-[#0B1120] min-h-screen text-slate-200 font-sans">
                <Header title="Automatización SOAR" description="Playbooks y orquestación." icon={GitBranch} color="pink" backUrl="/csirt/operations" isDark />
                <SOARAutomation />
            </div>
        );
    }

    // Generic Fallback for new zones
    if (zone) {
        return (
            <div className="p-6 bg-[#0B1120] min-h-screen text-slate-200 font-sans">
                <Header title={zone.title} description={zone.description} icon={zone.icon} color={zone.color} backUrl="/csirt/operations" isDark />
                <GenericZonePanel zone={zone} />
            </div>
        );
    }

    return (
        <div className="p-10 text-center min-h-screen">
            <Link href="/csirt/operations" className="text-slate-500 hover:text-indigo-600 mb-4 inline-flex items-center gap-1 text-sm">
                <ArrowLeft className="w-4 h-4" /> Volver
            </Link>
            <h1 className="text-2xl font-bold text-slate-800 mt-10">Módulo no encontrado</h1>
            <p className="text-slate-500">La zona "{slug}" no existe.</p>
        </div>
    );
}

function Header({ title, description, icon: Icon, color, backUrl, isDark }: any) {
    return (
        <div className="mb-6">
            <Link href={backUrl} className={`${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-indigo-600'} mb-4 inline-flex items-center gap-1 text-sm`}>
                <ArrowLeft className="w-4 h-4" /> Volver a Operaciones
            </Link>
            <div className="flex items-center gap-4 mt-2">
                <div className={`p-3 rounded-xl ${isDark ? `bg-${color}-900/20 border border-${color}-500/30` : `bg-${color}-100`}`}>
                    <Icon className={`w-8 h-8 text-${color}-600`} />
                </div>
                <div>
                    <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h1>
                    <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{description}</p>
                </div>
            </div>
        </div>
    );
}
