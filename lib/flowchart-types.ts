export type NodeCategory = 'finance' | 'education' | 'migration' | 'work';

export type ConnectionLabel = 'yes' | 'no' | 'maybe' | 'none';

export interface FlowNode {
  id: string;
  x: number;
  y: number;
  title: string;
  text: string;
  category: NodeCategory;
  width: number;
  height: number;
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  label: ConnectionLabel;
}

export interface FlowchartState {
  nodes: FlowNode[];
  connections: Connection[];
  selectedNodeId: string | null;
  selectedConnectionId: string | null;
  zoom: number;
  panX: number;
  panY: number;
}

export const categoryColors: Record<NodeCategory, { bg: string; border: string; text: string }> = {
  finance: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-400 dark:border-emerald-500',
    text: 'text-emerald-700 dark:text-emerald-300',
  },
  education: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    border: 'border-indigo-400 dark:border-indigo-500',
    text: 'text-indigo-700 dark:text-indigo-300',
  },
  migration: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-400 dark:border-amber-500',
    text: 'text-amber-700 dark:text-amber-300',
  },
  work: {
    bg: 'bg-sky-50 dark:bg-sky-950/40',
    border: 'border-sky-400 dark:border-sky-500',
    text: 'text-sky-700 dark:text-sky-300',
  },
};

export const categoryLabels: Record<NodeCategory, string> = {
  finance: 'Finanzas',
  education: 'Educación',
  migration: 'Migración',
  work: 'Trabajo',
};

export const connectionColors: Record<ConnectionLabel, string> = {
  yes: '#22c55e',
  no: '#ef4444',
  maybe: '#f59e0b',
  none: '#94a3b8',
};

export const connectionLabels: Record<ConnectionLabel, string> = {
  yes: 'Sí',
  no: 'No',
  maybe: 'Tal vez',
  none: 'Sin etiqueta',
};
