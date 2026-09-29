'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FixturesPage() {
  const [tab, setTab] = useState<'fixtures' | 'points'>('fixtures');

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:px-6">
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-[#17352a]">📅 BMPL 2027 Fixtures</h2>
        <p className="text-sm text-[#5f6d64]">Nov 20 – Dec 2027 · Biccavolu Mandal</p>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex gap-2">
        {(['fixtures', 'points'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-colors',
              tab === t ? 'bg-[#1E7B3B] text-white' : 'border border-[#d9ded2] bg-white text-[#5f6d64] hover:border-[#1E7B3B]/40')}>
            {t === 'fixtures' ? '📅 Fixtures' : '📊 Points Table'}
          </button>
        ))}
      </div>

      {tab === 'fixtures' && (
        <div className="flex flex-col items-center justify-center py-16 gap-4 rounded-2xl border-2 border-dashed border-[#d9ded2] bg-white">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f5f3ed] text-3xl">📅</div>
          <div className="text-center">
            <p className="font-extrabold text-[#17352a]">Fixtures Not Yet Published</p>
            <p className="text-sm text-[#5f6d64] mt-1.5 max-w-sm">
              Match schedule will be published after teams are formed following the player auction on <strong>Nov 15, 2027</strong>.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-center">
            {[
              { phase: 'Phase 6 · Nov 15', label: 'Player Auction → Teams Formed' },
              { phase: 'Phase 7 · Nov 20', label: 'Tournament Begins · Fixtures Published' },
            ].map(({ phase, label }) => (
              <div key={phase} className="flex items-center gap-2 rounded-full bg-[#f5f3ed] px-4 py-2 text-xs text-[#5f6d64]">
                <Lock size={10} className="text-[#9aab9e]" />
                <span className="font-semibold text-[#9aab9e]">{phase}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'points' && (
        <div className="rounded-2xl border border-[#d9ded2] bg-white overflow-hidden">
          <div className="bg-[#0a2016] px-5 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-white/60">Points Table · BMPL 2027</p>
          </div>
          <div className="flex flex-col items-center justify-center py-14 gap-3">
            <span className="text-3xl">📊</span>
            <p className="font-bold text-[#17352a]">Points table not available yet</p>
            <p className="text-xs text-[#9aab9e] text-center max-w-xs">
              The points table will update after the first match on Nov 20, 2027. Check back once the tournament begins.
            </p>
          </div>
          <div className="px-5 py-3 bg-[#f5f3ed] text-[10px] text-[#9aab9e]">
            Tournament begins Nov 20, 2027. Points table will update after each match.
          </div>
        </div>
      )}
    </div>
  );
}
