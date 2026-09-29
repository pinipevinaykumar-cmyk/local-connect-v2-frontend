export const BMPL_REG_KEY = 'bmpl_player_registration_v1';

export type BmplRegistration = {
  registrationId: string;
  name: string;
  village: string;
  role: string;
  age: string;
  mobile: string;
  submittedAt: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  photoUrl?: string;
};

export function loadBmplRegistration(): BmplRegistration | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(BMPL_REG_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
