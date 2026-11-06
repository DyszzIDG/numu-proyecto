'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Filter, Search, Plus, ArrowLeft } from 'lucide-react';
import { getEmployeeSession } from '@/lib/auth/session';
import Link from 'next/link';

interface Case {
    id: string;
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

export default function CasosPage() {
    const router = useRouter();
    const [session, setSession] = useState<any>(null);
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

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
            }
        } catch (error) {
            console.error('Error fetching cases:', error);
        } finally {
            setLoading(false);
        }
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
            case 'critical': return 'text-red-400 border-red-500/50';
            case 'high': return 'text-orange-400 border-orange-500/50';
            case 'medium': return 'text-yellow-400 border-yellow-500/50';
            case 'low': return 'text-blue-400 border-blue-500/50';
            default: return 'text-gray-400 border-gray-500/50';
        }
    };

    const filteredCases = cases.filter(c => {
        const matchesFilter = filter === 'all' || c.status === filter;
        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.company.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

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
                    <Link
                        href="/portal/dashboard"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Mis Casos</h1>
                    <p className="text-gray-400">Gestiona todos tus casos asignados</p>
                </div>

                {/* Filters */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar casos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'all'
                                        ? 'bg-cyan-500 text-white'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                Todos
                            </button>
                            <button
                                onClick={() => setFilter('open')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'open'
                                        ? 'bg-cyan-500 text-white'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                Abiertos
                            </button>
                            <button
                                onClick={() => setFilter('in_progress')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'in_progress'
                                        ? 'bg-cyan-500 text-white'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                En Progreso
                            </button>
                            <button
                                onClick={() => setFilter('resolved')}
                                className={`px-4 py-2 rounded-lg transition-colors ${filter === 'resolved'
                                        ? 'bg-cyan-500 text-white'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                Resueltos
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cases List */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    {filteredCases.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">No se encontraron casos</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredCases.map((caseItem) => (
                                <Link
                                    key={caseItem.id}
                                    href={`/portal/casos/${caseItem.id}`}
                                    className="block p-5 bg-black/30 rounded-lg border border-white/10 hover:bg-white/5 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-white font-semibold text-lg">{caseItem.title}</h3>
                                                <span className={`px-2 py-1 rounded text-xs font-semibold border ${getPriorityColor(caseItem.priority)}`}>
                                                    {caseItem.priority.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{caseItem.description}</p>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span>{caseItem.company.name}</span>
                                                <span>•</span>
                                                <span>{caseItem.company.industry}</span>
                                                <span>•</span>
                                                <span>{new Date(caseItem.createdAt).toLocaleDateString()}</span>
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
            </div>
        </div>
    );
}
