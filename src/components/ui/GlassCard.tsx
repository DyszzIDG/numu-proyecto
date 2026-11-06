import React from "react";
import clsx from "clsx";

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className, hoverEffect = true }) => {
    return (
        <div
            className={clsx(
                "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300",
                hoverEffect && "hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]",
                className
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10">{children}</div>
        </div>
    );
};

export default GlassCard;
