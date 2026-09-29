'use client';

type Achievement = {
  id: number;
  title: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  holder: string | null;
  date: string | null;
};

const ACHIEVEMENT_DEFS: Omit<Achievement, 'unlocked' | 'holder' | 'date'>[] = [
  { id: 1, title: 'Century Club',      emoji: '💯', description: 'Score 100+ runs in a single innings' },
  { id: 2, title: 'Five-fer',          emoji: '🔥', description: 'Take 5 or more wickets in a single match' },
  { id: 3, title: 'Hat-Trick Hero',    emoji: '🎩', description: 'Take 3 wickets in 3 consecutive balls' },
  { id: 4, title: 'Tournament Winner', emoji: '🏆', description: 'Win a registered tournament' },
  { id: 5, title: 'Man of the Match',  emoji: '⭐', description: 'Be awarded MOTM in 3 or more matches' },
  { id: 6, title: 'Iron Man',          emoji: '💪', description: 'Play 25+ matches on Local Connect Sports' },
  { id: 7, title: 'Opening Stand',     emoji: '🤝', description: '100+ run partnership as openers' },
  { id: 8, title: 'Clean Sweep',       emoji: '🧹', description: 'Win all group stage matches in a tournament' },
  { id: 9, title: 'Boundary King',     emoji: '🏏', description: 'Hit 20+ fours in a single tournament' },
];

const ACHIEVEMENTS: Achievement[] = ACHIEVEMENT_DEFS.map((a) => ({
  ...a,
  unlocked: false,
  holder: null,
  date: null,
}));

export default function AchievementsPage() {
  const unlocked = ACHIEVEMENTS.filter((a) => a.unlocked);
  const locked   = ACHIEVEMENTS.filter((a) => !a.unlocked);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:px-6">
      <div className="mb-6">
        <h2 className="text-xl font-extrabold text-[#17352a]">Achievements</h2>
        <p className="text-sm text-[#5f6d64]">
          {unlocked.length} of {ACHIEVEMENTS.length} milestones unlocked — play matches to earn them
        </p>
      </div>

      {unlocked.length > 0 && (
        <>
          <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-[#1E7B3B] mb-3">🔓 Unlocked</h3>
          <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {unlocked.map((a) => (
              <div key={a.id} className="rounded-2xl border border-[#1E7B3B]/20 bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1E7B3B]/10 text-2xl">{a.emoji}</div>
                  <div className="min-w-0">
                    <p className="font-bold text-[#17352a]">{a.title}</p>
                    <p className="text-xs text-[#5f6d64] mt-0.5 leading-snug">{a.description}</p>
                    {a.holder && <p className="mt-2 text-[10px] font-semibold text-[#1E7B3B]">⭐ {a.holder} · {a.date}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-[#9aab9e] mb-3">🔒 Locked</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {locked.map((a) => (
          <div key={a.id} className="rounded-2xl border border-[#d9ded2] bg-[#fafaf9] p-4 opacity-60">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f5f3ed] text-2xl grayscale">{a.emoji}</div>
              <div className="min-w-0">
                <p className="font-bold text-[#5f6d64]">{a.title}</p>
                <p className="text-xs text-[#9aab9e] mt-0.5 leading-snug">{a.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
