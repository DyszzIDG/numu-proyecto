"use client";
import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface GlitchTextProps {
    text: string;
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

const GlitchText: React.FC<GlitchTextProps> = ({ text, className, size = "md" }) => {
    const sizeClasses = {
        sm: "text-lg",
        md: "text-2xl",
        lg: "text-4xl",
        xl: "text-6xl md:text-7xl font-bold"
    };

    return (
        <div className={clsx("relative inline-block group", sizeClasses[size], className)}>
            <span className="relative z-10">{text}</span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-cyber-primary opacity-0 group-hover:opacity-70 group-hover:animate-pulse translate-x-[2px]">
                {text}
            </span>
            <span className="absolute top-0 left-0 -z-10 w-full h-full text-cyber-accent opacity-0 group-hover:opacity-70 group-hover:animate-pulse -translate-x-[2px]">
                {text}
            </span>
        </div>
    );
};

export default GlitchText;
