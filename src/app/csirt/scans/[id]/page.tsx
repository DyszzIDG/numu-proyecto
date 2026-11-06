'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Download, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Vulnerability {
    id: string;
    title: string;
    description: string;
    severity: string;
    cvss: number | null;
    cve: string | null;
    cwe: string | null;
    remediation: string | null;
    status: string;
}

interface Port {
    id: string;
    number: number;
    protocol: string;
    state: string;
    service: string | null;
    version: string | null;
}

interface Service {
    id: string;
    name: string;
    version: string | null;
    port: number | null;
    protocol: string | null;
}

interface ScanDetail {
    id: string;
    name: string;
    description: string | null;
    target: string;
    type: string;
    status: string;
    priority: string;
    progress: number;
    rawOutput: string | null;
    startedAt: string | null;
    completedAt: string | null;
    duration: number | null;
    createdAt: string;
    vulnerabilities: Vulnerability[];
    ports: Port[];
    services: Service[];
}

export default function ScanDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [scan, setScan] = useState<ScanDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchScanDetail(params.id as string);
        }
    }, [params.id]);

    const fetchScanDetail = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:4000/api/csirt/scans/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            setScan(data);
        } catch (error) {
            console.error('Failed to fetch scan:', error);
            toast.error('Failed to load scan details');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this scan?')) return;

        try {
            await fetch(`http://localhost:4000/api/csirt/scans/${params.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            toast.success('Scan deleted successfully');
            router.push('/csirt/scans');
        } catch (error) {
            console.error('Failed to delete scan:', error);
            toast.error('Failed to delete scan');
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-300';
            case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-300';
            case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'LOW': return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'INFO': return 'bg-gray-100 text-gray-800 border-gray-300';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading scan details...</p>
                </div>
            </div>
        );
    }

    if (!scan) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-gray-600">Scan not found</p>
                    <Link href="/csirt/scans">
                        <Button className="mt-4">Back to Scans</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/csirt/scans">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Scans
                        </Button>
                    </Link>
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{scan.name}</h1>
                            <p className="text-gray-600 mt-2">Target: {scan.target}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleDelete}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Status Card */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Status</div>
                                <Badge className={`${scan.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                    {scan.status}
                                </Badge>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Type</div>
                                <div className="font-medium">{scan.type.replace('_', ' ')}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Priority</div>
                                <Badge className={`${scan.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {scan.priority}
                                </Badge>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 mb-1">Duration</div>
                                <div className="font-medium">
                                    {scan.duration ? `${scan.duration}s` : 'N/A'}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs defaultValue="vulnerabilities" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="vulnerabilities">
                            Vulnerabilities ({scan.vulnerabilities.length})
                        </TabsTrigger>
                        <TabsTrigger value="ports">
                            Ports ({scan.ports.length})
                        </TabsTrigger>
                        <TabsTrigger value="services">
                            Services ({scan.services.length})
                        </TabsTrigger>
                        <TabsTrigger value="raw">Raw Output</TabsTrigger>
                    </TabsList>

                    <TabsContent value="vulnerabilities">
                        <div className="space-y-4">
                            {scan.vulnerabilities.length === 0 ? (
                                <Card>
                                    <CardContent className="text-center py-12">
                                        <p className="text-gray-500">No vulnerabilities found</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                scan.vulnerabilities.map((vuln) => (
                                    <Card key={vuln.id} className="border-l-4" style={{
                                        borderLeftColor: vuln.severity === 'CRITICAL' ? '#dc2626' :
                                            vuln.severity === 'HIGH' ? '#ea580c' :
                                                vuln.severity === 'MEDIUM' ? '#ca8a04' : '#2563eb'
                                    }}>
                                        <CardHeader>
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg">{vuln.title}</CardTitle>
                                                    <div className="flex gap-2 mt-2">
                                                        <Badge className={getSeverityColor(vuln.severity)}>
                                                            {vuln.severity}
                                                        </Badge>
                                                        {vuln.cve && (
                                                            <Badge variant="outline">{vuln.cve}</Badge>
                                                        )}
                                                        {vuln.cwe && (
                                                            <Badge variant="outline">{vuln.cwe}</Badge>
                                                        )}
                                                        {vuln.cvss && (
                                                            <Badge variant="outline">CVSS: {vuln.cvss}</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div>
                                                    <h4 className="font-semibold text-sm mb-2">Description</h4>
                                                    <p className="text-sm text-gray-700">{vuln.description}</p>
                                                </div>
                                                {vuln.remediation && (
                                                    <div>
                                                        <h4 className="font-semibold text-sm mb-2">Remediation</h4>
                                                        <p className="text-sm text-gray-700">{vuln.remediation}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="ports">
                        <Card>
                            <CardContent className="pt-6">
                                {scan.ports.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">No ports discovered</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left py-2 px-4">Port</th>
                                                    <th className="text-left py-2 px-4">Protocol</th>
                                                    <th className="text-left py-2 px-4">State</th>
                                                    <th className="text-left py-2 px-4">Service</th>
                                                    <th className="text-left py-2 px-4">Version</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {scan.ports.map((port) => (
                                                    <tr key={port.id} className="border-b hover:bg-gray-50">
                                                        <td className="py-2 px-4 font-medium">{port.number}</td>
                                                        <td className="py-2 px-4">{port.protocol}</td>
                                                        <td className="py-2 px-4">
                                                            <Badge className={port.state === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                                                {port.state}
                                                            </Badge>
                                                        </td>
                                                        <td className="py-2 px-4">{port.service || 'Unknown'}</td>
                                                        <td className="py-2 px-4 text-sm text-gray-600">{port.version || 'N/A'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="services">
                        <Card>
                            <CardContent className="pt-6">
                                {scan.services.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">No services detected</p>
                                ) : (
                                    <div className="grid gap-4">
                                        {scan.services.map((service) => (
                                            <div key={service.id} className="border rounded-lg p-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-semibold">{service.name}</h4>
                                                        <p className="text-sm text-gray-600">
                                                            {service.version || 'Version unknown'}
                                                        </p>
                                                    </div>
                                                    {service.port && (
                                                        <Badge variant="outline">
                                                            Port {service.port}/{service.protocol}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="raw">
                        <Card>
                            <CardHeader>
                                <CardTitle>Raw Scan Output</CardTitle>
                                <CardDescription>Complete output from the scan tools</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {scan.rawOutput ? (
                                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                                        {scan.rawOutput}
                                    </pre>
                                ) : (
                                    <p className="text-center text-gray-500 py-8">No output available</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
