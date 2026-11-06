'use client';

import React, { useState } from 'react';
import { Search, BrainCircuit, Check, Terminal, Loader2, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AVAILABLE_TOOLS = [
    { id: 'nmap', name: 'Nmap', type: 'network' },
    { id: 'nikto', name: 'Nikto', type: 'web' },
    { id: 'whatweb', name: 'WhatWeb', type: 'web' },
    { id: 'theharvester', name: 'theHarvester', type: 'osint' },
    { id: 'testssl', name: 'TestSSL', type: 'ssl' },
    { id: 'nuclei', name: 'Nuclei', type: 'vuln' },
];

export default function AIScanForm() {
    const router = useRouter();
    const [target, setTarget] = useState('');
    const [prompt, setPrompt] = useState('');
    const [selectedTools, setSelectedTools] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'scanning' | 'analyzing' | 'completed'>('idle');

    const toggleTool = (toolId: string) => {
        setSelectedTools(prev =>
            prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId]
        );
    };

    const handleScan = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!target || selectedTools.length === 0) return;

        setLoading(true);
        setStatus('scanning');

        try {
            const res = await fetch('/api/scans/ai-execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    target,
                    prompt,
                    tools: selectedTools
                })
            });

            if (res.ok) {
                setStatus('analyzing');
                // Simulate analysis delay
                setTimeout(() => {
                    const data = res.json(); // In real app, we'd wait for this
                    setStatus('completed');
                    setLoading(false);
                    // Redirect to a results page or show a toast
                    // For now, reload to show in history or similar
                    window.location.href = '/dashboard/csirt-scans';
                }, 2000);
            } else {
                setLoading(false);
                setStatus('idle');
                alert('Error al iniciar el escaneo');
            }
        } catch (error) {
            console.error(error);
            setLoading(false);
            setStatus('idle');
        }
    };

    return (
        <form onSubmit={handleScan} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inputs */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Objetivo (Target)</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={target}
                                onChange={(e) => setTarget(e.target.value)}
                                placeholder="ej: numu.group"
                                className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors pl-10"
                                required
                            />
                            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Instrucción para IA (Prompt)</label>
                        <div className="relative">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="ej: Analiza este sitio buscando vulnerabilidades críticas en el puerto 443 y resume los hallazgos."
                                className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition-colors h-32 resize-none"
                            />
                            <BrainCircuit className="absolute right-3 bottom-3 w-5 h-5 text-purple-500/50" />
                        </div>
                    </div>
                </div>

                {/* Tools Selection */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Seleccionar Herramientas ({selectedTools.length})</label>
                    <div className="grid grid-cols-2 gap-3">
                        {AVAILABLE_TOOLS.map(tool => (
                            <div
                                key={tool.id}
                                onClick={() => toggleTool(tool.id)}
                                className={`
                                    cursor-pointer p-3 rounded-xl border flex items-center justify-between group transition-all
                                    ${selectedTools.includes(tool.id)
                                        ? 'bg-purple-600/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-2">
                                    <Terminal className={`w-4 h-4 ${selectedTools.includes(tool.id) ? 'text-purple-400' : 'text-gray-500'}`} />
                                    <span className={`text-sm font-medium ${selectedTools.includes(tool.id) ? 'text-white' : 'text-gray-400'}`}>
                                        {tool.name}
                                    </span>
                                </div>
                                {selectedTools.includes(tool.id) && <Check className="w-4 h-4 text-purple-400" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading || !target || selectedTools.length === 0}
                    className={`
                        px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all
                        ${loading
                            ? 'bg-purple-900/50 text-purple-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-900/20'
                        }
                    `}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {status === 'scanning' ? 'Ejecutando Herramientas...' : 'Analizando Resultados...'}
                        </>
                    ) : (
                        <>
                            <Play className="w-5 h-5 fill-current" />
                            Iniciar Operación IA
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
