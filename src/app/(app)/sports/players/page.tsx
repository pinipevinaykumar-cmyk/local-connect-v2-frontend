'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

type Player = {
  id: number;
  name: string;
  village: string;
  age: number;
  role: string;
  matches: number;
  runs: number;
  wickets: number;
  avg: number;
  sr: number;
};

const ROLE_COLORS: Record<string, string> = {
  'Batsman':     'bg-blue-100 text-blue-700',
  'Bowler':      'bg-red-100 text-red-700',
  'All Rounder': 'bg-amber-100 text-amber-700',
  'WK-Batsman':  'bg-purple-100 text-purple-700',
};

const players: Player[] = [];
const ROLES = ['All', 'Batsman', 'Bowler', 'All Rounder', 'WK-Batsman'];

export default function PlayersPage() {
  const router = useRouter();
  const [roleFilter, setRoleFilter] = useState('All');

  const filtered = roleFilter === 'All' ? players : players.filter((p) => p.role === roleFilter);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#17352a]">Players</h2>
          <p className="text-sm text-[#5f6d64]">Registered players — stats auto-generated from scored matches</p>
        </div>
        <button
          onClick={() => router.push('/sports/players/create')}
          className="inline-flex items-center gap-2 rounded-full bg-[#1E7B3B] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2d9b4e] transition-colors"
        >
          <Plus size={16} /> Register Player
        </button>
      </div>

      <div className="mb-4 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
        <span className="text-xl mt-0.5">📊</span>
        <p className="text-xs text-green-800">
          <span className="font-bold">Stats are automatic.</span> Runs, wickets, average and strike rate are calculated exclusively from live-scored matches. No manual entry allowed.
        </p>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {ROLES.map((r) => (
          <button key={r} onClick={() => setRoleFilter(r)}
            className={cn('shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors',
              roleFilter === r ? 'bg-[#1E7B3B] text-white' : 'border border-[#d9ded2] bg-white text-[#5f6d64] hover:border-[#1E7B3B]/40')}>
            {r}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <>
          <div className="hidden sm:block rounded-2xl border border-[#d9ded2] bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#d9ded2] bg-[#f5f3ed]">
                  {['#', 'Player', 'Role', 'M', 'Runs', 'Wkts', 'Avg', 'SR'].map((h) => (
                    <th key={h} className={cn('py-3 text-xs font-bold uppercase tracking-[0.08em] text-[#5f6d64]',
                      h === '#' || h === 'Player' || h === 'Role' ? 'text-left px-5' : 'text-center px-4')}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} className="border-b border-[#f5f3ed] hover:bg-[#fafaf9] cursor-pointer" onClick={() => router.push(`/sports/players/${p.id}`)}>
                    <td className="px-5 py-3.5 text-xs font-bold text-[#9aab9e]">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1E7B3B]/10 text-sm font-black text-[#1E7B3B]">{p.name[0]}</div>
                        <div>
                          <p className="font-semibold text-[#17352a]">{p.name}</p>
                          <p className="text-xs text-[#9aab9e]">{p.village} · Age {p.age}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', ROLE_COLORS[p.role] ?? '')}>{p.role}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center text-sm font-semibold text-[#17352a]">{p.matches}</td>
                    <td className="px-4 py-3.5 text-center text-sm font-bold text-[#17352a]">{p.runs}</td>
                    <td className="px-4 py-3.5 text-center text-sm font-bold text-[#17352a]">{p.wickets}</td>
                    <td className="px-4 py-3.5 text-center text-sm text-[#5f6d64]">{p.avg}</td>
                    <td className="px-4 py-3.5 text-center text-sm text-[#5f6d64]">{p.sr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:hidden">
            {filtered.map((p) => (
              <div key={p.id} onClick={() => router.push(`/sports/players/${p.id}`)} className="cursor-pointer rounded-2xl border border-[#d9ded2] bg-white p-4 text-center hover:shadow-md transition-all">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#1E7B3B]/10 text-lg font-black text-[#1E7B3B]">{p.name[0]}</div>
                <p className="text-sm font-bold text-[#17352a] leading-tight">{p.name}</p>
                <p className="text-[10px] text-[#9aab9e]">{p.village}</p>
                <span className={cn('mt-1.5 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold', ROLE_COLORS[p.role] ?? '')}>{p.role}</span>
                <div className="mt-2 grid grid-cols-2 gap-1">
                  <div><p className="text-sm font-extrabold text-[#17352a]">{p.runs}</p><p className="text-[9px] text-[#9aab9e]">Runs</p></div>
                  <div><p className="text-sm font-extrabold text-[#17352a]">{p.wickets}</p><p className="text-[9px] text-[#9aab9e]">Wkts</p></div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl border border-dashed border-[#d9ded2] bg-white">
          <span className="text-4xl">🏏</span>
          <p className="text-sm font-bold text-[#17352a]">No players registered yet</p>
          <p className="text-xs text-[#9aab9e]">Players will appear here after registration</p>
          <button onClick={() => router.push('/sports/players/create')}
            className="mt-1 rounded-full bg-[#1E7B3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#2d9b4e] transition-colors">
            Register Player
          </button>
        </div>
      )}
    </div>
  );
}
