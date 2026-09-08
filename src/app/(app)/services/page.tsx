'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { BusinessCard } from '@/components/BusinessCard';
import { PageLoader } from '@/components/LoadingSpinner';
import { api } from '@/lib/api';
import { getUser } from '@/lib/auth';
import type { Business, User } from '@/types';

const SERVICE_CATEGORIES = ['Plumber', 'Electrician', 'Carpenter', 'Painter', 'AC Repair', 'Tailor', 'Driver', 'Cook'];

export default function ServicesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const [activeService, setActiveService] = useState<string | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const { data: businesses = [], isLoading } = useQuery<Business[]>({
    queryKey: ['services', user?.villageId],
    queryFn: () =>
      api.businesses({ villageId: user!.villageId!, category: 'Services' }) as Promise<Business[]>,
    enabled: !!user?.villageId,
  });

  const filtered = businesses.filter((b) => {
    const matchSearch =
      !search ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.ownerName?.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="min-h-dvh">
      {/* Header */}
      <div
        className="px-4 pt-12 pb-5"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E7B3B 100%)' }}
      >
        <h1 className="text-xl font-bold text-white mb-1">Services</h1>
        <p className="text-white/60 text-sm mb-4">Local service providers near you</p>
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search plumber, electrician..."
            className="w-full h-11 bg-white rounded-[12px] pl-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Service type chips */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveService(null)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              !activeService ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            All Services
          </button>
          {SERVICE_CATEGORIES.map((s) => (
            <button
              key={s}
              onClick={() => setActiveService(activeService === s ? null : s)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeService === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        {isLoading ? (
          <PageLoader />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">🔧</span>
            <h3 className="font-semibold text-gray-700 mb-2">No services found</h3>
            <p className="text-sm text-gray-500">
              Be the first service provider to register in your area!
            </p>
            <div className="mt-6 space-y-3">
              {SERVICE_CATEGORIES.slice(0, 4).map((s) => (
                <div
                  key={s}
                  className="bg-white rounded-[12px] p-4 border border-dashed border-gray-200 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-[10px] bg-gray-100 flex items-center justify-center text-xl">
                    {s === 'Plumber' ? '🔧' : s === 'Electrician' ? '⚡' : s === 'Carpenter' ? '🪚' : '🎨'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{s}</p>
                    <p className="text-xs text-gray-400">Coming soon in your area</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((b) => (
              <BusinessCard key={b.id} business={b} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
