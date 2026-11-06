'use client';

import { useState } from 'react';
import { Wrench, Play, Loader2, CheckCircle, XCircle, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

const IVAN_TOOLS = [
    { id: 'nmap', name: 'Nmap', description: 'Network scanner', icon: '🔍', color: 'cyan', category: 'network' },
    { id: 'nikto', name: 'Nikto', description: 'Web server scanner', icon: '🌐', color: 'green', category: 'web' },
    { id: 'nuclei', name: 'Nuclei', description: 'Vulnerability scanner', icon: '⚡', color: 'purple', category: 'vuln' },
    { id: 'feroxbuster', name: 'Feroxbuster', description: 'Directory brute-forcer', icon: '📁', color: 'orange', category: 'web' },
    { id: 'theharvester', name: 'TheHarvester', description: 'OSINT tool', icon: '🔎', color: 'blue', category: 'osint' },
    { id: 'testssl', name: 'TestSSL', description: 'SSL/TLS scanner', icon: '🔒', color: 'red', category: 'ssl' },
];

export default function IvanScansPage() {
    const [selectedTool, setSelectedTool] = useState<string>('');
    const [target, setTarget] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [customParams, setCustomParams] = useState('');

    const handleExecute = async () => {
        if (!target || !selectedTool) {
            alert('Por favor ingresa un objetivo y selecciona una herramienta');
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/scans/manual-execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tool: selectedTool,
                    target,
                    customParams,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Error al ejecutar el escaneo');
            }

            setResult(data);
        } catch (error: any) {
            console.error('Scan error:', error);
            setResult({
                success: false,
                error: error.message || 'Error desconocido',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setTarget('');
        setSelectedTool('');
        setCustomParams('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al Dashboard
                        </Link>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
                                <Wrench className="w-8 h-8 text-purple-400" />
                            </div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Escaneo Tools Ivan
                            </h1>
                        </div>
                        <p className="text-gray-400 text-lg">
                            Panel personalizado de herramientas de seguridad con configuración avanzada
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        <span className="text-purple-400 font-medium">Custom Tools</span>
                    </div>
                </div>

                {!result ? (
                    <>
                        {/* Tool Selection */}
                        <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-8 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                                <Wrench className="w-6 h-6 text-purple-400" />
                                Herramientas Disponibles
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {IVAN_TOOLS.map((tool) => (
                                    <button
                                        key={tool.id}
                                        onClick={() => setSelectedTool(tool.id)}
                                        className={`p-6 rounded-xl border-2 transition-all text-left group ${selectedTool === tool.id
                                                ? 'border-purple-500 bg-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                                                : 'border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{tool.icon}</div>
                                        <h3 className="text-lg font-bold text-white mb-1">
                                            {tool.name}
                                        </h3>
                                        <p className="text-sm text-gray-400 mb-2">{tool.description}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${tool.category === 'network' ? 'bg-cyan-500/20 text-cyan-400' :
                                                tool.category === 'web' ? 'bg-green-500/20 text-green-400' :
                                                    tool.category === 'vuln' ? 'bg-purple-500/20 text-purple-400' :
                                                        tool.category === 'osint' ? 'bg-blue-500/20 text-blue-400' :
                                                            'bg-red-500/20 text-red-400'
                                            }`}>
                                            {tool.category.toUpperCase()}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Advanced Configuration */}
                        {selectedTool && (
                            <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-8 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                                <h2 className="text-2xl font-semibold text-white mb-6">
                                    Configuración Avanzada
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            🎯 Objetivo (dominio o IP)
                                        </label>
                                        <input
                                            type="text"
                                            value={target}
                                            onChange={(e) => setTarget(e.target.value)}
                                            placeholder="ejemplo.com o 192.168.1.1"
                                            className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            ⚙️ Parámetros Personalizados (opcional)
                                        </label>
                                        <input
                                            type="text"
                                            value={customParams}
                                            onChange={(e) => setCustomParams(e.target.value)}
                                            placeholder="Ej: -p 80,443 -sV"
                                            className="w-full px-4 py-3 bg-black/30 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Agrega flags adicionales para personalizar el escaneo
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleExecute}
                                            disabled={loading || !target}
                                            className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Ejecutando...
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="w-5 h-5" />
                                                    Ejecutar Escaneo
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setSelectedTool('')}
                                            className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all"
                                        >
                                            Cambiar Tool
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    /* Results */
                    <div className="space-y-6">
                        {/* Status Banner */}
                        <div
                            className={`p-6 rounded-xl border ${result.success
                                    ? 'bg-green-500/10 border-green-500/30'
                                    : 'bg-red-500/10 border-red-500/30'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {result.success ? (
                                    <CheckCircle className="w-8 h-8 text-green-400" />
                                ) : (
                                    <XCircle className="w-8 h-8 text-red-400" />
                                )}
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-white mb-1">
                                        {result.success ? '✅ Escaneo Completado' : '❌ Escaneo Fallido'}
                                    </h3>
                                    <p className="text-gray-300">
                                        {result.success
                                            ? `Herramienta: ${selectedTool.toUpperCase()} | Target: ${target}`
                                            : result.error}
                                    </p>
                                </div>
                                <button
                                    onClick={handleReset}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-white transition-all"
                                >
                                    Nuevo Escaneo
                                </button>
                            </div>
                        </div>

                        {/* Raw Output */}
                        {result.success && result.output && (
                            <div className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                                <div className="flex items-center gap-2 mb-4">
                                    <Wrench className="w-5 h-5 text-purple-400" />
                                    <h3 className="text-lg font-semibold text-white">
                                        Resultados del Escaneo
                                    </h3>
                                </div>
                                <div className="bg-black/50 rounded-lg p-4 max-h-[600px] overflow-auto border border-purple-500/20">
                                    <pre className="text-green-400 font-mono text-xs whitespace-pre-wrap">
                                        {result.output}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {/* Info Card */}
                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
                            <p className="text-sm text-gray-300">
                                💡 <strong>Tip:</strong> Los resultados se guardan automáticamente en la base de datos y puedes verlos en la sección de historial de escaneos.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
