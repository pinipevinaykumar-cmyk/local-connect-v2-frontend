'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';

type Step = 'choose' | 'import' | 'fresh' | 'done';
type Role = 'Batsman' | 'Bowler' | 'All Rounder' | 'Wicket Keeper' | '';

const ROLE_ICONS: Record<string, string> = {
  'Batsman': '🏏',
  'Bowler': '⚾',
  'All Rounder': '⭐',
  'Wicket Keeper': '🧤',
};

export default function CreatePlayerPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('choose');
  const [importUrl, setImportUrl] = useState('');
  const [form, setForm] = useState({
    name: '', village: '', age: '', role: '' as Role, phone: '',
  });

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  /* ── Choose screen ─────────────────────────────── */
  if (step === 'choose') {
    return (
      <div className="mx-auto max-w-lg px-4 py-8 lg:px-6">
        <button onClick={() => router.back()} className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#5f6d64] hover:text-[#17352a] transition-colors">
          <ArrowLeft size={15} /> Back
        </button>

        <div className="text-center mb-8">
          <span className="text-5xl">🏏</span>
          <h2 className="mt-3 text-2xl font-extrabold text-[#17352a]">Register As A Player</h2>
          <p className="mt-1.5 text-sm text-[#5f6d64]">Do you have an existing cricket profile?</p>
        </div>

        <div className="space-y-3">
          {/* Import */}
          <button
            onClick={() => setStep('import')}
            className="w-full rounded-2xl border-2 border-[#1E7B3B]/30 bg-white p-5 text-left hover:border-[#1E7B3B] hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1E7B3B]/10 text-2xl group-hover:bg-[#1E7B3B]/15 transition-colors">
                🔗
              </div>
              <div>
                <p className="font-bold text-[#17352a]">Import Existing Profile</p>
                <p className="mt-0.5 text-xs text-[#5f6d64]">Link your CricHeroes or other cricket profile URL. Your stats will sync once integration is live.</p>
              </div>
            </div>
          </button>

          {/* Fresh start */}
          <button
            onClick={() => setStep('fresh')}
            className="w-full rounded-2xl border-2 border-[#d9ded2] bg-white p-5 text-left hover:border-[#1E7B3B]/40 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f5f3ed] text-2xl group-hover:bg-[#e3eee2] transition-colors">
                🌟
              </div>
              <div>
                <p className="font-bold text-[#17352a]">Start Fresh</p>
                <p className="mt-0.5 text-xs text-[#5f6d64]">New player profile. Your career stats will build automatically from every match you play on Local Connect Sports.</p>
              </div>
            </div>
          </button>
        </div>

        {/* Claim existing */}
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-bold text-amber-800 mb-1">Already in a tournament?</p>
          <p className="text-xs text-amber-700">
            If someone added you to a match roster, you can <span className="font-semibold underline cursor-pointer">claim that profile</span> and verify ownership via OTP.
          </p>
        </div>
      </div>
    );
  }

  /* ── Import screen ─────────────────────────────── */
  if (step === 'import') {
    return (
      <div className="mx-auto max-w-lg px-4 py-6 lg:px-6">
        <button onClick={() => setStep('choose')} className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#5f6d64] hover:text-[#17352a] transition-colors">
          <ArrowLeft size={15} /> Back
        </button>

        <h2 className="text-xl font-extrabold text-[#17352a] mb-1">Import Cricket Profile</h2>
        <p className="text-sm text-[#5f6d64] mb-6">Paste your existing cricket profile link. We'll use it to sync your history when the integration is ready.</p>

        <div className="rounded-2xl border border-[#d9ded2] bg-white p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#5f6d64]">
              CricHeroes Profile URL
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-[#d9ded2] bg-[#fafaf9] px-4 py-3">
              <ExternalLink size={14} className="shrink-0 text-[#9aab9e]" />
              <input
                type="url"
                placeholder="https://cricheroes.in/player/..."
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                className="flex-1 bg-transparent text-sm text-[#17352a] placeholder:text-[#bcc5be] outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#5f6d64]">
              Other Cricket Profile URL
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-[#d9ded2] bg-[#fafaf9] px-4 py-3">
              <ExternalLink size={14} className="shrink-0 text-[#9aab9e]" />
              <input
                type="url"
                placeholder="Any other cricket stats page..."
                className="flex-1 bg-transparent text-sm text-[#17352a] placeholder:text-[#bcc5be] outline-none"
              />
            </div>
          </div>

          <div className="rounded-xl bg-[#f5f3ed] px-4 py-3 text-xs text-[#5f6d64]">
            <p className="font-semibold text-[#17352a] mb-0.5">What happens next?</p>
            Your link is saved. When Local Connect Sports integrates with CricHeroes and other platforms, your historical stats will be automatically imported. Until then, stats accumulate from matches scored on this platform.
          </div>
        </div>

        <button
          onClick={() => setStep('fresh')}
          className="mt-5 w-full h-12 rounded-xl bg-[#1E7B3B] font-bold text-white hover:bg-[#2d9b4e] transition-colors"
        >
          Continue → Set Up Profile
        </button>
      </div>
    );
  }

  /* ── Fresh / profile form ──────────────────────── */
  if (step === 'fresh') {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setStep('done');
    };

    return (
      <div className="mx-auto max-w-lg px-4 py-6 lg:px-6">
        <button onClick={() => setStep(importUrl ? 'import' : 'choose')} className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#5f6d64] hover:text-[#17352a] transition-colors">
          <ArrowLeft size={15} /> Back
        </button>

        <h2 className="text-xl font-extrabold text-[#17352a] mb-1">Your Player Profile</h2>
        <p className="text-sm text-[#5f6d64] mb-6">Basic information only — career stats build automatically from matches.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-2xl border border-[#d9ded2] bg-white p-6 space-y-5">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-[#d9ded2] bg-[#f5f3ed] text-3xl">
                {form.name ? form.name[0].toUpperCase() : '🏏'}
              </div>
              <button type="button" className="text-xs font-semibold text-[#1E7B3B] hover:underline">Upload Photo</button>
            </div>

            <TF label="Full Name *"        placeholder="Your name"          value={form.name}    onChange={(v) => set('name', v)}    required />
            <TF label="Village *"          placeholder="Home village"        value={form.village} onChange={(v) => set('village', v)} required />
            <TF label="Age *"              placeholder="e.g. 22"             value={form.age}     onChange={(v) => set('age', v)}     type="number" required />
            <TF label="Phone Number"       placeholder="10-digit number"     value={form.phone}   onChange={(v) => set('phone', v.replace(/\D/g, '').slice(0, 10))} type="tel" />
          </div>

          {/* Role */}
          <div className="rounded-2xl border border-[#d9ded2] bg-white p-6">
            <label className="block mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#5f6d64]">Playing Role *</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Batsman', 'Bowler', 'All Rounder', 'Wicket Keeper'] as const).map((r) => (
                <button
                  key={r} type="button" onClick={() => set('role', r)}
                  className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${form.role === r ? 'border-[#1E7B3B] bg-[#1E7B3B]/10 text-[#1E7B3B]' : 'border-[#d9ded2] text-[#5f6d64] hover:border-[#1E7B3B]/40'}`}
                >
                  <span>{ROLE_ICONS[r]}</span> {r}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-stats notice */}
          <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 flex items-start gap-3">
            <span className="text-2xl mt-0.5">📊</span>
            <div>
              <p className="text-sm font-bold text-green-900">Stats are automatic</p>
              <p className="mt-0.5 text-xs text-green-700">
                Runs, wickets, average, strike rate — everything builds from live matches scored on Local Connect Sports. No manual entry needed or allowed.
              </p>
            </div>
          </div>

          <button type="submit" className="w-full h-12 rounded-xl bg-[#1E7B3B] font-bold text-white hover:bg-[#2d9b4e] transition-colors">
            Create Player Profile
          </button>
        </form>
      </div>
    );
  }

  /* ── Done screen ───────────────────────────────── */
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <span className="text-6xl">🏏</span>
      <h2 className="mt-4 text-2xl font-extrabold text-[#17352a]">Profile Created!</h2>
      <p className="mt-2 text-[#5f6d64]">
        Welcome to Local Connect Sports. Play matches and watch your career stats grow automatically.
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={() => router.push('/sports/players')} className="rounded-full bg-[#1E7B3B] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2d9b4e]">View Players</button>
        <button onClick={() => router.push('/sports/tournaments')} className="rounded-full border border-[#d9ded2] px-5 py-2.5 text-sm font-bold text-[#17352a]">Browse Tournaments</button>
      </div>
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
      <input type={type} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} required={required}
        className="w-full rounded-xl border border-[#d9ded2] bg-[#fafaf9] px-4 py-3 text-sm text-[#17352a] placeholder:text-[#bcc5be] outline-none focus:border-[#1E7B3B] focus:ring-2 focus:ring-[#1E7B3B]/10" />
    </div>
  );
}
