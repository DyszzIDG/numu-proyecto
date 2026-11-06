import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { Settings, Webhook, Key, Database, Bell, Zap } from 'lucide-react';

const prisma = new PrismaClient();

async function getSystemConfig() {
    const [totalUsers, activeScans, systemLogs] = await Promise.all([
        prisma.user.count(),
        prisma.toolExecution.count({ where: { status: 'running' } }),
        prisma.systemLog.count({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24h
                },
            },
        }),
    ]);

    return { totalUsers, activeScans, systemLogs };
}

export default async function NumuCentralPage() {
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

    const stats = await getSystemConfig();

    const configSections = [
        {
            id: 'api-keys',
            name: 'API Keys',
            description: 'Manage OpenAI, FOFA, and other API integrations',
            icon: Key,
            color: 'cyan',
            status: 'configured',
        },
        {
            id: 'webhooks',
            name: 'Webhooks',
            description: 'Configure N8N and external webhook endpoints',
            icon: Webhook,
            color: 'purple',
            status: 'pending',
        },
        {
            id: 'database',
            name: 'Database',
            description: 'Connection settings and backup configuration',
            icon: Database,
            color: 'green',
            status: 'healthy',
        },
        {
            id: 'notifications',
            name: 'Notifications',
            description: 'Email, SMS, and alert configurations',
            icon: Bell,
            color: 'orange',
            status: 'disabled',
        },
        {
            id: 'integrations',
            name: 'Integrations',
            description: 'Third-party service integrations',
            icon: Zap,
            color: 'yellow',
            status: 'partial',
        },
        {
            id: 'system',
            name: 'System Settings',
            description: 'General platform configuration',
            icon: Settings,
            color: 'blue',
            status: 'configured',
        },
    ];

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            configured: 'bg-green-500/10 text-green-400 border-green-500/30',
            healthy: 'bg-green-500/10 text-green-400 border-green-500/30',
            pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
            partial: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
            disabled: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
        };
        return colors[status] || colors.disabled;
    };

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; border: string; text: string }> = {
            cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
            purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
            green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
            orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
            yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
            blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
        };
        return colors[color] || colors.cyan;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Settings className="w-10 h-10 text-cyan-400" />
                        <h1 className="text-4xl font-bold text-white">NUMU Central</h1>
                    </div>
                    <p className="text-gray-400 text-lg">
                        Central control panel for platform configuration and integrations
                    </p>
                </div>

                {/* System Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <div className="text-sm text-gray-400">System Status</div>
                        </div>
                        <div className="text-3xl font-bold text-green-400">Online</div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="w-6 h-6 text-blue-400" />
                            <div className="text-sm text-gray-400">Active Scans</div>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.activeScans}</div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Bell className="w-6 h-6 text-purple-400" />
                            <div className="text-sm text-gray-400">System Events (24h)</div>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.systemLogs}</div>
                    </div>
                </div>

                {/* Configuration Sections */}
                <div>
                    <h2 className="text-2xl font-semibold text-white mb-6">Configuration Sections</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {configSections.map((section) => {
                            const Icon = section.icon;
                            const colors = getColorClasses(section.color);

                            return (
                                <div
                                    key={section.id}
                                    className={`p-6 rounded-xl border ${colors.bg} ${colors.border} hover:scale-105 transition-all cursor-pointer`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
                                            <Icon className={`w-6 h-6 ${colors.text}`} />
                                        </div>
                                        <span
                                            className={`text-xs font-semibold uppercase px-2 py-1 rounded border ${getStatusColor(
                                                section.status
                                            )}`}
                                        >
                                            {section.status}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">
                                        {section.name}
                                    </h3>
                                    <p className="text-sm text-gray-400">{section.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* API Configuration */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h2 className="text-2xl font-semibold text-white mb-6">API Configuration</h2>
                    <div className="space-y-4">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <Key className="w-5 h-5 text-cyan-400" />
                                    <span className="text-white font-semibold">OpenAI API</span>
                                </div>
                                <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 border border-green-500/30 rounded">
                                    Configured
                                </span>
                            </div>
                            <p className="text-sm text-gray-400">Used for AI command generation and analysis</p>
                        </div>

                        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <Key className="w-5 h-5 text-purple-400" />
                                    <span className="text-white font-semibold">FOFA API</span>
                                </div>
                                <span className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded">
                                    Optional
                                </span>
                            </div>
                            <p className="text-sm text-gray-400">Cyberspace search engine integration</p>
                        </div>

                        <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <Key className="w-5 h-5 text-green-400" />
                                    <span className="text-white font-semibold">Stripe API</span>
                                </div>
                                <span className="text-xs px-2 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded">
                                    Pending
                                </span>
                            </div>
                            <p className="text-sm text-gray-400">Payment processing for subscriptions</p>
                        </div>
                    </div>
                </div>

                {/* N8N Integration */}
                <div className="p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <Webhook className="w-8 h-8 text-purple-400" />
                        <h2 className="text-2xl font-semibold text-white">N8N Integration</h2>
                    </div>
                    <p className="text-gray-300 mb-4">
                        Automate workflows and integrate with external services using N8N.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-lg">
                            <div className="text-sm text-gray-400 mb-1">Webhook URL</div>
                            <div className="text-white font-mono text-sm">
                                https://numu.group/api/webhooks/n8n
                            </div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                            <div className="text-sm text-gray-400 mb-1">Status</div>
                            <div className="text-yellow-400 font-semibold">Coming Soon</div>
                        </div>
                    </div>
                </div>

                {/* Environment Variables */}
                <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-2">⚙️ Environment Configuration</h3>
                    <p className="text-gray-300 mb-4">
                        Configure these environment variables in your `.env` file:
                    </p>
                    <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-gray-300">
                        <div>OPENAI_API_KEY=sk-...</div>
                        <div>FOFA_API_KEY=...</div>
                        <div>STRIPE_SECRET_KEY=sk_...</div>
                        <div>DATABASE_URL=postgresql://...</div>
                        <div>NEXTAUTH_SECRET=...</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
