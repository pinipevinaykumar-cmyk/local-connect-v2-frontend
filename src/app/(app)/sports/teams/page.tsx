'use client';

import { useRouter } from 'next/navigation';
import { Plus, Users } from 'lucide-react';

type Team = {
  id: number;
  name: string;
  village: string;
  captain: string;
  players: number;
  matches: number;
  won: number;
  lost: number;
  color: string;
};

const teams: Team[] = [];

export default function TeamsPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#17352a]">Teams</h2>
          <p className="text-sm text-[#5f6d64]">Registered teams in your area</p>
        </div>
        <button
          onClick={() => router.push('/sports/teams/create')}
          className="inline-flex items-center gap-2 rounded-full bg-[#1E7B3B] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2d9b4e] transition-colors"
        >
          <Plus size={16} /> Create Team
        </button>
      </div>

      {teams.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {teams.map((t) => (
            <div key={t.id} className="rounded-2xl border border-[#d9ded2] bg-white overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer">
              <div className="h-2" style={{ background: t.color }} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-black text-white" style={{ background: t.color }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#17352a]">{t.name}</h3>
                      <p className="text-xs text-[#5f6d64]">{t.village} · Cap: {t.captain}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#5f6d64]">
                    <Users size={12} /> {t.players} players
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[['Matches', t.matches], ['Won', t.won], ['Lost', t.lost]].map(([label, val]) => (
                    <div key={label as string} className="rounded-xl bg-[#f5f3ed] p-3 text-center">
                      <p className="text-lg font-extrabold text-[#17352a]">{val}</p>
                      <p className="text-[10px] text-[#9aab9e] uppercase tracking-wide">{label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 rounded-xl bg-[#1E7B3B] py-2 text-xs font-bold text-white hover:bg-[#2d9b4e] transition-colors">View Team</button>
                  <button className="flex-1 rounded-xl border border-[#d9ded2] py-2 text-xs font-bold text-[#17352a] hover:border-[#17352a]/40 transition-colors">Join Team</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl border border-dashed border-[#d9ded2] bg-white">
          <span className="text-4xl">👥</span>
          <p className="text-sm font-bold text-[#17352a]">No teams registered yet</p>
          <p className="text-xs text-[#9aab9e]">Create a team and invite players to join</p>
          <button onClick={() => router.push('/sports/teams/create')}
            className="mt-1 rounded-full bg-[#1E7B3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#2d9b4e] transition-colors">
            Create Team
          </button>
        </div>
      )}
    </div>
  );
}
