import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function UnifiedScanLoading() {
    return (
        <div className="space-y-6 p-6 min-h-screen bg-slate-950 text-slate-200">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-72" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-28 rounded-md" />
                    <Skeleton className="h-8 w-36 rounded-md" />
                </div>
            </div>

            {/* Target and Controls bar */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap gap-4 items-center">
                <Skeleton className="h-10 flex-1 min-w-[240px] rounded-lg" />
                <Skeleton className="h-10 w-36 rounded-lg" />
                <Skeleton className="h-10 w-44 rounded-lg" />
            </div>

            {/* 3 Columns: Tools, Progress, Output */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                    <Skeleton className="h-6 w-36" />
                    <div className="space-y-3 pt-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-14 w-full rounded-lg" />
                        ))}
                    </div>
                </div>

                <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-5 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-80 w-full rounded-lg" />
                </div>
            </div>
        </div>
    );
}
