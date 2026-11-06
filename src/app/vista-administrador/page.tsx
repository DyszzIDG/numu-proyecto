import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { Shield, Users, Database, Settings, Activity, Lock } from 'lucide-react';
import Link from 'next/link';

const prisma = new PrismaClient();

async function getAdminStats() {
    const [totalUsers, premiumUsers, totalScans, totalCompanies, recentUsers] = await Promise.all([
        prisma.user.count(),
        prisma.userPlan.count({ where: { plan: 'premium', status: 'active' } }),
        prisma.toolExecution.count(),
        prisma.company.count(),
        prisma.user.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                plan: true,
            },
        }),
    ]);

    return { totalUsers, premiumUsers, totalScans, totalCompanies, recentUsers };
}

export default async function VistaAdministradorPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user || !user.isSuperAdmin) {
        redirect('/dashboard');
    }

    const stats = await getAdminStats();

    const adminSections = [
        {
            id: 'users',
            name: 'User Management',
            description: 'Manage users, roles, and permissions',
            icon: Users,
            color: 'cyan',
            href: '/vista-administrador/users',
            count: stats.totalUsers,
        },
        {
            id: 'dashboards',
            name: 'Dashboard Access',
            description: 'Control dashboard permissions',
            icon: Lock,
            color: 'purple',
            href: '/vista-administrador/access',
            count: 0,
        },
        {
            id: 'database',
            name: 'Database Management',
            description: 'Database operations and backups',
            icon: Database,
            color: 'green',
            href: '/vista-administrador/database',
            count: 0,
        },
        {
            id: 'system',
            name: 'System Configuration',
            description: 'Platform settings and integrations',
            icon: Settings,
            color: 'orange',
            href: '/vista-administrador/settings',
            count: 0,
        },
        {
            id: 'monitoring',
            name: 'System Monitoring',
            description: 'Performance and health metrics',
            icon: Activity,
            color: 'blue',
            href: '/vista-administrador/monitoring',
            count: 0,
        },
        {
            id: 'security',
            name: 'Security Center',
            description: 'Security policies and audit logs',
            icon: Shield,
            color: 'red',
            href: '/csirt-logs',
            count: 0,
        },
    ];

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; border: string; text: string }> = {
            cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
            purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
            green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
            orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
            blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
            red: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
        };
        return colors[color] || colors.cyan;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-10 h-10 text-red-400" />
                        <h1 className="text-4xl font-bold text-white">Administrator Panel</h1>
                    </div>
                    <p className="text-gray-400 text-lg">
                        Full platform control and management
                    </p>
                </div>

                {/* Platform Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="w-6 h-6 text-cyan-400" />
                            <div className="text-sm text-gray-400">Total Users</div>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
                        <div className="text-xs text-gray-500 mt-1">
                            {stats.premiumUsers} premium
                        </div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Activity className="w-6 h-6 text-purple-400" />
                            <div className="text-sm text-gray-400">Total Scans</div>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.totalScans}</div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Database className="w-6 h-6 text-green-400" />
                            <div className="text-sm text-gray-400">Companies</div>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.totalCompanies}</div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Shield className="w-6 h-6 text-orange-400" />
                            <div className="text-sm text-gray-400">System Status</div>
                        </div>
                        <div className="text-2xl font-bold text-green-400">Healthy</div>
                    </div>
                </div>

                {/* Admin Sections */}
                <div>
                    <h2 className="text-2xl font-semibold text-white mb-6">Administration Sections</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {adminSections.map((section) => {
                            const Icon = section.icon;
                            const colors = getColorClasses(section.color);

                            return (
                                <Link
                                    key={section.id}
                                    href={section.href}
                                    className={`p-6 rounded-xl border-2 ${colors.bg} ${colors.border} hover:scale-105 transition-all cursor-pointer group`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
                                            <Icon className={`w-6 h-6 ${colors.text}`} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-white mb-2">
                                                {section.name}
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                {section.description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Users */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h2 className="text-2xl font-semibold text-white mb-6">Recent Users</h2>
                    <div className="space-y-3">
                        {stats.recentUsers.map((u) => (
                            <div key={u.id} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="text-white font-semibold mb-1">
                                            {u.name || 'No name'}
                                        </div>
                                        <div className="text-sm text-gray-400">{u.email}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-400 mb-1">{u.role}</div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button className="p-4 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg transition-all text-left">
                        <div className="text-cyan-400 font-semibold mb-1">🔄 Sync Database</div>
                        <div className="text-sm text-gray-400">Run Prisma migrations</div>
                    </button>
                    <button className="p-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg transition-all text-left">
                        <div className="text-purple-400 font-semibold mb-1">📊 Generate Report</div>
                        <div className="text-sm text-gray-400">Platform analytics</div>
                    </button>
                    <button className="p-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg transition-all text-left">
                        <div className="text-green-400 font-semibold mb-1">💾 Backup Data</div>
                        <div className="text-sm text-gray-400">Create system backup</div>
                    </button>
                </div>

                {/* System Info */}
                <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-2">⚙️ System Information</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <div className="text-gray-400">Version</div>
                            <div className="text-white font-mono">v2.0.0</div>
                        </div>
                        <div>
                            <div className="text-gray-400">Environment</div>
                            <div className="text-white font-mono">Production</div>
                        </div>
                        <div>
                            <div className="text-gray-400">Database</div>
                            <div className="text-white font-mono">PostgreSQL</div>
                        </div>
                        <div>
                            <div className="text-gray-400">Uptime</div>
                            <div className="text-white font-mono">99.9%</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
