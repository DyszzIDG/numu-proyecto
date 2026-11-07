import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function IncidentsLoading() {
    return (
        <div className="space-y-6 p-6 min-h-screen bg-slate-950 text-slate-200">
            {/* Header */}
            <div className="space-y-2 border-b border-slate-800 pb-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>

            {/* 3 Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-32" />
                            <Skeleton className="h-8 w-16" />
                        </div>
                        <Skeleton className="w-10 h-10 rounded-full" />
                    </div>
                ))}
            </div>

            {/* Incident Table */}
            <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                <Skeleton className="h-6 w-48" />
                <div className="space-y-3 pt-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-800/60 last:border-0">
                            <Skeleton className="h-4 w-20 font-mono" />
                            <Skeleton className="h-4 flex-1" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
