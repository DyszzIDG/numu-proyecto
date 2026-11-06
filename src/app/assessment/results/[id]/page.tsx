'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Shield, TrendingUp, Award, CheckCircle, AlertTriangle,
    ArrowLeft, Download, Loader2, Target, BarChart3
} from 'lucide-react';
import { calculateScore, getMaturityLevelInfo } from '@/lib/scoring';

export default function ResultsPage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [assessment, setAssessment] = useState<any>(null);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        fetchResults();
    }, [params.id]);

    const fetchResults = async () => {
        try {
            // Fetch assessment with answers directly by ID
            const assessmentRes = await fetch(`/api/assessments/${params.id}`);
            const assessmentData = await assessmentRes.json();

            if (!assessmentData.success) {
                return;
            }

            const currentAssessment = assessmentData.data;

            // Fetch questions/categories
            const questionsRes = await fetch('/api/questions');
            const questionsData = await questionsRes.json();

            if (questionsData.success && currentAssessment) {
                const calculatedResult = calculateScore(
                    currentAssessment.answers,
                    questionsData.data
                );

                setResult(calculatedResult);
                setAssessment(currentAssessment);

                // Update assessment with results
                await fetch(`/api/assessments/${params.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        status: 'completed',
                        overallScore: calculatedResult.overallScore,
                        maturityLevel: calculatedResult.maturityLevel,
                        categoryScores: JSON.stringify(calculatedResult.categoryScores),
                        recommendations: JSON.stringify(calculatedResult.recommendations),
                        completedAt: new Date().toISOString()
                    })
                });
            }
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Calculando resultados...</p>
                </div>
            </div>
        );
    }

    if (!result || !assessment) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400">No se encontraron resultados</p>
                </div>
            </div>
        );
    }

    const maturityInfo = getMaturityLevelInfo(result.maturityLevel);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/dashboard/companies')}
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Volver</span>
                    </button>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Shield className="w-8 h-8 text-cyan-400" />
                                <h1 className="text-3xl font-bold text-white">Resultados de Evaluación</h1>
                            </div>
                            <p className="text-gray-400">{assessment.company.name}</p>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors">
                            <Download className="w-5 h-5" />
                            Exportar PDF
                        </button>
                    </div>
                </div>

                {/* Score Card */}
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-8 mb-8">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 mb-4">
                            <span className="text-5xl font-bold text-white">{result.overallScore}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Puntuación General</h2>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-${maturityInfo.color}-500/20 border border-${maturityInfo.color}-500/30`}>
                            <Award className={`w-5 h-5 text-${maturityInfo.color}-400`} />
                            <span className={`text-${maturityInfo.color}-400 font-semibold`}>
                                Nivel: {maturityInfo.label}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-black/20 rounded-lg">
                            <Target className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-400 mb-1">Preguntas Respondidas</p>
                            <p className="text-2xl font-bold text-white">{assessment.answers.length}</p>
                        </div>
                        <div className="text-center p-4 bg-black/20 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-400 mb-1">Categorías Evaluadas</p>
                            <p className="text-2xl font-bold text-white">{result.categoryScores.length}</p>
                        </div>
                        <div className="text-center p-4 bg-black/20 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-400 mb-1">Puntos Obtenidos</p>
                            <p className="text-2xl font-bold text-white">
                                {result.categoryScores.reduce((sum: number, c: any) => sum + c.score, 0)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Category Scores */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-white mb-6">Puntuación por Categoría</h2>
                    <div className="space-y-4">
                        {result.categoryScores.map((category: any) => (
                            <div key={category.categoryId}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white font-medium">{category.categoryName}</span>
                                    <span className="text-gray-400">
                                        {category.score} / {category.maxScore} puntos ({category.percentage}%)
                                    </span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full transition-all ${category.percentage >= 75 ? 'bg-green-500' :
                                            category.percentage >= 50 ? 'bg-yellow-500' :
                                                category.percentage >= 25 ? 'bg-orange-500' :
                                                    'bg-red-500'
                                            }`}
                                        style={{ width: `${category.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommendations */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6 text-yellow-400" />
                        Recomendaciones
                    </h2>
                    <div className="space-y-3">
                        {result.recommendations.map((rec: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-3 p-4 bg-gray-900/50 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                                <p className="text-gray-300">{rec}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
