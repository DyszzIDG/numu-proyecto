"use client";

import React from 'react';
import ServicePanel from '../services/ServicePanel';
import { Terminal, Shield, Activity, ChevronRight, Play, Server, Database, Globe, Lock, Cpu, AlertCircle } from 'lucide-react';

interface Module {
    title: string;
    description: string;
    status: 'active' | 'inactive' | 'maintenance';
}

interface ModuleDashboardProps {
    title: string;
    description: string;
    breadcrumbs: { label: string; href: string }[];
    modules: Module[];
    consoleLink?: string;
}

export default function ModuleDashboard({
    title,
    description,
    breadcrumbs,
    modules,
    consoleLink = "#"
}: ModuleDashboardProps) {
    return (
        <ServicePanel
            title={title}
            breadcrumbs={breadcrumbs}
            headerActions={
                <button className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg hover:bg-green-500/20 transition-all">
                    <Terminal className="w-4 h-4" />
                    Open Console
                </button>
            }
        >
            <div className="space-y-8">
                {/* Header Info */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-600/10 to-transparent rounded-full -mr-16 -mt-16 blur-3xl" />
                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-2xl font-bold text-white mb-4">Descripción del Servicio</h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            {description}
                        </p>

                        <div className="flex gap-6 mt-8">
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-white font-mono">{modules.length}</span>
                                <span className="text-sm text-gray-500 uppercase tracking-wider">Módulos Activos</span>
                            </div>
                            <div className="w-px bg-white/10" />
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-green-400 font-mono">100%</span>
                                <span className="text-sm text-gray-500 uppercase tracking-wider">Uptime</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modules Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((module, idx) => (
                        <div key={idx} className="group bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/5 hover:border-blue-500/30 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                                    <Activity className="w-6 h-6 text-blue-400" />
                                </div>
                                <div className={`w-2 h-2 rounded-full ${module.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-yellow-500'}`} />
                            </div>

                            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                                {module.title}
                            </h3>
                            <p className="text-sm text-gray-400 mb-6 min-h-[40px]">
                                {module.description}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <span className="text-xs font-mono text-gray-500">v2.4.0</span>
                                <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ServicePanel>
    );
}
