'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Lock, Trophy, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { loadBmplRegistration } from '@/lib/bmplRegistration';
import { getCurrentPhase, loadPhases } from '@/lib/phaseConfig';

const VOTE_KEY = 'bmpl_captain_vote_v1';

type Nominee = {
  id: string;
  name: string;
  village: string;
  role: string;
  photo?: string;
  votes: number;
};

/* Demo nominees — in production these come from verified player nominations */
const DEMO_NOMINEES: Nominee[] = [
  { id: 'n1', name: 'Ravi Kumar',    village: 'Biccavolu',  role: 'Batsman',     votes: 12 },
  { id: 'n2', name: 'Suresh Babu',   village: 'Rajanagaram',role: 'All-Rounder', votes: 9  },
  { id: 'n3', name: 'Venkat Rao',    village: 'Kotipalli',  role: 'Bowler',      votes: 7  },
  { id: 'n4', name: 'Anil Reddy',    village: 'Mandapeta',  role: 'Batsman',     votes: 5  },
  { id: 'n5', name: 'Prasad Goud',   village: 'Amalapuram', role: 'Wicket Keeper', votes: 4 },
];

function loadVote(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(VOTE_KEY);
}

function saveVote(nomineeId: string) {
  localStorage.setItem(VOTE_KEY, nomineeId);
}

export default function VotePage() {
  const router = useRouter();
  const [myReg, setMyReg] = useState<ReturnType<typeof loadBmplRegistration>>(null);
  const [nominees, setNominees] = useState<Nominee[]>(DEMO_NOMINEES);
  const [myVote, setMyVote] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const phases = loadPhases();
  const activePhaseN = getCurrentPhase(phases);
  const isPhase4Active = activePhaseN === 4;

  useEffect(() => {
    setMyReg(loadBmplRegistration());
    const saved = loadVote();
    if (saved) setMyVote(saved);
  }, []);

  function handleVote(id: string) {
    if (myVote) return;
    setConfirming(id);
  }

  function confirmVote() {
    if (!confirming) return;
    saveVote(confirming);
    setNominees(prev => prev.map(n => n.id === confirming ? { ...n, votes: n.votes + 1 } : n));
    setMyVote(confirming);
    setConfirming(null);
    setSubmitted(true);
  }

  const sorted = [...nominees].sort((a, b) => b.votes - a.votes);
  const total = nominees.reduce((s, n) => s + n.votes, 0) + (myVote ? 0 : 0);
  const canVote = myReg?.status === 'Verified' && !myVote;

  /* ── Not in Phase 4 ── */
  if (!isPhase4Active) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 flex flex-col items-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f5f3ed] text-4xl">🗳️</div>
        <h2 className="text-xl font-extrabold text-[#17352a]">Voting Not Open Yet</h2>
        <p className="text-sm text-[#5f6d64] max-w-sm">
          Captain voting opens in <strong>Phase 4</strong> (Nov 12–14, 2027) after player nominations are complete.
          Only verified BMPL players can vote.
        </p>
        <div className="mt-2 flex items-center gap-2 rounded-2xl bg-[#0a2016]/5 border border-[#d9ded2] px-5 py-3 text-xs text-[#5f6d64]">
          <Lock size={13} className="text-[#9aab9e]" />
          Unlocks after Phase 3 · Captain Nominations complete
        </div>
        <button
          onClick={() => router.push('/sports/bmpl')}
          className="mt-2 rounded-full border border-[#d9ded2] px-5 py-2 text-xs font-semibold text-[#5f6d64] hover:border-[#1E7B3B]/40 transition-colors"
        >
          ← Back to Overview
        </button>
      </div>
    );
  }

  /* ── Not registered / not verified ── */
  if (!myReg) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 flex flex-col items-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-4xl">🔒</div>
        <h2 className="text-xl font-extrabold text-[#17352a]">Register First</h2>
        <p className="text-sm text-[#5f6d64]">You must be a registered and verified BMPL player to vote.</p>
        <button
          onClick={() => router.push('/sports/bmpl/register')}
          className="rounded-full bg-[#1E7B3B] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#2d9b4e] transition-colors"
        >
          Register as Player
        </button>
      </div>
    );
  }

  if (myReg.status !== 'Verified') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 flex flex-col items-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-4xl">⏳</div>
        <h2 className="text-xl font-extrabold text-[#17352a]">Verification Pending</h2>
        <p className="text-sm text-[#5f6d64] max-w-sm">
          Your registration is <strong>{myReg.status}</strong>. Only <strong>Verified</strong> players can vote for captains.
          Check back after admin verification.
        </p>
        <button
          onClick={() => router.push('/sports/bmpl/register')}
          className="rounded-full border border-[#d9ded2] px-5 py-2 text-xs font-semibold text-[#5f6d64] hover:border-[#1E7B3B]/40 transition-colors"
        >
          View My Registration
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 lg:px-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="rounded-full bg-[#1E7B3B]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#1E7B3B]">Phase 4 · Active</span>
          <span className="text-[10px] text-[#9aab9e]">Nov 12–14, 2027</span>
        </div>
        <h2 className="text-2xl font-extrabold text-[#17352a]">🗳️ Vote for Captain</h2>
        <p className="text-sm text-[#5f6d64] mt-1">
          Choose one captain from the nominees below. Each verified player gets one vote.
        </p>
      </div>

      {/* Already voted banner */}
      {myVote && (
        <div className={cn(
          'mb-5 flex items-start gap-3 rounded-2xl px-4 py-4',
          submitted ? 'bg-[#1E7B3B]/10 border border-[#1E7B3B]/20' : 'bg-[#f5f3ed] border border-[#d9ded2]'
        )}>
          <CheckCircle size={18} className="text-[#1E7B3B] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-[#17352a]">
              {submitted ? 'Vote Submitted!' : 'You already voted'}
            </p>
            <p className="text-xs text-[#5f6d64] mt-0.5">
              You voted for <strong>{nominees.find(n => n.id === myVote)?.name}</strong>. Results announced on Nov 14.
            </p>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="mb-5 grid grid-cols-3 gap-3">
        {[
          [String(nominees.length), 'Nominees'],
          [String(total), 'Votes Cast'],
          [myVote ? '✓' : canVote ? '→' : '–', myVote ? 'Voted' : canVote ? 'Your Turn' : 'Locked'],
        ].map(([val, label]) => (
          <div key={label} className="rounded-2xl border border-[#d9ded2] bg-white px-4 py-3 text-center">
            <p className="text-2xl font-extrabold text-[#17352a]">{val}</p>
            <p className="text-[10px] text-[#9aab9e] uppercase tracking-[0.06em]">{label}</p>
          </div>
        ))}
      </div>

      {/* Nominee cards */}
      <div className="space-y-3">
        {sorted.map((n, i) => {
          const isVoted = myVote === n.id;
          const pct = total > 0 ? Math.round((n.votes / total) * 100) : 0;
          return (
            <div key={n.id} className={cn(
              'rounded-2xl border bg-white p-4 transition-all',
              isVoted ? 'border-[#1E7B3B] ring-2 ring-[#1E7B3B]/20' : 'border-[#d9ded2]',
            )}>
              <div className="flex items-center gap-3 mb-3">
                {/* Rank */}
                <div className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-extrabold',
                  i === 0 ? 'bg-[#F59E0B]/15 text-[#F59E0B]' :
                  i === 1 ? 'bg-gray-100 text-gray-500' :
                  i === 2 ? 'bg-orange-50 text-orange-400' :
                  'bg-[#f5f3ed] text-[#9aab9e]',
                )}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </div>

                {/* Avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1E7B3B]/10 overflow-hidden text-sm font-extrabold text-[#1E7B3B]">
                  {n.photo
                    ? <img src={n.photo} alt={n.name} className="h-full w-full object-cover" />
                    : n.name[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-[#17352a] truncate">{n.name}</p>
                    {isVoted && (
                      <span className="shrink-0 rounded-full bg-[#1E7B3B] px-2 py-0.5 text-[9px] font-extrabold text-white uppercase tracking-[0.06em]">
                        Your Vote
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#9aab9e]">{n.village} · {n.role}</p>
                </div>

                {/* Vote button */}
                {!myVote && (
                  <button
                    onClick={() => handleVote(n.id)}
                    className="shrink-0 rounded-full bg-[#1E7B3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#2d9b4e] transition-colors"
                  >
                    Vote
                  </button>
                )}
                {myVote && !isVoted && (
                  <span className="shrink-0 text-sm font-bold text-[#9aab9e]">{n.votes} votes</span>
                )}
                {isVoted && (
                  <CheckCircle size={20} className="shrink-0 text-[#1E7B3B]" />
                )}
              </div>

              {/* Progress bar — shown after voting */}
              {myVote && (
                <div>
                  <div className="mb-1 flex justify-between text-[10px] text-[#9aab9e]">
                    <span>{n.votes} votes</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#f5f3ed] overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-700', isVoted ? 'bg-[#1E7B3B]' : 'bg-[#d9ded2]')}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="mt-6 flex items-start gap-2 rounded-2xl bg-[#0a2016]/5 border border-[#d9ded2] px-4 py-3">
        <Trophy size={14} className="text-[#F59E0B] shrink-0 mt-0.5" />
        <p className="text-xs text-[#5f6d64]">
          Top 10 vote-getters will be announced as <strong>team captains</strong> on Nov 14, 2027. Captains then pick their squads in the auction.
        </p>
      </div>

      {/* Confirm modal */}
      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirming(null)} />
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex flex-col items-center gap-3 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1E7B3B]/10 text-3xl">🗳️</div>
              <div>
                <p className="font-extrabold text-[#17352a] text-lg">Confirm Your Vote</p>
                <p className="text-sm text-[#5f6d64] mt-1">
                  You are voting for <strong>{nominees.find(n => n.id === confirming)?.name}</strong>.<br />
                  This cannot be changed.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirming(null)}
                className="flex-1 rounded-xl border border-[#d9ded2] py-3 text-sm font-semibold text-[#5f6d64] hover:bg-[#f5f3ed] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmVote}
                className="flex-1 rounded-xl bg-[#1E7B3B] py-3 text-sm font-bold text-white hover:bg-[#2d9b4e] transition-colors"
              >
                Confirm Vote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
