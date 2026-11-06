"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Tag, Monitor } from 'lucide-react';

interface ToolCardProps {
    name: string;
    description: string;
    url?: string;
    tags: string[];
    platform?: string;
    isPaid: boolean;
    featured: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({
    name,
    description,
    url,
    tags,
    platform,
    isPaid,
    featured,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className={`
        relative p-6 rounded-xl border backdrop-blur-sm
        transition-all duration-300 group
        ${featured
                    ? 'bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }
      `}
        >
            {/* Featured Badge */}
            {featured && (
                <div className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full text-xs font-bold">
                    ⭐ FEATURED
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {name}
                </h3>
                {!isPaid && (
                    <span className="px-2 py-1 text-xs font-mono bg-green-500/20 text-green-400 border border-green-500/30 rounded">
                        FREE
                    </span>
                )}
                {isPaid && (
                    <span className="px-2 py-1 text-xs font-mono bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded">
                        PAID
                    </span>
                )}
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-3">
                {description}
            </p>

            {/* Platform */}
            {platform && (
                <div className="flex items-center gap-2 mb-3">
                    <Monitor className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-400 font-mono">{platform}</span>
                </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.slice(0, 4).map((tag, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-black/30 text-gray-400 rounded border border-white/5"
                        >
                            <Tag className="w-3 h-3" />
                            {tag}
                        </span>
                    ))}
                    {tags.length > 4 && (
                        <span className="text-xs text-gray-500 self-center">
                            +{tags.length - 4} more
                        </span>
                    )}
                </div>
            )}

            {/* Link */}
            {url && (
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
            inline-flex items-center gap-2 px-4 py-2 mt-2
            bg-gradient-to-r from-cyan-500/10 to-purple-500/10
            hover:from-cyan-500/20 hover:to-purple-500/20
            border border-cyan-500/30 hover:border-cyan-500/50
            rounded-lg text-sm font-medium text-cyan-400
            transition-all duration-300
            group/link
          "
                    onClick={(e) => e.stopPropagation()}
                >
                    <span>Visit Tool</span>
                    <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </a>
            )}
        </motion.div>
    );
};

export default ToolCard;
