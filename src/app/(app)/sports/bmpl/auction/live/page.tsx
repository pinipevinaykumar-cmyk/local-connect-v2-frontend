'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const TEAMS = [
  { id: 1, name: 'Biccavolu Royals',    short: 'BRC', color: '#1E7B3B', budget: 10000, spent: 1800 },
  { id: 2, name: 'Pandalapaka Tigers',  short: 'PKT', color: '#F59E0B', budget: 10000, spent: 2400 },
  { id: 3, name: 'Undi Warriors',       short: 'UNW', color: '#1a4f8a', budget: 10000, spent: 500  },
  { id: 4, name: 'Ramavaram XI',        short: 'RXI', color: '#9a3412', budget: 10000, spent: 1200 },
  { id: 5, name: 'Kotipalli Kings',     short: 'KKG', color: '#6d28d9', budget: 10000, spent: 900  },
  { id: 6, name: 'Ravulapalem Raiders', short: 'RVR', color: '#0e7490', budget: 10000, spent: 700  },
  { id: 7, name: 'Polavaram Panthers',  short: 'PPT', color: '#be185d', budget: 10000, spent: 1100 },
  { id: 8, name: 'Mandal All-Stars',    short: 'MAS', color: '#374151', budget: 10000, spent: 600  },
];

const CURRENT_PLAYER = {
  name: 'Srinivas Rao',
  village: 'Undi',
  role: 'Batsman',
  age: 28,
  basePrice: 1000,
};

const BID_HISTORY = [
  { team: 'Biccavolu Royals',    color: '#1E7B3B', amount: 2200, time: '0:42' },
  { team: 'Pandalapaka Tigers',  color: '#F59E0B', amount: 2000, time: '0:35' },
  { team: 'Undi Warriors',       color: '#1a4f8a', amount: 1800, time: '0:28' },
  { team: 'Biccavolu Royals',    color: '#1E7B3B', amount: 1600, time: '0:20' },
  { team: 'Kotipalli Kings',     color: '#6d28d9', amount: 1400, time: '0:15' },
];

export default function LiveAuctionPage() {
  const router = useRouter();
  const [timer, setTimer] = useState(42);
  const [currentBid, setCurrentBid] = useState(2200);
  const [leadingTeam, setLeadingTeam] = useState(TEAMS[0]);
  const [bids, setBids] = useState(BID_HISTORY);
  const [sold, setSold] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          setSold(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, []);

  function placeBid(increment: number) {
    const newBid = currentBid + increment;
    setCurrentBid(newBid);
    setTimer(60);
    setSold(false);
    const myTeam = TEAMS[1]; // Pandalapaka Tigers (demo)
    setLeadingTeam(myTeam);
    setBids((prev) => [{ team: myTeam.name, color: myTeam.color, amount: newBid, time: '0:00' }, ...prev.slice(0, 4)]);
  }

  const timerPct = (timer / 60) * 100;
  const timerColor = timer > 20 ? '#1E7B3B' : timer > 10 ? '#F59E0B' : '#ef4444';

  return (
    <div className="min-h-screen bg-[#060f0b] text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-white/10 bg-[#060f0b]/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:text-white transition-colors">
            <ArrowLeft size={15} />
          </button>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-[0.1em]">Live Auction</span>
          </div>
          <span className="text-xs text-white/40">·</span>
          <span className="text-xs text-white/60">BMPL 2024 · Player #3 of 47</span>
          <div className="ml-auto text-xs text-white/40">Nov 15, 2024</div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

          {/* Main auction area */}
          <div className="space-y-5">

            {/* Current player card */}
            <div className={`relative rounded-3xl border-2 overflow-hidden transition-all ${sold ? 'border-[#F59E0B]' : 'border-white/10'}`}>
              <div className="bg-[#0a2016] px-6 py-8">
                <div className="flex items-start gap-6">
                  {/* Player avatar */}
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-[#1E7B3B]/20 border border-[#1E7B3B]/30 text-4xl font-black text-[#1E7B3B]">
                    {CURRENT_PLAYER.name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#F59E0B]">Now Auctioning</p>
                    <h2 className="text-3xl font-black mt-1 tracking-tight">{CURRENT_PLAYER.name}</h2>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold">{CURRENT_PLAYER.village}</span>
                      <span className="rounded-full bg-[#1E7B3B]/20 border border-[#1E7B3B]/30 px-2.5 py-1 text-xs font-semibold text-[#4ade80]">{CURRENT_PLAYER.role}</span>
                      <span className="text-xs text-white/40">Age {CURRENT_PLAYER.age}</span>
                    </div>
                    <p className="mt-2 text-xs text-white/40">Base Price: <span className="text-white/70 font-semibold">₹{CURRENT_PLAYER.basePrice.toLocaleString()}</span></p>
                  </div>
                </div>

                {/* Current bid */}
                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/40">Current Bid</p>
                    <p className="text-5xl font-black text-[#F59E0B] mt-1 tabular-nums">
                      ₹{currentBid.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-3 w-3 rounded-full" style={{ background: leadingTeam.color }} />
                      <span className="text-sm font-semibold text-white/80">{leadingTeam.name}</span>
                      <span className="text-xs text-white/40">is winning</span>
                    </div>
                  </div>

                  {/* SOLD overlay */}
                  {sold && (
                    <div className="text-right">
                      <div className="inline-block rounded-2xl bg-[#F59E0B] px-6 py-3">
                        <p className="text-2xl font-black text-[#17352a]">SOLD!</p>
                        <p className="text-xs font-bold text-[#17352a]">{leadingTeam.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Timer bar */}
              {!sold && (
                <div className="bg-[#060f0b] px-6 py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-[0.1em] text-white/40">Time Remaining</span>
                    <span className="text-2xl font-black tabular-nums" style={{ color: timerColor }}>
                      {timer}s
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${timerPct}%`, background: timerColor }} />
                  </div>
                </div>
              )}
            </div>

            {/* Bid buttons */}
            {!sold && (
              <div className="rounded-2xl border border-white/10 bg-[#0a2016] p-5">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/40 mb-3">Place Bid <span className="font-normal normal-case">(Pandalapaka Tigers · Budget left: ₹7,600)</span></p>
                <div className="grid grid-cols-3 gap-3">
                  {[100, 200, 500].map((inc) => (
                    <button
                      key={inc}
                      onClick={() => placeBid(inc)}
                      className="rounded-xl bg-[#1E7B3B]/20 border border-[#1E7B3B]/30 py-3 text-sm font-bold text-[#4ade80] hover:bg-[#1E7B3B]/30 transition-colors"
                    >
                      +₹{inc}
                    </button>
                  ))}
                </div>
                <button onClick={() => placeBid(1000)}
                  className="mt-3 w-full rounded-xl bg-[#F59E0B] py-3 text-sm font-extrabold text-[#17352a] hover:bg-[#fbbf24] transition-colors">
                  Bid ₹{(currentBid + 1000).toLocaleString()} (+₹1,000)
                </button>
              </div>
            )}

            {/* Bid history */}
            <div className="rounded-2xl border border-white/10 bg-[#0a2016] overflow-hidden">
              <div className="px-5 py-3 border-b border-white/10">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/40">Bid History</p>
              </div>
              {bids.map((b, i) => (
                <div key={i} className={`flex items-center gap-3 px-5 py-3 border-b border-white/5 last:border-0 ${i === 0 ? 'bg-white/5' : ''}`}>
                  <div className="h-3 w-3 rounded-full shrink-0" style={{ background: b.color }} />
                  <span className="text-sm text-white/70 flex-1">{b.team}</span>
                  <span className="font-bold text-[#F59E0B]">₹{b.amount.toLocaleString()}</span>
                  <span className="text-xs text-white/30">{b.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Teams sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-[#0a2016] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-white/40">Team Budgets</p>
              </div>
              {TEAMS.map((t) => {
                const remaining = t.budget - t.spent;
                const pct = (t.spent / t.budget) * 100;
                return (
                  <div key={t.id} className={`px-4 py-3 border-b border-white/5 last:border-0 ${t.id === leadingTeam.id ? 'bg-white/5' : ''}`}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="h-3 w-3 rounded-full shrink-0" style={{ background: t.color }} />
                      <span className="text-xs font-semibold text-white/80 flex-1 truncate">{t.short}</span>
                      <span className="text-xs font-bold text-[#F59E0B]">₹{remaining.toLocaleString()}</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: t.color }} />
                    </div>
                    <p className="text-[9px] text-white/30 mt-0.5">Spent ₹{t.spent.toLocaleString()} of ₹{t.budget.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
