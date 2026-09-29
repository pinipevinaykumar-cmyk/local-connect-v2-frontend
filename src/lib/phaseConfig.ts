'use client';

export type PhaseStatus = 'pending' | 'active' | 'completed';

export type PhaseConfig = {
  n: number;
  icon: string;
  label: string;
  desc: string;
  scheduledDate: string; // ISO datetime string
  status: PhaseStatus;
  activatedAt?: string;
  autoActivate: boolean;
};

const STORAGE_KEY = 'bmpl_phase_config_v1';

export const DEFAULT_PHASES: PhaseConfig[] = [
  {
    n: 1, icon: '📝', label: 'Player Registration',
    desc: 'Players register, upload photo & Aadhaar, and submit application.',
    scheduledDate: '2027-10-01T00:00',
    status: 'active',
    activatedAt: '2027-10-01T00:00',
    autoActivate: true,
  },
  {
    n: 2, icon: '✅', label: 'Player Verification',
    desc: 'Admin verifies Aadhaar and village eligibility. Players get Verified / Pending / Rejected status.',
    scheduledDate: '2027-11-01T00:00',
    status: 'pending',
    autoActivate: false,
  },
  {
    n: 3, icon: '🏆', label: 'Captain Nominations',
    desc: 'Any verified player can nominate themselves for captaincy.',
    scheduledDate: '2027-11-11T09:00',
    status: 'pending',
    autoActivate: false,
  },
  {
    n: 4, icon: '🗳️', label: 'Player Voting',
    desc: 'All verified BMPL players cast one vote for their preferred captain.',
    scheduledDate: '2027-11-12T09:00',
    status: 'pending',
    autoActivate: false,
  },
  {
    n: 5, icon: '👑', label: 'Captain Results',
    desc: 'Top 10 vote-getters are announced as team captains.',
    scheduledDate: '2027-11-14T18:00',
    status: 'pending',
    autoActivate: false,
  },
  {
    n: 6, icon: '🎯', label: 'Player Auction',
    desc: 'Captains bid on verified players to build their squads.',
    scheduledDate: '2027-11-15T09:00',
    status: 'pending',
    autoActivate: false,
  },
  {
    n: 7, icon: '🏏', label: 'Tournament Begins',
    desc: 'Group stage kicks off across Biccavolu Mandal grounds.',
    scheduledDate: '2027-11-20T08:00',
    status: 'pending',
    autoActivate: false,
  },
];

export function loadPhases(): PhaseConfig[] {
  if (typeof window === 'undefined') return DEFAULT_PHASES;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as PhaseConfig[];
      if (parsed.length === DEFAULT_PHASES.length) return parsed;
    }
  } catch {}
  return DEFAULT_PHASES;
}

export function savePhases(phases: PhaseConfig[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(phases));
}

export function getCurrentPhase(phases: PhaseConfig[]): number {
  const active = phases.filter((p) => p.status === 'active');
  if (active.length === 0) return 1;
  return Math.max(...active.map((p) => p.n));
}

export function resetPhases(): void {
  localStorage.removeItem(STORAGE_KEY);
}
