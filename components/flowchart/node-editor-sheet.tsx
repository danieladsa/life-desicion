'use client';

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { FlowNode, NodeCategory } from '@/lib/flowchart-types';
import { categoryColors } from '@/lib/flowchart-types';
import { DollarSign, GraduationCap, Globe, Briefcase } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import { getCategoryLabel, getUiText } from '@/lib/i18n';

interface NodeEditorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: FlowNode | null;
  onSave: (data: { title: string; text: string; category: NodeCategory }) => void;
  mode: 'create' | 'edit';
  defaultCategory?: NodeCategory;
}

const categoryIcons: Record<NodeCategory, React.ReactNode> = {
  finance: <DollarSign className="h-4 w-4" />,
  education: <GraduationCap className="h-4 w-4" />,
  migration: <Globe className="h-4 w-4" />,
  work: <Briefcase className="h-4 w-4" />,
};

export function NodeEditorSheet({
  open,
  onOpenChange,
  node,
  onSave,
  mode,
  defaultCategory = 'migration',
}: NodeEditorSheetProps) {
  const { language } = useLanguage();
  const t = getUiText(language);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [category, setCategory] = useState<NodeCategory>(defaultCategory);
  const categories: NodeCategory[] = ['finance', 'education', 'migration', 'work'];

  useEffect(() => {
    if (node && mode === 'edit') {
      setTitle(node.title);
      setText(node.text);
      setCategory(node.category);
    } else if (mode === 'create') {
      setTitle('');
      setText('');
      setCategory(defaultCategory);
    }
  }, [node, mode, open, defaultCategory]);

  const handleSave = () => {
    const finalTitle = title.trim() || getCategoryLabel(category, language);
    onSave({ title: finalTitle, text: text.trim(), category });
    onOpenChange(false);
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter') return;

    e.preventDefault();

    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    const insertion = start === 0 ? '• ' : '\n• ';
    const nextValue = value.slice(0, start) + insertion + value.slice(end);
    setText(nextValue);

    const nextCursorPos = start + insertion.length;
    requestAnimationFrame(() => {
      textarea.selectionStart = nextCursorPos;
      textarea.selectionEnd = nextCursorPos;
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[340px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>
            {mode === 'create' ? t.createNote : t.editNote}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="node-title">{t.title}</Label>
            <Input
              id="node-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.titlePlaceholder}
              autoFocus
            />
          </div>

          {/* Text/Description */}
          <div className="space-y-2">
            <Label htmlFor="node-text">{t.description}</Label>
            <Textarea
              id="node-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleDescriptionKeyDown}
              placeholder={t.descriptionPlaceholder}
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>{t.category}</Label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all',
                    categoryColors[cat].bg,
                    category === cat
                      ? cn(categoryColors[cat].border, 'ring-2 ring-offset-2 ring-offset-background', categoryColors[cat].border.replace('border-', 'ring-'))
                      : 'border-transparent hover:border-muted-foreground/20'
                  )}
                >
                  <span className={categoryColors[cat].text}>
                    {categoryIcons[cat]}
                  </span>
                  <span className={categoryColors[cat].text}>
                    {getCategoryLabel(cat, language)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Save button */}
          <Button onClick={handleSave} className="w-full">
            {mode === 'create' ? t.create : t.save}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
