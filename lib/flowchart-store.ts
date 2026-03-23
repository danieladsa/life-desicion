'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FlowNode, Connection, NodeCategory, ConnectionLabel, FlowchartState } from './flowchart-types';

interface FlowchartStore extends FlowchartState {
  // Node actions
  addNode: (node: Omit<FlowNode, 'id' | 'width' | 'height'> & { title: string; width?: number; height?: number }) => string;
  updateNode: (id: string, updates: Partial<FlowNode>) => void;
  deleteNode: (id: string) => void;
  selectNode: (id: string | null) => void;
  
  // Connection actions
  addConnection: (connection: Omit<Connection, 'id'>) => string;
  updateConnection: (id: string, updates: Partial<Connection>) => void;
  deleteConnection: (id: string) => void;
  selectConnection: (id: string | null) => void;
  
  // Canvas actions
  setZoom: (zoom: number) => void;
  setPan: (panX: number, panY: number) => void;
  resetView: () => void;
  
  // State actions
  clearAll: () => void;
  loadState: (state: Partial<FlowchartState>) => void;
}

const normalizeCategory = (category: unknown): NodeCategory => {
  if (category === 'finance' || category === 'education' || category === 'migration' || category === 'work') {
    return category;
  }
  return 'migration';
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const initialState: FlowchartState = {
  nodes: [
    {
      id: 'node-1',
      x: 400,
      y: 100,
      title: 'Decision Principal',
      text: '¿Estudiar o trabajar en Estados Unidos?',
      category: 'migration',
      width: 260,
      height: 80,
    },
    {
      id: 'node-2',
      x: 200,
      y: 250,
      title: 'Finanzas',
      text: '¿Tengo suficiente dinero?',
      category: 'finance',
      width: 220,
      height: 70,
    },
    {
      id: 'node-3',
      x: 550,
      y: 250,
      title: 'Idioma',
      text: '¿Mi nivel de inglés es suficiente?',
      category: 'education',
      width: 240,
      height: 70,
    },
    {
      id: 'node-4',
      x: 100,
      y: 400,
      title: 'Financiamiento',
      text: 'Buscar becas o financiamiento',
      category: 'finance',
      width: 220,
      height: 70,
    },
    {
      id: 'node-5',
      x: 350,
      y: 400,
      title: 'Documentos',
      text: 'Preparar documentos de visa',
      category: 'migration',
      width: 220,
      height: 70,
    },
    {
      id: 'node-6',
      x: 600,
      y: 400,
      title: 'Estudiar Ingles',
      text: 'Tomar curso de inglés',
      category: 'education',
      width: 200,
      height: 70,
    },
    {
      id: 'node-7',
      x: 250,
      y: 550,
      title: 'Alternativa',
      text: '¿Volver a Brasil?',
      category: 'migration',
      width: 180,
      height: 70,
    },
    {
      id: 'node-8',
      x: 500,
      y: 550,
      title: 'Trabajo Remoto',
      text: 'Buscar trabajo remoto',
      category: 'work',
      width: 200,
      height: 70,
    },
  ],
  connections: [
    { id: 'conn-1', sourceId: 'node-1', targetId: 'node-2', label: 'yes' },
    { id: 'conn-2', sourceId: 'node-1', targetId: 'node-3', label: 'maybe' },
    { id: 'conn-3', sourceId: 'node-2', targetId: 'node-4', label: 'no' },
    { id: 'conn-4', sourceId: 'node-2', targetId: 'node-5', label: 'yes' },
    { id: 'conn-5', sourceId: 'node-3', targetId: 'node-6', label: 'no' },
    { id: 'conn-6', sourceId: 'node-3', targetId: 'node-5', label: 'yes' },
    { id: 'conn-7', sourceId: 'node-4', targetId: 'node-7', label: 'maybe' },
    { id: 'conn-8', sourceId: 'node-5', targetId: 'node-8', label: 'yes' },
    { id: 'conn-9', sourceId: 'node-6', targetId: 'node-3', label: 'yes' },
  ],
  selectedNodeId: null,
  selectedConnectionId: null,
  zoom: 1,
  panX: 0,
  panY: 0,
};

export const useFlowchartStore = create<FlowchartStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addNode: (node) => {
        const id = generateId();
        const newNode: FlowNode = {
          ...node,
          id,
          category: normalizeCategory(node.category),
          width: node.width ?? 220,
          height: node.height ?? 80,
        };
        set((state) => ({
          nodes: [...state.nodes, newNode],
          selectedNodeId: id,
        }));
        return id;
      },

      updateNode: (id, updates) => {
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === id ? { ...node, ...updates } : node
          ),
        }));
      },

      deleteNode: (id) => {
        set((state) => ({
          nodes: state.nodes.filter((node) => node.id !== id),
          connections: state.connections.filter(
            (conn) => conn.sourceId !== id && conn.targetId !== id
          ),
          selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
        }));
      },

      selectNode: (id) => {
        set({ selectedNodeId: id, selectedConnectionId: null });
      },

      addConnection: (connection) => {
        const id = generateId();
        const existing = get().connections.find(
          (c) => c.sourceId === connection.sourceId && c.targetId === connection.targetId
        );
        if (existing) return existing.id;
        
        set((state) => ({
          connections: [...state.connections, { ...connection, id }],
        }));
        return id;
      },

      updateConnection: (id, updates) => {
        set((state) => ({
          connections: state.connections.map((conn) =>
            conn.id === id ? { ...conn, ...updates } : conn
          ),
        }));
      },

      deleteConnection: (id) => {
        set((state) => ({
          connections: state.connections.filter((conn) => conn.id !== id),
          selectedConnectionId: state.selectedConnectionId === id ? null : state.selectedConnectionId,
        }));
      },

      selectConnection: (id) => {
        set({ selectedConnectionId: id, selectedNodeId: null });
      },

      setZoom: (zoom) => {
        set({ zoom: Math.max(0.25, Math.min(2, zoom)) });
      },

      setPan: (panX, panY) => {
        set({ panX, panY });
      },

      resetView: () => {
        set({ zoom: 1, panX: 0, panY: 0 });
      },

      clearAll: () => {
        set({
          nodes: [],
          connections: [],
          selectedNodeId: null,
          selectedConnectionId: null,
        });
      },

      loadState: (state) => {
        const normalizedNodes = state.nodes?.map((node) => ({
          ...node,
          category: normalizeCategory(node.category),
        }));

        set((currentState) => ({
          ...currentState,
          ...state,
          nodes: normalizedNodes ?? currentState.nodes,
        }));
      },
    }),
    {
      name: 'life-decisions-flowchart-v2',
      partialize: (state) => ({
        nodes: state.nodes,
        connections: state.connections,
        zoom: state.zoom,
        panX: state.panX,
        panY: state.panY,
      }),
      // Migrate old data to ensure title field exists
      onRehydrateStorage: () => (state) => {
        if (state?.nodes) {
          state.nodes = state.nodes.map(node => ({
            ...node,
            category: normalizeCategory(node.category),
            title: node.title || (node as { text?: string }).text?.substring(0, 30) || 'Sin titulo',
          }));
        }
      },
    }
  )
);
