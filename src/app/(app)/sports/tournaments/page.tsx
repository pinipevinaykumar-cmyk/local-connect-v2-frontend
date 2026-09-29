'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Plus, Trophy, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tournament = {
  id: number;
  name: string;
  location: string;
  ground: string;
  startDate: string;
  endDate: string;
  prize: string;
  entryFee: string;
  matchType: string;
  teamsIn: number;
  maxTeams: number;
  deadline: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED';
  organiser: string;
};

const STATUS_STYLE: Record<string, string> = {
  UPCOMING:  'bg-green-100 text-green-700',
  ONGOING:   'bg-red-100 text-red-700',
  COMPLETED: 'bg-gray-100 text-gray-500',
};

const tournaments: Tournament[] = [];

export default function TournamentsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'ALL' | 'UPCOMING' | 'ONGOING' | 'COMPLETED'>('ALL');

  const filtered = filter === 'ALL' ? tournaments : tournaments.filter((t) => t.status === filter);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#17352a]">Tournaments</h2>
          <p className="text-sm text-[#5f6d64]">Find and join tournaments near your location</p>
        </div>
        <button
          onClick={() => router.push('/sports/tournaments/create')}
          className="inline-flex items-center gap-2 rounded-full bg-[#1E7B3B] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2d9b4e] transition-colors"
        >
          <Plus size={16} /> Create Tournament
        </button>
      </div>

      <div className="mb-5 flex gap-2">
        {(['ALL', 'UPCOMING', 'ONGOING', 'COMPLETED'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn('rounded-full px-4 py-1.5 text-xs font-semibold transition-colors',
              filter === f ? 'bg-[#1E7B3B] text-white' : 'border border-[#d9ded2] bg-white text-[#5f6d64] hover:border-[#1E7B3B]/40')}>
            {f === 'ALL' ? 'All' : f[0] + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((t) => (
            <div key={t.id} className="rounded-2xl border border-[#d9ded2] bg-white p-5 hover:-translate-y-0.5 hover:shadow-md transition-all">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-bold text-[#17352a]">{t.name}</h3>
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold', STATUS_STYLE[t.status])}>
                      {t.status[0] + t.status.slice(1).toLowerCase()}
                    </span>
                    <span className="rounded-full bg-[#1E7B3B]/10 px-2 py-0.5 text-[10px] font-bold text-[#1E7B3B]">{t.matchType}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-[#5f6d64] sm:grid-cols-3">
                    <div className="flex items-center gap-1.5"><MapPin size={11} className="text-[#1E7B3B]" />{t.ground}, {t.location}</div>
                    <div className="flex items-center gap-1.5"><span>📅</span>{t.startDate} – {t.endDate}</div>
                    <div className="flex items-center gap-1.5"><span>💰</span>Prize: <strong className="text-[#17352a]">{t.prize}</strong></div>
                    <div className="flex items-center gap-1.5"><span>🎟️</span>Entry: {t.entryFee}/team</div>
                    <div className="flex items-center gap-1.5"><span>⏳</span>Deadline: {t.deadline}</div>
                    <div className="flex items-center gap-1.5"><span>🏅</span>By: {t.organiser}</div>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <Users size={12} className="text-[#5f6d64] shrink-0" />
                    <span className="text-xs text-[#5f6d64]">{t.teamsIn}/{t.maxTeams} teams registered</span>
                    <div className="flex-1 h-1.5 rounded-full bg-[#f5f3ed] overflow-hidden max-w-[120px]">
                      <div className={cn('h-full rounded-full', t.teamsIn >= t.maxTeams ? 'bg-red-500' : 'bg-[#1E7B3B]')}
                        style={{ width: `${(t.teamsIn / t.maxTeams) * 100}%` }} />
                    </div>
                    {t.teamsIn >= t.maxTeams && <span className="text-[10px] font-bold text-red-600">FULL</span>}
                  </div>
                </div>
                {t.status === 'UPCOMING' && (
                  <div className="flex gap-2 sm:flex-col sm:items-end">
                    <button className="flex-1 sm:flex-none rounded-xl bg-[#1E7B3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#2d9b4e] transition-colors">Register Team</button>
                    <button className="flex-1 sm:flex-none rounded-xl border border-[#d9ded2] px-4 py-2 text-xs font-bold text-[#17352a] hover:border-[#17352a]/40 transition-colors">View Details</button>
                  </div>
                )}
                {t.status === 'COMPLETED' && (
                  <button className="rounded-xl border border-[#d9ded2] px-4 py-2 text-xs font-bold text-[#5f6d64] hover:border-[#17352a]/40 transition-colors">View Results</button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl border border-dashed border-[#d9ded2] bg-white">
          <Trophy size={36} className="text-[#d9ded2]" />
          <p className="text-sm font-bold text-[#17352a]">No tournaments yet</p>
          <p className="text-xs text-[#9aab9e]">Create one and invite teams to register</p>
          <button onClick={() => router.push('/sports/tournaments/create')}
            className="mt-1 rounded-full bg-[#1E7B3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#2d9b4e] transition-colors">
            Create Tournament
          </button>
        </div>
      )}
    </div>
  );
}
