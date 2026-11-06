import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { Sparkles, Shield, Target, TrendingUp, Users, Zap } from 'lucide-react';
import Link from 'next/link';

const prisma = new PrismaClient();

async function getDashboardStats(userId: string) {
    const [userPlan, executions, companies] = await Promise.all([
        prisma.userPlan.findUnique({ where: { userId } }),
        prisma.toolExecution.count({ where: { userId } }),
        prisma.company.count(),
    ]);

    return { userPlan, executions, companies };
}

export default async function NumuInicioPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        redirect('/login');
    }

    const stats = await getDashboardStats(user.id);

    const dashboards = [
        {
            id: 'ai-scans',
            name: 'AI Security Scans',
            description: 'Run security scans with AI assistance',
            icon: Sparkles,
            color: 'purple',
            href: '/dashboard/ai-scans',
            available: true,
        },
        {
            id: 'csirt',
            name: 'CSIRT Operations',
            description: 'Security incident response and monitoring',
            icon: Shield,
            color: 'cyan',
            href: '/dashboard/csirt-overview',
            available: true,
        },
        {
            id: 'ctf',
            name: 'CTF & Education',
            description: 'Cybersecurity challenges and learning',
            icon: Target,
            color: 'green',
            href: '/numu-ctf',
            available: true,
        },
        {
            id: 'companies',
            name: 'Company Assessments',
            description: 'Security assessments and certifications',
            icon: Users,
            color: 'blue',
            href: '/dashboard/companies',
            available: true,
        },
        {
            id: 'financial',
            name: 'Financial System',
            description: 'Revenue, transactions, and analytics',
            icon: TrendingUp,
            color: 'orange',
            href: '/sistema-financiero',
            available: user.isAdmin || user.isSuperAdmin,
        },
        {
            id: 'admin',
            name: 'Administration',
            description: 'Full platform control and management',
            icon: Zap,
            color: 'red',
            href: '/vista-administrador',
            available: user.isSuperAdmin,
        },
    ];

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; border: string; text: string }> = {
            purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
            cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
            green: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
            blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
            orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
            red: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
        };
        return colors[color] || colors.purple;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">NUMU</span>
                    </h1>
                    <p className="text-xl text-gray-400">
                        Comprehensive Cybersecurity Platform
                    </p>
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
                        <div className="text-sm text-gray-400 mb-2">Your Plan</div>
                        <div className="text-3xl font-bold text-white">
                            {stats.userPlan?.plan === 'premium' ? '✨ Premium' : '🆓 Free'}
                        </div>
                    </div>
                    <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
                        <div className="text-sm text-gray-400 mb-2">Total Scans</div>
                        <div className="text-3xl font-bold text-white">{stats.executions}</div>
                    </div>
                    <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl">
                        <div className="text-sm text-gray-400 mb-2">Companies</div>
                        <div className="text-3xl font-bold text-white">{stats.companies}</div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div>
                    <h2 className="text-2xl font-semibold text-white mb-6">Available Dashboards</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dashboards.filter(d => d.available).map((dashboard) => {
                            const Icon = dashboard.icon;
                            const colors = getColorClasses(dashboard.color);

                            return (
                                <Link
                                    key={dashboard.id}
                                    href={dashboard.href}
                                    className={`p-6 rounded-xl border-2 ${colors.bg} ${colors.border} hover:border-opacity-50 transition-all hover:scale-105 cursor-pointer group`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-lg ${colors.bg} border ${colors.border}`}>
                                            <Icon className={`w-6 h-6 ${colors.text}`} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-opacity-80">
                                                {dashboard.name}
                                            </h3>
                                            <p className="text-sm text-gray-400">
                                                {dashboard.description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-12 p-6 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-xl">
                    <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            href="/dashboard/ai-scans"
                            className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all"
                        >
                            <div className="text-purple-400 font-semibold mb-1">🚀 Run AI Scan</div>
                            <div className="text-sm text-gray-400">Start a new security scan</div>
                        </Link>
                        <Link
                            href="/dashboard/companies"
                            className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all"
                        >
                            <div className="text-cyan-400 font-semibold mb-1">📊 View Companies</div>
                            <div className="text-sm text-gray-400">Manage assessments</div>
                        </Link>
                        <Link
                            href="/numu-ctf"
                            className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-white/20 transition-all"
                        >
                            <div className="text-green-400 font-semibold mb-1">🎯 CTF Challenges</div>
                            <div className="text-sm text-gray-400">Practice your skills</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
