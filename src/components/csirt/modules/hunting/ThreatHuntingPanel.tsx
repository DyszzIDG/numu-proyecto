
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Radar, Search, Crosshair, Map, ShieldAlert, FileCode, Beaker, Database, Users
} from 'lucide-react';

export default function ThreatHuntingPanel() {
    const [iocQuery, setIocQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[] | null>(null);

    const handleSearch = () => {
        if (!iocQuery) return;
        // Simulating search results
        setSearchResults([
            { type: 'Hash (SHA-256)', value: iocQuery, source: 'VirusTotal', score: '92/100', tags: ['Trojan', 'Ransomware'] },
            { type: 'Domain', value: 'cdn-update-secure.com', source: 'AlienVault OTX', score: 'High Risk', tags: ['C2', 'Phishing'] },
            { type: 'IP', value: '192.168.1.105', source: 'Internal Logs', score: 'Suspicious', tags: ['Lateral Movement'] },
        ]);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-amber-50 border-amber-200 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-amber-800">Alertas CTI (24h)</p>
                            <h3 className="text-2xl font-bold text-amber-900">12</h3>
                            <span className="text-xs text-amber-600 font-medium">3 Críticas</span>
                        </div>
                        <Radar className="w-8 h-8 text-amber-500 opacity-50" />
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Reglas Activas</p>
                            <h3 className="text-2xl font-bold text-slate-900">458</h3>
                            <span className="text-xs text-emerald-600">YARA & Sigma</span>
                        </div>
                        <FileCode className="w-8 h-8 text-indigo-500 opacity-50" />
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Campañas Tracking</p>
                            <h3 className="text-2xl font-bold text-slate-900">5</h3>
                            <span className="text-xs text-slate-500">APT-29, Lazarus...</span>
                        </div>
                        <Crosshair className="w-8 h-8 text-rose-500 opacity-50" />
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Feed Intelligence</p>
                            <h3 className="text-2xl font-bold text-slate-900">Connected</h3>
                            <span className="text-xs text-emerald-600">Sync: 2m ago</span>
                        </div>
                        <Database className="w-8 h-8 text-blue-500 opacity-50" />
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="ioc" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1">
                    <TabsTrigger value="ioc" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Search className="w-4 h-4 mr-2" /> Búsqueda de IOCs
                    </TabsTrigger>
                    <TabsTrigger value="mitre" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Map className="w-4 h-4 mr-2" /> MITRE ATT&CK Matrix
                    </TabsTrigger>
                    <TabsTrigger value="rules" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <ShieldAlert className="w-4 h-4 mr-2" /> Reglas de Detección
                    </TabsTrigger>
                </TabsList>

                {/* IOC SEARCH TAB */}
                <TabsContent value="ioc" className="mt-4 space-y-4">
                    <Card className="border-slate-200 shadow-sm bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg">Investigación de Indicadores de Compromiso</CardTitle>
                            <CardDescription>Busca correlaciones en logs internos, endpoints y fuentes de inteligencia externas.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Ingrese File Hash, Dominio, IP o URL..."
                                    value={iocQuery}
                                    onChange={(e) => setIocQuery(e.target.value)}
                                    className="text-lg py-6"
                                />
                                <Button size="lg" onClick={handleSearch} className="bg-amber-600 hover:bg-amber-700">
                                    <Search className="w-5 h-5 mr-2" /> Hunt
                                </Button>
                            </div>

                            {searchResults && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Hallazgos y Correlaciones</h3>
                                    {searchResults.map((result, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                            <div className="flex items-center gap-4">
                                                <Badge variant="outline" className="bg-white border-slate-300">{result.type}</Badge>
                                                <div>
                                                    <p className="font-mono font-medium text-slate-800">{result.value}</p>
                                                    <p className="text-xs text-slate-500">Source: {result.source}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex gap-2">
                                                    {result.tags.map((tag: string) => (
                                                        <Badge key={tag} className="bg-rose-100 text-rose-700 border-none hover:bg-rose-100">{tag}</Badge>
                                                    ))}
                                                </div>
                                                <span className="font-bold text-rose-600">{result.score}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!searchResults && (
                                <div className="text-center py-10 text-slate-400">
                                    <Crosshair className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <p>Ingrese un indicador para iniciar la búsqueda cros-platform.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* MITRE MATRIX TAB */}
                <TabsContent value="mitre" className="mt-4">
                    <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b border-slate-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-base">Cobertura MITRE ATT&CK</CardTitle>
                                    <CardDescription>Visualización de tácticas y técnicas detectadas en el entorno.</CardDescription>
                                </div>
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Coverage: 78%</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <div className="grid grid-cols-7 min-w-[1000px] text-xs divide-x divide-slate-200">
                                {['Initial Access', 'Execution', 'Persistence', 'Privilege Escalation', 'Defense Evasion', 'Credential Access', 'Discovery'].map(col => (
                                    <div key={col} className="p-3 bg-slate-50 font-bold text-slate-700 text-center border-b border-slate-200">
                                        {col}
                                    </div>
                                ))}
                                {/* Sample Row of Data */}
                                {Array.from({ length: 5 }).map((_, rowIdx) => (
                                    <React.Fragment key={rowIdx}>
                                        {Array.from({ length: 7 }).map((_, colIdx) => {
                                            const isActive = Math.random() > 0.7;
                                            return (
                                                <div key={`${rowIdx}-${colIdx}`} className={`p-2 border-b border-slate-100 ${isActive ? 'bg-rose-50' : ''}`}>
                                                    <div className={`p-2 rounded border ${isActive ? 'border-rose-200 bg-white shadow-sm' : 'border-transparent text-slate-400'}`}>
                                                        {isActive ? (
                                                            <>
                                                                <span className="block font-medium text-rose-700">T15{Math.floor(Math.random() * 90) + 10}</span>
                                                                <span className="block text-[10px] text-slate-500 mt-1">Technique Name</span>
                                                            </>
                                                        ) : (
                                                            <span className="block">-</span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* RULES TAB */}
                <TabsContent value="rules" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="col-span-1 border-slate-200 bg-white">
                            <CardHeader>
                                <CardTitle className="text-sm">Gestor de Reglas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="secondary" className="w-full justify-start"><FileCode className="w-4 h-4 mr-2" /> Importar YARA</Button>
                                <Button variant="secondary" className="w-full justify-start"><FileCode className="w-4 h-4 mr-2" /> Importar Sigma</Button>
                                <Button variant="outline" className="w-full justify-start text-rose-600 border-rose-100 hover:bg-rose-50"><Beaker className="w-4 h-4 mr-2" /> Testear Regla (Sandbox)</Button>
                            </CardContent>
                        </Card>
                        <Card className="col-span-2 border-slate-200 bg-slate-900 text-slate-300 font-mono text-xs">
                            <CardHeader className="border-b border-slate-800 pb-3">
                                <CardTitle className="text-sm text-amber-500 flex items-center gap-2">
                                    <FileCode className="w-4 h-4" /> rule: suspicious_powershell_download
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <pre className="whitespace-pre-wrap">{`
rule Suspicious_PowerShell_Download {
    meta:
        description = "Detects PowerShell downloading content"
        author = "CSIRT Team"
        severity = "High"
    strings:
        $ps = "powershell" nocase
        $net = "System.Net.WebClient"
        $download = "DownloadString"
        $download2 = "DownloadFile"
    condition:
        $ps and $net and ($download or $download2)
}
`}</pre>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
