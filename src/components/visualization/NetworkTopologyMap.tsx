'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Network, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface NetworkNode {
    id: string;
    type: 'host' | 'port' | 'service';
    label: string;
    data?: any;
}

interface NetworkLink {
    source: string;
    target: string;
    type: string;
}

interface NetworkTopologyMapProps {
    nodes: NetworkNode[];
    links: NetworkLink[];
}

export function NetworkTopologyMap({ nodes, links }: NetworkTopologyMapProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

    useEffect(() => {
        if (!svgRef.current || nodes.length === 0) return;

        const svg = d3.select(svgRef.current);
        const width = 800;
        const height = 600;

        // Clear previous content
        svg.selectAll('*').remove();

        // Create container group for zoom
        const g = svg.append('g');

        // Setup zoom behavior
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.5, 3])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        svg.call(zoom as any);

        // Create force simulation
        const simulation = d3.forceSimulation(nodes as any)
            .force('link', d3.forceLink(links)
                .id((d: any) => d.id)
                .distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(30));

        // Create links
        const link = g.append('g')
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke', '#475569')
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0.6);

        // Create nodes
        const node = g.append('g')
            .selectAll('g')
            .data(nodes)
            .join('g')
            .call(d3.drag<any, any>()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended) as any);

        // Add circles to nodes
        node.append('circle')
            .attr('r', (d: any) => {
                if (d.type === 'host') return 20;
                if (d.type === 'port') return 15;
                return 10;
            })
            .attr('fill', (d: any) => {
                if (d.type === 'host') return '#06B6D4';
                if (d.type === 'port') return '#8B5CF6';
                return '#EC4899';
            })
            .attr('stroke', '#1E293B')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .on('click', (event, d: any) => {
                setSelectedNode(d);
            });

        // Add labels to nodes
        node.append('text')
            .text((d: any) => d.label)
            .attr('x', 0)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('fill', '#94A3B8')
            .attr('font-size', '12px')
            .style('pointer-events', 'none');

        // Update positions on simulation tick
        simulation.on('tick', () => {
            link
                .attr('x1', (d: any) => d.source.x)
                .attr('y1', (d: any) => d.source.y)
                .attr('x2', (d: any) => d.target.x)
                .attr('y2', (d: any) => d.target.y);

            node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
        });

        // Drag functions
        function dragstarted(event: any) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event: any) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event: any) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return () => {
            simulation.stop();
        };
    }, [nodes, links]);

    const handleZoomIn = () => {
        const svg = d3.select(svgRef.current);
        svg.transition().call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 1.3);
    };

    const handleZoomOut = () => {
        const svg = d3.select(svgRef.current);
        svg.transition().call(d3.zoom<SVGSVGElement, unknown>().scaleBy as any, 0.7);
    };

    const handleReset = () => {
        const svg = d3.select(svgRef.current);
        svg.transition().call(d3.zoom<SVGSVGElement, unknown>().transform as any, d3.zoomIdentity);
    };

    return (
        <div className="space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Network className="w-6 h-6 text-cyan-400" />
                    <h2 className="text-2xl font-bold">Network Topology Map</h2>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleZoomIn}
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                        title="Zoom In"
                    >
                        <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleZoomOut}
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                        title="Zoom Out"
                    >
                        <ZoomOut className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleReset}
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                        title="Reset View"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Map */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-4">
                    <svg
                        ref={svgRef}
                        width="100%"
                        height="600"
                        viewBox="0 0 800 600"
                        className="bg-slate-950 rounded"
                    />
                </div>

                {/* Legend & Details */}
                <div className="space-y-4">

                    {/* Legend */}
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                        <h3 className="font-bold mb-3">Legend</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-cyan-500" />
                                <span className="text-sm">Host</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full bg-purple-500" />
                                <span className="text-sm">Port</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-pink-500" />
                                <span className="text-sm">Service</span>
                            </div>
                        </div>
                    </div>

                    {/* Node Details */}
                    {selectedNode && (
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                            <h3 className="font-bold mb-3">Node Details</h3>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-slate-400">Type:</span>
                                    <span className="ml-2 font-medium capitalize">{selectedNode.type}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400">Label:</span>
                                    <span className="ml-2 font-medium">{selectedNode.label}</span>
                                </div>
                                {selectedNode.data && (
                                    <div className="mt-3 pt-3 border-t border-slate-800">
                                        <pre className="text-xs text-slate-300 overflow-auto">
                                            {JSON.stringify(selectedNode.data, null, 2)}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                        <h3 className="font-bold mb-3">Statistics</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Total Nodes:</span>
                                <span className="font-medium">{nodes.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Total Links:</span>
                                <span className="font-medium">{links.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Hosts:</span>
                                <span className="font-medium">{nodes.filter(n => n.type === 'host').length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Ports:</span>
                                <span className="font-medium">{nodes.filter(n => n.type === 'port').length}</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}
