'use client';

import React, { useState } from 'react';
import { FileDown, FileText, Copy, Check } from 'lucide-react';
import { ReportGenerator } from '@/lib/reports/report-generator';

interface ExportMenuProps {
    scanResult: any;
    className?: string;
}

export function ExportMenu({ scanResult, className = '' }: ExportMenuProps) {
    const [copied, setCopied] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const handleCopyMarkdown = async () => {
        await ReportGenerator.copyMarkdownToClipboard(scanResult);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadMarkdown = () => {
        ReportGenerator.downloadMarkdown(scanResult);
        setShowMenu(false);
    };

    const handleDownloadPDF = () => {
        ReportGenerator.generatePDF(scanResult);
        setShowMenu(false);
    };

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-sm font-medium"
            >
                <FileDown className="w-4 h-4" />
                Export
            </button>

            {showMenu && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-20 animate-in fade-in slide-in-from-top-2">
                        <div className="p-2 space-y-1">

                            <button
                                onClick={handleDownloadPDF}
                                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg transition text-left"
                            >
                                <FileDown className="w-4 h-4 text-red-400" />
                                <div>
                                    <div className="text-sm font-medium">Download PDF</div>
                                    <div className="text-xs text-slate-400">Professional report</div>
                                </div>
                            </button>

                            <button
                                onClick={handleDownloadMarkdown}
                                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg transition text-left"
                            >
                                <FileText className="w-4 h-4 text-blue-400" />
                                <div>
                                    <div className="text-sm font-medium">Download Markdown</div>
                                    <div className="text-xs text-slate-400">Plain text format</div>
                                </div>
                            </button>

                            <div className="border-t border-slate-700 my-1" />

                            <button
                                onClick={handleCopyMarkdown}
                                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg transition text-left"
                            >
                                {copied ? (
                                    <Check className="w-4 h-4 text-green-400" />
                                ) : (
                                    <Copy className="w-4 h-4 text-cyan-400" />
                                )}
                                <div>
                                    <div className="text-sm font-medium">
                                        {copied ? 'Copied!' : 'Copy Markdown'}
                                    </div>
                                    <div className="text-xs text-slate-400">To clipboard</div>
                                </div>
                            </button>

                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
