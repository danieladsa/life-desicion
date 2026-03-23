'use client';

import { cn } from '@/lib/utils';
import type { FlowNode } from '@/lib/flowchart-types';
import { categoryColors } from '@/lib/flowchart-types';
import { GripVertical, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/language-provider';
import { getUiText } from '@/lib/i18n';

interface DecisionNodeProps {
  node: FlowNode;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: (e: React.MouseEvent) => void;
  onConnectionStart: (e: React.MouseEvent) => void;
}

export function DecisionNode({
  node,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDragStart,
  onConnectionStart,
}: DecisionNodeProps) {
  const { language } = useLanguage();
  const t = getUiText(language);

  // Handle header mousedown - ONLY for dragging, never selects
  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDragStart(e);
  };

  const colors = categoryColors[node.category] ?? categoryColors.migration;
  const hasDescription = Boolean(node.text?.trim());

  return (
    <div
      data-node-id={node.id}
      className={cn(
        'absolute select-none rounded-xl border-2 node-shadow transition-shadow duration-150',
        colors.bg,
        colors.border,
        isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      style={{
        left: node.x,
        top: node.y,
        width: node.width,
        minHeight: hasDescription ? node.height : undefined,
      }}
    >
      {/* Header - drag handle with title and action buttons */}
      <div
        className={cn(
          'flex items-start justify-between px-2 py-1.5 cursor-grab active:cursor-grabbing',
          hasDescription ? 'rounded-t-[10px] border-b' : 'rounded-[10px]',
          colors.border,
          'bg-white/50 dark:bg-black/20'
        )}
        onMouseDown={handleHeaderMouseDown}
      >
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className={cn('block py-1 text-sm font-semibold leading-tight whitespace-pre-wrap break-words', colors.text)}>
            {node.title || t.untitled}
          </span>
        </div>
        {isSelected && (
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
              title="Editar"
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              title="Eliminar"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      {hasDescription && (
        <div className="p-3">
          <p className={cn('text-xs font-medium leading-relaxed whitespace-pre-line break-words', colors.text)}>
            {node.text}
          </p>
        </div>
      )}

      

      {/* Connection handle - BOTTOM (source) */}
      <div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary border-3 border-background cursor-crosshair hover:scale-110 transition-transform z-10 flex items-center justify-center"
        onMouseDown={(e) => {
          e.stopPropagation();
          onConnectionStart(e);
        }}
        title="Arrastra para conectar"
      >
        <div className="w-2 h-2 rounded-full bg-primary-foreground" />
      </div>

      {/* Connection target - TOP (target indicator) */}
      <div
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-muted border-2 border-border"
      />
    </div>
  );
}
