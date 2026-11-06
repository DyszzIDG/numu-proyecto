"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Zap, Play, Settings, RefreshCw } from "lucide-react";
import CyberButton from "@/components/ui/CyberButton";
import GlassCard from "@/components/ui/GlassCard";
import NeonCard from "@/components/ui/NeonCard";

const initialActions = [
    {
        id: 'nikto',
        title: 'Web Vuln Scan (Nikto)',
        desc: 'Escaneo completo de servidor web en busca de configuraciones peligrosas.',
        icon: Zap,
        color: 'text-red-400'
    },
    {
        id: 'nuclei',
        title: 'Nuclei Scan',
        desc: 'Detección rápida de vulnerabilidades conocidas usando templates.',
        icon: Zap,
        color: 'text-purple-400'
    },
    {
        id: 'zap',
        title: 'OWASP ZAP Baseline',
        desc: 'Análisis de seguridad web automatizado con ZAP.',
        icon: Zap,
        color: 'text-blue-400'
    },
    {
        id: 'testssl',
        title: 'SSL/TLS Test',
        desc: 'Verificación de configuración SSL/TLS y certificados.',
        icon: Zap,
        color: 'text-green-400'
    },
    {
        id: 'whatweb',
        title: 'Tech Fingerprint',
        desc: 'Identificación de tecnologías web (CMS, frameworks, etc).',
        icon: Zap,
        color: 'text-cyan-400'
    }
];

export default function ActionsPage() {
    const [loading, setLoading] = React.useState<string | null>(null);
    const [target, setTarget] = React.useState("scanme.nmap.org");
    const [result, setResult] = React.useState<string | null>(null);
    const [dockerStatus, setDockerStatus] = React.useState<'checking' | 'running' | 'error'>('checking');

    React.useEffect(() => {
        fetch('/api/docker/health')
            .then(res => res.json())
            .then(data => setDockerStatus(data.status === 'running' ? 'running' : 'error'))
            .catch(() => setDockerStatus('error'));
    }, []);

    const executeAction = async (toolId: string) => {
        setLoading(toolId);
        setResult(null);
        try {
            const res = await fetch('/api/tools/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tool: toolId, target })
            });
            const data = await res.json();
            if (res.ok) {
                setResult(`✅ Éxito: ${data.message}\nID: ${data.executionId}\n\n${data.outputPreview}...`);
            } else {
                setResult(`❌ Error: ${data.message}`);
            }
        } catch (e) {
            setResult("❌ Error de comunicación con el servidor");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 p-8">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Zap className="text-yellow-400" /> Acciones Rápidas
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Ejecución manual de herramientas y configuraciones.
                    </p>
                </div>
                <Link href="/dashboard/monitoring">
                    <CyberButton variant="outline" className="text-xs">
                        <ArrowLeft className="w-4 h-4 mr-2" /> VOLVER
                    </CyberButton>
                </Link>
            </div>

            {/* Docker Status */}
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${dockerStatus === 'running' ? 'bg-green-500 animate-pulse' :
                        dockerStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                <span className="text-xs text-gray-400">
                    Docker: {dockerStatus === 'running' ? 'Operativo' : dockerStatus === 'error' ? 'No disponible' : 'Verificando...'}
                </span>
                {dockerStatus === 'error' && (
                    <span className="text-xs text-red-400 ml-2">
                        (Ejecuta: <code className="bg-black/50 px-1 rounded">docker-compose up -d</code>)
                    </span>
                )}
            </div>

            {/* Target Input */}
            <div className="max-w-md">
                <GlassCard className="p-4 px-6 flex items-center gap-4">
                    <label className="text-sm font-bold text-white">Target:</label>
                    <input
                        type="text"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        className="bg-black/50 border border-white/20 rounded px-3 py-1 text-white flex-1"
                    />
                </GlassCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialActions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <GlassCard key={action.id} className="p-6 flex flex-col justify-between group h-full">
                            <div>
                                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors`}>
                                    <Icon className={`w-6 h-6 ${action.color}`} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{action.title}</h3>
                                <p className="text-sm text-gray-400 mb-6">{action.desc}</p>
                            </div>

                            <CyberButton
                                variant="primary"
                                className="w-full justify-center"
                                onClick={() => executeAction(action.id)}
                                disabled={loading === action.id}
                            >
                                <Play className="w-4 h-4 mr-2" /> {loading === action.id ? 'Ejecutando...' : 'Ejecutar'}
                            </CyberButton>
                        </GlassCard>
                    )
                })}
            </div>

            {result && (
                <NeonCard className="p-6 whitespace-pre-wrap font-mono text-xs text-green-400 max-h-96 overflow-auto">
                    {result}
                </NeonCard>
            )}
        </div>
    );
}
