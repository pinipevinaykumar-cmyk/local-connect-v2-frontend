'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';

const COLORS = ['#1E7B3B', '#1a4f8a', '#9a3412', '#6d28d9', '#b45309', '#0e7490', '#be185d', '#374151'];

export default function CreateTeamPage() {
  const router = useRouter();
  const [color, setColor] = useState(COLORS[0]);
  const [form, setForm] = useState({ name: '', village: '', captain: '', phone: '' });
  const [players, setPlayers] = useState<string[]>(['']);
  const [submitted, setSubmitted] = useState(false);

  function set(k: string, v: string) { setForm((f) => ({ ...f, [k]: v })); }
  function setPlayer(i: number, v: string) { setPlayers((p) => { const next = [...p]; next[i] = v; return next; }); }
  function addPlayer() { setPlayers((p) => [...p, '']); }
  function removePlayer(i: number) { setPlayers((p) => p.filter((_, idx) => idx !== i)); }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl text-4xl font-black text-white" style={{ background: color }}>
          {form.name[0] ?? '🏏'}
        </div>
        <h2 className="text-2xl font-extrabold text-[#17352a]">Team Created!</h2>
        <p className="mt-2 text-[#5f6d64]">{form.name} is now registered. You can join tournaments and add more players.</p>
        <div className="mt-6 flex gap-3 justify-center">
          <button onClick={() => router.push('/sports/teams')} className="rounded-full bg-[#1E7B3B] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2d9b4e]">View Teams</button>
          <button onClick={() => router.push('/sports/tournaments')} className="rounded-full border border-[#d9ded2] px-5 py-2.5 text-sm font-bold text-[#17352a]">Join Tournament</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6 lg:px-6">
      <button onClick={() => router.back()} className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#5f6d64] hover:text-[#17352a] transition-colors">
        <ArrowLeft size={15} /> Back
      </button>
      <h2 className="text-xl font-extrabold text-[#17352a] mb-1">Create Team</h2>
      <p className="text-sm text-[#5f6d64] mb-6">Build your cricket team and join tournaments.</p>

      <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">

        {/* Team identity */}
        <div className="rounded-2xl border border-[#d9ded2] bg-white p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[#5f6d64]">Team Identity</h3>

          {/* Color + avatar preview */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-black text-white transition-colors" style={{ background: color }}>
              {form.name ? form.name[0].toUpperCase() : '🏏'}
            </div>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className={`h-7 w-7 rounded-full border-2 transition-all ${color === c ? 'border-[#17352a] scale-110' : 'border-transparent'}`}
                  style={{ background: c }} />
              ))}
            </div>
          </div>

          <TF label="Team Name *"     placeholder="e.g. Pandalapaka Tigers"  value={form.name}    onChange={(v) => set('name', v)}    required />
          <TF label="Village / Area"  placeholder="Home village or town"     value={form.village} onChange={(v) => set('village', v)} />
        </div>

        {/* Captain details */}
        <div className="rounded-2xl border border-[#d9ded2] bg-white p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[#5f6d64]">Captain Details</h3>
          <TF label="Captain Name *"   placeholder="Full name"         value={form.captain} onChange={(v) => set('captain', v)} required />
          <TF label="Contact Number *" placeholder="10-digit number"   value={form.phone}   onChange={(v) => set('phone', v.replace(/\D/g, '').slice(0, 10))} type="tel" required />
        </div>

        {/* Players */}
        <div className="rounded-2xl border border-[#d9ded2] bg-white p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-[0.08em] text-[#5f6d64]">Initial Players <span className="font-normal normal-case text-[#9aab9e]">(optional)</span></h3>
            <button type="button" onClick={addPlayer} className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E7B3B] hover:underline">
              <Plus size={12} /> Add Player
            </button>
          </div>
          {players.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={`Player ${i + 1} name`}
                value={p}
                onChange={(e) => setPlayer(i, e.target.value)}
                className="flex-1 rounded-xl border border-[#d9ded2] bg-[#fafaf9] px-4 py-2.5 text-sm text-[#17352a] placeholder:text-[#bcc5be] outline-none focus:border-[#1E7B3B] focus:ring-2 focus:ring-[#1E7B3B]/10"
              />
              {players.length > 1 && (
                <button type="button" onClick={() => removePlayer(i)} className="rounded-lg border border-[#d9ded2] p-2 text-[#9aab9e] hover:text-red-500 hover:border-red-200 transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
          <p className="text-[11px] text-[#9aab9e]">You can add more players after creating the team.</p>
        </div>

        <button type="submit" className="w-full h-12 rounded-xl font-bold text-white transition-colors" style={{ background: color }}>
          Create Team
        </button>
      </form>
    </div>
  );
}

function TF({ label, placeholder, value, onChange, type = 'text', required }: { label: string; placeholder?: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#5f6d64]">{label}</label>
      <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} required={required}
        className="w-full rounded-xl border border-[#d9ded2] bg-[#fafaf9] px-4 py-3 text-sm text-[#17352a] placeholder:text-[#bcc5be] outline-none focus:border-[#1E7B3B] focus:ring-2 focus:ring-[#1E7B3B]/10" />
    </div>
  );
}
