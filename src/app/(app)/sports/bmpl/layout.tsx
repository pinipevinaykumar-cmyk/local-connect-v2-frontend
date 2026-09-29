'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const BMPL_TABS = [
  { href: '/sports/bmpl',               label: 'Overview',    emoji: '🏆' },
  { href: '/sports/bmpl/register',      label: 'Register',    emoji: '📝' },
  { href: '/sports/bmpl/vote',          label: 'Vote',        emoji: '🗳️' },
  { href: '/sports/bmpl/teams',         label: 'Teams',       emoji: '👥' },
  { href: '/sports/bmpl/fixtures',      label: 'Fixtures',    emoji: '📅' },
  { href: '/sports/bmpl/auction',       label: 'Auction',     emoji: '🎯' },
  { href: '/sports/bmpl/scores',        label: 'Live Scores', emoji: '📊' },
  { href: '/sports/bmpl/rankings',      label: 'Rankings',    emoji: '📈' },
  { href: '/sports/bmpl/announcements', label: 'News',        emoji: '📢' },
];

export default function BMPLLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      {/* BMPL sub-nav */}
      <div className="border-b border-[#d9ded2] bg-white">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <div className="flex overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {BMPL_TABS.map(({ href, label, emoji }) => {
              const active = pathname === href || (href !== '/sports/bmpl' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-colors',
                    active
                      ? 'border-[#F59E0B] text-[#17352a]'
                      : 'border-transparent text-[#9aab9e] hover:text-[#5f6d64]',
                  )}
                >
                  <span>{emoji}</span> {label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
