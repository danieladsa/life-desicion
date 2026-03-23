'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useFlowchartStore } from '@/lib/flowchart-store';
import type { NodeCategory } from '@/lib/flowchart-types';
import { categoryLabels, categoryColors } from '@/lib/flowchart-types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  DollarSign,
  GraduationCap,
  Globe,
  Briefcase,
  X,
  Save,
} from 'lucide-react';

const categoryIcons: Record<NodeCategory, React.ReactNode> = {
  finance: <DollarSign className="h-4 w-4" />,
  education: <GraduationCap className="h-4 w-4" />,
  migration: <Globe className="h-4 w-4" />,
  work: <Briefcase className="h-4 w-4" />,
};

export function NodeEditor() {
  const { nodes, selectedNodeId, updateNode, selectNode } = useFlowchartStore();
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  
  const [text, setText] = useState('');
  const [category, setCategory] = useState<NodeCategory>('migration');

  useEffect(() => {
    if (selectedNode) {
      setText(selectedNode.text);
      setCategory(selectedNode.category);
    }
  }, [selectedNode]);

  const handleSave = () => {
    if (selectedNode && text.trim()) {
      updateNode(selectedNode.id, { text: text.trim(), category });
    }
    selectNode(null);
  };

  const handleClose = () => {
    selectNode(null);
  };

  if (!selectedNode) return null;

  return (
    <Sheet open={!!selectedNode} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Editar Decisión</SheetTitle>
          <SheetDescription>
            Modifica el texto y la categoría de esta decisión.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="decision-text">Texto de la decisión</Label>
            <Textarea
              id="decision-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="¿Qué decisión estás considerando?"
              className="min-h-[100px] resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Categoría</Label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(categoryLabels) as NodeCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all',
                    categoryColors[cat].bg,
                    category === cat
                      ? cn(categoryColors[cat].border, 'ring-2 ring-offset-2 ring-primary')
                      : 'border-transparent hover:border-border'
                  )}
                >
                  <span className={categoryColors[cat].text}>
                    {categoryIcons[cat]}
                  </span>
                  <span className={cn('text-sm font-medium', categoryColors[cat].text)}>
                    {categoryLabels[cat]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
