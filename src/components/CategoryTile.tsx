'use client';

import { cn } from '@/lib/utils';
import type { Category } from '@/types';

interface CategoryTileProps {
  category: Category;
  count?: number;
  onClick?: () => void;
  active?: boolean;
}

export function CategoryTile({ category, count, onClick, active }: CategoryTileProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center justify-center gap-2 p-4 rounded-[16px] transition-all duration-200 w-full aspect-square',
        'border-2 text-center active:scale-95',
        active
          ? 'border-primary bg-primary text-white shadow-md'
          : 'border-gray-100 bg-white hover:border-primary/30 hover:bg-primary/5 text-gray-700'
      )}
    >
      <span className="text-3xl leading-none">{category.icon}</span>
      <span className={cn('text-xs font-semibold leading-tight', active ? 'text-white' : 'text-gray-700')}>
        {category.name}
      </span>
      {count !== undefined && (
        <span
          className={cn(
            'absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full',
            active ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

interface CategoryChipProps {
  label: string;
  icon?: string;
  active?: boolean;
  onClick?: () => void;
}

export function CategoryChip({ label, icon, active, onClick }: CategoryChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap border',
        active
          ? 'bg-primary text-white border-primary'
          : 'bg-white text-gray-600 border-gray-200 hover:border-primary/30'
      )}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
}
