'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { saveAuth } from '@/lib/auth';
import type { AuthResponse } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!phone || phone.length < 10) errs.phone = 'Enter a valid 10-digit phone number';
    if (!password || password.length < 6) errs.password = 'Enter your password';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.login({ phone, password }) as AuthResponse;
      saveAuth(res.token, res.user);
      router.push(res.user.userType === 'MERCHANT' ? '/merchant/dashboard' : '/home');
    } catch (err) {
      setServerError((err as Error).message || 'Invalid phone number or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F172A] to-primary px-4 pt-12 pb-10">
        <Link href="/" className="inline-flex items-center gap-2 text-white/70 text-sm mb-4 hover:text-white transition-colors">
          <ChevronLeft size={16} />
          Back
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-[14px] bg-white/10 flex items-center justify-center">
            <span className="text-2xl">🌿</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-white/60 text-sm">Local Connect</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-4 py-8 space-y-5">
        <div className="space-y-1 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Sign in</h2>
          <p className="text-sm text-gray-500">Enter your registered phone number and password</p>
        </div>

        <Input
          label="Phone Number"
          type="tel"
          placeholder="10-digit mobile number"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          leftIcon={<Phone size={15} />}
          error={errors.phone}
          inputMode="numeric"
          autoComplete="tel"
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Lock size={15} />}
          rightIcon={
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400">
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
          error={errors.password}
          autoComplete="current-password"
        />

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-[12px] p-3">
            {serverError}
          </div>
        )}

        <Button type="submit" size="lg" loading={loading} className="w-full mt-2">
          Login
        </Button>

        <p className="text-center text-sm text-gray-500 pt-2">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Register here
          </Link>
        </p>

        {/* Demo hint */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-[12px] p-3">
          <p className="text-xs text-amber-700 font-medium">Demo hint</p>
          <p className="text-xs text-amber-600 mt-0.5">
            Use your registered phone number and password to log in.
          </p>
        </div>
      </form>
    </div>
  );
}
