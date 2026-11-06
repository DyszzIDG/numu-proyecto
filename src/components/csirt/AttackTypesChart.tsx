
"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface AttackType {
    name: string;
    value: number;
    [key: string]: string | number;
}

interface AttackTypesChartProps {
    data: AttackType[];
}

const COLORS = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'];

export function AttackTypesChart({ data }: AttackTypesChartProps) {
    if (!data || data.length === 0) return null;

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Top Tipos de Amenaza</h3>
            <div className="h-[200px] w-full max-w-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }}
                            itemStyle={{ color: '#1e293b' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-3 mt-4">
                {data.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="w-2 h-2 rounded-[2px]" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                        <span>{entry.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
