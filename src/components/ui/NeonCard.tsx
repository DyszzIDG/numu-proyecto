"use client";
import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface NeonCardProps {
    children: React.ReactNode;
    className?: string;
    glowColor?: "cyan" | "green" | "magenta" | "red";
}

const NeonCard: React.FC<NeonCardProps> = ({
    children,
    className,
    glowColor = "cyan"
}) => {
    const glowStyles = {
        cyan: "border-cyber-primary/30 hover:border-cyber-primary shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_20px_rgba(0,240,255,0.3)]",
        green: "border-cyber-secondary/30 hover:border-cyber-secondary shadow-[0_0_15px_rgba(10,255,0,0.1)] hover:shadow-[0_0_20px_rgba(10,255,0,0.3)]",
        magenta: "border-cyber-accent/30 hover:border-cyber-accent shadow-[0_0_15px_rgba(255,0,60,0.1)] hover:shadow-[0_0_20px_rgba(255,0,60,0.3)]",
        red: "border-red-500/30 hover:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={clsx(
                "relative backdrop-blur-md bg-cyber-black/60 border rounded-lg p-6 transition-all duration-300",
                glowStyles[glowColor],
                className
            )}
        >
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-current opacity-50" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-current opacity-50" />

            {children}
        </motion.div>
    );
};

export default NeonCard;
