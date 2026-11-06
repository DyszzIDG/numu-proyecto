'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NewScanPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        target: '',
        type: 'NETWORK',
        priority: 'MEDIUM',
        tools: ['nmap'],
        nmapOptions: {
            flags: '-sV -sC',
            ports: '1-1000',
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:4000/api/csirt/scans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to create scan');
            }

            const scan = await response.json();
            toast.success('Scan created successfully!');
            router.push(`/csirt/scans/${scan.id}`);
        } catch (error) {
            console.error('Failed to create scan:', error);
            toast.error('Failed to create scan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/csirt/scans">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Scans
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">Create New Scan</h1>
                    <p className="text-gray-600 mt-2">Configure and launch a security scan</p>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Scan Configuration</CardTitle>
                        <CardDescription>
                            Fill in the details below to create a new security scan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name">Scan Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Production Server Scan"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Optional description of this scan"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            {/* Target */}
                            <div className="space-y-2">
                                <Label htmlFor="target">Target *</Label>
                                <Input
                                    id="target"
                                    placeholder="e.g., scanme.nmap.org or 192.168.1.1"
                                    value={formData.target}
                                    onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                                    required
                                />
                                <p className="text-sm text-gray-500">
                                    Enter a domain name or IP address
                                </p>
                            </div>

                            {/* Type and Priority */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Scan Type *</Label>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value) => setFormData({ ...formData, type: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NETWORK">Network Scan</SelectItem>
                                            <SelectItem value="WEB_APPLICATION">Web Application</SelectItem>
                                            <SelectItem value="API">API Scan</SelectItem>
                                            <SelectItem value="FULL_STACK">Full Stack</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority *</Label>
                                    <Select
                                        value={formData.priority}
                                        onValueChange={(value) => setFormData({ ...formData, priority: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LOW">Low</SelectItem>
                                            <SelectItem value="MEDIUM">Medium</SelectItem>
                                            <SelectItem value="HIGH">High</SelectItem>
                                            <SelectItem value="CRITICAL">Critical</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Nmap Options */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold mb-4">Nmap Options</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="flags">Nmap Flags</Label>
                                        <Input
                                            id="flags"
                                            placeholder="-sV -sC"
                                            value={formData.nmapOptions.flags}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                nmapOptions: { ...formData.nmapOptions, flags: e.target.value }
                                            })}
                                        />
                                        <p className="text-xs text-gray-500">
                                            Common: -sV (version), -sC (scripts), -A (aggressive)
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="ports">Port Range</Label>
                                        <Input
                                            id="ports"
                                            placeholder="1-1000"
                                            value={formData.nmapOptions.ports}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                nmapOptions: { ...formData.nmapOptions, ports: e.target.value }
                                            })}
                                        />
                                        <p className="text-xs text-gray-500">
                                            e.g., 1-1000, 80,443, or - for all ports
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex gap-4 pt-6">
                                <Button type="submit" disabled={loading} className="flex-1">
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating Scan...
                                        </>
                                    ) : (
                                        'Create Scan'
                                    )}
                                </Button>
                                <Link href="/csirt/scans">
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
