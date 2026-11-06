'use client';

import React, { useState } from 'react';
import {
    Search, Filter, Eye, FileText, RotateCw, Star, Trash2,
    Share2, Copy, Clock, AlertTriangle, CheckCircle, Loader
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ScanHistoryItem {
    id: string;
    target: string;
    tool: string;
    status: 'running' | 'completed' | 'failed' | 'cancelled';
    timestamp: Date;
    findings: {
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
    duration?: number;
}

interface ScanHistorySidebarProps {
    scans: ScanHistoryItem[];
    onViewDetails: (id: string) => void;
    onAnalyzeWithAI: (id: string) => void;
    onGenerateReport: (id: string) => void;
    onRescan: (id: string) => void;
    onCopyConfig: (id: string) => void;
    onToggleFavorite: (id: string) => void;
    onDelete: (id: string) => void;
    onShare: (id: string) => void;
}

export function ScanHistorySidebar({
    scans,
    onViewDetails,
    onAnalyzeWithAI,
    onGenerateReport,
    onRescan,
    onCopyConfig,
    onToggleFavorite,
    onDelete,
    onShare
}: ScanHistorySidebarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterSeverity, setFilterSeverity] = useState<string>('all');

    const filteredScans = scans.filter(scan => {
        // Search filter
        if (searchQuery && !scan.target.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        // Status filter
        if (filterStatus !== 'all' && scan.status !== filterStatus) {
            return false;
        }

        // Severity filter
        if (filterSeverity !== 'all') {
            if (filterSeverity === 'critical' && scan.findings.critical === 0) return false;
            if (filterSeverity === 'high' && scan.findings.high === 0) return false;
        }

        return true;
    });

    const getStatusBadge = (status: string) => {
        const badges = {
            running: { icon: Loader, text: 'En Progreso', class: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
            completed: { icon: CheckCircle, text: 'Completado', class: 'bg-green-500/20 text-green-400 border-green-500/30' },
            failed: { icon: AlertTriangle, text: 'Error', class: 'bg-red-500/20 text-red-400 border-red-500/30' },
            cancelled: { icon: AlertTriangle, text: 'Cancelado', class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' }
        };

        const badge = badges[status as keyof typeof badges] || badges.completed;
        const Icon = badge.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${badge.class}`}>
                <Icon className="w-3 h-3" />
                {badge.text}
            </span>
        );
    };

    const getSeverityIndicator = (findings: ScanHistoryItem['findings']) => {
        if (findings.critical > 0) {
            return <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />;
        }
        if (findings.high > 0) {
            return <div className="w-2 h-2 rounded-full bg-orange-500" />;
        }
        if (findings.medium > 0) {
            return <div className="w-2 h-2 rounded-full bg-yellow-500" />;
        }
        return <div className="w-2 h-2 rounded-full bg-green-500" />;
    };

    return (
        <div className="h-full flex flex-col">

            {/* Header */}
            <div className="p-4 border-b border-slate-800">
                <h3 className="text-lg font-bold mb-3">Historial de Escaneos</h3>

                {/* Search */}
                <div className="relative mb-3">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar objetivo..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:border-cyan-500 outline-none"
                    />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 gap-2">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:border-cyan-500 outline-none"
                    >
                        <option value="all">Todos</option>
                        <option value="running">En progreso</option>
                        <option value="completed">Completados</option>
                        <option value="failed">Con errores</option>
                    </select>

                    <select
                        value={filterSeverity}
                        onChange={(e) => setFilterSeverity(e.target.value)}
                        className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm focus:border-cyan-500 outline-none"
                    >
                        <option value="all">Todas</option>
                        <option value="critical">Críticas</option>
                        <option value="high">Altas</option>
                    </select>
                </div>
            </div>

            {/* Scan List */}
            <div className="flex-1 overflow-y-auto">
                {filteredScans.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>No hay escaneos</p>
                    </div>
                ) : (
                    <div className="p-2 space-y-2">
                        {filteredScans.map(scan => (
                            <div
                                key={scan.id}
                                className="p-3 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition group"
                            >

                                {/* Header */}
                                <div className="flex items-start gap-2 mb-2">
                                    {getSeverityIndicator(scan.findings)}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm truncate">{scan.target}</div>
                                        <div className="text-xs text-slate-400">
                                            {formatDistanceToNow(new Date(scan.timestamp), { addSuffix: true, locale: es })}
                                        </div>
                                    </div>
                                    {getStatusBadge(scan.status)}
                                </div>

                                {/* Tool & Duration */}
                                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                                    <span className="px-2 py-0.5 bg-slate-800 rounded">{scan.tool.toUpperCase()}</span>
                                    {scan.duration && (
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {scan.duration}s
                                        </span>
                                    )}
                                </div>

                                {/* Findings Counter */}
                                {scan.status === 'completed' && (
                                    <div className="flex items-center gap-2 text-xs mb-3">
                                        {scan.findings.critical > 0 && (
                                            <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded font-medium">
                                                {scan.findings.critical} Críticas
                                            </span>
                                        )}
                                        {scan.findings.high > 0 && (
                                            <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded font-medium">
                                                {scan.findings.high} Altas
                                            </span>
                                        )}
                                        {scan.findings.medium > 0 && (
                                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded font-medium">
                                                {scan.findings.medium} Medias
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Quick Actions */}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                    <button
                                        onClick={() => onViewDetails(scan.id)}
                                        className="p-1.5 hover:bg-slate-800 rounded transition"
                                        title="Ver detalles"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onGenerateReport(scan.id)}
                                        className="p-1.5 hover:bg-slate-800 rounded transition"
                                        title="Generar reporte"
                                    >
                                        <FileText className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onRescan(scan.id)}
                                        className="p-1.5 hover:bg-slate-800 rounded transition"
                                        title="Reescanear"
                                    >
                                        <RotateCw className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onCopyConfig(scan.id)}
                                        className="p-1.5 hover:bg-slate-800 rounded transition"
                                        title="Copiar configuración"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onToggleFavorite(scan.id)}
                                        className="p-1.5 hover:bg-slate-800 rounded transition"
                                        title="Marcar favorito"
                                    >
                                        <Star className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onShare(scan.id)}
                                        className="p-1.5 hover:bg-slate-800 rounded transition"
                                        title="Compartir"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(scan.id)}
                                        className="p-1.5 hover:bg-red-900/50 rounded transition text-red-400"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}
