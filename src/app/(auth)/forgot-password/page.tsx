'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, Phone, User } from 'lucide-react';
import { LogoMark } from '@/components/LogoMark';

type Step = 'identify' | 'contact-admin' | 'done';

export default function ForgotPasswordPage() {
  const [step, setStep]         = useState<Step>('identify');
  const [phone, setPhone]       = useState('');
  const [username, setUsername] = useState('');
  const [error, setError]       = useState('');

  function handleIdentify(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!phone.trim() && !username.trim()) {
      setError('Enter your mobile number or username');
      return;
    }
    if (phone && !/^[0-9]{10}$/.test(phone.trim())) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setStep('contact-admin');
  }

  return (
    <main className="relative min-h-dvh flex flex-col items-center px-4 py-10 sm:py-16">
      <div className="landing-hero-image fixed inset-0 -z-10" />
      <div className="landing-hero-shade fixed inset-0 -z-10" />

      <div className="w-full max-w-[420px] mb-4">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors">
          <ArrowLeft size={15} /> Back to Login
        </Link>
      </div>

      <div className="w-full max-w-[420px] rounded-3xl bg-white shadow-2xl shadow-black/30 overflow-hidden">

        <div className="px-8 pt-8 pb-6 border-b border-gray-100">
          <Link href="/" className="inline-flex items-center gap-2 mb-5">
            <LogoMark className="h-8 w-auto" />
            <span className="text-base font-bold text-[#17352a] tracking-[-0.02em]">Local Connect</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#17352a] tracking-[-0.03em]">Forgot Password</h1>
          <p className="mt-1.5 text-sm text-[#5f6d64]">
            {step === 'identify' ? 'Tell us who you are and we\'ll help you recover access.' : 'Here\'s how to reset your password.'}
          </p>
        </div>

        <div className="px-8 py-6">

          {step === 'identify' && (
            <form onSubmit={handleIdentify} className="space-y-5">
              <div className="rounded-xl border border-[#d9ded2] bg-[#f5f3ed] p-4 text-sm text-[#5f6d64]">
                Enter either your mobile number or username — whichever you remember.
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#5f6d64]">Mobile Number</label>
                <div className="flex items-center gap-2.5 rounded-xl border border-[#d9ded2] bg-[#fafaf9] px-4 py-3 transition-all focus-within:border-[#1E7B3B] focus-within:ring-2 focus-within:ring-[#1E7B3B]/10">
                  <Phone size={15} className="shrink-0 text-[#9aab9e]" />
                  <input
                    className="flex-1 bg-transparent text-sm text-[#17352a] placeholder:text-[#bcc5be] outline-none"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    inputMode="numeric"
                    type="tel"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-[#d9ded2]" />
                <span className="text-xs text-[#9aab9e]">or</span>
                <div className="flex-1 border-t border-[#d9ded2]" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-[0.08em] text-[#5f6d64]">Username</label>
                <div className="flex items-center gap-2.5 rounded-xl border border-[#d9ded2] bg-[#fafaf9] px-4 py-3 transition-all focus-within:border-[#1E7B3B] focus-within:ring-2 focus-within:ring-[#1E7B3B]/10">
                  <User size={15} className="shrink-0 text-[#9aab9e]" />
                  <input
                    className="flex-1 bg-transparent text-sm text-[#17352a] placeholder:text-[#bcc5be] outline-none"
                    placeholder="Your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
              )}

              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#1E7B3B] font-bold text-white transition-all hover:bg-[#2d9b4e] flex items-center justify-center"
              >
                Continue
              </button>
            </form>
          )}

          {step === 'contact-admin' && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-[#1E7B3B]/20 bg-[#1E7B3B]/5 p-5 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1E7B3B]/10 mx-auto mb-3">
                  <Lock size={22} className="text-[#1E7B3B]" />
                </div>
                <p className="font-bold text-[#17352a]">Account Found</p>
                <p className="text-sm text-[#5f6d64] mt-1">
                  {phone ? `Mobile: ${phone}` : `Username: ${username}`}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-[#17352a]">How to reset your password:</p>
                <div className="space-y-2">
                  {[
                    { step: '1', text: 'Contact Local Connect support via WhatsApp or call.' },
                    { step: '2', text: 'Provide your registered mobile number and username for verification.' },
                    { step: '3', text: 'Our team will verify your identity and reset your password.' },
                    { step: '4', text: 'You will receive your new temporary password to login.' },
                  ].map(({ step, text }) => (
                    <div key={step} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1E7B3B] text-[10px] font-bold text-white mt-0.5">{step}</span>
                      <p className="text-sm text-[#5f6d64]">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-[#d9ded2] bg-[#fafaf9] p-4 text-center">
                <p className="text-xs text-[#9aab9e] mb-2">Support Contact</p>
                <p className="font-bold text-[#17352a] text-sm">WhatsApp / Call</p>
                <p className="text-[#1E7B3B] font-semibold text-sm mt-1">+91 95730 30392</p>
                <p className="text-[10px] text-[#9aab9e] mt-2">Mon – Sat · 9 AM to 6 PM</p>
              </div>

              <p className="text-center text-xs text-[#9aab9e]">
                OTP-based password reset coming soon in a future update.
              </p>
            </div>
          )}

          <div className="mt-5 pt-5 border-t border-[#f5f3ed] text-center">
            <Link href="/login" className="text-sm font-semibold text-[#1E7B3B] hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
