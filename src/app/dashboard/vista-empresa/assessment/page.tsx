'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Circle, ArrowLeft, ArrowRight, Save, TrendingUp } from 'lucide-react';

interface Question {
    id: string;
    text: string;
    category: string;
    weight: number;
}

export default function CompanyAssessmentPage() {
    const router = useRouter();

    const [company, setCompany] = useState<any>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [currentCategory, setCurrentCategory] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            // 1. Get My Company
            const myCompanyRes = await fetch('/api/company/my-company');
            if (!myCompanyRes.ok) throw new Error("Failed to fetch company");
            const myCompanyData = await myCompanyRes.json();

            if (!myCompanyData.company) {
                // Redirect if no company profile
                router.push('/dashboard/vista-empresa');
                return;
            }

            setCompany(myCompanyData.company);
            const companyId = myCompanyData.company.id;

            // 2. Fetch questions
            const questionsRes = await fetch(`/api/assessment/questions?industry=${myCompanyData.company.industry}`);
            const questionsData = await questionsRes.json();
            setQuestions(questionsData.questions || []);

            // 3. Load existing answers
            const assessmentRes = await fetch(`/api/assessment/${companyId}`);
            if (assessmentRes.ok) {
                const assessmentData = await assessmentRes.json();
                if (assessmentData.assessment?.answers) {
                    const answersMap: Record<string, number> = {};
                    assessmentData.assessment.answers.forEach((a: any) => {
                        answersMap[a.questionId] = a.value;
                    });
                    setAnswers(answersMap);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = Array.from(new Set(questions.map(q => q.category)));
    const currentQuestions = questions.filter(q => q.category === categories[currentCategory]);
    const progress = questions.length > 0 ? (Object.keys(answers).length / questions.length) * 100 : 0;

    const handleAnswer = (questionId: string, value: number) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSave = async () => {
        if (!company) return;
        setSaving(true);
        try {
            const answersArray = Object.entries(answers).map(([questionId, value]) => ({
                questionId,
                value
            }));

            await fetch(`/api/assessment/${company.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers: answersArray }),
            });

            alert('Progreso guardado');
        } catch (error) {
            console.error('Error saving:', error);
            alert('Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    const handleComplete = async () => {
        if (!company) return;
        if (Object.keys(answers).length < questions.length) {
            alert('Por favor responde todas las preguntas antes de completar');
            return;
        }

        setSaving(true);
        try {
            const answersArray = Object.entries(answers).map(([questionId, value]) => ({
                questionId,
                value
            }));

            const res = await fetch(`/api/assessment/${company.id}/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers: answersArray }),
            });

            const data = await res.json();
            if (data.success) {
                alert(`Evaluación completada! Score: ${data.score}%`);
                router.push('/dashboard/vista-empresa');
            }
        } catch (error) {
            console.error('Error completing:', error);
            alert('Error al completar la evaluación');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-gray-400">Cargando evaluación...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <button
                            onClick={() => router.push('/dashboard/vista-empresa')}
                            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al Panel
                        </button>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Autoevaluación de Seguridad
                        </h1>
                        <p className="text-gray-400">{company?.name}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-400 mb-1">Progreso</div>
                        <div className="text-2xl font-bold text-white">{Math.round(progress)}%</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-white/5 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-blue-500 h-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Category Tabs */}
                {categories.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {categories.map((category, index) => {
                            const categoryQuestions = (questions || []).filter(q => q.category === category);
                            const answeredInCategory = categoryQuestions.filter(q => answers[q.id] !== undefined).length;
                            const isComplete = answeredInCategory === categoryQuestions.length;

                            return (
                                <button
                                    key={category}
                                    onClick={() => setCurrentCategory(index)}
                                    className={`px-4 py-2 rounded-lg whitespace-nowrap flex items-center gap-2 transition-all ${currentCategory === index
                                        ? 'bg-blue-500 text-white'
                                        : isComplete
                                            ? 'bg-green-500/20 text-green-300 border border-green-500/50'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    {isComplete ? (
                                        <CheckCircle className="w-4 h-4" />
                                    ) : (
                                        <Circle className="w-4 h-4" />
                                    )}
                                    {category}
                                    <span className="text-xs">({answeredInCategory}/{categoryQuestions.length})</span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Questions */}
                {categories.length > 0 && (
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 space-y-6">
                        <h2 className="text-xl font-semibold text-white mb-4">
                            {categories[currentCategory]}
                        </h2>
                        {currentQuestions.map((question, index) => (
                            <QuestionCard
                                key={question.id}
                                question={question}
                                index={index}
                                value={answers[question.id]}
                                onChange={(value) => handleAnswer(question.id, value)}
                            />
                        ))}
                    </div>
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setCurrentCategory(Math.max(0, currentCategory - 1))}
                        disabled={currentCategory === 0}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Anterior
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? 'Guardando...' : 'Guardar Progreso'}
                        </button>

                        {categories.length > 0 && currentCategory === categories.length - 1 ? (
                            <button
                                onClick={handleComplete}
                                disabled={saving || Object.keys(answers).length < questions.length}
                                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                <TrendingUp className="w-4 h-4" />
                                Completar Evaluación
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentCategory(Math.min(categories.length - 1, currentCategory + 1))}
                                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                                Siguiente
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function QuestionCard({ question, index, value, onChange }: {
    question: Question;
    index: number;
    value: number | undefined;
    onChange: (value: number) => void;
}) {
    const options = [
        { value: 0, label: 'No implementado', color: 'red' },
        { value: 1, label: 'Parcialmente', color: 'orange' },
        { value: 2, label: 'Básico', color: 'yellow' },
        { value: 3, label: 'Avanzado', color: 'blue' },
        { value: 4, label: 'Óptimo', color: 'green' },
    ];

    return (
        <div className="p-4 bg-black/30 rounded-lg border border-white/10">
            <div className="flex items-start gap-3 mb-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                </span>
                <p className="text-white flex-1">{question.text}</p>
            </div>
            <div className="grid grid-cols-5 gap-2">
                {options.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={`px-3 py-2 rounded-lg text-sm transition-all ${value === option.value
                            ? `bg-${option.color}-500 text-white border-2 border-${option.color}-400`
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
