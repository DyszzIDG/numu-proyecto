"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Zap, Play, Settings, RefreshCw, Terminal, CheckCircle2, AlertCircle } from "lucide-react";
import CyberButton from "@/components/ui/CyberButton";
import GlassCard from "@/components/ui/GlassCard";
import NeonCard from "@/components/ui/NeonCard";
import { toast } from "sonner";

const initialActions = [
    {
        id: 'nikto',
        title: 'Web Vuln Scan (Nikto)',
        desc: 'Escaneo completo de servidor web en busca de configuraciones peligrosas y cabeceras inseguras.',
        color: 'text-red-400'
    },
    {
        id: 'nuclei',
        title: 'Nuclei Template Scan',
        desc: 'Detección rápida de vulnerabilidades conocidas y CVEs usando templates de la comunidad.',
        color: 'text-purple-400'
    },
    {
        id: 'zap',
        title: 'OWASP ZAP Baseline',
        desc: 'Análisis automatizado de seguridad de aplicaciones web según el Top 10 de OWASP.',
        color: 'text-blue-400'
    },
    {
        id: 'testssl',
        title: 'SSL/TLS Cipher Test',
        desc: 'Verificación profunda de protocolos criptográficos, suites de cifrado y certificados SSL/TLS.',
        color: 'text-green-400'
    },
    {
        id: 'whatweb',
        title: 'Tech Fingerprinting',
        desc: 'Identificación detallada de tecnologías web (servidor, CMS, frameworks, librerías).',
        color: 'text-cyan-400'
    },
    {
        id: 'theharvester',
        title: 'OSINT Recon (theHarvester)',
        desc: 'Recopilación de correos, subdominios, hosts e información pública del objetivo.',
        color: 'text-amber-400'
    }
];

export default function ActionsPage() {
    const [loading, setLoading] = useState<string | null>(null);
    const [target, setTarget] = useState("scanme.nmap.org");
    const [result, setResult] = useState<string | null>(null);
    const [dockerStatus, setDockerStatus] = useState<'checking' | 'running' | 'error'>('checking');
    const [simulationMode, setSimulationMode] = useState<boolean>(true);

    useEffect(() => {
        fetch('/api/docker/health')
            .then(res => res.json())
            .then(data => {
                if (data.dockerAvailable && data.toolboxRunning) {
                    setDockerStatus('running');
                    setSimulationMode(false);
                } else if (data.dockerAvailable) {
                    setDockerStatus('running');
                    setSimulationMode(true);
                } else {
                    setDockerStatus('error');
                    setSimulationMode(true);
                }
            })
            .catch(() => {
                setDockerStatus('error');
                setSimulationMode(true);
            });
    }, []);

    const executeAction = async (toolId: string) => {
        if (!target.trim()) {
            toast.error("Por favor ingresa un objetivo válido.");
            return;
        }

        setLoading(toolId);
        setResult(null);
        toast.info(`Iniciando escaneo con ${toolId.toUpperCase()}...`);

        try {
            const res = await fetch('/api/tools/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tool: toolId,
                    target: target.trim(),
                    simulation: simulationMode
                })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(simulationMode ? "Escaneo simulado completado" : "Escaneo finalizado con éxito");
                setResult(`[RESULTADO: ${toolId.toUpperCase()} @ ${target}]\n${data.outputPreview || data.message}`);
            } else {
                toast.error(data.message || "Error al ejecutar la herramienta");
                setResult(`❌ Error: ${data.message}`);
            }
        } catch (e: any) {
            toast.error("Error de comunicación con el servidor");
            setResult("❌ Error de comunicación con el servidor");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Zap className="text-yellow-400" /> Acciones Rápidas & Ejecución de Tools
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Lanzamiento de escaneos específicos y pruebas de penetración directas.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/monitoring">
                        <CyberButton variant="outline" className="text-xs">
                            <ArrowLeft className="w-4 h-4 mr-2" /> VOLVER
                        </CyberButton>
                    </Link>
                </div>
            </div>

            {/* Controls Bar: Docker status & Simulation Mode */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${
                            dockerStatus === 'running' ? 'bg-green-500 animate-pulse' :
                            dockerStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                        <span className="text-xs font-mono text-slate-300">
                            Docker: {dockerStatus === 'running' ? 'Operativo' : dockerStatus === 'error' ? 'Offline' : 'Verificando...'}
                        </span>
                    </div>

                    <div className="h-4 w-px bg-slate-800" />

                    <button
                        onClick={() => setSimulationMode(!simulationMode)}
                        className={`text-xs px-2.5 py-1 rounded-md font-mono border transition ${
                            simulationMode
                                ? 'bg-cyan-950/60 text-cyan-400 border-cyan-800/80 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                                : 'bg-amber-950/60 text-amber-400 border-amber-800/80'
                        }`}
                    >
                        {simulationMode ? '🧪 Modo Simulación: ACTIVO' : '⚡ Docker Real: ACTIVO'}
                    </button>
                </div>

                {/* Target Input */}
                <div className="flex items-center gap-2 flex-1 max-w-md">
                    <label className="text-xs font-mono text-slate-400 uppercase">Target:</label>
                    <input
                        type="text"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        placeholder="ej: scanme.nmap.org"
                        className="bg-black/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono flex-1 focus:border-cyan-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialActions.map((action) => {
                    const isCurrent = loading === action.id;
                    return (
                        <GlassCard key={action.id} className="p-6 flex flex-col justify-between group h-full hover:border-slate-700 transition">
                            <div>
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-white/10 transition-colors">
                                    <Zap className={`w-6 h-6 ${action.color}`} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{action.title}</h3>
                                <p className="text-xs text-gray-400 leading-relaxed mb-6">{action.desc}</p>
                            </div>

                            <button
                                onClick={() => executeAction(action.id)}
                                disabled={!!loading}
                                className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold font-mono tracking-wider flex items-center justify-center gap-2 transition ${
                                    isCurrent
                                        ? 'bg-yellow-500 text-black cursor-wait'
                                        : 'bg-white/5 hover:bg-cyan-600 text-white border border-white/10 hover:border-cyan-500'
                                }`}
                            >
                                {isCurrent ? (
                                    <>
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                        <span>ESCANEANDO...</span>
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-3.5 h-3.5 fill-current" />
                                        <span>EJECUTAR</span>
                                    </>
                                )}
                            </button>
                        </GlassCard>
                    );
                })}
            </div>

            {/* Terminal Output Console */}
            {result && (
                <div className="rounded-xl bg-black/90 border border-slate-800 p-5 shadow-2xl animate-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs font-mono text-cyan-400 font-bold uppercase">Consola de Salida</span>
                        </div>
                        <button
                            onClick={() => setResult(null)}
                            className="text-xs text-slate-500 hover:text-slate-300 font-mono"
                        >
                            Cerrar
                        </button>
                    </div>
                    <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-80 overflow-y-auto leading-relaxed">
                        {result}
                    </pre>
                </div>
            )}
        </div>
    );
}
