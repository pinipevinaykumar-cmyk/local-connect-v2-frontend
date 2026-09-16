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
        'relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl transition-all duration-200 w-full h-20',
        'border text-center active:scale-95',
        active
          ? 'border-primary bg-primary text-white shadow-md'
          : 'border-gray-100 bg-white hover:border-primary/30 hover:bg-primary/5 text-gray-700 shadow-sm'
      )}
    >
      <span className="text-2xl leading-none">{category.icon}</span>
      <span className={cn('text-[11px] font-semibold leading-tight', active ? 'text-white' : 'text-gray-600')}>
        {category.name}
      </span>
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            'absolute -top-1.5 -right-1.5 text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full',
            active ? 'bg-white text-primary' : 'bg-primary text-white'
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
