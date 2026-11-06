'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Building2, Search, Eye, TrendingUp, Users, Award,
    Calendar, Loader2, ArrowRight
} from 'lucide-react';

interface Company {
    id: string;
    name: string;
    industry: string;
    size: string;
    country: string;
    contactEmail: string;
    contactName: string;
    createdAt: string;
    assessments: Array<{
        id: string;
        status: string;
        overallScore: number | null;
        maturityLevel: string | null;
        completedAt: string | null;
    }>;
}

export default function CompaniesPage() {
    const router = useRouter();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await fetch('/api/companies');
            const data = await response.json();

            if (data.success) {
                setCompanies(data.data);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.contactEmail.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getMaturityColor = (level: string | null) => {
        if (!level) return 'gray';
        const colors: Record<string, string> = {
            initial: 'red',
            developing: 'orange',
            defined: 'yellow',
            managed: 'green',
            optimized: 'cyan'
        };
        return colors[level] || 'gray';
    };

    const getMaturityLabel = (level: string | null) => {
        if (!level) return 'Sin evaluar';
        const labels: Record<string, string> = {
            initial: 'Inicial',
            developing: 'En Desarrollo',
            defined: 'Definido',
            managed: 'Gestionado',
            optimized: 'Optimizado'
        };
        return labels[level] || 'Desconocido';
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Empresas Registradas</h1>
                    <p className="text-zinc-400">Gestión de empresas y sus evaluaciones de seguridad</p>
                </div>
                <button
                    onClick={() => router.push('/assessment/register')}
                    className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                >
                    <Building2 className="w-5 h-5" />
                    Nueva Empresa
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/30">
                    <div className="flex items-center gap-3 mb-2">
                        <Building2 className="w-6 h-6 text-cyan-400" />
                        <span className="text-sm text-gray-400">Total Empresas</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{companies.length}</p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-6 h-6 text-green-400" />
                        <span className="text-sm text-gray-400">Evaluaciones Completadas</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                        {companies.reduce((sum, c) => sum + c.assessments.filter(a => a.status === 'completed').length, 0)}
                    </p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="w-6 h-6 text-yellow-400" />
                        <span className="text-sm text-gray-400">En Progreso</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                        {companies.reduce((sum, c) => sum + c.assessments.filter(a => a.status === 'in_progress').length, 0)}
                    </p>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30">
                    <div className="flex items-center gap-3 mb-2">
                        <Award className="w-6 h-6 text-purple-400" />
                        <span className="text-sm text-gray-400">Score Promedio</span>
                    </div>
                    <p className="text-2xl font-bold text-white">
                        {companies.length > 0
                            ? Math.round(
                                companies.reduce((sum, c) => {
                                    const completedAssessments = c.assessments.filter(a => a.overallScore !== null);
                                    const avgScore = completedAssessments.length > 0
                                        ? completedAssessments.reduce((s, a) => s + (a.overallScore || 0), 0) / completedAssessments.length
                                        : 0;
                                    return sum + avgScore;
                                }, 0) / companies.length
                            )
                            : 0
                        }
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    placeholder="Buscar por nombre, industria o email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                />
            </div>

            {/* Companies Table */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-black/40">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Empresa</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Industria</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Tamaño</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Evaluaciones</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Última Evaluación</th>
                            <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {filteredCompanies.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No se encontraron empresas
                                </td>
                            </tr>
                        ) : (
                            filteredCompanies.map((company) => {
                                const latestAssessment = company.assessments[0];
                                return (
                                    <tr key={company.id} className="hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-white font-medium">{company.name}</p>
                                                <p className="text-sm text-gray-400">{company.contactEmail}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-300">{company.industry}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-300">{company.size}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white font-semibold">{company.assessments.length}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {latestAssessment ? (
                                                <div className="flex items-center gap-2">
                                                    {latestAssessment.overallScore !== null && (
                                                        <span className="text-white font-semibold">
                                                            {latestAssessment.overallScore}
                                                        </span>
                                                    )}
                                                    <span className={`px-2 py-1 rounded text-xs font-medium bg-${getMaturityColor(latestAssessment.maturityLevel)}-500/20 text-${getMaturityColor(latestAssessment.maturityLevel)}-400 border border-${getMaturityColor(latestAssessment.maturityLevel)}-500/30`}>
                                                        {getMaturityLabel(latestAssessment.maturityLevel)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">Sin evaluaciones</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {latestAssessment && (
                                                <button
                                                    onClick={() => router.push(`/assessment/results/${latestAssessment.id}`)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Ver Resultados
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
