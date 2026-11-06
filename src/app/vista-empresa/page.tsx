import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { Building2, Shield, FileCheck, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const prisma = new PrismaClient();

async function getCompanyData(companyId: string) {
    const [company, assessments, scans, cases] = await Promise.all([
        prisma.company.findUnique({
            where: { id: companyId },
            include: {
                certifications: {
                    where: { status: 'active' },
                    include: { tier: true },
                },
            },
        }),
        prisma.assessment.findMany({
            where: { companyId },
            orderBy: { startedAt: 'desc' },
            take: 5,
        }),
        prisma.scanResult.count({ where: { target: { target: { contains: companyId } } } }),
        prisma.case.count({ where: { companyId } }),
    ]);

    return { company, assessments, scans, cases };
}

export default async function VistaEmpresaPage({
    searchParams,
}: {
    searchParams: { companyId?: string };
}) {
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

    // If no companyId provided, show company selection
    if (!searchParams.companyId) {
        const companies = await prisma.company.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
        });

        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Company View</h1>
                        <p className="text-gray-400">Select a company to view their security dashboard</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {companies.map((company) => (
                            <a
                                key={company.id}
                                href={`/vista-empresa?companyId=${company.id}`}
                                className="p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                        <Building2 className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white mb-1">
                                            {company.name}
                                        </h3>
                                        <p className="text-sm text-gray-400">{company.industry}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            {company.size} employees • {company.country}
                                        </p>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Show company dashboard
    const data = await getCompanyData(searchParams.companyId);

    if (!data.company) {
        redirect('/vista-empresa');
    }

    const latestAssessment = data.assessments[0];
    const activeCertification = data.company.certifications[0];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Building2 className="w-10 h-10 text-blue-400" />
                            <h1 className="text-4xl font-bold text-white">{data.company.name}</h1>
                        </div>
                        <p className="text-gray-400 text-lg">
                            {data.company.industry} • {data.company.size} • {data.company.country}
                        </p>
                    </div>
                    <a
                        href="/vista-empresa"
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                    >
                        ← Back to Companies
                    </a>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <Shield className="w-6 h-6 text-green-400" />
                            <div className="text-sm text-gray-400">Security Score</div>
                        </div>
                        <div className="text-4xl font-bold text-white">
                            {latestAssessment?.overallScore || 'N/A'}
                        </div>
                        {latestAssessment?.maturityLevel && (
                            <div className="text-sm text-gray-400 mt-1 capitalize">
                                {latestAssessment.maturityLevel}
                            </div>
                        )}
                    </div>
                    <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <FileCheck className="w-6 h-6 text-blue-400" />
                            <div className="text-sm text-gray-400">Assessments</div>
                        </div>
                        <div className="text-4xl font-bold text-white">{data.assessments.length}</div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-6 h-6 text-purple-400" />
                            <div className="text-sm text-gray-400">Security Scans</div>
                        </div>
                        <div className="text-4xl font-bold text-white">{data.scans}</div>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/30 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <AlertCircle className="w-6 h-6 text-orange-400" />
                            <div className="text-sm text-gray-400">Open Cases</div>
                        </div>
                        <div className="text-4xl font-bold text-white">{data.cases}</div>
                    </div>
                </div>

                {/* Certification Status */}
                {activeCertification && (
                    <div className="p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <CheckCircle className="w-12 h-12 text-yellow-400" />
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-1">
                                        {activeCertification.tier.name} Certified
                                    </h3>
                                    <p className="text-gray-400">
                                        Certificate #{activeCertification.certificateNumber}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-400">Issued</div>
                                <div className="text-white">
                                    {activeCertification.issuedAt
                                        ? new Date(activeCertification.issuedAt).toLocaleDateString()
                                        : 'Pending'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent Assessments */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h2 className="text-2xl font-semibold text-white mb-6">Assessment History</h2>
                    {data.assessments.length > 0 ? (
                        <div className="space-y-3">
                            {data.assessments.map((assessment) => (
                                <div
                                    key={assessment.id}
                                    className="p-4 bg-white/5 border border-white/10 rounded-lg"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span
                                                    className={`text-xs font-semibold uppercase px-2 py-1 rounded ${assessment.status === 'completed'
                                                            ? 'bg-green-500/10 text-green-400'
                                                            : 'bg-yellow-500/10 text-yellow-400'
                                                        }`}
                                                >
                                                    {assessment.status}
                                                </span>
                                                {assessment.overallScore && (
                                                    <span className="text-2xl font-bold text-white">
                                                        {assessment.overallScore}/100
                                                    </span>
                                                )}
                                            </div>
                                            {assessment.maturityLevel && (
                                                <div className="text-sm text-gray-400 capitalize">
                                                    Maturity Level: {assessment.maturityLevel}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-400">Started</div>
                                            <div className="text-white">
                                                {new Date(assessment.startedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            No assessments yet. Start a new assessment to evaluate security posture.
                        </div>
                    )}
                </div>

                {/* Company Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <div className="text-gray-400">Contact Name</div>
                                <div className="text-white">{data.company.contactName}</div>
                            </div>
                            <div>
                                <div className="text-gray-400">Email</div>
                                <div className="text-white">{data.company.contactEmail}</div>
                            </div>
                            {data.company.contactPhone && (
                                <div>
                                    <div className="text-gray-400">Phone</div>
                                    <div className="text-white">{data.company.contactPhone}</div>
                                </div>
                            )}
                            {data.company.website && (
                                <div>
                                    <div className="text-gray-400">Website</div>
                                    <div className="text-white">{data.company.website}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full p-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-left transition-all">
                                <div className="text-blue-400 font-semibold">📊 New Assessment</div>
                                <div className="text-sm text-gray-400">Start security evaluation</div>
                            </button>
                            <button className="w-full p-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg text-left transition-all">
                                <div className="text-purple-400 font-semibold">🔍 Run Scan</div>
                                <div className="text-sm text-gray-400">Execute security scan</div>
                            </button>
                            <button className="w-full p-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg text-left transition-all">
                                <div className="text-green-400 font-semibold">📄 Generate Report</div>
                                <div className="text-sm text-gray-400">Export security report</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
