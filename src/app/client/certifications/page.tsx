'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getClientSession } from '@/lib/auth/client-session';
import { Award, Check, ArrowRight, Loader2, AlertCircle, Building2, TrendingUp } from 'lucide-react';

interface Tier {
    id: string;
    name: string;
    slug: string;
    minScore: number;
    maxScore: number;
    price: number;
    priceFormatted: string;
    color: string;
    icon: string;
    benefits: string[];
    description: string;
    order: number;
}

interface EligibilityData {
    eligible: boolean;
    score?: number;
    tier?: Tier;
    assessment?: {
        id: string;
        completedAt: string;
    };
    message?: string;
}

export default function CertificationsPage() {
    const router = useRouter();
    const [session, setSession] = useState<any>(null);
    const [tiers, setTiers] = useState<Tier[]>([]);
    const [eligibility, setEligibility] = useState<EligibilityData | null>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const clientSession = getClientSession();
        if (!clientSession) {
            router.push('/client/login');
            return;
        }
        setSession(clientSession);
        loadData(clientSession.companyId);
    }, [router]);

    const loadData = async (companyId: string) => {
        try {
            // Load tiers
            const tiersRes = await fetch('/api/certifications/tiers');
            const tiersData = await tiersRes.json();

            // Load eligibility
            const eligRes = await fetch(`/api/certifications/apply?companyId=${companyId}`);
            const eligData = await eligRes.json();

            if (tiersData.success) {
                setTiers(tiersData.tiers);
            }

            if (eligData.success) {
                setEligibility(eligData);
            }
        } catch (error) {
            console.error('Load data error:', error);
            setError('Error al cargar datos');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (tierId: string) => {
        if (!session || !eligibility?.assessment) return;

        setApplying(true);
        setError('');

        try {
            const response = await fetch('/api/certifications/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companyId: session.companyId,
                    assessmentId: eligibility.assessment.id,
                    tierId,
                    isPublic: true
                })
            });

            const data = await response.json();

            if (data.success) {
                alert(`¡Certificación ${data.certification.tier.name} solicitada exitosamente!\n\nNúmero: ${data.certification.certificateNumber}\n\n${data.certification.message}`);
                // Reload data
                loadData(session.companyId);
            } else {
                setError(data.error || 'Error al solicitar certificación');
            }
        } catch (error) {
            console.error('Apply error:', error);
            setError('Error al solicitar certificación');
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Cargando certificaciones...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header */}
            <header className="bg-gray-800/50 border-b border-cyan-500/30 shadow-lg shadow-cyan-500/5">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Award className="w-8 h-8 text-cyan-400" />
                        <div>
                            <h1 className="text-xl font-bold text-white">Certificaciones NUMU</h1>
                            <p className="text-sm text-gray-400">Certifica tu excelencia en ciberseguridad</p>
                        </div>
                    </div>
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

                {/* Eligibility Status */}
                {eligibility && (
                    <div className={`mb-8 p-6 rounded-xl border ${eligibility.eligible
                            ? 'bg-green-500/10 border-green-500/30'
                            : 'bg-yellow-500/10 border-yellow-500/30'
                        }`}>
                        <div className="flex items-start gap-4">
                            {eligibility.eligible ? (
                                <Award className="w-8 h-8 text-green-400 flex-shrink-0" />
                            ) : (
                                <TrendingUp className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-white mb-2">
                                    {eligibility.eligible ? '¡Felicitaciones!' : 'Estado de Elegibilidad'}
                                </h2>
                                {eligibility.eligible ? (
                                    <>
                                        <p className="text-gray-300 mb-3">
                                            Tu puntuación de <span className="font-bold text-cyan-400">{eligibility.score}%</span> califica para la certificación{' '}
                                            <span className="font-bold" style={{ color: eligibility.tier?.color }}>
                                                {eligibility.tier?.icon} {eligibility.tier?.name}
                                            </span>
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            Evaluación completada: {new Date(eligibility.assessment?.completedAt || '').toLocaleDateString('es-ES')}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-gray-300">
                                        {eligibility.message || 'Completa una evaluación para calificar para certificación'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tiers Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tiers.map((tier) => {
                        const isEligible = eligibility?.eligible && eligibility.tier?.id === tier.id;
                        const scoreInRange = eligibility?.score &&
                            eligibility.score >= tier.minScore &&
                            eligibility.score <= tier.maxScore;

                        return (
                            <div
                                key={tier.id}
                                className={`bg-gray-800/50 border rounded-xl p-6 transition-all duration-200 ${isEligible
                                        ? 'border-cyan-500 shadow-lg shadow-cyan-500/20 scale-105'
                                        : 'border-gray-700 hover:border-gray-600'
                                    }`}
                            >
                                {/* Tier Header */}
                                <div className="text-center mb-4">
                                    <div className="text-5xl mb-2">{tier.icon}</div>
                                    <h3 className="text-2xl font-bold text-white mb-1">{tier.name}</h3>
                                    <p className="text-sm text-gray-400">{tier.minScore}-{tier.maxScore}% Score</p>
                                </div>

                                {/* Price */}
                                <div className="text-center mb-4 pb-4 border-b border-gray-700">
                                    <div className="text-3xl font-bold text-white">{tier.priceFormatted}</div>
                                    <div className="text-sm text-gray-400">/año</div>
                                </div>

                                {/* Benefits */}
                                <ul className="space-y-2 mb-6">
                                    {tier.benefits.map((benefit, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                                            <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Apply Button */}
                                {isEligible ? (
                                    <button
                                        onClick={() => handleApply(tier.id)}
                                        disabled={applying}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 disabled:from-cyan-500/50 disabled:to-teal-500/50 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/20"
                                    >
                                        {applying ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                Solicitar Certificación
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                ) : scoreInRange ? (
                                    <div className="w-full px-4 py-3 bg-cyan-500/20 text-cyan-400 text-center rounded-lg border border-cyan-500/30">
                                        Califica para este nivel
                                    </div>
                                ) : (
                                    <div className="w-full px-4 py-3 bg-gray-700/50 text-gray-500 text-center rounded-lg">
                                        No disponible
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Info Section */}
                <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-400" />
                        ¿Cómo funciona?
                    </h3>
                    <ol className="space-y-2 text-sm text-gray-300">
                        <li>1. Completa una evaluación de seguridad</li>
                        <li>2. Obtén tu puntuación y nivel de madurez</li>
                        <li>3. Solicita la certificación correspondiente a tu score</li>
                        <li>4. Recibe tu certificado PDF y badge digital</li>
                        <li>5. Muestra tu certificación en tu sitio web</li>
                    </ol>
                </div>
            </main>
        </div>
    );
}
