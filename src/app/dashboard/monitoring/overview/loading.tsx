import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MonitoringOverviewLoading() {
    return (
        <div className="space-y-8 p-8 min-h-screen bg-slate-950 text-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-80" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="flex gap-3">
                    <Skeleton className="h-9 w-28 rounded-lg" />
                    <Skeleton className="h-9 w-24 rounded-lg" />
                </div>
            </div>

            {/* 3 KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-28" />
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                        <Skeleton className="w-10 h-10 rounded-full" />
                    </div>
                ))}
            </div>

            {/* 2 Big Area Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[1, 2].map((i) => (
                    <div key={i} className="p-6 rounded-xl bg-slate-900 border border-slate-800 min-h-[400px] space-y-6">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-[300px] w-full rounded-lg" />
                    </div>
                ))}
            </div>
        </div>
    );
}
