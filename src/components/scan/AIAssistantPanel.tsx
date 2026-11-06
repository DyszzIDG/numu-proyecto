'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import ToolSelector from '@/components/tools/ToolSelector';
import ScanConfigForm from '@/components/tools/ScanConfigForm';

interface AIAssistantPanelProps {
    onExecute: (config: any) => Promise<void>;
    loading: boolean;
}

export default function AIAssistantPanel({ onExecute, loading }: AIAssistantPanelProps) {
    const [selectedTool, setSelectedTool] = useState('');

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Ciber-Asistente IA
                </h2>
                <p className="text-zinc-500">Describe tu objetivo en lenguaje natural. La IA configurará el escaneo.</p>
            </div>

            {!selectedTool ? (
                <ToolSelector onToolSelect={setSelectedTool} selectedTool={selectedTool} />
            ) : (
                <div className="max-w-3xl mx-auto bg-white/5 rounded-2xl p-6 border border-white/10">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold flex items-center gap-2 text-white">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                            Configurando {selectedTool.toUpperCase()}
                        </h3>
                        <button onClick={() => setSelectedTool('')} className="text-xs text-zinc-500 hover:text-white transition-colors">Cambiar Herramienta</button>
                    </div>
                    <ScanConfigForm
                        tool={selectedTool}
                        onSubmit={onExecute}
                        loading={loading}
                    />
                </div>
            )}
        </div>
    );
}
