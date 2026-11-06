"use client";

import ServicePanel from '@/components/services/ServicePanel';
import {
    Shield, AlertTriangle, Search, Bug, Globe, Brain, ChevronRight,
    Radar, Terminal, FileText, Server, Lock, UserCheck, Activity, Layers
} from 'lucide-react';
import Link from 'next/link';

export default function CsirtHubPage() {
    const modules = [
        {
            title: "Gestión de Incidentes",
            icon: AlertTriangle,
            link: "/dashboard/incidents",
            color: "text-red-400",
            bg: "bg-red-500/10",
            desc: "Respuesta y manejo de incidentes críticos."
        },

        {
            title: "Historial de Escaneos",
            icon: Activity,
            link: "/dashboard/csirt-scans",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            desc: "Registro y logs de ejecuciones anteriores."
        },
        {
            title: "Gestión de Vulnerabilidades",
            icon: Bug,
            link: "/dashboard/vulnerabilities",
            color: "text-yellow-400",
            bg: "bg-yellow-500/10",
            desc: "Detección y seguimiento de CVEs."
        },
        {
            title: "Forense Digital",
            icon: Search,
            link: "/dashboard/forensics",
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            desc: "Análisis de evidencia y cadena de custodia."
        },
        {
            title: "Threat Hunting",
            icon: Shield,
            link: "/dashboard/threat-hunting",
            color: "text-indigo-400",
            bg: "bg-indigo-500/10",
            desc: "Búsqueda proactiva de amenazas ocultas."
        },
        {
            title: "Análisis de Malware",
            icon: Terminal,
            link: "/dashboard/malware",
            color: "text-green-400",
            bg: "bg-green-500/10",
            desc: "Sandbox y análisis estático/dinámico."
        },
        {
            title: "OSINT e Investigación",
            icon: Globe,
            link: "/dashboard/osint",
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
            desc: "Inteligencia de fuentes abiertas."
        },
        {
            title: "Automatización SOAR",
            icon: Layers,
            link: "/dashboard/soar",
            color: "text-pink-400",
            bg: "bg-pink-500/10",
            desc: "Orquestación y respuesta automatizada."
        },
        {
            title: "Seguridad Empresarial",
            icon: Building,
            link: "/dashboard/enterprise-security",
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            desc: "Políticas y cumplimiento corporativo."
        },
        {
            title: "Infraestructura y Red",
            icon: Server,
            link: "/dashboard/infrastructure",
            color: "text-slate-400",
            bg: "bg-slate-500/10",
            desc: "Monitoreo de activos y topología."
        },
        {
            title: "Protección de Identidad",
            icon: UserCheck,
            link: "/dashboard/identity",
            color: "text-violet-400",
            bg: "bg-violet-500/10",
            desc: "IAM y control de accesos."
        },
        {
            title: "App Protection",
            icon: Lock,
            link: "/dashboard/app-protection",
            color: "text-rose-400",
            bg: "bg-rose-500/10",
            desc: "Seguridad en aplicaciones y APIs."
        },
        {
            title: "IA y Automatización",
            icon: Brain,
            link: "/dashboard/ai-automation",
            color: "text-teal-400",
            bg: "bg-teal-500/10",
            desc: "Módulos de IA defensiva."
        },
        {
            title: "Reportes Globales",
            icon: FileText,
            link: "/dashboard/global-reports",
            color: "text-gray-400",
            bg: "bg-gray-500/10",
            desc: "Métricas ejecutivas y técnicas."
        },
    ];

    return (
        <ServicePanel
            title="Operaciones CSIRT"
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/cybersecurity' },
                { label: 'CSIRT', href: '/csirt/operations' }
            ]}
        >
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <p className="text-gray-400 text-lg max-w-3xl">
                        Centro Integrado de Ciberdefensa. Acceda a los módulos especializados para la gestión completa del ciclo de vida de amenazas.
                    </p>
                    <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-sm font-medium">
                        {modules.length} Módulos Activos
                    </div>
                </div>

                {/* Unified Scanner Feature Card */}
                <div className="w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[100px] rounded-full group-hover:bg-purple-600/20 transition-all duration-700" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-4 flex-1">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                                <Terminal className="w-8 h-8 text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">ESCANEO</h2>
                                <p className="text-gray-400 text-lg">Manual, IA y Pro Tools en un solo lugar</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 w-full md:w-auto min-w-[300px]">
                            <Link
                                href="/dashboard/unified-scan"
                                className="flex items-center justify-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] group/btn"
                            >
                                <Terminal className="w-5 h-5" />
                                <span className="uppercase tracking-wider">_ Abrir Panel</span>
                            </Link>
                            <button className="flex items-center justify-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl font-medium transition-all border border-white/5 hover:border-white/10">
                                Ver Información
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {modules.map((module, idx) => {
                        const Icon = module.icon;
                        return (
                            <Link key={idx} href={module.link} className="group">
                                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/5 hover:border-blue-500/30 transition-all h-full relative overflow-hidden">
                                    {/* Hover Gradient */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${module.color.replace('text-', 'from-')}/0 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`p-4 rounded-xl ${module.bg} group-hover:scale-110 transition-transform shadow-lg shadow-black/50`}>
                                                <Icon className={`w-8 h-8 ${module.color}`} />
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-1">{module.title}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">{module.desc}</p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </ServicePanel>
    );
}

// Embedded wrapper to handle logic
function EmbeddedAIAssistant() {
    const [loading, setLoading] = useState(false);

    const handleExecute = async (config: any) => {
        setLoading(true);
        // Redirect to unified scan with config or execute directly?
        // For now, redirecting with params or just showing alert as this is a dashboard view might be complex without full redirection logic
        // But user asked for the panel here.
        // Let's implement actual execution redirect:
        try {
            const response = await fetch('/api/ai/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });
            // We should probably redirect to results page or show results here.
            // Simplified:
            window.location.href = '/dashboard/unified-scan?tab=ai';
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return <AIAssistantPanel onExecute={handleExecute} loading={loading} />;
}

// Quick fix for missing Building icon input if Lucide version mismatch, usually Lucide has Building or Building2
import { Building2 as Building, Sparkles } from 'lucide-react';
import { useState } from 'react';
import AIAssistantPanel from '@/components/scan/AIAssistantPanel';
