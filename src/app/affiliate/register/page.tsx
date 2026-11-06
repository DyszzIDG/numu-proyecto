'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, DollarSign, TrendingUp, Award, Check, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function AffiliateRegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        email: '',
        paymentEmail: '',
        paymentMethod: 'paypal',
        preferredCode: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [affiliateData, setAffiliateData] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/affiliates/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                setAffiliateData(data.affiliate);
            } else {
                setError(data.error || 'Error al registrarse');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError('Error al registrarse como afiliado');
        } finally {
            setLoading(false);
        }
    };

    if (success && affiliateData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
                <div className="max-w-2xl w-full bg-gray-800/50 border border-green-500/30 rounded-xl p-8">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-green-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">¡Registro Exitoso!</h2>
                        <p className="text-gray-400">{affiliateData.message}</p>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Tu Información de Afiliado</h3>

                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-400">Código de Referido</p>
                                <p className="text-xl font-mono font-bold text-cyan-400">{affiliateData.code}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400">Link de Referido</p>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={affiliateData.referralLink}
                                        readOnly
                                        className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-gray-300 font-mono"
                                    />
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(affiliateData.referralLink);
                                            alert('¡Link copiado!');
                                        }}
                                        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded transition-colors"
                                    >
                                        Copiar
                                    </button>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-400">Comisión</p>
                                <p className="text-lg font-bold text-white">{affiliateData.commissionRate}% por 12 meses</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-300">
                            📧 Te hemos enviado un email de verificación a <strong>{form.email}</strong>.
                            Por favor verifica tu cuenta para activar tu programa de afiliados.
                        </p>
                    </div>

                    <button
                        onClick={() => router.push('/affiliate/dashboard?id=' + affiliateData.id)}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all duration-200"
                    >
                        Ir al Dashboard
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border-b border-cyan-500/20">
                <div className="max-w-6xl mx-auto px-6 py-16 text-center">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Programa de Afiliados NUMU
                    </h1>
                    <p className="text-xl text-gray-300 mb-8">
                        Gana <span className="text-cyan-400 font-bold">20% de comisión recurrente</span> por 12 meses
                    </p>

                    {/* Benefits */}
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-3" />
                            <h3 className="text-lg font-bold text-white mb-2">20% Comisión</h3>
                            <p className="text-sm text-gray-400">Por cada empresa que refier as, durante 12 meses</p>
                        </div>

                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <TrendingUp className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                            <h3 className="text-lg font-bold text-white mb-2">Ingresos Pasivos</h3>
                            <p className="text-sm text-gray-400">Comisiones recurrentes automáticas cada mes</p>
                        </div>

                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                            <Award className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                            <h3 className="text-lg font-bold text-white mb-2">Dashboard Pro</h3>
                            <p className="text-sm text-gray-400">Tracking en tiempo real de tus ganancias</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Registration Form */}
            <div className="max-w-2xl mx-auto px-6 py-12">
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">Regístrate como Afiliado</h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Nombre Completo *
                            </label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                placeholder="Juan Pérez"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                placeholder="juan@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email de Pago (PayPal) *
                            </label>
                            <input
                                type="email"
                                required
                                value={form.paymentEmail}
                                onChange={(e) => setForm({ ...form, paymentEmail: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none"
                                placeholder="pagos@example.com"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Email donde recibirás tus comisiones vía PayPal
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Código Preferido (Opcional)
                            </label>
                            <input
                                type="text"
                                value={form.preferredCode}
                                onChange={(e) => setForm({ ...form, preferredCode: e.target.value.toUpperCase() })}
                                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-cyan-500 focus:outline-none font-mono"
                                placeholder="JUAN2025"
                                maxLength={20}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Si no especificas uno, se generará automáticamente
                            </p>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-white mb-2">¿Cómo funciona?</h4>
                            <ul className="space-y-1 text-sm text-gray-300">
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span>Recibes un link único de referido</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span>Compartes el link con empresas</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span>Ganas 20% de comisión por 12 meses</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                    <span>Pagos mensuales automáticos (mínimo $50)</span>
                                </li>
                            </ul>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 disabled:from-cyan-500/50 disabled:to-teal-500/50 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/20"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Registrando...
                                </>
                            ) : (
                                <>
                                    <Users className="w-5 h-5" />
                                    Registrarse como Afiliado
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
