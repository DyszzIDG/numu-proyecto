"use client";

import ServicePanel from '@/components/services/ServicePanel';
import { Search, Code, ShieldAlert, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ScanningHubPage() {
    const modules = [
        { title: "Gestión de Vulnerabilidades", icon: ShieldAlert, link: "/vulnerabilities/operations", color: "text-red-400", bg: "bg-red-500/10" },
        { title: "App Protection", icon: Code, link: "/app-protection/operations", color: "text-blue-400", bg: "bg-blue-500/10" },
    ];

    return (
        <ServicePanel
            title="Operaciones de Escaneo"
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/cybersecurity' },
                { label: 'Escaneo', href: '/scanning/operations' }
            ]}
        >
            <div className="space-y-8">
                <p className="text-gray-400 text-lg max-w-3xl">
                    Identificación proactiva de brechas de seguridad. Escaneo continuo de infraestructura, aplicaciones y código.
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
