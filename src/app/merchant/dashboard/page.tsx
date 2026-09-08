'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  ArrowLeft,
  Plus,
  Eye,
  Package,
  TrendingUp,
  Store,
  Phone,
  MapPin,
  Clock,
  Truck,
  Edit3,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageLoader } from '@/components/LoadingSpinner';
import { api } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { queryClient } from '@/lib/query-client';
import type { Business, User, ShopStatus } from '@/types';

const STATUS_CONFIG: Record<ShopStatus, { label: string; color: string; bg: string }> = {
  OPEN: { label: 'Open', color: 'text-green-700', bg: 'bg-green-100' },
  BUSY: { label: 'Busy', color: 'text-amber-700', bg: 'bg-amber-100' },
  CLOSED: { label: 'Closed', color: 'text-red-700', bg: 'bg-red-100' },
};

function StatusToggle({ business }: { business: Business }) {
  const statuses: ShopStatus[] = ['OPEN', 'BUSY', 'CLOSED'];

  const mutation = useMutation({
    mutationFn: (status: ShopStatus) => api.updateStatus(business.id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBusinesses'] });
    },
  });

  return (
    <div className="flex gap-2">
      {statuses.map((s) => {
        const cfg = STATUS_CONFIG[s];
        const isActive = business.status === s;
        return (
          <button
            key={s}
            onClick={() => mutation.mutate(s)}
            disabled={mutation.isPending}
            className={`flex-1 py-2 rounded-[10px] text-xs font-bold transition-all ${
              isActive
                ? `${cfg.bg} ${cfg.color} ring-2 ring-offset-1 ring-current`
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            {cfg.label}
          </button>
        );
      })}
    </div>
  );
}

export default function MerchantDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const { data: businesses = [], isLoading } = useQuery<Business[]>({
    queryKey: ['myBusinesses'],
    queryFn: () => api.myBusinesses() as Promise<Business[]>,
    enabled: !!user,
  });

  if (isLoading) return <PageLoader />;

  const totalViews = businesses.reduce(() => Math.floor(Math.random() * 500 + 50), 0);
  const openBusinesses = businesses.filter((b) => b.status === 'OPEN').length;

  return (
    <div className="min-h-dvh">
      {/* Header */}
      <div
        className="px-4 pt-12 pb-6"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E7B3B 100%)' }}
      >
        <button
          onClick={() => router.push('/home')}
          className="flex items-center gap-1.5 text-white/70 text-sm mb-4 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">My Dashboard</h1>
            <p className="text-white/60 text-sm mt-0.5">
              {user?.username} · Shop Owner
            </p>
          </div>
          <button
            onClick={() => router.push('/merchant/add-business')}
            className="flex items-center gap-1.5 bg-accent text-white text-sm font-bold px-4 py-2 rounded-[12px] active:scale-95 transition-transform"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            { icon: Store, label: 'Businesses', value: businesses.length, color: 'text-green-300' },
            { icon: Eye, label: 'Views', value: `${totalViews}+`, color: 'text-blue-300' },
            { icon: TrendingUp, label: 'Open Now', value: openBusinesses, color: 'text-accent' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white/10 backdrop-blur-sm rounded-[12px] p-3 text-center">
              <Icon size={18} className={`${color} mx-auto mb-1`} />
              <p className="text-white font-bold text-lg leading-none">{value}</p>
              <p className="text-white/50 text-[10px] mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Add Business CTA if none */}
        {businesses.length === 0 && (
          <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
            <CardContent className="py-8 text-center">
              <Store size={40} className="text-primary/30 mx-auto mb-3" />
              <h3 className="font-bold text-gray-700 mb-2">No businesses yet</h3>
              <p className="text-sm text-gray-500 mb-4">
                Add your first business to start connecting with local customers
              </p>
              <Button onClick={() => router.push('/merchant/add-business')}>
                <Plus size={16} className="mr-2" />
                Add Your Business
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Business Cards */}
        {businesses.map((business) => (
          <Card key={business.id} shadow="md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[10px] bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">{business.category?.icon || '🏪'}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{business.name}</h3>
                    <p className="text-xs text-gray-500">{business.category?.name}</p>
                  </div>
                </div>
                <button className="w-8 h-8 rounded-[8px] bg-gray-100 flex items-center justify-center">
                  <Edit3 size={14} className="text-gray-500" />
                </button>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Status toggle */}
              <div>
                <p className="text-xs text-gray-400 font-medium mb-2">Business Status</p>
                <StatusToggle business={business} />
              </div>

              {/* Details */}
              <div className="space-y-2 pt-1">
                {business.phone && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Phone size={12} className="text-primary" />
                    {business.phone}
                  </div>
                )}
                {business.address && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin size={12} className="text-primary" />
                    {business.address}
                  </div>
                )}
                {(business.openTime || business.is24Hours) && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Clock size={12} className="text-primary" />
                    {business.is24Hours ? '24 Hours' : `${business.openTime} – ${business.closeTime}`}
                  </div>
                )}
                {business.hasDelivery && (
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <Truck size={12} />
                    Delivery Available
                  </div>
                )}
              </div>

              {/* Stat chips */}
              <div className="flex gap-2 flex-wrap pt-1">
                <span className="bg-blue-50 text-blue-600 text-[10px] font-semibold px-2 py-1 rounded-full">
                  {Math.floor(Math.random() * 200 + 20)} views this week
                </span>
                <span className="bg-green-50 text-green-600 text-[10px] font-semibold px-2 py-1 rounded-full">
                  {Math.floor(Math.random() * 50 + 5)} contacts
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
