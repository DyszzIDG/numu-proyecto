'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Shield, ChevronLeft, ChevronRight, Check, Loader2,
    Code, AlertTriangle, Network, Lock, FileCheck, Database, Key, Activity
} from 'lucide-react';

interface Question {
    id: string;
    text: string;
    description: string | null;
    type: string;
    options: string | null;
    weight: number;
    order: number;
}

interface Category {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    order: number;
    questions: Question[];
}

const ICON_MAP: Record<string, any> = {
    Code, AlertTriangle, Network, Lock, FileCheck, Database, Key, Activity
};

export default function QuestionnairePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const assessmentId = searchParams.get('id');

    const [categories, setCategories] = useState<Category[]>([]);
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, { value: string; points: number }>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (assessmentId) {
            fetchQuestions();
        }
    }, [assessmentId]);

    const fetchQuestions = async () => {
        try {
            const response = await fetch('/api/questions');
            const data = await response.json();

            if (data.success) {
                setCategories(data.data);
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = async (questionId: string, value: string, points: number) => {
        // Update local state
        setAnswers({
            ...answers,
            [questionId]: { value, points }
        });

        // Save to API
        setSaving(true);
        try {
            await fetch(`/api/assessments/${assessmentId}/answers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ questionId, value, points })
            });
        } catch (error) {
            console.error('Error saving answer:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleYesNo = (questionId: string, weight: number, answer: boolean) => {
        const value = answer ? 'Sí' : 'No';
        const points = answer ? weight : 0;
        handleAnswer(questionId, value, points);
    };

    const handleMultipleChoice = (questionId: string, option: any) => {
        handleAnswer(questionId, option.label, option.points);
    };

    const currentCategory = categories[currentCategoryIndex];
    const progress = categories.length > 0
        ? ((currentCategoryIndex + 1) / categories.length) * 100
        : 0;

    const canGoNext = currentCategoryIndex < categories.length - 1;
    const canGoPrev = currentCategoryIndex > 0;

    const answeredInCategory = currentCategory?.questions.filter(
        q => answers[q.id]
    ).length || 0;
    const totalInCategory = currentCategory?.questions.length || 0;
    const categoryComplete = answeredInCategory === totalInCategory;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Cargando cuestionario...</p>
                </div>
            </div>
        );
    }

    if (!currentCategory) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400">No hay preguntas disponibles</p>
                </div>
            </div>
        );
    }

    const Icon = ICON_MAP[currentCategory.icon] || Shield;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-8 h-8 text-cyan-400" />
                        <h1 className="text-3xl font-bold text-white">Evaluación de Seguridad</h1>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                            <span>Progreso General</span>
                            <span>{currentCategoryIndex + 1} de {categories.length} categorías</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Category Card */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8 mb-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div className={`p-3 rounded-lg bg-${currentCategory.color}-500/20`}>
                            <Icon className={`w-8 h-8 text-${currentCategory.color}-400`} />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {currentCategory.name}
                            </h2>
                            <p className="text-gray-400">{currentCategory.description}</p>
                            <div className="mt-2 text-sm text-gray-500">
                                {answeredInCategory} de {totalInCategory} preguntas respondidas
                            </div>
                        </div>
                    </div>

                    {/* Questions */}
                    <div className="space-y-6">
                        {currentCategory.questions.map((question, idx) => {
                            const isAnswered = !!answers[question.id];
                            const options = question.options ? JSON.parse(question.options) : [];

                            return (
                                <div
                                    key={question.id}
                                    className={`p-6 rounded-lg border ${isAnswered
                                            ? 'bg-cyan-500/10 border-cyan-500/30'
                                            : 'bg-gray-900/50 border-gray-700'
                                        }`}
                                >
                                    <div className="flex items-start gap-3 mb-4">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-700 text-white text-sm font-semibold">
                                            {idx + 1}
                                        </span>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-white mb-1">
                                                {question.text}
                                            </h3>
                                            {question.description && (
                                                <p className="text-sm text-gray-400">{question.description}</p>
                                            )}
                                        </div>
                                        {isAnswered && (
                                            <Check className="w-6 h-6 text-cyan-400" />
                                        )}
                                    </div>

                                    {/* Answer Options */}
                                    {question.type === 'yes_no' && (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleYesNo(question.id, question.weight, true)}
                                                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${answers[question.id]?.value === 'Sí'
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                    }`}
                                            >
                                                Sí
                                            </button>
                                            <button
                                                onClick={() => handleYesNo(question.id, question.weight, false)}
                                                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${answers[question.id]?.value === 'No'
                                                        ? 'bg-red-500 text-white'
                                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                    }`}
                                            >
                                                No
                                            </button>
                                        </div>
                                    )}

                                    {question.type === 'multiple_choice' && (
                                        <div className="space-y-2">
                                            {options.map((option: any, optIdx: number) => (
                                                <button
                                                    key={optIdx}
                                                    onClick={() => handleMultipleChoice(question.id, option)}
                                                    className={`w-full px-6 py-3 rounded-lg font-medium text-left transition-colors ${answers[question.id]?.value === option.label
                                                            ? 'bg-cyan-500 text-white'
                                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                        }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setCurrentCategoryIndex(currentCategoryIndex - 1)}
                        disabled={!canGoPrev}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-700/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Anterior
                    </button>

                    <div className="text-center">
                        {saving && (
                            <div className="flex items-center gap-2 text-cyan-400">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm">Guardando...</span>
                            </div>
                        )}
                    </div>

                    {canGoNext ? (
                        <button
                            onClick={() => setCurrentCategoryIndex(currentCategoryIndex + 1)}
                            disabled={!categoryComplete}
                            className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                        >
                            Siguiente
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button
                            onClick={() => router.push(`/assessment/results/${assessmentId}`)}
                            disabled={!categoryComplete}
                            className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                        >
                            Finalizar Evaluación
                            <Check className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
