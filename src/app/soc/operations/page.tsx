"use client";

import ServicePanel from '@/components/services/ServicePanel';
import { Activity, Network, Users, Briefcase, FileText, Zap, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function SocHubPage() {
    const modules = [
        { title: "Monitoreo y Detección", icon: Activity, link: "/monitoring/operations", color: "text-blue-400", bg: "bg-blue-500/10" },
        { title: "Infraestructura y Red", icon: Network, link: "/infrastructure/operations", color: "text-cyan-400", bg: "bg-cyan-500/10" },
        { title: "Protección de Identidad", icon: Users, link: "/identity/operations", color: "text-purple-400", bg: "bg-purple-500/10" },
        { title: "Seguridad Empresarial", icon: Briefcase, link: "/enterprise-security/operations", color: "text-yellow-400", bg: "bg-yellow-500/10" },
        { title: "Reportes y Métricas", icon: FileText, link: "/reports/operations", color: "text-green-400", bg: "bg-green-500/10" },
        { title: "Automatización SOAR", icon: Zap, link: "/soar/operations", color: "text-orange-400", bg: "bg-orange-500/10" },
    ];

    return (
        <ServicePanel
            title="Operaciones SOC 24/7"
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/cybersecurity' },
                { label: 'SOC', href: '/soc/operations' }
            ]}
        >
            <div className="space-y-8">
                <p className="text-gray-400 text-lg max-w-3xl">
                    Centro de Operaciones de Seguridad. Vigilancia continua, gestión de infraestructura y aseguramiento de la continuidad del negocio.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((module, idx) => {
                        const Icon = module.icon;
                        return (
                            <Link key={idx} href={module.link} className="group">
                                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/5 hover:border-white/20 transition-all h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`p-4 rounded-xl ${module.bg} group-hover:scale-110 transition-transform`}>
                                            <Icon className={`w-8 h-8 ${module.color}`} />
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{module.title}</h3>
                                    <p className="text-sm text-gray-500">Acceder al módulo operativo</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </ServicePanel>
    );
}
