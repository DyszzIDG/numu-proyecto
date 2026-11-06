'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getClientSession } from '@/lib/auth/client-session';
import { Building2, ArrowLeft, Loader2, AlertCircle, Award, TrendingUp, FileText, Download } from 'lucide-react';
import Link from 'next/link';

interface AssessmentData {
    id: string;
    status: string;
    overallScore: number;
    maturityLevel: string;
    categoryScores: Record<string, number>;
    recommendations: string[];
    startedAt: string;
    completedAt: string;
    company: {
        name: string;
        industry: string;
    };
    answers: any[];
}

export default function AssessmentResultsPage() {
    const router = useRouter();
    const params = useParams();
    const assessmentId = params.id as string;

    const [session, setSession] = useState<any>(null);
    const [assessment, setAssessment] = useState<AssessmentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const clientSession = getClientSession();
        if (!clientSession) {
            router.push('/client/login');
            return;
        }
        setSession(clientSession);
        loadAssessment(clientSession.companyId);
    }, [router, assessmentId]);

    const loadAssessment = async (companyId: string) => {
        try {
            const response = await fetch(`/api/client/assessment/${assessmentId}?companyId=${companyId}`);
            const data = await response.json();

            if (data.success) {
                setAssessment(data.assessment);
            } else {
                setError(data.error || 'Error al cargar evaluación');
            }
        } catch (error) {
            console.error('Load assessment error:', error);
            setError('Error al cargar evaluación');
        } finally {
            setLoading(false);
        }
    };

    const getMaturityInfo = (level: string) => {
        const levels: Record<string, { color: string; label: string; description: string }> = {
            initial: {
                color: 'from-red-500 to-red-600',
                label: 'Inicial',
                description: 'Controles de seguridad mínimos implementados'
            },
            developing: {
                color: 'from-orange-500 to-orange-600',
                label: 'En Desarrollo',
                description: 'Controles básicos en su lugar'
            },
            defined: {
                color: 'from-yellow-500 to-yellow-600',
                label: 'Definido',
                description: 'Procesos documentados y establecidos'
            },
            managed: {
                color: 'from-blue-500 to-blue-600',
                label: 'Gestionado',
                description: 'Procesos medidos y controlados'
            },
            optimized: {
                color: 'from-green-500 to-green-600',
                label: 'Optimizado',
                description: 'Mejora continua implementada'
            }
        };
        return levels[level] || levels.initial;
    };

    const getCategoryColor = (score: number) => {
        if (score >= 90) return 'bg-green-500';
        if (score >= 75) return 'bg-blue-500';
        if (score >= 50) return 'bg-yellow-500';
        if (score >= 25) return 'bg-orange-500';
        return 'bg-red-500';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Cargando resultados...</p>
                </div>
            </div>
        );
    }

    if (error || !assessment) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
                <div className="max-w-md w-full">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
                        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                        <p className="text-red-400 mb-4">{error || 'Evaluación no encontrada'}</p>
                        <Link
                            href="/client/dashboard"
                            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const maturityInfo = getMaturityInfo(assessment.maturityLevel);
    const categoryScores = assessment.categoryScores ? JSON.parse(assessment.categoryScores as any) : {};
    const recommendations = assessment.recommendations ? JSON.parse(assessment.recommendations as any) : [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header */}
            <header className="bg-gray-800/50 border-b border-cyan-500/30 shadow-lg shadow-cyan-500/5">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <Link
                        href="/client/dashboard"
                        className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-3 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al Dashboard
                    </Link>
                    <div className="flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-cyan-400" />
                        <div>
                            <h1 className="text-xl font-bold text-white">{assessment.company.name}</h1>
                            <p className="text-sm text-gray-400">Resultados de Evaluación de Seguridad</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Overall Score Card */}
                <div className="bg-gray-800/50 border border-cyan-500/30 rounded-xl p-8 mb-8 shadow-lg shadow-cyan-500/10">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Score Gauge */}
                        <div className="text-center">
                            <div className="relative inline-flex items-center justify-center w-64 h-64 mb-4">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="128"
                                        cy="128"
                                        r="100"
                                        stroke="currentColor"
                                        strokeWidth="20"
                                        fill="none"
                                        className="text-gray-700"
                                    />
                                    <circle
                                        cx="128"
                                        cy="128"
                                        r="100"
                                        stroke="currentColor"
                                        strokeWidth="20"
                                        fill="none"
                                        strokeDasharray={`${2 * Math.PI * 100}`}
                                        strokeDashoffset={`${2 * Math.PI * 100 * (1 - assessment.overallScore / 100)}`}
                                        className="text-cyan-400 transition-all duration-1000"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="text-6xl font-bold text-white mb-2">
                                        {assessment.overallScore}%
                                    </div>
                                    <div className="text-sm text-gray-400">Puntuación General</div>
                                </div>
                            </div>
                        </div>

                        {/* Maturity Level */}
                        <div className="flex flex-col justify-center">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                    <Award className="w-6 h-6 text-cyan-400" />
                                    Nivel de Madurez
                                </h2>
                                <div className={`inline-block px-6 py-3 bg-gradient-to-r ${maturityInfo.color} text-white font-bold text-xl rounded-lg shadow-lg mb-3`}>
                                    {maturityInfo.label}
                                </div>
                                <p className="text-gray-400">{maturityInfo.description}</p>
                            </div>

                            <div className="space-y-2 text-sm text-gray-400">
                                <p className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Completada: {new Date(assessment.completedAt).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                                <p className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Industria: {assessment.company.industry}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-cyan-400" />
                        Desglose por Categoría
                    </h2>
                    <div className="space-y-4">
                        {Object.entries(categoryScores).map(([category, score]: [string, any]) => (
                            <div key={category}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white font-medium">{category}</span>
                                    <span className="text-cyan-400 font-bold">{score}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                                    <div
                                        className={`h-full ${getCategoryColor(score)} transition-all duration-1000 rounded-full`}
                                        style={{ width: `${score}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <AlertCircle className="w-6 h-6 text-yellow-400" />
                            Recomendaciones
                        </h2>
                        <div className="space-y-3">
                            {recommendations.map((rec: string, index: number) => (
                                <div key={index} className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                    <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-yellow-400 text-sm font-bold">{index + 1}</span>
                                    </div>
                                    <p className="text-gray-300">{rec}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Export Button */}
                <div className="mt-8 text-center">
                    <button
                        disabled
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700/50 text-gray-500 font-semibold rounded-lg cursor-not-allowed"
                    >
                        <Download className="w-5 h-5" />
                        Exportar a PDF (Próximamente)
                    </button>
                </div>
            </main>
        </div>
    );
}
