'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Shield, Clock, Eye, AlertCircle } from 'lucide-react';

export default function SharedScanPage() {
    const params = useParams();
    const token = params.token as string;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [scanData, setScanData] = useState<any>(null);
    const [shareInfo, setShareInfo] = useState<any>(null);

    useEffect(() => {
        const fetchSharedScan = async () => {
            try {
                const response = await fetch(`/api/share/${token}`);

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Failed to load shared scan');
                }

                const data = await response.json();
                setScanData(data.scan);
                setShareInfo(data.shareInfo);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchSharedScan();
        }
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Loading shared scan...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-lg p-8 text-center">
                    <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                    <p className="text-slate-400 mb-6">{error}</p>
                    <a
                        href="/"
                        className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-medium transition"
                    >
                        Go to Homepage
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-8 h-8 text-cyan-400" />
                        <h1 className="text-3xl font-bold">Shared Scan Results</h1>
                    </div>

                    {/* Share Info */}
                    <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Eye className="w-4 h-4" />
                            <span>
                                Views: {shareInfo.viewCount}
                                {shareInfo.maxViews && ` / ${shareInfo.maxViews}`}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span>
                                Expires: {new Date(shareInfo.expiresAt).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Scan Details */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">Scan Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm text-slate-400">Target</div>
                            <div className="font-mono">{scanData.target?.domain || scanData.target?.ip || 'N/A'}</div>
                        </div>
                        <div>
                            <div className="text-sm text-slate-400">Scan Type</div>
                            <div className="font-semibold">{scanData.scanType}</div>
                        </div>
                        <div>
                            <div className="text-sm text-slate-400">Status</div>
                            <div className={`inline-block px-2 py-1 rounded text-sm ${scanData.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                    scanData.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                {scanData.status}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-slate-400">Completed At</div>
                            <div>{scanData.completedAt ? new Date(scanData.completedAt).toLocaleString() : 'N/A'}</div>
                        </div>
                    </div>
                </div>

                {/* Findings */}
                {scanData.findings && scanData.findings.length > 0 && (
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Findings ({scanData.findings.length})</h2>
                        <div className="space-y-3">
                            {scanData.findings.map((finding: any, idx: number) => (
                                <div
                                    key={idx}
                                    className="p-4 bg-slate-950 border border-slate-800 rounded-lg"
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-semibold">{finding.title}</h3>
                                        <span className={`px-2 py-1 rounded text-xs ${finding.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                                                finding.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                                    finding.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {finding.severity}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-400">{finding.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-slate-500">
                    <p>This is a read-only view. Powered by NUMU Cybersecurity Platform.</p>
                </div>

            </div>
        </div>
    );
}
