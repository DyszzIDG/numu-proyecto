'use client';

/**
 * Tool Selector Component
 * Allows users to select security tools with button-based interface
 * Now supports 50+ tools organized by categories
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Search, Zap, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { SECURITY_TOOLS, TOOL_CATEGORIES, getCategoriesWithCounts, searchTools, getToolsByCategory } from '@/lib/tools/security-tools-db';

interface QuotaStatus {
    plan: 'free' | 'premium';
    quota: number;
    used: number;
    remaining: number;
    resetDate: Date;
    canExecute: boolean;
}

interface ToolSelectorProps {
    onToolSelect?: (toolId: string) => void;
    selectedTool?: string;
}

export default function ToolSelector({ onToolSelect, selectedTool }: ToolSelectorProps) {
    const router = useRouter();
    const [quotaStatus, setQuotaStatus] = useState<QuotaStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchQuotaStatus();
        // Expand first category by default
        setExpandedCategories(new Set([TOOL_CATEGORIES.SCANNING]));
    }, []);

    const fetchQuotaStatus = async () => {
        try {
            const response = await fetch('/api/subscription/check-quota');
            if (response.ok) {
                const data = await response.json();
                setQuotaStatus(data.quotaStatus);
            }
        } catch (error) {
            console.error('Error fetching quota:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCategory = (category: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(category)) {
            newExpanded.delete(category);
        } else {
            newExpanded.add(category);
        }
        setExpandedCategories(newExpanded);
    };

    const getDifficultyColor = (difficulty: string) => {
        const colors: Record<string, string> = {
            beginner: 'bg-green-500/10 text-green-400 border-green-500/30',
            intermediate: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
            advanced: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
            expert: 'bg-red-500/10 text-red-400 border-red-500/30',
        };
        return colors[difficulty] || colors.beginner;
    };

    const filteredTools = searchQuery ? searchTools(searchQuery) : SECURITY_TOOLS;
    const categories = getCategoriesWithCounts();

    return (
        <div className="space-y-6">
            {/* Quota Display */}
            {quotaStatus && (
                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            <span className="text-white font-semibold">
                                {quotaStatus.plan === 'premium' ? 'Premium Plan' : 'Free Plan'}
                            </span>
                        </div>
                        {quotaStatus.plan === 'free' && (
                            <a
                                href="/dashboard/subscription"
                                className="text-sm text-blue-400 hover:text-blue-300 underline"
                            >
                                Upgrade to Premium
                            </a>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Scans Used</span>
                                <span className="text-white font-mono">
                                    {quotaStatus.plan === 'premium'
                                        ? 'Unlimited'
                                        : `${quotaStatus.used} / ${quotaStatus.quota}`}
                                </span>
                            </div>
                            {quotaStatus.plan === 'free' && (
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                                        style={{
                                            width: `${(quotaStatus.used / quotaStatus.quota) * 100}%`,
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        {quotaStatus.plan === 'free' && (
                            <div className="text-right">
                                <div className="text-sm text-gray-400">Remaining</div>
                                <div className="text-2xl font-bold text-white">
                                    {quotaStatus.remaining}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tools by name or tags..."
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                />
            </div>

            {/* Tools by Category */}
            {!searchQuery ? (
                <div className="space-y-4">
                    {categories.map(({ category, count }) => {
                        const isExpanded = expandedCategories.has(category);
                        const categoryTools = getToolsByCategory(category);

                        return (
                            <div key={category} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => toggleCategory(category)}
                                    className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-5 h-5 text-cyan-400" />
                                        <span className="text-white font-semibold">{category}</span>
                                        <span className="text-sm text-gray-400">({count} tools)</span>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>

                                {isExpanded && (
                                    <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {categoryTools.map((tool) => {
                                            const isSelected = selectedTool === tool.id;
                                            const isDisabled = quotaStatus ? !quotaStatus.canExecute : false;

                                            return (
                                                <button
                                                    key={tool.id}
                                                    onClick={() => {
                                                        if (!isDisabled) {
                                                            if (onToolSelect) {
                                                                onToolSelect(tool.id);
                                                            } else {
                                                                router.push(`/dashboard/tools/${tool.id}`);
                                                            }
                                                        }
                                                    }}
                                                    disabled={isDisabled}
                                                    className={`
                                                        p-4 rounded-lg border text-left transition-all
                                                        ${isSelected ? 'bg-purple-500/20 border-purple-500/50 ring-2 ring-purple-500/30' : 'bg-white/5 border-white/10'}
                                                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 hover:border-white/20 cursor-pointer'}
                                                    `}
                                                >
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h4 className="text-white font-semibold text-sm">{tool.name}</h4>
                                                        {tool.requiresApiKey && (
                                                            <Lock className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                                                        {tool.description}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xs px-2 py-0.5 rounded border ${getDifficultyColor(tool.difficulty)}`}>
                                                            {tool.difficulty}
                                                        </span>
                                                        {tool.requiresDocker && (
                                                            <span className="text-xs text-gray-500">🐳 Docker</span>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                // Search Results
                <div>
                    <div className="mb-4 text-sm text-gray-400">
                        Found {filteredTools.length} tool(s)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredTools.map((tool) => {
                            const isSelected = selectedTool === tool.id;
                            const isDisabled = quotaStatus ? !quotaStatus.canExecute : false;

                            return (
                                <button
                                    key={tool.id}
                                    onClick={() => {
                                        if (!isDisabled) {
                                            if (onToolSelect) {
                                                onToolSelect(tool.id);
                                            } else {
                                                router.push(`/dashboard/tools/${tool.id}`);
                                            }
                                        }
                                    }}
                                    disabled={isDisabled}
                                    className={`
                                        p-4 rounded-lg border text-left transition-all
                                        ${isSelected ? 'bg-purple-500/20 border-purple-500/50 ring-2 ring-purple-500/30' : 'bg-white/5 border-white/10'}
                                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10 hover:border-white/20 cursor-pointer'}
                                    `}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h4 className="text-white font-semibold text-sm">{tool.name}</h4>
                                        {tool.requiresApiKey && (
                                            <Lock className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                                        {tool.description}
                                    </p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`text-xs px-2 py-0.5 rounded border ${getDifficultyColor(tool.difficulty)}`}>
                                            {tool.difficulty}
                                        </span>
                                        <span className="text-xs text-gray-500">{tool.category}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Help Text */}
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-sm text-gray-400">
                    💡 <strong className="text-white">Tip:</strong> Select a tool above to start scanning.
                    You can describe what you want to scan in natural language, and our AI will generate
                    the appropriate command for you.
                </p>
            </div>
        </div>
    );
}
