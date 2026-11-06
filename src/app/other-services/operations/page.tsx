"use client";

import ServicePanel from '@/components/services/ServicePanel';
import { Network, Grid, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function OtherServicesPage() {
    const modules = [
        // Listing all modules here for easy access, or just miscellaneous ones if any left over?
        // Let's list a few key ones not highlighted heavily elsewhere or provide a full map
        { title: "Ver Todos los Módulos", icon: Grid, link: "/servicios/ciberseguridad", color: "text-purple-400", bg: "bg-purple-500/10" },
    ];

    return (
        <ServicePanel
            title="Otros Servicios"
            breadcrumbs={[
                { label: 'Servicios', href: '/dashboard' },
                { label: 'Ciberseguridad', href: '/cybersecurity' },
                { label: 'Otros', href: '/other-services/operations' }
            ]}
        >
            <div className="space-y-8">
                <p className="text-gray-400 text-lg max-w-3xl">
                    Solicita servicios personalizados o explora el catálogo completo de soluciones de ciberseguridad.
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
                                    <p className="text-sm text-gray-500">Acceder al catálogo</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </ServicePanel>
    );
}
