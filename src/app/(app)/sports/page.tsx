'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Plus } from 'lucide-react';
import { loadBmplRegistration, type BmplRegistration } from '@/lib/bmplRegistration';

/* ── Types ──────────────────────────────────────────────────── */

type LiveMatch = {
  id: number;
  tournament: string;
  matchNo: string;
  team1: { name: string; score: string; overs: string };
  team2: { name: string; score: string; overs: string };
  chasing: { team: string; need: number; in: string };
  venue: string;
};

type Tournament = {
  id: number;
  name: string;
  village: string;
  type: string;
  startDate: string;
  prize: string;
  registered: number;
  max: number;
};

type TopPlayer = {
  id: number;
  name: string;
  village: string;
  role: string;
  runs: number;
  matches: number;
  wickets: number;
};

type TeamRanking = {
  rank: number;
  name: string;
  played: number;
  won: number;
  pts: number;
};

type Ground = {
  name: string;
  village: string;
  type: string;
  emoji: string;
};

type Result = {
  team1: string;
  team2: string;
  result: string;
  date: string;
};

/* ── Empty data (wired to API later) ────────────────────────── */

const liveMatches: LiveMatch[]     = [];
const upcomingTournaments: Tournament[] = [];
const topPlayers: TopPlayer[]      = [];
const teamRankings: TeamRanking[]  = [];
const nearbyGrounds: Ground[]      = [];
const recentResults: Result[]      = [];

/* ── Component ─────────────────────────────────────────────── */

export default function SportsDashboard() {
  const router = useRouter();
  const [myReg, setMyReg] = useState<BmplRegistration | null>(null);

  useEffect(() => {
    setMyReg(loadBmplRegistration());
  }, []);

  const registeredCount = myReg ? 1 : 0;
  const verifiedCount   = myReg?.status === 'Verified' ? 1 : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 space-y-8">

      {/* BMPL Registration Panel */}
      <div className="rounded-3xl bg-[#0a2016] text-white overflow-hidden">
        <div className="relative px-6 py-6 lg:px-8 lg:py-8">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #F59E0B 0, #F59E0B 1px, transparent 0, transparent 50%)', backgroundSize: '12px 12px' }} />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="rounded-full bg-green-500/20 border border-green-500/30 px-3 py-1 text-[10px] font-extrabold text-green-400 uppercase tracking-[0.1em]">● Registration Open</span>
              <span className="rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/30 px-3 py-1 text-[10px] font-bold text-[#F59E0B]">BMPL Season 1 · 2027</span>
            </div>
            <h2 className="text-xl font-black leading-tight">
              Biccavolu Mandal <span className="text-[#F59E0B]">Premier League</span>
            </h2>
            <p className="mt-1.5 text-sm text-white/60 max-w-sm">
              Register as a player. Get verified. Vote for captains. The top 10 voted players lead the 10 BMPL teams.
            </p>

            {/* Key dates */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Registration Status', val: 'Active', color: 'text-green-400',   icon: '📝' },
                { label: 'Last Date',            val: 'Nov 1, 2027',  color: 'text-[#F59E0B]', icon: '⏳' },
                { label: 'Auction Date',         val: 'Nov 15, 2027', color: 'text-blue-400',  icon: '🎯' },
                { label: 'Villages',             val: '14',           color: 'text-purple-400', icon: '🏘️' },
              ].map(({ label, val, color, icon }) => (
                <div key={label} className="rounded-2xl bg-white/5 border border-white/8 px-4 py-3 text-center">
                  <p className="text-lg">{icon}</p>
                  <p className={`text-sm font-extrabold mt-1 ${color}`}>{val}</p>
                  <p className="text-[9px] text-white/40 uppercase tracking-[0.07em] mt-0.5 leading-tight">{label}</p>
                </div>
              ))}
            </div>

            {/* Player counts */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: 'Registered Players',    val: registeredCount, color: 'text-white' },
                { label: 'Verified Players',       val: verifiedCount,   color: 'text-green-400' },
                { label: 'Participating Villages', val: 14,              color: 'text-[#F59E0B]' },
              ].map(({ label, val, color }) => (
                <div key={label} className="rounded-2xl bg-white/5 border border-white/8 px-3 py-3 text-center">
                  <p className={`text-2xl font-black ${color}`}>{val}</p>
                  <p className="text-[9px] text-white/40 uppercase tracking-[0.07em] mt-0.5 leading-tight">{label}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => router.push('/sports/bmpl/register')}
                className="rounded-full bg-[#F59E0B] px-6 py-2.5 text-sm font-bold text-[#17352a] hover:bg-[#fbbf24] transition-colors"
              >
                {myReg ? '📋 View My Registration' : '📝 Register as Player'}
              </button>
              <button
                onClick={() => router.push('/sports/bmpl')}
                className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-bold text-white hover:bg-white/10 transition-colors"
              >
                Tournament Details →
              </button>
            </div>

            {/* Village participation pills */}
            <div className="mt-5 pt-4 border-t border-white/10">
              <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/40 mb-2">Village Participation</p>
              <div className="flex flex-wrap gap-1.5">
                {['Arikarevula','Balabhadrapuram','Biccavolu','Illapalle','Kapavaram','Komaripalem','Konkuduru','Melluru','Pandalapaka','Rallakhandrika','Rangapuram','Thummalapalle','Tossipudi','Voolapalle'].map((v) => (
                  <span key={v} className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-white/60">
                    <MapPin size={8} className="text-[#F59E0B]" /> {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QA emoji="🏆" label="Create Tournament" color="bg-[#F59E0B]" textColor="text-[#17352a]" onClick={() => router.push('/sports/tournaments/create')} />
        <QA emoji="👥" label="Create Team"        color="bg-[#1E7B3B]" textColor="text-white"    onClick={() => router.push('/sports/teams/create')} />
        <QA emoji="🏏" label="Register Player"    color="bg-[#1a4f8a]" textColor="text-white"    onClick={() => router.push('/sports/players/create')} />
        <QA emoji="📊" label="Score a Match"      color="bg-[#9a3412]" textColor="text-white"    onClick={() => router.push('/sports/scores')} />
      </div>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <Section title="🔥 Live Matches">
          <div className="space-y-3">
            {liveMatches.map((m) => (
              <div key={m.id} className="rounded-2xl bg-[#0a2016] text-white overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-2.5 border-b border-white/10">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold text-red-400">LIVE</span>
                  <span className="text-xs text-white/50">· {m.tournament} · {m.matchNo}</span>
                  <div className="ml-auto flex items-center gap-1 text-[10px] text-white/40">
                    <MapPin size={10} /> {m.venue}
                  </div>
                </div>
                <div className="px-5 py-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                  <div>
                    <p className="text-xs text-white/60">{m.team1.name}</p>
                    <p className="text-2xl font-black">{m.team1.score}</p>
                    <p className="text-[10px] text-white/40">{m.team1.overs} overs</p>
                  </div>
                  <p className="text-sm font-black text-white/20">vs</p>
                  <div className="text-right">
                    <p className="text-xs font-medium text-amber-400">{m.team2.name}</p>
                    <p className="text-2xl font-black">{m.team2.score}</p>
                    <p className="text-[10px] text-white/40">{m.team2.overs} overs</p>
                  </div>
                </div>
                <div className="px-5 pb-4">
                  <div className="rounded-xl bg-amber-500/15 border border-amber-500/20 px-4 py-2 text-xs font-semibold text-amber-300">
                    {m.chasing.team} need <strong>{m.chasing.need} runs</strong> in <strong>{m.chasing.in}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Upcoming Tournaments */}
      <Section title="🏆 Upcoming Tournaments" onMore={() => router.push('/sports/tournaments')}>
        {upcomingTournaments.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingTournaments.map((t) => {
              const pct = Math.round((t.registered / t.max) * 100);
              return (
                <div key={t.id} className="rounded-2xl border border-[#d9ded2] bg-white p-4 hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="font-bold text-[#17352a] leading-tight">{t.name}</p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-[#5f6d64]">
                        <MapPin size={10} /> {t.village}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#0a2016] px-2.5 py-1 text-[10px] font-bold text-white">{t.type}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#5f6d64] mb-2">
                    <span>📅 {t.startDate}</span>
                    <span className="font-semibold text-[#1E7B3B]">{t.prize}</span>
                  </div>
                  <div className="mb-3">
                    <div className="h-1.5 rounded-full bg-[#f5f3ed] overflow-hidden">
                      <div className="h-full rounded-full bg-[#1E7B3B]" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-1 text-[10px] text-[#9aab9e]">{t.registered}/{t.max} teams registered</p>
                  </div>
                  <button className="w-full rounded-xl bg-[#1E7B3B] py-2 text-xs font-bold text-white hover:bg-[#2d9b4e] transition-colors">
                    Register Team
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState icon="🏆" text="No upcoming tournaments yet" cta="Create Tournament" onCta={() => router.push('/sports/tournaments/create')} />
        )}
      </Section>

      {/* Top Players & Team Rankings */}
      <div className="grid gap-6 lg:grid-cols-2">

        <Section title="⭐ Top Players" onMore={() => router.push('/sports/players')}>
          {topPlayers.length > 0 ? (
            <div className="rounded-2xl border border-[#d9ded2] bg-white overflow-hidden">
              <div className="px-4 py-2 bg-[#f5f3ed] flex justify-between items-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9aab9e]">Player</p>
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9aab9e]">Runs · Wkts · Matches</p>
              </div>
              {topPlayers.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3 border-b border-[#f5f3ed] last:border-0 hover:bg-[#fafaf9] cursor-pointer">
                  <span className="w-5 text-xs font-bold text-[#9aab9e] text-center">{i + 1}</span>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1E7B3B]/10 text-sm font-black text-[#1E7B3B]">{p.name[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#17352a] truncate">{p.name}</p>
                    <p className="text-[10px] text-[#9aab9e]">{p.village} · {p.role}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-[#17352a]">{p.runs} · {p.wickets}</p>
                    <p className="text-[10px] text-[#9aab9e]">{p.matches} matches</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="⭐" text="Player rankings will appear after matches are scored" />
          )}
        </Section>

        <Section title="📈 Team Rankings" onMore={() => router.push('/sports/rankings')}>
          {teamRankings.length > 0 ? (
            <div className="rounded-2xl border border-[#d9ded2] bg-white overflow-hidden">
              <div className="bg-[#f5f3ed] px-4 py-2 grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 items-center">
                {['#', 'Team', 'P', 'W', 'Pts'].map((h) => (
                  <p key={h} className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9aab9e] text-center">{h}</p>
                ))}
              </div>
              {teamRankings.map((t) => (
                <div key={t.rank} className="px-4 py-3 grid grid-cols-[auto_1fr_auto_auto_auto] gap-3 items-center border-b border-[#f5f3ed] last:border-0">
                  <span className="text-xs font-bold text-[#9aab9e] text-center w-4">{t.rank}</span>
                  <p className="text-sm font-semibold text-[#17352a] truncate">{t.name}</p>
                  <p className="text-xs text-[#5f6d64] text-center">{t.played}</p>
                  <p className="text-xs font-bold text-green-700 text-center">{t.won}</p>
                  <p className="text-sm font-extrabold text-[#17352a] text-center">{t.pts}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon="📈" text="Team rankings will appear once the season begins" />
          )}
        </Section>
      </div>

      {/* Nearby Grounds */}
      <Section title="🏟 Nearby Grounds" onMore={() => router.push('/sports/venues')}>
        {nearbyGrounds.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {nearbyGrounds.map((g) => (
              <div key={g.name} className="flex items-center gap-4 rounded-2xl border border-[#d9ded2] bg-white p-4 hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0a2016] text-2xl">{g.emoji}</div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#17352a] truncate">{g.name}</p>
                  <p className="text-xs text-[#5f6d64]">{g.village} · {g.type}</p>
                </div>
                <button className="shrink-0 rounded-xl border border-[#d9ded2] px-3 py-1.5 text-xs font-semibold text-[#17352a] hover:border-[#1E7B3B]/40 transition-colors ml-auto">
                  Book
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon="🏟" text="No grounds listed yet" />
        )}
      </Section>

      {/* Recent Results */}
      <Section title="🏅 Recent Results">
        {recentResults.length > 0 ? (
          <div className="space-y-2">
            {recentResults.map((r, i) => (
              <div key={i} className="rounded-2xl border border-[#d9ded2] bg-white px-5 py-3.5">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm text-[#17352a]">
                    <span className="font-semibold">{r.team1}</span>
                    <span className="mx-1.5 text-[#9aab9e]">vs</span>
                    <span className="font-semibold">{r.team2}</span>
                  </div>
                  <span className="shrink-0 text-[10px] text-[#9aab9e]">{r.date}</span>
                </div>
                <p className="mt-1 text-xs text-[#1E7B3B] font-semibold">{r.result}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon="🏅" text="Match results will appear here after games are scored" />
        )}
      </Section>

      {/* CTA */}
      <div className="rounded-2xl border border-[#d9ded2] bg-white p-8 text-center">
        <span className="text-4xl">🚀</span>
        <p className="mt-3 font-bold text-[#17352a]">Be the first organizer in your area</p>
        <p className="mt-1 text-sm text-[#5f6d64]">Create a tournament and invite local teams to participate.</p>
        <div className="mt-5 flex gap-3 justify-center">
          <button onClick={() => router.push('/sports/tournaments/create')} className="inline-flex items-center gap-2 rounded-full bg-[#F59E0B] px-5 py-2.5 text-sm font-bold text-[#17352a] hover:bg-[#fbbf24] transition-colors">
            <Plus size={14} /> Create Tournament
          </button>
          <button onClick={() => router.push('/sports/teams/create')} className="inline-flex items-center gap-2 rounded-full border border-[#d9ded2] px-5 py-2.5 text-sm font-bold text-[#17352a] hover:border-[#17352a]/40 transition-colors">
            Register Team
          </button>
        </div>
      </div>

    </div>
  );
}

/* ── Helpers ────────────────────────────────────────────────── */

function EmptyState({ icon, text, cta, onCta }: { icon: string; text: string; cta?: string; onCta?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-2 rounded-2xl border border-dashed border-[#d9ded2] bg-white">
      <span className="text-3xl">{icon}</span>
      <p className="text-sm text-[#9aab9e]">{text}</p>
      {cta && onCta && (
        <button onClick={onCta} className="mt-1 rounded-full bg-[#1E7B3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#2d9b4e] transition-colors">
          {cta}
        </button>
      )}
    </div>
  );
}

function Section({ title, onMore, children }: { title: string; onMore?: () => void; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-extrabold text-[#17352a]">{title}</h2>
        {onMore && (
          <button onClick={onMore} className="text-xs font-semibold text-[#1E7B3B] hover:underline">
            View all →
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function QA({ emoji, label, color, textColor, onClick }: { emoji: string; label: string; color: string; textColor: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 rounded-2xl ${color} px-3 py-4 text-center transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-95`}
    >
      <span className="text-2xl">{emoji}</span>
      <span className={`text-xs font-bold leading-tight ${textColor}`}>{label}</span>
    </button>
  );
}
