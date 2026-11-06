'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Users, FileText, Building, Plus, TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { getEmployeeSession } from '@/lib/auth/session';
import Link from 'next/link';

export default function RRHHDashboardPage() {
    const router = useRouter();
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCases: 0,
        openCases: 0,
        inProgress: 0,
        resolved: 0
    });

    useEffect(() => {
        const employeeSession = getEmployeeSession();
        if (!employeeSession) {
            router.push('/portal/login');
            return;
        }

        // Check if user has HR or admin role
        if (employeeSession.role !== 'hr' && employeeSession.role !== 'admin') {
            router.push('/portal/dashboard');
            return;
        }

        setSession(employeeSession);
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // In a real implementation, this would fetch all cases, not just assigned ones
            // For now, we'll use mock data
            setStats({
                totalCases: 45,
                openCases: 12,
                inProgress: 18,
                resolved: 15
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <p className="text-gray-400">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Shield className="w-10 h-10 text-cyan-400" />
                            <div>
                                <h1 className="text-3xl font-bold text-white">Dashboard de RRHH</h1>
                                <p className="text-gray-400">Gestión de casos y empleados</p>
                            </div>
                        </div>
                        <Link
                            href="/portal/dashboard"
                            className="px-4 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 rounded-lg transition-colors"
                        >
                            Volver al Portal
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <FileText className="w-6 h-6 text-blue-400" />
                            <span className="text-sm text-gray-400">Total Casos</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.totalCases}</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                            <span className="text-sm text-gray-400">Abiertos</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.openCases}</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-6 h-6 text-yellow-400" />
                            <span className="text-sm text-gray-400">En Progreso</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.inProgress}</p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                            <span className="text-sm text-gray-400">Resueltos</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{stats.resolved}</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Link
                        href="/portal/rrhh/casos/nuevo"
                        className="p-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-xl hover:from-cyan-500/30 hover:to-blue-500/30 transition-all"
                    >
                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-3 bg-cyan-500/20 rounded-lg">
                                <Plus className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg">Crear Caso</h3>
                                <p className="text-gray-400 text-sm">Nuevo caso para empresa</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/companies"
                        className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all"
                    >
                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-3 bg-purple-500/20 rounded-lg">
                                <Building className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg">Ver Empresas</h3>
                                <p className="text-gray-400 text-sm">Gestionar empresas</p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        href="/portal/rrhh/empleados"
                        className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl hover:from-green-500/30 hover:to-emerald-500/30 transition-all"
                    >
                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-3 bg-green-500/20 rounded-lg">
                                <Users className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-lg">Empleados</h3>
                                <p className="text-gray-400 text-sm">Gestionar equipo</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Actividad Reciente</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="text-white font-semibold mb-1">Nuevo caso creado</h4>
                                    <p className="text-gray-400 text-sm">Caso #2024-045 asignado a Juan Pérez</p>
                                    <p className="text-gray-500 text-xs mt-1">Hace 2 horas</p>
                                </div>
                                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded text-sm">
                                    Nuevo
                                </span>
                            </div>
                        </div>

                        <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="text-white font-semibold mb-1">Caso resuelto</h4>
                                    <p className="text-gray-400 text-sm">Caso #2024-042 marcado como resuelto</p>
                                    <p className="text-gray-500 text-xs mt-1">Hace 5 horas</p>
                                </div>
                                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded text-sm">
                                    Resuelto
                                </span>
                            </div>
                        </div>

                        <div className="p-4 bg-black/30 rounded-lg border border-white/10">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h4 className="text-white font-semibold mb-1">Nuevo empleado</h4>
                                    <p className="text-gray-400 text-sm">Ana Torres agregada al equipo de Seguridad</p>
                                    <p className="text-gray-500 text-xs mt-1">Hace 1 día</p>
                                </div>
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded text-sm">
                                    Empleado
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
