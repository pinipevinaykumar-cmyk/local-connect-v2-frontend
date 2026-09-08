'use client';

import { MapPin, ChevronRight } from 'lucide-react';
import type { User } from '@/types';

interface LocationBreadcrumbProps {
  user: User | null;
}

export function LocationBreadcrumb({ user }: LocationBreadcrumbProps) {
  if (!user) return null;

  const parts = [
    'Andhra Pradesh',
    user.district?.name,
    user.mandal?.name,
    user.village?.name,
  ].filter(Boolean) as string[];

  return (
    <div className="flex items-center gap-1 text-xs text-white/80 flex-wrap">
      <MapPin size={12} className="text-accent flex-shrink-0" />
      {parts.map((part, index) => (
        <span key={index} className="flex items-center gap-1">
          <span className={index === parts.length - 1 ? 'text-white font-semibold' : 'text-white/70'}>
            {part}
          </span>
          {index < parts.length - 1 && (
            <ChevronRight size={10} className="text-white/40" />
          )}
        </span>
      ))}
    </div>
  );
}

export function LocationBreadcrumbDark({ user }: LocationBreadcrumbProps) {
  if (!user) return null;

  const parts = [
    'Andhra Pradesh',
    user.district?.name,
    user.mandal?.name,
    user.village?.name,
  ].filter(Boolean) as string[];

  return (
    <div className="flex items-center gap-1 text-xs flex-wrap">
      <MapPin size={12} className="text-primary flex-shrink-0" />
      {parts.map((part, index) => (
        <span key={index} className="flex items-center gap-1">
          <span className={index === parts.length - 1 ? 'text-gray-900 font-semibold' : 'text-gray-500'}>
            {part}
          </span>
          {index < parts.length - 1 && (
            <ChevronRight size={10} className="text-gray-300" />
          )}
        </span>
      ))}
    </div>
  );
}
