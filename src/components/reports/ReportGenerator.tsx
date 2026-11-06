'use client';

import React, { useState } from 'react';
import { FileText, Download, Send, Check, Settings, Image as ImageIcon } from 'lucide-react';
import jsPDF from 'jspdf';

interface ReportGeneratorProps {
    scanId: string;
    scanData: any;
}

export function ReportGenerator({ scanId, scanData }: ReportGeneratorProps) {
    const [reportType, setReportType] = useState<'executive' | 'technical' | 'compliance' | 'full'>('executive');
    const [format, setFormat] = useState<'pdf' | 'html' | 'json' | 'csv'>('pdf');
    const [includeSections, setIncludeSections] = useState({
        summary: true,
        charts: true,
        vulns: true,
        technical: false,
        recommendations: true
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [generated, setGenerated] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);

        // Simulate generation delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (format === 'pdf') {
            generatePDF();
        } else if (format === 'json') {
            downloadJSON();
        }

        setIsGenerating(false);
        setGenerated(true);
        setTimeout(() => setGenerated(false), 3000);
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.setTextColor(41, 128, 185); // Blue color
        doc.text('Reporte de Seguridad - NUMU Cyber Assistant', 20, 20);

        // Scan Info
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Objetivo: ${scanData.target}`, 20, 40);
        doc.text(`Fecha: ${new Date(scanData.timestamp).toLocaleDateString()}`, 20, 50);
        doc.text(`Tipo de Reporte: ${reportType.toUpperCase()}`, 20, 60);

        // Summary Section
        if (includeSections.summary) {
            doc.setFontSize(16);
            doc.text('Resumen Ejecutivo', 20, 80);
            doc.setFontSize(10);
            const summaryText = `El escaneo identificó ${scanData.findings?.length || 0} hallazgos en total. ` +
                `Se encontraron ${scanData.findings?.filter((f: any) => f.severity === 'critical').length} vulnerabilidades críticas.`;
            const splitText = doc.splitTextToSize(summaryText, 170);
            doc.text(splitText, 20, 90);
        }

        // Add more sections logic here...

        doc.save(`report-${scanData.target}-${reportType}.pdf`);
    };

    const downloadJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scanData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `report-${scanData.target}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-cyan-400" />
                Generador de Reportes
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Configuration */}
                <div className="space-y-6">

                    {/* Report Type */}
                    <div>
                        <label className="block text-sm font-medium mb-3 text-slate-300">Tipo de Reporte</label>
                        <div className="grid grid-cols-2 gap-3">
                            {['executive', 'technical', 'compliance', 'full'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setReportType(type as any)}
                                    className={`p-3 rounded-lg border text-left transition ${reportType === type
                                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                                            : 'bg-slate-950 border-slate-700 hover:border-slate-600'
                                        }`}
                                >
                                    <div className="font-semibold capitalize">{type}</div>
                                    <div className="text-xs text-slate-500 mt-1">
                                        {type === 'executive' ? 'Resumen para gerencia' :
                                            type === 'technical' ? 'Detalles para devs/ops' :
                                                type === 'compliance' ? 'Auditoría normativa' :
                                                    'Reporte completo'}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Format */}
                    <div>
                        <label className="block text-sm font-medium mb-3 text-slate-300">Formato de Salida</label>
                        <div className="flex gap-3">
                            {['pdf', 'html', 'json', 'csv'].map((fmt) => (
                                <button
                                    key={fmt}
                                    onClick={() => setFormat(fmt as any)}
                                    className={`px-4 py-2 rounded-lg border font-medium uppercase text-sm transition ${format === fmt
                                            ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                                            : 'bg-slate-950 border-slate-700 hover:border-slate-600'
                                        }`}
                                >
                                    {fmt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sections Toggle */}
                    <div>
                        <label className="block text-sm font-medium mb-3 text-slate-300">Secciones a Incluir</label>
                        <div className="space-y-2">
                            {Object.entries(includeSections).map(([key, value]) => (
                                <label key={key} className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-700 rounded-lg hover:border-slate-600 cursor-pointer transition">
                                    <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={(e) => setIncludeSections({ ...includeSections, [key]: e.target.checked })}
                                        className="w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500"
                                    />
                                    <span className="capitalize">{key === 'vulns' ? 'Vulnerabilidades' : key}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Preview & Actions */}
                <div className="flex flex-col h-full">
                    <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-8 flex flex-col items-center justify-center text-slate-500 mb-6 relative overflow-hidden group">
                        <FileText className="w-16 h-16 mb-4 opacity-20" />
                        <p>Vista previa del reporte</p>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent opacity-50" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="flex justify-center items-center gap-2 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 rounded-lg font-semibold transition"
                        >
                            {isGenerating ? (
                                <>Generando...</>
                            ) : (
                                <>
                                    <Download className="w-5 h-5" />
                                    Descargar
                                </>
                            )}
                        </button>
                        <button className="flex justify-center items-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition">
                            <Send className="w-5 h-5" />
                            Enviar por Email
                        </button>
                    </div>

                    {generated && (
                        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-lg text-sm flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2">
                            <Check className="w-4 h-4" />
                            Reporte generado exitosamente
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
