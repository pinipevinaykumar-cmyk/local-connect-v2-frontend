import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E7B3B',
        secondary: '#2F855A',
        accent: '#F59E0B',
        background: '#F8FAFC',
        card: '#FFFFFF',
        'text-main': '#0F172A',
      },
      borderRadius: {
        DEFAULT: '16px',
        lg: '16px',
        md: '12px',
        sm: '8px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        mobile: '480px',
      },
    },
  },
  plugins: [],
} satisfies Config;
