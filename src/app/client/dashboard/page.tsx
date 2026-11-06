'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getClientSession, clearClientSession } from '@/lib/auth/client-session';
import { Building2, FileText, TrendingUp, Calendar, LogOut, Loader2, AlertCircle, ChevronRight, Award } from 'lucide-react';

interface Assessment {
    id: string;
    status: string;
    overallScore: number | null;
    maturityLevel: string | null;
    startedAt: string;
    completedAt: string | null;
}

export default function ClientDashboard() {
    const router = useRouter();
    const [session, setSession] = useState<any>(null);
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const clientSession = getClientSession();
        if (!clientSession) {
            router.push('/client/login');
            return;
        }
        setSession(clientSession);
        loadAssessments(clientSession.companyId);
    }, [router]);

    const loadAssessments = async (companyId: string) => {
        try {
            const response = await fetch(`/api/client/assessments?companyId=${companyId}`);
            const data = await response.json();

            if (data.success) {
                setAssessments(data.assessments);
            } else {
                setError(data.error || 'Error al cargar evaluaciones');
            }
        } catch (error) {
            console.error('Load assessments error:', error);
            setError('Error al cargar evaluaciones');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        clearClientSession();
        router.push('/client/login');
    };

    const getMaturityBadge = (level: string | null) => {
        if (!level) return null;

        const badges: Record<string, { color: string; label: string }> = {
            initial: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Inicial' },
            developing: { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', label: 'En Desarrollo' },
            defined: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Definido' },
            managed: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Gestionado' },
            optimized: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Optimizado' }
        };

        const badge = badges[level] || badges.initial;

        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
                <Award className="w-3 h-3" />
                {badge.label}
            </span>
        );
    };

    const getStatusBadge = (status: string) => {
        if (status === 'completed') {
            return <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-medium">Completada</span>;
        }
        return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-xs font-medium">En Progreso</span>;
    };

    const completedAssessments = assessments.filter(a => a.status === 'completed');
    const averageScore = completedAssessments.length > 0
        ? Math.round(completedAssessments.reduce((sum, a) => sum + (a.overallScore || 0), 0) / completedAssessments.length)
        : 0;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Cargando dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header */}
            <header className="bg-gray-800/50 border-b border-cyan-500/30 shadow-lg shadow-cyan-500/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Building2 className="w-8 h-8 text-cyan-400" />
                        <div>
                            <h1 className="text-xl font-bold text-white">{session?.companyName}</h1>
                            <p className="text-sm text-gray-400">Portal Cliente</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800/50 border border-cyan-500/30 rounded-xl p-6 shadow-lg shadow-cyan-500/5">
                        <div className="flex items-center justify-between mb-2">
                            <FileText className="w-8 h-8 text-cyan-400" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{assessments.length}</p>
                        <p className="text-sm text-gray-400">Evaluaciones Totales</p>
                    </div>

                    <div className="bg-gray-800/50 border border-teal-500/30 rounded-xl p-6 shadow-lg shadow-teal-500/5">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="w-8 h-8 text-teal-400" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{averageScore}%</p>
                        <p className="text-sm text-gray-400">Puntuación Promedio</p>
                    </div>

                    <div className="bg-gray-800/50 border border-blue-500/30 rounded-xl p-6 shadow-lg shadow-blue-500/5">
                        <div className="flex items-center justify-between mb-2">
                            <Calendar className="w-8 h-8 text-blue-400" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{completedAssessments.length}</p>
                        <p className="text-sm text-gray-400">Evaluaciones Completadas</p>
                    </div>
                </div>

                {/* Assessments List */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                        <FileText className="w-6 h-6 text-cyan-400" />
                        Sus Evaluaciones
                    </h2>

                    {assessments.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 mb-2">No hay evaluaciones disponibles</p>
                            <p className="text-sm text-gray-500">Complete una evaluación para ver sus resultados aquí</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {assessments.map((assessment) => (
                                <div
                                    key={assessment.id}
                                    className="bg-gray-900/50 border border-gray-700 hover:border-cyan-500/50 rounded-lg p-6 transition-all duration-200 group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-white">
                                                    Evaluación de Seguridad
                                                </h3>
                                                {getStatusBadge(assessment.status)}
                                            </div>
                                            <p className="text-sm text-gray-400 flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                Iniciada: {new Date(assessment.startedAt).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            {assessment.completedAt && (
                                                <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                                                    <Calendar className="w-4 h-4" />
                                                    Completada: {new Date(assessment.completedAt).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            )}
                                        </div>
                                        {assessment.status === 'completed' && assessment.overallScore !== null && (
                                            <div className="text-right">
                                                <div className="text-4xl font-bold text-cyan-400 mb-1">
                                                    {assessment.overallScore}%
                                                </div>
                                                {getMaturityBadge(assessment.maturityLevel)}
                                            </div>
                                        )}
                                    </div>

                                    {assessment.status === 'completed' ? (
                                        <button
                                            onClick={() => router.push(`/client/assessment/${assessment.id}`)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/20"
                                        >
                                            Ver Resultados Detallados
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    ) : (
                                        <button
                                            disabled
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-700/50 text-gray-500 font-semibold rounded-lg cursor-not-allowed"
                                        >
                                            Evaluación en Progreso
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
