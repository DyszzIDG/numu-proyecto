'use client';

import React from 'react';
import { Brain, Lightbulb, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface AIExplanation {
    toolSelection: {
        chosen: string;
        reasoning: string;
        confidence: number;
        alternatives: Array<{ tool: string; reason: string; score: number }>;
    };
    parameterTuning: {
        flags: string[];
        reasoning: string;
        confidence: number;
    };
    targetAnalysis: {
        type: string;
        characteristics: string[];
        confidence: number;
    };
    riskAssessment: {
        level: 'low' | 'medium' | 'high';
        factors: string[];
        score: number;
    };
}

interface AIExplainabilityPanelProps {
    explanation: AIExplanation;
}

export function AIExplainabilityPanel({ explanation }: AIExplainabilityPanelProps) {
    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 80) return 'text-green-400 bg-green-500/20';
        if (confidence >= 60) return 'text-yellow-400 bg-yellow-500/20';
        return 'text-red-400 bg-red-500/20';
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
            case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
            case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
            default: return 'text-slate-400 bg-slate-800 border-slate-700';
        }
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">AI Decision Explainability</h2>
                    <p className="text-sm text-slate-400">Understanding how the AI made its choices</p>
                </div>
            </div>

            {/* Tool Selection */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-cyan-400" />
                        Tool Selection
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(explanation.toolSelection.confidence)}`}>
                        {explanation.toolSelection.confidence}% confidence
                    </div>
                </div>

                <div className="space-y-4">

                    {/* Chosen Tool */}
                    <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-cyan-400" />
                            <span className="font-bold text-cyan-400">Selected: {explanation.toolSelection.chosen.toUpperCase()}</span>
                        </div>
                        <p className="text-sm text-slate-300">{explanation.toolSelection.reasoning}</p>
                    </div>

                    {/* Alternatives Considered */}
                    <div>
                        <div className="text-sm font-medium text-slate-400 mb-2">Alternatives Considered:</div>
                        <div className="space-y-2">
                            {explanation.toolSelection.alternatives.map((alt, idx) => (
                                <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold">{alt.tool.toUpperCase()}</span>
                                        <span className="text-xs text-slate-400">{alt.score}% match</span>
                                    </div>
                                    <p className="text-sm text-slate-400">{alt.reason}</p>
                                    <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-slate-600 to-slate-500"
                                            style={{ width: `${alt.score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Parameter Tuning */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                        Parameter Optimization
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(explanation.parameterTuning.confidence)}`}>
                        {explanation.parameterTuning.confidence}% confidence
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <div className="text-sm font-medium text-slate-400 mb-2">Optimized Flags:</div>
                        <div className="flex flex-wrap gap-2">
                            {explanation.parameterTuning.flags.map((flag, idx) => (
                                <code key={idx} className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded text-sm font-mono text-purple-400">
                                    {flag}
                                </code>
                            ))}
                        </div>
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded">
                        <p className="text-sm text-slate-300">{explanation.parameterTuning.reasoning}</p>
                    </div>
                </div>
            </div>

            {/* Target Analysis */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-400" />
                        Target Analysis
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(explanation.targetAnalysis.confidence)}`}>
                        {explanation.targetAnalysis.confidence}% confidence
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">Detected Type:</span>
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm font-medium">
                            {explanation.targetAnalysis.type}
                        </span>
                    </div>

                    <div>
                        <div className="text-sm font-medium text-slate-400 mb-2">Characteristics:</div>
                        <div className="space-y-1">
                            {explanation.targetAnalysis.characteristics.map((char, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                                    <span className="text-slate-300">{char}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Risk Assessment */}
            <div className={`p-6 border rounded-lg ${getRiskColor(explanation.riskAssessment.level)}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Risk Assessment</h3>
                    <div className="text-2xl font-bold">{explanation.riskAssessment.score}/100</div>
                </div>

                <div className="mb-4">
                    <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${explanation.riskAssessment.level === 'high' ? 'bg-red-500' :
                                    explanation.riskAssessment.level === 'medium' ? 'bg-yellow-500' :
                                        'bg-green-500'
                                }`}
                            style={{ width: `${explanation.riskAssessment.score}%` }}
                        />
                    </div>
                </div>

                <div>
                    <div className="text-sm font-medium mb-2">Risk Factors:</div>
                    <div className="space-y-1">
                        {explanation.riskAssessment.factors.map((factor, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-current rounded-full" />
                                <span>{factor}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
