'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, Eye, EyeOff, Lock, MapPin, Phone, RefreshCw, User } from 'lucide-react';
import { LogoMark } from '@/components/LogoMark';
import { api } from '@/lib/api';
import { saveAuth } from '@/lib/auth';
import { validatePhone, validatePassword } from '@/lib/utils';
import type { District, Mandal, Village, RegisterPayload, AuthResponse } from '@/types';

function newCaptcha() {
  return { a: Math.floor(Math.random() * 9) + 1, b: Math.floor(Math.random() * 9) + 1 };
}

export default function RegisterPage() {
  const router = useRouter();

  const [phone, setPhone]                     = useState('');
  const [username, setUsername]               = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [captcha, setCaptcha]                 = useState({ a: 4, b: 3 });
  const [captchaInput, setCaptchaInput]       = useState('');
  const [errors, setErrors]                   = useState<Record<string, string>>({});
  const [serverError, setServerError]         = useState('');
  const [loading, setLoading]                 = useState(false);

  // Location cascades
  const [districts, setDistricts]   = useState<District[]>([]);
  const [mandals, setMandals]       = useState<Mandal[]>([]);
  const [villages, setVillages]     = useState<Village[]>([]);
  const [districtId, setDistrictId] = useState('');
  const [mandalId, setMandalId]     = useState('');
  const [villageId, setVillageId]   = useState('');

  useEffect(() => {
    setCaptcha(newCaptcha());
    api.districts().then(setDistricts).catch(() => {});
  }, []);

  useEffect(() => {
    setMandalId(''); setMandals([]); setVillageId(''); setVillages([]);
    if (districtId) api.mandals(Number(districtId)).then(setMandals).catch(() => {});
  }, [districtId]);

  useEffect(() => {
    setVillageId(''); setVillages([]);
    if (mandalId) api.villages(Number(mandalId)).then(setVillages).catch(() => {});
  }, [mandalId]);

  const strength = validatePassword(password);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!validatePhone(phone))              errs.phone           = 'Enter a valid 10-digit mobile number';
    if (username.length < 4)               errs.username        = 'At least 4 characters required';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) errs.username        = 'Only letters, numbers and underscore allowed';
    if (password.length < 8)               errs.password        = 'At least 8 characters required';
    if (password !== confirmPassword)      errs.confirmPassword = 'Passwords do not match';
    if (!districtId)                       errs.district        = 'Select your district';
    if (!mandalId)                         errs.mandal          = 'Select your mandal';
    if (!villageId)                        errs.village         = 'Select your village';
    if (parseInt(captchaInput) !== captcha.a + captcha.b) {
      errs.captcha = 'Incorrect answer, please try again';
      setCaptcha(newCaptcha()); setCaptchaInput('');
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const payload: RegisterPayload = {
        username, phone, password,
        districtId: Number(districtId),
        mandalId: Number(mandalId),
        villageId: Number(villageId),
      };
      const res = await api.register(payload) as AuthResponse;
      saveAuth(res.token, res.user);
      router.push('/home');
    } catch (err) {
      const msg = (err as Error).message || '';
      setServerError(
        msg.toLowerCase().includes('phone') || msg.toLowerCase().includes('exist')
          ? 'This phone number is already registered. Please login.'
          : msg.toLowerCase().includes('username')
          ? 'This username is taken. Please choose another.'
          : msg || 'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-dvh flex flex-col items-center px-4 py-10 sm:py-16">
      <div className="landing-hero-image fixed inset-0 -z-10" />
      <div className="landing-hero-shade fixed inset-0 -z-10" />

      <div className="w-full max-w-[480px] mb-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors">
          <ArrowLeft size={15} /> Back to Home
        </Link>
      </div>

      <div className="w-full max-w-[480px] rounded-3xl bg-white shadow-2xl shadow-black/30 overflow-hidden">

        <div className="px-8 pt-8 pb-6 border-b border-gray-100">
          <Link href="/" className="inline-flex items-center gap-2 mb-5">
            <LogoMark className="h-8 w-auto" />
            <span className="text-base font-bold text-[#17352a] tracking-[-0.02em]">Local Connect</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#17352a] tracking-[-0.03em]">Create Your Account</h1>
          <p className="mt-1.5 text-sm text-[#5f6d64]">Join Local Connect and explore everything around you.</p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">

          {/* Phone */}
          <Field label="Mobile Number" error={errors.phone}>
            <FieldInput
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              icon={<Phone size={15} />}
              inputMode="numeric"
              type="tel"
              autoComplete="tel"
            />
          </Field>

          {/* Username */}
          <Field label="Username" error={errors.username}>
            <FieldInput
              placeholder="Letters, numbers and underscore"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              icon={<User size={15} />}
              autoComplete="username"
            />
          </Field>

          {/* Password */}
          <Field label="Password" error={errors.password}>
            <FieldInput
              type={showPassword ? 'text' : 'password'}
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={15} />}
              autoComplete="new-password"
              suffix={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#9aab9e] hover:text-[#5f6d64] transition-colors">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />
            {password && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                      style={{ backgroundColor: i <= strength.score ? strength.color : '#E5E7EB' }} />
                  ))}
                </div>
                <p className="text-xs font-medium" style={{ color: strength.color }}>{strength.label}</p>
              </div>
            )}
          </Field>

          {/* Confirm password */}
          <Field label="Confirm Password" error={errors.confirmPassword}>
            <FieldInput
              type={showConfirm ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock size={15} />}
              autoComplete="new-password"
              suffix={
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-[#9aab9e] hover:text-[#5f6d64] transition-colors">
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />
          </Field>

          {/* Location — District → Mandal → Village */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#5f6d64] flex items-center gap-1.5">
              <MapPin size={12} /> Your Location
            </p>

            <Field label="District" error={errors.district}>
              <SelectInput
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
                disabled={districts.length === 0}
              >
                <option value="">Select district</option>
                {districts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </SelectInput>
            </Field>

            <Field label="Mandal" error={errors.mandal}>
              <SelectInput
                value={mandalId}
                onChange={(e) => setMandalId(e.target.value)}
                disabled={!districtId || mandals.length === 0}
              >
                <option value="">Select mandal</option>
                {mandals.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </SelectInput>
            </Field>

            <Field label="Village" error={errors.village}>
              <SelectInput
                value={villageId}
                onChange={(e) => setVillageId(e.target.value)}
                disabled={!mandalId || villages.length === 0}
              >
                <option value="">Select village</option>
                {villages.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
              </SelectInput>
            </Field>
          </div>

          {/* Captcha */}
          <Field label={`Verify you're human — what is ${captcha.a} + ${captcha.b}?`} error={errors.captcha}>
            <div className="flex gap-2">
              <FieldInput
                placeholder="Enter answer"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value.replace(/\D/g, ''))}
                inputMode="numeric"
                autoComplete="off"
              />
              <button
                type="button"
                onClick={() => { setCaptcha(newCaptcha()); setCaptchaInput(''); }}
                className="shrink-0 flex items-center justify-center w-11 rounded-xl border border-[#d9ded2] text-[#5f6d64] hover:text-[#17352a] hover:border-[#17352a]/40 transition-colors"
                title="New question"
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </Field>

          {serverError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[#1E7B3B] font-bold text-white transition-all hover:bg-[#2d9b4e] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading
              ? <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              : 'Create Account'}
          </button>

          <p className="text-center text-sm text-[#5f6d64] pb-2">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-[#1E7B3B] hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </main>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#5f6d64]">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function FieldInput({ icon, suffix, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode; suffix?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-[#d9ded2] bg-[#fafaf9] px-4 py-3 transition-all focus-within:border-[#1E7B3B] focus-within:ring-2 focus-within:ring-[#1E7B3B]/10">
      {icon && <span className="shrink-0 text-[#9aab9e]">{icon}</span>}
      <input className="flex-1 bg-transparent text-sm text-[#17352a] placeholder:text-[#bcc5be] outline-none" {...props} />
      {suffix}
    </div>
  );
}

function SelectInput({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className="w-full appearance-none rounded-xl border border-[#d9ded2] bg-[#fafaf9] px-4 py-3 pr-10 text-sm text-[#17352a] outline-none transition-all focus:border-[#1E7B3B] focus:ring-2 focus:ring-[#1E7B3B]/10 disabled:opacity-50 disabled:cursor-not-allowed"
        {...props}
      >
        {children}
      </select>
      <ChevronDown size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9aab9e] pointer-events-none" />
    </div>
  );
}
