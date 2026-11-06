import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { DollarSign, TrendingUp, Users, CreditCard, PieChart, Calendar } from 'lucide-react';

const prisma = new PrismaClient();

async function getFinancialStats() {
    const [transactions, totalRevenue, monthlyRevenue, activeSubscriptions] = await Promise.all([
        prisma.transaction.count(),
        prisma.transaction.aggregate({
            where: { status: 'completed' },
            _sum: { amount: true },
        }),
        prisma.transaction.aggregate({
            where: {
                status: 'completed',
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            },
            _sum: { amount: true },
        }),
        prisma.userPlan.count({
            where: { plan: 'premium', status: 'active' },
        }),
    ]);

    const recentTransactions = await prisma.transaction.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true, name: true } } },
    });

    return {
        transactions,
        totalRevenue: totalRevenue._sum.amount || 0,
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
        activeSubscriptions,
        recentTransactions,
    };
}

export default async function SistemaFinancieroPage() {
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

    const stats = await getFinancialStats();

    const formatCurrency = (cents: number) => {
        return `$${(cents / 100).toFixed(2)}`;
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            completed: 'text-green-400 bg-green-500/10',
            pending: 'text-yellow-400 bg-yellow-500/10',
            failed: 'text-red-400 bg-red-500/10',
            refunded: 'text-gray-400 bg-gray-500/10',
        };
        return colors[status] || colors.pending;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <DollarSign className="w-10 h-10 text-green-400" />
                        <h1 className="text-4xl font-bold text-white">Financial System</h1>
                    </div>
                    <p className="text-gray-400 text-lg">
                        Revenue tracking, transactions, and financial analytics
                    </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-6 h-6 text-green-400" />
                            <div className="text-sm text-gray-400">Total Revenue</div>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {formatCurrency(stats.totalRevenue)}
                        </div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Calendar className="w-6 h-6 text-blue-400" />
                            <div className="text-sm text-gray-400">This Month</div>
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {formatCurrency(stats.monthlyRevenue)}
                        </div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="w-6 h-6 text-purple-400" />
                            <div className="text-sm text-gray-400">Active Subscriptions</div>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.activeSubscriptions}</div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <CreditCard className="w-6 h-6 text-orange-400" />
                            <div className="text-sm text-gray-400">Transactions</div>
                        </div>
                        <div className="text-3xl font-bold text-white">{stats.transactions}</div>
                    </div>
                </div>

                {/* Revenue Chart Placeholder */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <PieChart className="w-6 h-6 text-cyan-400" />
                        <h2 className="text-2xl font-semibold text-white">Revenue Overview</h2>
                    </div>
                    <div className="h-64 flex items-center justify-center bg-white/5 rounded-lg border border-white/10">
                        <div className="text-center">
                            <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">Chart visualization coming soon</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Integration with Chart.js or Recharts
                            </p>
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h2 className="text-2xl font-semibold text-white mb-6">Recent Transactions</h2>
                    <div className="space-y-3">
                        {stats.recentTransactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="p-4 bg-white/5 border border-white/10 rounded-lg"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`text-xs font-semibold uppercase px-2 py-1 rounded ${getStatusColor(transaction.status)}`}>
                                                {transaction.status}
                                            </span>
                                            <span className="text-sm text-gray-400">{transaction.type}</span>
                                        </div>
                                        <div className="text-white font-semibold mb-1">
                                            {transaction.description}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {transaction.user?.email || 'Unknown user'}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-green-400">
                                            {formatCurrency(transaction.amount)}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(transaction.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Subscription Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Subscription Plans</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                <span className="text-gray-300">Free Plan</span>
                                <span className="text-white font-semibold">
                                    {stats.transactions - stats.activeSubscriptions} users
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <span className="text-gray-300">Premium Plan</span>
                                <span className="text-green-400 font-semibold">
                                    {stats.activeSubscriptions} users
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Monthly Recurring Revenue</h3>
                        <div className="text-4xl font-bold text-green-400 mb-2">
                            {formatCurrency(stats.activeSubscriptions * 990)}
                        </div>
                        <p className="text-sm text-gray-400">
                            Based on {stats.activeSubscriptions} active premium subscriptions at $9.90/month
                        </p>
                    </div>
                </div>

                {/* Export & Reports */}
                <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-2">📊 Advanced Features</h3>
                    <ul className="text-gray-300 space-y-1">
                        <li>• Export transactions to CSV/Excel</li>
                        <li>• Generate financial reports</li>
                        <li>• Revenue forecasting</li>
                        <li>• Stripe integration dashboard</li>
                        <li>• Automated invoicing</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
