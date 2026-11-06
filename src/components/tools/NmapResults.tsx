import { useState } from 'react';
import { NmapResult } from '@/lib/parsers/nmap-parser';
import { Download, Monitor, Shield, Server, Activity, Sparkles, FileText, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import AIInsights from '@/components/results/AIInsights';

interface NmapResultsProps {
    result: any;
    rawOutput?: string;
    aiAnalysis?: any;
    executionId?: string;
}

export default function NmapResults({ result, rawOutput, aiAnalysis: initialAnalysis, executionId }: NmapResultsProps) {
    const [analysis, setAnalysis] = useState(initialAnalysis);
    const [analyzing, setAnalyzing] = useState(false);

    // Parse if it's a string
    let data: NmapResult | null = null;
    try {
        data = typeof result === 'string' ? JSON.parse(result) : result;
    } catch (e) {
        console.error('Error parsing Nmap result', e);
    }

    const { summary, hosts = [] } = data || {};

    const handleAnalyze = async () => {
        if (!executionId) return;
        setAnalyzing(true);
        try {
            const res = await fetch('/api/ai/analyze-scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    executionId,
                    tool: 'nmap',
                    rawOutput,
                    jsonResult: data
                })
            });
            const newAnalysis = await res.json();
            setAnalysis(newAnalysis);
            // Auto-download PDF after analysis
            generatePDF(newAnalysis);
        } catch (error) {
            console.error('Analysis failed', error);
        } finally {
            setAnalyzing(false);
        }
    };

    const generatePDF = (analysisData?: any) => {
        // Use passed data or fall back to state
        const activeAnalysis = analysisData || analysis;

        const doc = new jsPDF();
        const margin = 20;
        let y = 20;

        // Header
        doc.setFillColor(10, 10, 10);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.text("NUMU CyberSecurity Report", margin, 28);

        y = 50;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleString()}`, margin, y);
        y += 10;
        doc.text(`Tool: NMAP Network Scanner`, margin, y);
        y += 20;

        // Executive Summary from AI
        if (activeAnalysis?.summary) {
            doc.setFontSize(16);
            doc.setTextColor(59, 130, 246); // Blue
            doc.text("AI Executive Summary", margin, y);
            y += 10;

            doc.setFontSize(11);
            doc.setTextColor(60, 60, 60);
            const splitSummary = doc.splitTextToSize(activeAnalysis.summary, 170);
            doc.text(splitSummary, margin, y);
            y += (splitSummary.length * 7) + 10;
        }

        // Host Summary
        if (data) {
            doc.setFontSize(16);
            doc.setTextColor(59, 130, 246);
            doc.text("Scan Overview", margin, y);
            y += 10;

            const stats = [
                `Hosts Up: ${summary?.hostsUp || 0}`,
                `Open Ports: ${summary?.openPorts || 0}`,
                `Total Hosts: ${summary?.totalHosts || 0}`
            ];

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(12);
            stats.forEach(stat => {
                doc.text(`• ${stat}`, margin + 5, y);
                y += 8;
            });
            y += 10;
        }

        // Raw Output Section (if specific data missing)
        if (!data && rawOutput) {
            doc.addPage();
            y = 20;
            doc.setFontSize(16);
            doc.setTextColor(59, 130, 246);
            doc.text("Raw Scan Output", margin, y);
            y += 10;
            doc.setFont("courier", "normal");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);

            const lines = doc.splitTextToSize(rawOutput.replace(/[^\x20-\x7E\n]/g, ''), 170);

            // Simple pagination for raw output
            for (let i = 0; i < lines.length; i++) {
                if (y > 280) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(lines[i], margin, y);
                y += 5;
            }
        }

        doc.save('NUMU_Security_Report.pdf');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Shield className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Scan Results</h3>
                        <p className="text-xs text-slate-400">{executionId || 'Manual Execution'}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    {!analysis && (
                        <button
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all font-medium disabled:opacity-50"
                        >
                            {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            Generar Reporte IA
                        </button>
                    )}
                    <button
                        onClick={() => generatePDF()}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all font-medium border border-white/10"
                    >
                        <FileText className="w-4 h-4 text-blue-400" />
                        Descargar PDF
                    </button>
                </div>
            </div>

            {/* AI Analysis Section */}
            {analysis && (
                <div className="border-t border-white/10 pt-6">
                    <AIInsights analysis={analysis} />
                </div>
            )}

            {/* Raw/Structured Results */}
            {!data && rawOutput ? (
                <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
                    <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span className="text-sm font-mono text-slate-400">RAW TERMINAL OUTPUT</span>
                    </div>
                    <pre className="p-6 text-xs md:text-sm font-mono text-green-400 whitespace-pre-wrap overflow-x-auto max-h-[600px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {rawOutput}
                    </pre>
                </div>
            ) : data ? (
                /* Existing Structured Data View */
                <div className="space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                                <Monitor className="w-5 h-5 text-blue-400" />
                                <span className="text-slate-400 text-sm">Hosts Up</span>
                            </div>
                            <p className="text-2xl font-bold text-white">{summary?.hostsUp || 0}</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="w-5 h-5 text-green-400" />
                                <span className="text-slate-400 text-sm">Open Ports</span>
                            </div>
                            <p className="text-2xl font-bold text-white">{summary?.openPorts || 0}</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-5 h-5 text-red-400" />
                                <span className="text-slate-400 text-sm">Vulnerabilities</span>
                            </div>
                            <p className="text-2xl font-bold text-white">{hosts.reduce((acc: any, host: any) => acc + (host.vulnerabilities?.length || 0), 0)}</p>
                        </div>
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                                <Server className="w-5 h-5 text-purple-400" />
                                <span className="text-slate-400 text-sm">Total Hosts</span>
                            </div>
                            <p className="text-2xl font-bold text-white">{summary?.totalHosts || 0}</p>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-800 text-slate-400 text-sm uppercase">
                                    <tr>
                                        <th className="p-4">Host</th>
                                        <th className="p-4">Port</th>
                                        <th className="p-4">Protocol</th>
                                        <th className="p-4">Service</th>
                                        <th className="p-4">Version</th>
                                        <th className="p-4">State</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {hosts.map((host: any) => (
                                        host.ports.map((port: any, idx: number) => (
                                            <tr key={`${host.ip}-${port.port}`} className="hover:bg-slate-800/50">
                                                {idx === 0 && (
                                                    <td className="p-4 text-white font-mono border-r border-slate-800" rowSpan={host.ports.length}>
                                                        {host.ip}
                                                    </td>
                                                )}
                                                <td className="p-4 text-cyan-300 font-mono">{port.port}</td>
                                                <td className="p-4 text-slate-400 uppercase">{port.protocol}</td>
                                                <td className="p-4 text-white">{port.service || 'unknown'}</td>
                                                <td className="p-4 text-slate-400 text-sm">{port.version || '-'}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${port.state === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                                        }`}>
                                                        {port.state}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : null}

            {!data && !rawOutput && (
                <div className="p-12 text-center text-slate-500 bg-white/5 rounded-xl border border-white/5">
                    No results available to display.
                </div>
            )}
        </div>
    );
}
