
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
    GitBranch, PlayCircle, Settings, Layers, Zap, Clock,
    CheckCircle, XCircle, ArrowRight, Box, ChevronRight, Edit
} from 'lucide-react';

export default function SOARAutomation() {
    const [selectedNode, setSelectedNode] = useState<string | null>(null);

    const playbooks = [
        { id: 'PB-Phishing', name: 'Phishing Response', triggers: 'Email Report', steps: 12, avgTime: '45s', status: 'Active' },
        { id: 'PB-Ransom', name: 'Ransomware Containment', triggers: 'EDR Alert', steps: 8, avgTime: '12s', status: 'Active' },
        { id: 'PB-UserOff', name: 'Suspicious User Lockout', triggers: 'SIEM High Sev', steps: 5, avgTime: '3s', status: 'Draft' },
        { id: 'PB-VulnScan', name: 'Auto-Vuln Scan', triggers: 'New Asset', steps: 4, avgTime: '5m', status: 'Active' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header / Engine Status */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Automation Engine</p>
                            <h3 className="text-2xl font-bold text-emerald-600">Online</h3>
                            <span className="text-xs text-slate-400">Worker Nodes: 4/4</span>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-full">
                            <Zap className="w-6 h-6 text-emerald-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Playbooks Active</p>
                            <h3 className="text-2xl font-bold text-slate-900">18</h3>
                            <span className="text-xs text-slate-400">Total: 24</span>
                        </div>
                        <GitBranch className="w-6 h-6 text-indigo-500" />
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Daily Executions</p>
                            <h3 className="text-2xl font-bold text-slate-900">842</h3>
                            <span className="text-xs text-emerald-600 font-medium">+12% vs avg</span>
                        </div>
                        <PlayCircle className="w-6 h-6 text-blue-500" />
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Time Saved (Est.)</p>
                            <h3 className="text-2xl font-bold text-slate-900">42h</h3>
                            <span className="text-xs text-slate-400">This Month</span>
                        </div>
                        <Clock className="w-6 h-6 text-orange-500" />
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="editor" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1">
                    <TabsTrigger value="library" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Layers className="w-4 h-4 mr-2" /> Playbook Library
                    </TabsTrigger>
                    <TabsTrigger value="editor" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <GitBranch className="w-4 h-4 mr-2" /> Visual Editor
                    </TabsTrigger>
                    <TabsTrigger value="integrations" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Settings className="w-4 h-4 mr-2" /> Integrations
                    </TabsTrigger>
                </TabsList>

                {/* LIBRARY TAB */}
                <TabsContent value="library" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        {playbooks.map(pb => (
                            <Card key={pb.id} className="cursor-pointer hover:border-indigo-300 transition-all shadow-sm border-slate-200 bg-white group">
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 rounded text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                <Zap className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800">{pb.name}</h4>
                                                <p className="text-xs text-slate-500 font-mono">{pb.id}</p>
                                            </div>
                                        </div>
                                        <Badge variant={pb.status === 'Active' ? 'default' : 'secondary'} className={pb.status === 'Active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-100 text-slate-600'}>
                                            {pb.status}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-xs text-slate-500 mb-4 bg-slate-50 p-3 rounded-lg">
                                        <div>
                                            <span className="block font-medium text-slate-400">Trigger</span>
                                            <span className="text-slate-700">{pb.triggers}</span>
                                        </div>
                                        <div>
                                            <span className="block font-medium text-slate-400">Steps</span>
                                            <span className="text-slate-700">{pb.steps} Nodes</span>
                                        </div>
                                        <div>
                                            <span className="block font-medium text-slate-400">Avg Time</span>
                                            <span className="text-slate-700">{pb.avgTime}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="w-full">Debug</Button>
                                        <Button size="sm" className="w-full bg-slate-900 group-hover:bg-indigo-600 text-white">
                                            <PlayCircle className="w-3 h-3 mr-2" /> Run Now
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* VISUAL EDITOR TAB */}
                <TabsContent value="editor" className="mt-4">
                    <Card className="h-[600px] border-slate-200 bg-slate-50 overflow-hidden flex flex-row">
                        {/* Interactive Graph Area */}
                        <div className="flex-1 relative p-8 flex items-center justify-center overflow-auto"
                            style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                            onClick={() => setSelectedNode(null)}>

                            <div className="flex flex-col items-center gap-8 relative z-10 w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
                                {/* Trigger Node */}
                                <div
                                    className={`p-4 bg-white border-2 rounded-lg shadow-sm w-64 text-center cursor-pointer transition-all ${selectedNode === 'trigger' ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-300 hover:border-indigo-400'}`}
                                    onClick={() => setSelectedNode('trigger')}
                                >
                                    <Badge className="bg-blue-100 text-blue-700 absolute -top-3 left-1/2 -translate-x-1/2">TRIGGER</Badge>
                                    <p className="font-bold text-slate-800">Receive Email Alert</p>
                                    <p className="text-xs text-slate-500">Source: IRONSCALES</p>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                                </div>

                                <ArrowRight className="rotate-90 text-slate-300" />

                                {/* Action Node */}
                                <div
                                    className={`p-4 bg-white border-2 rounded-lg shadow-sm w-64 text-center cursor-pointer transition-all ${selectedNode === 'action' ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-300 hover:border-indigo-400'}`}
                                    onClick={() => setSelectedNode('action')}
                                >
                                    <p className="font-bold text-slate-800">Analyze Headers</p>
                                    <p className="text-xs text-slate-500">Action: Parse & Extract IPs</p>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full absolute -top-1 left-1/2 -translate-x-1/2"></div>
                                    <div className="w-2 h-2 bg-slate-400 rounded-full absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                                </div>

                                <ArrowRight className="rotate-90 text-slate-300" />

                                {/* Decision Node */}
                                <div className="relative">
                                    <div
                                        className={`p-4 bg-white border-2 rounded-lg shadow-sm w-64 text-center cursor-pointer transition-all rotate-45 transform bg-orange-50 ${selectedNode === 'decision' ? 'border-orange-500 ring-2 ring-orange-200' : 'border-orange-300 hover:border-orange-400'}`}
                                        onClick={() => setSelectedNode('decision')}
                                    >
                                        <div className="-rotate-45">
                                            <p className="font-bold text-slate-800">Is Malicious?</p>
                                            <p className="text-[10px] text-slate-500">Threat Score &gt; 80</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between w-[400px]">
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs font-bold text-emerald-600 mb-2">YES</span>
                                        <div
                                            className={`p-4 bg-white border-2 rounded-lg shadow-sm w-48 text-center cursor-pointer transition-all ${selectedNode === 'block' ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-emerald-300 hover:border-emerald-400'}`}
                                            onClick={() => setSelectedNode('block')}
                                        >
                                            <p className="font-bold text-slate-800">Block Sender</p>
                                            <p className="text-xs text-slate-500">Gateway + EDR Block</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs font-bold text-red-600 mb-2">NO</span>
                                        <div
                                            className={`p-4 bg-white border-2 rounded-lg shadow-sm w-48 text-center cursor-pointer transition-all ${selectedNode === 'close' ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-300 hover:border-indigo-400'}`}
                                            onClick={() => setSelectedNode('close')}
                                        >
                                            <p className="font-bold text-slate-800">Close Ticket</p>
                                            <p className="text-xs text-slate-500">Mark as False Positive</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Sidebar Panel */}
                        {selectedNode && (
                            <div className="w-80 bg-white border-l border-slate-200 p-6 shadow-xl animate-in slide-in-from-right-20">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-slate-900">Node Properties</h3>
                                    <Badge variant="outline">{selectedNode.toUpperCase()}</Badge>
                                </div>

                                {selectedNode === 'trigger' && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-500">Integration Source</label>
                                            <select className="w-full text-sm p-2 border rounded bg-slate-50">
                                                <option>IronScales Email Security</option>
                                                <option>Office 365</option>
                                                <option>Google Workspace</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-500">Event Type</label>
                                            <Input defaultValue="Phishing Alert" className="text-sm" />
                                        </div>
                                        <div className="pt-4 border-t border-slate-100">
                                            <p className="text-xs text-slate-400 mb-2">Payload Preview</p>
                                            <div className="bg-slate-900 text-slate-300 p-3 rounded text-[10px] font-mono">
                                                {`{
  "sender": "hacker@evil.com",
  "subject": "Urgent Invoice",
  "spf_status": "fail"
}`}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedNode === 'decision' && (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-500">Logic Operator</label>
                                            <select className="w-full text-sm p-2 border rounded bg-slate-50">
                                                <option>Greater Than (&gt;)</option>
                                                <option>Equals (=)</option>
                                                <option>Contains</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-500">Threshold Value</label>
                                            <Input defaultValue="80" className="text-sm" type="number" />
                                        </div>
                                    </div>
                                )}

                                {(selectedNode === 'action' || selectedNode === 'block' || selectedNode === 'close') && (
                                    <div className="space-y-4">
                                        <div className="bg-blue-50 text-blue-700 p-3 rounded text-xs mb-4">
                                            This action will be executed by <strong>Runner_Node_01</strong>.
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-500">Timeout (seconds)</label>
                                            <Input defaultValue="30" className="text-sm" type="number" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-slate-500">Retry Policy</label>
                                            <div className="flex items-center gap-2">
                                                <Switch id="retry" />
                                                <label htmlFor="retry" className="text-sm text-slate-700">Auto-Retry on fail</label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-8 pt-4 border-t border-slate-200">
                                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Save Changes</Button>
                                </div>
                            </div>
                        )}
                    </Card>
                </TabsContent>

                {/* INTEGRATIONS TAB */}
                <TabsContent value="integrations" className="mt-4">
                    <Card className="border-slate-200 bg-white">
                        <CardContent className="p-0">
                            {[
                                { name: 'Active Directory', cat: 'Identity', status: 'Connected', ping: '12ms' },
                                { name: 'CrowdStrike Falcon', cat: 'EDR', status: 'Connected', ping: '45ms' },
                                { name: 'ServiceNow', cat: 'ITSM', status: 'Connected', ping: '120ms' },
                                { name: 'VirusTotal API', cat: 'Intelligence', status: 'Connected', ping: '220ms' },
                                { name: 'Palo Alto Firewall', cat: 'Network', status: 'Error', ping: 'Timeout' },
                            ].map((integ, i) => (
                                <div key={integ.name} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                                            {integ.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-slate-900">{integ.name}</h4>
                                            <p className="text-xs text-slate-500">{integ.cat}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-xs text-slate-400 font-mono">{integ.ping}</span>
                                        <Badge variant="outline" className={integ.status === 'Connected' ? 'bg-emerald-50 text-emerald-600 border-none' : 'bg-red-50 text-red-600 border-none'}>
                                            {integ.status === 'Connected' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                                            {integ.status}
                                        </Badge>
                                        <Button variant="ghost" size="icon"><Settings className="w-4 h-4 text-slate-400" /></Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
