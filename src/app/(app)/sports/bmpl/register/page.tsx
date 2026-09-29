'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, CheckCircle, Clock, Lock, RefreshCw, Upload } from 'lucide-react';
import { getUser } from '@/lib/auth';
import { BMPL_REG_KEY, loadBmplRegistration, type BmplRegistration } from '@/lib/bmplRegistration';

function saveBmplRegistration(reg: BmplRegistration) {
  localStorage.setItem(BMPL_REG_KEY, JSON.stringify(reg));
}

const BMPL_VILLAGES = [
  'Arikarevula', 'Balabhadrapuram', 'Biccavolu', 'Illapalle',
  'Kapavaram', 'Komaripalem', 'Konkuduru', 'Melluru',
  'Pandalapaka', 'Rallakhandrika', 'Rangapuram', 'Thummalapalle',
  'Tossipudi', 'Voolapalle',
];

type Step = 1 | 2 | 3 | 4 | 5;

const STEPS = [
  { n: 1, label: 'Verify Mobile' },
  { n: 2, label: 'Player Details' },
  { n: 3, label: 'Aadhaar' },
  { n: 4, label: 'Pay & Submit' },
  { n: 5, label: 'Done' },
];

const CAPTCHA_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function generateCode() {
  return Array.from({ length: 5 }, () => CAPTCHA_CHARS[Math.floor(Math.random() * CAPTCHA_CHARS.length)]).join('');
}

export default function BMPLRegisterPage() {
  const router = useRouter();
  const accountUser = getUser();
  const accountPhone = accountUser?.phone ?? '';

  const [existingReg, setExistingReg] = useState<BmplRegistration | null>(null);
  const [step, setStep] = useState<Step>(1);

  useEffect(() => {
    setExistingReg(loadBmplRegistration());
  }, []);
  const [captchaCode, setCaptchaCode] = useState(() => generateCode());
  const [captchaInput, setCaptchaInput] = useState('');

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    mobile: accountPhone,
    name: '', age: '', village: '', role: '',
    photo: false,
    aadhaarFront: false, aadhaarBack: false,
  });

  function set(k: string, v: string | boolean) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const refreshCaptcha = useCallback(() => {
    setCaptchaCode(generateCode());
    setCaptchaInput('');
  }, []);

  /* Step indicator */
  function StepBar() {
    return (
      <div className="flex items-center gap-0 mb-8">
        {STEPS.filter(s => s.n < 5).map((s, i, arr) => (
          <div key={s.n} className="flex items-center">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${step > s.n ? 'bg-[#1E7B3B] text-white' : step === s.n ? 'bg-[#1E7B3B]/10 border-2 border-[#1E7B3B] text-[#1E7B3B]' : 'bg-[#f5f3ed] text-[#9aab9e]'}`}>
              {step > s.n ? <CheckCircle size={14} /> : s.n}
            </div>
            {i < arr.length - 1 && (
              <div className={`h-0.5 w-8 ${step > s.n ? 'bg-[#1E7B3B]' : 'bg-[#d9ded2]'}`} />
            )}
          </div>
        ))}
      </div>
    );
  }

  const captchaMatch = captchaInput.toUpperCase() === captchaCode;

  /* ── Already registered screen ── */
  if (existingReg && step < 5) {
    const statusMap = {
      Pending:  { color: 'bg-amber-100 text-amber-700',  icon: '⏳', label: 'Pending Verification' },
      Verified: { color: 'bg-green-100 text-green-700',  icon: '✅', label: 'Verified' },
      Rejected: { color: 'bg-red-100 text-red-600',      icon: '❌', label: 'Rejected' },
    };
    const s = statusMap[existingReg.status];
    return (
      <div className="mx-auto max-w-lg px-4 py-10 lg:px-6">
        <div className="rounded-3xl border border-[#d9ded2] bg-white overflow-hidden">
          {/* Status banner */}
          <div className={`px-6 py-5 flex items-center gap-3 ${existingReg.status === 'Verified' ? 'bg-[#1E7B3B]/5 border-b border-[#1E7B3B]/15' : existingReg.status === 'Rejected' ? 'bg-red-50 border-b border-red-100' : 'bg-amber-50 border-b border-amber-100'}`}>
            <span className="text-3xl">{s.icon}</span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.08em] text-[#9aab9e]">My BMPL 2027 Registration</p>
              <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-bold ${s.color}`}>{s.label}</span>
            </div>
          </div>

          {/* Player details */}
          <div className="px-6 py-5 space-y-3">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#0a2016] overflow-hidden border-2 border-[#1E7B3B]/30">
                {existingReg.photoUrl
                  ? <img src={existingReg.photoUrl} alt="player" className="h-full w-full object-cover" />
                  : <span className="text-xl font-black text-white/80">{existingReg.name[0]}</span>}
              </div>
              <div>
                <p className="font-extrabold text-[#17352a] text-lg">{existingReg.name}</p>
                <p className="text-sm text-[#5f6d64]">{existingReg.village} · {existingReg.role} · Age {existingReg.age}</p>
              </div>
            </div>
            {[
              ['Registration ID', existingReg.registrationId],
              ['Mobile', existingReg.mobile],
              ['Submitted', new Date(existingReg.submittedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-[#f5f3ed] last:border-0">
                <span className="text-xs font-semibold text-[#9aab9e] uppercase tracking-[0.06em]">{label}</span>
                <span className="text-sm font-semibold text-[#17352a]">{val}</span>
              </div>
            ))}
          </div>

          {/* Status explanation */}
          <div className="mx-6 mb-5 rounded-2xl bg-[#f5f3ed] p-4">
            {existingReg.status === 'Pending' && (
              <>
                <p className="text-xs font-bold text-[#17352a] flex items-center gap-1.5"><Clock size={12} /> What happens next?</p>
                <ul className="mt-2 space-y-1.5">
                  {[
                    'Admin reviews your Aadhaar and village eligibility',
                    'You will be notified via your registered mobile',
                    'Once verified, you enter the auction pool for Nov 15',
                  ].map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#5f6d64]">
                      <span className="shrink-0 font-bold text-[#1E7B3B] mt-0.5">{i + 1}.</span> {t}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {existingReg.status === 'Verified' && (
              <p className="text-xs text-[#1E7B3B] font-semibold">🎉 Congratulations! You are verified and eligible for the player auction on Nov 15, 2027.</p>
            )}
            {existingReg.status === 'Rejected' && (
              <p className="text-xs text-red-600 font-semibold">Your registration was not approved. Contact the tournament organizer for details.</p>
            )}
          </div>

          <div className="px-6 pb-6 flex flex-col gap-3">
            <button onClick={() => router.push('/sports/bmpl')}
              className="w-full h-11 rounded-xl bg-[#1E7B3B] font-bold text-white text-sm hover:bg-[#2d9b4e] transition-colors">
              Back to BMPL
            </button>
            <button onClick={() => router.push('/sports/bmpl/auction')}
              className="w-full h-11 rounded-xl border border-[#d9ded2] font-semibold text-[#17352a] text-sm hover:bg-[#f5f3ed] transition-colors">
              View Auction Pool
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Step 1: CAPTCHA Verification ── */
  if (step === 1) return (
    <div className="mx-auto max-w-lg px-4 py-6 lg:px-6">
      <button onClick={() => router.back()} className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#5f6d64] hover:text-[#17352a]">
        <ArrowLeft size={15} /> Back
      </button>
      <StepBar />
      <h2 className="text-xl font-extrabold text-[#17352a] mb-1">Verify Your Mobile Number</h2>
      <p className="text-sm text-[#5f6d64] mb-6">Confirm your registered mobile and complete the security check.</p>

      <div className="rounded-2xl border border-[#d9ded2] bg-white p-6 space-y-5">

        {/* Locked mobile field */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-[#5f6d64]">Mobile Number</label>
          <div className="flex items-center rounded-xl border border-[#d9ded2] bg-[#f5f3ed] px-4 py-3 gap-2 cursor-not-allowed">
            <Lock size={13} className="text-[#9aab9e] shrink-0" />
            <span className="flex-1 text-sm font-semibold text-[#17352a] tracking-wide">{accountPhone || '—'}</span>
            <span className="text-[10px] font-bold text-[#9aab9e] uppercase">Account Number</span>
          </div>
        </div>

        {/* CAPTCHA display */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-[0.08em] text-[#5f6d64]">Security Code *</label>
            <button
              type="button"
              onClick={refreshCaptcha}
              className="flex items-center gap-1 text-xs font-semibold text-[#1E7B3B] hover:underline"
            >
              <RefreshCw size={11} /> New Code
            </button>
          </div>

          {/* CAPTCHA image */}
          <div
            className="relative flex items-center justify-center gap-2 rounded-xl overflow-hidden select-none"
            style={{ background: 'linear-gradient(135deg, #0a2016 0%, #17352a 60%, #0d2a1c 100%)', height: '80px' }}
          >
            {/* dot grid noise */}
            <div className="absolute inset-0 z-0" style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
              backgroundSize: '10px 10px',
            }} />
            {/* diagonal lines */}
            <svg className="absolute inset-0 w-full h-full z-0" preserveAspectRatio="none">
              {[0,1,2,3,4,5,6,7].map((i) => (
                <line key={i}
                  x1={`${(i * 14) % 110 - 5}%`} y1="0%"
                  x2={`${(i * 14 + 20) % 110}%`} y2="100%"
                  stroke="rgba(255,255,255,0.06)" strokeWidth="1.5"
                />
              ))}
              {[1,2,3].map((i) => (
                <line key={`h${i}`}
                  x1="0%" y1={`${i * 25}%`}
                  x2="100%" y2={`${i * 25 + (i % 2 === 0 ? 8 : -8)}%`}
                  stroke="rgba(245,158,11,0.07)" strokeWidth="1"
                />
              ))}
            </svg>
            {/* characters */}
            {captchaCode.split('').map((char, i) => {
              const colors = ['#F59E0B', '#4ade80', '#60a5fa', '#f472b6', '#a78bfa'];
              const rotations = [-10, 7, -6, 13, -8];
              const offsets = [3, -4, 5, -2, 4];
              return (
                <span
                  key={i}
                  className="relative z-10 text-3xl font-black"
                  style={{
                    color: colors[i],
                    transform: `rotate(${rotations[i]}deg) translateY(${offsets[i]}px)`,
                    textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                    fontFamily: '"Courier New", Courier, monospace',
                    lineHeight: 1,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        {/* CAPTCHA input */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-[#5f6d64]">
            Enter the code above *
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Type the 5-character code"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value.toUpperCase().slice(0, 5))}
              className={`w-full rounded-xl border px-4 py-3 text-sm font-bold tracking-[0.2em] text-[#17352a] placeholder:font-normal placeholder:tracking-normal outline-none transition-colors
                ${captchaInput.length === 5
                  ? captchaMatch
                    ? 'border-[#1E7B3B] bg-green-50 focus:ring-2 focus:ring-[#1E7B3B]/10'
                    : 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-400/10'
                  : 'border-[#d9ded2] bg-[#fafaf9] focus:border-[#1E7B3B] focus:ring-2 focus:ring-[#1E7B3B]/10'
                }`}
            />
            {captchaInput.length === 5 && (
              <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold ${captchaMatch ? 'text-[#1E7B3B]' : 'text-red-500'}`}>
                {captchaMatch ? '✓' : '✗'}
              </span>
            )}
          </div>
          {captchaInput.length === 5 && !captchaMatch && (
            <p className="mt-1.5 text-xs text-red-600 font-medium">
              Code does not match.{' '}
              <button type="button" onClick={refreshCaptcha} className="underline">Get a new code</button>
            </p>
          )}
        </div>
      </div>

      <button
        onClick={() => setStep(2)}
        disabled={!captchaMatch}
        className="mt-5 w-full h-12 rounded-xl bg-[#1E7B3B] font-bold text-white hover:bg-[#2d9b4e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Verify & Continue
      </button>
    </div>
  );

  /* ── Step 2: Player Details ── */
  if (step === 2) return (
    <div className="mx-auto max-w-lg px-4 py-6 lg:px-6">
      <button onClick={() => setStep(1)} className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#5f6d64] hover:text-[#17352a]"><ArrowLeft size={15} /> Back</button>
      <StepBar />
      <h2 className="text-xl font-extrabold text-[#17352a] mb-1">Player Details</h2>
      <p className="text-sm text-[#5f6d64] mb-6">Only players from Biccavolu Mandal are eligible.</p>

      <div className="rounded-2xl border border-[#d9ded2] bg-white p-6 space-y-5">

        {/* ── Player Photo (Mandatory) ── */}
        <div className="flex flex-col items-center gap-3 pb-4 border-b border-[#f5f3ed]">
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const blobUrl = URL.createObjectURL(file);
                setPhotoPreview(blobUrl);
                set('photo', true);
                const reader = new FileReader();
                reader.onload = (ev) => setPhotoBase64(ev.target?.result as string ?? null);
                reader.readAsDataURL(file);
              }
            }}
          />
          <div
            onClick={() => photoInputRef.current?.click()}
            className={`relative flex h-28 w-28 cursor-pointer items-center justify-center rounded-full border-4 transition-all overflow-hidden
              ${form.photo ? 'border-[#1E7B3B]' : 'border-dashed border-[#d9ded2] bg-[#f5f3ed] hover:border-[#1E7B3B]/40'}`}
          >
            {photoPreview ? (
              <img src={photoPreview} alt="preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Camera size={28} className="text-[#9aab9e]" />
                <span className="text-[9px] text-[#9aab9e] font-semibold">TAP TO ADD</span>
              </div>
            )}
            {form.photo && (
              <div className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#1E7B3B] border-2 border-white">
                <CheckCircle size={14} className="text-white" />
              </div>
            )}
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-[#17352a]">
              {form.photo ? '✅ Photo Added' : 'Player Photo *'}
            </p>
            <p className="text-xs text-[#9aab9e]">Clear face photo · JPG or PNG · Required</p>
          </div>
          {!form.photo && (
            <span className="rounded-full bg-red-50 border border-red-200 px-3 py-1 text-[10px] font-bold text-red-600">
              ⚠ No photo = no registration
            </span>
          )}
        </div>

        <TF label="Full Name *" placeholder="As per Aadhaar" value={form.name} onChange={(v) => set('name', v)} required />
        <TF label="Age *" placeholder="Your age" value={form.age} onChange={(v) => set('age', v.replace(/\D/g, '').slice(0, 2))} type="tel" required />

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#5f6d64]">Village * <span className="font-normal normal-case text-[#9aab9e]">(must be in Biccavolu Mandal)</span></label>
          <select
            value={form.village}
            onChange={(e) => set('village', e.target.value)}
            required
            className="w-full rounded-xl border border-[#d9ded2] bg-[#fafaf9] px-4 py-3 text-sm text-[#17352a] outline-none focus:border-[#1E7B3B] focus:ring-2 focus:ring-[#1E7B3B]/10"
          >
            <option value="">Select your village</option>
            {BMPL_VILLAGES.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#5f6d64]">Playing Role *</label>
          <div className="grid grid-cols-2 gap-2">
            {[['🏏', 'Batsman'], ['⚾', 'Bowler'], ['⭐', 'All Rounder'], ['🧤', 'Wicket Keeper']].map(([e, r]) => (
              <button key={r} type="button" onClick={() => set('role', r)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${form.role === r ? 'border-[#1E7B3B] bg-[#1E7B3B]/10 text-[#1E7B3B]' : 'border-[#d9ded2] text-[#5f6d64] hover:border-[#1E7B3B]/40'}`}>
                {e} {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={() => setStep(3)} disabled={!form.photo || !form.name || !form.age || !form.village || !form.role}
        className="mt-5 w-full h-12 rounded-xl bg-[#1E7B3B] font-bold text-white hover:bg-[#2d9b4e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
        Continue
      </button>
    </div>
  );

  /* ── Step 3: Aadhaar Upload ── */
  if (step === 3) return (
    <div className="mx-auto max-w-lg px-4 py-6 lg:px-6">
      <button onClick={() => setStep(2)} className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#5f6d64] hover:text-[#17352a]"><ArrowLeft size={15} /> Back</button>
      <StepBar />
      <h2 className="text-xl font-extrabold text-[#17352a] mb-1">Aadhaar Verification</h2>
      <p className="text-sm text-[#5f6d64] mb-6">Upload both sides of your Aadhaar card. This verifies your identity and village eligibility.</p>

      <div className="space-y-4">
        {[
          { key: 'aadhaarFront', label: 'Aadhaar Front', hint: 'Side with photo and name' },
          { key: 'aadhaarBack',  label: 'Aadhaar Back',  hint: 'Side with address' },
        ].map(({ key, label, hint }) => (
          <div key={key}
            onClick={() => set(key, true)}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all ${(form as any)[key] ? 'border-[#1E7B3B] bg-[#1E7B3B]/5' : 'border-[#d9ded2] hover:border-[#1E7B3B]/40'}`}
          >
            {(form as any)[key] ? (
              <div className="flex items-center justify-center gap-2 text-[#1E7B3B]">
                <CheckCircle size={20} />
                <span className="font-bold text-sm">{label} Uploaded</span>
              </div>
            ) : (
              <>
                <Upload size={24} className="mx-auto mb-2 text-[#9aab9e]" />
                <p className="font-semibold text-sm text-[#17352a]">Upload {label}</p>
                <p className="text-xs text-[#9aab9e] mt-0.5">{hint}</p>
                <p className="text-[10px] text-[#9aab9e] mt-1">JPG, PNG up to 5MB</p>
              </>
            )}
          </div>
        ))}

        <div className="rounded-xl bg-[#f5f3ed] px-4 py-3 text-xs text-[#5f6d64]">
          <strong className="text-[#17352a]">Privacy:</strong> Your Aadhaar is used only for village eligibility verification and will not be shared publicly.
        </div>
      </div>

      <button onClick={() => setStep(4)} disabled={!form.aadhaarFront || !form.aadhaarBack}
        className="mt-5 w-full h-12 rounded-xl bg-[#1E7B3B] font-bold text-white hover:bg-[#2d9b4e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
        Continue
      </button>
    </div>
  );

  /* ── Step 4: Review & Pay ── */
  if (step === 4) return (
    <div className="mx-auto max-w-lg px-4 py-6 lg:px-6">
      <button onClick={() => setStep(3)} className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#5f6d64] hover:text-[#17352a]"><ArrowLeft size={15} /> Back</button>
      <StepBar />
      <h2 className="text-xl font-extrabold text-[#17352a] mb-1">Review & Pay</h2>
      <p className="text-sm text-[#5f6d64] mb-6">Review your details and pay the registration fee to enter the auction pool.</p>

      <div className="rounded-2xl border border-[#d9ded2] bg-white p-5 mb-4">
        {/* Photo preview */}
        <div className="flex items-center gap-4 pb-4 mb-4 border-b border-[#f5f3ed]">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#0a2016] overflow-hidden border-2 border-[#1E7B3B]/30">
            {photoPreview
              ? <img src={photoPreview} alt="player" className="h-full w-full object-cover" />
              : <span className="text-xl font-black text-white/80">{form.name[0]}</span>}
          </div>
          <div>
            <p className="font-bold text-[#17352a]">{form.name}</p>
            <p className="text-xs text-[#9aab9e]">{form.village} · Age {form.age}</p>
            <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-[9px] font-bold text-green-700">📸 Photo Added</span>
          </div>
        </div>
        <div className="space-y-3">
          {[
            ['Role', form.role], ['Mobile', form.mobile],
          ].map(([label, val]) => (
            <div key={label} className="flex items-center justify-between py-1.5 border-b border-[#f5f3ed] last:border-0">
              <span className="text-xs text-[#9aab9e] uppercase tracking-[0.06em] font-semibold">{label}</span>
              <span className="text-sm font-semibold text-[#17352a]">{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#1E7B3B]/20 bg-[#1E7B3B]/5 p-5 mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-[#5f6d64]">Registration Fee</span>
          <span className="font-bold text-[#17352a]">₹10</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-[#1E7B3B]/10">
          <span className="font-bold text-[#17352a]">Total</span>
          <span className="text-lg font-extrabold text-[#1E7B3B]">₹10</span>
        </div>
      </div>

      <button onClick={() => {
          const reg: BmplRegistration = {
            registrationId: `BMPL-${Math.floor(1000 + Math.random() * 9000)}`,
            name: form.name,
            village: form.village,
            role: form.role,
            age: form.age,
            mobile: form.mobile,
            submittedAt: new Date().toISOString(),
            status: 'Pending',
            photoUrl: photoBase64 ?? undefined,
          };
          saveBmplRegistration(reg);
          setExistingReg(reg);
          setStep(5);
        }}
        className="w-full h-12 rounded-xl bg-[#1E7B3B] font-bold text-white hover:bg-[#2d9b4e] transition-colors">
        Pay ₹10 & Submit Application
      </button>
      <p className="mt-2 text-center text-[10px] text-[#9aab9e]">Secure payment · UPI / Card / Net Banking</p>
    </div>
  );

  /* ── Step 5: Success ── */
  return (
    <div className="mx-auto max-w-lg px-4 py-12 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#1E7B3B]/10 text-4xl">🏏</div>
      <h2 className="mt-5 text-2xl font-extrabold text-[#17352a]">Application Submitted!</h2>
      <p className="mt-2 text-[#5f6d64]">
        Welcome to BMPL 2027, <strong>{form.name}</strong>. Your application is under review.
      </p>

      {/* Registration ID + Status */}
      <div className="mt-5 rounded-2xl border-2 border-[#1E7B3B]/20 bg-white px-5 py-4 space-y-2 text-left">
        <div className="flex items-center justify-between pb-2 border-b border-[#f5f3ed]">
          <span className="text-xs font-semibold text-[#9aab9e] uppercase tracking-[0.06em]">Registration ID</span>
          <span className="text-base font-extrabold text-[#17352a]">{existingReg?.registrationId ?? '—'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#9aab9e] uppercase tracking-[0.06em]">Status</span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">⏳ Pending Verification</span>
        </div>
      </div>

      {/* How to check status */}
      <div className="mt-4 rounded-2xl border border-[#1E7B3B]/20 bg-[#1E7B3B]/5 px-5 py-4 text-left">
        <p className="text-xs font-extrabold text-[#1E7B3B] mb-2">📍 How to check your status later</p>
        <div className="space-y-2">
          <div className="flex items-start gap-2.5 text-xs text-[#5f6d64]">
            <span className="shrink-0 rounded-full bg-[#1E7B3B]/10 px-2 py-0.5 text-[10px] font-bold text-[#1E7B3B]">1</span>
            Go to <strong>Sports → BMPL</strong> — your status card appears at the top of the page
          </div>
          <div className="flex items-start gap-2.5 text-xs text-[#5f6d64]">
            <span className="shrink-0 rounded-full bg-[#1E7B3B]/10 px-2 py-0.5 text-[10px] font-bold text-[#1E7B3B]">2</span>
            Or tap the <strong>Register</strong> tab — it shows this status screen instead of the form
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left space-y-1.5">
        <p className="text-xs font-bold text-amber-900">What happens next?</p>
        {['Admin verifies your Aadhaar and village eligibility', 'You receive approval notification via mobile', 'Verified players join the auction pool', 'Auction on Nov 15, 2027 · Biccavolu Ground · 9 AM'].map((s, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-amber-800">
            <span className="shrink-0 mt-0.5 font-bold text-amber-600">{i + 1}.</span> {s}
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button onClick={() => router.push('/sports/bmpl')}
          className="w-full h-11 rounded-xl bg-[#1E7B3B] font-bold text-white text-sm hover:bg-[#2d9b4e] transition-colors">
          View My Status on BMPL Overview →
        </button>
        <button onClick={() => router.push('/sports/bmpl/auction')}
          className="w-full h-11 rounded-xl border border-[#d9ded2] font-semibold text-[#17352a] text-sm hover:bg-[#f5f3ed] transition-colors">
          View Auction Pool
        </button>
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
