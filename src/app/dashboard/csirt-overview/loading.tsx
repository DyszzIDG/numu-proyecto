import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CSIRTOverviewLoading() {
    return (
        <div className="p-6 space-y-6 bg-slate-950 min-h-screen text-slate-200">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-72" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="flex gap-3">
                    <Skeleton className="h-9 w-24 rounded-lg" />
                    <Skeleton className="h-9 w-40 rounded-lg" />
                </div>
            </div>

            {/* 4 KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((idx) => (
                    <div key={idx} className="p-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-3 w-28" />
                        </div>
                        <Skeleton className="h-12 w-12 rounded-full" />
                    </div>
                ))}
            </div>

            {/* Middle Grid: Severity Distribution & Threats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 lg:col-span-1 space-y-4">
                    <Skeleton className="h-6 w-44" />
                    <div className="space-y-4 pt-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="w-3 h-3 rounded-full" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                                <Skeleton className="h-4 w-6" />
                            </div>
                        ))}
                    </div>
                    <Skeleton className="h-2 w-full mt-6" />
                </div>

                <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 lg:col-span-2 space-y-4">
                    <Skeleton className="h-6 w-48" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-64">
                        <Skeleton className="h-full w-full rounded-lg" />
                        <Skeleton className="h-full w-full rounded-lg" />
                    </div>
                </div>
            </div>

            {/* Incidents Table */}
            <div className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-52" />
                    <Skeleton className="h-5 w-28 rounded-full" />
                </div>
                <div className="space-y-3 pt-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-800 last:border-0">
                            <Skeleton className="h-4 w-20 font-mono" />
                            <Skeleton className="h-4 flex-1" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom 3 Panels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 rounded-lg bg-slate-900 border border-slate-800 space-y-4">
                        <Skeleton className="h-5 w-36" />
                        <div className="space-y-3 pt-2">
                            <Skeleton className="h-10 w-full rounded-lg" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
