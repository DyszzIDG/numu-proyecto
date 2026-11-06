"use client";
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface OriginData {
    country: string;
    count: number;
}

interface AttackOriginsChartProps {
    data: OriginData[];
}

export function AttackOriginsChart({ data }: AttackOriginsChartProps) {
    if (!data || data.length === 0) return null;

    return (
        <div className="flex flex-col h-full justify-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">Origen de Ataque (País)</h3>
            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="country"
                            type="category"
                            tick={{ fill: '#475569', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            width={30}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }}
                        />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20} fill="#3b82f6" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
