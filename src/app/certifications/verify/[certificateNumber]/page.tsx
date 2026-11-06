'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Award, CheckCircle, XCircle, Calendar, Building2, TrendingUp, Loader2, Shield } from 'lucide-react';
import Link from 'next/link';

interface VerificationData {
    valid: boolean;
    certification?: {
        certificateNumber: string;
        company: {
            name: string;
            industry: string;
            country: string;
            website?: string;
        };
        tier: {
            name: string;
            color: string;
            icon: string;
        };
        score: number;
        issuedAt: string;
        expiresAt: string;
        status: string;
        isExpired: boolean;
        isRevoked: boolean;
        revokedReason?: string;
    };
    message?: string;
}

export default function VerifyCertificatePage() {
    const params = useParams();
    const certificateNumber = params.certificateNumber as string;

    const [data, setData] = useState<VerificationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (certificateNumber) {
            verifyC ertificate();
        }
    }, [certificateNumber]);

    const verifyCertificate = async () => {
        try {
            const response = await fetch(`/api/certifications/verify/${certificateNumber}`);
            const result = await response.json();

            if (result.success) {
                setData(result);
            } else {
                setError(result.error || 'Error al verificar certificado');
            }
        } catch (error) {
            console.error('Verification error:', error);
            setError('Error al verificar certificado');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Verificando certificado...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header */}
            <header className="bg-gray-800/50 border-b border-cyan-500/30 shadow-lg shadow-cyan-500/5">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <div className="flex items-center gap-3">
                        <Shield className="w-10 h-10 text-cyan-400" />
                        <div>
                            <h1 className="text-2xl font-bold text-white">Verificación de Certificado NUMU</h1>
                            <p className="text-sm text-gray-400">Sistema público de verificación</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-12">
                {error ? (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center">
                        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
                        <p className="text-red-400">{error}</p>
                    </div>
                ) : !data?.valid ? (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-8 text-center">
                        <XCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Certificado No Válido</h2>
                        <p className="text-gray-300 mb-4">{data?.message || 'Este certificado no fue encontrado o no es válido'}</p>
                        <p className="text-sm text-gray-400">Número de certificado: {certificateNumber}</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Validation Badge */}
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                            <div className="flex items-center gap-4">
                                <CheckCircle className="w-12 h-12 text-green-400 flex-shrink-0" />
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">✓ Certificado Válido</h2>
                                    <p className="text-gray-300">Este certificado ha sido verificado y es auténtico</p>
                                </div>
                            </div>
                        </div>

                        {/* Certificate Details */}
                        <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
                            {/* Header with Tier */}
                            <div
                                className="p-8 text-center border-b border-gray-700"
                                style={{
                                    background: `linear-gradient(135deg, ${data.certification?.tier.color}20, ${data.certification?.tier.color}10)`,
                                    borderColor: `${data.certification?.tier.color}40`
                                }}
                            >
                                <div className="text-6xl mb-3">{data.certification?.tier.icon}</div>
                                <h3 className="text-3xl font-bold text-white mb-2">
                                    Certificación {data.certification?.tier.name}
                                </h3>
                                <p className="text-xl text-gray-300">
                                    Puntuación: <span className="font-bold text-cyan-400">{data.certification?.score}%</span>
                                </p>
                            </div>

                            {/* Company Information */}
                            <div className="p-8 space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                                        <Building2 className="w-5 h-5" />
                                        <span className="text-sm font-medium">EMPRESA CERTIFICADA</span>
                                    </div>
                                    <h4 className="text-2xl font-bold text-white mb-1">
                                        {data.certification?.company.name}
                                    </h4>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                        <span>📍 {data.certification?.company.country}</span>
                                        <span>🏢 {data.certification?.company.industry}</span>
                                        {data.certification?.company.website && (
                                            <a
                                                href={data.certification.company.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-cyan-400 hover:text-cyan-300 transition-colors"
                                            >
                                                🌐 Sitio Web
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Certificate Details Grid */}
                                <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-700">
                                    <div>
                                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                                            <Award className="w-4 h-4" />
                                            <span className="text-xs font-medium uppercase">Número de Certificado</span>
                                        </div>
                                        <p className="text-lg font-mono text-white">{data.certification?.certificateNumber}</p>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                                            <TrendingUp className="w-4 h-4" />
                                            <span className="text-xs font-medium uppercase">Nivel de Madurez</span>
                                        </div>
                                        <p className="text-lg font-semibold text-white">{data.certification?.tier.name}</p>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-xs font-medium uppercase">Fecha de Emisión</span>
                                        </div>
                                        <p className="text-lg text-white">
                                            {new Date(data.certification?.issuedAt || '').toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-xs font-medium uppercase">Fecha de Expiración</span>
                                        </div>
                                        <p className="text-lg text-white">
                                            {new Date(data.certification?.expiresAt || '').toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {/* Status Indicators */}
                                {data.certification?.isExpired && (
                                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                        <p className="text-yellow-400 text-sm">
                                            ⚠️ Este certificado ha expirado. La empresa debe renovar su certificación.
                                        </p>
                                    </div>
                                )}

                                {data.certification?.isRevoked && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                        <p className="text-red-400 text-sm font-semibold mb-1">
                                            ❌ Este certificado ha sido revocado
                                        </p>
                                        {data.certification.revokedReason && (
                                            <p className="text-red-300 text-sm">
                                                Razón: {data.certification.revokedReason}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                            <h4 className="text-white font-semibold mb-2">Acerca de las Certificaciones NUMU</h4>
                            <p className="text-sm text-gray-300 mb-3">
                                Las certificaciones NUMU validan el nivel de madurez en ciberseguridad de las organizaciones
                                basándose en evaluaciones exhaustivas de sus prácticas y controles de seguridad.
                            </p>
                            <Link
                                href="/certifications/directory"
                                className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                            >
                                Ver directorio de empresas certificadas →
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
