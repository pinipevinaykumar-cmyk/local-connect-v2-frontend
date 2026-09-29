'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Users, Briefcase, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/discover', icon: Search, label: 'Discover' },
  { href: '/community', icon: Users, label: 'Community' },
  { href: '/services', icon: Briefcase, label: 'Services' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-lg lg:hidden">
      <div className="max-w-[480px] mx-auto flex">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center py-2 gap-0.5 transition-all duration-200',
                isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <div
                className={cn(
                  'w-10 h-6 flex items-center justify-center rounded-full transition-all duration-200',
                  isActive && 'bg-primary/10'
                )}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
              </div>
              <span className={cn('text-[10px] font-medium', isActive && 'font-semibold')}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
