'use client';

import React from 'react';
import { Keyboard, X } from 'lucide-react';

interface ShortcutsHelpProps {
    isOpen: boolean;
    onClose: () => void;
}

const shortcuts = [
    { keys: ['Ctrl', 'Enter'], description: 'Execute scan or analyze prompt' },
    { keys: ['Ctrl', 'K'], description: 'Open tool comparison' },
    { keys: ['Ctrl', 'H'], description: 'Toggle history sidebar' },
    { keys: ['Ctrl', 'S'], description: 'Save as favorite' },
    { keys: ['Ctrl', '/'], description: 'Show keyboard shortcuts' },
    { keys: ['Esc'], description: 'Close modals' },
];

export function ShortcutsHelp({ isOpen, onClose }: ShortcutsHelpProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-slate-900 rounded-lg border border-slate-800 max-w-2xl w-full">

                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                            <Keyboard className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
                            <p className="text-sm text-slate-400">Boost your productivity</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-lg transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-3">
                    {shortcuts.map((shortcut, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-slate-950 rounded-lg hover:bg-slate-800 transition"
                        >
                            <span className="text-slate-300">{shortcut.description}</span>
                            <div className="flex items-center gap-1">
                                {shortcut.keys.map((key, keyIdx) => (
                                    <React.Fragment key={keyIdx}>
                                        <kbd className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-sm font-mono text-cyan-400">
                                            {key}
                                        </kbd>
                                        {keyIdx < shortcut.keys.length - 1 && (
                                            <span className="text-slate-600 mx-1">+</span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-slate-950 border-t border-slate-800 text-center text-sm text-slate-400">
                    Press <kbd className="px-2 py-1 bg-slate-800 rounded text-xs font-mono text-cyan-400">Esc</kbd> to close
                </div>

            </div>
        </div>
    );
}
