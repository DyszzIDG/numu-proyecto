import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Terminal } from 'lucide-react';

interface ScanExecution {
    id: string;
    toolName: string;
    target: string;
    status: string;
    startedAt: string;
    completedAt?: string;
    duration?: number;
    generatedBy: string;
}

interface ScanHistoryListProps {
    scans: ScanExecution[];
    isLoading?: boolean;
}

export default function ScanHistoryList({ scans, isLoading = false }: ScanHistoryListProps) {
    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-white/5 rounded-xl border border-white/10" />
                ))}
            </div>
        );
    }

    if (scans.length === 0) {
        return (
            <div className="text-center py-10 text-gray-400">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No recent scans found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                Recent Scans
            </h3>
            <div className="grid gap-3">
                {scans.map((scan) => (
                    <div
                        key={scan.id}
                        className="bg-white/5 border border-white/10 hover:border-white/20 transition-colors rounded-xl p-4 flex items-center justify-between group"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${scan.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                                    scan.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                                        'bg-blue-500/10 text-blue-400'
                                }`}>
                                {scan.status === 'completed' ? <CheckCircle className="w-5 h-5" /> :
                                    scan.status === 'failed' ? <XCircle className="w-5 h-5" /> :
                                        <AlertCircle className="w-5 h-5" />}
                            </div>
                            <div>
                                <h4 className="font-medium text-white flex items-center gap-2">
                                    {scan.toolName}
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400 font-normal">
                                        {scan.target}
                                    </span>
                                </h4>
                                <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                                    <span>{new Date(scan.startedAt).toLocaleString()}</span>
                                    {scan.duration && (
                                        <span>• {scan.duration}s</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Placeholder for future "View Details" action */}
                            <div className="text-xs text-gray-500 font-mono hidden md:block">
                                ID: {scan.id.slice(0, 8)}...
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
