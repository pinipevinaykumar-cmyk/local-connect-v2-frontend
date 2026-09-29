'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

type Match = {
  id: number;
  tournament: string;
  matchNo: string;
  team1: string;
  team2: string;
  date: string;
  time: string;
  venue: string;
  village: string;
  type: string;
  daysLeft: number;
};

function urgencyColor(days: number) {
  if (days <= 2) return 'bg-red-100 text-red-700';
  if (days <= 7) return 'bg-amber-100 text-amber-700';
  return 'bg-[#f5f3ed] text-[#5f6d64]';
}

const matches: Match[] = [];

export default function UpcomingPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#17352a]">Upcoming Matches</h2>
          <p className="text-sm text-[#5f6d64]">Scheduled fixtures in your area</p>
        </div>
        <button
          onClick={() => router.push('/sports/tournaments/create')}
          className="inline-flex items-center gap-2 rounded-full bg-[#1E7B3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#2d9b4e] transition-colors"
        >
          <Plus size={14} /> Create Tournament
        </button>
      </div>

      {matches.length > 0 ? (
        <div className="space-y-3">
          {matches.map((m) => (
            <div
              key={m.id}
              onClick={() => router.push('/sports/scores')}
              className="rounded-2xl border border-[#d9ded2] bg-white overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between px-5 py-2.5 bg-[#f5f3ed] border-b border-[#d9ded2]">
                <p className="text-xs text-[#5f6d64]">
                  <span className="font-semibold text-[#17352a]">{m.tournament}</span>
                  <span className="mx-1.5">·</span>{m.matchNo}
                </p>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#0a2016] px-2 py-0.5 text-[10px] font-bold text-white">{m.type}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${urgencyColor(m.daysLeft)}`}>
                    {m.daysLeft === 0 ? 'Today' : m.daysLeft === 1 ? 'Tomorrow' : `In ${m.daysLeft} days`}
                  </span>
                </div>
              </div>
              <div className="px-5 py-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E7B3B] text-xs font-black text-white">{m.team1[0]}</div>
                    <p className="font-semibold text-[#17352a] text-sm">{m.team1}</p>
                  </div>
                  <span className="text-xs font-bold text-[#9aab9e]">vs</span>
                  <div className="flex-1 flex items-center justify-end gap-2">
                    <p className="font-semibold text-[#17352a] text-sm">{m.team2}</p>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a4f8a] text-xs font-black text-white">{m.team2[0]}</div>
                  </div>
                </div>
                <p className="text-xs text-[#5f6d64]">{m.venue} · {m.date} · {m.time}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl border border-dashed border-[#d9ded2] bg-white">
          <span className="text-4xl">📅</span>
          <p className="text-sm font-bold text-[#17352a]">No upcoming matches scheduled</p>
          <p className="text-xs text-[#9aab9e]">Create a tournament to schedule fixtures</p>
          <button onClick={() => router.push('/sports/tournaments/create')}
            className="mt-1 rounded-full bg-[#1E7B3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#2d9b4e] transition-colors">
            Create Tournament
          </button>
        </div>
      )}
    </div>
  );
}
