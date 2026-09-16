import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const QUOTES: Record<string, string[]> = {
  earlyMorning: [
    'Rise early, the chai is getting cold ☕',
    'The rooster already called — your area is up 🐓',
    'Early bird gets the fresh vegetables 🥬',
    'Market opens early, don\'t miss the fresh catch 🐟',
  ],
  morning: [
    'Idli ready, sambhar waiting — get your day going 🍛',
    'Morning roti smells are already in the air 🫓',
    'Tea in hand, Local Connect in heart — let\'s go ☕',
    'The milk vendor already passed — hope you got yours 🥛',
    'Fresh from the farm, straight to your door 🌾',
  ],
  afternoon: [
    'Lunch digested, afternoon nap calling... but first, shop 😄',
    'Hot sun outside — find what you need right here ☀️',
    'Afternoon craving hitting? Your local shop has it 🛒',
    'Your chicken biryani won\'t order itself 🍗',
    'Perfect time to discover what\'s near you 🏘️',
  ],
  evening: [
    'Evening snack time — samosa or pakoda? 🧆',
    'Sunset, cool breeze, and local shops waiting 🌅',
    'Tea time! Your neighbourhood shop is open 🍵',
    'The market is buzzing — don\'t miss the evening fresh stock 🥦',
    'Almost dinner time — check what\'s near you 🍽️',
  ],
  night: [
    'Craving something late night? Let\'s find it 🌙',
    'Night owl mode ON — who\'s still open? 🦉',
    'Waiting for your chicken to arrive? Check local shops 🍗',
    'Stars out, shops listed — explore what\'s near you 🌟',
    'Late night hunger is real — local shops to the rescue 😅',
  ],
};

export function getGreeting(): string {
  const hour = new Date().getHours();
  let pool: string[];
  if (hour >= 4 && hour < 6)  pool = QUOTES.earlyMorning;
  else if (hour >= 6 && hour < 12) pool = QUOTES.morning;
  else if (hour >= 12 && hour < 17) pool = QUOTES.afternoon;
  else if (hour >= 17 && hour < 21) pool = QUOTES.evening;
  else pool = QUOTES.night;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function formatPhone(phone: string): string {
  return phone.replace(/(\d{5})(\d{5})/, '$1 $2');
}

export function validatePhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone);
}

export function validatePassword(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['#EF4444', '#F59E0B', '#3B82F6', '#1E7B3B'];

  return {
    score,
    label: labels[score - 1] || 'Too short',
    color: colors[score - 1] || '#E5E7EB',
  };
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
