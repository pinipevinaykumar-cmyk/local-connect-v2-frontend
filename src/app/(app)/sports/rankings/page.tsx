'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

type TeamRow    = { rank: number; name: string; village: string; played: number; won: number; lost: number; pts: number; nrr: string };
type BatsmanRow = { rank: number; name: string; village: string; matches: number; runs: number; avg: number; sr: number; hs: number };
type BowlerRow  = { rank: number; name: string; village: string; matches: number; wickets: number; avg: number; econ: number; best: string };

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

const teams:    TeamRow[]    = [];
const batsmen:  BatsmanRow[] = [];
const bowlers:  BowlerRow[]  = [];

export default function RankingsPage() {
  const [tab, setTab] = useState<'teams' | 'batsmen' | 'bowlers'>('teams');

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:px-6">
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-[#17352a]">Rankings</h2>
        <p className="text-sm text-[#5f6d64]">BMPL 2027 · Biccavolu Mandal</p>
      </div>

      <div className="mb-5 flex gap-2">
        {([['teams', '🏏 Teams'], ['batsmen', '🏅 Batsmen'], ['bowlers', '⚾ Bowlers']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={cn('rounded-full px-4 py-1.5 text-xs font-semibold transition-colors',
              tab === key ? 'bg-[#1E7B3B] text-white' : 'border border-[#d9ded2] bg-white text-[#5f6d64] hover:border-[#1E7B3B]/40')}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'teams' && (
        teams.length > 0 ? (
          <div className="rounded-2xl border border-[#d9ded2] bg-white overflow-hidden">
            <div className="bg-[#0a2016] px-5 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.08em] text-white/60">Points Table · BMPL 2027</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f5f3ed] bg-[#f5f3ed]">
                  {['#', 'Team', 'P', 'W', 'L', 'Pts', 'NRR'].map((h) => (
                    <th key={h} className={cn('py-2.5 text-[10px] font-bold uppercase tracking-wide text-[#9aab9e]', h === 'Team' ? 'text-left px-5' : 'text-center px-3')}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teams.map((t) => (
                  <tr key={t.rank} className={cn('border-b border-[#f5f3ed]', t.rank <= 2 && 'bg-green-50/40')}>
                    <td className="px-3 py-3 text-center">{MEDAL[t.rank] ?? <span className="text-xs font-bold text-[#9aab9e]">{t.rank}</span>}</td>
                    <td className="px-5 py-3"><p className="font-semibold text-[#17352a]">{t.name}</p><p className="text-[10px] text-[#9aab9e]">{t.village}</p></td>
                    <td className="px-3 py-3 text-center text-[#5f6d64]">{t.played}</td>
                    <td className="px-3 py-3 text-center font-bold text-green-700">{t.won}</td>
                    <td className="px-3 py-3 text-center text-red-500">{t.lost}</td>
                    <td className="px-3 py-3 text-center font-extrabold text-[#17352a]">{t.pts}</td>
                    <td className={cn('px-3 py-3 text-center text-xs font-semibold', t.nrr.startsWith('+') ? 'text-green-600' : 'text-red-500')}>{t.nrr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState icon="🏏" text="Team rankings will appear once matches are played" />
      )}

      {tab === 'batsmen' && (
        batsmen.length > 0 ? (
          <div className="rounded-2xl border border-[#d9ded2] bg-white overflow-hidden">
            <div className="bg-[#0a2016] px-5 py-3"><p className="text-xs font-bold uppercase tracking-[0.08em] text-white/60">Top Run Scorers</p></div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f5f3ed] bg-[#f5f3ed]">
                  {['#', 'Player', 'M', 'Runs', 'Avg', 'SR', 'HS'].map((h) => (
                    <th key={h} className={cn('py-2.5 text-[10px] font-bold uppercase tracking-wide text-[#9aab9e]', h === 'Player' ? 'text-left px-5' : 'text-center px-3')}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {batsmen.map((p) => (
                  <tr key={p.rank} className="border-b border-[#f5f3ed]">
                    <td className="px-3 py-3 text-center">{MEDAL[p.rank] ?? <span className="text-xs font-bold text-[#9aab9e]">{p.rank}</span>}</td>
                    <td className="px-5 py-3"><p className="font-semibold text-[#17352a]">{p.name}</p><p className="text-[10px] text-[#9aab9e]">{p.village}</p></td>
                    <td className="px-3 py-3 text-center text-[#5f6d64]">{p.matches}</td>
                    <td className="px-3 py-3 text-center font-extrabold text-[#17352a]">{p.runs}</td>
                    <td className="px-3 py-3 text-center text-[#5f6d64]">{p.avg}</td>
                    <td className="px-3 py-3 text-center text-[#5f6d64]">{p.sr}</td>
                    <td className="px-3 py-3 text-center font-bold text-[#17352a]">{p.hs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState icon="🏅" text="Batting rankings will appear after matches are scored" />
      )}

      {tab === 'bowlers' && (
        bowlers.length > 0 ? (
          <div className="rounded-2xl border border-[#d9ded2] bg-white overflow-hidden">
            <div className="bg-[#0a2016] px-5 py-3"><p className="text-xs font-bold uppercase tracking-[0.08em] text-white/60">Top Wicket Takers</p></div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f5f3ed] bg-[#f5f3ed]">
                  {['#', 'Player', 'M', 'Wkts', 'Avg', 'Econ', 'Best'].map((h) => (
                    <th key={h} className={cn('py-2.5 text-[10px] font-bold uppercase tracking-wide text-[#9aab9e]', h === 'Player' ? 'text-left px-5' : 'text-center px-3')}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bowlers.map((p) => (
                  <tr key={p.rank} className="border-b border-[#f5f3ed]">
                    <td className="px-3 py-3 text-center">{MEDAL[p.rank] ?? <span className="text-xs font-bold text-[#9aab9e]">{p.rank}</span>}</td>
                    <td className="px-5 py-3"><p className="font-semibold text-[#17352a]">{p.name}</p><p className="text-[10px] text-[#9aab9e]">{p.village}</p></td>
                    <td className="px-3 py-3 text-center text-[#5f6d64]">{p.matches}</td>
                    <td className="px-3 py-3 text-center font-extrabold text-[#17352a]">{p.wickets}</td>
                    <td className="px-3 py-3 text-center text-[#5f6d64]">{p.avg}</td>
                    <td className="px-3 py-3 text-center text-[#5f6d64]">{p.econ}</td>
                    <td className="px-3 py-3 text-center font-bold text-[#17352a]">{p.best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <EmptyState icon="⚾" text="Bowling rankings will appear after matches are scored" />
      )}
    </div>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 gap-3 rounded-2xl border border-dashed border-[#d9ded2] bg-white">
      <span className="text-4xl">{icon}</span>
      <p className="text-sm text-[#9aab9e]">{text}</p>
    </div>
  );
}
