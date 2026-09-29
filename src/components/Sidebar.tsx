'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Briefcase, Building2, ChevronLeft, ChevronRight, GraduationCap, Heart,
  Home, Lock, LogOut, MapPin, Megaphone, Search, Settings, Shield,
  ShoppingBasket, Star, Stethoscope, Store, Trophy, User, UtensilsCrossed, Wrench,
} from 'lucide-react';
import { LogoMark } from '@/components/LogoMark';
import { clearAuth, getUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

/* Set to false to unlock all modules after tournament launches */
const SPORTS_LAUNCH_MODE = true;

const NAV = [
  {
    items: [
      { href: '/home',                    icon: Home,          label: 'Dashboard' },
      { href: '/discover',                icon: Search,        label: 'Explore' },
      { href: '/discover?sort=rated',     icon: Star,          label: 'Top Rated' },
      { href: '/discover?nearby=true',    icon: MapPin,        label: 'Nearby' },
      { href: '/discover?view=businesses',icon: Building2,     label: 'Businesses' },
    ],
  },
  {
    label: 'Categories',
    items: [
      { href: '/discover?category=Groceries', icon: ShoppingBasket, label: 'Groceries' },
      { href: '/discover?category=Food',      icon: UtensilsCrossed,label: 'Food & Meat' },
      { href: '/discover?category=Healthcare',icon: Stethoscope,    label: 'Healthcare' },
      { href: '/discover?category=Education', icon: GraduationCap,  label: 'Education' },
      { href: '/sports',                      icon: Trophy,         label: 'Sports & Fitness' },
      { href: '/services',                    icon: Wrench,         label: 'Services' },
      { href: '/discover?category=Jobs',      icon: Briefcase,      label: 'Jobs' },
      { href: '/community',                   icon: Megaphone,      label: 'Updates & Events' },
    ],
  },
  {
    label: 'Account',
    items: [
      { href: '/favorites',          icon: Heart,    label: 'Favourites' },
      { href: '/merchant/dashboard', icon: Store,    label: 'My Business' },
      { href: '/profile',            icon: User,     label: 'Profile' },
      { href: '/settings',           icon: Settings, label: 'Settings' },
    ],
  },
];

/* Routes that stay unlocked in SPORTS_LAUNCH_MODE */
function isSportsUnlocked(href: string): boolean {
  const path = href.split('?')[0];
  return (
    path === '/home' ||
    path.startsWith('/sports') ||
    path.startsWith('/admin') ||
    path === '/profile' ||
    path === '/settings'
  );
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const u = getUser();
    setIsAdmin((u as any)?.userType === 'ADMIN');
  }, []);

  function isActive(href: string): boolean {
    const [hrefPath, hrefQuery] = href.split('?');

    // Prefix match for path-only hrefs (non-discover, non-home)
    if (!hrefQuery && hrefPath !== '/home' && hrefPath !== '/discover') {
      if (pathname.startsWith(hrefPath)) return true;
    }

    if (pathname !== hrefPath) return false;

    if (!hrefQuery) {
      if (hrefPath === '/discover') {
        return !searchParams.get('category') && !searchParams.get('sort') &&
               !searchParams.get('nearby') && !searchParams.get('view');
      }
      return true;
    }

    const hrefParams = new URLSearchParams(hrefQuery);
    for (const [key, value] of hrefParams.entries()) {
      if (searchParams.get(key) !== value) return false;
    }
    return true;
  }

  function handleLockedClick(e: React.MouseEvent) {
    e.preventDefault();
    router.push('/sports/bmpl');
  }

  function handleLogout() {
    clearAuth();
    router.replace('/');
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo + toggle */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-[#d9ded2] shrink-0',
        collapsed ? 'justify-center' : 'justify-between gap-3',
      )}>
        {!collapsed && (
          <Link href="/home" className="flex items-center gap-2 min-w-0">
            <LogoMark className="h-7 w-auto shrink-0" />
            <span className="text-sm font-bold text-[#17352a] tracking-[-0.02em] truncate">Local Connect</span>
          </Link>
        )}
        {collapsed && <LogoMark className="h-7 w-auto" />}
        <button
          onClick={onToggle}
          className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-[#9aab9e] hover:bg-[#f5f3ed] hover:text-[#17352a] transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* SPORTS MODE banner */}
      {SPORTS_LAUNCH_MODE && !collapsed && (
        <Link
          href="/sports/bmpl"
          className="mx-3 mt-3 flex items-center gap-2 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 px-3 py-2 hover:bg-[#F59E0B]/15 transition-colors"
        >
          <span className="text-base">🏆</span>
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold text-[#F59E0B] uppercase tracking-[0.08em]">BMPL 2027</p>
            <p className="text-[9px] text-[#5f6d64] truncate">Registration Open</p>
          </div>
          <span className="ml-auto text-[10px] font-bold text-[#1E7B3B]">LIVE</span>
        </Link>
      )}

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3">
        {NAV.map((group, gi) => (
          <div key={gi} className="mb-1">
            {group.label && !collapsed && (
              <p className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9aab9e]">
                {group.label}
              </p>
            )}
            {group.label && collapsed && <div className="mx-3 my-1.5 border-t border-[#d9ded2]" />}
            {group.items.map(({ href, icon: Icon, label }) => {
              const locked = SPORTS_LAUNCH_MODE && !isSportsUnlocked(href);
              const active = !locked && isActive(href);
              return (
                <Link
                  key={href}
                  href={locked ? '/sports/bmpl' : href}
                  onClick={locked ? handleLockedClick : undefined}
                  title={collapsed ? label : locked ? `Coming Soon — Unlocks with BMPL` : undefined}
                  className={cn(
                    'flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                    collapsed && 'justify-center px-0 mx-3',
                    locked   && 'opacity-40',
                    active
                      ? 'bg-[#1E7B3B]/10 text-[#1E7B3B] font-semibold'
                      : 'text-[#5f6d64] hover:bg-[#f5f3ed] hover:text-[#17352a]',
                  )}
                >
                  <Icon size={17} strokeWidth={active ? 2.5 : 1.8} className="shrink-0" />
                  {!collapsed && (
                    <span className="truncate flex-1">{label}</span>
                  )}
                  {!collapsed && locked && (
                    <Lock size={11} className="shrink-0 ml-auto text-[#9aab9e]" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Admin link (ADMIN users only) */}
      {isAdmin && (
        <div className={cn('px-2 pb-1', collapsed && 'flex justify-center px-3')}>
          <Link
            href="/admin"
            title={collapsed ? 'Admin Panel' : undefined}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              collapsed && 'justify-center w-10 px-0',
              pathname.startsWith('/admin')
                ? 'bg-[#F59E0B]/10 text-[#F59E0B] font-semibold'
                : 'text-[#9aab9e] hover:bg-[#f5f3ed] hover:text-[#17352a]',
            )}
          >
            <Shield size={17} strokeWidth={1.8} className="shrink-0" />
            {!collapsed && <span className="truncate flex-1">Admin Panel</span>}
          </Link>
        </div>
      )}

      {/* Logout */}
      <div className={cn('border-t border-[#d9ded2] p-3', collapsed && 'flex justify-center')}>
        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[#5f6d64] hover:bg-red-50 hover:text-red-600 transition-colors',
            collapsed && 'justify-center w-10 px-0',
          )}
        >
          <LogOut size={17} strokeWidth={1.8} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
