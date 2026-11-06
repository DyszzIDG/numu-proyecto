'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';

interface Scan {
    id: string;
    name: string;
    target: string;
    type: string;
    status: string;
    priority: string;
    progress: number;
    createdAt: string;
    _count: {
        vulnerabilities: number;
        ports: number;
    };
}

export default function ScansPage() {
    const router = useRouter();
    const [scans, setScans] = useState<Scan[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchScans();
    }, [filter]);

    const fetchScans = async () => {
        try {
            const url = new URL('http://localhost:4000/api/csirt/scans');
            if (filter !== 'all') {
                url.searchParams.set('status', filter);
            }

            const response = await fetch(url.toString(), {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            setScans(data.scans || []);
        } catch (error) {
            console.error('Failed to fetch scans:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-800';
            case 'RUNNING': return 'bg-blue-100 text-blue-800';
            case 'FAILED': return 'bg-red-100 text-red-800';
            case 'QUEUED': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'CRITICAL': return 'bg-red-100 text-red-800';
            case 'HIGH': return 'bg-orange-100 text-orange-800';
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
            case 'LOW': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Security Scans</h1>
                        <p className="text-gray-600 mt-2">Manage and monitor security scans</p>
                    </div>
                    <Link href="/csirt/scans/new">
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            New Scan
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === 'RUNNING' ? 'default' : 'outline'}
                        onClick={() => setFilter('RUNNING')}
                    >
                        Running
                    </Button>
                    <Button
                        variant={filter === 'COMPLETED' ? 'default' : 'outline'}
                        onClick={() => setFilter('COMPLETED')}
                    >
                        Completed
                    </Button>
                    <Button
                        variant={filter === 'FAILED' ? 'default' : 'outline'}
                        onClick={() => setFilter('FAILED')}
                    >
                        Failed
                    </Button>
                </div>

                {/* Scans List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading scans...</p>
                    </div>
                ) : scans.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-12">
                            <p className="text-gray-500">No scans found</p>
                            <Link href="/csirt/scans/new">
                                <Button className="mt-4">Create your first scan</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {scans.map((scan) => (
                            <Card key={scan.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => router.push(`/csirt/scans/${scan.id}`)}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">{scan.name}</CardTitle>
                                            <CardDescription className="mt-1">
                                                Target: {scan.target}
                                            </CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            <Badge className={getStatusColor(scan.status)}>
                                                {scan.status}
                                            </Badge>
                                            <Badge className={getPriorityColor(scan.priority)}>
                                                {scan.priority}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <div className="text-gray-500">Type</div>
                                            <div className="font-medium">{scan.type.replace('_', ' ')}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Vulnerabilities</div>
                                            <div className="font-medium">{scan._count.vulnerabilities}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Ports</div>
                                            <div className="font-medium">{scan._count.ports}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500">Created</div>
                                            <div className="font-medium">
                                                {new Date(scan.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    {scan.status === 'RUNNING' && (
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between text-sm mb-1">
                                                <span className="text-gray-600">Progress</span>
                                                <span className="font-medium">{scan.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                                    style={{ width: `${scan.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
