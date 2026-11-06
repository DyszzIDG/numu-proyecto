import { useState } from 'react';
import { Sparkles, Loader2, Send } from 'lucide-react';
import { SecurityTool } from '@/lib/tools/security-tools-db';
import { ToolConfig } from '@/lib/tools/tool-configs';

interface AIPromptInterfaceProps {
    tool: SecurityTool;
    toolConfig?: ToolConfig;
    onExecutionStart: (executionId: string) => void;
}

export default function AIPromptInterface({ tool, toolConfig, onExecutionStart }: AIPromptInterfaceProps) {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/ai/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    toolId: tool.id,
                    userPrompt: prompt,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'AI execution failed');
            }

            onExecutionStart(data.executionId);
        } catch (err: any) {
            setError(err.message || 'Failed to execute command');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 mb-4">
                    <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">AI Command Assistant</h2>
                <p className="text-gray-400">
                    Describe what you want to scan in natural language.
                    <br />
                    Example: <span className="text-cyan-400 italic">"Scan {toolConfig?.examples?.[0]?.parameters?.target || 'example.com'} for vulnerabilities"</span>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="relative">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={`Tell AI how to use ${tool.name}...`}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 pr-32"
                />
                <button
                    type="submit"
                    disabled={loading || !prompt.trim()}
                    className="absolute right-2 top-2 bottom-2 px-4 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Run</span>
                </button>
            </form>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
                    {error}
                </div>
            )}
        </div>
    );
}
