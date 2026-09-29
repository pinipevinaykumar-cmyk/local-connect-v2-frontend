'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const TABS = [
  { href: '/sports',               label: 'Dashboard',    emoji: '🏠' },
  { href: '/sports/bmpl',          label: 'BMPL',         emoji: '🏆', featured: true },
  { href: '/sports/tournaments',   label: 'Tournaments',  emoji: '🏆' },
  { href: '/sports/teams',         label: 'Teams',        emoji: '👥' },
  { href: '/sports/players',       label: 'Players',      emoji: '🏏' },
  { href: '/sports/scores',        label: 'Live Scores',  emoji: '📊' },
  { href: '/sports/upcoming',      label: 'Upcoming',     emoji: '📅' },
  { href: '/sports/venues',        label: 'Venues',       emoji: '🎯' },
  { href: '/sports/rankings',      label: 'Rankings',     emoji: '📈' },
  { href: '/sports/achievements',  label: 'Achievements', emoji: '🏅' },
  { href: '/sports/gallery',       label: 'Gallery',      emoji: '📸' },
];

export default function SportsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh bg-[#f5f3ed]">
      {/* Sports header */}
      <div className="bg-[#0a2016]">
        <div className="mx-auto max-w-7xl px-4 pt-5 pb-0 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl drop-shadow">🏏</span>
              <div>
                <h1 className="text-base font-bold text-white tracking-tight">Local Connect Sports</h1>
                <p className="text-[11px] text-white/50">Players · Teams · Tournaments · Live Scores</p>
              </div>
            </div>
            <Link
              href="/sports/tournaments/create"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#F59E0B] px-4 py-2 text-xs font-bold text-[#17352a] hover:bg-[#fbbf24] transition-colors shrink-0"
            >
              + Create Tournament
            </Link>
          </div>

          {/* BMPL announcement strip */}
          <Link
            href="/sports/bmpl"
            className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 px-4 py-2.5 hover:bg-[#F59E0B]/15 transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-lg shrink-0">🏆</span>
              <div className="min-w-0">
                <span className="text-xs font-extrabold text-[#F59E0B] uppercase tracking-[0.06em]">BMPL 2027</span>
                <span className="mx-2 text-white/30">·</span>
                <span className="text-xs text-white/60">Biccavolu Mandal Premier League</span>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-[#F59E0B] px-3 py-1 text-[10px] font-bold text-[#17352a]">
              Register Now →
            </span>
          </Link>

          {/* Tab bar */}
          <div className="mt-3 flex gap-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map(({ href, label, emoji, featured }) => {
              const active = pathname === href || (href !== '/sports' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex shrink-0 items-center gap-1.5 border-b-2 px-3.5 py-3 text-xs font-semibold whitespace-nowrap transition-colors',
                    featured && !active && 'text-[#F59E0B]/80 border-[#F59E0B]/30 hover:text-[#F59E0B]',
                    active && featured && 'border-[#F59E0B] text-[#F59E0B]',
                    active && !featured && 'border-[#F59E0B] text-white',
                    !active && !featured && 'border-transparent text-white/50 hover:text-white/80',
                  )}
                >
                  <span>{emoji}</span>
                  <span className="hidden sm:inline">{label}</span>
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
