'use client';

import { Lock } from 'lucide-react';

export default function ScoresPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-6 flex flex-col items-center justify-center gap-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#f5f3ed] text-4xl">📊</div>
      <h2 className="text-2xl font-extrabold text-[#17352a]">Live Scores</h2>
      <p className="text-sm text-[#5f6d64] text-center max-w-sm">
        Live match scores and ball-by-ball updates will be available once the tournament begins on <strong>Nov 20, 2027</strong>.
      </p>
      <div className="flex items-center gap-2 rounded-full bg-[#f5f3ed] px-5 py-2.5 text-xs font-bold text-[#9aab9e]">
        <Lock size={12} /> Unlocks on Nov 20, 2027
      </div>
    </div>
  );
}
