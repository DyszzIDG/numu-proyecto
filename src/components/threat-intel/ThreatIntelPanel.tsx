'use client';

import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Globe, Server, MapPin, TrendingUp } from 'lucide-react';

interface ThreatIntelPanelProps {
    target: string;
}

export function ThreatIntelPanel({ target }: ThreatIntelPanelProps) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchThreatIntel = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/threat-intel/${encodeURIComponent(target)}`);
                if (response.ok) {
                    const result = await response.json();
                    setData(result.threatIntel);
                }
            } catch (error) {
                console.error('Error fetching threat intel:', error);
            } finally {
                setLoading(false);
            }
        };

        if (target) {
            fetchThreatIntel();
        }
    }, [target]);

    if (loading) {
        return (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <h3 className="text-lg font-bold">Threat Intelligence</h3>
                </div>
                <div className="text-center py-8 text-slate-400">
                    <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-2" />
                    Fetching threat data...
                </div>
            </div>
        );
    }

    if (!data || data.sources.length === 0) {
        return (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-slate-400" />
                    <h3 className="text-lg font-bold">Threat Intelligence</h3>
                </div>
                <div className="text-center py-4 text-slate-500">
                    No threat intelligence data available
                </div>
            </div>
        );
    }

    const getRiskColor = (score: number) => {
        if (score > 70) return 'text-red-400 bg-red-500/20 border-red-500/30';
        if (score > 40) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
        if (score > 10) return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
        return 'text-green-400 bg-green-500/20 border-green-500/30';
    };

    const getRiskIcon = (score: number) => {
        if (score > 70) return <AlertTriangle className="w-6 h-6" />;
        if (score > 10) return <Shield className="w-6 h-6" />;
        return <CheckCircle className="w-6 h-6" />;
    };

    return (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-lg font-bold">Threat Intelligence</h3>
                </div>
                <div className="text-xs text-slate-400">
                    {data.sources.length} source{data.sources.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Risk Score */}
            <div className={`p-4 rounded-lg border ${getRiskColor(data.riskScore)}`}>
                <div className="flex items-center gap-3 mb-2">
                    {getRiskIcon(data.riskScore)}
                    <div className="flex-1">
                        <div className="text-sm font-medium opacity-80">Risk Score</div>
                        <div className="text-2xl font-bold">{data.riskScore}/100</div>
                    </div>
                    <div className="text-right">
                        <TrendingUp className="w-5 h-5 mb-1" />
                    </div>
                </div>
                <div className="text-sm font-medium">{data.summary}</div>
            </div>

            {/* Sources */}
            <div className="space-y-3">
                {data.sources.map((source: any, idx: number) => (
                    <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                            <div className="font-semibold uppercase text-sm">{source.source}</div>
                            <div className="text-xs text-slate-400">
                                {new Date(source.fetchedAt).toLocaleTimeString()}
                            </div>
                        </div>

                        {/* Shodan Data */}
                        {source.source === 'shodan' && (
                            <div className="space-y-2 text-sm">
                                {source.data.organization && (
                                    <div className="flex items-center gap-2">
                                        <Server className="w-4 h-4 text-slate-400" />
                                        <span className="text-slate-400">Org:</span>
                                        <span>{source.data.organization}</span>
                                    </div>
                                )}
                                {source.data.country && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        <span className="text-slate-400">Location:</span>
                                        <span>{source.data.city}, {source.data.country}</span>
                                    </div>
                                )}
                                {source.data.ports?.length > 0 && (
                                    <div className="flex items-start gap-2">
                                        <Globe className="w-4 h-4 text-slate-400 mt-0.5" />
                                        <span className="text-slate-400">Ports:</span>
                                        <span className="flex-1">{source.data.ports.slice(0, 10).join(', ')}</span>
                                    </div>
                                )}
                                {source.data.vulns?.length > 0 && (
                                    <div className="mt-2 p-2 bg-red-500/10 border border-red-500/30 rounded">
                                        <div className="text-red-400 font-medium">
                                            ⚠️ {source.data.vulns.length} vulnerabilities detected
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* VirusTotal Data */}
                        {source.source === 'virustotal' && (
                            <div className="space-y-2 text-sm">
                                <div className="grid grid-cols-4 gap-2">
                                    <div className="text-center p-2 bg-red-500/10 rounded">
                                        <div className="text-red-400 font-bold">{source.data.malicious}</div>
                                        <div className="text-xs text-slate-400">Malicious</div>
                                    </div>
                                    <div className="text-center p-2 bg-yellow-500/10 rounded">
                                        <div className="text-yellow-400 font-bold">{source.data.suspicious}</div>
                                        <div className="text-xs text-slate-400">Suspicious</div>
                                    </div>
                                    <div className="text-center p-2 bg-green-500/10 rounded">
                                        <div className="text-green-400 font-bold">{source.data.harmless}</div>
                                        <div className="text-xs text-slate-400">Harmless</div>
                                    </div>
                                    <div className="text-center p-2 bg-slate-800 rounded">
                                        <div className="text-slate-400 font-bold">{source.data.undetected}</div>
                                        <div className="text-xs text-slate-400">Undetected</div>
                                    </div>
                                </div>
                                {source.data.reputation && (
                                    <div className="text-slate-400">
                                        Reputation: <span className={source.data.reputation >= 0 ? 'text-green-400' : 'text-red-400'}>
                                            {source.data.reputation}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* AbuseIPDB Data */}
                        {source.source === 'abuseipdb' && (
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Abuse Score:</span>
                                    <span className={`font-bold ${source.data.abuseConfidenceScore > 75 ? 'text-red-400' :
                                            source.data.abuseConfidenceScore > 25 ? 'text-yellow-400' :
                                                'text-green-400'
                                        }`}>
                                        {source.data.abuseConfidenceScore}%
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400">Total Reports:</span>
                                    <span>{source.data.totalReports}</span>
                                </div>
                                {source.data.isWhitelisted && (
                                    <div className="p-2 bg-green-500/10 border border-green-500/30 rounded text-green-400">
                                        ✓ Whitelisted
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

        </div>
    );
}
