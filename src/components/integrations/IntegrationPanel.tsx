'use client';

import React, { useState } from 'react';
import {
    Puzzle, Check, X, ExternalLink, RefreshCw,
    Github, Slack, Trello, Server, Shield
} from 'lucide-react';

interface Integration {
    id: string;
    name: string;
    description: string;
    icon: React.ElementType;
    status: 'connected' | 'disconnected' | 'error';
    category: 'issue-tracker' | 'communication' | 'cloud' | 'siem';
}

export function IntegrationPanel() {
    const [integrations, setIntegrations] = useState<Integration[]>([
        {
            id: 'jira',
            name: 'Jira Software',
            description: 'Crear tickets automáticos para vulnerabilidades críticas.',
            icon: Trello, // Placeholder for Jira icon
            status: 'disconnected',
            category: 'issue-tracker'
        },
        {
            id: 'github',
            name: 'GitHub Issues',
            description: 'Sincronizar hallazgos como issues en repositorios.',
            icon: Github,
            status: 'connected',
            category: 'issue-tracker'
        },
        {
            id: 'slack',
            name: 'Slack',
            description: 'Recibir notificaciones en canales específicos.',
            icon: Slack,
            status: 'connected',
            category: 'communication'
        },
        {
            id: 'discord',
            name: 'Discord',
            description: 'Webhooks para alertas en tiempo real.',
            icon: MessageCircle,
            status: 'disconnected',
            category: 'communication'
        },
        {
            id: 'aws',
            name: 'AWS Security Hub',
            description: 'Enviar hallazgos al hub de seguridad de AWS.',
            icon: Server,
            status: 'error',
            category: 'cloud'
        },
        {
            id: 'splunk',
            name: 'Splunk',
            description: 'Forwarding de logs de escaneo para análisis SIEM.',
            icon: Shield,
            status: 'disconnected',
            category: 'siem'
        }
    ]);

    const [configuring, setConfiguring] = useState<string | null>(null);

    const toggleStatus = (id: string) => {
        setIntegrations(integrations.map(int =>
            int.id === id
                ? { ...int, status: int.status === 'connected' ? 'disconnected' : 'connected' }
                : int
        ));
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'connected': return <span className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-500/20 px-2 py-1 rounded border border-green-500/30"><Check className="w-3 h-3" /> Conectado</span>;
            case 'error': return <span className="flex items-center gap-1 text-xs font-bold text-red-400 bg-red-500/20 px-2 py-1 rounded border border-red-500/30"><X className="w-3 h-3" /> Error</span>;
            default: return <span className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">Desconectado</span>;
        }
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-slate-900 border border-slate-800 rounded-lg">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
                        <Puzzle className="w-6 h-6 text-cyan-400" />
                        Integraciones
                    </h2>
                    <p className="text-slate-400 text-sm">Conecta tus herramientas favoritas para automatizar flujos de trabajo.</p>
                </div>
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Sincronizar Todo
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map(integration => {
                    const Icon = integration.icon;
                    return (
                        <div key={integration.id} className="p-6 bg-slate-900 border border-slate-800 rounded-lg hover:border-cyan-500/50 transition group relative">

                            {/* Status Dot */}
                            <div className={`absolute top-6 right-6 w-3 h-3 rounded-full ${integration.status === 'connected' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' :
                                    integration.status === 'error' ? 'bg-red-500' : 'bg-slate-700'
                                }`} />

                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                                    <Icon className="w-8 h-8 text-slate-300" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{integration.name}</h3>
                                    <div className="text-xs text-slate-500 capitalize">{integration.category.replace('-', ' ')}</div>
                                </div>
                            </div>

                            <p className="text-sm text-slate-400 mb-6 h-10 overflow-hidden">
                                {integration.description}
                            </p>

                            <div className="flex items-center justify-between mt-auto">
                                {getStatusBadge(integration.status)}

                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                    <button
                                        onClick={() => setConfiguring(integration.id)}
                                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-sm font-medium transition"
                                    >
                                        Configurar
                                    </button>
                                    <button
                                        onClick={() => toggleStatus(integration.id)}
                                        className={`p-1.5 rounded transition ${integration.status === 'connected'
                                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                                : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                            }`}
                                    >
                                        {integration.status === 'connected' ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>

            {/* Configuration Modal (Placeholder) */}
            {configuring && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 p-6 rounded-lg w-full max-w-md animate-in zoom-in-95">
                        <h3 className="text-xl font-bold mb-4">Configurar {integrations.find(i => i.id === configuring)?.name}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">API Key / Token</label>
                                <input type="password" className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded outline-none focus:border-cyan-500" placeholder="••••••••••••••••" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Webhook URL</label>
                                <input type="text" className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded outline-none focus:border-cyan-500" placeholder="https://api.example.com/webhook" />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setConfiguring(null)} className="px-4 py-2 text-slate-400 hover:text-white">Cancelar</button>
                            <button onClick={() => setConfiguring(null)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded font-medium">Guardar Cambios</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

// Icon component since lucide doesn't export MessageCircle by default in some versions or I missed importing it
function MessageCircle(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
    );
}
