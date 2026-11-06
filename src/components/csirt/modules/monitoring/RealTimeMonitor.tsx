
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts';
import { Activity, Shield, Wifi, Server, AlertTriangle, Zap, Globe, Cpu } from 'lucide-react';

const generateTrafficData = () => {
    return Array.from({ length: 20 }, (_, i) => ({
        time: `${i}:00`,
        inbound: Math.floor(Math.random() * 500) + 100,
        outbound: Math.floor(Math.random() * 300) + 50,
    }));
};

export default function RealTimeMonitor() {
    const [trafficData, setTrafficData] = useState(generateTrafficData());
    const [systemHealth, setSystemHealth] = useState(98);
    const [activeThreats, setActiveThreats] = useState(3);

    useEffect(() => {
        const interval = setInterval(() => {
            setTrafficData(prev => {
                const newData = [...prev.slice(1), {
                    time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    inbound: Math.floor(Math.random() * 600) + 150,
                    outbound: Math.floor(Math.random() * 400) + 80,
                }];
                return newData;
            });
            setSystemHealth(prev => Math.min(100, Math.max(80, prev + (Math.random() - 0.5) * 5)));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-slate-900 border-slate-800 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-400">Salud del Sistema</p>
                            <h3 className="text-2xl font-bold text-slate-100">{systemHealth.toFixed(1)}%</h3>
                            <span className="text-xs text-emerald-400 font-medium">+0.5% vs avg</span>
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            <Activity className="w-5 h-5 text-emerald-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-400">Amenazas Activas</p>
                            <h3 className="text-2xl font-bold text-slate-100">{activeThreats}</h3>
                            <span className="text-xs text-rose-400 font-medium">Requiere atención</span>
                        </div>
                        <div className="p-3 bg-rose-500/10 rounded-full border border-rose-500/20">
                            <Shield className="w-5 h-5 text-rose-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-400">Ancho de Banda</p>
                            <h3 className="text-2xl font-bold text-slate-100">1.2 Gbps</h3>
                            <span className="text-xs text-blue-400 font-medium">Peak: 2.1 Gbps</span>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-full border border-blue-500/20">
                            <Wifi className="w-5 h-5 text-blue-400" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-400">Endpoints Online</p>
                            <h3 className="text-2xl font-bold text-slate-100">4,281</h3>
                            <span className="text-xs text-slate-500">98.2% cobertura</span>
                        </div>
                        <div className="p-3 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                            <Server className="w-5 h-5 text-indigo-400" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Interactive Map & Traffic */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Traffic Monitor */}
                <div className="lg:col-span-2">
                    <Card className="h-full border-slate-800 shadow-lg bg-slate-900">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 pb-4">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-100">
                                <Activity className="w-5 h-5 text-blue-500" /> Tráfico de Red en Tiempo Real
                            </CardTitle>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse">LIVE</Badge>
                                <Button size="sm" variant="outline" className="h-7 text-xs border-slate-700 text-slate-300 hover:bg-slate-800">Exportar Log</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trafficData}>
                                        <defs>
                                            <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                        <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #1e293b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.5)', color: '#f1f5f9' }}
                                            itemStyle={{ color: '#f1f5f9' }}
                                            labelStyle={{ color: '#94a3b8' }}
                                        />
                                        <Area type="monotone" dataKey="inbound" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorIn)" />
                                        <Area type="monotone" dataKey="outbound" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorOut)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Threat Radar / Map Placeholder */}
                <div className="space-y-6">
                    <Card className="border-slate-800 shadow-lg bg-slate-900 text-white overflow-hidden relative h-full">
                        <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/U3qYN8S0j3bpK/giphy.gif')] bg-cover opacity-20 mix-blend-overlay"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950/80"></div>
                        <CardHeader className="relative z-10 border-b border-white/5">
                            <CardTitle className="text-base flex items-center gap-2 text-slate-100">
                                <Globe className="w-4 h-4 text-purple-400" /> Mapa de Amenazas Globales
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10 p-6 flex flex-col items-center justify-center h-[300px]">
                            <div className="w-40 h-40 rounded-full border-2 border-purple-500/30 flex items-center justify-center animate-[spin_10s_linear_infinite]">
                                <div className="w-32 h-32 rounded-full border border-purple-500/50 flex items-center justify-center">
                                    <Globe className="w-16 h-16 text-purple-500/50" />
                                </div>
                            </div>
                            <div className="mt-6 w-full space-y-2 bg-slate-950/50 p-4 rounded-lg border border-slate-800 backdrop-blur-sm">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Origen: <span className="text-white">China (CN)</span></span>
                                    <span className="text-red-400 font-bold">HIGH</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Target: <span className="text-white">Database Core</span></span>
                                    <span className="text-orange-400">BLOCKED</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Active Alerts Table */}
            <Card className="border-slate-800 shadow-sm bg-slate-900">
                <CardHeader className="border-b border-slate-800 pb-4">
                    <CardTitle className="text-lg font-semibold text-slate-100">Alertas de Seguridad en Vivo</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="space-y-4">
                        {[
                            { time: '10:42:15', source: 'Firewall-01', event: 'Port Scan Detected', severity: 'Medium', ip: '192.168.1.105' },
                            { time: '10:41:55', source: 'Auth-Srv', event: 'Failed Login (Root)', severity: 'High', ip: '45.2.1.99' },
                            { time: '10:40:30', source: 'IDS-Core', event: 'SQL Injection Attempt', severity: 'Critical', ip: '10.0.5.22' },
                        ].map((alert, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800 hover:bg-slate-800 transition-colors cursor-pointer hover:border-indigo-500/30">
                                <div className="flex items-center gap-4">
                                    <Badge variant="outline" className={`${alert.severity === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                        alert.severity === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                        }`}>
                                        {alert.severity}
                                    </Badge>
                                    <div>
                                        <p className="font-semibold text-sm text-slate-200">{alert.event}</p>
                                        <p className="text-xs text-slate-500">Source: {alert.source} • IP: {alert.ip}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-slate-500">{alert.time}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
