'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, MapPin } from 'lucide-react';
import { loadPhases, type PhaseConfig } from '@/lib/phaseConfig';
import { loadBmplRegistration, type BmplRegistration } from '@/lib/bmplRegistration';

const BMPL_VILLAGES = [
  'Arikarevula', 'Balabhadrapuram', 'Biccavolu', 'Illapalle',
  'Kapavaram', 'Komaripalem', 'Konkuduru', 'Melluru',
  'Pandalapaka', 'Rallakhandrika', 'Rangapuram', 'Thummalapalle',
  'Tossipudi', 'Voolapalle',
];

const PHASE_DATES: Record<number, string> = {
  1: 'Oct 1 – Nov 1, 2027',
  2: 'Nov 1 – Nov 10, 2027',
  3: 'Nov 11 – Nov 12, 2027',
  4: 'Nov 12 – Nov 14, 2027',
  5: 'Nov 14, 2027',
  6: 'Nov 15, 2027',
  7: 'Nov 20, 2027',
};

export default function BMPLPage() {
  const router = useRouter();
  const [phases, setPhases] = useState<PhaseConfig[]>([]);
  const [myReg, setMyReg] = useState<BmplRegistration | null>(null);

  useEffect(() => {
    setPhases(loadPhases());
    setMyReg(loadBmplRegistration());
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6 space-y-8">

      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0a2016] text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #F59E0B 0, #F59E0B 1px, transparent 0, transparent 50%)', backgroundSize: '12px 12px' }} />
        <div className="relative px-6 py-8 lg:px-10 lg:py-12">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="rounded-full bg-[#F59E0B] px-3 py-1 text-[10px] font-extrabold text-[#17352a] uppercase tracking-[0.1em]">Season 1 · 2027</span>
                <span className="rounded-full bg-green-500/20 border border-green-500/30 px-3 py-1 text-[10px] font-bold text-green-400">Registration Open</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight lg:text-3xl">
                Biccavolu Mandal<br />
                <span className="text-[#F59E0B]">Premier League</span>
              </h1>
              <div className="mt-2 flex items-center gap-1.5 text-sm text-white/60">
                <MapPin size={13} /> Biccavolu Mandal · East Godavari
              </div>
              <p className="mt-3 text-white/70 text-sm max-w-sm">
                The official cricket tournament for Biccavolu Mandal. 14 villages. 10 teams. One champion.
              </p>
            </div>

            <div className="flex gap-3 lg:flex-col lg:text-right shrink-0">
              <div className="text-center lg:text-right">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/40 mb-1">Registration Closes In</p>
                <div className="flex items-center gap-1.5 lg:justify-end">
                  {[['32', 'Days'], ['06', 'Hrs'], ['30', 'Min']].map(([val, unit]) => (
                    <div key={unit} className="text-center">
                      <div className="bg-white/10 rounded-lg px-2.5 py-1.5 min-w-[2.5rem]">
                        <p className="text-xl font-black text-[#F59E0B] tabular-nums">{val}</p>
                      </div>
                      <p className="text-[8px] text-white/40 mt-0.5 uppercase">{unit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              ['14', 'Villages'],
              [String(myReg ? 1 : 0), 'Players'],
              ['10', 'Teams'],
            ].map(([val, label]) => (
              <div key={label} className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-center">
                <p className="text-2xl font-black text-[#F59E0B]">{val}</p>
                <p className="text-[10px] text-white/50 uppercase tracking-[0.08em]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Player Registration CTA — full width, prominent */}
      <div
        onClick={() => router.push('/sports/bmpl/register')}
        className="cursor-pointer rounded-2xl border-2 border-[#1E7B3B]/30 bg-white p-6 hover:border-[#1E7B3B] hover:shadow-lg transition-all group"
      >
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#1E7B3B]/10 text-4xl group-hover:bg-[#1E7B3B]/15 transition-colors">🏏</div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <p className="text-lg font-extrabold text-[#17352a]">Register as Player</p>
              <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold text-green-700">Phase 1 — Open Now</span>
            </div>
            <p className="text-sm text-[#5f6d64]">Get verified and become eligible to vote, nominate, and compete in BMPL 2027.</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
              <span className="font-bold text-[#1E7B3B]">Registration Fee: ₹10</span>
              <span className="text-[#9aab9e]">·</span>
              <span className="text-[#9aab9e]">Aadhaar required</span>
              <span className="text-[#9aab9e]">·</span>
              <span className="text-[#9aab9e]">Closes Nov 1, 2027</span>
            </div>
          </div>
          <button onClick={() => router.push('/sports/bmpl/register')}
            className="shrink-0 rounded-xl bg-[#1E7B3B] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2d9b4e] transition-colors">
            {myReg ? 'View My Status →' : 'Register Now →'}
          </button>
        </div>
      </div>

      {/* My Registration Status — shown only if registered */}
      {myReg && (() => {
        const statusMap = {
          Pending:  { bg: 'bg-amber-50 border-amber-200',  badge: 'bg-amber-100 text-amber-700',  icon: '⏳', label: 'Pending Verification' },
          Verified: { bg: 'bg-[#1E7B3B]/5 border-[#1E7B3B]/20', badge: 'bg-[#1E7B3B]/10 text-[#1E7B3B]', icon: '✅', label: 'Verified' },
          Rejected: { bg: 'bg-red-50 border-red-200',      badge: 'bg-red-100 text-red-600',      icon: '❌', label: 'Rejected' },
        };
        const s = statusMap[myReg.status];
        return (
          <div className={`rounded-2xl border-2 p-5 ${s.bg}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#9aab9e]">My Registration · {myReg.registrationId}</p>
                  <p className="font-extrabold text-[#17352a]">{myReg.name} · {myReg.village}</p>
                  <p className="text-xs text-[#5f6d64]">{myReg.role} · Age {myReg.age}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${s.badge}`}>{s.label}</span>
                <button onClick={() => router.push('/sports/bmpl/register')}
                  className="rounded-xl border border-[#d9ded2] bg-white px-4 py-2 text-xs font-semibold text-[#17352a] hover:bg-[#f5f3ed] transition-colors">
                  View Details →
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 7-Phase BMPL Process */}
      <div className="rounded-2xl border border-[#d9ded2] bg-white p-6">
        <div className="mb-6">
          <h2 className="text-base font-extrabold text-[#17352a]">🏆 Captaincy Selection Process</h2>
          <p className="text-sm text-[#5f6d64] mt-0.5">Captains are elected democratically by verified BMPL players — not appointed.</p>
        </div>
        <div className="relative">
          <div className="absolute left-[18px] top-5 bottom-5 w-0.5 bg-[#d9ded2]" />
          <div className="space-y-0">
            {phases.map((p) => (
              <div key={p.n} className={cn(
                'relative flex gap-4 pb-6 last:pb-0',
              )}>
                {/* Step circle */}
                <div className={cn(
                  'relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base border-2 mt-0.5',
                  p.status === 'active'
                    ? 'border-[#1E7B3B] bg-[#1E7B3B]/10'
                    : p.status === 'completed'
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-[#d9ded2] bg-white',
                )}>
                  {p.status === 'pending' ? <Lock size={13} className="text-[#d9ded2]" /> : p.icon}
                </div>

                {/* Content */}
                <div className={cn(
                  'flex-1 rounded-2xl border px-4 py-3',
                  p.status === 'active'
                    ? 'border-[#1E7B3B]/20 bg-[#1E7B3B]/5'
                    : p.status === 'completed'
                    ? 'border-blue-200 bg-blue-50/50'
                    : 'border-[#f5f3ed] bg-[#fafaf9] opacity-60',
                )}>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={cn(
                      'text-[10px] font-extrabold uppercase tracking-[0.08em]',
                      p.status === 'active' ? 'text-[#1E7B3B]' : p.status === 'completed' ? 'text-blue-600' : 'text-[#9aab9e]',
                    )}>
                      Phase {p.n}
                    </span>
                    {p.status === 'active' && (
                      <span className="rounded-full bg-[#1E7B3B] px-2 py-0.5 text-[9px] font-bold text-white">Active</span>
                    )}
                    {p.status === 'completed' && (
                      <span className="rounded-full bg-blue-500 px-2 py-0.5 text-[9px] font-bold text-white">Completed</span>
                    )}
                  </div>
                  <p className={cn('text-sm font-bold', p.status === 'pending' ? 'text-[#9aab9e]' : 'text-[#17352a]')}>
                    {p.icon} {p.label}
                  </p>
                  <p className="text-xs text-[#9aab9e] mt-0.5">{PHASE_DATES[p.n]}</p>
                  <p className={cn('text-xs mt-1.5 leading-relaxed', p.status === 'pending' ? 'text-[#bcc5be]' : 'text-[#5f6d64]')}>
                    {p.desc}
                  </p>
                  {p.n === 3 && (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#9aab9e]">
                      <Lock size={10} /> Unlocks after Phase 2 completes
                    </div>
                  )}
                  {p.n === 4 && (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#9aab9e]">
                      <Lock size={10} /> Only verified BMPL players can vote
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Participating Villages */}
      <div>
        <h2 className="text-base font-extrabold text-[#17352a] mb-3">📍 14 Participating Villages</h2>
        <div className="flex flex-wrap gap-2">
          {BMPL_VILLAGES.map((v) => (
            <span key={v} className="flex items-center gap-1.5 rounded-full border border-[#d9ded2] bg-white px-3 py-1.5 text-xs font-semibold text-[#5f6d64]">
              <MapPin size={10} className="text-[#1E7B3B]" /> {v}
            </span>
          ))}
        </div>
      </div>

      {/* Auction quick link — locked */}
      <div className="rounded-2xl bg-[#0a2016] text-white p-6 flex items-center justify-between gap-4 opacity-60 cursor-not-allowed">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#F59E0B]">Player Auction · Phase 6</p>
          <p className="text-lg font-extrabold mt-0.5">Auction Pool</p>
          <p className="text-xs text-white/50 mt-1">Nov 15, 2027 · Biccavolu Ground · 9:00 AM</p>
        </div>
        <div className="text-right shrink-0">
          <Lock size={20} className="ml-auto text-white/40" />
          <p className="text-xs text-white/40 mt-1">Unlocks after<br />captain voting</p>
        </div>
      </div>

      {/* Commerce via Local Connect */}
      <div className="rounded-2xl border border-[#1E7B3B]/20 bg-[#1E7B3B]/5 p-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-[#1E7B3B] mb-3">During Tournament</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { emoji: '🥬', label: 'Groceries',   href: '/discover?category=Groceries', desc: 'Ground-area grocery stalls' },
            { emoji: '🍗', label: 'Food & Meat',  href: '/discover?category=Food',      desc: 'Food court, tea stalls, snacks' },
            { emoji: '🛠', label: 'Services',     href: '/services',                    desc: 'Photography, equipment hire' },
            { emoji: '🏪', label: 'Businesses',   href: '/discover?view=businesses',    desc: 'Tournament sponsors & brands' },
          ].map(({ emoji, label, href, desc }) => (
            <a key={label} href={href}
              className="flex items-center gap-3 rounded-xl border border-[#d9ded2] bg-white px-4 py-3 hover:border-[#1E7B3B]/40 hover:bg-[#1E7B3B]/5 transition-colors">
              <span className="text-2xl shrink-0">{emoji}</span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#17352a]">{label}</p>
                <p className="text-[10px] text-[#9aab9e] leading-snug mt-0.5">{desc}</p>
              </div>
            </a>
          ))}
        </div>
        <p className="text-[11px] text-[#9aab9e] mt-4 text-center">
          Food vendors, photographers and sponsors are listed on the main Local Connect platform — not inside Sports.
        </p>
      </div>

    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
