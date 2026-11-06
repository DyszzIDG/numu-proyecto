'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    Users, DollarSign, TrendingUp, Eye, Copy, Check,
    Download, ExternalLink, Loader2, AlertCircle, Calendar,
    ArrowUpRight, Clock
} from 'lucide-react';

interface DashboardData {
    affiliate: {
        name: string;
        email: string;
        code: string;
        referralLink: string;
        status: string;
        isVerified: boolean;
    };
    stats: {
        totalClicks: number;
        totalReferrals: number;
        activeReferrals: number;
        conversionRate: number;
        totalEarnings: number;
        pendingEarnings: number;
        availableForPayout: number;
    };
    recentReferrals: any[];
    recentClicks: any[];
    payouts: any[];
    monthlyEarnings: any[];
}

export default function AffiliateDashboardPage() {
    const searchParams = useSearchParams();
    const affiliateId = searchParams.get('id');

    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (affiliateId) {
            loadDashboard();
        }
    }, [affiliateId]);

    const loadDashboard = async () => {
        try {
            const response = await fetch(`/api/affiliates/dashboard?affiliateId=${affiliateId}`);
            const result = await response.json();

            if (result.success) {
                setData(result);
            } else {
                setError(result.error || 'Error al cargar dashboard');
            }
        } catch (error) {
            console.error('Load dashboard error:', error);
            setError('Error al cargar dashboard');
        } finally {
            setLoading(false);
        }
    };

    const copyLink = () => {
        if (data?.affiliate.referralLink) {
            navigator.clipboard.writeText(data.affiliate.referralLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatCurrency = (cents: number) => {
        return `$${(cents / 100).toFixed(2)}`;
    };

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

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
                    <p className="text-red-400">{error || 'No se pudo cargar el dashboard'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header */}
            <header className="bg-gray-800/50 border-b border-cyan-500/30 shadow-lg shadow-cyan-500/5">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Dashboard de Afiliado</h1>
                            <p className="text-gray-400">Bienvenido, {data.affiliate.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${data.affiliate.status === 'active'
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                }`}>
                                {data.affiliate.status === 'active' ? '✓ Activo' : '⏳ Pendiente'}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Referral Link Card */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/30 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Tu Link de Referido</h3>
                    <div className="flex items-center gap-3">
                        <input
                            type="text"
                            value={data.affiliate.referralLink}
                            readOnly
                            className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 font-mono text-sm"
                        />
                        <button
                            onClick={copyLink}
                            className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                        >
                            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            {copied ? 'Copiado!' : 'Copiar'}
                        </button>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">
                        Código: <span className="font-mono font-bold text-cyan-400">{data.affiliate.code}</span>
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Eye className="w-8 h-8 text-blue-400" />
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{data.stats.totalClicks}</p>
                        <p className="text-sm text-gray-400">Total Clicks</p>
                    </div>

                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <Users className="w-8 h-8 text-cyan-400" />
                            <span className="text-xs text-gray-400">{data.stats.conversionRate.toFixed(1)}%</span>
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{data.stats.totalReferrals}</p>
                        <p className="text-sm text-gray-400">Total Referidos</p>
                    </div>

                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <DollarSign className="w-8 h-8 text-green-400" />
                            <ArrowUpRight className="w-5 h-5 text-green-400" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">
                            {formatCurrency(data.stats.totalEarnings)}
                        </p>
                        <p className="text-sm text-gray-400">Total Ganado</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-2">
                            <DollarSign className="w-8 h-8 text-green-400" />
                            <Download className="w-5 h-5 text-green-400" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">
                            {formatCurrency(data.stats.availableForPayout)}
                        </p>
                        <p className="text-sm text-gray-400">Disponible para Pago</p>
                    </div>
                </div>

                {/* Recent Referrals */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-white mb-4">Referidos Recientes</h3>

                    {data.recentReferrals.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">Aún no tienes referidos</p>
                            <p className="text-sm text-gray-500 mt-2">Comparte tu link para empezar a ganar comisiones</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-700">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Empresa</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Industria</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Estado</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Revenue Mensual</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Tu Comisión</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.recentReferrals.map((ref) => (
                                        <tr key={ref.id} className="border-b border-gray-800 hover:bg-gray-700/30">
                                            <td className="py-3 px-4 text-white">{ref.company}</td>
                                            <td className="py-3 px-4 text-gray-400">{ref.industry}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${ref.status === 'active'
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                    {ref.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right text-white">
                                                {formatCurrency(ref.monthlyRevenue)}
                                            </td>
                                            <td className="py-3 px-4 text-right text-green-400 font-semibold">
                                                {formatCurrency(ref.commission)}
                                            </td>
                                            <td className="py-3 px-4 text-gray-400 text-sm">
                                                {ref.convertedAt ? new Date(ref.convertedAt).toLocaleDateString('es-ES') : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Payout Section */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Request Payout */}
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Solicitar Pago</h3>

                        <div className="mb-4">
                            <p className="text-sm text-gray-400 mb-2">Saldo Disponible</p>
                            <p className="text-3xl font-bold text-green-400">
                                {formatCurrency(data.stats.availableForPayout)}
                            </p>
                        </div>

                        {data.stats.availableForPayout >= 5000 ? (
                            <button
                                onClick={() => alert('Función de payout en desarrollo')}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                            >
                                <Download className="w-5 h-5" />
                                Solicitar Pago
                            </button>
                        ) : (
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                                <p className="text-sm text-yellow-400">
                                    Mínimo para pago: $50.00
                                    <br />
                                    Te faltan: {formatCurrency(5000 - data.stats.availableForPayout)}
                                </p>
                            </div>
                        )}

                        <p className="text-xs text-gray-500 mt-4">
                            Los pagos se procesan semanalmente los viernes vía PayPal
                        </p>
                    </div>

                    {/* Recent Payouts */}
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Historial de Pagos</h3>

                        {data.payouts.length === 0 ? (
                            <div className="text-center py-8">
                                <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-400 text-sm">Sin pagos aún</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {data.payouts.slice(0, 5).map((payout) => (
                                    <div key={payout.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                                        <div>
                                            <p className="text-white font-medium">{formatCurrency(payout.amount)}</p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(payout.requestedAt).toLocaleDateString('es-ES')}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${payout.status === 'paid'
                                                ? 'bg-green-500/20 text-green-400'
                                                : payout.status === 'pending'
                                                    ? 'bg-yellow-500/20 text-yellow-400'
                                                    : 'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {payout.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
