import * as React from "react";
import { cn } from "@/lib/utils";

function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-lg bg-slate-800/50 border border-slate-800/40",
                className
            )}
            {...props}
        />
    );
}

export { Skeleton };
