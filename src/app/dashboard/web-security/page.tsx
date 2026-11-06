"use client";
import React, { useState } from 'react';
import { Search, Shield, Globe, Terminal, Activity, FileText, Play, RotateCw, AlertTriangle, CheckCircle } from 'lucide-react';
import CyberButton from '../../../components/ui/CyberButton';
import NeonCard from '../../../components/ui/NeonCard';

const tools = [
    { id: 'nuclei', name: 'Nuclei', icon: Activity, description: 'Escaneo de vulnerabilidades basado en plantillas.' },
    { id: 'zap', name: 'OWASP ZAP', icon: Shield, description: 'Escáner de seguridad de aplicaciones web (DAST).' },
    { id: 'feroxbuster', name: 'Feroxbuster', icon: Search, description: 'Descubrimiento agresivo de contenido y directorios.' },
    { id: 'whatweb', name: 'WhatWeb', icon: Globe, description: 'Identificación de tecnologías web (Fingerprinting).' },
    { id: 'testssl', name: 'testssl.sh', icon: FileText, description: 'Análisis profundo de configuración SSL/TLS.' },
    { id: 'nikto', name: 'Nikto', icon: Terminal, description: 'Escaneo de servidores web en busca de items peligrosos.' }
];

interface Finding {
    tool: string;
    severity: string;
    category: string;
    finding: string;
    evidence: string;
    timestamp: string;
}

export default function WebSecurityPage() {
    const [target, setTarget] = useState('');
    const [selectedTool, setSelectedTool] = useState(tools[0]);
    const [isRunning, setIsRunning] = useState(false);
    const [currentScanId, setCurrentScanId] = useState<string | null>(null);
    const [findings, setFindings] = useState<Finding[]>([]);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

    const handleScan = async () => {
        if (!target) return addLog('Error: Target is required.');
        setIsRunning(true);
        setFindings([]);
        setLogs([]);
        addLog(`Initiating ${selectedTool.name} scan on ${target}...`);

        try {
            const launchRes = await fetch('/api/scans/launch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tool: selectedTool.id, target })
            });
            const launchData = await launchRes.json();

            if (!launchData.success) {
                throw new Error(launchData.error || 'Failed to start scan');
            }

            setCurrentScanId(launchData.scanId);
            addLog(`Scan started (ID: ${launchData.scanId}). Waiting for completion...`);

            // Poll for results (simulated delay for demo purposes, real implementation should use sockets or smarter polling)
            // For now, simpler approach: wait a few seconds then try to fetch (Docker exec is sync in our current Orchestrator implementation)
            // NOTE: The orchestrator uses execAsync so it awaits completion! So we can fetch immediately after launch returns.

            addLog('Docker execution finished. Retrieving parsed results...');
            const resultsRes = await fetch(`/api/scans/results?scanId=${launchData.scanId}`);
            const resultsData = await resultsRes.json();

            if (resultsData.success) {
                setFindings(resultsData.findings);
                addLog(`Scan complete. Found ${resultsData.findings.length} items.`);
            } else {
                addLog(`Error retrieving results: ${resultsData.error}`);
            }

        } catch (error: any) {
            addLog(`Critical Error: ${error.message}`);
        } finally {
            setIsRunning(false);
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'CRITICAL': return 'text-red-500 font-bold';
            case 'HIGH': return 'text-orange-500 font-bold';
            case 'MEDIUM': return 'text-yellow-400 font-bold';
            case 'LOW': return 'text-blue-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-cyber-black text-white p-6 font-sans">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2  text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                    Módulo de Seguridad Web
                </h1>
                <p className="text-gray-400">
                    Escaneo automatizado, detección de vulnerabilidades y cumplimiento para aplicaciones modernas.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Configuration Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <NeonCard className="p-6 bg-black/40 border-cyan-500/30">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Terminal className="w-5 h-5 text-cyan-400" /> Configuración de Escaneo
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Objetivo (URL / IP)</label>
                                <input
                                    type="text"
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                    placeholder="https://example.com"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 focus:border-cyan-500 focus:outline-none text-white font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Herramienta de Seguridad</label>
                                <div className="grid grid-cols-1 gap-2">
                                    {tools.map(tool => (
                                        <button
                                            key={tool.id}
                                            onClick={() => setSelectedTool(tool)}
                                            className={`flex items-center p-3 rounded-lg border transition-all ${selectedTool.id === tool.id
                                                    ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                                                    : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                                                }`}
                                        >
                                            <tool.icon className={`w-5 h-5 mr-3 ${selectedTool.id === tool.id ? 'text-cyan-400' : 'text-gray-500'}`} />
                                            <div className="text-left">
                                                <div className="font-bold text-sm">{tool.name}</div>
                                                <div className="text-xs opacity-70 truncate max-w-[200px]">{tool.description}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <CyberButton
                                onClick={handleScan}
                                disabled={isRunning}
                                className={`w-full justify-center ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isRunning ? <RotateCw className="w-5 h-5 mr-2 animate-spin" /> : <Play className="w-5 h-5 mr-2" />}
                                {isRunning ? 'Ejecutando Escaneo...' : 'Iniciar Análisis'}
                            </CyberButton>
                        </div>
                    </NeonCard>

                    {/* Console Output */}
                    <div className="bg-black border border-white/10 rounded-xl p-4 font-mono text-xs h-64 overflow-y-auto">
                        <div className="text-gray-500 mb-2 border-b border-white/10 pb-1">System Console</div>
                        {logs.length === 0 && <span className="text-gray-600 italic">Ready for commands...</span>}
                        {logs.map((log, i) => (
                            <div key={i} className="mb-1 text-green-400/80">{log}</div>
                        ))}
                    </div>
                </div>

                {/* Results Panel */}
                <div className="lg:col-span-2">
                    <NeonCard className="h-full p-6 bg-black/40 border-purple-500/30 min-h-[600px]">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Activity className="w-5 h-5 text-purple-400" /> Resultados del Análisis
                            </h2>
                            {findings.length > 0 && (
                                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-bold border border-purple-500/30">
                                    {findings.length} Hallazgos
                                </span>
                            )}
                        </div>

                        {findings.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                                <Shield className="w-24 h-24 mb-4" />
                                <p className="text-lg">Seleccione un objetivo y lance un escaneo para ver resultados.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-400 uppercase bg-white/5">
                                        <tr>
                                            <th className="px-4 py-3 rounded-tl-lg">Severidad</th>
                                            <th className="px-4 py-3">Categoría</th>
                                            <th className="px-4 py-3">Hallazgo</th>
                                            <th className="px-4 py-3 rounded-tr-lg">Evidencia</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {findings.map((f, i) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                                <td className={`px-4 py-3 whitespace-nowrap ${getSeverityColor(f.severity)}`}>
                                                    {f.severity}
                                                </td>
                                                <td className="px-4 py-3 text-gray-300">{f.category}</td>
                                                <td className="px-4 py-3 font-medium text-white">{f.finding}</td>
                                                <td className="px-4 py-3 text-gray-400 font-mono text-xs max-w-xs truncate" title={f.evidence}>
                                                    {f.evidence || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </NeonCard>
                </div>
            </div>
        </div>
    );
}
