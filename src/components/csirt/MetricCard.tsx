import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

interface MetricCardProps {
    title: String;
    value: String | number;
    subValue?: String;
    icon?: LucideIcon;
    trend?: String;
    trendUp?: boolean; // true = good (green), false = bad (red)
    color?: String; // Custom text color class for value
    bgColor?: String; // Custom bg color class for icon
}

export function MetricCard({ title, value, subValue, icon: Icon, trend, trendUp, color, bgColor }: MetricCardProps) {
    return (
        <Card className="shadow-sm border-slate-200 bg-white">
            <CardContent className="p-6 flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
                    <div className="flex items-baseline gap-2">
                        <h2 className={cn("text-3xl font-bold", color)}>{value}</h2>
                    </div>
                    {(subValue || trend) && (
                        <div className="flex items-center mt-1">
                            {trend && (
                                <span className={cn(
                                    "text-xs font-medium mr-2",
                                    trendUp ? "text-emerald-500" : "text-rose-500"
                                )}>
                                    {trend}
                                </span>
                            )}
                            {subValue && <span className="text-xs text-muted-foreground">{subValue}</span>}
                        </div>
                    )}
                </div>
                {Icon && (
                    <div className={cn("p-3 rounded-full", bgColor || "bg-primary/10")}>
                        <Icon className="w-5 h-5 text-primary" />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
