import { NiktoResult } from '@/lib/parsers/nikto-parser';
import { Download, Globe, Shield, AlertTriangle, AlertCircle } from 'lucide-react';

interface NiktoResultsProps {
    result: any; // Ideally NiktoResult
}

export default function NiktoResults({ result }: NiktoResultsProps) {
    if (!result) return null;

    const data: NiktoResult = typeof result === 'string' ? JSON.parse(result) : result;
    const {
        scanInfo = {} as any,
        serverInfo = {},
        summary = { critical: 0, high: 0, medium: 0, totalFindings: 0 } as any,
        findings = []
    } = data || {};

    const downloadReport = () => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `nikto-report-${new Date().toISOString()}.json`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <div className="space-y-6">
            {/* Server Overview */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Target Overview</h3>
                        <p className="text-slate-400 text-sm mb-4">Scan details and server information</p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-cyan-400" />
                                <span className="text-white font-mono">{scanInfo.target || scanInfo.ip}</span>
                                <span className="text-slate-500 text-sm">:{scanInfo.port}</span>
                            </div>
                            {serverInfo.server && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">Server</span>
                                    <span className="text-slate-300">{serverInfo.server}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-center min-w-[100px]">
                            <div className="text-red-400 font-bold text-2xl mb-1">{summary.critical + summary.high}</div>
                            <div className="text-xs text-slate-500 uppercase">Critical/High</div>
                        </div>
                        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-center min-w-[100px]">
                            <div className="text-yellow-400 font-bold text-2xl mb-1">{summary.medium}</div>
                            <div className="text-xs text-slate-500 uppercase">Medium</div>
                        </div>
                        <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 text-center min-w-[100px]">
                            <div className="text-blue-400 font-bold text-2xl mb-1">{summary.totalFindings}</div>
                            <div className="text-xs text-slate-500 uppercase">Total</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Findings Table */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
                    <h3 className="font-semibold text-white">Vulnerability Findings</h3>
                    <button onClick={downloadReport} className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-800 text-slate-400 text-sm uppercase">
                            <tr>
                                <th className="p-4 w-24">Severity</th>
                                <th className="p-4 w-1/4">Issue</th>
                                <th className="p-4">Description</th>
                                <th className="p-4 w-32">URI</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {findings.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500">
                                        No vulnerabilities found.
                                    </td>
                                </tr>
                            ) : (
                                findings.map((finding) => (
                                    <tr key={finding.id} className="hover:bg-slate-800/50">
                                        <td className="p-4 align-top">
                                            <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold uppercase w-fit ${finding.severity === 'critical' ? 'bg-red-500/20 text-red-500 border border-red-500/50' :
                                                finding.severity === 'high' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/50' :
                                                    finding.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/50' :
                                                        finding.severity === 'low' ? 'bg-blue-500/20 text-blue-500 border border-blue-500/50' :
                                                            'bg-slate-700 text-slate-400'
                                                }`}>
                                                {finding.severity === 'critical' || finding.severity === 'high' ? <Shield className="w-3 h-3" /> :
                                                    finding.severity === 'medium' ? <AlertTriangle className="w-3 h-3" /> :
                                                        <AlertCircle className="w-3 h-3" />}
                                                {finding.severity}
                                            </span>
                                        </td>
                                        <td className="p-4 align-top">
                                            <div className="font-semibold text-white mb-1">{finding.category}</div>
                                            <div className="text-xs text-slate-500">{finding.osvdbId ? `OSVDB: ${finding.osvdbId}` : ''}</div>
                                        </td>
                                        <td className="p-4 align-top text-slate-300 text-sm">
                                            {finding.description}
                                        </td>
                                        <td className="p-4 align-top font-mono text-xs text-cyan-400 break-all">
                                            {finding.uri || '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
