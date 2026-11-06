
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SeverityData {
    Crítico: number;
    Alto: number;
    Medio: number;
    Bajo: number;
}

interface SeverityChartProps {
    data: SeverityData;
    total: number;
    pending: number;
}

export function SeverityChart({ data, total, pending }: SeverityChartProps) {
    const getPercentage = (val: number) => (val / total) * 100;

    return (
        <Card className="h-full shadow-sm border-slate-200 bg-white">
            <CardHeader>
                <CardTitle className="text-base font-medium flex items-center gap-2">
                    <span className="text-indigo-500">⚡</span> <span className="text-slate-900">Incidentes Activos</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Severity Bars */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            <span>Críticos</span>
                        </div>
                        <span className="font-bold">{data.Crítico}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                            <span>Altos</span>
                        </div>
                        <span className="font-bold">{data.Alto}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                            <span>Medios</span>
                        </div>
                        <span className="font-bold">{data.Medio}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span>Bajos</span>
                        </div>
                        <span className="font-bold">{data.Bajo}</span>
                    </div>
                </div>

                {/* Resolution Progress */}
                <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                        <span>Resueltos (Hoy): {total - pending}</span>
                        <span>Pendientes: {pending}</span>
                    </div>
                    <Progress value={((total - pending) / total) * 100 || 0} className="h-1.5 bg-muted" indicatorClassName="bg-emerald-500" />
                </div>
            </CardContent>
        </Card>
    );
}
