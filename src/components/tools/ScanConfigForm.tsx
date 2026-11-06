'use client';

/**
 * Scan Configuration Form
 * Natural language input with AI-powered command generation
 */

import { useState } from 'react';
import { Sparkles, Target, Play, Loader2, AlertCircle, Bot, Terminal, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ScanConfigFormProps {
    tool: string;
    onSubmit: (config: ScanConfig) => void;
    loading?: boolean;
}

interface ScanConfig {
    userPrompt: string;
    target?: string;
    tool: string;
}

export default function ScanConfigForm({ tool, onSubmit, loading = false }: ScanConfigFormProps) {
    const [userPrompt, setUserPrompt] = useState('');
    const [target, setTarget] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userPrompt.trim()) return;

        onSubmit({
            userPrompt,
            target: target.trim() || undefined,
            tool,
        });
    };

    const examplePrompts = getExamplePrompts(tool);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Main AI Input Area */}
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity blur" />
                <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                    <label className="block text-sm font-medium text-purple-300 mb-3 flex items-center gap-2">
                        <Bot className="w-4 h-4" />
                        ¿Qué deseas escanear hoy?
                    </label>
                    <textarea
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        placeholder={`Ejemplo: "${examplePrompts[0]}"`}
                        className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 resize-none font-sans text-lg leading-relaxed"
                        disabled={loading}
                    />
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                            Describe tu objetivo en lenguaje natural
                        </p>
                        <div className="flex gap-2">
                            {['Completo', 'Rápido', 'Vulns'].map(tag => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => setUserPrompt(prev => prev ? `${prev} - ${tag}` : tag)}
                                    className="px-2 py-1 text-[10px] bg-white/5 hover:bg-white/10 rounded border border-white/5 text-gray-400 hover:text-white transition-colors"
                                >
                                    +{tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Target Input (Optional) */}
            <div className="relative">
                <div className="absolute left-3 top-3 text-gray-500">
                    <Target className="w-5 h-5" />
                </div>
                <input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="Objetivo Opcional (ej. 192.168.1.1)"
                    className="w-full pl-10 pr-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors font-mono text-sm"
                    disabled={loading}
                />
                <div className="absolute right-3 top-3.5">
                    <span className="text-[10px] text-gray-600 bg-white/5 px-2 py-1 rounded">OPTIONAL</span>
                </div>
            </div>

            {/* Example Prompts - Chips Style */}
            <div className="space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Prompts Sugeridos:</p>
                <div className="grid grid-cols-1 gap-2">
                    {examplePrompts.map((example, idx) => (
                        <motion.button
                            key={idx}
                            type="button"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => setUserPrompt(example)}
                            className="group flex items-center justify-between w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 rounded-lg text-sm text-gray-300 transition-all"
                            disabled={loading}
                        >
                            <div className="flex items-center gap-3">
                                <Sparkles className="w-4 h-4 text-purple-500 group-hover:text-purple-400 transition-colors" />
                                <span className="group-hover:text-white transition-colors">{example}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-white opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Warning for Free Users */}
            <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-yellow-500/80 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-yellow-200/80 leading-relaxed">
                    <strong>Nota:</strong> Cada escaneo consume créditos. La ejecución comenzará automáticamente tras la configuración de la IA.
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading || !userPrompt.trim()}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 mix-blend-overlay" />
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Analizando Prompt...</span>
                    </>
                ) : (
                    <>
                        <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        <span className="tracking-wide">GENERAR ESCANEO CON IA</span>
                    </>
                )}
            </button>
        </form>
    );
}

function getExamplePrompts(tool: string): string[] {
    const prompts: Record<string, string[]> = {
        nmap: [
            'Scan numu.group for open ports and services',
            'Quick vulnerability scan on 192.168.1.1',
            'Find all open web ports on example.com',
        ],
        nikto: [
            'Check numu.group for web vulnerabilities',
            'Scan https://example.com for misconfigurations',
            'Test web server security on port 8080',
        ],
        zenmap: [
            'Intense scan of my network 192.168.1.0/24',
            'Map network topology for example.com',
            'Comprehensive security audit of 10.0.0.1',
        ],
        fofa: [
            'Find exposed cameras in Argentina',
            'Search for Apache servers with version 2.4',
            'Discover MongoDB instances without authentication',
        ],
    };

    return prompts[tool] || prompts.nmap;
}
