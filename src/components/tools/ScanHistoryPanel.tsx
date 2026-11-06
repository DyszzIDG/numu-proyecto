
'use client';

import { useEffect, useState } from 'react';
import { History, CheckCircle, XCircle, Clock, Play, Terminal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ScanHistoryPanelProps {
    toolId: string;
    onSelectExecution: (execution: any) => void;
}

export default function ScanHistoryPanel({ toolId, onSelectExecution }: ScanHistoryPanelProps) {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`/api/tools/history?toolId=${toolId}`);
                if (res.ok) {
                    const data = await res.json();
                    setHistory(data);
                }
            } catch (error) {
                console.error('Failed to fetch history:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [toolId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                <History className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                    No History Yet
                </h3>
                <p className="text-gray-400">
                    Execute a scan to see your history here.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {history.map((scan) => (
                <div
                    key={scan.id}
                    onClick={() => onSelectExecution(scan)}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 hover:border-purple-500/50 transition-all cursor-pointer group"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${scan.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                                    scan.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                                        'bg-blue-500/10 text-blue-400 animate-pulse'
                                }`}>
                                {scan.status === 'completed' ? <CheckCircle className="w-5 h-5" /> :
                                    scan.status === 'failed' ? <XCircle className="w-5 h-5" /> :
                                        <Play className="w-5 h-5" />}
                            </div>
                            <div>
                                <h4 className="text-white font-medium flex items-center gap-2">
                                    {scan.target}
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${scan.generatedBy === 'ai'
                                            ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                                            : 'bg-slate-700/50 border-slate-600 text-slate-400'
                                        }`}>
                                        {scan.generatedBy === 'ai' ? '✨ AI Scan' : 'Manual'}
                                    </span>
                                </h4>
                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatDistanceToNow(new Date(scan.startedAt), { addSuffix: true, locale: es })}
                                    </span>
                                    {scan.duration && (
                                        <span>• {scan.duration}s duration</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-sm text-purple-400 flex items-center gap-1 font-medium">
                                View Details <Terminal className="w-4 h-4 ml-1" />
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
