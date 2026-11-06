'use client';

import { useState } from 'react';
import { Terminal, Zap, Play, Loader2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const AVAILABLE_TOOLS = [
    { id: 'nmap', name: 'Nmap', description: 'Network scanner', icon: '🔍', color: 'cyan' },
    { id: 'nikto', name: 'Nikto', description: 'Web server scanner', icon: '🌐', color: 'green' },
    { id: 'nuclei', name: 'Nuclei', description: 'Vulnerability scanner', icon: '⚡', color: 'purple' },
    { id: 'feroxbuster', name: 'Feroxbuster', description: 'Directory brute-forcer', icon: '📁', color: 'orange' },
    { id: 'theharvester', name: 'TheHarvester', description: 'OSINT tool', icon: '🔎', color: 'blue' },
    { id: 'testssl', name: 'TestSSL', description: 'SSL/TLS scanner', icon: '🔒', color: 'red' },
];

export default function ManualScansPage() {
    const [selectedTool, setSelectedTool] = useState<string>('');
    const [target, setTarget] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

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
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link
                            href="/dashboard/escaneo"
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver a Operaciones
                        </Link>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-cyan-500/20 rounded-xl">
                                <Terminal className="w-8 h-8 text-cyan-400" />
                            </div>
                            <h1 className="text-4xl font-bold text-white">
                                Escaneo Manual
                            </h1>
                        </div>
                        <p className="text-gray-400 text-lg">
                            Ejecuta herramientas de seguridad directamente sin asistencia de IA
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <span className="text-yellow-400 font-medium">Sin IA</span>
                    </div>
                </div>

                {!result ? (
                    <>
                        {/* Tool Selection */}
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                            <h2 className="text-2xl font-semibold text-white mb-6">
                                Selecciona una Herramienta
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {AVAILABLE_TOOLS.map((tool) => (
                                    <button
                                        key={tool.id}
                                        onClick={() => setSelectedTool(tool.id)}
                                        className={`p-6 rounded-xl border-2 transition-all text-left ${selectedTool === tool.id
                                                ? 'border-cyan-500 bg-cyan-500/10'
                                                : 'border-white/10 bg-white/5 hover:border-white/20'
                                            }`}
                                    >
                                        <div className="text-4xl mb-3">{tool.icon}</div>
                                        <h3 className="text-lg font-bold text-white mb-1">
                                            {tool.name}
                                        </h3>
                                        <p className="text-sm text-gray-400">{tool.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Configuration */}
                        {selectedTool && (
                            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                                <h2 className="text-2xl font-semibold text-white mb-6">
                                    Configuración
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Objetivo (dominio o IP)
                                        </label>
                                        <input
                                            type="text"
                                            value={target}
                                            onChange={(e) => setTarget(e.target.value)}
                                            placeholder="ejemplo.com o 192.168.1.1"
                                            className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
                                        />
                                    </div>

                                    <button
                                        onClick={handleExecute}
                                        disabled={loading || !target}
                                        className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
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
                                        {result.success ? 'Escaneo Completado' : 'Escaneo Fallido'}
                                    </h3>
                                    <p className="text-gray-300">
                                        {result.success
                                            ? `Herramienta: ${selectedTool.toUpperCase()}`
                                            : result.error}
                                    </p>
                                </div>
                                <button
                                    onClick={handleReset}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                                >
                                    Nuevo Escaneo
                                </button>
                            </div>
                        </div>

                        {/* Raw Output */}
                        {result.success && result.output && (
                            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Terminal className="w-5 h-5 text-cyan-400" />
                                    <h3 className="text-lg font-semibold text-white">
                                        Salida del Escaneo
                                    </h3>
                                </div>
                                <div className="bg-black/50 rounded-lg p-4 max-h-96 overflow-auto">
                                    <pre className="text-green-400 font-mono text-xs whitespace-pre-wrap">
                                        {result.output}
                                    </pre>
                                </div>
                            </div>
                        )}

                        {/* Scan ID */}
                        {result.scanId && (
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                                <p className="text-sm text-gray-300">
                                    <strong>ID del Escaneo:</strong> {result.scanId}
                                </p>
                                <Link
                                    href={`/dashboard/csirt-scans/${result.scanId}`}
                                    className="text-cyan-400 hover:text-cyan-300 text-sm mt-2 inline-block"
                                >
                                    Ver detalles completos →
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
