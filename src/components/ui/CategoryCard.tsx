"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';

interface CategoryCardProps {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    toolCount: number;
}

const colorClasses: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    cyan: {
        bg: 'from-cyan-500/10 to-cyan-600/5',
        border: 'border-cyan-500/30 hover:border-cyan-500/50',
        text: 'text-cyan-400',
        glow: 'shadow-[0_0_20px_rgba(6,182,212,0.2)]',
    },
    magenta: {
        bg: 'from-fuchsia-500/10 to-fuchsia-600/5',
        border: 'border-fuchsia-500/30 hover:border-fuchsia-500/50',
        text: 'text-fuchsia-400',
        glow: 'shadow-[0_0_20px_rgba(217,70,239,0.2)]',
    },
    green: {
        bg: 'from-green-500/10 to-green-600/5',
        border: 'border-green-500/30 hover:border-green-500/50',
        text: 'text-green-400',
        glow: 'shadow-[0_0_20px_rgba(34,197,94,0.2)]',
    },
    orange: {
        bg: 'from-orange-500/10 to-orange-600/5',
        border: 'border-orange-500/30 hover:border-orange-500/50',
        text: 'text-orange-400',
        glow: 'shadow-[0_0_20px_rgba(249,115,22,0.2)]',
    },
    blue: {
        bg: 'from-blue-500/10 to-blue-600/5',
        border: 'border-blue-500/30 hover:border-blue-500/50',
        text: 'text-blue-400',
        glow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]',
    },
    purple: {
        bg: 'from-purple-500/10 to-purple-600/5',
        border: 'border-purple-500/30 hover:border-purple-500/50',
        text: 'text-purple-400',
        glow: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]',
    },
    red: {
        bg: 'from-red-500/10 to-red-600/5',
        border: 'border-red-500/30 hover:border-red-500/50',
        text: 'text-red-400',
        glow: 'shadow-[0_0_20px_rgba(239,68,68,0.2)]',
    },
};

const CategoryCard: React.FC<CategoryCardProps> = ({
    id,
    name,
    description,
    icon,
    color,
    toolCount,
}) => {
    const colors = colorClasses[color] || colorClasses.cyan;

    // Dynamically get the icon component
    const IconComponent = (LucideIcons as any)[icon] || LucideIcons.Wrench;

    return (
        <Link href={`/dashboard/csirt-tools/${id}`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`
          relative p-6 rounded-xl border backdrop-blur-sm
          bg-gradient-to-br ${colors.bg}
          ${colors.border}
          transition-all duration-300 cursor-pointer
          hover:${colors.glow}
          group
        `}
            >
                {/* Icon */}
                <div className={`mb-4 p-4 bg-black/30 rounded-full w-fit border border-white/5`}>
                    <IconComponent className={`w-8 h-8 ${colors.text}`} />
                </div>

                {/* Title */}
                <h3 className={`text-xl font-bold mb-2 ${colors.text} group-hover:text-white transition-colors`}>
                    {name}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {description}
                </p>

                {/* Tool Count */}
                <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-500">
                        {toolCount} {toolCount === 1 ? 'tool' : 'tools'}
                    </span>
                    <LucideIcons.ArrowRight className={`w-4 h-4 ${colors.text} group-hover:translate-x-2 transition-transform`} />
                </div>

                {/* Decorative corner */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${colors.bg} rounded-bl-full opacity-30`} />
            </motion.div>
        </Link>
    );
};

export default CategoryCard;
