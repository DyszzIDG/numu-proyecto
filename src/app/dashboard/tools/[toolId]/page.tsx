'use client';

/**
 * Individual Tool Panel Page
 * Dynamic route for each security tool with AI integration
 */

import { useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, Settings, Play, History, FileText } from 'lucide-react';
import { getToolById } from '@/lib/tools/security-tools-db';
import { getToolConfig } from '@/lib/tools/tool-configs';
import ToolConfigPanel from '@/components/tools/ToolConfigPanel';
import AIPromptInterface from '@/components/tools/AIPromptInterface';
import ScanResultsPanel from '@/components/tools/ScanResultsPanel';
import ScanHistoryPanel from '@/components/tools/ScanHistoryPanel';

interface PageProps {
    params: { toolId: string };
}

type TabType = 'ai' | 'manual' | 'results' | 'history';

export default function ToolPage({ params }: PageProps) {
    const { toolId } = params;
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('manual'); // Default to manual for faster access
    const [executionId, setExecutionId] = useState<string | null>(null);
    const [execution, setExecution] = useState<any>(null);

    const tool = getToolById(toolId);
    const toolConfig = getToolConfig(toolId);

    // Polling effect
    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (executionId) {
            const fetchExecution = async () => {
                try {
                    const response = await fetch(`/api/tools/execution/${executionId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setExecution(data);

                        // Stop polling if completed or failed
                        if (data.status === 'completed' || data.status === 'failed') {
                            clearInterval(intervalId);
                        }
                    } else {
                        // Fallback if detail endpoint doesn't exist, maybe list logic?
                        // For now assuming the endpoint I used in code exists or will be created.
                    }
                } catch (error) {
                    console.error('Failed to fetch execution:', error);
                }
            };

            // Initial fetch
            fetchExecution();

            // Poll every 3 seconds
            intervalId = setInterval(fetchExecution, 3000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [executionId]);

    if (!tool) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center">
                        <h1 className="text-2xl font-bold text-red-400 mb-2">Tool Not Found</h1>
                        <p className="text-gray-400 mb-4">
                            The tool "{toolId}" does not exist.
                        </p>
                        <button
                            onClick={() => router.push('/dashboard/ai-scans')}
                            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                            Back to Tools
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!toolConfig) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-8 text-center">
                        <h1 className="text-2xl font-bold text-yellow-400 mb-2">Configuration Not Available</h1>
                        <p className="text-gray-400 mb-4">
                            The tool "{tool.name}" is not yet configured for individual execution.
                            Please use the AI Scans page for now.
                        </p>
                        <button
                            onClick={() => router.push('/dashboard/ai-scans')}
                            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                            Go to AI Scans
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const tabs: { id: TabType; label: string; icon: any }[] = [
        { id: 'ai', label: 'AI Assistant', icon: Sparkles },
        { id: 'manual', label: 'Manual Config', icon: Settings },
        { id: 'results', label: 'Results', icon: FileText },
        { id: 'history', label: 'History', icon: History },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/dashboard/ai-scans')}
                        className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Tools
                    </button>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">{tool.name}</h1>
                            <p className="text-gray-400 text-lg">{tool.description}</p>
                            <div className="flex items-center gap-3 mt-4">
                                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full text-sm">
                                    {tool.category}
                                </span>
                                <span className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-full text-sm">
                                    {tool.difficulty}
                                </span>
                                {tool.requiresDocker && (
                                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full text-sm">
                                        🐳 Docker
                                    </span>
                                )}
                                {tool.requiresApiKey && (
                                    <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded-full text-sm">
                                        🔑 API Key Required
                                    </span>
                                )}
                            </div>
                        </div>

                        {toolConfig.documentationUrl && (
                            <a
                                href={toolConfig.documentationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors"
                            >
                                📚 Documentation
                            </a>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-8">
                    <div className="flex border-b border-white/10">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        flex-1 flex items-center justify-center gap-2 px-6 py-4 transition-all
                                        ${isActive
                                            ? 'bg-purple-500/20 text-white border-b-2 border-purple-500'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }
                                    `}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-semibold">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'ai' && (
                            <AIPromptInterface
                                tool={tool}
                                toolConfig={toolConfig}
                                onExecutionStart={(id: string) => {
                                    setExecutionId(id);
                                    setActiveTab('results');
                                }}
                            />
                        )}

                        {activeTab === 'manual' && (
                            <ToolConfigPanel
                                tool={tool}
                                toolConfig={toolConfig}
                                onExecutionStart={(id: string) => {
                                    setExecutionId(id);
                                    setActiveTab('results');
                                }}
                            />
                        )}

                        {activeTab === 'results' && (
                            <div className="min-h-[400px]">
                                {executionId ? (
                                    <div className="space-y-4">
                                        {/* Status Header */}
                                        <div className="flex items-center justify-between bg-slate-800 p-4 rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-3 h-3 rounded-full animate-pulse ${execution?.status === 'completed' ? 'bg-green-500' :
                                                    execution?.status === 'failed' ? 'bg-red-500' :
                                                        'bg-blue-500'
                                                    }`} />
                                                <span className="text-white font-mono">
                                                    Status: <span className="uppercase">{execution?.status || 'INITIALIZING'}</span>
                                                </span>
                                            </div>
                                            <div className="text-slate-400 text-sm">
                                                ID: {executionId}
                                            </div>
                                        </div>

                                        <ScanResultsPanel toolId={toolId} execution={execution} />
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-white mb-2">
                                            No Results Yet
                                        </h3>
                                        <p className="text-gray-400 mb-6">
                                            Execute a scan to see results here
                                        </p>
                                        <button
                                            onClick={() => setActiveTab('manual')}
                                            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors inline-flex items-center gap-2"
                                        >
                                            <Play className="w-5 h-5" />
                                            Start New Scan
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <ScanHistoryPanel
                                toolId={toolId}
                                onSelectExecution={(execution) => {
                                    setExecutionId(execution.id);
                                    setActiveTab('results');
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Examples Section */}
                {toolConfig.examples.length > 0 && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-4">💡 Example Use Cases</h2>
                        <div className="space-y-4">
                            {toolConfig.examples.map((example, index) => (
                                <div
                                    key={index}
                                    className="bg-white/5 border border-white/10 rounded-lg p-4"
                                >
                                    <h3 className="text-white font-semibold mb-2">
                                        {example.description}
                                    </h3>
                                    <div className="mb-2">
                                        <span className="text-sm text-gray-400">Prompt:</span>
                                        <p className="text-cyan-400 italic">"{example.prompt}"</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-400">Command:</span>
                                        <code className="block mt-1 p-2 bg-black/30 rounded text-green-400 text-sm font-mono">
                                            {example.command}
                                        </code>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
