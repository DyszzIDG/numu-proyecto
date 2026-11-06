'use client';

/**
 * Tools Results Dashboard Component
 * Displays security tool execution results organized by category
 */

import { useEffect, useState } from 'react';
import { Shield, TrendingUp, Clock, CheckCircle, XCircle, Activity, Loader2 } from 'lucide-react';
import ScanDetailsModal from '@/components/results/ScanDetailsModal';

interface CategoryData {
    category: string;
    toolCount: number;
    totalExecutions: number;
    successfulExecutions: number;
    failedExecutions: number;
    successRate: number;
    avgDuration: number;
    recentExecution: {
        id: string;
        toolName: string;
        target: string;
        status: string;
        startedAt: string;
        duration: number | null;
    } | null;
}

interface SummaryData {
    totalScans: number;
    totalSuccessful: number;
    totalFailed: number;
    overallSuccessRate: number;
    mostUsedTools: Array<{ tool: string; count: number }>;
    dateRange: {
        from: string;
        to: string;
        days: number;
    };
}

interface RecentExecution {
    id: string;
    toolName: string;
    target: string;
    status: string;
    startedAt: string;
    completedAt: string | null;
    duration: number | null;
    generatedBy: string;
}

interface ToolsResultsData {
    categories: CategoryData[];
    summary: SummaryData;
    recentExecutions: RecentExecution[];
}

export default function ToolsResultsDashboard() {
    const [data, setData] = useState<ToolsResultsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [daysFilter, setDaysFilter] = useState(30);
    const [selectedExecutionId, setSelectedExecutionId] = useState<string | null>(null);

    useEffect(() => {
        fetchResults();
    }, [daysFilter]);

    const fetchResults = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/tools/results?days=${daysFilter}`);
            if (!response.ok) {
                throw new Error('Failed to fetch results');
            }
            const results = await response.json();
            console.log('📊 Tools Results Data:', {
                totalScans: results.summary?.totalScans,
                recentExecutionsCount: results.recentExecutions?.length,
                recentExecutions: results.recentExecutions
            });
            setData(results);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/30">
                <p className="text-red-400">Error: {error}</p>
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Header with Filter */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Resultados de Herramientas</h1>
                    <p className="text-gray-400">
                        Resumen de ejecuciones de herramientas de seguridad por categoría
                    </p>
                </div>
                <select
                    value={daysFilter}
                    onChange={(e) => setDaysFilter(parseInt(e.target.value))}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                    <option value={7}>Últimos 7 días</option>
                    <option value={30}>Últimos 30 días</option>
                    <option value={90}>Últimos 90 días</option>
                </select>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    title="Total de Escaneos"
                    value={data.summary.totalScans}
                    icon={Activity}
                    color="blue"
                />
                <StatCard
                    title="Exitosos"
                    value={data.summary.totalSuccessful}
                    icon={CheckCircle}
                    color="green"
                />
                <StatCard
                    title="Fallidos"
                    value={data.summary.totalFailed}
                    icon={XCircle}
                    color="red"
                />
                <StatCard
                    title="Tasa de Éxito"
                    value={`${data.summary.overallSuccessRate}%`}
                    icon={TrendingUp}
                    color="purple"
                />
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.categories.map((category) => (
                    <CategoryCard key={category.category} category={category} />
                ))}
            </div>

            {/* Recent Executions */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    Ejecuciones Recientes
                </h2>
                <div className="space-y-3">
                    {data.recentExecutions.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">
                            No hay ejecuciones recientes en este período
                        </p>
                    ) : (
                        data.recentExecutions.map((execution) => (
                            <ExecutionRow
                                key={execution.id}
                                execution={execution}
                                onClick={() => setSelectedExecutionId(execution.id)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Most Used Tools */}
            {data.summary.mostUsedTools.length > 0 && (
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">
                        Herramientas Más Utilizadas
                    </h2>
                    <div className="space-y-3">
                        {data.summary.mostUsedTools.map((tool, index) => (
                            <div
                                key={tool.tool}
                                className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-bold text-purple-400">
                                        #{index + 1}
                                    </span>
                                    <span className="text-white font-medium">{tool.tool}</span>
                                </div>
                                <span className="text-gray-400">{tool.count} ejecuciones</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Scan Details Modal */}
            {selectedExecutionId && (
                <ScanDetailsModal
                    executionId={selectedExecutionId}
                    onClose={() => setSelectedExecutionId(null)}
                />
            )}
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }: any) {
    const colorClasses: Record<string, string> = {
        blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        green: 'bg-green-500/10 text-green-400 border-green-500/20',
        red: 'bg-red-500/10 text-red-400 border-red-500/20',
        purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    };

    return (
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all backdrop-blur-sm">
            <div className="flex items-start justify-between mb-2">
                <p className="text-gray-400 text-sm font-medium">{title}</p>
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="w-4 h-4" />
                </div>
            </div>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
    );
}

function CategoryCard({ category }: { category: CategoryData }) {
    const hasExecutions = category.totalExecutions > 0;

    return (
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all backdrop-blur-sm">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-white font-semibold">{category.category}</h3>
                </div>
                <span className="text-sm text-gray-400">
                    {category.toolCount} {category.toolCount === 1 ? 'tool' : 'tools'}
                </span>
            </div>

            {hasExecutions ? (
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Ejecuciones</span>
                        <span className="text-white font-mono">{category.totalExecutions}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Tasa de Éxito</span>
                        <span
                            className={`font-mono ${category.successRate >= 80
                                ? 'text-green-400'
                                : category.successRate >= 50
                                    ? 'text-yellow-400'
                                    : 'text-red-400'
                                }`}
                        >
                            {category.successRate}%
                        </span>
                    </div>
                    {category.avgDuration > 0 && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Duración Promedio</span>
                            <span className="text-white font-mono flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {category.avgDuration}s
                            </span>
                        </div>
                    )}
                    {category.recentExecution && (
                        <div className="pt-3 border-t border-white/10">
                            <p className="text-xs text-gray-500 mb-1">Última ejecución:</p>
                            <p className="text-sm text-white font-medium">
                                {category.recentExecution.toolName}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                                {category.recentExecution.target}
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-4">
                    <p className="text-sm text-gray-500">Sin ejecuciones recientes</p>
                </div>
            )}
        </div>
    );
}

function ExecutionRow({ execution, onClick }: { execution: RecentExecution; onClick?: () => void }) {
    const statusColors = {
        completed: 'bg-green-500/20 text-green-300 border-green-500/30',
        failed: 'bg-red-500/20 text-red-300 border-red-500/30',
        running: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    };

    const statusColor =
        statusColors[execution.status as keyof typeof statusColors] || statusColors.pending;

    return (
        <div
            onClick={onClick}
            className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
            <div className="flex items-center gap-4 flex-1">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-white text-sm">{execution.toolName}</p>
                        {execution.generatedBy === 'ai' && (
                            <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                AI
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 truncate max-w-md">{execution.target}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500">
                        {new Date(execution.startedAt).toLocaleString('es-ES', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </p>
                    {execution.duration && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                            <Clock className="w-3 h-3" />
                            {execution.duration}s
                        </p>
                    )}
                </div>
            </div>
            <span className={`text-xs px-3 py-1 rounded border ${statusColor} ml-4`}>
                {execution.status}
            </span>
        </div>
    );
}
