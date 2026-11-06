'use client';

/**
 * Tool Configuration Panel
 * Dynamic form for manual tool configuration
 */

import { useState } from 'react';
import { Play, Loader2, AlertCircle } from 'lucide-react';
import type { SecurityTool } from '@/lib/tools/security-tools-db';
import type { ToolConfig, ToolParameter } from '@/lib/tools/tool-configs';

interface ToolConfigPanelProps {
    tool: SecurityTool;
    toolConfig: ToolConfig;
    onExecutionStart: (executionId: string) => void;
}

export default function ToolConfigPanel({ tool, toolConfig, onExecutionStart }: ToolConfigPanelProps) {
    const [parameters, setParameters] = useState<Record<string, any>>(() => {
        // Initialize with default values
        const defaults: Record<string, any> = {};
        toolConfig.parameters.forEach((param) => {
            if (param.default !== undefined) {
                defaults[param.id] = param.default;
            }
        });
        return defaults;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleParameterChange = (paramId: string, value: any) => {
        setParameters((prev) => ({
            ...prev,
            [paramId]: value,
        }));
    };

    const validateParameters = (): boolean => {
        for (const param of toolConfig.parameters) {
            if (param.required && !parameters[param.id]) {
                setError(`${param.name} is required`);
                return false;
            }

            if (param.validation && parameters[param.id]) {
                const value = parameters[param.id];

                // Pattern validation
                if (param.validation.pattern) {
                    const regex = new RegExp(param.validation.pattern);
                    if (!regex.test(value)) {
                        setError(`${param.name} has invalid format`);
                        return false;
                    }
                }

                // Number range validation
                if (param.type === 'number') {
                    const numValue = Number(value);
                    if (param.validation.min !== undefined && numValue < param.validation.min) {
                        setError(`${param.name} must be at least ${param.validation.min}`);
                        return false;
                    }
                    if (param.validation.max !== undefined && numValue > param.validation.max) {
                        setError(`${param.name} must be at most ${param.validation.max}`);
                        return false;
                    }
                }
            }
        }

        setError(null);
        return true;
    };

    const handleExecute = async () => {
        if (!validateParameters()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Extract target from parameters based on common keys
            const target = parameters.target || parameters.host || parameters.url || parameters.domain || '';

            // Ensure options object has 'target' property as required by generators
            const options = {
                ...parameters,
                target: target,
            };

            const response = await fetch('/api/tools/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tool: tool.id,
                    target: target,
                    options: options,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Execution failed');
            }

            onExecutionStart(data.executionId);
        } catch (err: any) {
            setError(err.message || 'Failed to execute tool');
        } finally {
            setLoading(false);
        }
    };

    const renderParameter = (param: ToolParameter) => {
        const value = parameters[param.id] ?? '';

        switch (param.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleParameterChange(param.id, e.target.value)}
                        placeholder={param.placeholder}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                );

            case 'textarea':
                return (
                    <textarea
                        value={value}
                        onChange={(e) => handleParameterChange(param.id, e.target.value)}
                        placeholder={param.placeholder}
                        rows={4}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                );

            case 'number':
                return (
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => handleParameterChange(param.id, e.target.value)}
                        min={param.validation?.min}
                        max={param.validation?.max}
                        placeholder={param.placeholder}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                );

            case 'select':
                return (
                    <select
                        value={value}
                        onChange={(e) => handleParameterChange(param.id, e.target.value)}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    >
                        <option value="">Select {param.name}</option>
                        {param.options?.map((option) => (
                            <option key={option} value={option} className="bg-gray-800">
                                {option}
                            </option>
                        ))}
                    </select>
                );

            case 'boolean':
                return (
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={value === true}
                            onChange={(e) => handleParameterChange(param.id, e.target.checked)}
                            className="w-5 h-5 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-2 focus:ring-purple-500/50"
                        />
                        <span className="text-gray-400">Enable {param.name}</span>
                    </label>
                );

            case 'file':
                return (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleParameterChange(param.id, e.target.value)}
                        placeholder={param.placeholder || 'Enter file path'}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Error Display */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-400">{error}</p>
                </div>
            )}

            {/* Parameters Form */}
            <div className="space-y-4">
                {toolConfig.parameters.map((param) => (
                    <div key={param.id}>
                        <label className="block mb-2">
                            <span className="text-white font-semibold">
                                {param.name}
                                {param.required && <span className="text-red-400 ml-1">*</span>}
                            </span>
                            <span className="text-sm text-gray-400 block mt-1">
                                {param.description}
                            </span>
                        </label>
                        {renderParameter(param)}
                    </div>
                ))}
            </div>

            {/* Execute Button */}
            <div className="pt-4 border-t border-white/10">
                <button
                    onClick={handleExecute}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Executing...
                        </>
                    ) : (
                        <>
                            <Play className="w-5 h-5" />
                            Execute {tool.name}
                        </>
                    )}
                </button>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-400">
                    💡 <strong>Tip:</strong> All required fields must be filled before execution.
                    {toolConfig.estimatedDuration && (
                        <> Estimated duration: ~{Math.ceil(toolConfig.estimatedDuration / 60)} minutes.</>
                    )}
                </p>
            </div>
        </div>
    );
}
