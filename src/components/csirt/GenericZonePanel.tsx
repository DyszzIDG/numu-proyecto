
"use client";

import React from 'react';
import { CSIRTZone } from '@/lib/csirt/csirt-zones';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, RefreshCw, Terminal, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface GenericZonePanelProps {
    zone: CSIRTZone;
}

export default function GenericZonePanel({ zone }: GenericZonePanelProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-emerald-100 text-emerald-700';
            case 'Live': return 'bg-emerald-100 text-emerald-700 animate-pulse';
            case 'Beta': return 'bg-purple-100 text-purple-700';
            case 'Manual': return 'bg-slate-100 text-slate-700';
            case 'Tool': return 'bg-blue-100 text-blue-700';
            case 'Alert': return 'bg-red-100 text-red-700 animate-pulse';
            case 'Block': return 'bg-red-900/20 text-red-600';
            case 'Maintenance': return 'bg-amber-100 text-amber-700';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Zone Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-400">Modules Active</p>
                            <h3 className="text-2xl font-bold text-white">
                                {zone.modules.filter(m => m.status === 'Active' || m.status === 'Live').length} / {zone.modules.length}
                            </h3>
                            <span className="text-xs text-emerald-500">Operational</span>
                        </div>
                        <zone.icon className={`w-8 h-8 text-${zone.color}-500 opacity-50`} />
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-400">System Messages</p>
                            <h3 className="text-2xl font-bold text-white">0 Critical</h3>
                            <span className="text-xs text-slate-500">Normal Operation</span>
                        </div>
                        <AlertCircle className="w-8 h-8 text-slate-700" />
                    </CardContent>
                </Card>
                {/* Simulated Quick Action */}
                <Card className="bg-slate-950 border-slate-800 border-dashed">
                    <CardContent className="p-4 flex items-center justify-center h-full">
                        <Button variant="outline" className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-800">
                            <RefreshCw className="w-4 h-4" /> Run Zone Diagnostics
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Modules Grid */}
            <div>
                <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <Terminal className="w-4 h-4" /> Available Modules
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {zone.modules.map((module) => (
                        <Card key={module.name} className="group bg-slate-900 border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer">
                            <CardContent className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg bg-slate-950 border border-slate-800 text-${zone.color}-500/80`}>
                                        <Terminal className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">{module.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="secondary" className={`text-[10px] px-2 py-0 border-0 ${getStatusColor(module.status)} bg-opacity-10`}>
                                                {module.status}
                                            </Badge>
                                            <span className="text-xs text-slate-500">v1.2.0</span>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-800">
                                    <ArrowRight className="w-4 h-4 text-slate-400" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Simulated Live Console */}
            <Card className="bg-[#0f1016] text-slate-400 font-mono text-xs border-slate-800 shadow-inner">
                <CardHeader className="border-b border-slate-900 py-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2">
                            <Terminal className="w-3 h-3" /> Zone Output Log
                        </CardTitle>
                        <div className="flex gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>Live</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 space-y-1 h-32 overflow-hidden">
                    <p className="text-emerald-500/80">{`> initializing ${zone.slug}... OK`}</p>
                    <p>{`> loading modules [${zone.modules.length} found]...`}</p>
                    <p>{`> connecting to upstream sensors... connected.`}</p>
                    <p>{`> ${zone.title} dashboard ready.`}</p>
                    <p className="animate-pulse">_</p>
                </CardContent>
            </Card>
        </div>
    );
}
