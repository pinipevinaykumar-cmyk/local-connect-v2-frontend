'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Phone, User, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { api } from '@/lib/api';
import { saveAuth } from '@/lib/auth';
import { validatePhone, validatePassword } from '@/lib/utils';
import type { District, Mandal, Village, RegisterPayload, UserType, AuthResponse } from '@/types';

export default function RegisterPage() {
  const router = useRouter();

  const [userType, setUserType] = useState<UserType>('CUSTOMER');
  const [districtId, setDistrictId] = useState('');
  const [mandalId, setMandalId] = useState('');
  const [villageId, setVillageId] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get('type');
    if (type === 'MERCHANT') setUserType('MERCHANT');
  }, []);

  const { data: districts = [] } = useQuery<District[]>({
    queryKey: ['districts'],
    queryFn: () => api.districts() as Promise<District[]>,
  });

  const { data: mandals = [] } = useQuery<Mandal[]>({
    queryKey: ['mandals', districtId],
    queryFn: () => api.mandals(Number(districtId)) as Promise<Mandal[]>,
    enabled: !!districtId,
  });

  const { data: villages = [] } = useQuery<Village[]>({
    queryKey: ['villages', mandalId],
    queryFn: () => api.villages(Number(mandalId)) as Promise<Village[]>,
    enabled: !!mandalId,
  });

  const passwordStrength = validatePassword(password);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!districtId) errs.district = 'Please select a district';
    if (!mandalId) errs.mandal = 'Please select a mandal';
    if (!villageId) errs.village = 'Please select a village';
    if (!validatePhone(phone)) errs.phone = 'Enter a valid 10-digit Indian mobile number';
    if (username.length < 4) errs.username = 'Username must be at least 4 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) errs.username = 'Only letters, numbers and underscore allowed';
    if (password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
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
        username,
        phone,
        password,
        userType,
        districtId: Number(districtId),
        mandalId: Number(mandalId),
        villageId: Number(villageId),
      };
      const res = await api.register(payload) as AuthResponse;
      saveAuth(res.token, res.user);
      router.push(userType === 'MERCHANT' ? '/merchant/dashboard' : '/home');
    } catch (err) {
      const message = (err as Error).message || '';
      if (message.toLowerCase().includes('phone') || message.toLowerCase().includes('exist')) {
        setServerError('This phone number is already registered. Please login.');
      } else {
        setServerError(message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F172A] to-primary px-4 pt-12 pb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-white/70 text-sm mb-4 hover:text-white transition-colors">
          <ChevronLeft size={16} />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-white">Create Account</h1>
        <p className="text-white/60 text-sm mt-1">Join your local community</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 px-4 py-6 space-y-5">
        {/* User Type Toggle */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">I am a</p>
          <div className="grid grid-cols-2 gap-3">
            {(['CUSTOMER', 'MERCHANT'] as UserType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setUserType(type)}
                className={`flex flex-col items-center gap-2 p-4 rounded-[16px] border-2 transition-all duration-200 ${
                  userType === type
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{type === 'CUSTOMER' ? '👤' : '🏪'}</span>
                <span className="text-sm font-semibold">
                  {type === 'CUSTOMER' ? 'Customer' : 'Shop Owner'}
                </span>
                {userType === type && (
                  <CheckCircle size={16} className="text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* State (read-only) */}
        <Input
          label="State"
          value="Andhra Pradesh"
          readOnly
          className="bg-gray-50 text-gray-500"
        />

        {/* District */}
        <Select
          label="District"
          placeholder="Select District"
          value={districtId}
          onChange={(e) => {
            setDistrictId(e.target.value);
            setMandalId('');
            setVillageId('');
          }}
          options={districts.map((d) => ({ value: d.id, label: d.name }))}
          error={errors.district}
        />

        {/* Mandal */}
        <Select
          label="Mandal"
          placeholder={districtId ? 'Select Mandal' : 'Select district first'}
          value={mandalId}
          onChange={(e) => {
            setMandalId(e.target.value);
            setVillageId('');
          }}
          options={mandals.map((m) => ({ value: m.id, label: m.name }))}
          disabled={!districtId}
          error={errors.mandal}
        />

        {/* Village */}
        <Select
          label="Village / Town"
          placeholder={mandalId ? 'Select Village' : 'Select mandal first'}
          value={villageId}
          onChange={(e) => setVillageId(e.target.value)}
          options={villages.map((v) => ({ value: v.id, label: v.name }))}
          disabled={!mandalId}
          error={errors.village}
        />

        {/* Phone */}
        <Input
          label="Phone Number"
          type="tel"
          placeholder="10-digit mobile number"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
          leftIcon={<Phone size={15} />}
          error={errors.phone}
          inputMode="numeric"
        />

        {/* Username */}
        <Input
          label="Username"
          placeholder="min 4 chars, letters/numbers/underscore"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          leftIcon={<User size={15} />}
          error={errors.username}
          autoComplete="off"
        />

        {/* Password */}
        <div>
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Min 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock size={15} />}
            autoComplete="new-password"
            rightIcon={
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400">
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
            error={errors.password}
          />
          {/* Strength meter */}
          {password && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex-1 h-1 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: i <= passwordStrength.score ? passwordStrength.color : '#E5E7EB',
                    }}
                  />
                ))}
              </div>
              <p className="text-xs" style={{ color: passwordStrength.color }}>
                {passwordStrength.label}
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <Input
          label="Confirm Password"
          type={showConfirm ? 'text' : 'password'}
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          leftIcon={<Lock size={15} />}
          autoComplete="new-password"
          rightIcon={
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-gray-400">
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
          error={errors.confirmPassword}
        />

        {/* Server error */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-[12px] p-3">
            {serverError}
          </div>
        )}

        <Button type="submit" size="lg" loading={loading} className="w-full">
          Create Account
        </Button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
