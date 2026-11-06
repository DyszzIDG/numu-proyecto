
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    HardDrive, FileSearch, Fingerprint, Lock, Microscope,
    Upload, Play, FileCode, Archive, ShieldCheck, Activity
} from 'lucide-react';

export default function DigitalForensicsLab() {
    const [evidences, setEvidences] = useState([
        { id: 'EVID-001', name: 'mem-dump-srv01.raw', type: 'Memory Dump', size: '16 GB', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', status: 'Analyzed' },
        { id: 'EVID-002', name: 'suspicious_traffic.pcap', type: 'Network Packet', size: '450 MB', hash: '87040854298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', status: 'Pending' },
    ]);

    const [hexLines, setHexLines] = useState<{ offset: string, hex: string, ascii: string }[] | null>(null);
    const [fileName, setFileName] = useState<string>("");

    const handleFileLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (ev) => {
                const buffer = ev.target?.result as ArrayBuffer;
                const uint8 = new Uint8Array(buffer);
                const lines = [];
                // Process only first 512 bytes for simple preview
                for (let i = 0; i < Math.min(uint8.length, 512); i += 16) {
                    const chunk = uint8.slice(i, i + 16);
                    const hex = Array.from(chunk).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
                    const ascii = Array.from(chunk).map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.').join('');
                    lines.push({ offset: i.toString(16).padStart(8, '0').toUpperCase(), hex, ascii });
                }
                setHexLines(lines);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Lab Status Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-900 border-slate-700 text-white shadow-lg">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-lg">
                            <Microscope className="w-8 h-8 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm font-mono">LAB STATUS</p>
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                OPERATIONAL
                                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            </h3>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Lock className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm">Cadena de Custodia</p>
                            <h3 className="text-xl font-bold text-slate-900">Segura</h3>
                            <span className="text-xs text-slate-400">Última validación: Hace 5m</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 rounded-lg">
                            <Activity className="w-8 h-8 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-sm">Casos Activos</p>
                            <h3 className="text-xl font-bold text-slate-900">2 Procesando</h3>
                            <span className="text-xs text-slate-400">Queue: Empty</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="evidence" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-900 text-slate-400 border border-slate-700">
                    <TabsTrigger value="evidence" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                        <HardDrive className="w-4 h-4 mr-2" /> Evidencia y Custodia
                    </TabsTrigger>
                    <TabsTrigger value="analysis" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                        <FileSearch className="w-4 h-4 mr-2" /> Análisis Forense
                    </TabsTrigger>
                    <TabsTrigger value="report" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                        <FileCode className="w-4 h-4 mr-2" /> Reportes Técnicos
                    </TabsTrigger>
                </TabsList>

                {/* EVIDENCE TAB */}
                <TabsContent value="evidence" className="mt-4 space-y-4">
                    <Card className="border-slate-200">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div>
                                <CardTitle className="text-lg">Inventario de Evidencia</CardTitle>
                                <CardDescription>Gestión de artefactos digitales y cadena de custodia.</CardDescription>
                            </div>
                            <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800">
                                <Upload className="w-4 h-4 mr-2" /> Ingresar Evidencia
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {evidences.map(ev => (
                                    <div key={ev.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-white border border-slate-200 rounded text-slate-500">
                                                {ev.type.includes('Memory') ? <Fingerprint className="w-5 h-5" /> : <Archive className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-slate-800">{ev.name}</p>
                                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-mono">
                                                    <span>ID: {ev.id}</span>
                                                    <span>•</span>
                                                    <span>Size: {ev.size}</span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1 text-emerald-600">
                                                        <ShieldCheck className="w-3 h-3" /> Hash Verified
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className={ev.status === 'Analyzed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}>
                                                {ev.status}
                                            </Badge>
                                            <Button variant="ghost" size="icon"><Fingerprint className="w-4 h-4 text-slate-400" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ANALYSIS TAB */}
                <TabsContent value="analysis" className="mt-4">
                    <div className="grid grid-cols-3 gap-6">
                        <Card className="col-span-1 border-slate-200 bg-slate-900 text-white h-[500px] flex flex-col">
                            <CardHeader className="border-b border-slate-800 py-3">
                                <CardTitle className="text-sm font-mono flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-purple-400" /> Tools
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-2 flex-1 overflow-y-auto">
                                <div className="space-y-1">
                                    {['Hex Viewer', 'Metadata Extractor', 'String Search', 'Entropy Analysis', 'Registry Viewer', 'Timeline Reconstructor', 'YARA Scanner', 'VirusTotal Check'].map(tool => (
                                        <button key={tool} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-md transition-colors flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div> {tool}
                                        </button>
                                    ))}
                                    <div className="pt-4 border-t border-slate-800 mt-4 px-3">
                                        <p className="text-xs text-slate-500 mb-2">Load Evidence File</p>
                                        <Input
                                            type="file"
                                            className="h-9 text-xs bg-slate-800 border-slate-700 text-slate-300 file:bg-slate-700 file:text-white file:border-0 file:rounded-sm file:text-xs"
                                            onChange={handleFileLoad}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-2 border-slate-200 h-[500px] bg-slate-950 text-emerald-500 font-mono text-xs overflow-hidden flex flex-col">
                            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-slate-400">
                                <span>Hex View: {fileName || 'No File Loaded'}</span>
                                <span>Offset: 0x00000000</span>
                            </div>
                            <div className="p-4 overflow-y-auto flex-1 font-mono leading-relaxed opacity-90">
                                <div className="grid grid-cols-[80px_1fr_1fr] gap-4">
                                    {hexLines ? (
                                        <>
                                            <div className="text-slate-500 select-none text-right border-r border-slate-800 pr-3">
                                                {hexLines.map(line => <div key={line.offset}>{line.offset}</div>)}
                                            </div>
                                            <div className="text-slate-300">
                                                {hexLines.map(line => <div key={line.offset}>{line.hex}</div>)}
                                            </div>
                                            <div className="text-slate-500 border-l border-slate-800 pl-4">
                                                {hexLines.map(line => <div key={line.offset}>{line.ascii}</div>)}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="col-span-3 flex flex-col items-center justify-center text-slate-600 h-64">
                                            <Activity className="w-12 h-12 mb-4 opacity-20" />
                                            <p>Cargar archivo para visualizar</p>
                                        </div>
                                    )}
                                </div>
                                {hexLines && (
                                    <div className="mt-4 text-purple-400 pt-4 border-t border-slate-800">
                                        {`>> Analysis detected potential PE Header signature (MZ) at 0x00`}<br />
                                        {`>> File size: Loaded first 512 bytes for preview`}
                                    </div>
                                )}
                            </div>
                            <div className="p-2 border-t border-slate-800 bg-slate-900 flex justify-end">
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={!hexLines}>
                                    <Play className="w-3 h-3 mr-2" /> Run Deeper Analysis
                                </Button>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                {/* REPORT TAB */}
                <TabsContent value="report" className="mt-4">
                    <Card className="border-slate-200">
                        <CardContent className="p-10 text-center">
                            <FileCode className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-900">Generación de Reportes Forenses</h3>
                            <p className="text-slate-500 max-w-md mx-auto mt-2">
                                Genera un reporte detallado con cadena de custodia, hash logs, y hallazgos técnicos en formato PDF/HTML.
                            </p>
                            <Button className="mt-6">Generar Nuevo Reporte</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
