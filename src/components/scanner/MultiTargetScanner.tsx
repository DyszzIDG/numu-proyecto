'use client';

import React, { useState, useCallback } from 'react';
import { Upload, X, Play, Trash2, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface MultiTargetScannerProps {
    onClose: () => void;
    onExecute: (targets: string[], tool: string, parameters: any) => void;
}

export function MultiTargetScanner({ onClose, onExecute }: MultiTargetScannerProps) {
    const [targets, setTargets] = useState<string[]>([]);
    const [tool, setTool] = useState('nmap');
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target?.result as string;
                const lines = text.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
                setTargets(prev => [...new Set([...prev, ...lines])]);
            };
            reader.readAsText(file);
        }
    }, []);

    const addTarget = (target: string) => {
        if (target && !targets.includes(target)) {
            setTargets([...targets, target]);
        }
    };

    const removeTarget = (index: number) => {
        setTargets(targets.filter((_, i) => i !== index));
    };

    const handleExecute = () => {
        onExecute(targets, tool, {});
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-slate-900 rounded-lg border border-slate-800 max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Multi-Target Scanner</h2>
                        <p className="text-slate-400 text-sm mt-1">Scan multiple targets simultaneously</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Drag & Drop Zone */}
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition ${dragActive
                                ? 'border-cyan-500 bg-cyan-500/10'
                                : 'border-slate-700 hover:border-slate-600'
                            }`}
                    >
                        <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                        <p className="text-lg font-medium mb-2">Drop target list here</p>
                        <p className="text-sm text-slate-400">
                            Or paste targets below (one per line)
                        </p>
                    </div>

                    {/* Manual Input */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Add Targets</label>
                        <textarea
                            placeholder="example.com&#10;192.168.1.1&#10;10.0.0.1"
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition resize-none font-mono text-sm"
                            rows={4}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.ctrlKey) {
                                    const lines = e.currentTarget.value.split('\n').map(l => l.trim()).filter(l => l);
                                    lines.forEach(addTarget);
                                    e.currentTarget.value = '';
                                }
                            }}
                        />
                        <p className="text-xs text-slate-500 mt-1">Press Ctrl+Enter to add all</p>
                    </div>

                    {/* Tool Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Select Tool</label>
                        <select
                            value={tool}
                            onChange={(e) => setTool(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 outline-none transition"
                        >
                            <option value="nmap">Nmap - Port Scanner</option>
                            <option value="nikto">Nikto - Web Scanner</option>
                            <option value="nuclei">Nuclei - Vulnerability Scanner</option>
                            <option value="theharvester">TheHarvester - OSINT</option>
                        </select>
                    </div>

                    {/* Target List */}
                    {targets.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium">
                                    Targets ({targets.length})
                                </label>
                                <button
                                    onClick={() => setTargets([])}
                                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                                >
                                    <Trash2 className="w-3 h-3" />
                                    Clear All
                                </button>
                            </div>
                            <div className="max-h-60 overflow-y-auto space-y-2 bg-slate-950 rounded-lg p-3">
                                {targets.map((target, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-800 hover:border-slate-700 transition"
                                    >
                                        <span className="text-sm font-mono text-slate-300">{target}</span>
                                        <button
                                            onClick={() => removeTarget(idx)}
                                            className="p-1 hover:bg-slate-800 rounded transition"
                                        >
                                            <X className="w-4 h-4 text-slate-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-sm text-slate-400">
                        {targets.length} target{targets.length !== 1 ? 's' : ''} ready
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleExecute}
                            disabled={targets.length === 0}
                            className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 rounded-lg font-bold transition flex items-center gap-2"
                        >
                            <Play className="w-4 h-4" />
                            Start Scan
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
