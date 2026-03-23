'use client';

import { Button } from '@/components/ui/button';
import { useFlowchartStore } from '@/lib/flowchart-store';
import { GitBranch, Plus, MousePointer2, Zap } from 'lucide-react';

export function WelcomeOverlay() {
  const { nodes, addNode } = useFlowchartStore();

  if (nodes.length > 0) return null;

  const handleGetStarted = () => {
    addNode({
      x: 400,
      y: 200,
      text: '¿Cuál es mi siguiente paso en la vida?',
      category: 'migration',
    });
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="max-w-md text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <GitBranch className="h-8 w-8 text-primary" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">
          Bienvenido a LifeMap
        </h2>
        
        <p className="text-muted-foreground mb-8">
          Crea mapas visuales interactivos para planificar y explorar diferentes caminos de vida basados en tus decisiones.
        </p>

        <Button onClick={handleGetStarted} size="lg" className="gap-2 mb-8">
          <Plus className="h-5 w-5" />
          Crear mi primer nodo
        </Button>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="bg-card border rounded-lg p-4">
            <MousePointer2 className="h-5 w-5 text-primary mb-2" />
            <h3 className="font-medium text-sm mb-1">Arrastra</h3>
            <p className="text-xs text-muted-foreground">
              Mueve nodos y navega el canvas
            </p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <Zap className="h-5 w-5 text-primary mb-2" />
            <h3 className="font-medium text-sm mb-1">Conecta</h3>
            <p className="text-xs text-muted-foreground">
              Crea flujos con Sí, No, Tal vez
            </p>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <GitBranch className="h-5 w-5 text-primary mb-2" />
            <h3 className="font-medium text-sm mb-1">Explora</h3>
            <p className="text-xs text-muted-foreground">
              Visualiza diferentes caminos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
