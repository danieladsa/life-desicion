'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { FlowNode, Connection } from '@/lib/flowchart-types';
import { categoryColors } from '@/lib/flowchart-types';

interface MinimapProps {
  nodes: FlowNode[];
  connections: Connection[];
  viewportX: number;
  viewportY: number;
  viewportWidth: number;
  viewportHeight: number;
  zoom: number;
  onNavigate: (x: number, y: number) => void;
}

export function Minimap({
  nodes,
  connections,
  viewportX,
  viewportY,
  viewportWidth,
  viewportHeight,
  zoom,
  onNavigate,
}: MinimapProps) {
  const { bounds, scale, offset } = useMemo(() => {
    if (nodes.length === 0) {
      return {
        bounds: { minX: 0, minY: 0, maxX: 1000, maxY: 800 },
        scale: 0.1,
        offset: { x: 0, y: 0 },
      };
    }

    const padding = 100;
    const minX = Math.min(...nodes.map((n) => n.x)) - padding;
    const minY = Math.min(...nodes.map((n) => n.y)) - padding;
    const maxX = Math.max(...nodes.map((n) => n.x + (n.width || 200))) + padding;
    const maxY = Math.max(...nodes.map((n) => n.y + (n.height || 70))) + padding;

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    const scale = Math.min(160 / contentWidth, 100 / contentHeight);

    return {
      bounds: { minX, minY, maxX, maxY },
      scale,
      offset: { x: -minX * scale, y: -minY * scale },
    };
  }, [nodes]);

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const worldX = (clickX - offset.x) / scale;
    const worldY = (clickY - offset.y) / scale;

    onNavigate(
      -(worldX - viewportWidth / (2 * zoom)),
      -(worldY - viewportHeight / (2 * zoom))
    );
  };

  return (
    <div className="absolute bottom-4 right-4 z-10 bg-card border rounded-lg p-2 shadow-lg">
      <svg
        width={160}
        height={100}
        className="cursor-pointer"
        onClick={handleClick}
      >
        {/* Background */}
        <rect
          x={0}
          y={0}
          width={160}
          height={100}
          fill="hsl(var(--muted))"
          rx={4}
        />

        {/* Connections */}
        {connections.map((conn) => {
          const source = nodes.find((n) => n.id === conn.sourceId);
          const target = nodes.find((n) => n.id === conn.targetId);
          if (!source || !target) return null;

          const x1 = source.x * scale + offset.x + ((source.width || 200) * scale) / 2;
          const y1 = source.y * scale + offset.y + ((source.height || 70) * scale) / 2;
          const x2 = target.x * scale + offset.x + ((target.width || 200) * scale) / 2;
          const y2 = target.y * scale + offset.y + ((target.height || 70) * scale) / 2;

          return (
            <line
              key={conn.id}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="hsl(var(--border))"
              strokeWidth={1}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <rect
            key={node.id}
            x={node.x * scale + offset.x}
            y={node.y * scale + offset.y}
            width={(node.width || 200) * scale}
            height={(node.height || 70) * scale}
            rx={2}
            className={cn(
              node.category === 'finance' && 'fill-emerald-400',
              node.category === 'education' && 'fill-indigo-400',
              node.category === 'migration' && 'fill-amber-400',
              node.category === 'work' && 'fill-sky-400'
            )}
          />
        ))}

        {/* Viewport indicator */}
        <rect
          x={(-viewportX / zoom) * scale + offset.x}
          y={(-viewportY / zoom) * scale + offset.y}
          width={(viewportWidth / zoom) * scale}
          height={(viewportHeight / zoom) * scale}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          rx={2}
        />
      </svg>
    </div>
  );
}
