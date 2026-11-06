import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { FileText, AlertTriangle, Activity, Database } from 'lucide-react';

const prisma = new PrismaClient();

async function getLogStats() {
    const [auditLogs, systemLogs, recentAudits, recentSystem] = await Promise.all([
        prisma.auditLog.count(),
        prisma.systemLog.count(),
        prisma.auditLog.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.systemLog.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            where: { level: { in: ['error', 'warning', 'critical'] } },
        }),
    ]);

    return { auditLogs, systemLogs, recentAudits, recentSystem };
}

export default async function CSIRTLogsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user || (!user.isAdmin && !user.isSuperAdmin)) {
        redirect('/dashboard');
    }

    const stats = await getLogStats();

    const getLevelColor = (level: string) => {
        const colors: Record<string, string> = {
            critical: 'text-red-400 bg-red-500/10 border-red-500/30',
            error: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
            warning: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
            info: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        };
        return colors[level] || colors.info;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Database className="w-10 h-10 text-cyan-400" />
                        <h1 className="text-4xl font-bold text-white">CSIRT Logs</h1>
                    </div>
                    <p className="text-gray-400 text-lg">
                        System audit logs and security event monitoring
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <FileText className="w-6 h-6 text-cyan-400" />
                            <div className="text-sm text-gray-400">Audit Logs</div>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.auditLogs.toLocaleString()}</div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Activity className="w-6 h-6 text-purple-400" />
                            <div className="text-sm text-gray-400">System Logs</div>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.systemLogs.toLocaleString()}</div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle className="w-6 h-6 text-yellow-400" />
                            <div className="text-sm text-gray-400">Warnings</div>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {stats.recentSystem.filter(l => l.level === 'warning').length}
                        </div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle className="w-6 h-6 text-red-400" />
                            <div className="text-sm text-gray-400">Errors</div>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {stats.recentSystem.filter(l => l.level === 'error' || l.level === 'critical').length}
                        </div>
                    </div>
                </div>

                {/* Recent Audit Logs */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h2 className="text-2xl font-semibold text-white mb-6">Recent Audit Logs</h2>
                    <div className="space-y-3">
                        {stats.recentAudits.map((log) => (
                            <div key={log.id} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <div className="text-white font-semibold mb-1">{log.action}</div>
                                        <div className="text-sm text-gray-400">
                                            {log.resource && `Resource: ${log.resource}`}
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </div>
                                </div>
                                {log.details && (
                                    <div className="mt-2 p-2 bg-black/30 rounded text-xs text-gray-400 font-mono">
                                        {log.details.substring(0, 200)}
                                        {log.details.length > 200 && '...'}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent System Logs */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h2 className="text-2xl font-semibold text-white mb-6">Recent System Events</h2>
                    <div className="space-y-3">
                        {stats.recentSystem.map((log) => (
                            <div
                                key={log.id}
                                className={`p-4 border rounded-lg ${getLevelColor(log.level)}`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-semibold uppercase px-2 py-1 bg-white/10 rounded">
                                                {log.level}
                                            </span>
                                            <span className="text-sm text-gray-400">{log.source}</span>
                                        </div>
                                        <div className="text-white">{log.message}</div>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </div>
                                </div>
                                {log.details && (
                                    <div className="mt-2 p-2 bg-black/30 rounded text-xs text-gray-400 font-mono overflow-x-auto">
                                        {log.details.substring(0, 300)}
                                        {log.details.length > 300 && '...'}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Log Filters (Coming Soon) */}
                <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-2">🔍 Advanced Features Coming Soon</h3>
                    <ul className="text-gray-300 space-y-1">
                        <li>• Real-time log streaming</li>
                        <li>• Advanced filtering and search</li>
                        <li>• Log export (CSV, JSON)</li>
                        <li>• Automated alerting</li>
                        <li>• Log retention policies</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
