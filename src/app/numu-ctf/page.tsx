import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { Trophy, Target, Users, Award, TrendingUp, Flag } from 'lucide-react';
import Link from 'next/link';

const prisma = new PrismaClient();

async function getCTFStats(userId: string) {
    const [challenges, userSolves, teams] = await Promise.all([
        prisma.cTFChallenge.count({ where: { isActive: true } }),
        prisma.cTFSolve.count({ where: { userId } }),
        prisma.cTFTeam.count({ where: { isActive: true } }),
    ]);

    return { challenges, userSolves, teams };
}

export default async function NumuCTFPage() {
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

    const stats = await getCTFStats(user.id);

    const categories = [
        {
            id: 'web',
            name: 'Web Exploitation',
            description: 'SQL injection, XSS, CSRF, and web vulnerabilities',
            icon: Target,
            color: 'cyan',
            count: 12,
        },
        {
            id: 'crypto',
            name: 'Cryptography',
            description: 'Encryption, hashing, and cryptographic challenges',
            icon: Flag,
            color: 'purple',
            count: 8,
        },
        {
            id: 'forensics',
            name: 'Digital Forensics',
            description: 'File analysis, memory dumps, and investigation',
            icon: Award,
            color: 'green',
            count: 10,
        },
        {
            id: 'pwn',
            name: 'Binary Exploitation',
            description: 'Buffer overflows, ROP chains, and pwn challenges',
            icon: Trophy,
            color: 'red',
            count: 6,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Trophy className="w-12 h-12 text-yellow-400" />
                        <h1 className="text-5xl font-bold text-white">
                            NUMU <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">CTF</span>
                        </h1>
                    </div>
                    <p className="text-xl text-gray-400">
                        Cybersecurity Challenges & Education Platform
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Target className="w-6 h-6 text-green-400" />
                            <div className="text-sm text-gray-400">Active Challenges</div>
                        </div>
                        <div className="text-4xl font-bold text-white">{stats.challenges}</div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Trophy className="w-6 h-6 text-purple-400" />
                            <div className="text-sm text-gray-400">Your Solves</div>
                        </div>
                        <div className="text-4xl font-bold text-white">{stats.userSolves}</div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Users className="w-6 h-6 text-cyan-400" />
                            <div className="text-sm text-gray-400">Active Teams</div>
                        </div>
                        <div className="text-4xl font-bold text-white">{stats.teams}</div>
                    </div>
                </div>

                {/* Categories */}
                <div>
                    <h2 className="text-2xl font-semibold text-white mb-6">Challenge Categories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            const colorClasses: Record<string, string> = {
                                cyan: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
                                purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
                                green: 'bg-green-500/10 border-green-500/30 text-green-400',
                                red: 'bg-red-500/10 border-red-500/30 text-red-400',
                            };

                            return (
                                <div
                                    key={category.id}
                                    className={`p-6 rounded-xl border-2 ${colorClasses[category.color]} hover:scale-105 transition-all cursor-pointer`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-lg ${colorClasses[category.color]}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-lg font-semibold text-white">
                                                    {category.name}
                                                </h3>
                                                <span className="text-sm text-gray-400">
                                                    {category.count} challenges
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-400">
                                                {category.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Learning Paths */}
                <div className="mt-12">
                    <h2 className="text-2xl font-semibold text-white mb-6">Learning Paths</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                            <div className="text-green-400 font-semibold mb-2">🌱 Beginner</div>
                            <h3 className="text-white font-semibold mb-2">Introduction to CTF</h3>
                            <p className="text-sm text-gray-400 mb-4">
                                Learn the basics of capture the flag competitions
                            </p>
                            <div className="text-xs text-gray-500">12 challenges • 2-3 hours</div>
                        </div>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                            <div className="text-yellow-400 font-semibold mb-2">⚡ Intermediate</div>
                            <h3 className="text-white font-semibold mb-2">Web Security Mastery</h3>
                            <p className="text-sm text-gray-400 mb-4">
                                Advanced web exploitation techniques
                            </p>
                            <div className="text-xs text-gray-500">20 challenges • 5-7 hours</div>
                        </div>
                        <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                            <div className="text-red-400 font-semibold mb-2">🔥 Advanced</div>
                            <h3 className="text-white font-semibold mb-2">Binary Exploitation</h3>
                            <p className="text-sm text-gray-400 mb-4">
                                Master pwn challenges and reverse engineering
                            </p>
                            <div className="text-xs text-gray-500">15 challenges • 10+ hours</div>
                        </div>
                    </div>
                </div>

                {/* Leaderboard Preview */}
                <div className="mt-12 p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-white">🏆 Leaderboard</h2>
                        <Link href="/numu-ctf/leaderboard" className="text-sm text-yellow-400 hover:text-yellow-300">
                            View Full →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((rank) => (
                            <div key={rank} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                                <div className="text-2xl font-bold text-yellow-400">#{rank}</div>
                                <div className="flex-1">
                                    <div className="text-white font-semibold">Team {rank}</div>
                                    <div className="text-sm text-gray-400">{1000 - rank * 100} points</div>
                                </div>
                                <Trophy className="w-6 h-6 text-yellow-400" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Coming Soon */}
                <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-2">🚀 Coming Soon</h3>
                    <p className="text-gray-300">
                        Live CTF competitions, team challenges, automated scoring, and certificate generation!
                    </p>
                </div>
            </div>
        </div>
    );
}
