'use client';

import { useRouter } from 'next/navigation';
import { MapPin, Users, Plus } from 'lucide-react';

type Venue = {
  id: number;
  name: string;
  village: string;
  type: string;
  capacity: number;
  surface: string;
  hasFloodlights: boolean;
  hasChangingRooms: boolean;
  upcomingMatches: number;
  emoji: string;
};

function Badge({ label, active }: { label: string; active: boolean }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${active ? 'bg-green-100 text-green-700' : 'bg-[#f5f3ed] text-[#9aab9e]'}`}>
      {label}
    </span>
  );
}

const venues: Venue[] = [];

export default function VenuesPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:px-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#17352a]">Venues</h2>
          <p className="text-sm text-[#5f6d64]">Cricket grounds and facilities in your area</p>
        </div>
        <button
          onClick={() => router.push('/sports/venues/create')}
          className="inline-flex items-center gap-2 rounded-full bg-[#1E7B3B] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2d9b4e] transition-colors"
        >
          <Plus size={16} /> Add Venue
        </button>
      </div>

      {venues.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {venues.map((v) => (
            <div key={v.id} className="rounded-2xl border border-[#d9ded2] bg-white overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer">
              <div className="h-28 bg-gradient-to-br from-[#0a2016] to-[#1E7B3B] flex items-center justify-center">
                <span className="text-5xl">{v.emoji}</span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-[#17352a]">{v.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-[#5f6d64]">
                      <MapPin size={10} className="shrink-0" /> {v.village} · {v.type}
                    </div>
                  </div>
                  {v.upcomingMatches > 0 && (
                    <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                      {v.upcomingMatches} match{v.upcomingMatches > 1 ? 'es' : ''} soon
                    </span>
                  )}
                </div>
                <div className="mb-3 flex items-center gap-4 text-xs text-[#5f6d64]">
                  <div className="flex items-center gap-1"><Users size={11} /> {v.capacity.toLocaleString()} cap</div>
                  <div>Surface: <span className="font-semibold text-[#17352a]">{v.surface}</span></div>
                </div>
                <div className="mb-4 flex flex-wrap gap-1.5">
                  <Badge label="Floodlights"    active={v.hasFloodlights} />
                  <Badge label="Changing Rooms" active={v.hasChangingRooms} />
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 rounded-xl bg-[#1E7B3B] py-2 text-xs font-bold text-white hover:bg-[#2d9b4e] transition-colors">View Details</button>
                  <button className="flex-1 rounded-xl border border-[#d9ded2] py-2 text-xs font-bold text-[#17352a] hover:border-[#17352a]/40 transition-colors">Book Venue</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl border border-dashed border-[#d9ded2] bg-white">
          <span className="text-4xl">🏟</span>
          <p className="text-sm font-bold text-[#17352a]">No venues listed yet</p>
          <p className="text-xs text-[#9aab9e]">Add the cricket grounds in your area</p>
          <button onClick={() => router.push('/sports/venues/create')}
            className="mt-1 rounded-full bg-[#1E7B3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#2d9b4e] transition-colors">
            Add Venue
          </button>
        </div>
      )}
    </div>
  );
}
