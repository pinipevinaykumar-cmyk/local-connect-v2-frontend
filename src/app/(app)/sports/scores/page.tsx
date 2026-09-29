'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

export default function LiveScoresPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#17352a]">Live Scores</h2>
          <p className="text-sm text-[#5f6d64]">Ball-by-ball scoring for active matches</p>
        </div>
        <button
          onClick={() => router.push('/sports/tournaments/create')}
          className="inline-flex items-center gap-2 rounded-full bg-[#1E7B3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#2d9b4e] transition-colors"
        >
          <Plus size={14} /> Start Match
        </button>
      </div>

      <div className="flex flex-col items-center justify-center py-20 gap-4 rounded-2xl border border-dashed border-[#d9ded2] bg-white">
        <span className="text-5xl">🔴</span>
        <p className="text-base font-bold text-[#17352a]">No live matches right now</p>
        <p className="text-sm text-[#9aab9e] text-center max-w-xs">
          When a match is scored live, the scorecard will appear here in real time.
        </p>
        <div className="flex gap-3 mt-1">
          <button
            onClick={() => router.push('/sports/tournaments')}
            className="rounded-full bg-[#1E7B3B] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2d9b4e] transition-colors"
          >
            View Tournaments
          </button>
          <button
            onClick={() => router.push('/sports/upcoming')}
            className="rounded-full border border-[#d9ded2] px-5 py-2.5 text-sm font-bold text-[#17352a] hover:border-[#17352a]/40 transition-colors"
          >
            Upcoming Fixtures
          </button>
        </div>
      </div>
    </div>
  );
}
