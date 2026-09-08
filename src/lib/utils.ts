import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Good night';
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
