'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Bell, RefreshCw } from 'lucide-react';
import { LocationBreadcrumb } from '@/components/LocationBreadcrumb';
import { CategoryTile } from '@/components/CategoryTile';
import { Card, CardContent } from '@/components/ui/card';
import { PageLoader } from '@/components/LoadingSpinner';
import { getUser } from '@/lib/auth';
import { api } from '@/lib/api';
import { getGreeting } from '@/lib/utils';
import type { User, Category, Business } from '@/types';

const COMMUNITY_MOCK = [
  {
    id: 1,
    title: 'New Medical Camp',
    content: 'Free eye checkup camp at Village Panchayat Office on Sunday 10 AM.',
    author: 'Health Department',
    time: '2h ago',
    emoji: '🏥',
  },
  {
    id: 2,
    title: 'Road Repair Notice',
    content: 'Main road from bus stand to market will be under repair this week.',
    author: 'Gram Panchayat',
    time: '5h ago',
    emoji: '🚧',
  },
  {
    id: 3,
    title: 'Farmers Market',
    content: 'Weekly organic vegetable market every Saturday morning near temple.',
    author: 'Farmers Society',
    time: '1d ago',
    emoji: '🌾',
  },
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
    queryFn: () =>
      api.businesses({ villageId: user!.villageId! }) as Promise<Business[]>,
    enabled: !!user?.villageId,
  });

  if (catLoading || bizLoading) return <PageLoader />;

  const categoryCount = categories.reduce<Record<number, number>>((acc, cat) => {
    acc[cat.id] = businesses.filter((b) => b.category?.id === cat.id).length;
    return acc;
  }, {});

  const activeCats = categories.filter((c) => (categoryCount[c.id] || 0) > 0);
  const hasBusinesses = businesses.length > 0;

  return (
    <div className="min-h-dvh">
      {/* Hero Header */}
      <div
        className="px-4 pt-12 pb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E7B3B 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute top-4 -right-4 w-20 h-20 rounded-full bg-white/5" />

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <LocationBreadcrumb user={user} />
            <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <Bell size={16} className="text-white" />
            </button>
          </div>

          <div>
            <p className="text-white/60 text-sm">{getGreeting()},</p>
            <h1 className="text-2xl font-bold text-white mt-0.5">
              {user?.username || 'Welcome'} 👋
            </h1>
            <p className="text-white/50 text-xs mt-1">
              {hasBusinesses
                ? `${businesses.length} businesses near you`
                : 'Explore what\'s available'}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-6">
        {/* Category Grid */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 text-base">Categories</h2>
            <button
              onClick={() => router.push('/discover')}
              className="text-xs text-primary font-semibold"
            >
              View all
            </button>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No categories available
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {(hasBusinesses ? activeCats : categories).map((cat) => (
                <CategoryTile
                  key={cat.id}
                  category={cat}
                  count={categoryCount[cat.id]}
                  onClick={() =>
                    router.push(
                      `/discover?categoryId=${cat.id}&villageId=${user?.villageId || ''}`
                    )
                  }
                />
              ))}
            </div>
          )}
        </section>

        {/* Coming soon card if no businesses */}
        {!hasBusinesses && user?.village && (
          <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
            <CardContent className="py-6 text-center">
              <span className="text-4xl mb-3 block">🌱</span>
              <h3 className="font-semibold text-gray-700 mb-1">
                Coming soon in {user.village.name}
              </h3>
              <p className="text-sm text-gray-500">
                Be the first business to join Local Connect in your village!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <section>
          <h2 className="font-bold text-gray-900 text-base mb-3">Quick Access</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { emoji: '🏥', label: 'Healthcare', href: '/discover?category=Healthcare' },
              { emoji: '🛒', label: 'Shopping', href: '/discover?category=Shopping' },
              { emoji: '🔧', label: 'Services', href: '/services' },
            ].map(({ emoji, label, href }) => (
              <button
                key={label}
                onClick={() => router.push(href)}
                className="bg-white rounded-[16px] p-3 flex flex-col items-center gap-2 border border-gray-100 shadow-sm active:scale-95 transition-transform"
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs font-medium text-gray-600">{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Community Updates */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 text-base">Community Updates</h2>
            <button
              onClick={() => router.push('/community')}
              className="text-xs text-primary font-semibold"
            >
              See all
            </button>
          </div>
          <div className="space-y-3">
            {COMMUNITY_MOCK.map((post) => (
              <Card key={post.id} className="shadow-sm">
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-[12px] bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">{post.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {post.title}
                        </h4>
                        <span className="text-[10px] text-gray-400 flex-shrink-0">{post.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{post.content}</p>
                      <p className="text-[10px] text-primary font-medium mt-1">{post.author}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Refresh hint */}
        <button
          onClick={() => window.location.reload()}
          className="w-full flex items-center justify-center gap-2 text-xs text-gray-400 py-2"
        >
          <RefreshCw size={12} />
          Pull to refresh
        </button>
      </div>
    </div>
  );
}
