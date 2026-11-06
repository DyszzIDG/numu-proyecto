'use client';

import React, { useState } from 'react';
import { Zap, Settings } from 'lucide-react';
import { QuickStatsHeader } from '../dashboard/QuickStatsHeader';
import { SimpleModeForm } from './SimpleModeForm';
import { AdvancedModeForm } from './AdvancedModeForm';
import { ScanHistorySidebar } from './ScanHistorySidebar';

interface ScanConfigPanelProps {
    stats: any;
    scans: any[];
    onSubmitScan: (config: any) => void;
    onViewDetails: (id: string) => void;
    onAnalyzeWithAI: (id: string) => void;
    onGenerateReport: (id: string) => void;
    onRescan: (id: string) => void;
    onCopyConfig: (id: string) => void;
    onToggleFavorite: (id: string) => void;
    onDelete: (id: string) => void;
    onShare: (id: string) => void;
}

export function ScanConfigPanel({
    stats,
    scans,
    onSubmitScan,
    onViewDetails,
    onAnalyzeWithAI,
    onGenerateReport,
    onRescan,
    onCopyConfig,
    onToggleFavorite,
    onDelete,
    onShare
}: ScanConfigPanelProps) {
    const [mode, setMode] = useState<'simple' | 'advanced'>('simple');

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* Quick Stats Header */}
            <div className="p-6 border-b border-slate-800">
                <QuickStatsHeader stats={stats} />
            </div>

            {/* Main Content - 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6 p-6">

                {/* Left Column - Scan Configuration */}
                <div className="space-y-6">

                    {/* Mode Toggle */}
                    <div className="flex items-center gap-3 p-1 bg-slate-900 border border-slate-800 rounded-lg w-fit">
                        <button
                            onClick={() => setMode('simple')}
                            className={`px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 ${mode === 'simple'
                                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <Zap className="w-4 h-4" />
                            Modo Simple
                        </button>
                        <button
                            onClick={() => setMode('advanced')}
                            className={`px-6 py-3 rounded-lg font-medium transition flex items-center gap-2 ${mode === 'advanced'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <Settings className="w-4 h-4" />
                            Modo Avanzado
                        </button>
                    </div>

                    {/* Form Container */}
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                        <h2 className="text-2xl font-bold mb-6">
                            {mode === 'simple' ? '⚡ Configuración Rápida' : '⚙️ Configuración Avanzada'}
                        </h2>

                        {mode === 'simple' ? (
                            <SimpleModeForm onSubmit={onSubmitScan} templates={[]} />
                        ) : (
                            <AdvancedModeForm onSubmit={onSubmitScan} />
                        )}
                    </div>

                </div>

                {/* Right Column - History Sidebar */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                    <ScanHistorySidebar
                        scans={scans}
                        onViewDetails={onViewDetails}
                        onAnalyzeWithAI={onAnalyzeWithAI}
                        onGenerateReport={onGenerateReport}
                        onRescan={onRescan}
                        onCopyConfig={onCopyConfig}
                        onToggleFavorite={onToggleFavorite}
                        onDelete={onDelete}
                        onShare={onShare}
                    />
                </div>

            </div>

        </div>
    );
}
