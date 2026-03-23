'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with the canvas and state
const FlowchartCanvas = dynamic(
  () => import('@/components/flowchart/flowchart-canvas').then((mod) => mod.FlowchartCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Cargando LifeMap...</p>
        </div>
      </div>
    ),
  }
);

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      <FlowchartCanvas />
    </main>
  );
}