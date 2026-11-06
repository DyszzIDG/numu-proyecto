'use client';

import React, { useState } from 'react';
import { GitCompare, Plus, Minus, Circle, AlertCircle } from 'lucide-react';

interface ScanData {
    id: string;
    target: string;
    timestamp: Date;
    tool: string;
    openPorts: number[];
    services: Array<{ port: number; name: string; version: string }>;
    findings: Array<{ severity: string; title: string }>;
}

interface ScanComparatorProps {
    scans: ScanData[];
}

export function ScanComparator({ scans }: ScanComparatorProps) {
    const [scan1Id, setScan1Id] = useState<string>('');
    const [scan2Id, setScan2Id] = useState<string>('');

    const scan1 = scans.find(s => s.id === scan1Id);
    const scan2 = scans.find(s => s.id === scan2Id);

    const comparison = scan1 && scan2 ? {
        newPorts: scan2.openPorts.filter(p => !scan1.openPorts.includes(p)),
        closedPorts: scan1.openPorts.filter(p => !scan2.openPorts.includes(p)),
        unchangedPorts: scan1.openPorts.filter(p => scan2.openPorts.includes(p)),
        newServices: scan2.services.filter(s2 =>
            !scan1.services.some(s1 => s1.port === s2.port && s1.name === s2.name)
        ),
        changedServices: scan2.services.filter(s2 => {
            const s1 = scan1.services.find(s => s.port === s2.port && s.name === s2.name);
            return s1 && s1.version !== s2.version;
        }),
        newFindings: scan2.findings.filter(f2 =>
            !scan1.findings.some(f1 => f1.title === f2.title)
        ),
        resolvedFindings: scan1.findings.filter(f1 =>
            !scan2.findings.some(f2 => f2.title === f1.title)
        )
    } : null;

    return (
        <div className="space-y-6">

            {/* Scan Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                    <label className="block text-sm font-medium mb-2">First Scan (Baseline)</label>
                    <select
                        value={scan1Id}
                        onChange={(e) => setScan1Id(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none"
                    >
                        <option value="">Select scan...</option>
                        {scans.map(scan => (
                            <option key={scan.id} value={scan.id}>
                                {scan.tool} - {scan.target} ({new Date(scan.timestamp).toLocaleDateString()})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Second Scan (Comparison)</label>
                    <select
                        value={scan2Id}
                        onChange={(e) => setScan2Id(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:border-cyan-500 outline-none"
                    >
                        <option value="">Select scan...</option>
                        {scans.map(scan => (
                            <option key={scan.id} value={scan.id}>
                                {scan.tool} - {scan.target} ({new Date(scan.timestamp).toLocaleDateString()})
                            </option>
                        ))}
                    </select>
                </div>

            </div>

            {/* Comparison Results */}
            {comparison ? (
                <div className="space-y-6">

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Plus className="w-5 h-5 text-green-400" />
                                <span className="font-semibold text-green-400">New</span>
                            </div>
                            <div className="text-2xl font-bold">{comparison.newPorts.length}</div>
                            <div className="text-sm text-slate-400">Open Ports</div>
                        </div>

                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Minus className="w-5 h-5 text-red-400" />
                                <span className="font-semibold text-red-400">Closed</span>
                            </div>
                            <div className="text-2xl font-bold">{comparison.closedPorts.length}</div>
                            <div className="text-sm text-slate-400">Ports</div>
                        </div>

                        <div className="p-4 bg-slate-800 border border-slate-700 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <Circle className="w-5 h-5 text-slate-400" />
                                <span className="font-semibold text-slate-400">Unchanged</span>
                            </div>
                            <div className="text-2xl font-bold">{comparison.unchangedPorts.length}</div>
                            <div className="text-sm text-slate-400">Ports</div>
                        </div>

                    </div>

                    {/* Port Changes */}
                    {(comparison.newPorts.length > 0 || comparison.closedPorts.length > 0) && (
                        <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <GitCompare className="w-5 h-5" />
                                Port Changes
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* New Ports */}
                                {comparison.newPorts.length > 0 && (
                                    <div>
                                        <div className="text-sm font-medium text-green-400 mb-2">
                                            + New Open Ports ({comparison.newPorts.length})
                                        </div>
                                        <div className="space-y-1">
                                            {comparison.newPorts.map(port => (
                                                <div key={port} className="px-3 py-2 bg-green-500/10 border border-green-500/30 rounded text-sm font-mono">
                                                    {port}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Closed Ports */}
                                {comparison.closedPorts.length > 0 && (
                                    <div>
                                        <div className="text-sm font-medium text-red-400 mb-2">
                                            - Closed Ports ({comparison.closedPorts.length})
                                        </div>
                                        <div className="space-y-1">
                                            {comparison.closedPorts.map(port => (
                                                <div key={port} className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded text-sm font-mono line-through">
                                                    {port}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    )}

                    {/* Service Changes */}
                    {(comparison.newServices.length > 0 || comparison.changedServices.length > 0) && (
                        <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">Service Changes</h3>

                            <div className="space-y-3">

                                {comparison.newServices.map((service, idx) => (
                                    <div key={idx} className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Plus className="w-4 h-4 text-green-400" />
                                            <span className="font-semibold text-green-400">New Service</span>
                                        </div>
                                        <div className="text-sm">
                                            Port <span className="font-mono">{service.port}</span>: {service.name} {service.version}
                                        </div>
                                    </div>
                                ))}

                                {comparison.changedServices.map((service, idx) => {
                                    const oldService = scan1!.services.find(s => s.port === service.port);
                                    return (
                                        <div key={idx} className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                            <div className="flex items-center gap-2 mb-1">
                                                <AlertCircle className="w-4 h-4 text-yellow-400" />
                                                <span className="font-semibold text-yellow-400">Version Changed</span>
                                            </div>
                                            <div className="text-sm">
                                                Port <span className="font-mono">{service.port}</span>: {service.name}
                                            </div>
                                            <div className="text-xs text-slate-400 mt-1">
                                                <span className="line-through">{oldService?.version}</span>
                                                {' → '}
                                                <span className="text-yellow-400">{service.version}</span>
                                            </div>
                                        </div>
                                    );
                                })}

                            </div>
                        </div>
                    )}

                    {/* Findings Changes */}
                    {(comparison.newFindings.length > 0 || comparison.resolvedFindings.length > 0) && (
                        <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">Findings Changes</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {comparison.newFindings.length > 0 && (
                                    <div>
                                        <div className="text-sm font-medium text-red-400 mb-2">
                                            + New Findings ({comparison.newFindings.length})
                                        </div>
                                        <div className="space-y-2">
                                            {comparison.newFindings.map((finding, idx) => (
                                                <div key={idx} className="p-2 bg-red-500/10 border border-red-500/30 rounded text-sm">
                                                    <span className={`px-2 py-0.5 rounded text-xs mr-2 ${finding.severity === 'critical' ? 'bg-red-500 text-white' :
                                                            finding.severity === 'high' ? 'bg-orange-500 text-white' :
                                                                'bg-yellow-500 text-black'
                                                        }`}>
                                                        {finding.severity}
                                                    </span>
                                                    {finding.title}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {comparison.resolvedFindings.length > 0 && (
                                    <div>
                                        <div className="text-sm font-medium text-green-400 mb-2">
                                            ✓ Resolved ({comparison.resolvedFindings.length})
                                        </div>
                                        <div className="space-y-2">
                                            {comparison.resolvedFindings.map((finding, idx) => (
                                                <div key={idx} className="p-2 bg-green-500/10 border border-green-500/30 rounded text-sm line-through opacity-60">
                                                    {finding.title}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    )}

                </div>
            ) : (
                <div className="text-center py-12 text-slate-500">
                    Select two scans to compare
                </div>
            )}

        </div>
    );
}
