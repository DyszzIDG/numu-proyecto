"use client";
import React from "react";

const DynamicBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Moving Blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-cyber-primary/30 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-cyber-secondary/30 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyber-accent/30 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-blob animation-delay-4000" />

            {/* Drifting Starfield / Particles */}
            {/* Using a simple CSS radial gradient pattern that moves */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="absolute inset-0 bg-cyber-dark/50 backdrop-blur-[1px]" />
        </div>
    );
};

export default DynamicBackground;
