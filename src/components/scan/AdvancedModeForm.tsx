'use client';

import React, { useState } from 'react';
import { Settings, ChevronDown, ChevronRight, Code, Eye } from 'lucide-react';

interface Tool {
    id: string;
    name: string;
    description: string;
    flags: string[];
    customFlags: string;
}

interface AdvancedModeFormProps {
    onSubmit: (config: any) => void;
}

const AVAILABLE_TOOLS = [
    { id: 'nmap', name: 'Nmap', description: 'Network mapper - Port scanning', icon: '🗺️' },
    { id: 'nuclei', name: 'Nuclei', description: 'Vulnerability scanner', icon: '⚛️' },
    { id: 'nikto', name: 'Nikto', description: 'Web server scanner', icon: '🕷️' },
    { id: 'sqlmap', name: 'SQLMap', description: 'SQL injection detection', icon: '💉' },
    { id: 'wpscan', name: 'WPScan', description: 'WordPress security scanner', icon: '🔌' },
    { id: 'zap', name: 'OWASP ZAP', description: 'Web application scanner', icon: '⚡' }
];

export function AdvancedModeForm({ onSubmit }: AdvancedModeFormProps) {
    const [target, setTarget] = useState('');
    const [selectedTools, setSelectedTools] = useState<string[]>(['nmap']);
    const [expandedTools, setExpandedTools] = useState<string[]>(['nmap']);
    const [toolConfigs, setToolConfigs] = useState<Record<string, any>>({
        nmap: { flags: ['-sV', '-sC'], custom: '' },
        nuclei: { flags: ['-severity', 'critical,high'], custom: '' },
        nikto: { flags: ['-Tuning', 'x'], custom: '' }
    });
    const [threads, setThreads] = useState(10);
    const [stealthMode, setStealthMode] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const toggleTool = (toolId: string) => {
        setSelectedTools(prev =>
            prev.includes(toolId)
                ? prev.filter(id => id !== toolId)
                : [...prev, toolId]
        );
    };

    const toggleExpanded = (toolId: string) => {
        setExpandedTools(prev =>
            prev.includes(toolId)
                ? prev.filter(id => id !== toolId)
                : [...prev, toolId]
        );
    };

    const updateToolConfig = (toolId: string, field: string, value: any) => {
        setToolConfigs(prev => ({
            ...prev,
            [toolId]: { ...prev[toolId], [field]: value }
        }));
    };

    const generateCommandPreview = () => {
        return selectedTools.map(toolId => {
            const config = toolConfigs[toolId] || {};
            const flags = config.flags?.join(' ') || '';
            const custom = config.custom || '';
            return `${toolId} ${flags} ${custom} ${target}`.trim();
        }).join('\n');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            mode: 'advanced',
            target,
            tools: selectedTools,
            configs: toolConfigs,
            threads,
            stealthMode
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            {/* Target Input */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    Objetivo (IP o Dominio)
                </label>
                <input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="ejemplo.com o 192.168.1.1"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none font-mono"
                    required
                />
            </div>

            {/* Tool Selection */}
            <div>
                <label className="block text-sm font-medium mb-3">
                    <Settings className="w-4 h-4 inline mr-2" />
                    Herramientas a Ejecutar
                </label>
                <div className="space-y-2">
                    {AVAILABLE_TOOLS.map(tool => (
                        <div key={tool.id} className="border border-slate-700 rounded-lg overflow-hidden">

                            {/* Tool Header */}
                            <div className="flex items-center gap-3 p-3 bg-slate-900 hover:bg-slate-800 transition">
                                <input
                                    type="checkbox"
                                    checked={selectedTools.includes(tool.id)}
                                    onChange={() => toggleTool(tool.id)}
                                    className="w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500"
                                />
                                <span className="text-xl">{tool.icon}</span>
                                <div className="flex-1">
                                    <div className="font-semibold">{tool.name}</div>
                                    <div className="text-xs text-slate-400">{tool.description}</div>
                                </div>
                                {selectedTools.includes(tool.id) && (
                                    <button
                                        type="button"
                                        onClick={() => toggleExpanded(tool.id)}
                                        className="p-1 hover:bg-slate-700 rounded transition"
                                    >
                                        {expandedTools.includes(tool.id) ? (
                                            <ChevronDown className="w-4 h-4" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4" />
                                        )}
                                    </button>
                                )}
                            </div>

                            {/* Tool Config (Expanded) */}
                            {selectedTools.includes(tool.id) && expandedTools.includes(tool.id) && (
                                <div className="p-4 bg-slate-950 border-t border-slate-700 space-y-3">

                                    {/* Common Flags */}
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-2">
                                            Flags Comunes
                                        </label>
                                        <input
                                            type="text"
                                            value={toolConfigs[tool.id]?.flags?.join(' ') || ''}
                                            onChange={(e) => updateToolConfig(tool.id, 'flags', e.target.value.split(' '))}
                                            placeholder="-sV -sC -p-"
                                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm font-mono focus:border-cyan-500 outline-none"
                                        />
                                    </div>

                                    {/* Custom Arguments */}
                                    <div>
                                        <label className="block text-xs font-medium text-slate-400 mb-2">
                                            Argumentos Personalizados
                                        </label>
                                        <input
                                            type="text"
                                            value={toolConfigs[tool.id]?.custom || ''}
                                            onChange={(e) => updateToolConfig(tool.id, 'custom', e.target.value)}
                                            placeholder="--script vuln --max-rate 1000"
                                            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-sm font-mono focus:border-cyan-500 outline-none"
                                        />
                                    </div>

                                </div>
                            )}

                        </div>
                    ))}
                </div>
            </div>

            {/* Advanced Options */}
            <div className="grid grid-cols-2 gap-4">

                {/* Threads */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Threads / Velocidad
                    </label>
                    <input
                        type="number"
                        value={threads}
                        onChange={(e) => setThreads(parseInt(e.target.value))}
                        min="1"
                        max="100"
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none"
                    />
                </div>

                {/* Stealth Mode */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Opciones
                    </label>
                    <label className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-700 rounded-lg hover:border-slate-600 cursor-pointer transition">
                        <input
                            type="checkbox"
                            checked={stealthMode}
                            onChange={(e) => setStealthMode(e.target.checked)}
                            className="w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500"
                        />
                        <div className="flex-1">
                            <div className="font-medium text-sm">Modo Sigiloso</div>
                            <div className="text-xs text-slate-400">Evasión de IDS/WAF</div>
                        </div>
                    </label>
                </div>

            </div>

            {/* Command Preview */}
            <div>
                <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition mb-2"
                >
                    <Eye className="w-4 h-4" />
                    {showPreview ? 'Ocultar' : 'Ver'} Vista Previa de Comandos
                </button>

                {showPreview && (
                    <div className="p-4 bg-slate-950 border border-slate-700 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Code className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-400">Comandos que se ejecutarán:</span>
                        </div>
                        <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap">
                            {generateCommandPreview()}
                        </pre>
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!target || selectedTools.length === 0}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-700 disabled:to-slate-600 disabled:cursor-not-allowed rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2"
            >
                <Settings className="w-5 h-5" />
                Ejecutar Escaneo Avanzado
            </button>

        </form>
    );
}
