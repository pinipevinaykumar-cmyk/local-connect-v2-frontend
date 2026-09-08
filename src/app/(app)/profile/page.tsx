'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Phone,
  MapPin,
  LogOut,
  ChevronRight,
  Store,
  Shield,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LocationBreadcrumbDark } from '@/components/LocationBreadcrumb';
import { getUser, clearAuth } from '@/lib/auth';
import { getInitials } from '@/lib/utils';
import type { User } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace('/login');
      return;
    }
    setUser(u);
  }, [router]);

  function handleLogout() {
    clearAuth();
    router.replace('/');
  }

  if (!user) return null;

  const roleConfig = {
    CUSTOMER: { label: 'Customer', variant: 'info' as const, emoji: '👤' },
    MERCHANT: { label: 'Shop Owner', variant: 'success' as const, emoji: '🏪' },
    ADMIN: { label: 'Admin', variant: 'danger' as const, emoji: '🛡️' },
  };

  const role = roleConfig[user.userType];
  const initials = getInitials(user.username);

  return (
    <div className="min-h-dvh">
      {/* Profile Header */}
      <div
        className="px-4 pt-12 pb-8 flex flex-col items-center"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E7B3B 100%)' }}
      >
        {/* Avatar */}
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30">
            <span className="text-2xl font-bold text-white">{initials}</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-accent flex items-center justify-center border-2 border-white">
            <span className="text-sm">{role.emoji}</span>
          </div>
        </div>

        <h1 className="text-xl font-bold text-white">{user.username}</h1>
        <Badge variant={role.variant} className="mt-1">
          {role.label}
        </Badge>

        <div className="mt-3 w-full">
          <LocationBreadcrumbDark user={null} />
          <div className="flex items-center gap-1.5 text-white/70 text-xs mt-1">
            <MapPin size={12} className="text-accent" />
            <span>
              {[user.district?.name, user.mandal?.name, user.village?.name]
                .filter(Boolean)
                .join(', ') || 'Location not set'}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4 -mt-4">
        {/* User Info Card */}
        <Card shadow="md">
          <CardContent className="p-4 space-y-3">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Account Info
            </h2>

            <div className="flex items-center gap-3 py-2 border-b border-gray-50">
              <div className="w-9 h-9 rounded-[10px] bg-primary/10 flex items-center justify-center">
                <UserIcon size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Username</p>
                <p className="text-sm font-semibold text-gray-900">{user.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2 border-b border-gray-50">
              <div className="w-9 h-9 rounded-[10px] bg-primary/10 flex items-center justify-center">
                <Phone size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm font-semibold text-gray-900">{user.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <div className="w-9 h-9 rounded-[10px] bg-primary/10 flex items-center justify-center">
                <MapPin size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Location</p>
                <p className="text-sm font-semibold text-gray-900">
                  {[
                    'Andhra Pradesh',
                    user.district?.name,
                    user.mandal?.name,
                    user.village?.name,
                  ]
                    .filter(Boolean)
                    .join(' › ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Merchant link */}
        {user.userType === 'MERCHANT' && (
          <Card shadow="sm">
            <button
              onClick={() => router.push('/merchant/dashboard')}
              className="w-full p-4 flex items-center gap-3 text-left"
            >
              <div className="w-9 h-9 rounded-[10px] bg-secondary/10 flex items-center justify-center">
                <Store size={16} className="text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">My Business Dashboard</p>
                <p className="text-xs text-gray-400">Manage your businesses</p>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          </Card>
        )}

        {/* Menu Items */}
        <Card shadow="sm">
          <CardContent className="p-2 divide-y divide-gray-50">
            {[
              { icon: Settings, label: 'Account Settings', action: () => {} },
              { icon: MapPin, label: 'Change Location', action: () => {} },
              { icon: Shield, label: 'Privacy & Security', action: () => {} },
              { icon: HelpCircle, label: 'Help & Support', action: () => {} },
            ].map(({ icon: Icon, label, action }) => (
              <button
                key={label}
                onClick={action}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-[12px] transition-colors"
              >
                <div className="w-8 h-8 rounded-[8px] bg-gray-100 flex items-center justify-center">
                  <Icon size={15} className="text-gray-500" />
                </div>
                <span className="text-sm text-gray-700 font-medium flex-1">{label}</span>
                <ChevronRight size={14} className="text-gray-300" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="destructive"
          size="lg"
          onClick={handleLogout}
          className="w-full"
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </Button>

        <p className="text-center text-xs text-gray-300 pb-4">Local Connect v1.0.0</p>
      </div>
    </div>
  );
}
