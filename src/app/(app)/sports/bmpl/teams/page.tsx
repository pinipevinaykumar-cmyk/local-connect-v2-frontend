'use client';

import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

const PHASES = [
  {
    n: 1, icon: '📝', label: 'Player Registration',
    date: 'Oct 1 – Nov 1, 2027',
    status: 'active',
    desc: 'Players are registering. Get verified to participate in captain voting.',
  },
  {
    n: 2, icon: '✅', label: 'Player Verification',
    date: 'Nov 1 – Nov 10, 2027',
    status: 'upcoming',
    desc: 'Admin verifies Aadhaar and village eligibility. Only verified players proceed.',
    statuses: [
      { icon: '✅', label: 'Verified', color: 'text-green-700 bg-green-100' },
      { icon: '⏳', label: 'Pending', color: 'text-amber-700 bg-amber-100' },
      { icon: '❌', label: 'Rejected', color: 'text-red-700 bg-red-100' },
    ],
  },
  {
    n: 3, icon: '🏆', label: 'Captain Nominations',
    date: 'Nov 11 – Nov 12, 2027',
    status: 'upcoming',
    desc: 'Nominations open to all verified players. Any eligible player can put their name forward for captaincy.',
    cta: 'Nominate For Captaincy',
  },
  {
    n: 4, icon: '🗳️', label: 'Player Voting',
    date: 'Nov 12 – Nov 14, 2027',
    status: 'upcoming',
    desc: 'All verified BMPL players cast one vote for their preferred captain. Candidate profiles are displayed with photo, name, village, and role.',
    rules: ['One player = One vote', 'Cannot vote multiple times', 'All verified players eligible'],
  },
  {
    n: 5, icon: '👑', label: 'Top 10 Captains Announced',
    date: 'Nov 14, 2027',
    status: 'upcoming',
    desc: 'The 10 candidates with the highest votes become team captains. Full vote counts published transparently.',
  },
  {
    n: 6, icon: '🎯', label: 'Team Formation & Auction',
    date: 'Nov 15, 2027',
    status: 'upcoming',
    desc: 'Each captain receives their team badge and auction budget. Captains bid on verified players to build squads.',
  },
];

export default function BMPLTeamsPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-6 space-y-6">

      {/* Header */}
      <div className="rounded-3xl bg-[#0a2016] text-white overflow-hidden">
        <div className="relative px-6 py-8 lg:px-8">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #F59E0B 0, #F59E0B 1px, transparent 0, transparent 50%)', backgroundSize: '12px 12px' }} />
          <div className="relative">
            <span className="rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/30 px-3 py-1 text-[10px] font-extrabold text-[#F59E0B] uppercase tracking-[0.1em]">BMPL 2027 · Captaincy</span>
            <h1 className="mt-3 text-2xl font-black">Democratic Captain<br /><span className="text-[#F59E0B]">Selection Process</span></h1>
            <p className="mt-2 text-sm text-white/60 max-w-md">
              Captains are not appointed — they are elected. Every verified BMPL player gets one vote. The top 10 vote-getters lead the 10 teams.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-center">
                <p className="text-xl font-black text-[#F59E0B]">0</p>
                <p className="text-[9px] text-white/40 uppercase tracking-[0.08em]">Nominees</p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-center">
                <p className="text-xl font-black text-[#F59E0B]">0</p>
                <p className="text-[9px] text-white/40 uppercase tracking-[0.08em]">Votes Cast</p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-center">
                <p className="text-xl font-black text-[#F59E0B]">10</p>
                <p className="text-[9px] text-white/40 uppercase tracking-[0.08em]">Captains Needed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase timeline */}
      <div className="rounded-2xl border border-[#d9ded2] bg-white p-6">
        <h2 className="text-sm font-extrabold text-[#17352a] mb-5 uppercase tracking-[0.06em]">Selection Phases</h2>
        <div className="space-y-4">
          {PHASES.map((p) => (
            <div key={p.n} className={cn(
              'rounded-2xl border-2 p-5 transition-all',
              p.status === 'active'
                ? 'border-[#1E7B3B]/30 bg-[#1E7B3B]/5'
                : 'border-[#f5f3ed] bg-[#fafaf9]',
            )}>
              <div className="flex items-start gap-4">
                <div className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl border-2',
                  p.status === 'active'
                    ? 'border-[#1E7B3B]/30 bg-[#1E7B3B]/10'
                    : 'border-[#d9ded2] bg-white opacity-40',
                )}>
                  {p.status === 'active' ? p.icon : <Lock size={16} className="text-[#d9ded2]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={cn('text-[10px] font-extrabold uppercase tracking-[0.08em]',
                      p.status === 'active' ? 'text-[#1E7B3B]' : 'text-[#9aab9e]')}>
                      Phase {p.n}
                    </span>
                    {p.status === 'active' && (
                      <span className="rounded-full bg-[#1E7B3B] px-2 py-0.5 text-[9px] font-bold text-white">Active Now</span>
                    )}
                    {p.status === 'upcoming' && (
                      <span className="rounded-full bg-[#f5f3ed] px-2 py-0.5 text-[9px] font-semibold text-[#9aab9e]">🔒 Locked</span>
                    )}
                  </div>
                  <p className={cn('font-bold', p.status === 'active' ? 'text-[#17352a]' : 'text-[#9aab9e]')}>
                    {p.icon} {p.label}
                  </p>
                  <p className={cn('text-xs mt-0.5', p.status === 'active' ? 'text-[#9aab9e]' : 'text-[#bcc5be]')}>{p.date}</p>
                  <p className={cn('text-xs mt-2 leading-relaxed', p.status === 'active' ? 'text-[#5f6d64]' : 'text-[#bcc5be]')}>{p.desc}</p>

                  {/* Verification statuses */}
                  {p.statuses && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.statuses.map((s) => (
                        <span key={s.label} className={cn('rounded-full px-2.5 py-1 text-[10px] font-bold opacity-50', s.color)}>
                          {s.icon} {s.label}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Voting rules */}
                  {p.rules && (
                    <div className="mt-3 space-y-1">
                      {p.rules.map((r) => (
                        <p key={r} className="text-[10px] text-[#bcc5be] flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-[#d9ded2] shrink-0" /> {r}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Nomination CTA — locked */}
                  {p.cta && (
                    <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#d9ded2] bg-white px-4 py-3 opacity-50 cursor-not-allowed">
                      <Lock size={14} className="text-[#9aab9e] shrink-0" />
                      <span className="text-sm font-bold text-[#9aab9e]">{p.cta}</span>
                      <span className="ml-auto text-[10px] text-[#9aab9e]">Opens Nov 11</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current action — register as player */}
      <div className="rounded-2xl bg-[#1E7B3B] text-white p-6 flex flex-col sm:flex-row items-center gap-5">
        <div className="text-4xl">🏏</div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-green-200 mb-1">Action Required · Phase 1</p>
          <p className="text-lg font-extrabold">Register as a Player First</p>
          <p className="text-sm text-white/70 mt-0.5">
            You must be a registered and verified player to nominate yourself or vote for a captain.
          </p>
        </div>
        <button
          onClick={() => router.push('/sports/bmpl/register')}
          className="shrink-0 rounded-xl bg-[#F59E0B] px-6 py-2.5 text-sm font-bold text-[#17352a] hover:bg-[#fbbf24] transition-colors"
        >
          Register as Player →
        </button>
      </div>

    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
