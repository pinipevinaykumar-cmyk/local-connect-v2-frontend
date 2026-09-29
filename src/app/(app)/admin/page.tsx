'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Calendar, Check, CheckCircle, ChevronRight, Clock, Lock, Play, RefreshCw, Shield, Users, X, XCircle } from 'lucide-react';
import { getUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import {
  DEFAULT_PHASES,
  loadPhases,
  savePhases,
  getCurrentPhase,
  resetPhases,
  type PhaseConfig,
  type PhaseStatus,
} from '@/lib/phaseConfig';
import {
  loadBmplRegistration,
  BMPL_REG_KEY,
  type BmplRegistration,
} from '@/app/(app)/sports/bmpl/register/page';

/* ── Player type for admin view ─────────────────────────────── */

type AdminPlayer = {
  id: number;
  name: string;
  village: string;
  role: string;
  age: number;
  mobile: string;
  registeredAt: string;
  registrationId: string;
  photo?: string;
  verificationStatus: 'Pending' | 'Verified' | 'Rejected';
};

function loadAdminPlayers(): AdminPlayer[] {
  const reg = loadBmplRegistration();
  if (!reg) return [];
  return [{
    id: 1,
    name: reg.name,
    village: reg.village,
    role: reg.role,
    age: parseInt(reg.age, 10) || 0,
    mobile: reg.mobile,
    registeredAt: reg.submittedAt,
    registrationId: reg.registrationId,
    photo: reg.photoUrl,
    verificationStatus: reg.status,
  }];
}

function persistPlayerStatus(id: number, status: AdminPlayer['verificationStatus']) {
  // Update the player's own registration record in localStorage
  const reg: BmplRegistration | null = loadBmplRegistration();
  if (reg) {
    localStorage.setItem(BMPL_REG_KEY, JSON.stringify({ ...reg, status }));
  }
}

/* ── Helpers ─────────────────────────────────────────────────── */

function fmtDT(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function StatusBadge({ status }: { status: PhaseStatus | string }) {
  const map = {
    active:    'bg-green-100 text-green-700 border-green-200',
    completed: 'bg-blue-100 text-blue-700 border-blue-200',
    pending:   'bg-[#f5f3ed] text-[#9aab9e] border-[#d9ded2]',
    Verified:  'bg-green-100 text-green-700',
    Pending:   'bg-amber-100 text-amber-700',
    Rejected:  'bg-red-100 text-red-700',
  };
  return (
    <span className={cn('rounded-full border px-2.5 py-0.5 text-[10px] font-bold capitalize', (map as any)[status] ?? '')}>
      {status}
    </span>
  );
}

/* ── Main Admin Page ─────────────────────────────────────────── */

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [phases, setPhases] = useState<PhaseConfig[]>([]);
  const [players, setPlayers] = useState<AdminPlayer[]>([]);
  const [tab, setTab] = useState<'phases' | 'players' | 'stats'>('players');
  const [playerFilter, setPlayerFilter] = useState<'All' | 'Pending' | 'Verified' | 'Rejected'>('All');
  const [editingSchedule, setEditingSchedule] = useState<number | null>(null);
  const [scheduleInput, setScheduleInput] = useState('');
  const [confirmActivate, setConfirmActivate] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    setPhases(loadPhases());
    setPlayers(loadAdminPlayers());
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function activatePhase(n: number) {
    const updated = phases.map((p) => {
      if (p.n < n) return { ...p, status: 'completed' as PhaseStatus };
      if (p.n === n) return { ...p, status: 'active' as PhaseStatus, activatedAt: new Date().toISOString() };
      return { ...p, status: 'pending' as PhaseStatus };
    });
    setPhases(updated);
    savePhases(updated);
    setConfirmActivate(null);
    showToast(`✅ Phase ${n} activated successfully`);
  }

  function updateSchedule(n: number, dateStr: string) {
    const updated = phases.map((p) =>
      p.n === n ? { ...p, scheduledDate: dateStr, autoActivate: true } : p,
    );
    setPhases(updated);
    savePhases(updated);
    setEditingSchedule(null);
    showToast(`🗓 Phase ${n} scheduled for ${fmtDT(dateStr)}`);
  }

  function toggleAutoActivate(n: number) {
    const updated = phases.map((p) =>
      p.n === n ? { ...p, autoActivate: !p.autoActivate } : p,
    );
    setPhases(updated);
    savePhases(updated);
  }

  function handleReset() {
    resetPhases();
    setPhases(DEFAULT_PHASES);
    showToast('♻ Phase config reset to defaults');
  }

  function updatePlayerStatus(id: number, status: AdminPlayer['verificationStatus']) {
    persistPlayerStatus(id, status);
    setPlayers((prev) => prev.map((p) => p.id === id ? { ...p, verificationStatus: status } : p));
    showToast(status === 'Verified' ? '✅ Player verified successfully' : '❌ Player rejected');
  }

  const currentPhase = getCurrentPhase(phases);
  const stats = {
    registered: players.length,
    verified:   players.filter((p) => p.verificationStatus === 'Verified').length,
    pending:    players.filter((p) => p.verificationStatus === 'Pending').length,
    rejected:   players.filter((p) => p.verificationStatus === 'Rejected').length,
  };

  return (
    <div className="min-h-dvh bg-[#f5f3ed]">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-2xl bg-[#0a2016] text-white px-5 py-3 text-sm font-semibold shadow-2xl animate-in slide-in-from-right-4">
          {toast}
        </div>
      )}

      {/* Confirm modal */}
      {confirmActivate !== null && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setConfirmActivate(null)} />
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-2xl">⚠️</div>
              <div>
                <p className="font-extrabold text-[#17352a]">Activate Phase {confirmActivate}?</p>
                <p className="text-xs text-[#5f6d64]">This will close the current phase.</p>
              </div>
            </div>
            <p className="text-sm text-[#5f6d64] mb-5">
              Activating <strong>Phase {confirmActivate}: {phases.find(p => p.n === confirmActivate)?.label}</strong> will mark all previous phases as completed. This cannot be undone from the app.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmActivate(null)}
                className="flex-1 rounded-xl border border-[#d9ded2] py-2.5 text-sm font-bold text-[#17352a] hover:bg-[#f5f3ed]">
                Cancel
              </button>
              <button onClick={() => activatePhase(confirmActivate!)}
                className="flex-1 rounded-xl bg-[#1E7B3B] py-2.5 text-sm font-bold text-white hover:bg-[#2d9b4e]">
                Yes, Activate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#0a2016] text-white px-4 py-5 lg:px-8">
        <div className="mx-auto max-w-6xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E0B]/20 text-xl">🛡️</div>
            <div>
              <p className="font-extrabold text-base">BMPL Admin Panel</p>
              <p className="text-[11px] text-white/50">Biccavolu Mandal Premier League · 2027</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-bold">
              Phase {currentPhase} Active
            </div>
            <button onClick={() => router.push('/home')}
              className="rounded-xl border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10">
              ← Dashboard
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mx-auto max-w-6xl mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Registered', val: stats.registered, color: 'text-[#F59E0B]' },
            { label: 'Verified',   val: stats.verified,   color: 'text-green-400' },
            { label: 'Pending',    val: stats.pending,    color: 'text-amber-400' },
            { label: 'Rejected',   val: stats.rejected,   color: 'text-red-400' },
          ].map(({ label, val, color }) => (
            <div key={label} className="rounded-2xl bg-white/5 border border-white/8 px-4 py-3 text-center">
              <p className={cn('text-2xl font-black', color)}>{val}</p>
              <p className="text-[9px] text-white/40 uppercase tracking-[0.08em] mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#d9ded2] bg-white sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-4 lg:px-8 flex gap-0">
          {([['phases', '⚙️ Phase Control'], ['players', '👥 Player Verification'], ['stats', '📊 Overview']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={cn('border-b-2 px-5 py-3.5 text-xs font-semibold whitespace-nowrap transition-colors',
                tab === key ? 'border-[#F59E0B] text-[#17352a]' : 'border-transparent text-[#9aab9e] hover:text-[#5f6d64]')}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8">

        {/* ── TAB: Phase Control ── */}
        {tab === 'phases' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-[#5f6d64]">Activate phases manually or set a scheduled date/time for auto-activation.</p>
              <button onClick={handleReset}
                className="flex items-center gap-1.5 rounded-full border border-[#d9ded2] px-3 py-1.5 text-xs font-semibold text-[#9aab9e] hover:border-red-300 hover:text-red-600 transition-colors">
                <RefreshCw size={11} /> Reset
              </button>
            </div>

            {phases.map((phase) => (
              <div key={phase.n}
                className={cn('rounded-2xl border-2 bg-white overflow-hidden transition-all',
                  phase.status === 'active'    && 'border-[#1E7B3B]/30',
                  phase.status === 'completed' && 'border-blue-200',
                  phase.status === 'pending'   && 'border-[#d9ded2]',
                )}>

                {/* Phase header */}
                <div className={cn('px-5 py-4 flex items-center gap-4',
                  phase.status === 'active' && 'bg-[#1E7B3B]/5',
                  phase.status === 'completed' && 'bg-blue-50',
                )}>
                  <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl border-2',
                    phase.status === 'active'    && 'border-[#1E7B3B]/30 bg-[#1E7B3B]/10',
                    phase.status === 'completed' && 'border-blue-200 bg-blue-50',
                    phase.status === 'pending'   && 'border-[#d9ded2] bg-[#f5f3ed]',
                  )}>
                    {phase.status === 'completed' ? '✅' : phase.status === 'active' ? phase.icon : <Lock size={16} className="text-[#d9ded2]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold text-[#9aab9e] uppercase tracking-[0.07em]">Phase {phase.n}</span>
                      <StatusBadge status={phase.status} />
                    </div>
                    <p className="font-bold text-[#17352a] mt-0.5">{phase.icon} {phase.label}</p>
                    <p className="text-xs text-[#9aab9e] mt-0.5">{phase.desc}</p>
                  </div>

                  {/* Activate button */}
                  {phase.status === 'pending' && (
                    <button
                      onClick={() => setConfirmActivate(phase.n)}
                      className="shrink-0 flex items-center gap-1.5 rounded-xl bg-[#1E7B3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#2d9b4e] transition-colors"
                    >
                      <Play size={12} /> Activate Now
                    </button>
                  )}
                  {phase.status === 'active' && (
                    <span className="shrink-0 flex items-center gap-1.5 rounded-xl bg-green-100 px-4 py-2 text-xs font-bold text-green-700">
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> Running
                    </span>
                  )}
                  {phase.status === 'completed' && (
                    <span className="shrink-0 flex items-center gap-1.5 rounded-xl bg-blue-100 px-3 py-2 text-xs font-bold text-blue-700">
                      <Check size={12} /> Done
                    </span>
                  )}
                </div>

                {/* Schedule row */}
                <div className="px-5 py-3 border-t border-[#f5f3ed] flex flex-wrap items-center gap-3">
                  <Clock size={13} className="text-[#9aab9e] shrink-0" />

                  {editingSchedule === phase.n ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="datetime-local"
                        value={scheduleInput}
                        onChange={(e) => setScheduleInput(e.target.value)}
                        className="flex-1 rounded-lg border border-[#d9ded2] bg-[#fafaf9] px-3 py-1.5 text-xs text-[#17352a] outline-none focus:border-[#1E7B3B]"
                      />
                      <button
                        onClick={() => scheduleInput && updateSchedule(phase.n, scheduleInput)}
                        disabled={!scheduleInput}
                        className="rounded-lg bg-[#1E7B3B] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-40">
                        Save
                      </button>
                      <button onClick={() => setEditingSchedule(null)} className="rounded-lg border border-[#d9ded2] px-3 py-1.5 text-xs font-semibold text-[#5f6d64]">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-xs text-[#5f6d64] flex-1">
                        Scheduled: <strong>{fmtDT(phase.scheduledDate)}</strong>
                        {phase.activatedAt && <span className="ml-2 text-[#9aab9e]">· Activated: {fmtDT(phase.activatedAt)}</span>}
                      </span>
                      {phase.status !== 'completed' && (
                        <button
                          onClick={() => { setEditingSchedule(phase.n); setScheduleInput(phase.scheduledDate); }}
                          className="flex items-center gap-1 rounded-lg border border-[#d9ded2] px-3 py-1.5 text-xs font-semibold text-[#5f6d64] hover:border-[#1E7B3B]/40 hover:text-[#17352a] transition-colors">
                          <Calendar size={11} /> Edit Schedule
                        </button>
                      )}
                    </>
                  )}

                  {/* Auto-activate toggle */}
                  {phase.status === 'pending' && (
                    <label className="flex items-center gap-2 cursor-pointer ml-auto">
                      <span className="text-[10px] text-[#9aab9e] font-semibold">Auto-activate</span>
                      <div
                        onClick={() => toggleAutoActivate(phase.n)}
                        className={cn('relative h-5 w-9 rounded-full transition-colors cursor-pointer',
                          phase.autoActivate ? 'bg-[#1E7B3B]' : 'bg-[#d9ded2]')}>
                        <div className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform',
                          phase.autoActivate ? 'translate-x-4' : 'translate-x-0.5')} />
                      </div>
                    </label>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB: Player Verification ── */}
        {tab === 'players' && (
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <p className="text-sm text-[#5f6d64] flex-1">Review player registrations and approve or reject based on Aadhaar and village eligibility.</p>
              <div className="flex gap-2">
                {(['All', 'Pending', 'Verified', 'Rejected'] as const).map((f) => (
                  <button key={f} onClick={() => setPlayerFilter(f)}
                    className={cn('rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                      playerFilter === f
                        ? 'bg-[#1E7B3B] text-white'
                        : 'border border-[#d9ded2] bg-white text-[#5f6d64] hover:border-[#1E7B3B]/40')}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {(() => {
              const filteredPlayers = playerFilter === 'All' ? players : players.filter(p => p.verificationStatus === playerFilter);
              return filteredPlayers.length > 0 ? (
              <div className="space-y-3">
                {filteredPlayers.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-[#d9ded2] bg-white p-4">
                    <div className="flex items-start gap-4">
                      {/* Photo */}
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0a2016] overflow-hidden text-lg font-black text-white/80 border-2 border-[#1E7B3B]/20">
                        {p.photo
                          ? <img src={p.photo} alt={p.name} className="h-full w-full object-cover" />
                          : p.name[0]}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="font-bold text-[#17352a]">{p.name}</p>
                          <span className="text-[10px] font-mono text-[#9aab9e]">{p.registrationId}</span>
                          <StatusBadge status={p.verificationStatus} />
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-[#5f6d64] sm:grid-cols-4">
                          <span>📍 {p.village}</span>
                          <span>🏏 {p.role}</span>
                          <span>🎂 Age {p.age}</span>
                          <span>📱 {p.mobile}</span>
                        </div>
                        <p className="text-[10px] text-[#9aab9e] mt-1">Registered: {fmtDT(p.registeredAt)}</p>
                      </div>

                      <div className="flex flex-col gap-2 shrink-0">
                        {p.verificationStatus === 'Pending' && (<>
                          <button
                            onClick={() => updatePlayerStatus(p.id, 'Verified')}
                            className="flex items-center gap-1 rounded-xl bg-[#1E7B3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#2d9b4e] transition-colors">
                            <CheckCircle size={12} /> Verify
                          </button>
                          <button
                            onClick={() => updatePlayerStatus(p.id, 'Rejected')}
                            className="flex items-center gap-1 rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-100 transition-colors">
                            <XCircle size={12} /> Reject
                          </button>
                        </>)}
                        {p.verificationStatus === 'Verified' && (
                          <button
                            onClick={() => updatePlayerStatus(p.id, 'Pending')}
                            className="flex items-center gap-1 rounded-xl border border-[#d9ded2] px-4 py-2 text-xs font-semibold text-[#9aab9e] hover:border-amber-300 hover:text-amber-600 transition-colors">
                            ↩ Revert
                          </button>
                        )}
                        {p.verificationStatus === 'Rejected' && (
                          <button
                            onClick={() => updatePlayerStatus(p.id, 'Pending')}
                            className="flex items-center gap-1 rounded-xl border border-[#d9ded2] px-4 py-2 text-xs font-semibold text-[#9aab9e] hover:border-amber-300 hover:text-amber-600 transition-colors">
                            ↩ Revert
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl border-2 border-dashed border-[#d9ded2] bg-white">
                <Users size={36} className="text-[#d9ded2]" />
                <p className="font-bold text-[#17352a]">
                  {playerFilter === 'All' ? 'No player registrations yet' : `No ${playerFilter} players`}
                </p>
                <p className="text-xs text-[#9aab9e] text-center max-w-xs">
                  {playerFilter === 'All'
                    ? 'Player registrations will appear here once Phase 1 gets submissions.'
                    : `No players with ${playerFilter} status right now.`}
                </p>
              </div>
            );
            })()}
          </div>
        )}

        {/* ── TAB: Overview / Stats ── */}
        {tab === 'stats' && (
          <div className="space-y-6">

            {/* Phase progress */}
            <div className="rounded-2xl border border-[#d9ded2] bg-white p-6">
              <h3 className="font-extrabold text-[#17352a] mb-4">Tournament Progress</h3>
              <div className="flex items-center gap-0">
                {phases.map((p, i) => (
                  <div key={p.n} className="flex items-center flex-1">
                    <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm border-2 font-bold',
                      p.status === 'active'    && 'border-[#1E7B3B] bg-[#1E7B3B]/10 text-[#1E7B3B]',
                      p.status === 'completed' && 'border-blue-400 bg-blue-500 text-white',
                      p.status === 'pending'   && 'border-[#d9ded2] bg-white text-[#d9ded2]',
                    )}>
                      {p.status === 'completed' ? <Check size={14} /> : p.n}
                    </div>
                    {i < phases.length - 1 && (
                      <div className={cn('flex-1 h-0.5', p.status === 'completed' ? 'bg-blue-400' : 'bg-[#d9ded2]')} />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex gap-0">
                {phases.map((p) => (
                  <div key={p.n} className="flex-1 text-center">
                    <p className={cn('text-[9px] font-semibold leading-tight',
                      p.status === 'active' ? 'text-[#1E7B3B]' : 'text-[#9aab9e]')}>
                      {p.label.split(' ').slice(0, 2).join(' ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Village breakdown */}
            <div className="rounded-2xl border border-[#d9ded2] bg-white p-6">
              <h3 className="font-extrabold text-[#17352a] mb-4">Village Registration Breakdown</h3>
              {['Arikarevula','Balabhadrapuram','Biccavolu','Illapalle','Kapavaram','Komaripalem',
                'Konkuduru','Melluru','Pandalapaka','Rallakhandrika','Rangapuram','Thummalapalle','Tossipudi','Voolapalle'
              ].map((village) => {
                const vPlayers = players.filter((p) => p.village === village);
                const verified = vPlayers.filter((p) => p.verificationStatus === 'Verified').length;
                return (
                  <div key={village} className="flex items-center gap-3 py-2 border-b border-[#f5f3ed] last:border-0">
                    <p className="text-sm font-semibold text-[#17352a] w-40 shrink-0">{village}</p>
                    <div className="flex-1 h-2 rounded-full bg-[#f5f3ed] overflow-hidden">
                      <div className="h-full rounded-full bg-[#1E7B3B]" style={{ width: `${vPlayers.length > 0 ? (verified / vPlayers.length) * 100 : 0}%` }} />
                    </div>
                    <span className="text-xs text-[#5f6d64] w-28 text-right shrink-0">
                      {vPlayers.length} registered · {verified} verified
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Upcoming scheduled phases */}
            <div className="rounded-2xl border border-[#d9ded2] bg-white p-6">
              <h3 className="font-extrabold text-[#17352a] mb-4">Upcoming Scheduled Phases</h3>
              <div className="space-y-3">
                {phases.filter((p) => p.status === 'pending').map((p) => (
                  <div key={p.n} className="flex items-center gap-3 rounded-xl bg-[#f5f3ed] px-4 py-3">
                    <span className="text-lg">{p.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#17352a]">Phase {p.n}: {p.label}</p>
                      <p className="text-xs text-[#9aab9e]">{fmtDT(p.scheduledDate)}</p>
                    </div>
                    {p.autoActivate ? (
                      <span className="rounded-full bg-[#1E7B3B]/10 px-2.5 py-1 text-[10px] font-bold text-[#1E7B3B]">Auto</span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-700">Manual</span>
                    )}
                    <button
                      onClick={() => setConfirmActivate(p.n)}
                      className="flex items-center gap-1 rounded-xl bg-[#1E7B3B] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#2d9b4e] transition-colors">
                      <Play size={10} /> Activate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
