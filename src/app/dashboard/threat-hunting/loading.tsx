import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ThreatHuntingLoading() {
    return (
        <div className="space-y-6 p-6 min-h-screen bg-slate-950 text-slate-200">
            {/* Header */}
            <div className="space-y-2 border-b border-slate-800 pb-4">
                <Skeleton className="h-8 w-72" />
                <Skeleton className="h-4 w-96" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                    {/* Radar card skeleton */}
                    <div className="p-8 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center min-h-[260px] space-y-4">
                        <Skeleton className="w-16 h-16 rounded-full" />
                        <Skeleton className="h-6 w-56" />
                        <Skeleton className="h-4 w-80" />
                    </div>

                    {/* Threat cards skeleton */}
                    <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                        <Skeleton className="h-6 w-64" />
                        <div className="space-y-3 pt-2">
                            {[1, 2].map((i) => (
                                <div key={i} className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-2 items-center">
                                            <Skeleton className="h-5 w-16 rounded" />
                                            <Skeleton className="h-5 w-72" />
                                        </div>
                                        <Skeleton className="h-5 w-24 rounded" />
                                    </div>
                                    <Skeleton className="h-4 w-full" />
                                    <div className="flex gap-2 pt-2">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                        <Skeleton className="h-5 w-44" />
                        <div className="space-y-2.5 pt-2">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-8 w-full rounded" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
