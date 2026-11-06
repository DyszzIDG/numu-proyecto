'use client';

import React, { useState } from 'react';
import { Calendar, Filter, Search, ChevronDown } from 'lucide-react';

interface ScanTimelineItem {
    id: string;
    timestamp: Date;
    tool: string;
    target: string;
    status: 'success' | 'failed' | 'running';
    findings: number;
    duration: number;
}

interface ScanTimelineProps {
    scans: ScanTimelineItem[];
}

export function ScanTimeline({ scans }: ScanTimelineProps) {
    const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('week');
    const [toolFilter, setToolFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredScans = scans.filter(scan => {
        // Date filter
        const now = new Date();
        const scanDate = new Date(scan.timestamp);
        if (dateRange === 'today') {
            if (scanDate.toDateString() !== now.toDateString()) return false;
        } else if (dateRange === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (scanDate < weekAgo) return false;
        } else if (dateRange === 'month') {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (scanDate < monthAgo) return false;
        }

        // Tool filter
        if (toolFilter !== 'all' && scan.tool !== toolFilter) return false;

        // Status filter
        if (statusFilter !== 'all' && scan.status !== statusFilter) return false;

        // Search filter
        if (searchQuery && !scan.target.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        return true;
    });

    // Group by date
    const groupedScans = filteredScans.reduce((acc, scan) => {
        const date = new Date(scan.timestamp).toLocaleDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(scan);
        return acc;
    }, {} as Record<string, ScanTimelineItem[]>);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success': return 'bg-green-500';
            case 'failed': return 'bg-red-500';
            case 'running': return 'bg-yellow-500';
            default: return 'bg-slate-500';
        }
    };

    const getToolIcon = (tool: string) => {
        const icons: Record<string, string> = {
            nmap: '🗺️',
            nikto: '🕷️',
            nuclei: '⚛️',
            wpscan: '🔌',
            sqlmap: '💉'
        };
        return icons[tool] || '🔧';
    };

    return (
        <div className="space-y-6">

            {/* Filters */}
            <div className="flex flex-wrap gap-4">

                {/* Date Range */}
                <div className="relative">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value as any)}
                        className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg pr-10 appearance-none focus:border-cyan-500 outline-none"
                    >
                        <option value="today">Today</option>
                        <option value="week">Last 7 days</option>
                        <option value="month">Last 30 days</option>
                        <option value="all">All time</option>
                    </select>
                    <Calendar className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* Tool Filter */}
                <div className="relative">
                    <select
                        value={toolFilter}
                        onChange={(e) => setToolFilter(e.target.value)}
                        className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg pr-10 appearance-none focus:border-cyan-500 outline-none"
                    >
                        <option value="all">All Tools</option>
                        <option value="nmap">Nmap</option>
                        <option value="nikto">Nikto</option>
                        <option value="nuclei">Nuclei</option>
                        <option value="wpscan">WPScan</option>
                    </select>
                    <Filter className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* Status Filter */}
                <div className="relative">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg pr-10 appearance-none focus:border-cyan-500 outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="success">Success</option>
                        <option value="failed">Failed</option>
                        <option value="running">Running</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* Search */}
                <div className="flex-1 min-w-[200px] relative">
                    <input
                        type="text"
                        placeholder="Search targets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 pl-10 bg-slate-900 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none"
                    />
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>

            </div>

            {/* Timeline */}
            <div className="space-y-6">
                {Object.entries(groupedScans).map(([date, scans]) => (
                    <div key={date}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="text-sm font-bold text-slate-400">{date}</div>
                            <div className="flex-1 h-px bg-slate-800" />
                            <div className="text-xs text-slate-500">{scans.length} scans</div>
                        </div>

                        <div className="space-y-3">
                            {scans.map(scan => (
                                <div
                                    key={scan.id}
                                    className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition"
                                >
                                    {/* Timeline Dot */}
                                    <div className="flex flex-col items-center">
                                        <div className={`w-3 h-3 rounded-full ${getStatusColor(scan.status)}`} />
                                        <div className="w-px h-full bg-slate-800 mt-2" />
                                    </div>

                                    {/* Time */}
                                    <div className="text-sm text-slate-400 w-16">
                                        {new Date(scan.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>

                                    {/* Tool Icon */}
                                    <div className="text-2xl">{getToolIcon(scan.tool)}</div>

                                    {/* Details */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold">{scan.tool.toUpperCase()}</span>
                                            <span className="text-slate-400">→</span>
                                            <span className="font-mono text-sm text-slate-300">{scan.target}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-400">
                                            <span>{scan.duration}s</span>
                                            <span>•</span>
                                            <span>{scan.findings} findings</span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${scan.status === 'success' ? 'bg-green-500/20 text-green-400' :
                                            scan.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {scan.status}
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {filteredScans.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        No scans found matching your filters
                    </div>
                )}
            </div>

        </div>
    );
}
