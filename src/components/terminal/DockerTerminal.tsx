'use client';

import { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Send, Trash2 } from 'lucide-react';

interface TerminalLine {
    type: 'command' | 'output' | 'error';
    content: string;
}

export default function DockerTerminal() {
    const [lines, setLines] = useState<TerminalLine[]>([
        { type: 'output', content: '🐳 Docker Ubuntu Terminal - CSIRT Tools' },
        { type: 'output', content: 'Container: csirt-ubuntu' },
        { type: 'output', content: 'Type commands to execute in the container...' },
        { type: 'output', content: '' },
    ]);
    const [command, setCommand] = useState('');
    const [isExecuting, setIsExecuting] = useState(false);
    const terminalEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [lines]);

    const executeCommand = async () => {
        if (!command.trim() || isExecuting) return;

        const cmd = command.trim();
        setCommand('');

        // Add command to terminal
        setLines(prev => [...prev, { type: 'command', content: `$ ${cmd}` }]);
        setIsExecuting(true);

        try {
            const response = await fetch('/api/docker/exec', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: cmd }),
            });

            const data = await response.json();

            if (data.success) {
                if (data.output) {
                    setLines(prev => [...prev, { type: 'output', content: data.output }]);
                }
            } else {
                setLines(prev => [...prev, { type: 'error', content: `Error: ${data.error}` }]);
            }
        } catch (error) {
            setLines(prev => [...prev, { type: 'error', content: `Connection error: ${error}` }]);
        } finally {
            setIsExecuting(false);
        }
    };

    const clearTerminal = () => {
        setLines([
            { type: 'output', content: '🐳 Docker Ubuntu Terminal - CSIRT Tools' },
            { type: 'output', content: 'Container: csirt-ubuntu' },
            { type: 'output', content: '' },
        ]);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            executeCommand();
        }
    };

    return (
        <div className="bg-black/90 rounded-xl border border-cyan-500/30 overflow-hidden shadow-2xl">
            {/* Terminal Header */}
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-cyan-500/30 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TerminalIcon className="w-5 h-5 text-cyan-400" />
                    <span className="font-mono text-sm text-cyan-400">Ubuntu Terminal</span>
                </div>
                <button
                    onClick={clearTerminal}
                    className="p-1.5 rounded hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
                    title="Clear terminal"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Terminal Output */}
            <div className="h-96 overflow-y-auto p-4 font-mono text-sm bg-black/50">
                {lines.map((line, index) => (
                    <div
                        key={index}
                        className={`mb-1 ${line.type === 'command'
                            ? 'text-green-400 font-semibold'
                            : line.type === 'error'
                                ? 'text-red-400'
                                : 'text-gray-300'
                            }`}
                    >
                        {line.content}
                    </div>
                ))}
                {isExecuting && (
                    <div className="text-yellow-400 animate-pulse">
                        Executing...
                    </div>
                )}
                <div ref={terminalEndRef} />
            </div>

            {/* Terminal Input */}
            <div className="border-t border-cyan-500/30 bg-black/70 p-3">
                <div className="flex items-center gap-2">
                    <span className="text-green-400 font-mono text-sm">$</span>
                    <input
                        type="text"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter command (e.g., /scripts/nmap_scan.sh microsoft.com quick, nmap --version)"
                        disabled={isExecuting}
                        className="flex-1 bg-transparent border-none outline-none text-white font-mono text-sm placeholder-zinc-600"
                    />
                    <button
                        onClick={executeCommand}
                        disabled={isExecuting || !command.trim()}
                        className="p-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Execute command"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <div className="mt-2 text-xs text-zinc-500 font-mono">
                    Quick: <span className="text-cyan-400">/scripts/nmap_scan.sh microsoft.com quick</span> | <span className="text-cyan-400">nmap --version</span> | <span className="text-cyan-400">ls /scripts</span>
                </div>
            </div>
        </div>
    );
}
