"use client";

import React, { useState, useEffect } from "react";
import CSIRTModuleLayout from "@/components/csirt/CSIRTModuleLayout";
import { Brain, Sparkles, Bot, FileText, Download, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import NeonCard from "@/components/ui/NeonCard";
import CyberButton from "@/components/ui/CyberButton";
import { jsPDF } from "jspdf";

export default function AIAutomationPage() {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/tools/results');
            const data = await res.json();
            if (data.recentExecutions) {
                setHistory(data.recentExecutions);
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const generatePDF = (scan: any) => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(40, 40, 40);
        doc.text("NUMU Security Report", 20, 20);

        // Meta info
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Report ID: ${scan.id}`, 20, 30);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 35);
        doc.text(`Tool: ${scan.toolName.toUpperCase()}`, 20, 40);
        doc.text(`Target: ${scan.target}`, 20, 45);

        // Status
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Status: ${scan.status.toUpperCase()}`, 20, 55);

        // Content
        doc.setFontSize(12);
        doc.text("Scan Results:", 20, 70);

        doc.setFontSize(10);
        doc.setFont("monospaced");

        // Split text to fit page
        const splitText = doc.splitTextToSize(scan.rawOutput || scan.error || "No output available", 170);
        doc.text(splitText, 20, 80);

        // AI Analysis if available
        if (scan.aiAnalysis) {
            doc.addPage();
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.text("AI Security Analysis", 20, 20);

            try {
                const analysis = JSON.parse(scan.aiAnalysis);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(12);

                doc.text("Summary:", 20, 35);
                doc.setFontSize(10);
                const summary = doc.splitTextToSize(analysis.summary || "", 170);
                doc.text(summary, 20, 45);

                let y = 45 + (summary.length * 5) + 10;

                if (analysis.findings) {
                    doc.setFontSize(12);
                    doc.text("Key Findings:", 20, y);
                    y += 10;
                    doc.setFontSize(10);
                    analysis.findings.forEach((finding: string) => {
                        const line = doc.splitTextToSize(`• ${finding}`, 170);
                        doc.text(line, 20, y);
                        y += (line.length * 5) + 2;
                    });
                }
            } catch (e) {
                doc.text("Error parsing AI analysis", 20, 40);
            }
        }

        doc.save(`numu_report_${scan.toolName}_${scan.id.slice(0, 8)}.pdf`);
    };

    const generateGlobalReport = () => {
        if (history.length === 0) return;

        const doc = new jsPDF();

        // Cover Page
        doc.setFillColor(10, 10, 10);
        doc.rect(0, 0, 210, 297, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.text("NUMU SECURITY", 105, 120, { align: "center" });
        doc.setFontSize(16);
        doc.setTextColor(167, 139, 250); // violet-400
        doc.text("Global Security Assessment Report", 105, 135, { align: "center" });
        doc.setFontSize(10);
        doc.setTextColor(200, 200, 200);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 150, { align: "center" });

        // Summary Page
        doc.addPage();
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(20);
        doc.text("Executive Summary", 20, 20);

        doc.setFontSize(12);
        doc.text(`Total Scans Performed: ${history.length}`, 20, 40);

        const completed = history.filter(h => h.status === 'completed').length;
        const failed = history.filter(h => h.status === 'failed').length;

        doc.text(`Successful Scans: ${completed}`, 20, 50);
        doc.text(`Failed Scans: ${failed}`, 20, 60);

        doc.setFontSize(16);
        doc.text("Recent Activity", 20, 80);

        let y = 90;
        history.slice(0, 10).forEach((scan, i) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            doc.setFontSize(10);
            doc.text(`${new Date(scan.startedAt).toLocaleDateString()} - ${scan.toolName} on ${scan.target} [${scan.status.toUpperCase()}]`, 20, y);
            y += 10;
        });

        doc.save(`numu_global_report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <CSIRTModuleLayout
            title="IA y Automatización"
            description="Analítica predictiva y reportes inteligentes de seguridad."
            icon={Brain}
            iconColor="text-violet-400"
            backLink="/csirt/operations"
        >
            <div className="max-w-6xl mx-auto space-y-8">
                {/* AI Status Card */}
                <NeonCard glowColor="magenta" className="p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5" />
                    <div className="w-24 h-24 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center mb-6 relative z-10">
                        <Bot className="w-12 h-12 text-violet-400" />
                        <div className="absolute inset-0 border-t-2 border-l-2 border-violet-500 rounded-full animate-spin" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 z-10">NUMU AI Analyst</h2>
                    <p className="text-gray-400 max-w-lg mb-8 z-10">
                        Analyzing security posture across all scans. Ready to generate comprehensive reports.
                    </p>
                    <div className="flex gap-4 z-10">
                        <CyberButton onClick={generateGlobalReport}>
                            <FileText className="w-4 h-4 mr-2" />
                            Generar Reporte Global
                        </CyberButton>
                    </div>
                </NeonCard>

                {/* Recent Reports List */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-violet-400" />
                        Available Reports
                    </h3>

                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading reports...</div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-10 text-gray-500 bg-white/5 rounded-xl border border-white/10">
                            No matching reports found. Run a scan first.
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {history.map((scan) => (
                                <div
                                    key={scan.id}
                                    className="bg-[#0A0A0A] border border-white/5 hover:border-violet-500/30 transition-all rounded-xl p-4 flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${scan.status === 'completed' ? 'bg-green-500/10 text-green-400' :
                                            scan.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                                                'bg-blue-500/10 text-blue-400'
                                            }`}>
                                            {scan.status === 'completed' ? <CheckCircle className="w-5 h-5" /> :
                                                scan.status === 'failed' ? <XCircle className="w-5 h-5" /> :
                                                    <AlertCircle className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-white flex items-center gap-2">
                                                {scan.toolName} Report
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400 font-normal">
                                                    {scan.target}
                                                </span>
                                            </h4>
                                            <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(scan.startedAt).toLocaleString()}
                                                </span>
                                                {scan.aiAnalysis && (
                                                    <span className="flex items-center gap-1 text-violet-400">
                                                        <Sparkles className="w-3 h-3" />
                                                        AI Analyzed
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => generatePDF(scan)}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 hover:text-white rounded-lg transition-colors border border-white/10"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            PDF
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </CSIRTModuleLayout>
    );
}
