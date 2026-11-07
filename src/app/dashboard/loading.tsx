import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
    return (
        <div className="p-8 space-y-8 bg-slate-950 min-h-screen text-slate-200">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="flex gap-3">
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-10 w-36" />
                </div>
            </div>

            {/* KPI Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                        <Skeleton className="h-8 w-20" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                ))}
            </div>

            {/* Main Content Skeleton (Charts / Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 lg:col-span-1 space-y-4 min-h-[360px]">
                    <Skeleton className="h-6 w-40" />
                    <div className="space-y-3 pt-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex justify-between items-center">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-8" />
                            </div>
                        ))}
                    </div>
                    <Skeleton className="h-2 w-full mt-6" />
                </div>

                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 lg:col-span-2 space-y-4 min-h-[360px]">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-64 w-full rounded-lg" />
                </div>
            </div>

            {/* Bottom Table Skeleton */}
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-44" />
                    <Skeleton className="h-6 w-24" />
                </div>
                <div className="space-y-2 pt-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-800/60 last:border-0">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 flex-1" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
