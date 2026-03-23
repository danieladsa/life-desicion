'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { NodeCategory } from '@/lib/flowchart-types';
import { categoryColors } from '@/lib/flowchart-types';
import {
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize,
  Download,
  Upload,
  Trash2,
  ChevronDown,
  DollarSign,
  GraduationCap,
  Globe,
  Briefcase,
  Languages,
} from 'lucide-react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/components/language-provider';
import { getCategoryLabel, getUiText, languageOptions } from '@/lib/i18n';

interface ToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onAddNode: (category: NodeCategory) => void;
  onClear: () => void;
  onExport: () => void;
  onImport: () => void;
}

const categoryIcons: Record<NodeCategory, React.ReactNode> = {
  finance: <DollarSign className="h-4 w-4" />,
  education: <GraduationCap className="h-4 w-4" />,
  migration: <Globe className="h-4 w-4" />,
  work: <Briefcase className="h-4 w-4" />,
};

export function Toolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  onAddNode,
  onClear,
  onExport,
  onImport,
}: ToolbarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';
  const t = getUiText(language);

  const categories: NodeCategory[] = ['finance', 'education', 'migration', 'work'];

  return (
    <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between gap-4">
      {/* Left side - Add node */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="gap-2 shadow-lg">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t.addNode}</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {categories.map((category) => (
              <DropdownMenuItem
                key={category}
                onClick={() => onAddNode(category)}
                className="gap-2"
              >
                <span className={cn(categoryColors[category].text)}>
                  {categoryIcons[category]}
                </span>
                {getCategoryLabel(category, language)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Center - Zoom controls */}
      <div className="flex items-center gap-1 bg-card border rounded-lg p-1 shadow-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          disabled={zoom <= 0.25}
          className="h-8 w-8 p-0"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium w-14 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          disabled={zoom >= 2}
          className="h-8 w-8 p-0"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <div className="w-px h-5 bg-border mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetView}
          className="h-8 w-8 p-0"
        >
          <Maximize className="h-4 w-4" />
        </Button>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-1 bg-card border rounded-lg p-1 shadow-lg">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 gap-1.5" title="Language">
              <Languages className="h-4 w-4" />
              <span className="hidden sm:inline text-xs uppercase">{language}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {languageOptions.map((option) => (
              <DropdownMenuItem key={option.value} onClick={() => setLanguage(option.value)}>
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="w-px h-5 bg-border mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="h-8 w-8 p-0"
          title={t.changeTheme}
        >
          {mounted && isDark ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">{t.changeTheme}</span>
        </Button>
        <div className="w-px h-5 bg-border mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={onExport}
          className="h-8 px-2 gap-1.5"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">{t.export}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onImport}
          className="h-8 px-2 gap-1.5"
        >
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline text-xs">{t.import}</span>
        </Button>
        <div className="w-px h-5 bg-border mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
