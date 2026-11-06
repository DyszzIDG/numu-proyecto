'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Briefcase, Clock, CheckCircle, AlertCircle, LogOut, FileText, Plus } from 'lucide-react';
import { getEmployeeSession, clearEmployeeSession } from '@/lib/auth/session';
import Link from 'next/link';

interface Case {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    type: string;
    createdAt: string;
    company: {
        name: string;
        industry: string;
    };
}

export default function EmployeeDashboardPage() {
    const router = useRouter();
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [cases, setCases] = useState<Case[]>([]);
    const [stats, setStats] = useState({
        assigned: 0,
        inProgress: 0,
        completed: 0
    });

    useEffect(() => {
        const employeeSession = getEmployeeSession();
        if (!employeeSession) {
            router.push('/portal/login');
            return;
        }
        setSession(employeeSession);
        fetchCases(employeeSession.id);
    }, []);

    const fetchCases = async (employeeId: string) => {
        try {
            const response = await fetch(`/api/portal/cases?employeeId=${employeeId}`);
            const data = await response.json();

            if (data.success) {
                setCases(data.cases);

                // Calculate stats
                const assigned = data.cases.length;
                const inProgress = data.cases.filter((c: Case) => c.status === 'in_progress').length;
                const completed = data.cases.filter((c: Case) => c.status === 'resolved' || c.status === 'closed').length;

                setStats({ assigned, inProgress, completed });
            }
        } catch (error) {
            console.error('Error fetching cases:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        clearEmployeeSession();
        router.push('/portal/login');
    };

    const getRoleBadgeColor = (role: string) => {
        const colors: Record<string, string> = {
            admin: 'purple',
            hr: 'cyan',
            analyst: 'green',
            viewer: 'gray'
        };
        return colors[role] || 'gray';
    };

    const getRoleLabel = (role: string) => {
        const labels: Record<string, string> = {
            admin: 'Administrador',
            hr: 'Recursos Humanos',
            analyst: 'Analista',
            viewer: 'Visualizador'
        };
        return labels[role] || role;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-blue-500/20 text-blue-300';
            case 'in_progress': return 'bg-yellow-500/20 text-yellow-300';
            case 'resolved': return 'bg-green-500/20 text-green-300';
            case 'closed': return 'bg-gray-500/20 text-gray-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'open': return 'Abierto';
            case 'in_progress': return 'En Progreso';
            case 'resolved': return 'Resuelto';
            case 'closed': return 'Cerrado';
            default: return status;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'text-red-400';
            case 'high': return 'text-orange-400';
            case 'medium': return 'text-yellow-400';
            case 'low': return 'text-blue-400';
            default: return 'text-gray-400';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <p className="text-gray-400">Cargando...</p>
            </div>
        );
    }

    const roleColor = getRoleBadgeColor(session?.role);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Shield className="w-10 h-10 text-cyan-400" />
                            <div>
                                <h1 className="text-3xl font-bold text-white">Portal de Empleados</h1>
                                <p className="text-gray-400">NUMU Group</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>

                {/* Welcome Card */}
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl p-8 mb-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                ¡Bienvenido, {session?.firstName} {session?.lastName}!
                            </h2>
                            <p className="text-gray-300 mb-4">
                                Estás conectado como {getRoleLabel(session?.role)}
                            </p>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-${roleColor}-500/20 border border-${roleColor}-500/30`}>
                                <Briefcase className={`w-5 h-5 text-${roleColor}-400`} />
                                <span className={`text-${roleColor}-400 font-semibold`}>
                                    {getRoleLabel(session?.role)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                            <Briefcase className="w-6 h-6 text-cyan-400" />
                            <span className="text-sm text-gray-400">Casos Asignados</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.assigned}</p>
                    </div>

                    <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-6 h-6 text-yellow-400" />
                            <span className="text-sm text-gray-400">En Progreso</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.inProgress}</p>
                    </div>

                    <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10">
                        <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                            <span className="text-sm text-gray-400">Completados</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.completed}</p>
                    </div>
                </div>

                {/* Cases List */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-white">Mis Casos</h3>
                        <Link
                            href="/portal/casos"
                            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors"
                        >
                            Ver Todos
                        </Link>
                    </div>

                    {cases.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">No tienes casos asignados</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cases.slice(0, 5).map((caseItem) => (
                                <Link
                                    key={caseItem.id}
                                    href={`/portal/casos/${caseItem.id}`}
                                    className="block p-4 bg-black/30 rounded-lg border border-white/10 hover:bg-white/5 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <h4 className="text-white font-semibold mb-1">{caseItem.title}</h4>
                                            <p className="text-gray-400 text-sm mb-2 line-clamp-1">{caseItem.description}</p>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-gray-500">{caseItem.company.name}</span>
                                                <span className="text-gray-600">•</span>
                                                <span className={getPriorityColor(caseItem.priority)}>
                                                    {caseItem.priority.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded text-sm ${getStatusColor(caseItem.status)}`}>
                                            {getStatusLabel(caseItem.status)}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                {session?.role === 'admin' && (
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8">
                        <h3 className="text-xl font-bold text-white mb-4">Acciones Rápidas (Admin)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => router.push('/portal/rrhh')}
                                className="p-4 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-left transition-colors"
                            >
                                <p className="text-cyan-400 font-semibold mb-1">Dashboard de RRHH</p>
                                <p className="text-sm text-gray-400">Ver empresas y crear casos</p>
                            </button>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="p-4 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-left transition-colors"
                            >
                                <p className="text-purple-400 font-semibold mb-1">Dashboard Principal</p>
                                <p className="text-sm text-gray-400">Ver servicios de NUMU</p>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
