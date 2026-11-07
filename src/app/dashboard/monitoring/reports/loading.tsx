import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsLoading() {
    return (
        <div className="space-y-8 p-8 min-h-screen bg-slate-950 text-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Skeleton className="h-9 w-24 rounded-lg" />
            </div>

            {/* Table Container */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                    <Skeleton className="h-8 w-24 rounded-lg" />
                    <Skeleton className="h-4 w-36" />
                </div>

                <div className="p-6 space-y-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-slate-800/60 last:border-0">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-72" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-5 w-20 rounded" />
                            <Skeleton className="h-5 w-24 rounded" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
