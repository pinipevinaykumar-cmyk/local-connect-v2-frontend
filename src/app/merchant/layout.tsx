'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isLoggedIn } from '@/lib/auth';

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login');
      return;
    }
    const user = getUser();
    if (user && user.userType !== 'MERCHANT' && user.userType !== 'ADMIN') {
      router.replace('/home');
    }
  }, [router]);

  return (
    <div className="min-h-dvh bg-[#F8FAFC]">
      {children}
    </div>
  );
}
