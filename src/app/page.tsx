import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  HeartPulse,
  LockKeyhole,
  MapPin,
  MoveUpRight,
  ShieldCheck,
  Sparkles,
  Store,
  Users,
} from 'lucide-react';

const trustPoints = [
  { icon: ShieldCheck, title: 'Built on trust', text: 'A dependable digital home for your local community.' },
  { icon: BadgeCheck, title: 'Verified locally', text: 'Profiles and providers are shaped by the people nearby.' },
  { icon: LockKeyhole, title: 'Your account, your space', text: 'Your community experience stays secure and personal.' },
  { icon: Users, title: 'Growing together', text: 'A stronger network starts with one more neighbour.' },
];

const customerBenefits = [
  { icon: HeartPulse, title: 'Feel looked after', text: 'Reach the local support and resources your household needs.' },
  { icon: MapPin, title: 'Stay connected nearby', text: 'A simpler way to take part in the life of your community.' },
  { icon: Sparkles, title: 'Discover with confidence', text: 'Explore a trusted network once you have joined.' },
];

const merchantBenefits = [
  { icon: Store, title: 'Be easier to find', text: 'Create a trusted digital presence for your local business.' },
  { icon: Building2, title: 'Grow your reach', text: 'Connect with customers who want to support businesses nearby.' },
  { icon: MoveUpRight, title: 'Move forward together', text: 'Build lasting relationships in the community you serve.' },
];

export default function LandingPage() {
  return (
    <main className="landing-page min-h-dvh overflow-hidden bg-[#f5f3ed] text-[#17352a]">
      <section className="landing-hero relative min-h-[720px] text-white">
        <div className="landing-hero-image absolute inset-0" />
        <div className="landing-hero-shade absolute inset-0" />
        <div className="relative mx-auto flex min-h-[720px] max-w-7xl flex-col px-5 pb-12 sm:px-8 lg:px-12">
          <nav className="flex items-center justify-between border-b border-white/20 py-5" aria-label="Main navigation">
            <Link href="/" className="flex items-center gap-3" aria-label="Local Connect home">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9ae4a] text-[#17352a] shadow-lg shadow-black/10">
                <span className="text-xl font-black">LC</span>
              </span>
              <span className="text-lg font-bold tracking-[-0.02em]">Local Connect</span>
            </Link>
            <div className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
              <a href="#why-local-connect" className="transition-colors hover:text-white">Why Local Connect</a>
              <a href="#for-you" className="transition-colors hover:text-white">For your community</a>
              <Link href="/login" className="rounded-full border border-white/40 px-5 py-2.5 text-white transition-colors hover:bg-white hover:text-[#17352a]">Login</Link>
            </div>
            <Link href="/login" className="rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white md:hidden">Login</Link>
          </nav>

          <div className="flex flex-1 items-center py-20 lg:py-24">
            <div className="max-w-3xl">
              <p className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-[#f3c875]">
                <span className="h-px w-8 bg-[#f3c875]" /> A better way to belong
              </p>
              <h1 className="max-w-3xl text-5xl font-extrabold leading-[0.98] tracking-[-0.05em] sm:text-6xl lg:text-8xl">
                Your Community. Your People. Your Network.
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
                Join a trusted community platform that brings residents, local businesses, and essential services together while creating new opportunities for growth and connection.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="/register?type=CUSTOMER" className="group inline-flex h-14 items-center justify-center gap-3 rounded-full bg-[#e9ae4a] px-7 font-bold text-[#17352a] shadow-xl shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-[#f3c875]">
                  Register as Customer <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/register?type=MERCHANT" className="inline-flex h-14 items-center justify-center gap-3 rounded-full border border-white/50 bg-white/10 px-7 font-bold text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/20">
                  Register as Merchant <Store size={18} />
                </Link>
              </div>
              <p className="mt-5 text-sm text-white/70">Already have an account? <Link href="/login" className="font-bold text-white underline decoration-[#e9ae4a] underline-offset-4">Login</Link></p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold text-white/70">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/30"><MapPin size={14} /></span>
            Rooted in Andhra Pradesh · Made for local life
          </div>
        </div>
      </section>

      <section id="why-local-connect" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mb-10 max-w-xl">
          <p className="section-kicker">A network you can trust</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] sm:text-5xl">The confidence of knowing you belong.</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map(({ icon: Icon, title, text }) => (
            <div key={title} className="trust-card rounded-2xl border border-[#d9ded2] bg-white/70 p-6">
              <div className="mb-10 flex h-11 w-11 items-center justify-center rounded-xl bg-[#e3eee2] text-[#2d7148]"><Icon size={20} /></div>
              <h3 className="font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#5f6d64]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="for-you" className="border-y border-[#d9ded2] bg-[#e6eee3] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="section-kicker">One platform, two ways to grow</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] sm:text-5xl">Your next chapter starts close to home.</h2>
              <p className="mt-5 max-w-md leading-7 text-[#5f6d64]">Whether you are building a livelihood or finding your people, Local Connect helps your community move forward together.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <BenefitGroup label="For customers" items={customerBenefits} />
              <BenefitGroup label="For merchants" items={merchantBenefits} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#17352a] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="section-kicker text-[#f3c875]">Start with your community</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-[-0.04em] sm:text-5xl">There is more waiting on the other side of joining.</h2>
          </div>
          <Link href="/register" className="group inline-flex h-14 shrink-0 items-center gap-3 rounded-full bg-[#e9ae4a] px-7 font-bold text-[#17352a] transition-all hover:bg-[#f3c875]">Create your account <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></Link>
        </div>
      </section>

      <footer className="flex flex-col gap-3 bg-[#10271f] px-5 py-8 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <span className="font-bold text-white/80">Local Connect</span>
        <span>For the people, places, and possibilities close to home.</span>
      </footer>
    </main>
  );
}

function BenefitGroup({ label, items }: { label: string; items: typeof customerBenefits }) {
  return (
    <div className="rounded-2xl border border-[#cfdccd] bg-white/70 p-6 sm:p-7">
      <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.18em] text-[#2d7148]">{label}</h3>
      <div className="space-y-5">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex gap-4">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f3c875]/30 text-[#9a6b1d]"><Icon size={17} /></span>
            <div><h4 className="font-bold">{title}</h4><p className="mt-1 text-sm leading-5 text-[#5f6d64]">{text}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
