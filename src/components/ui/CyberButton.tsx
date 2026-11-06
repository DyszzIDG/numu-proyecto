"use client";
import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import clsx from "clsx";

interface CyberButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "outline";
    glitch?: boolean;
}

const CyberButton: React.FC<CyberButtonProps> = ({
    children,
    variant = "primary",
    glitch = true,
    className,
    ...props
}) => {
    const baseStyles = "relative px-6 py-3 font-mono text-sm uppercase tracking-wider transition-all duration-300 transform clip-path-polygon";

    const variants = {
        primary: "bg-cyber-primary text-cyber-black hover:bg-white hover:text-black shadow-[0_0_10px_rgba(0,240,255,0.5)]",
        secondary: "bg-cyber-secondary text-cyber-black hover:bg-white hover:text-black shadow-[0_0_10px_rgba(10,255,0,0.5)]",
        outline: "bg-transparent border border-cyber-primary text-cyber-primary hover:bg-cyber-primary hover:text-cyber-black",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={clsx(baseStyles, variants[variant], className, "group")}
            {...props}
        >
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>
            {/* Glitch Decorative Lines */}
            {glitch && (
                <>
                    <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
            )}
        </motion.button>
    );
};

export default CyberButton;
