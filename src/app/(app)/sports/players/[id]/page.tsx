'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Calendar, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── Types ──────────────────────────────────────────────────── */

type Player = {
  id: number;
  name: string;
  village: string;
  role: string;
  age: number;
  status: 'Verified' | 'Pending';
  auctionStatus: 'Available' | 'Pending';
  featured: boolean;
  registeredAt: string;
  mobile: string;
  achievements: string[];
  stats: { matches: number; runs: number; wickets: number; catches: number };
};

const ROLE_COLOR: Record<string, string> = {
  'Batsman':       'bg-blue-100 text-blue-700',
  'Bowler':        'bg-red-100 text-red-700',
  'All Rounder':   'bg-amber-100 text-amber-700',
  'Wicket Keeper': 'bg-purple-100 text-purple-700',
};

export default function PlayerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const player: Player | null = null;

  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="text-6xl">🏏</span>
        <p className="text-lg font-bold text-[#17352a]">Player not found</p>
        <p className="text-sm text-[#9aab9e]">Player #{id} has not registered yet</p>
        <div className="flex gap-3">
          <button onClick={() => router.back()} className="rounded-full border border-[#d9ded2] px-4 py-2 text-sm text-[#5f6d64] hover:bg-[#f5f3ed]">
            Go Back
          </button>
          <button onClick={() => router.push('/sports/bmpl/register')} className="rounded-full bg-[#1E7B3B] px-4 py-2 text-sm font-bold text-white hover:bg-[#2d9b4e]">
            Register Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#f5f3ed]">
      <div className="relative bg-[#0a2016] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #F59E0B 0, #F59E0B 1px, transparent 0, transparent 50%)', backgroundSize: '14px 14px' }} />
        <div className="relative mx-auto max-w-3xl px-4 pt-5 pb-8 lg:px-6">
          <button onClick={() => router.back()} className="mb-6 inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors">
            <ArrowLeft size={13} /> Back
          </button>

          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#F59E0B]/20 text-4xl font-black text-[#F59E0B] border border-[#F59E0B]/20">
              {player.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {player.featured && <span className="rounded-full bg-[#F59E0B] px-2 py-0.5 text-[9px] font-extrabold text-[#17352a] uppercase tracking-[0.08em]">⭐ Featured</span>}
                <span className={cn('rounded-full px-2 py-0.5 text-[9px] font-bold', player.status === 'Verified' ? 'bg-green-500 text-white' : 'bg-amber-400 text-[#17352a]')}>
                  {player.status === 'Verified' ? '✅ Verified' : '⏳ Pending Verification'}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold">{player.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-white/50">
                <span className="flex items-center gap-1"><MapPin size={11} />{player.village}</span>
                <span className="flex items-center gap-1"><Calendar size={11} />Age {player.age}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-6 lg:px-6 space-y-5">

        <div className="rounded-2xl border border-[#d9ded2] bg-white p-5">
          <h2 className="text-sm font-extrabold text-[#17352a] uppercase tracking-[0.08em] mb-4">Player Details</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <InfoRow label="Role">
              <span className={cn('rounded-full px-2.5 py-1 text-[10px] font-bold', ROLE_COLOR[player.role] ?? '')}>{player.role}</span>
            </InfoRow>
            <InfoRow label="Village">{player.village}</InfoRow>
            <InfoRow label="Age">{player.age} years</InfoRow>
            <InfoRow label="Registered">{new Date(player.registeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</InfoRow>
            <InfoRow label="Contact">{player.mobile}</InfoRow>
            <InfoRow label="Tournament">BMPL 2024</InfoRow>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={cn('rounded-2xl border p-4 text-center', player.status === 'Verified' ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50')}>
            <Shield size={22} className={player.status === 'Verified' ? 'text-green-600 mx-auto mb-2' : 'text-amber-600 mx-auto mb-2'} />
            <p className="text-xs font-extrabold text-[#17352a]">Verification</p>
            <p className={cn('text-sm font-bold mt-0.5', player.status === 'Verified' ? 'text-green-700' : 'text-amber-700')}>
              {player.status === 'Verified' ? '✅ Verified' : '⏳ Pending'}
            </p>
          </div>
          <div className={cn('rounded-2xl border p-4 text-center', player.auctionStatus === 'Available' ? 'border-blue-200 bg-blue-50' : 'border-[#d9ded2] bg-[#f5f3ed]')}>
            <span className="text-2xl block mb-2">🎯</span>
            <p className="text-xs font-extrabold text-[#17352a]">Auction Status</p>
            <p className={cn('text-sm font-bold mt-0.5', player.auctionStatus === 'Available' ? 'text-blue-700' : 'text-[#9aab9e]')}>
              {player.auctionStatus === 'Available' ? 'Auction Ready' : 'Pending'}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#d9ded2] bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-extrabold text-[#17352a] uppercase tracking-[0.08em]">📊 Career Stats</h2>
            <span className="rounded-full bg-[#1E7B3B]/10 px-2.5 py-1 text-[9px] font-bold text-[#1E7B3B]">Auto-generated from matches</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Matches', val: player.stats.matches },
              { label: 'Runs',    val: player.stats.runs    },
              { label: 'Wickets', val: player.stats.wickets },
              { label: 'Catches', val: player.stats.catches },
            ].map(({ label, val }) => (
              <div key={label} className="rounded-xl bg-[#f5f3ed] p-3 text-center">
                <p className="text-2xl font-black text-[#17352a]">{val}</p>
                <p className="text-[9px] uppercase tracking-[0.06em] text-[#9aab9e] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-[#9aab9e] text-center">Stats update automatically after each scored match.</p>
        </div>

        {player.achievements.length > 0 && (
          <div className="rounded-2xl border border-[#d9ded2] bg-white p-5">
            <h2 className="text-sm font-extrabold text-[#17352a] uppercase tracking-[0.08em] mb-4">🏆 Achievements</h2>
            <div className="flex flex-wrap gap-2">
              {player.achievements.map((a) => (
                <span key={a} className="rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/20 px-3 py-1.5 text-xs font-bold text-[#92400e]">
                  🏅 {a}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pb-6">
          <button onClick={() => router.push('/sports/bmpl/auction')}
            className="flex-1 rounded-xl bg-[#1E7B3B] py-3 text-sm font-bold text-white hover:bg-[#2d9b4e] transition-colors">
            View Auction Pool
          </button>
          <button onClick={() => router.push('/sports/bmpl')}
            className="flex-1 rounded-xl border border-[#d9ded2] py-3 text-sm font-bold text-[#17352a] hover:bg-[#f5f3ed] transition-colors">
            BMPL Hub
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.08em] text-[#9aab9e] mb-0.5">{label}</p>
      <div className="text-sm font-semibold text-[#17352a]">{children}</div>
    </div>
  );
}
