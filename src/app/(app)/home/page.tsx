'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Bell, MapPin, ChevronRight } from 'lucide-react';
import { CategoryTile } from '@/components/CategoryTile';
import { PageLoader } from '@/components/LoadingSpinner';
import { getUser } from '@/lib/auth';
import { api } from '@/lib/api';
import { getGreeting } from '@/lib/utils';
import type { User, Category, Business } from '@/types';

const COMMUNITY_MOCK = [
  { id: 1, title: 'Free Eye Checkup Camp', content: 'Free eye checkup at Village Panchayat Office this Sunday 10 AM.', author: 'Health Dept', time: '2h ago', emoji: '🏥' },
  { id: 2, title: 'Road Repair Notice', content: 'Main road from bus stand to market will be under repair this week.', author: 'Gram Panchayat', time: '5h ago', emoji: '🚧' },
  { id: 3, title: 'Farmers Market', content: 'Weekly organic vegetable market every Saturday near temple.', author: 'Farmers Society', time: '1d ago', emoji: '🌾' },
];

const QUICK_ACTIONS = [
  { emoji: '🏥', label: 'Healthcare', href: '/discover?category=Healthcare' },
  { emoji: '🛒', label: 'Grocery', href: '/discover?category=Grocery' },
  { emoji: '👨‍👩‍👧', label: 'Community', href: '/community' },
  { emoji: '🔧', label: 'Services', href: '/services' },
];

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const { data: categories = [], isLoading: catLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api.categories() as Promise<Category[]>,
  });

  const { data: businesses = [], isLoading: bizLoading } = useQuery<Business[]>({
    queryKey: ['businesses', user?.villageId],
    queryFn: () => api.businesses({ villageId: user!.villageId! }) as Promise<Business[]>,
    enabled: !!user?.villageId,
  });

  if (catLoading || bizLoading) return <PageLoader />;

  const categoryCount = categories.reduce<Record<number, number>>((acc, cat) => {
    acc[cat.id] = businesses.filter((b) => b.category?.id === cat.id).length;
    return acc;
  }, {});

  const locationLabel = [user?.village?.name, user?.mandal?.name].filter(Boolean).join(', ') || 'Andhra Pradesh';

  return (
    <div className="min-h-dvh bg-gray-50">

      {/* ── Header ── */}
      <div
        className="px-4 pt-12 pb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d2137 0%, #1E7B3B 100%)' }}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute top-6 -right-4 w-24 h-24 rounded-full bg-white/5" />

        <div className="relative flex items-start justify-between mb-5">
          <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
            <MapPin size={11} className="text-green-300" />
            <span className="text-white/80 text-xs font-medium">{locationLabel}</span>
          </div>
          <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <Bell size={16} className="text-white" />
          </button>
        </div>

        <div className="relative mb-5">
          <h1 className="text-2xl font-bold text-white">
            Hey, {user?.username || 'Welcome'} 👋
          </h1>
          <p className="text-white/70 text-sm mt-1.5 italic">{getGreeting()}</p>
          {businesses.length > 0 && (
            <p className="text-white/40 text-xs mt-1">{businesses.length} businesses near you</p>
          )}
        </div>

      </div>

      <div className="px-4 -mt-1 pb-24 space-y-6">

        {/* ── Quick Actions ── */}
        <section className="pt-5">
          <div className="grid grid-cols-4 gap-3">
            {QUICK_ACTIONS.map(({ emoji, label, href }) => (
              <button
                key={label}
                onClick={() => router.push(href)}
                className="flex flex-col items-center gap-1.5 bg-white rounded-2xl p-3 shadow-sm border border-gray-100 active:scale-95 transition-transform"
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-[10px] font-semibold text-gray-600 text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Categories ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 text-base">Browse Categories</h2>
            <button
              onClick={() => router.push('/discover')}
              className="flex items-center gap-0.5 text-xs text-primary font-semibold"
            >
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2.5">
            {categories.map((cat) => (
              <CategoryTile
                key={cat.id}
                category={cat}
                count={categoryCount[cat.id]}
                onClick={() => router.push(`/discover?categoryId=${cat.id}&villageId=${user?.villageId || ''}`)}
              />
            ))}
          </div>
        </section>

        {/* ── No businesses yet card ── */}
        {businesses.length === 0 && (
          <section
            className="rounded-2xl p-5 text-center"
            style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' }}
          >
            <span className="text-4xl block mb-2">🌱</span>
            <h3 className="font-bold text-gray-800 text-sm mb-1">
              Be the first in {user?.village?.name || 'your village'}!
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              No businesses listed yet. Register your shop and reach local customers.
            </p>
            <button
              onClick={() => router.push('/merchant/add-business')}
              className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-full"
            >
              + Add Your Business
            </button>
          </section>
        )}

        {/* ── Nearby Businesses ── */}
        {businesses.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-900 text-base">Nearby Businesses</h2>
              <button onClick={() => router.push('/discover')} className="flex items-center gap-0.5 text-xs text-primary font-semibold">
                See all <ChevronRight size={13} />
              </button>
            </div>
            <div className="space-y-2.5">
              {businesses.slice(0, 4).map((biz: Business) => (
                <button
                  key={biz.id}
                  onClick={() => router.push(`/discover/${biz.id}`)}
                  className="w-full bg-white rounded-2xl p-3.5 flex items-center gap-3 shadow-sm border border-gray-100 text-left active:scale-[0.98] transition-transform"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-xl">
                    {biz.category?.icon || '🏪'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{biz.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{biz.category?.name}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${biz.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-400'}`}>
                    {biz.status}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Community Updates ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 text-base">Community Updates</h2>
            <button onClick={() => router.push('/community')} className="flex items-center gap-0.5 text-xs text-primary font-semibold">
              See all <ChevronRight size={13} />
            </button>
          </div>
          <div className="space-y-2.5">
            {COMMUNITY_MOCK.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl p-3.5 flex gap-3 shadow-sm border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-lg">
                  {post.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-gray-900 truncate">{post.title}</p>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">{post.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{post.content}</p>
                  <p className="text-[10px] text-primary font-semibold mt-1">{post.author}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
