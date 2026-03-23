'use client';

import { cn } from '@/lib/utils';
import type { NodeCategory } from '@/lib/flowchart-types';
import { categoryColors, connectionColors } from '@/lib/flowchart-types';
import {
  DollarSign,
  GraduationCap,
  Globe,
  Briefcase,
} from 'lucide-react';
import { useLanguage } from '@/components/language-provider';
import { getCategoryLabel, getConnectionLabel, getUiText } from '@/lib/i18n';

const categoryIcons: Record<NodeCategory, React.ReactNode> = {
  finance: <DollarSign className="h-3.5 w-3.5" />,
  education: <GraduationCap className="h-3.5 w-3.5" />,
  migration: <Globe className="h-3.5 w-3.5" />,
  work: <Briefcase className="h-3.5 w-3.5" />,
};

export function CategoryLegend() {
  const { language } = useLanguage();
  const t = getUiText(language);
  const categories: NodeCategory[] = ['finance', 'education', 'migration', 'work'];
  const connections: Array<'yes' | 'no' | 'maybe' | 'none'> = ['yes', 'no', 'maybe', 'none'];

  return (
    <div className="absolute bottom-4 left-4 z-10 bg-card border rounded-lg p-3 shadow-lg max-w-xs">
      <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
        {t.categories}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {categories.map((category) => (
          <div
            key={category}
            className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium',
              categoryColors[category].bg,
              categoryColors[category].text
            )}
          >
            {categoryIcons[category]}
            <span>{getCategoryLabel(category, language)}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t">
        <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
          {t.connections}
        </h3>
        <div className="flex gap-3">
          {connections.map((label) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: connectionColors[label] }}
              />
              <span className="text-xs text-muted-foreground">
                {getConnectionLabel(label, language)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
