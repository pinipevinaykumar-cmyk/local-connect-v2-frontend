'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { loadBmplRegistration } from '@/lib/bmplRegistration';

type Player = {
  id: number;
  name: string;
  village: string;
  role: string;
  status: string;
  basePrice: number;
  auctionStatus: string;
  photo?: string;
};

const STATUS_STYLES: Record<string, string> = {
  Verified: 'bg-green-100 text-green-700',
  Pending:  'bg-amber-100 text-amber-700',
  Rejected: 'bg-red-100 text-red-500',
};

const AUCTION_STYLES: Record<string, string> = {
  Available: 'bg-[#e3eee2] text-[#1E7B3B]',
  Pending:   'bg-[#f5f3ed] text-[#9aab9e]',
  Rejected:  'bg-red-50 text-red-400',
  Sold:      'bg-[#0a2016] text-white',
};

export default function AuctionPoolPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('All');
  const [players, setPlayers] = useState<Player[]>([]);
  const filters = ['All', 'Verified', 'Pending', 'Rejected'];

  useEffect(() => {
    const reg = loadBmplRegistration();
    if (reg) {
      setPlayers([{
        id: 1,
        name: reg.name,
        village: reg.village,
        role: reg.role,
        status: reg.status === 'Verified' ? 'Verified' : 'Pending',
        basePrice: 500,
        auctionStatus: reg.status === 'Verified' ? 'Available' : 'Pending',
        photo: reg.photoUrl,
      }]);
    }
  }, []);

  const shown    = filter === 'All' ? players : players.filter((p) => p.status === filter);
  const verified = players.filter((p) => p.status === 'Verified').length;
  const pending  = players.filter((p) => p.status === 'Pending').length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#17352a]">🎯 BMPL Auction Pool</h2>
          <p className="text-sm text-[#5f6d64]">Nov 15, 2027 · Biccavolu Ground · 9:00 AM</p>
        </div>
        <button
          onClick={() => router.push('/sports/bmpl/auction/live')}
          className="inline-flex items-center gap-2 rounded-full bg-[#0a2016] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#112b1e] transition-colors"
        >
          <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          Live Auction →
        </button>
      </div>

      {/* Stats */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        {[[String(players.length), 'Total Registered'], [String(verified), 'Verified'], [String(pending), 'Pending']].map(([val, label]) => (
          <div key={label} className="rounded-2xl border border-[#d9ded2] bg-white px-4 py-3 text-center">
            <p className="text-2xl font-extrabold text-[#17352a]">{val}</p>
            <p className="text-[10px] text-[#9aab9e] uppercase tracking-[0.06em]">{label}</p>
          </div>
        ))}
      </div>

      {/* Auction info banner */}
      <div className="mb-5 rounded-2xl bg-[#0a2016] px-5 py-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#F59E0B]">Auction Day</p>
          <p className="text-white font-bold mt-0.5">Nov 15, 2027 · 9:00 AM</p>
          <p className="text-white/50 text-xs mt-0.5">Only verified players will be auctioned</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] text-white/40 uppercase tracking-[0.06em]">Team Budget</p>
          <p className="text-xl font-black text-[#F59E0B]">₹10,000</p>
          <p className="text-[10px] text-white/40">per team</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn('shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors',
              filter === f ? 'bg-[#1E7B3B] text-white' : 'border border-[#d9ded2] bg-white text-[#5f6d64] hover:border-[#1E7B3B]/40')}>
            {f}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl border border-dashed border-[#d9ded2] bg-white">
          <span className="text-4xl">🎯</span>
          <p className="text-sm font-bold text-[#17352a]">No players in auction pool yet</p>
          <p className="text-xs text-[#9aab9e]">Players will appear here after registration and verification</p>
          <button onClick={() => router.push('/sports/bmpl/register')}
            className="mt-1 rounded-full bg-[#1E7B3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#2d9b4e] transition-colors">
            Register as Player
          </button>
        </div>
      ) : (
        <>
          {/* Player table - desktop */}
          <div className="hidden sm:block rounded-2xl border border-[#d9ded2] bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f5f3ed] border-b border-[#d9ded2]">
                  {['#', 'Player', 'Village', 'Role', 'Status', 'Base Price', 'Auction'].map((h) => (
                    <th key={h} className={cn('py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#9aab9e]', h === 'Player' ? 'text-left px-5' : 'text-center px-3')}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((p, i) => (
                  <tr key={p.id} className="border-b border-[#f5f3ed] hover:bg-[#fafaf9]">
                    <td className="px-3 py-3.5 text-center text-xs font-bold text-[#9aab9e]">{i + 1}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1E7B3B]/10 overflow-hidden text-sm font-black text-[#1E7B3B]">
                          {p.photo
                            ? <img src={p.photo} alt={p.name} className="h-full w-full object-cover" />
                            : p.name[0]}
                        </div>
                        <span className="font-semibold text-[#17352a]">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-center text-sm text-[#5f6d64]">{p.village}</td>
                    <td className="px-3 py-3.5 text-center text-xs font-semibold text-[#5f6d64]">{p.role}</td>
                    <td className="px-3 py-3.5 text-center">
                      <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', STATUS_STYLES[p.status])}>{p.status}</span>
                    </td>
                    <td className="px-3 py-3.5 text-center font-bold text-[#17352a]">₹{p.basePrice}</td>
                    <td className="px-3 py-3.5 text-center">
                      <span className={cn('rounded-full px-2.5 py-1 text-[10px] font-bold', AUCTION_STYLES[p.auctionStatus])}>{p.auctionStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Player cards - mobile */}
          <div className="sm:hidden space-y-3">
            {shown.map((p) => (
              <div key={p.id} className="rounded-2xl border border-[#d9ded2] bg-white p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1E7B3B]/10 overflow-hidden font-black text-[#1E7B3B]">
                    {p.photo
                      ? <img src={p.photo} alt={p.name} className="h-full w-full object-cover" />
                      : p.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#17352a] truncate">{p.name}</p>
                    <p className="text-xs text-[#9aab9e]">{p.village} · {p.role}</p>
                  </div>
                  <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold', STATUS_STYLES[p.status])}>{p.status}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#5f6d64]">Base Price: <strong className="text-[#17352a]">₹{p.basePrice}</strong></span>
                  <span className={cn('rounded-full px-2 py-0.5 font-bold', AUCTION_STYLES[p.auctionStatus])}>{p.auctionStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
