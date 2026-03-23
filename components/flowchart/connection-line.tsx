'use client';

import type { Connection, ConnectionLabel } from '@/lib/flowchart-types';
import { connectionColors } from '@/lib/flowchart-types';
import { useLanguage } from '@/components/language-provider';
import { getConnectionLabel } from '@/lib/i18n';

interface ConnectionLineProps {
  connection: Connection;
  points: {
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
  };
  isSelected: boolean;
  onSelect: () => void;
  onLabelChange: (label: ConnectionLabel) => void;
  onDelete: () => void;
}

export function ConnectionLine({
  connection,
  points,
  isSelected,
  onSelect,
  onLabelChange,
  onDelete,
}: ConnectionLineProps) {
  const { language } = useLanguage();
  const { sourceX, sourceY, targetX, targetY } = points;

  // Calculate control points for bezier curve
  const deltaY = Math.abs(targetY - sourceY);
  const curveOffset = Math.max(40, Math.min(deltaY * 0.5, 100));

  // Pull back arrow endpoint a bit so it doesn't touch the target node
  const control2X = targetX;
  const control2Y = targetY - curveOffset;
  const endGap = 12;
  const endVectorX = targetX - control2X;
  const endVectorY = targetY - control2Y;
  const endVectorLength = Math.hypot(endVectorX, endVectorY) || 1;
  const unitEndX = endVectorX / endVectorLength;
  const unitEndY = endVectorY / endVectorLength;
  const adjustedTargetX = targetX - unitEndX * endGap;
  const adjustedTargetY = targetY - unitEndY * endGap;

  const pathD = `M ${sourceX} ${sourceY} C ${sourceX} ${sourceY + curveOffset}, ${control2X} ${control2Y}, ${adjustedTargetX} ${adjustedTargetY}`;

  // Label position at middle of curve
  const labelX = (sourceX + targetX) / 2;
  const labelY = (sourceY + targetY) / 2;

  const color = connectionColors[connection.label];
  const arrowId =
    connection.label === 'yes'
      ? 'arrowhead-green'
      : connection.label === 'no'
        ? 'arrowhead-red'
        : connection.label === 'maybe'
          ? 'arrowhead-amber'
          : 'arrowhead-gray';
  const hasLabel = connection.label !== 'none';

  const handleLabelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const labels: ConnectionLabel[] = ['yes', 'no', 'maybe', 'none'];
    const currentIndex = labels.indexOf(connection.label);
    const nextIndex = (currentIndex + 1) % labels.length;
    onLabelChange(labels[nextIndex]);
  };

  return (
    <g className="cursor-pointer" onClick={onSelect}>
      {/* Invisible wider path for easier clicking */}
      <path
        d={pathD}
        fill="none"
        stroke="transparent"
        strokeWidth="20"
      />

      {/* Visible path */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={isSelected ? 3 : 2}
        strokeLinecap="round"
        markerEnd={`url(#${arrowId})`}
        style={{
          filter: isSelected ? 'drop-shadow(0 0 4px rgba(0,0,0,0.3))' : 'none',
        }}
      />

      {/* Label pill */}
      {hasLabel && (
        <g onClick={handleLabelClick} className="cursor-pointer">
          <rect
            x={labelX - 30}
            y={labelY - 12}
            width="60"
            height="24"
            rx="12"
            fill={color}
            style={{
              filter: isSelected ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' : 'none',
            }}
          />
          <text
            x={labelX}
            y={labelY + 5}
            textAnchor="middle"
            fill="white"
            fontSize="12"
            fontWeight="600"
            className="select-none pointer-events-none"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            {getConnectionLabel(connection.label, language)}
          </text>
        </g>
      )}

      {/* Quick action to bring label back when hidden */}
      {!hasLabel && isSelected && (
        <g onClick={handleLabelClick} className="cursor-pointer">
          <rect
            x={labelX - 44}
            y={labelY - 12}
            width="88"
            height="24"
            rx="12"
            fill="#64748b"
            opacity="0.9"
          />
          <text
            x={labelX}
            y={labelY + 5}
            textAnchor="middle"
            fill="white"
            fontSize="11"
            fontWeight="600"
            className="select-none pointer-events-none"
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            {getConnectionLabel('none', language)}
          </text>
        </g>
      )}

      {/* Delete button when selected */}
      {isSelected && (
        <g
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="cursor-pointer"
        >
          <circle
            cx={labelX + (hasLabel ? 42 : 58)}
            cy={labelY}
            r="12"
            fill="#ef4444"
          />
          <text
            x={labelX + (hasLabel ? 42 : 58)}
            y={labelY + 5}
            textAnchor="middle"
            fill="white"
            fontSize="16"
            fontWeight="bold"
            className="select-none pointer-events-none"
          >
            ×
          </text>
        </g>
      )}
    </g>
  );
}
