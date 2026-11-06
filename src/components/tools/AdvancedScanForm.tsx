'use client';

import { useState } from 'react';
import { Terminal, Play, Loader2, Sparkles, Wand2, Monitor, Server, Shield, Clock, FileCode, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdvancedScanFormProps {
    tool: string;
    onSubmit: (config: any) => void;
    loading?: boolean;
}

export default function AdvancedScanForm({ tool, onSubmit, loading = false }: AdvancedScanFormProps) {
    // Form State
    const [target, setTarget] = useState('');
    const [profile, setProfile] = useState('');
    const [ports, setPorts] = useState('');
    const [serviceDetection, setServiceDetection] = useState(false);
    const [osDetection, setOsDetection] = useState(false);
    const [timing, setTiming] = useState('T4');
    const [defaultScripts, setDefaultScripts] = useState(false);
    const [customArgs, setCustomArgs] = useState('');

    // AI Assist State
    const [showAIPrompt, setShowAIPrompt] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isThinking, setIsThinking] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            tool,
            target,
            customParams: generateFlags()
        });
    };

    const generateFlags = () => {
        let flags = [];
        if (profile === 'quick') flags.push('-F');
        if (profile === 'full') flags.push('-p-');
        if (profile === 'stealth') flags.push('-sS');

        if (ports && profile !== 'full') flags.push(`-p ${ports}`);
        if (serviceDetection) flags.push('-sV');
        if (osDetection) flags.push('-O');
        if (timing) flags.push(`-${timing}`);
        if (defaultScripts) flags.push('-sC');
        if (customArgs) flags.push(customArgs);

        return flags.join(' ');
    };

    // Simple heuristic parser for AI Assist
    const handleAIAssist = async () => {
        if (!aiPrompt) return;
        setIsThinking(true);

        // Simulate AI delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const promptLower = aiPrompt.toLowerCase();

        // Target Extraction
        const targetMatch = aiPrompt.match(/\b((?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}|(?:\d{1,3}\.){3}\d{1,3}|localhost)\b/);
        if (targetMatch) setTarget(targetMatch[0]);

        // Profile / Scan Type
        if (promptLower.includes('quick') || promptLower.includes('fast')) setProfile('quick');
        else if (promptLower.includes('full') || promptLower.includes('all ports')) setProfile('full');
        else if (promptLower.includes('stealth')) setProfile('stealth');
        else setProfile('custom');

        // Features
        if (promptLower.includes('service') || promptLower.includes('version')) setServiceDetection(true);
        if (promptLower.includes('os') || promptLower.includes('operating system')) setOsDetection(true);
        if (promptLower.includes('script') || promptLower.includes('vuln')) setDefaultScripts(true);

        // Timing
        if (promptLower.includes('slow') || promptLower.includes('stealth')) setTiming('T2');
        else if (promptLower.includes('fast') || promptLower.includes('aggressive')) setTiming('T4');
        else if (promptLower.includes('insane')) setTiming('T5');

        // Ports
        const portMatch = aiPrompt.match(/ports?\s+([0-9,\-]+)/i);
        if (portMatch) setPorts(portMatch[1]);

        setIsThinking(false);
        setShowAIPrompt(false);
        setAiPrompt('');
    };

    return (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 relative">

            {/* AI Assist Toggle */}
            <div className="absolute top-6 right-6 z-10">
                <button
                    onClick={() => setShowAIPrompt(!showAIPrompt)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg text-xs font-medium hover:bg-purple-500/20 transition-all shadow-[0_0_10px_rgba(168,85,247,0.1)]"
                >
                    <Sparkles className="w-3 h-3" />
                    AI Assist
                </button>
            </div>

            {/* Header */}
            <div className="mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                    <Terminal className="w-5 h-5 text-gray-300" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Nmap</h3>
                    <p className="text-xs text-gray-500">Network scanner for port discovery and service detection</p>
                </div>
                <div className="ml-auto flex gap-2">
                    <div className="px-2 py-1 bg-cyan-900/20 border border-cyan-500/20 text-cyan-400 rounded text-[10px] font-mono flex items-center gap-1">
                        <Monitor className="w-3 h-3" /> Docker
                    </div>
                </div>
            </div>

            {/* AI Prompt Input */}
            <AnimatePresence>
                {showAIPrompt && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, mb: 0 }}
                        animate={{ opacity: 1, height: 'auto', mb: 24 }}
                        exit={{ opacity: 0, height: 0, mb: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-purple-900/10 border border-purple-500/20 rounded-xl p-4">
                            <label className="block text-sm font-medium text-purple-300 mb-2 flex items-center gap-2">
                                <Wand2 className="w-4 h-4" />
                                Describe tu escaneo para autocompletar
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    placeholder="ej. Escaneo rápido de servicios en 192.168.1.1"
                                    className="flex-1 bg-black/50 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAIAssist()}
                                />
                                <button
                                    onClick={handleAIAssist}
                                    disabled={isThinking || !aiPrompt}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg disabled:opacity-50"
                                >
                                    {isThinking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* 1. Target */}
                <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">
                        Target <span className="text-red-500">*</span>
                    </label>
                    <p className="text-[10px] text-gray-500 mb-2">Domain, IP address, or range (e.g., numu.group, 192.168.1.1)</p>
                    <input
                        type="text"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        placeholder="example.com or 192.168.1.1"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white active:ring-1 active:ring-white/20 outline-none focus:border-white/20 transition-all font-mono text-sm"
                    />
                </div>

                {/* 2. Scan Profile */}
                <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">
                        Scan Profile <span className="text-red-500">*</span>
                    </label>
                    <p className="text-[10px] text-gray-500 mb-2">Select a scan profile or customize your own</p>
                    <select
                        value={profile}
                        onChange={(e) => setProfile(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-white/20 text-sm [&>option]:bg-[#0A0A0A] [&>option]:text-white"
                    >
                        <option value="custom" className="bg-[#0A0A0A] text-white">Custom Scan</option>
                        <option value="quick" className="bg-[#0A0A0A] text-white">⚡ Quick Scan (Fast, Top 100 ports)</option>
                        <option value="full" className="bg-[#0A0A0A] text-white">🔍 Full Port Scan (All 65535 ports)</option>
                        <option value="stealth" className="bg-[#0A0A0A] text-white">👻 Stealth Scan (SYN Scan)</option>
                        <option value="vuln" className="bg-[#0A0A0A] text-white">☢️ Vulnerability Scan</option>
                    </select>
                </div>

                {/* 3. Ports */}
                <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">Specific Ports</label>
                    <p className="text-[10px] text-gray-500 mb-2">Specific ports (e.g., 80,443) or range. Overrides profile default.</p>
                    <input
                        type="text"
                        value={ports}
                        onChange={(e) => setPorts(e.target.value)}
                        placeholder="80,443,8080 or 1-1000"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-white/20 font-mono text-sm"
                    />
                </div>

                {/* 4. Toggles */}
                <div className="space-y-4 pt-2">
                    <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1 uppercase tracking-wide">Service Version Detection</label>
                        <p className="text-[10px] text-gray-500 mb-2">Probe open ports to determine service/version info (-sV)</p>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${serviceDetection ? 'bg-purple-600 border-purple-600' : 'bg-transparent border-white/20 group-hover:border-white/40'}`}>
                                {serviceDetection && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <input type="checkbox" checked={serviceDetection} onChange={(e) => setServiceDetection(e.target.checked)} className="hidden" />
                            <span className="text-sm text-gray-300">Enable Service Version Detection</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1 uppercase tracking-wide">OS Detection</label>
                        <p className="text-[10px] text-gray-500 mb-2">Enable OS detection (-O)</p>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${osDetection ? 'bg-purple-600 border-purple-600' : 'bg-transparent border-white/20 group-hover:border-white/40'}`}>
                                {osDetection && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <input type="checkbox" checked={osDetection} onChange={(e) => setOsDetection(e.target.checked)} className="hidden" />
                            <span className="text-sm text-gray-300">Enable OS Detection</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1 uppercase tracking-wide">Default Scripts</label>
                        <p className="text-[10px] text-gray-500 mb-2">Run default NSE scripts (-sC)</p>
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${defaultScripts ? 'bg-purple-600 border-purple-600' : 'bg-transparent border-white/20 group-hover:border-white/40'}`}>
                                {defaultScripts && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <input type="checkbox" checked={defaultScripts} onChange={(e) => setDefaultScripts(e.target.checked)} className="hidden" />
                            <span className="text-sm text-gray-300">Enable Default Scripts</span>
                        </label>
                    </div>
                </div>

                {/* 5. Custom Arguments */}
                <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5 uppercase tracking-wide">Custom Arguments</label>
                    <p className="text-[10px] text-gray-500 mb-2">Additional Nmap arguments (Advanced)</p>
                    <input
                        type="text"
                        value={customArgs}
                        onChange={(e) => setCustomArgs(e.target.value)}
                        placeholder="--script=auth"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-green-400 font-mono text-sm outline-none focus:border-white/20"
                    />
                </div>

                {/* Execute Button */}
                <button
                    type="submit"
                    disabled={loading || !target}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                    Execute Nmap
                </button>

                <div className="bg-blue-900/10 border border-blue-500/20 rounded-lg p-3 flex items-start gap-3">
                    <Clock className="w-4 h-4 text-blue-400 mt-0.5" />
                    <p className="text-xs text-blue-200">
                        <strong>Tip:</strong> All required fields must be filled before execution. Estimated duration: ~1 minutes.
                    </p>
                </div>

            </form>
        </div>
    );
}
