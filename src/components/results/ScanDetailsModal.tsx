'use client';

import { X, Terminal, Activity, Clock, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ScanDetailsModalProps {
    executionId: string;
    onClose: () => void;
}

interface ExecutionDetails {
    id: string;
    toolName: string;
    target: string;
    command: string;
    status: string;
    startedAt: string;
    completedAt: string | null;
    duration: number | null;
    rawOutput: string | null;
    aiAnalysis: any;
    jsonResult: any;
    generatedBy: string;
    aiPrompt: string | null;
    error: string | null;
}

export default function ScanDetailsModal({ executionId, onClose }: ScanDetailsModalProps) {
    const [details, setDetails] = useState<ExecutionDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [showRawOutput, setShowRawOutput] = useState(false);

    useEffect(() => {
        fetchDetails();
    }, [executionId]);

    const fetchDetails = async () => {
        try {
            const res = await fetch(`/api/tools/execution/${executionId}`);
            if (!res.ok) throw new Error('Failed to fetch details');
            const data = await res.json();
            setDetails(data);
        } catch (error) {
            console.error('Error fetching execution details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-gray-900 rounded-2xl p-8 max-w-4xl w-full mx-4">
                    <div className="flex items-center justify-center">
                        <Activity className="w-8 h-8 text-purple-400 animate-spin" />
                    </div>
                </div>
            </div>
        );
    }

    if (!details) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-gray-900 rounded-2xl max-w-5xl w-full my-8 border border-white/10">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            {details.toolName}
                            {details.generatedBy === 'ai' && (
                                <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                    AI Generated
                                </span>
                            )}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">{details.target}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    {/* Status & Timing */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-gray-400 text-sm mb-1">Estado</p>
                            <p className={`font-semibold ${details.status === 'completed' ? 'text-green-400' :
                                    details.status === 'failed' ? 'text-red-400' :
                                        'text-yellow-400'
                                }`}>
                                {details.status}
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-gray-400 text-sm mb-1">Duración</p>
                            <p className="font-semibold text-white flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {details.duration ? `${details.duration}s` : 'N/A'}
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <p className="text-gray-400 text-sm mb-1">Iniciado</p>
                            <p className="font-semibold text-white text-sm">
                                {new Date(details.startedAt).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Command */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Terminal className="w-4 h-4 text-cyan-400" />
                            <h3 className="text-white font-semibold">Comando Ejecutado</h3>
                        </div>
                        <code className="text-green-400 font-mono text-sm block bg-black/50 p-3 rounded">
                            {details.command}
                        </code>
                    </div>

                    {/* AI Prompt (if exists) */}
                    {details.aiPrompt && (
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                            <h3 className="text-purple-300 font-semibold mb-2">Prompt AI</h3>
                            <p className="text-gray-300 text-sm">{details.aiPrompt}</p>
                        </div>
                    )}

                    {/* AI Analysis */}
                    {details.aiAnalysis && (
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-purple-400" />
                                Análisis AI
                            </h3>

                            {/* Summary */}
                            {details.aiAnalysis.summary && (
                                <div className="mb-4">
                                    <h4 className="text-gray-400 text-sm mb-2">Resumen</h4>
                                    <p className="text-white">{details.aiAnalysis.summary}</p>
                                </div>
                            )}

                            {/* Risk Level */}
                            {details.aiAnalysis.riskLevel && (
                                <div className="mb-4">
                                    <h4 className="text-gray-400 text-sm mb-2">Nivel de Riesgo</h4>
                                    <span className={`px-3 py-1 rounded text-sm font-semibold ${details.aiAnalysis.riskLevel === 'critical' ? 'bg-red-500/20 text-red-300' :
                                            details.aiAnalysis.riskLevel === 'high' ? 'bg-orange-500/20 text-orange-300' :
                                                details.aiAnalysis.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                                    'bg-green-500/20 text-green-300'
                                        }`}>
                                        {details.aiAnalysis.riskLevel}
                                    </span>
                                </div>
                            )}

                            {/* Recommendations */}
                            {details.aiAnalysis.recommendations && details.aiAnalysis.recommendations.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-gray-400 text-sm mb-2">Recomendaciones</h4>
                                    <ul className="space-y-2">
                                        {details.aiAnalysis.recommendations.map((rec: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-2 text-white text-sm">
                                                <span className="text-purple-400 mt-1">•</span>
                                                <span>{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Vulnerabilities/Findings */}
                            {details.aiAnalysis.vulnerabilities && details.aiAnalysis.vulnerabilities.length > 0 && (
                                <div>
                                    <h4 className="text-gray-400 text-sm mb-2">Hallazgos</h4>
                                    <div className="space-y-2">
                                        {details.aiAnalysis.vulnerabilities.map((vuln: any, idx: number) => (
                                            <div key={idx} className="p-3 bg-black/30 rounded border border-white/10">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                                                    <span className="text-white font-medium">{vuln.title || vuln.name}</span>
                                                </div>
                                                {vuln.description && (
                                                    <p className="text-gray-300 text-sm">{vuln.description}</p>
                                                )}
                                                {vuln.severity && (
                                                    <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-300 mt-2 inline-block">
                                                        {vuln.severity}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Ports (from JSON result) */}
                    {details.jsonResult && Array.isArray(details.jsonResult) && details.jsonResult.length > 0 && (
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                            <h3 className="text-white font-semibold mb-3">Puertos Encontrados</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {details.jsonResult.map((port: any, idx: number) => (
                                    <div key={idx} className="p-3 bg-black/30 rounded border border-white/10">
                                        <div className="flex items-center justify-between">
                                            <span className="text-cyan-400 font-mono font-bold">
                                                {port.port || port.portid}
                                            </span>
                                            <span className="text-green-400 text-sm">
                                                {port.state || 'open'}
                                            </span>
                                        </div>
                                        {port.service && (
                                            <p className="text-gray-300 text-sm mt-1">
                                                {port.service.name || port.service}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Error (if exists) */}
                    {details.error && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                            <h3 className="text-red-300 font-semibold mb-2">Error</h3>
                            <p className="text-gray-300 text-sm font-mono">{details.error}</p>
                        </div>
                    )}

                    {/* Raw Output (Collapsible) */}
                    {details.rawOutput && (
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                            <button
                                onClick={() => setShowRawOutput(!showRawOutput)}
                                className="flex items-center justify-between w-full text-left"
                            >
                                <h3 className="text-white font-semibold">Output Raw</h3>
                                <span className="text-gray-400">{showRawOutput ? '▼' : '▶'}</span>
                            </button>
                            {showRawOutput && (
                                <pre className="mt-4 bg-black/50 rounded p-4 text-green-400 font-mono text-xs overflow-x-auto max-h-96 overflow-y-auto">
                                    {details.rawOutput}
                                </pre>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
