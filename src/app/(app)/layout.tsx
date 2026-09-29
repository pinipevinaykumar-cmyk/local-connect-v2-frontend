'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';
import { Sidebar } from '@/components/Sidebar';
import { BottomNav } from '@/components/BottomNav';
import { cn } from '@/lib/utils';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) router.replace('/login');
  }, [router]);

  return (
    <div className="flex min-h-dvh bg-[#f5f3ed]">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col sticky top-0 h-dvh shrink-0 overflow-hidden',
          'border-r border-[#d9ded2] bg-white transition-[width] duration-200 ease-in-out',
          collapsed ? 'w-[68px]' : 'w-60',
        )}
      >
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 pb-16 lg:pb-0">
        {children}
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
