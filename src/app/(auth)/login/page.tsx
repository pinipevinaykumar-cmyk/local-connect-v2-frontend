'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff, Lock, RefreshCw, UserCircle } from 'lucide-react';
import { LogoMark } from '@/components/LogoMark';
import { api } from '@/lib/api';
import { saveAuth } from '@/lib/auth';
import type { AuthResponse } from '@/types';

const FEATURES = [
  'Location Based Discovery',
  'Trusted Local Businesses',
  'Services Near You',
  'Community & Opportunities',
];

function newCaptcha() {
  return { a: Math.floor(Math.random() * 9) + 1, b: Math.floor(Math.random() * 9) + 1 };
}

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha]       = useState({ a: 5, b: 3 });
  const [captchaInput, setCaptchaInput] = useState('');
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading]       = useState(false);

  useEffect(() => { setCaptcha(newCaptcha()); }, []);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!identifier.trim()) errs.identifier = 'Enter your mobile number or username';
    if (!password)          errs.password   = 'Enter your password';
    if (parseInt(captchaInput) !== captcha.a + captcha.b) {
      errs.captcha = 'Incorrect answer, please try again';
      setCaptcha(newCaptcha());
      setCaptchaInput('');
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
      const res = await api.login({ phone: identifier.trim(), password }) as AuthResponse;
      saveAuth(res.token, res.user);
      router.push(res.user.userType === 'ADMIN' ? '/admin/dashboard' : '/home');
    } catch (err) {
      setServerError((err as Error).message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh flex flex-col lg:flex-row">

      {/* ── Left panel — hero ── */}
      <div className="hidden lg:flex flex-col flex-1 relative p-12 text-white overflow-hidden">
        <div className="landing-hero-image absolute inset-0" />
        <div className="landing-hero-shade absolute inset-0" />

        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-2.5">
          <LogoMark className="h-10 w-auto drop-shadow-lg" />
          <span className="text-lg font-bold tracking-[-0.02em]">Local Connect</span>
        </Link>

        {/* Brand copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-md">
          <h1 className="text-5xl font-extrabold leading-tight tracking-[-0.04em]">
            Everything Around You.<br />
            <span className="text-[#f3c875]">All in One Place.</span>
          </h1>
          <p className="mt-5 text-base leading-7 text-white/75">
            Discover trusted businesses, services, professionals and opportunities around you through one platform.
          </p>

          {/* Feature list */}
          <ul className="mt-8 space-y-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#e9ae4a] text-[10px] font-black text-[#17352a]">✓</span>
                <span className="text-sm font-medium text-white/80">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom tag */}
        <p className="relative z-10 text-xs text-white/40 font-medium">
          © {new Date().getFullYear()} Local Connect · Andhra Pradesh
        </p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 lg:max-w-[520px] flex flex-col items-center justify-center px-4 py-10 relative lg:bg-white">
        {/* Mobile hero background */}
        <div className="lg:hidden landing-hero-image fixed inset-0 -z-10" />
        <div className="lg:hidden landing-hero-shade fixed inset-0 -z-10" />

        <div className="w-full max-w-[420px]">

          {/* Back */}
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white lg:text-[#5f6d64] lg:hover:text-[#17352a]"
          >
            <ArrowLeft size={15} /> Back to Home
          </Link>

          {/* Card */}
          <div className="rounded-3xl bg-white shadow-2xl shadow-black/25 lg:shadow-none lg:rounded-none overflow-hidden">

            {/* Card header */}
            <div className="border-b border-[#f0ede7] px-8 pt-8 pb-6">
              {/* Mobile logo */}
              <Link href="/" className="lg:hidden mb-5 flex items-center gap-2">
                <LogoMark className="h-8 w-auto" />
                <span className="text-base font-bold text-[#17352a] tracking-[-0.02em]">Local Connect</span>
              </Link>
              <h1 className="text-2xl font-extrabold text-[#17352a] tracking-[-0.03em]">Welcome Back 👋</h1>
              <p className="mt-1.5 text-sm text-[#5f6d64]">Sign in to continue exploring your local area.</p>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">

              {/* Identifier */}
              <Field label="Mobile Number or Username" error={errors.identifier}>
                <FieldInput
                  placeholder="Enter mobile number or username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  icon={<UserCircle size={15} />}
                  autoComplete="username tel"
                  inputMode="text"
                />
              </Field>

              {/* Password */}
              <Field label="Password" error={errors.password}>
                <FieldInput
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock size={15} />}
                  autoComplete="current-password"
                  suffix={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#9aab9e] hover:text-[#5f6d64] transition-colors"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />
              </Field>

              <div className="flex justify-end -mt-2">
                <Link href="/forgot-password" className="text-xs font-semibold text-[#1E7B3B] hover:underline">
                  Forgot Password?
                </Link>
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
                    className="shrink-0 flex h-[46px] w-11 items-center justify-center rounded-xl border border-[#d9ded2] text-[#5f6d64] hover:border-[#17352a]/40 hover:text-[#17352a] transition-colors"
                    title="New question"
                  >
                    <RefreshCw size={15} />
                  </button>
                </div>
              </Field>

              {/* Server error */}
              {serverError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {serverError}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[#1E7B3B] font-bold text-white transition-all hover:bg-[#2d9b4e] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading
                  ? <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  : 'Sign In'}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-[#d9ded2]" />
                <span className="text-xs text-[#9aab9e]">or</span>
                <div className="flex-1 border-t border-[#d9ded2]" />
              </div>

              {/* Google SSO placeholder */}
              <button
                type="button"
                onClick={() => alert('Google Sign-In coming soon.')}
                className="w-full h-12 rounded-xl border border-[#d9ded2] bg-white font-semibold text-[#17352a] text-sm transition-all hover:border-[#17352a]/40 hover:bg-[#f5f3ed] flex items-center justify-center gap-3"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908C16.658 14.108 17.64 11.858 17.64 9.2Z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
                  <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <p className="text-center text-sm text-[#5f6d64] pb-1">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-semibold text-[#1E7B3B] hover:underline">
                  Create Account
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ── Field primitives (same as register page) ── */

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#5f6d64]">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function FieldInput({
  icon,
  suffix,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-[#d9ded2] bg-[#fafaf9] px-4 py-3 transition-all focus-within:border-[#1E7B3B] focus-within:ring-2 focus-within:ring-[#1E7B3B]/10">
      {icon && <span className="shrink-0 text-[#9aab9e]">{icon}</span>}
      <input
        className="flex-1 bg-transparent text-sm text-[#17352a] placeholder:text-[#bcc5be] outline-none"
        {...props}
      />
      {suffix}
    </div>
  );
}
