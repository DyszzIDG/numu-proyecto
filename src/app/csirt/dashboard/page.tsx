'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, AlertTriangle, Shield, Target } from 'lucide-react';

interface DashboardStats {
    scans: {
        today: number;
        thisWeek: number;
        total: number;
        running: number;
    };
    vulnerabilities: {
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
    incidents: {
        active: number;
    };
}

export default function CSIRTDashboard() {
    const { data: session, status } = useSession();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'authenticated' && session?.accessToken) {
            fetchDashboardStats();
        } else if (status === 'unauthenticated') {
            setLoading(false);
            // Optionally redirect here or let middleware handle it
        }
    }, [status, session]);

    const fetchDashboardStats = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api/csirt/dashboard/stats`, {
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch stats');
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">CSIRT Dashboard</h1>
                    <p className="text-gray-600 mt-2">Computer Security Incident Response Team</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Active Scans</CardTitle>
                            <Target className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.scans.running || 0}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                {stats?.scans.today || 0} today
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Critical Vulnerabilities</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats?.vulnerabilities.critical || 0}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                {stats?.vulnerabilities.high || 0} high severity
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Active Incidents</CardTitle>
                            <Shield className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{stats?.incidents.active || 0}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                Requires attention
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Scans</CardTitle>
                            <Activity className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.scans.total || 0}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                {stats?.scans.thisWeek || 0} this week
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="scans">Scans</TabsTrigger>
                        <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
                        <TabsTrigger value="incidents">Incidents</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Security Overview</CardTitle>
                                <CardDescription>
                                    Real-time security posture and threat landscape
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium">Vulnerability Distribution</span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            <div className="bg-red-100 p-3 rounded-lg">
                                                <div className="text-xs text-red-600 font-medium">Critical</div>
                                                <div className="text-2xl font-bold text-red-700">{stats?.vulnerabilities.critical || 0}</div>
                                            </div>
                                            <div className="bg-orange-100 p-3 rounded-lg">
                                                <div className="text-xs text-orange-600 font-medium">High</div>
                                                <div className="text-2xl font-bold text-orange-700">{stats?.vulnerabilities.high || 0}</div>
                                            </div>
                                            <div className="bg-yellow-100 p-3 rounded-lg">
                                                <div className="text-xs text-yellow-600 font-medium">Medium</div>
                                                <div className="text-2xl font-bold text-yellow-700">{stats?.vulnerabilities.medium || 0}</div>
                                            </div>
                                            <div className="bg-blue-100 p-3 rounded-lg">
                                                <div className="text-xs text-blue-600 font-medium">Low</div>
                                                <div className="text-2xl font-bold text-blue-700">{stats?.vulnerabilities.low || 0}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="scans">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Scans</CardTitle>
                                <CardDescription>View and manage security scans</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-gray-500">
                                    <p>Navigate to <a href="/csirt/scans" className="text-blue-600 hover:underline">Scans page</a> to view all scans</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="vulnerabilities">
                        <Card>
                            <CardHeader>
                                <CardTitle>Vulnerabilities</CardTitle>
                                <CardDescription>Track and remediate security vulnerabilities</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-gray-500">
                                    <p>Vulnerability management coming soon</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="incidents">
                        <Card>
                            <CardHeader>
                                <CardTitle>Security Incidents</CardTitle>
                                <CardDescription>Monitor and respond to security incidents</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-gray-500">
                                    <p>Incident management coming soon</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
