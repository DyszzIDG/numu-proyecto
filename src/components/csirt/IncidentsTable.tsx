
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import Link from 'next/link';

interface Incident {
    id: string;
    type: string;
    severity: string;
    status: string;
    detectedAt: string;
    analyst: { name: string } | null;
    slaDeadline?: string;
}

interface IncidentsTableProps {
    incidents: Incident[];
    onManage?: (id: string) => void;
}

const severityColors: Record<string, string> = {
    'Crítico': 'bg-rose-50 text-rose-600 border-rose-200',
    'Alto': 'bg-orange-50 text-orange-600 border-orange-200',
    'Medio': 'bg-yellow-50 text-yellow-600 border-yellow-200',
    'Bajo': 'bg-blue-50 text-blue-600 border-blue-200',
};

export function IncidentsTable({ incidents, onManage }: IncidentsTableProps) {
    return (
        <Card className="shadow-sm border-slate-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-medium flex items-center gap-2">
                    <span className="text-slate-500">📄</span> <span className="text-slate-900">Últimos Incidentes</span>
                </CardTitle>
                <Link href="/csirt/incidents" className="text-blue-600 text-sm hover:underline">
                    Ver todos
                </Link>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="w-[120px] text-slate-500 font-medium h-10">ID Incidente</TableHead>
                            <TableHead className="text-slate-500 font-medium h-10">Tipo</TableHead>
                            <TableHead className="text-slate-500 font-medium h-10">Severidad</TableHead>
                            <TableHead className="text-slate-500 font-medium h-10">Estado</TableHead>
                            <TableHead className="text-slate-500 font-medium h-10">Detectado</TableHead>
                            <TableHead className="text-slate-500 font-medium h-10">Analista</TableHead>
                            <TableHead className="text-slate-500 font-medium h-10">SLA</TableHead>
                            <TableHead className="text-right text-slate-500 font-medium h-10">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {incidents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                                    No hay incidentes recientes
                                </TableCell>
                            </TableRow>
                        ) : (
                            incidents.map((incident) => (
                                <TableRow key={incident.id} className="border-slate-50 hover:bg-slate-50/80 transition-colors">
                                    <TableCell className="font-medium text-xs text-slate-500">{incident.id.substring(0, 12)}...</TableCell>
                                    <TableCell className="text-sm font-medium text-slate-700">{incident.type}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`${severityColors[incident.severity] || 'bg-slate-100 text-slate-600'} border font-normal`}>
                                            {incident.severity}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-600 text-sm">{incident.status}</TableCell>
                                    <TableCell className="text-slate-500 text-sm">
                                        {new Date(incident.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </TableCell>
                                    <TableCell className="text-slate-600 text-sm">{incident.analyst?.name || 'Pending'}</TableCell>
                                    <TableCell className="text-sm">
                                        {incident.slaDeadline ? '15m left' : <span className="text-emerald-600 font-medium">OK</span>}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 h-8 font-medium"
                                            onClick={() => onManage?.(incident.id)}
                                        >
                                            Gestionar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
