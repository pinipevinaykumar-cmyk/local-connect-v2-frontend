'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function CreateTournamentPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', location: '', mandal: '', district: '', ground: '',
    startDate: '', endDate: '', entryFee: '', prize: '',
    matchType: 'T20', deadline: '', rules: '', maxTeams: '8',
  });
  const [submitted, setSubmitted] = useState(false);

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: POST to /sports/tournaments once backend ready
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <span className="text-6xl">🏆</span>
        <h2 className="mt-4 text-2xl font-extrabold text-[#17352a]">Tournament Created!</h2>
        <p className="mt-2 text-[#5f6d64]">Your tournament has been listed. Share it with players to register teams.</p>
        <div className="mt-6 flex gap-3 justify-center">
          <button onClick={() => router.push('/sports/tournaments')} className="rounded-full bg-[#1E7B3B] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2d9b4e]">
            View Tournaments
          </button>
          <button onClick={() => { setSubmitted(false); setForm({ name: '', location: '', mandal: '', district: '', ground: '', startDate: '', endDate: '', entryFee: '', prize: '', matchType: 'T20', deadline: '', rules: '', maxTeams: '8' }); }} className="rounded-full border border-[#d9ded2] px-5 py-2.5 text-sm font-bold text-[#17352a]">
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 lg:px-6">
      <button onClick={() => router.back()} className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-[#5f6d64] hover:text-[#17352a] transition-colors">
        <ArrowLeft size={15} /> Back
      </button>

      <h2 className="text-xl font-extrabold text-[#17352a] mb-1">Create Tournament</h2>
      <p className="text-sm text-[#5f6d64] mb-6">Fill in the details to publish your tournament.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl border border-[#d9ded2] bg-white p-6 space-y-5">
          <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-[#9aab9e]">Basic Info</h3>

          <TF label="Tournament Name *" placeholder="e.g. Village Premier League 2025" value={form.name} onChange={(v) => set('name', v)} required />
          <div className="grid grid-cols-2 gap-4">
            <TF label="Village *"  placeholder="e.g. Pandalapaka" value={form.location} onChange={(v) => set('location', v)} required />
            <TF label="Mandal"     placeholder="e.g. Biccavolu"   value={form.mandal  ?? ''} onChange={(v) => set('mandal', v)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TF label="District"   placeholder="e.g. East Godavari" value={form.district ?? ''} onChange={(v) => set('district', v)} />
            <TF label="Ground / Venue *" placeholder="e.g. Pandalapaka Ground" value={form.ground} onChange={(v) => set('ground', v)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TF label="Start Date *" type="date" value={form.startDate} onChange={(v) => set('startDate', v)} required />
            <TF label="End Date *" type="date" value={form.endDate} onChange={(v) => set('endDate', v)} required />
          </div>
          <TF label="Registration Deadline *" type="date" value={form.deadline} onChange={(v) => set('deadline', v)} required />
        </div>

        <div className="rounded-2xl border border-[#d9ded2] bg-white p-6 space-y-5">
          <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-[#9aab9e]">Format & Fees</h3>
          <div className="grid grid-cols-3 gap-3">
            {['T20', 'ODI', '10-over', 'Test'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => set('matchType', type)}
                className={`rounded-xl border py-2.5 text-sm font-semibold transition-colors ${form.matchType === type ? 'border-[#1E7B3B] bg-[#1E7B3B]/10 text-[#1E7B3B]' : 'border-[#d9ded2] text-[#5f6d64] hover:border-[#1E7B3B]/40'}`}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TF label="Max Teams" type="number" placeholder="8" value={form.maxTeams} onChange={(v) => set('maxTeams', v)} />
            <TF label="Entry Fee (₹)" type="number" placeholder="500" value={form.entryFee} onChange={(v) => set('entryFee', v)} />
          </div>
          <TF label="Prize Money (₹)" type="number" placeholder="10000" value={form.prize} onChange={(v) => set('prize', v)} />
        </div>

        <div className="rounded-2xl border border-[#d9ded2] bg-white p-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-[#9aab9e] mb-4">Rules & Description</h3>
          <textarea
            rows={4}
            placeholder="Tournament rules, format details, contact info..."
            value={form.rules}
            onChange={(e) => set('rules', e.target.value)}
            className="w-full rounded-xl border border-[#d9ded2] bg-[#fafaf9] px-4 py-3 text-sm text-[#17352a] placeholder:text-[#bcc5be] outline-none focus:border-[#1E7B3B] focus:ring-2 focus:ring-[#1E7B3B]/10 resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full h-12 rounded-xl bg-[#1E7B3B] font-bold text-white hover:bg-[#2d9b4e] transition-colors"
        >
          Publish Tournament
        </button>
      </form>
    </div>
  );
}

function TF({ label, placeholder, value, onChange, type = 'text', required }: {
  label: string; placeholder?: string; value: string;
  onChange: (v: string) => void; type?: string; required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#5f6d64]">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-xl border border-[#d9ded2] bg-[#fafaf9] px-4 py-3 text-sm text-[#17352a] placeholder:text-[#bcc5be] outline-none focus:border-[#1E7B3B] focus:ring-2 focus:ring-[#1E7B3B]/10"
      />
    </div>
  );
}
