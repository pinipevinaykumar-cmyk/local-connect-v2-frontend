import Link from 'next/link';
import { ArrowRight, Heart, ShoppingBag, Briefcase, Users } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Healthcare',
    description: 'Find doctors, clinics & pharmacies near you',
    color: 'text-red-500',
    bg: 'bg-red-50',
  },
  {
    icon: ShoppingBag,
    title: 'Businesses',
    description: 'Shops, restaurants & local stores',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    icon: Briefcase,
    title: 'Services',
    description: 'Plumbers, electricians & more',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Stay updated with local news',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh flex flex-col" style={{ background: 'linear-gradient(160deg, #0F172A 0%, #1E3A2F 50%, #1E7B3B 100%)' }}>
      {/* Header section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8 text-center">
        {/* Logo mark */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-[24px] bg-gradient-to-br from-[#1E7B3B] to-[#2F855A] flex items-center justify-center shadow-2xl shadow-primary/30">
            <span className="text-5xl">🌿</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-lg">
            <span className="text-sm font-black text-white">LC</span>
          </div>
        </div>

        {/* Brand name */}
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
          Local Connect
        </h1>
        <p className="text-lg text-white/70 font-medium mb-2">
          One Place for Everything
        </p>
        <p className="text-sm text-white/50 max-w-xs leading-relaxed">
          Connecting villages across Andhra Pradesh with local businesses, healthcare, and community.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 w-full max-w-xs mt-10">
          <Link
            href="/register"
            className="flex items-center justify-center gap-2 h-14 bg-primary hover:bg-secondary text-white font-bold text-base rounded-[16px] transition-all duration-200 active:scale-95 shadow-lg shadow-primary/30"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 h-14 bg-white/10 backdrop-blur-sm text-white font-semibold text-base rounded-[16px] border border-white/20 hover:bg-white/20 transition-all duration-200 active:scale-95"
          >
            Login to Your Account
          </Link>
        </div>
      </div>

      {/* Features section */}
      <div className="px-4 pb-10">
        <p className="text-center text-white/50 text-xs font-medium mb-4 uppercase tracking-widest">
          What&apos;s inside
        </p>
        <div className="grid grid-cols-2 gap-3">
          {features.map(({ icon: Icon, title, description, color, bg }) => (
            <div
              key={title}
              className="bg-white/8 backdrop-blur-sm rounded-[16px] p-4 border border-white/10"
            >
              <div className={`w-9 h-9 rounded-[10px] ${bg} flex items-center justify-center mb-3`}>
                <Icon size={18} className={color} />
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
              <p className="text-white/50 text-xs leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pb-8 text-center">
        <p className="text-white/30 text-xs">
          Made with ❤️ for Andhra Pradesh
        </p>
      </div>
    </div>
  );
}
