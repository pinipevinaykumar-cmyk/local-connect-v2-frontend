'use client';

import { Phone, MapPin, Clock, Truck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Business, ShopStatus } from '@/types';

interface BusinessCardProps {
  business: Business;
  onClick?: () => void;
}

function StatusBadge({ status }: { status: ShopStatus }) {
  const config = {
    OPEN: { variant: 'success' as const, label: 'Open' },
    BUSY: { variant: 'warning' as const, label: 'Busy' },
    CLOSED: { variant: 'danger' as const, label: 'Closed' },
  };
  const { variant, label } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}

export function BusinessCard({ business, onClick }: BusinessCardProps) {
  return (
    <Card
      className={`overflow-hidden transition-transform duration-200 ${onClick ? 'cursor-pointer active:scale-95' : ''}`}
      onClick={onClick}
    >
      {/* Image or placeholder */}
      <div className="relative h-32 bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center">
        {business.imageUrl ? (
          <img
            src={business.imageUrl}
            alt={business.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl">{business.category?.icon || '🏪'}</span>
        )}
        <div className="absolute top-2 right-2">
          <StatusBadge status={business.status} />
        </div>
        {business.category && (
          <div className="absolute top-2 left-2">
            <Badge variant="default" className="text-[10px]">
              {business.category.name}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-3 space-y-2">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1">
            {business.name}
          </h3>
          {business.ownerName && (
            <p className="text-xs text-gray-500 mt-0.5">{business.ownerName}</p>
          )}
        </div>

        {business.address && (
          <div className="flex items-start gap-1.5 text-xs text-gray-500">
            <MapPin size={11} className="mt-0.5 flex-shrink-0 text-primary" />
            <span className="line-clamp-1">{business.address}</span>
          </div>
        )}

        {(business.openTime || business.is24Hours) && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock size={11} className="flex-shrink-0 text-primary" />
            <span>
              {business.is24Hours
                ? '24 Hours'
                : `${business.openTime} – ${business.closeTime}`}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          {business.phone && (
            <a
              href={`tel:${business.phone}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-xs text-primary font-medium"
            >
              <Phone size={11} />
              <span>{business.phone}</span>
            </a>
          )}
          {business.hasDelivery && (
            <div className="flex items-center gap-1 text-xs text-green-600">
              <Truck size={11} />
              <span>Delivery</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
