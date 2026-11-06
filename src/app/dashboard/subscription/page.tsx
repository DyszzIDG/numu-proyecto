'use client';

import { useState, useEffect } from 'react';
import { Check, Zap, Crown, Rocket, TrendingUp, Calendar, Activity, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const PLANS = [
    {
        id: 'free',
        name: 'Free',
        icon: Zap,
        price: '$0',
        period: '/mes',
        quota: 10,
        features: [
            '10 escaneos por mes',
            'Herramientas básicas',
            'Soporte por email',
            'Historial de 30 días'
        ],
        color: 'from-gray-500 to-gray-600',
        borderColor: 'border-gray-500/20',
        bgColor: 'bg-gray-500/10'
    },
    {
        id: 'pro',
        name: 'Pro',
        icon: Crown,
        price: '$49',
        period: '/mes',
        quota: 100,
        features: [
            '100 escaneos por mes',
            'Todas las herramientas',
            'Análisis IA avanzado',
            'Soporte prioritario',
            'Historial ilimitado',
            'Reportes personalizados'
        ],
        color: 'from-purple-500 to-pink-600',
        borderColor: 'border-purple-500/20',
        bgColor: 'bg-purple-500/10',
        popular: true
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        icon: Rocket,
        price: 'Custom',
        period: '',
        quota: -1,
        features: [
            'Escaneos ilimitados',
            'Herramientas personalizadas',
            'IA dedicada',
            'Soporte 24/7',
            'SLA garantizado',
            'Integración empresarial',
            'Auditorías de seguridad'
        ],
        color: 'from-blue-500 to-cyan-500',
        borderColor: 'border-blue-500/20',
        bgColor: 'bg-blue-500/10'
    }
];

export default function SubscriptionPage() {
    const [quotaData, setQuotaData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [upgrading, setUpgrading] = useState(false);

    useEffect(() => {
        fetchQuotaData();
    }, []);

    const fetchQuotaData = async () => {
        try {
            const res = await fetch('/api/subscription/check-quota');
            const data = await res.json();
            if (data.success) {
                setQuotaData(data);
            }
        } catch (error) {
            console.error('Failed to fetch quota:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = async (planId: string) => {
        setUpgrading(true);
        try {
            const res = await fetch('/api/subscription/upgrade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: planId })
            });
            const data = await res.json();
            if (data.success) {
                alert('Plan actualizado exitosamente');
                fetchQuotaData();
            } else {
                alert(data.message || 'Error al actualizar plan');
            }
        } catch (error) {
            console.error('Upgrade failed:', error);
            alert('Error al procesar la solicitud');
        } finally {
            setUpgrading(false);
        }
    };

    const currentPlan = quotaData?.quotaStatus?.plan || 'free';
    const usedQuota = quotaData?.quotaStatus?.used || 0;
    const totalQuota = quotaData?.quotaStatus?.quota || 10;
    const usagePercent = totalQuota > 0 ? (usedQuota / totalQuota) * 100 : 0;

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/dashboard" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 mb-4">
                            <ArrowLeft className="w-4 h-4" /> Volver
                        </Link>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Suscripción y Planes
                        </h1>
                        <p className="text-zinc-500 mt-2">Gestiona tu plan y monitorea tu uso</p>
                    </div>
                </div>

                {/* Current Usage Stats */}
                {!loading && quotaData && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-purple-500/10 rounded-lg">
                                    <Activity className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Plan Actual</p>
                                    <p className="text-xl font-bold capitalize">{currentPlan}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-blue-500/10 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Uso del Mes</p>
                                    <p className="text-xl font-bold">
                                        {usedQuota} / {totalQuota === -1 ? '∞' : totalQuota}
                                    </p>
                                </div>
                            </div>
                            {totalQuota > 0 && (
                                <div className="mt-4">
                                    <div className="w-full bg-white/10 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                                            style={{ width: `${Math.min(usagePercent, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-green-500/10 rounded-lg">
                                    <Calendar className="w-6 h-6 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500">Escaneos Totales</p>
                                    <p className="text-xl font-bold">{quotaData.usageStats?.totalScans || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Plans Grid */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">Planes Disponibles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {PLANS.map((plan) => {
                            const Icon = plan.icon;
                            const isCurrentPlan = currentPlan === plan.id;

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative bg-white/5 border ${plan.borderColor} rounded-2xl p-8 hover:bg-white/10 transition-all ${plan.popular ? 'ring-2 ring-purple-500/50' : ''
                                        }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold">
                                            MÁS POPULAR
                                        </div>
                                    )}

                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>

                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1 mb-6">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        <span className="text-zinc-500">{plan.period}</span>
                                    </div>

                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm">
                                                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                                <span className="text-zinc-300">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={() => handleUpgrade(plan.id)}
                                        disabled={isCurrentPlan || upgrading}
                                        className={`w-full py-3 rounded-lg font-bold transition-all ${isCurrentPlan
                                                ? 'bg-white/10 text-zinc-500 cursor-not-allowed'
                                                : `bg-gradient-to-r ${plan.color} hover:opacity-90 text-white shadow-lg`
                                            }`}
                                    >
                                        {isCurrentPlan ? 'Plan Actual' : upgrading ? 'Procesando...' : 'Seleccionar Plan'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* FAQ or Additional Info */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                    <h3 className="text-xl font-bold mb-4">¿Necesitas ayuda?</h3>
                    <p className="text-zinc-400 mb-4">
                        Contáctanos en <a href="mailto:support@numu.group" className="text-purple-400 hover:underline">support@numu.group</a> para planes personalizados o consultas sobre facturación.
                    </p>
                </div>
            </div>
        </div>
    );
}
