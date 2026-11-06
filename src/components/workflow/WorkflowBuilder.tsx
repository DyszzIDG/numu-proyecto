'use client';

import React, { useState } from 'react';
import { Workflow, Plus, Play, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { WorkflowEngine } from '@/lib/ai/workflow-engine';

interface WorkflowBuilderProps {
    onClose: () => void;
    onExecute: (workflow: any) => void;
}

export function WorkflowBuilder({ onClose, onExecute }: WorkflowBuilderProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<'web-full' | 'network-full' | 'quick-recon' | null>(null);
    const [workflow, setWorkflow] = useState<any>(null);
    const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

    const templates = [
        {
            id: 'web-full',
            name: 'Full Web Application Scan',
            description: 'Comprehensive web security assessment',
            icon: '🕷️',
            steps: 5
        },
        {
            id: 'network-full',
            name: 'Full Network Scan',
            description: 'Complete network reconnaissance',
            icon: '🗺️',
            steps: 2
        },
        {
            id: 'quick-recon',
            name: 'Quick Reconnaissance',
            description: 'Fast initial recon',
            icon: '⚡',
            steps: 3
        }
    ];

    const loadTemplate = (type: any) => {
        const wf = WorkflowEngine.createWorkflowTemplate(type);
        setWorkflow(wf);
        setSelectedTemplate(type);
    };

    const toggleStep = (stepId: string) => {
        const newExpanded = new Set(expandedSteps);
        if (newExpanded.has(stepId)) {
            newExpanded.delete(stepId);
        } else {
            newExpanded.add(stepId);
        }
        setExpandedSteps(newExpanded);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-slate-900 rounded-lg border border-slate-800 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Workflow className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Workflow Builder</h2>
                            <p className="text-slate-400 text-sm">Create automated scan sequences</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">

                    {!workflow ? (
                        // Template Selection
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold mb-4">Choose a Template</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {templates.map(template => (
                                    <button
                                        key={template.id}
                                        onClick={() => loadTemplate(template.id as any)}
                                        className="p-6 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500 rounded-lg text-left transition group"
                                    >
                                        <div className="text-4xl mb-3">{template.icon}</div>
                                        <h4 className="font-bold mb-2 group-hover:text-cyan-400 transition">
                                            {template.name}
                                        </h4>
                                        <p className="text-sm text-slate-400 mb-3">{template.description}</p>
                                        <div className="text-xs text-slate-500">
                                            {template.steps} steps
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // Workflow Editor
                        <div className="space-y-6">

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold">{workflow.name}</h3>
                                    <p className="text-sm text-slate-400">{workflow.description}</p>
                                </div>
                                <button
                                    onClick={() => setWorkflow(null)}
                                    className="text-sm text-slate-400 hover:text-white"
                                >
                                    Change Template
                                </button>
                            </div>

                            {/* Workflow Steps */}
                            <div className="space-y-3">
                                {workflow.steps.map((step: any, idx: number) => (
                                    <div
                                        key={step.id}
                                        className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden"
                                    >
                                        <div
                                            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-900 transition"
                                            onClick={() => toggleStep(step.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center text-sm font-bold text-cyan-400">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <div className="font-semibold">{step.tool.toUpperCase()}</div>
                                                    {step.condition && (
                                                        <div className="text-xs text-yellow-400 mt-1">
                                                            ⚠️ Conditional
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {expandedSteps.has(step.id) ? (
                                                <ChevronUp className="w-4 h-4 text-slate-400" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4 text-slate-400" />
                                            )}
                                        </div>

                                        {expandedSteps.has(step.id) && (
                                            <div className="p-4 border-t border-slate-800 bg-slate-900/50 space-y-2 text-sm">
                                                {step.condition && (
                                                    <div>
                                                        <span className="text-slate-400">Condition:</span>
                                                        <code className="ml-2 text-xs text-yellow-400 font-mono">
                                                            {step.condition}
                                                        </code>
                                                    </div>
                                                )}
                                                {step.parameters && Object.keys(step.parameters).length > 0 && (
                                                    <div>
                                                        <span className="text-slate-400">Parameters:</span>
                                                        <pre className="mt-1 text-xs text-slate-300 font-mono bg-black p-2 rounded">
                                                            {JSON.stringify(step.parameters, null, 2)}
                                                        </pre>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-800 flex items-center justify-between">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                    >
                        Cancel
                    </button>
                    {workflow && (
                        <button
                            onClick={() => onExecute(workflow)}
                            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-bold transition flex items-center gap-2"
                        >
                            <Play className="w-4 h-4" />
                            Execute Workflow
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}
