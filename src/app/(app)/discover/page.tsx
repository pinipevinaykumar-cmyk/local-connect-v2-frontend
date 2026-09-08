'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { BusinessCard } from '@/components/BusinessCard';
import { CategoryChip } from '@/components/CategoryTile';
import { PageLoader } from '@/components/LoadingSpinner';
import { api } from '@/lib/api';
import { getUser } from '@/lib/auth';
import type { Business, Category, User } from '@/types';

function DiscoverContent() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState<number | null>(
    searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : null
  );

  useEffect(() => {
    setUser(getUser());
  }, []);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api.categories() as Promise<Category[]>,
  });

  const queryParams: Record<string, string | number | boolean> = {};
  if (user?.villageId) queryParams.villageId = user.villageId;
  if (activeCat) queryParams.categoryId = activeCat;
  if (search.length > 1) queryParams.search = search;

  const { data: businesses = [], isLoading } = useQuery<Business[]>({
    queryKey: ['businesses', queryParams],
    queryFn: () => api.businesses(queryParams) as Promise<Business[]>,
    enabled: !!user,
  });

  const filtered = businesses.filter((b) =>
    search.length < 2
      ? true
      : b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.ownerName?.toLowerCase().includes(search.toLowerCase()) ||
        b.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-dvh">
      {/* Header */}
      <div
        className="px-4 pt-12 pb-5"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E7B3B 100%)' }}
      >
        <h1 className="text-xl font-bold text-white mb-4">Discover</h1>
        {/* Search bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search businesses, services..."
            className="w-full h-11 bg-white rounded-[12px] pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Category chips */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <CategoryChip
            label="All"
            active={activeCat === null}
            onClick={() => setActiveCat(null)}
          />
          {categories.map((cat) => (
            <CategoryChip
              key={cat.id}
              label={cat.name}
              icon={cat.icon}
              active={activeCat === cat.id}
              onClick={() => setActiveCat(activeCat === cat.id ? null : cat.id)}
            />
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-500">
            {isLoading ? 'Searching...' : `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`}
          </p>
          <button className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
            <SlidersHorizontal size={13} />
            Filter
          </button>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">🔍</span>
            <h3 className="text-gray-700 font-semibold mb-2">No results found</h3>
            <p className="text-sm text-gray-500">
              {search
                ? `No businesses matching "${search}"`
                : 'No businesses in this area yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <DiscoverContent />
    </Suspense>
  );
}
