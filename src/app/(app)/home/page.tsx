'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, MapPin, Search, X } from 'lucide-react';
import { getUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import type { User } from '@/types';
import { loadBmplRegistration } from '@/lib/bmplRegistration';

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
  photo?: string;
};

type Village = {
  name: string;
  registered: number;
  verified: number;
  auctionEligible: number;
};

type Announcement = {
  label: string;
  date: string;
  status: 'active' | 'upcoming' | 'done';
  icon: string;
};

/* ── Tournament config (real data, not dummy) ───────────────── */

const BMPL_VILLAGES: Village[] = [
  { name: 'Arikarevula',    registered: 0, verified: 0, auctionEligible: 0 },
  { name: 'Balabhadrapuram',registered: 0, verified: 0, auctionEligible: 0 },
  { name: 'Biccavolu',      registered: 0, verified: 0, auctionEligible: 0 },
  { name: 'Illapalle',      registered: 0, verified: 0, auctionEligible: 0 },
  { name: 'Kapavaram',      registered: 0, verified: 0, auctionEligible: 0 },
  { name: 'Komaripalem',    registered: 0, verified: 0, auctionEligible: 0 },
  { name: 'Konkuduru',      registered: 0, verified: 0, auctionEligible: 0 },
  { name: 'Melluru',        registered: 0, verified: 0, auctionEligible: 0 },
  { name: 'Pandalapaka',    registered: 0, verified: 0, auctionEligible: 0 },
  { name: 'Rallakhandrika', registered: 0, verified: 0, auctionEligible: 0 },
  { name: 'Rangapuram',     registered: 0, verified: 0, auctionEligible: 0 },
  { name: 'Thummalapalle',  registered: 0, verified: 0, auctionEligible: 0 },
  { name: 'Tossipudi',      registered: 0, verified: 0, auctionEligible: 0 },
  { name: 'Voolapalle',     registered: 0, verified: 0, auctionEligible: 0 },
];

const ANNOUNCEMENTS: Announcement[] = [
  { label: 'Registration Open',      date: 'Oct 1 – Nov 1, 2027',  status: 'active',   icon: '📝' },
  { label: 'Verification Deadline',  date: 'Nov 10, 2027',          status: 'upcoming', icon: '✅' },
  { label: 'Player Auction',         date: 'Nov 15, 2027 · 9 AM',   status: 'upcoming', icon: '🎯' },
  { label: 'Fixtures Released',      date: 'Nov 18, 2027',          status: 'upcoming', icon: '📅' },
  { label: 'Tournament Begins',      date: 'Nov 20, 2027',          status: 'upcoming', icon: '🏏' },
  { label: 'Grand Final',            date: 'Dec 28, 2027',          status: 'upcoming', icon: '🏆' },
];

const ROLE_COLOR: Record<string, string> = {
  'Batsman':       'bg-blue-100 text-blue-700',
  'Bowler':        'bg-red-100 text-red-700',
  'All Rounder':   'bg-amber-100 text-amber-700',
  'Wicket Keeper': 'bg-purple-100 text-purple-700',
};

/* ── Helpers ────────────────────────────────────────────────── */

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  if (h < 21) return 'Good Evening';
  return 'Good Night';
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/* ── Sub-components ─────────────────────────────────────────── */

function PlayerCardLg({ p, onClick }: { p: Player; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="shrink-0 w-48 lg:w-auto cursor-pointer rounded-2xl border border-[#d9ded2] bg-white overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all group"
    >
      {/* Photo area */}
      <div className="relative h-40 bg-gradient-to-br from-[#0a2016] to-[#1a4030] overflow-hidden">
        {p.photo ? (
          <img src={p.photo} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 border-2 border-white/20">
              <span className="text-3xl font-black text-white/80">{p.name[0]}</span>
            </div>
          </div>
        )}
        {/* Gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Village badge */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-sm px-2 py-0.5">
          <MapPin size={8} className="text-[#F59E0B]" />
          <span className="text-[9px] font-semibold text-white">{p.village}</span>
        </div>
        {/* Verification badge */}
        <span className={cn('absolute top-2 right-2 rounded-full px-2 py-0.5 text-[9px] font-bold',
          p.status === 'Verified' ? 'bg-green-500 text-white' : 'bg-amber-400 text-[#17352a]')}>
          {p.status === 'Verified' ? '✅ Verified' : '⏳ Pending'}
        </span>
        {p.featured && (
          <span className="absolute top-2 left-2 rounded-full bg-[#F59E0B] px-2 py-0.5 text-[9px] font-extrabold text-[#17352a]">⭐</span>
        )}
      </div>
      <div className="p-3">
        <p className="font-bold text-[#17352a] truncate">{p.name}</p>
        <p className="text-[10px] text-[#9aab9e] mt-0.5">Age {p.age}</p>
        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
          <span className={cn('rounded-full px-2 py-0.5 text-[9px] font-bold', ROLE_COLOR[p.role] ?? '')}>{p.role}</span>
          {p.status === 'Verified' && (
            <span className="rounded-full bg-[#1E7B3B]/10 px-2 py-0.5 text-[9px] font-bold text-[#1E7B3B]">🎯 Auction</span>
          )}
        </div>
        <button className="mt-2.5 w-full rounded-xl bg-[#1E7B3B] py-1.5 text-[10px] font-bold text-white hover:bg-[#2d9b4e] transition-colors">
          View Profile
        </button>
      </div>
    </div>
  );
}

function PlayerCardSm({ p, onClick }: { p: Player; onClick: () => void }) {
  return (
    <div onClick={onClick} className="flex items-center gap-3 rounded-2xl border border-[#d9ded2] bg-white p-3.5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
      {/* Circular photo */}
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#0a2016] overflow-hidden border-2 border-[#d9ded2] group-hover:border-[#1E7B3B]/40 transition-colors">
        {p.photo
          ? <img src={p.photo} alt={p.name} className="h-full w-full object-cover" />
          : <span className="text-lg font-black text-white/80">{p.name[0]}</span>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-bold text-[#17352a] text-sm truncate">{p.name}</p>
          {p.status === 'Verified' && <span className="text-green-500 text-[10px] shrink-0">✅</span>}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin size={9} className="text-[#9aab9e] shrink-0" />
          <p className="text-xs text-[#9aab9e] truncate">{p.village}</p>
        </div>
        <span className={cn('mt-1 inline-block rounded-full px-2 py-0.5 text-[9px] font-bold', ROLE_COLOR[p.role] ?? '')}>{p.role}</span>
      </div>
      <div className="shrink-0 text-right">
        <span className={cn('block rounded-full px-2 py-0.5 text-[9px] font-bold mb-1',
          p.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')}>
          {p.status}
        </span>
        <p className="text-[9px] text-[#9aab9e]">{fmtDate(p.registeredAt)}</p>
      </div>
    </div>
  );
}

function EmptyState({ icon, text, cta, onCta }: { icon: string; text: string; cta?: string; onCta?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3 rounded-2xl border border-dashed border-[#d9ded2] bg-white">
      <span className="text-3xl">{icon}</span>
      <p className="text-sm text-[#9aab9e]">{text}</p>
      {cta && onCta && (
        <button onClick={onCta} className="rounded-full bg-[#1E7B3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#2d9b4e] transition-colors">
          {cta}
        </button>
      )}
    </div>
  );
}

/* ── Village modal ──────────────────────────────────────────── */

function VillageModal({ village, players, onClose }: { village: string; players: Player[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-3xl bg-white max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#d9ded2]">
          <div>
            <p className="font-extrabold text-[#17352a]">🏏 {village}</p>
            <p className="text-xs text-[#9aab9e]">{players.length} players registered</p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f3ed] hover:bg-[#d9ded2] transition-colors">
            <X size={15} />
          </button>
        </div>
        <div className="overflow-y-auto p-4 space-y-2">
          {players.length ? players.map((p) => (
            <PlayerCardSm key={p.id} p={p} onClick={() => {}} />
          )) : (
            <p className="text-center py-8 text-sm text-[#9aab9e]">No players registered from {village} yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────────── */

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [villageModal, setVillageModal] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [villages, setVillages] = useState<Village[]>(BMPL_VILLAGES);

  useEffect(() => {
    setUser(getUser());
    // Merge localStorage registration into player list until backend is live
    const reg = loadBmplRegistration();
    if (reg) {
      const p: Player = {
        id: 1,
        name: reg.name,
        village: reg.village,
        role: reg.role,
        age: parseInt(reg.age, 10) || 0,
        status: reg.status === 'Verified' ? 'Verified' : 'Pending',
        auctionStatus: reg.status === 'Verified' ? 'Available' : 'Pending',
        featured: false,
        registeredAt: reg.submittedAt,
        photo: reg.photoUrl,
      };
      setPlayers([p]);
      // Bump village counts
      setVillages((prev) => prev.map((v) =>
        v.name === reg.village
          ? {
              ...v,
              registered: 1,
              verified: reg.status === 'Verified' ? 1 : 0,
              auctionEligible: reg.status === 'Verified' ? 1 : 0,
            }
          : v,
      ));
    }
  }, []);

  const verifiedPlayers  = players.filter((p) => p.status === 'Verified');
  const pendingPlayers   = players.filter((p) => p.status === 'Pending');
  const featuredPlayers  = players.filter((p) => p.featured);
  const recentPlayers    = [...players].filter(p => p.status !== 'Verified').sort((a, b) => b.registeredAt.localeCompare(a.registeredAt)).slice(0, 6);
  const villageModalPlayers = villageModal ? players.filter((p) => p.village === villageModal) : [];

  return (
    <div className="min-h-dvh bg-[#f5f3ed]">

      {/* ── Sticky top bar ── */}
      <header className="sticky top-0 z-30 border-b border-[#d9ded2] bg-white/90 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl flex items-center gap-3 px-4 py-3 lg:px-6">
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <span className="text-base">🏆</span>
            <span className="text-sm font-bold text-[#17352a]">BMPL 2027</span>
            <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-[9px] font-extrabold text-green-700 uppercase tracking-[0.06em]">Live</span>
          </div>

          <div
            className="flex flex-1 items-center gap-2.5 rounded-xl bg-[#f5f3ed] px-3.5 py-2.5 cursor-pointer"
            onClick={() => router.push('/sports/bmpl/auction')}
          >
            <Search size={15} className="shrink-0 text-[#9aab9e]" />
            <span className="text-sm text-[#9aab9e] select-none">Search players, teams, villages...</span>
          </div>

          <button className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3ed] text-[#5f6d64] hover:bg-[#d9ded2] transition-colors">
            <Bell size={16} />
          </button>
          <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#1E7B3B]/12 border border-[#1E7B3B]/20">
            <span className="text-sm font-bold text-[#1E7B3B]">{user?.username?.[0]?.toUpperCase() ?? 'U'}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6 space-y-10">

        {/* ── BMPL Hero Banner ── */}
        <div className="relative overflow-hidden rounded-3xl bg-[#0a2016] text-white">
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #F59E0B 0, #F59E0B 1px, transparent 0, transparent 50%)', backgroundSize: '14px 14px' }} />
          <div className="relative px-6 py-8 lg:px-10 lg:py-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="rounded-full bg-[#F59E0B] px-3 py-1 text-[10px] font-extrabold text-[#17352a] uppercase tracking-[0.1em]">Season 1 · 2027</span>
                  <span className="rounded-full bg-green-500/20 border border-green-500/30 px-3 py-1 text-[10px] font-bold text-green-400">🟢 Registration Open</span>
                </div>
                <h1 className="text-2xl font-black tracking-tight leading-tight lg:text-3xl">
                  Biccavolu Mandal<br />
                  <span className="text-[#F59E0B]">Premier League</span>
                </h1>
                <p className="mt-2 text-sm text-white/60">Official Tournament Platform · East Godavari</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs">
                  {['14 Villages', '10 Teams', 'Live Auction', 'Live Scores'].map((tag) => (
                    <span key={tag} className="rounded-full bg-white/10 border border-white/10 px-2.5 py-1 font-semibold">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 lg:gap-3">
                {[
                  { val: String(players.length),         label: 'Registered',    color: 'text-[#F59E0B]' },
                  { val: String(verifiedPlayers.length), label: 'Verified',       color: 'text-green-400' },
                  { val: String(verifiedPlayers.length), label: 'Auction Ready',  color: 'text-blue-400'  },
                  { val: '0',                            label: 'Teams',          color: 'text-purple-400' },
                ].map(({ val, label, color }) => (
                  <div key={label} className="rounded-2xl bg-white/5 border border-white/8 px-4 py-3 text-center min-w-[80px]">
                    <p className={cn('text-2xl font-black', color)}>{val}</p>
                    <p className="text-[9px] uppercase tracking-[0.08em] text-white/40 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => router.push('/sports/bmpl')}
                className="rounded-full bg-[#F59E0B] px-5 py-2.5 text-sm font-bold text-[#17352a] hover:bg-[#fbbf24] transition-colors">
                🏏 Explore BMPL
              </button>
              <button onClick={() => router.push('/sports/bmpl/fixtures')}
                className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10 transition-colors">
                🏆 View Tournament
              </button>
              <button onClick={() => document.getElementById('announcements')?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-bold text-white/60 hover:bg-white/5 transition-colors">
                📢 Announcements
              </button>
            </div>
          </div>
        </div>

        {/* ── Greeting ── */}
        <div>
          <h2 className="text-xl font-extrabold text-[#17352a]">
            🏏 {timeGreeting()}, {user?.username || 'there'}!
          </h2>
          <p className="text-sm text-[#5f6d64] mt-0.5">
            BMPL Player Hub — Explore all players across Biccavolu Mandal
          </p>
        </div>

        {/* ── Section 1: Verified Auction Players ── */}
        <section>
          <SectionHeader title="✅ Verified Players" count={verifiedPlayers.length} onMore={() => router.push('/sports/bmpl/auction')} />
          {verifiedPlayers.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-4 lg:overflow-visible">
              {verifiedPlayers.map((p) => (
                <PlayerCardLg key={p.id} p={p} onClick={() => router.push(`/sports/players/${p.id}`)} />
              ))}
            </div>
          ) : (
            <EmptyState icon="✅" text="No verified players yet — registrations are being reviewed." />
          )}
        </section>

        {/* ── Section 2: Recently Registered ── */}
        <section>
          <SectionHeader title="🔥 Recently Registered Players" count={recentPlayers.length} onMore={() => router.push('/sports/bmpl/auction')} />
          {recentPlayers.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {recentPlayers.map((p) => (
                <PlayerCardSm key={p.id} p={p} onClick={() => router.push(`/sports/players/${p.id}`)} />
              ))}
            </div>
          ) : (
            <EmptyState icon="🔥" text="No registrations yet. Registration is open at Sports → BMPL." />
          )}
        </section>

        {/* ── Section 3: Featured Players ── */}
        {featuredPlayers.length > 0 && (
          <section>
            <SectionHeader title="⭐ Featured Players" count={featuredPlayers.length} />
            <div className="grid gap-4 sm:grid-cols-3">
              {featuredPlayers.map((p) => (
                <div key={p.id} onClick={() => router.push(`/sports/players/${p.id}`)}
                  className="cursor-pointer rounded-2xl border-2 border-[#F59E0B]/30 bg-gradient-to-br from-[#0a2016] to-[#17352a] text-white overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-[#F59E0B]/10 transition-all">
                  <div className="px-5 pt-6 pb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#F59E0B]/20 overflow-hidden border-2 border-[#F59E0B]/30">
                        {p.photo
                          ? <img src={p.photo} alt={p.name} className="h-full w-full object-cover" />
                          : <span className="text-2xl font-black text-[#F59E0B]">{p.name[0]}</span>}
                      </div>
                      <div>
                        <p className="font-extrabold text-base">{p.name}</p>
                        <div className="flex items-center gap-1 text-xs text-white/50 mt-0.5">
                          <MapPin size={9} /> {p.village}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className={cn('rounded-full px-2.5 py-1 text-[10px] font-bold', ROLE_COLOR[p.role] ?? '')}>{p.role}</span>
                      <span className="text-[10px] font-bold text-green-400">✅ Verified · Auction Ready</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Section 4: Players By Village ── */}
        <section>
          <SectionHeader title="🏏 Players By Village" subtitle="Biccavolu Mandal · 14 Villages" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
            {villages.map((v) => (
              <button
                key={v.name}
                onClick={() => setVillageModal(v.name)}
                className="flex flex-col gap-2 rounded-2xl border border-[#d9ded2] bg-white p-4 text-left hover:-translate-y-0.5 hover:border-[#1E7B3B]/40 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏘️</span>
                  <p className="text-xs font-extrabold text-[#17352a] leading-tight">{v.name}</p>
                </div>
                <div className="grid grid-cols-3 gap-1 w-full">
                  <div className="rounded-lg bg-[#f5f3ed] px-1.5 py-1 text-center">
                    <p className="text-sm font-black text-[#17352a]">{v.registered}</p>
                    <p className="text-[8px] text-[#9aab9e] leading-tight">Reg.</p>
                  </div>
                  <div className="rounded-lg bg-green-50 px-1.5 py-1 text-center">
                    <p className="text-sm font-black text-green-700">{v.verified}</p>
                    <p className="text-[8px] text-green-500 leading-tight">Verf.</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 px-1.5 py-1 text-center">
                    <p className="text-sm font-black text-blue-700">{v.auctionEligible}</p>
                    <p className="text-[8px] text-blue-400 leading-tight">Auc.</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── Village Leaderboard ── */}
        <section>
          <SectionHeader title="🏆 Village Leaderboard" subtitle="Most registrations across Biccavolu Mandal" />
          <div className="rounded-2xl border border-[#d9ded2] bg-white overflow-hidden">
            {/* Header */}
            <div className="bg-[#f5f3ed] px-5 py-2.5 flex items-center gap-3">
              <span className="w-6 shrink-0" />
              <p className="flex-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#9aab9e] text-left">Village</p>
              <p className="w-14 shrink-0 text-[9px] font-bold uppercase tracking-[0.08em] text-[#9aab9e] text-center">Reg</p>
              <p className="w-16 shrink-0 text-[9px] font-bold uppercase tracking-[0.08em] text-green-600 text-center">Verified</p>
              <p className="w-16 shrink-0 text-[9px] font-bold uppercase tracking-[0.08em] text-blue-600 text-center">Auction</p>
            </div>
            {[...villages]
              .sort((a, b) => b.registered - a.registered)
              .map((v, i) => (
                <button
                  key={v.name}
                  onClick={() => setVillageModal(v.name)}
                  className="w-full flex items-center gap-3 px-5 py-3 border-b border-[#f5f3ed] last:border-0 hover:bg-[#fafaf9] transition-colors text-left"
                >
                  <span className={cn(
                    'w-6 shrink-0 text-xs font-extrabold text-center',
                    i === 0 ? 'text-[#F59E0B]' : i === 1 ? 'text-[#b0b8c1]' : i === 2 ? 'text-amber-700' : 'text-[#d9ded2]',
                  )}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                  </span>
                  <p className="flex-1 text-sm font-semibold text-[#17352a]">{v.name}</p>
                  <p className="w-14 shrink-0 text-sm font-bold text-[#17352a] text-center">{v.registered}</p>
                  <p className="w-16 shrink-0 text-sm font-bold text-green-700 text-center">{v.verified}</p>
                  <p className="w-16 shrink-0 text-sm font-bold text-blue-700 text-center">{v.auctionEligible}</p>
                </button>
              ))}
          </div>
        </section>

        {/* ── Section 5: Tournament Statistics ── */}
        <section>
          <SectionHeader title="📊 Tournament Statistics" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: 'Total Registered',      val: players.length,         color: '#1E7B3B', icon: '📝' },
              { label: 'Verified Players',       val: verifiedPlayers.length, color: '#16a34a', icon: '✅' },
              { label: 'Pending Verification',   val: pendingPlayers.length,  color: '#d97706', icon: '⏳' },
              { label: 'Auction Eligible',       val: verifiedPlayers.length, color: '#2563eb', icon: '🎯' },
              { label: 'Teams Registered',       val: 0,                      color: '#9333ea', icon: '👥' },
              { label: 'Villages Participating', val: villages.length,        color: '#0f766e', icon: '🏘️' },
            ].map(({ label, val, color, icon }) => (
              <div key={label} className="rounded-2xl border border-[#d9ded2] bg-white p-4 text-center">
                <span className="text-2xl">{icon}</span>
                <p className="text-2xl font-extrabold mt-1" style={{ color }}>{val}</p>
                <p className="text-[9px] text-[#9aab9e] uppercase tracking-[0.06em] mt-0.5 leading-tight">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Tournament Announcements ── */}
        <section id="announcements">
          <SectionHeader title="📅 Tournament Announcements" />
          <div className="rounded-2xl border border-[#d9ded2] bg-white overflow-hidden">
            {ANNOUNCEMENTS.map((a, i) => (
              <div key={i} className={cn(
                'flex items-center gap-4 px-5 py-4 border-b border-[#f5f3ed] last:border-0',
                a.status === 'active' && 'bg-[#1E7B3B]/5',
              )}>
                <div className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl',
                  a.status === 'active' ? 'bg-[#1E7B3B]/15' : 'bg-[#f5f3ed] opacity-60',
                )}>
                  {a.icon}
                </div>
                <div className="flex-1">
                  <p className={cn('text-sm font-bold', a.status === 'active' ? 'text-[#17352a]' : 'text-[#9aab9e]')}>{a.label}</p>
                  <p className="text-xs text-[#9aab9e]">{a.date}</p>
                </div>
                {a.status === 'active' && (
                  <span className="shrink-0 rounded-full bg-[#1E7B3B] px-3 py-1 text-[10px] font-bold text-white">Active</span>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>

      {villageModal && (
        <VillageModal
          village={villageModal}
          players={villageModalPlayers}
          onClose={() => setVillageModal(null)}
        />
      )}
    </div>
  );
}

/* ── Section Header ─────────────────────────────────────────── */

function SectionHeader({ title, subtitle, count, onMore }: {
  title: string; subtitle?: string; count?: number; onMore?: () => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h2 className="text-base font-extrabold text-[#17352a] sm:text-lg">{title}</h2>
        {subtitle && <p className="text-xs text-[#9aab9e] mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {count !== undefined && (
          <span className="rounded-full bg-[#1E7B3B]/10 px-2.5 py-1 text-xs font-bold text-[#1E7B3B]">{count}</span>
        )}
        {onMore && (
          <button onClick={onMore} className="text-xs font-semibold text-[#1E7B3B] hover:underline">
            View all →
          </button>
        )}
      </div>
    </div>
  );
}
