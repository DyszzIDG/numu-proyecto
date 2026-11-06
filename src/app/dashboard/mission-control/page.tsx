'use client';

import React, { useState } from 'react';
import { Shield, LayoutDashboard, Puzzle, FileText, Zap } from 'lucide-react';
import { ScanConfigPanel } from '@/components/scan/ScanConfigPanel';
import { AnalyticsDashboard } from '@/components/dashboard/AnalyticsDashboard';
import { IntegrationPanel } from '@/components/integrations/IntegrationPanel';
import { AIChat } from '@/components/ai/AIChat';
import { ScanScheduler } from '@/components/automation/ScanScheduler';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';

export default function MissionControlPage() {
    const [activeTab, setActiveTab] = useState<'operations' | 'analytics' | 'integrations'>('operations');

    // MOCK DATA FOR DEMO
    const stats = {
        scansToday: 12,
        criticalVulns: 5,
        avgScanTime: 45,
        successRate: 98,
        totalTargets: 156,
        pendingScans: 3
    };

    const mockScans: any[] = [
        { id: '1', target: 'api.production.com', tool: 'nmap', status: 'completed', timestamp: new Date(), findings: { critical: 2, high: 5, medium: 12, low: 8 }, duration: 120 },
        { id: '2', target: 'dev-db.internal', tool: 'nuclei', status: 'running', timestamp: new Date(Date.now() - 1000 * 60 * 5), findings: { critical: 0, high: 0, medium: 0, low: 0 } },
        { id: '3', target: 'legacy-app.corp', tool: 'full-scan', status: 'failed', timestamp: new Date(Date.now() - 1000 * 60 * 60), findings: { critical: 0, high: 0, medium: 0, low: 0 } },
        { id: '4', target: 'auth-service', tool: 'zap', status: 'completed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), findings: { critical: 1, high: 3, medium: 5, low: 2 }, duration: 340 },
        { id: '5', target: 'landing-page', tool: 'http', status: 'completed', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), findings: { critical: 0, high: 0, medium: 2, low: 0 }, duration: 45 }
    ];

    const analyticsData = {
        history: [
            { date: '01/01', critical: 4, high: 10, medium: 15 },
            { date: '05/01', critical: 6, high: 12, medium: 18 },
            { date: '10/01', critical: 3, high: 8, medium: 20 },
            { date: '15/01', critical: 8, high: 15, medium: 25 },
            { date: '20/01', critical: 5, high: 11, medium: 22 },
            { date: '25/01', critical: 2, high: 9, medium: 18 },
        ],
        severityDistribution: [
            { name: 'Críticas', value: 15 },
            { name: 'Altas', value: 45 },
            { name: 'Medias', value: 80 },
            { name: 'Bajas', value: 120 },
            { name: 'Info', value: 200 }
        ],
        topVulns: [
            { name: 'Apache Log4j', count: 45 },
            { name: 'XSS Reflected', count: 32 },
            { name: 'Weak SSL/TLS', count: 28 },
            { name: 'SQL Injection', count: 15 },
            { name: 'Open Relay', count: 10 }
        ],
        remediationStats: { fixed: 145, pending: 42, regressed: 12 }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">

            {/* Top Navigation Bar */}
            <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-30">
                <div className="flex items-center justify-between px-6 py-4">

                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-tr from-cyan-600 to-blue-600 p-2 rounded-lg">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">Mission Control</h1>
                            <p className="text-xs text-slate-400">Cybersecurity Operations Center</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">

                        {/* Main Tabs */}
                        <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-lg">
                            <button
                                onClick={() => setActiveTab('operations')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'operations' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                <Zap className="w-4 h-4" />
                                Operaciones
                            </button>
                            <button
                                onClick={() => setActiveTab('analytics')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'analytics' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Analíticas
                            </button>
                            <button
                                onClick={() => setActiveTab('integrations')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'integrations' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                <Puzzle className="w-4 h-4" />
                                Integraciones
                            </button>
                        </div>

                        <NotificationCenter />

                        {/* User Profile Placeholder */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-slate-800" />

                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="relative">

                {activeTab === 'operations' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ScanConfigPanel
                            stats={stats}
                            scans={mockScans}
                            onSubmitScan={(config) => console.log("Scan started:", config)}
                            onViewDetails={(id) => console.log("View details:", id)}
                            onAnalyzeWithAI={(id) => console.log("Analyze:", id)}
                            onGenerateReport={(id) => console.log("Report:", id)}
                            onRescan={(id) => console.log("Rescan:", id)}
                            onCopyConfig={(id) => console.log("Copy config:", id)}
                            onToggleFavorite={(id) => console.log("Favorite:", id)}
                            onDelete={(id) => console.log("Delete:", id)}
                            onShare={(id) => console.log("Share:", id)}
                        />

                        {/* Scheduler Section (Below Operations) */}
                        <div className="p-6 border-t border-slate-800">
                            <div className="max-w-4xl mx-auto">
                                <ScanScheduler />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="p-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl font-bold mb-6">Analíticas Globales</h2>
                        <AnalyticsDashboard data={analyticsData} />
                    </div>
                )}

                {activeTab === 'integrations' && (
                    <div className="p-6 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <IntegrationPanel />
                    </div>
                )}

            </div>

            {/* Floating AI Assistant */}
            <AIChat />

        </div>
    );
}
