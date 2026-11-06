'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, TrendingUp, AlertTriangle, Users, Eye, Plus } from 'lucide-react';
import { getEmployeeSession } from '@/lib/auth/session';
import CreateCaseModal from '@/components/portal/CreateCaseModal';

interface Company {
    id: string;
    name: string;
    industry: string;
    assessments: Array<{
        id: string;
        overallScore: number | null;
        maturityLevel: string | null;
        status: string;
    }>;
}

export default function HRDashboardPage() {
    const router = useRouter();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

    useEffect(() => {
        const employeeSession = getEmployeeSession();
        if (!employeeSession) {
            router.push('/portal/login');
            return;
        }
        setSession(employeeSession);
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
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCase = (company: Company) => {
        setSelectedCompany(company);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedCompany(null);
    };

    const handleCaseCreated = () => {
        // Refresh companies or show success message
        fetchCompanies();
    };

    const getScoreColor = (score: number | null) => {
        if (!score) return 'gray';
        if (score >= 75) return 'green';
        if (score >= 50) return 'yellow';
        if (score >= 25) return 'orange';
        return 'red';
    };

    if (loading) {
        return <div className="p-8">Cargando...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard de RRHH</h1>
                    <p className="text-gray-400">
                        Bienvenido, {session?.firstName} {session?.lastName}
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/30">
                        <div className="flex items-center gap-3 mb-2">
                            <Building2 className="w-6 h-6 text-cyan-400" />
                            <span className="text-sm text-gray-400">Empresas Totales</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{companies.length}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-6 h-6 text-green-400" />
                            <span className="text-sm text-gray-400">Evaluadas</span>
                        </div>
                        <p className="text-2xl font-bold text-white">
                            {companies.filter(c => c.assessments.some(a => a.status === 'completed')).length}
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle className="w-6 h-6 text-yellow-400" />
                            <span className="text-sm text-gray-400">Score Bajo (&lt;50)</span>
                        </div>
                        <p className="text-2xl font-bold text-white">
                            {companies.filter(c =>
                                c.assessments.some(a => a.overallScore !== null && a.overallScore < 50)
                            ).length}
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30">
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="w-6 h-6 text-purple-400" />
                            <span className="text-sm text-gray-400">Casos Activos</span>
                        </div>
                        <p className="text-2xl font-bold text-white">0</p>
                    </div>
                </div>

                {/* Companies Table */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-700">
                        <h2 className="text-xl font-bold text-white">Empresas Registradas</h2>
                    </div>

                    <table className="w-full">
                        <thead className="bg-black/40">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Empresa</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Industria</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Evaluaciones</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Último Score</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {companies.map((company) => {
                                const latestAssessment = company.assessments[0];
                                const score = latestAssessment?.overallScore;

                                return (
                                    <tr key={company.id} className="hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-white font-medium">{company.name}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-300">{company.industry}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white">{company.assessments.length}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {score !== null ? (
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold bg-${getScoreColor(score)}-500/20 text-${getScoreColor(score)}-400 border border-${getScoreColor(score)}-500/30`}>
                                                    {score}/100
                                                </span>
                                            ) : (
                                                <span className="text-gray-500">Sin evaluar</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {latestAssessment && (
                                                    <button
                                                        onClick={() => router.push(`/assessment/results/${latestAssessment.id}`)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        Ver Resultados
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleCreateCase(company)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Crear Caso
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Case Modal */}
            {selectedCompany && (
                <CreateCaseModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    company={selectedCompany}
                    onSuccess={handleCaseCreated}
                />
            )}
        </div>
    );
}
