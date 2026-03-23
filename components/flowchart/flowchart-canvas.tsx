'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useFlowchartStore } from '@/lib/flowchart-store';
import type { NodeCategory, ConnectionLabel } from '@/lib/flowchart-types';
import { DecisionNode } from './decision-node';
import { ConnectionLine } from './connection-line';
import { Toolbar } from './toolbar';
import { CategoryLegend } from './category-legend';
import { Minimap } from './minimap';
import { WelcomeOverlay } from './welcome-overlay';
import { NodeEditorSheet } from './node-editor-sheet';
import { cn } from '@/lib/utils';
import type { FlowNode } from '@/lib/flowchart-types';

export function FlowchartCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1000, height: 800 });
  
  // Drag state
  const [isDraggingNode, setIsDraggingNode] = useState(false);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragNodeId, setDragNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [lastPanPos, setLastPanPos] = useState({ x: 0, y: 0 });
  
  // Connection drag state
  const [isCreatingConnection, setIsCreatingConnection] = useState(false);
  const [connectionSource, setConnectionSource] = useState<string | null>(null);
  const [connectionEndPos, setConnectionEndPos] = useState({ x: 0, y: 0 });

  // Editor sheet state
  const [editorSheetOpen, setEditorSheetOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');
  const [editingNode, setEditingNode] = useState<FlowNode | null>(null);
  const [pendingCategory, setPendingCategory] = useState<NodeCategory>('migration');

  const {
    nodes,
    connections,
    selectedNodeId,
    selectedConnectionId,
    zoom,
    panX,
    panY,
    addNode,
    updateNode,
    deleteNode,
    selectNode,
    addConnection,
    updateConnection,
    deleteConnection,
    selectConnection,
    setZoom,
    setPan,
    resetView,
    clearAll,
  } = useFlowchartStore();

  // Update canvas size
  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        setCanvasSize({
          width: canvasRef.current.clientWidth,
          height: canvasRef.current.clientHeight,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Wheel zoom and pan
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();

        const rect = canvas.getBoundingClientRect();
        const pointerX = e.clientX - rect.left;
        const pointerY = e.clientY - rect.top;

        // Keep the point under cursor stable while zooming
        const worldX = (pointerX - panX) / zoom;
        const worldY = (pointerY - panY) / zoom;

        // Smooth, proportional zoom for touchpads/pinch gestures
        const zoomFactor = Math.exp(-e.deltaY * 0.008);
        const nextZoom = Math.max(0.25, Math.min(2, zoom * zoomFactor));

        if (nextZoom === zoom) return;

        const nextPanX = pointerX - worldX * nextZoom;
        const nextPanY = pointerY - worldY * nextZoom;

        setZoom(nextZoom);
        setPan(nextPanX, nextPanY);
      } else {
        setPan(panX - e.deltaX * 0.5, panY - e.deltaY * 0.5);
      }
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [zoom, panX, panY, setZoom, setPan]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId) deleteNode(selectedNodeId);
        else if (selectedConnectionId) deleteConnection(selectedConnectionId);
      } else if (e.key === 'Escape') {
        selectNode(null);
        selectConnection(null);
        setIsCreatingConnection(false);
        setConnectionSource(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, selectedConnectionId, deleteNode, deleteConnection, selectNode, selectConnection]);

  // Convert screen coords to canvas coords
  const screenToCanvas = useCallback((screenX: number, screenY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (screenX - rect.left - panX) / zoom,
      y: (screenY - rect.top - panY) / zoom,
    };
  }, [panX, panY, zoom]);

  // Get node bounds from rendered DOM (fallback to stored values)
  const getNodeBounds = useCallback((node: FlowNode) => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) {
      return { x: node.x, y: node.y, width: node.width, height: node.height };
    }

    const nodeEl = canvasEl.querySelector<HTMLElement>(`[data-node-id="${node.id}"]`);
    if (!nodeEl) {
      return { x: node.x, y: node.y, width: node.width, height: node.height };
    }

    const canvasRect = canvasEl.getBoundingClientRect();
    const nodeRect = nodeEl.getBoundingClientRect();

    return {
      x: (nodeRect.left - canvasRect.left - panX) / zoom,
      y: (nodeRect.top - canvasRect.top - panY) / zoom,
      width: nodeRect.width / zoom,
      height: nodeRect.height / zoom,
    };
  }, [panX, panY, zoom]);

  // Node drag start - NO selection here, only dragging
  const handleNodeMouseDown = useCallback((nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    const canvasPos = screenToCanvas(e.clientX, e.clientY);
    setDragOffset({ x: canvasPos.x - node.x, y: canvasPos.y - node.y });
    setDragNodeId(nodeId);
    setIsDraggingNode(true);
    // DO NOT select node here - selection happens via click on content
  }, [nodes, screenToCanvas]);

  // Connection drag start
  const handleConnectionDragStart = useCallback((nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const canvasPos = screenToCanvas(e.clientX, e.clientY);
    setConnectionSource(nodeId);
    setConnectionEndPos(canvasPos);
    setIsCreatingConnection(true);
  }, [screenToCanvas]);

  // Canvas pan start
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target !== canvasRef.current) return;
    setLastPanPos({ x: e.clientX, y: e.clientY });
    setIsDraggingCanvas(true);
    selectNode(null);
    selectConnection(null);
  }, [selectNode, selectConnection]);

  // Global mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingNode && dragNodeId) {
        const canvasPos = screenToCanvas(e.clientX, e.clientY);
        updateNode(dragNodeId, {
          x: canvasPos.x - dragOffset.x,
          y: canvasPos.y - dragOffset.y,
        });
      } else if (isDraggingCanvas) {
        const dx = e.clientX - lastPanPos.x;
        const dy = e.clientY - lastPanPos.y;
        setPan(panX + dx, panY + dy);
        setLastPanPos({ x: e.clientX, y: e.clientY });
      } else if (isCreatingConnection) {
        const canvasPos = screenToCanvas(e.clientX, e.clientY);
        setConnectionEndPos(canvasPos);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isCreatingConnection && connectionSource) {
        // Find target node under cursor
        const canvasPos = screenToCanvas(e.clientX, e.clientY);
        const targetNode = nodes.find(node => {
          const bounds = getNodeBounds(node);
          const nodeRight = bounds.x + bounds.width;
          const nodeBottom = bounds.y + bounds.height;
          return (
            canvasPos.x >= bounds.x &&
            canvasPos.x <= nodeRight &&
            canvasPos.y >= bounds.y - 20 && // Allow some margin for top connection point
            canvasPos.y <= nodeBottom &&
            node.id !== connectionSource
          );
        });

        if (targetNode) {
          // Check if connection already exists
          const exists = connections.some(
            c => c.sourceId === connectionSource && c.targetId === targetNode.id
          );
          if (!exists) {
            addConnection({
              sourceId: connectionSource,
              targetId: targetNode.id,
              label: 'yes',
            });
          }
        }
      }

      setIsDraggingNode(false);
      setIsDraggingCanvas(false);
      setIsCreatingConnection(false);
      setDragNodeId(null);
      setConnectionSource(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    isDraggingNode, isDraggingCanvas, isCreatingConnection,
    dragNodeId, dragOffset, lastPanPos, connectionSource,
    panX, panY, nodes, connections,
    screenToCanvas, updateNode, setPan, addConnection, getNodeBounds
  ]);

  // Open sheet to create a new node
  const handleAddNode = useCallback((category: NodeCategory) => {
    setPendingCategory(category);
    setEditingNode(null);
    setEditorMode('create');
    setEditorSheetOpen(true);
  }, []);

  // Open sheet to edit existing node
  const handleEditNode = useCallback((node: FlowNode) => {
    setEditingNode(node);
    setEditorMode('edit');
    setEditorSheetOpen(true);
  }, []);

  // Save node from sheet
  const handleSaveNode = useCallback((data: { title: string; text: string; category: NodeCategory }) => {
    if (editorMode === 'create') {
      const centerX = (canvasSize.width / 2 - panX) / zoom;
      const centerY = (canvasSize.height / 2 - panY) / zoom;
      addNode({
        x: centerX - 110,
        y: centerY - 40,
        title: data.title,
        text: data.text,
        category: data.category,
      });
    } else if (editingNode) {
      updateNode(editingNode.id, {
        title: data.title,
        text: data.text,
        category: data.category,
      });
    }
  }, [editorMode, editingNode, addNode, updateNode, canvasSize, panX, panY, zoom]);

  const handleExport = useCallback(() => {
    const state = { nodes, connections };
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'life-decisions.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, connections]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const state = JSON.parse(text);
        if (state.nodes && state.connections) {
          useFlowchartStore.getState().loadState(state);
        }
      } catch (error) {
        console.error('Failed to import:', error);
      }
    };
    input.click();
  }, []);

  // Get connection line endpoints
  const getConnectionPoints = useCallback((sourceId: string, targetId: string) => {
    const source = nodes.find(n => n.id === sourceId);
    const target = nodes.find(n => n.id === targetId);
    if (!source || !target) return null;

    const sourceBounds = getNodeBounds(source);
    const targetBounds = getNodeBounds(target);

    const sourceX = sourceBounds.x + sourceBounds.width / 2;
    const sourceY = sourceBounds.y + sourceBounds.height;
    const targetX = targetBounds.x + targetBounds.width / 2;
    const targetY = targetBounds.y;

    return { sourceX, sourceY, targetX, targetY };
  }, [nodes, getNodeBounds]);

  // Temp connection line while creating
  const getTempConnectionLine = useCallback(() => {
    if (!isCreatingConnection || !connectionSource) return null;
    const source = nodes.find(n => n.id === connectionSource);
    if (!source) return null;

    const sourceBounds = getNodeBounds(source);

    const sourceX = sourceBounds.x + sourceBounds.width / 2;
    const sourceY = sourceBounds.y + sourceBounds.height;

    return { sourceX, sourceY, targetX: connectionEndPos.x, targetY: connectionEndPos.y };
  }, [isCreatingConnection, connectionSource, connectionEndPos, nodes, getNodeBounds]);

  const tempLine = getTempConnectionLine();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      <Toolbar
        zoom={zoom}
        onZoomIn={() => setZoom(Math.min(2, zoom + 0.1))}
        onZoomOut={() => setZoom(Math.max(0.25, zoom - 0.1))}
        onResetView={resetView}
        onAddNode={handleAddNode}
        onClear={clearAll}
        onExport={handleExport}
        onImport={handleImport}
      />

      {/* Main canvas */}
      <div
        ref={canvasRef}
        className={cn(
          'w-full h-full canvas-grid',
          isDraggingCanvas ? 'cursor-grabbing' : 'cursor-grab'
        )}
        onMouseDown={handleCanvasMouseDown}
      >
        {/* Transform container */}
        <div
          className="absolute"
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
        >
          {/* SVG for connections */}
          <svg
            className="absolute overflow-visible"
            style={{ width: 1, height: 1 }}
          >
            <defs>
              <marker
                id="arrowhead-green"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#22c55e" />
              </marker>
              <marker
                id="arrowhead-red"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
              </marker>
              <marker
                id="arrowhead-amber"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
              </marker>
              <marker
                id="arrowhead-gray"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
              </marker>
              <marker
                id="arrowhead-temp"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" className="text-primary" />
              </marker>
            </defs>

            {/* Existing connections */}
            {connections.map((conn) => {
              const points = getConnectionPoints(conn.sourceId, conn.targetId);
              if (!points) return null;

              return (
                <ConnectionLine
                  key={conn.id}
                  connection={conn}
                  points={points}
                  isSelected={selectedConnectionId === conn.id}
                  onSelect={() => selectConnection(conn.id)}
                  onLabelChange={(label) => updateConnection(conn.id, { label })}
                  onDelete={() => deleteConnection(conn.id)}
                />
              );
            })}

            {/* Temporary connection line */}
            {tempLine && (
              <g>
                <path
                  d={`M ${tempLine.sourceX} ${tempLine.sourceY} C ${tempLine.sourceX} ${tempLine.sourceY + 50}, ${tempLine.targetX} ${tempLine.targetY - 50}, ${tempLine.targetX} ${tempLine.targetY - 12}`}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeDasharray="8 4"
                  markerEnd="url(#arrowhead-temp)"
                />
              </g>
            )}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => (
            <DecisionNode
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id}
              onSelect={() => selectNode(node.id)}
              onEdit={() => handleEditNode(node)}
              onDelete={() => deleteNode(node.id)}
              onDragStart={(e) => handleNodeMouseDown(node.id, e)}
              onConnectionStart={(e) => handleConnectionDragStart(node.id, e)}
            />
          ))}
        </div>
      </div>

      <CategoryLegend />

      <Minimap
        nodes={nodes}
        connections={connections}
        viewportX={panX}
        viewportY={panY}
        viewportWidth={canvasSize.width}
        viewportHeight={canvasSize.height}
        zoom={zoom}
        onNavigate={(x, y) => setPan(x, y)}
      />

      <WelcomeOverlay />

      <NodeEditorSheet
        open={editorSheetOpen}
        onOpenChange={setEditorSheetOpen}
        node={editingNode}
        onSave={handleSaveNode}
        mode={editorMode}
        defaultCategory={pendingCategory}
      />
    </div>
  );
}
