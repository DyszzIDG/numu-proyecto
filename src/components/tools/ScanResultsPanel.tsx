import { jsPDF } from 'jspdf';
import { Download } from 'lucide-react';
import NmapResults from './NmapResults';
import NiktoResults from './NiktoResults';

interface ScanResultsPanelProps {
    toolId: string;
    execution: any; // Using any for partial ToolExecution
}

export default function ScanResultsPanel({ toolId, execution }: ScanResultsPanelProps) {
    if (!execution || (!execution.jsonResult && !execution.rawOutput)) {
        return (
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 text-center">
                <p className="text-slate-400">Waiting for results...</p>
                {execution?.status === 'running' && <p className="text-cyan-400 mt-2 animate-pulse">Scan is in progress...</p>}
            </div>
        );
    }

    const { jsonResult } = execution;

    const handleDownloadReport = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;
        let yPos = 20;

        // Helper to strip ANSI codes
        const stripAnsi = (str: string) => str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

        // Title
        doc.setFontSize(22);
        doc.setTextColor(0, 102, 204); // Blue
        doc.text("NUMU CSIRT - Security Report", margin, yPos);
        yPos += 15;

        // Metadata
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Tool: ${execution.toolName}`, margin, yPos);
        yPos += 7;
        doc.text(`Target: ${execution.target}`, margin, yPos);
        yPos += 7;
        doc.text(`Date: ${new Date(execution.completedAt || new Date()).toLocaleString()}`, margin, yPos);
        yPos += 15;

        // Content
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Scan Results", margin, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setFont("courier", "normal");

        const rawText = stripAnsi(execution.rawOutput || "No output captured.");
        const splitText = doc.splitTextToSize(rawText, pageWidth - (margin * 2));

        // Simple pagination loop
        splitText.forEach((line: string) => {
            if (yPos > doc.internal.pageSize.getHeight() - margin) {
                doc.addPage();
                yPos = 20;
            }
            doc.text(line, margin, yPos);
            yPos += 5;
        });

        doc.save(`scan-report-${execution.toolName}-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    switch (toolId) {
        case 'nmap':
            return <NmapResults result={jsonResult} rawOutput={execution.rawOutput} aiAnalysis={execution.aiAnalysis} executionId={execution.id} />;
        case 'nikto':
            return <NiktoResults result={jsonResult} />;
        default:
            return (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button
                            onClick={handleDownloadReport}
                            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Download PDF Report
                        </button>
                    </div>

                    <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 text-center">
                        <h3 className="text-white font-semibold mb-2">Raw Output</h3>
                        <pre className="text-left text-xs font-mono bg-black p-4 rounded overflow-auto max-h-[500px]">
                            {execution.rawOutput || JSON.stringify(jsonResult, null, 2)}
                        </pre>
                    </div>
                </div>
            );
    }
}
