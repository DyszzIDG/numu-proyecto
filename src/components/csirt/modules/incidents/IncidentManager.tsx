
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Plus, Layout, Clock, FileText, CheckCircle, UserPlus, Send, History } from 'lucide-react';
import { toast } from 'sonner';

interface Incident {
    id: string;
    title: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    status: 'New' | 'Analyzing' | 'Contained' | 'Resolved';
    assignee: string;
    time: string;
}

export default function IncidentManager() {
    const [incidents, setIncidents] = useState<Incident[]>([
        { id: 'INC-2491', title: 'Suspicious PowerShell Execution', severity: 'Critical', status: 'Analyzing', assignee: 'Analyst_01', time: '2h ago' },
        { id: 'INC-2490', title: 'Multiple Failed Logins (Brute Force)', severity: 'High', status: 'New', assignee: 'Unassigned', time: '4h ago' },
        { id: 'INC-2489', title: 'Malware Detected on HR-Laptop', severity: 'Medium', status: 'Contained', assignee: 'Analyst_03', time: '1d ago' },
    ]);

    const [newIncident, setNewIncident] = useState({ title: '', severity: 'Medium', description: '' });
    const [activeTab, setActiveTab] = useState('register');

    const handleCreateIncident = () => {
        if (!newIncident.title) return;

        const incident: Incident = {
            id: `INC-${Math.floor(Math.random() * 10000)}`,
            title: newIncident.title,
            severity: newIncident.severity as any,
            status: 'New',
            assignee: 'Unassigned',
            time: 'Just now'
        };

        setIncidents([incident, ...incidents]);
        setNewIncident({ title: '', severity: 'Medium', description: '' });
        setActiveTab('board'); // Switch to board to see new ticket
        toast.success("Incidente registrado y notificado al equipo.");
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-red-500/10 border-red-900/50 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-red-400">Incidentes Críticos</p>
                            <h3 className="text-2xl font-bold text-red-500">{incidents.filter(i => i.severity === 'Critical').length}</h3>
                            <span className="text-xs text-red-400/80 font-medium">+2 vs ayer</span>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-red-500 opacity-50" />
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-400">Total Activos</p>
                            <h3 className="text-2xl font-bold text-slate-100">{incidents.length}</h3>
                            <span className="text-xs text-slate-500">Open Tickets</span>
                        </div>
                        <FileText className="w-8 h-8 text-blue-400 opacity-50" />
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-400">MTTR (Media)</p>
                            <h3 className="text-2xl font-bold text-slate-100">4.2h</h3>
                            <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Within SLA</span>
                        </div>
                        <Clock className="w-8 h-8 text-orange-400 opacity-50" />
                    </CardContent>
                </Card>
                <Card className="bg-slate-900 border-slate-800 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-400">Guardia Actual</p>
                            <h3 className="text-xl font-bold text-slate-100">Equipo Alpha</h3>
                            <span className="text-xs text-slate-500">Shift ends in 2h</span>
                        </div>
                        <UserPlus className="w-8 h-8 text-slate-500 opacity-50" />
                    </CardContent>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-900 p-1 border border-slate-800">
                    <TabsTrigger value="register" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400">
                        <Plus className="w-4 h-4 mr-2" /> Registro de Incidentes
                    </TabsTrigger>
                    <TabsTrigger value="board" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400">
                        <Layout className="w-4 h-4 mr-2" /> Tablero & Severidad
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400">
                        <History className="w-4 h-4 mr-2" /> Timeline & Evidencias
                    </TabsTrigger>
                </TabsList>

                {/* REGISTER TAB */}
                <TabsContent value="register" className="mt-4">
                    <Card className="border-slate-800 shadow-sm bg-slate-900">
                        <CardHeader>
                            <CardTitle className="text-slate-100">Registrar Nuevo Incidente de Seguridad</CardTitle>
                            <CardDescription className="text-slate-400">Completa los detalles para iniciar el playbook de respuesta adecuado. Se notificará automáticamente al equipo de guardia.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Título del Incidente</label>
                                    <Input
                                        placeholder="Ej: Detectado tráfico inusual en puerto 445..."
                                        className="bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:border-indigo-500"
                                        value={newIncident.title}
                                        onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Severidad Inicial</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                        value={newIncident.severity}
                                        onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value })}
                                    >
                                        <option value="Low">Low - Monitoreo</option>
                                        <option value="Medium">Medium - Análisis Requerido</option>
                                        <option value="High">High - Respuesta Inmediata</option>
                                        <option value="Critical">Critical - Movilización CSIRT</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-300">Descripción y Observaciones</label>
                                <textarea className="flex min-h-[100px] w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                                    placeholder="Detalla los vectores de ataque observados..."
                                    value={newIncident.description}
                                    onChange={(e) => setNewIncident({ ...newIncident, description: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleCreateIncident}>
                                    <AlertTriangle className="w-4 h-4 mr-2" /> Crear y Notificar
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* BOARD TAB */}
                <TabsContent value="board" className="mt-4">
                    <div className="grid grid-cols-4 gap-4 h-[600px]">
                        {['New', 'Analyzing', 'Contained', 'Resolved'].map((status) => (
                            <div key={status} className="bg-slate-950/50 rounded-lg border border-slate-800 p-3 h-full flex flex-col">
                                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                                    <h4 className="font-semibold text-slate-300">{status}</h4>
                                    <Badge variant="secondary" className="bg-slate-900 text-slate-300 border border-slate-700">
                                        {incidents.filter(i => i.status === status).length}
                                    </Badge>
                                </div>
                                <div className="space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                                    {incidents.filter(i => i.status === status).map(incident => (
                                        <div key={incident.id} className="bg-slate-900 p-3 rounded-xl border border-slate-800 shadow-sm cursor-pointer hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all group">
                                            <div className="flex justify-between items-start mb-2">
                                                <Badge className={`
                                                    ${incident.severity === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-900/30' :
                                                        incident.severity === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-900/30' :
                                                            'bg-blue-500/10 text-blue-400 border-blue-900/30'} border px-2 py-0.5 text-[10px] uppercase font-bold
                                                `}>
                                                    {incident.severity}
                                                </Badge>
                                                <span className="text-[10px] text-slate-500 font-mono">{incident.id}</span>
                                            </div>
                                            <h5 className="text-sm font-medium text-slate-200 leading-tight mb-2 group-hover:text-indigo-400 transition-colors">{incident.title}</h5>
                                            <div className="flex items-center justify-between text-xs text-slate-500">
                                                <div className="flex items-center gap-1">
                                                    <div className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[8px] text-slate-400 border border-slate-700">
                                                        {incident.assignee.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <span>{incident.assignee}</span>
                                                </div>
                                                <span className="text-[10px]">{incident.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button variant="ghost" size="sm" className="w-full mt-2 text-slate-500 hover:text-indigo-400 border border-transparent hover:border-indigo-500/30 hover:bg-indigo-500/10" onClick={() => setActiveTab('register')}>
                                    <Plus className="w-3 h-3 mr-1" /> Add Card
                                </Button>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* TIMELINE TAB */}
                <TabsContent value="timeline" className="mt-4">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-slate-100">Timeline de Operaciones</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6 relative ml-4 border-l-2 border-slate-800 pl-6">
                                {incidents.slice(0, 3).map((inc, i) => (
                                    <div key={inc.id} className="relative">
                                        <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-indigo-500 border-4 border-slate-900 shadow-sm"></div>
                                        <div className="mb-1 flex items-center gap-2">
                                            <span className="text-xs font-bold text-indigo-400">{inc.time}</span>
                                            <Badge variant="outline" className="text-[10px] h-4 px-1 border-slate-700 text-slate-400">{inc.status.toUpperCase()}</Badge>
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-200">{inc.title} - {inc.id}</h4>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Incident created manually by Supervisor. Triggered initial playbook execution.
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
