'use client';

import Link from 'next/link';
import { ArrowRight, Clock, MapPin, Search, ShieldCheck, Store } from 'lucide-react';
import { LogoMark } from '@/components/LogoMark';

const chips = [
  { emoji: '🥬', label: 'Groceries' },
  { emoji: '🍅', label: 'Vegetables' },
  { emoji: '🍗', label: 'Meat Shops' },
  { emoji: '🏥', label: 'Doctors' },
  { emoji: '🏫', label: 'Schools' },
  { emoji: '⚽', label: 'Sports' },
  { emoji: '🛠️', label: 'Hardware' },
  { emoji: '⚡', label: 'Electricians' },
  { emoji: '🔧', label: 'Plumbers' },
  { emoji: '💼', label: 'Jobs' },
  { emoji: '🏪', label: 'Businesses' },
];

const categories = [
  { emoji: '🥬', title: 'Groceries & Vegetables', text: 'Fresh groceries, fruits and daily essentials.' },
  { emoji: '🍗', title: 'Meat & Food', text: 'Restaurants, meat shops and local food outlets.' },
  { emoji: '🏥', title: 'Healthcare', text: 'Doctors, hospitals, clinics and pharmacies.' },
  { emoji: '🎓', title: 'Education', text: 'Schools, colleges and coaching centres.' },
  { emoji: '⚽', title: 'Sports & Fitness', text: 'Sports academies, gyms and coaching centres.' },
  { emoji: '🏪', title: 'Local Businesses', text: 'Shops, merchants and local stores.' },
  { emoji: '🛠️', title: 'Home Services', text: 'Electricians, plumbers and mechanics.' },
  { emoji: '👨‍💻', title: 'Professionals', text: 'Engineers, consultants and skilled experts.' },
];

const whyPoints = [
  { icon: MapPin, title: 'Find Everything Nearby', text: 'Discover businesses and services around your location instantly.' },
  { icon: ShieldCheck, title: 'Trusted Local Businesses', text: 'Connect with verified local merchants and professionals.' },
  { icon: Clock, title: 'Save Time', text: 'No need to search multiple platforms. Everything local is in one place.' },
];

export default function LandingPage() {
  return (
    <main className="landing-page min-h-dvh overflow-hidden bg-[#f5f3ed] text-[#17352a]">

      {/* ── Hero ── */}
      <section className="landing-hero relative text-white">
        <div className="landing-hero-image absolute inset-0" />
        <div className="landing-hero-shade absolute inset-0" />

        <div className="relative mx-auto flex max-w-7xl flex-col px-5 pb-14 pt-0 sm:px-8 lg:px-12">

          {/* Nav */}
          <nav className="flex items-center justify-between border-b border-white/20 py-5" aria-label="Main navigation">
            <Link href="/" className="flex items-center gap-2.5" aria-label="Local Connect home">
              <LogoMark className="h-10 w-auto drop-shadow-lg" />
              <span className="text-lg font-bold tracking-[-0.02em]">Local Connect</span>
            </Link>
            <div className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
              <a href="#categories" className="transition-colors hover:text-white">Categories</a>
              <a href="#why-local-connect" className="transition-colors hover:text-white">Why Local Connect</a>
              <Link href="/login" className="rounded-full border border-white/40 px-5 py-2.5 text-white transition-colors hover:bg-white hover:text-[#17352a]">Login</Link>
            </div>
            <Link href="/login" className="rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white md:hidden">Login</Link>
          </nav>

          {/* Hero body */}
          <div className="mx-auto mt-14 w-full max-w-3xl text-center lg:mt-20">

            {/* Headline */}
            <h1 className="text-4xl font-extrabold leading-tight tracking-[-0.04em] sm:text-5xl lg:text-[3.75rem]">
              <span className="block whitespace-nowrap">Everything Around You.</span>
              <span className="block text-[#f3c875]">All in One Place.</span>
            </h1>

            {/* Sub-headline */}
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
              Discover businesses, services, professionals, and opportunities around you through one trusted platform.
            </p>

            {/* Search bar */}
            <div className="mx-auto mt-8 w-full max-w-2xl">
              <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-2xl shadow-black/30 ring-1 ring-white/20">
                <Search size={22} className="shrink-0 text-[#5f6d64]" />
                <input
                  type="text"
                  placeholder="What are you looking for today?"
                  className="flex-1 bg-transparent text-sm font-medium text-[#17352a] placeholder:text-[#9aab9e] outline-none sm:text-base"
                  readOnly
                  onClick={() => window.location.href = '/register'}
                />
                <Link
                  href="/register"
                  className="shrink-0 rounded-xl bg-[#17352a] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#2d7148]"
                >
                  Search
                </Link>
              </div>

              {/* Quick-search chips */}
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {chips.map(({ emoji, label }) => (
                  <Link
                    key={label}
                    href="/register"
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/25"
                  >
                    <span>{emoji}</span> {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/register" className="group inline-flex h-13 items-center justify-center gap-2.5 rounded-full bg-[#e9ae4a] px-7 py-3.5 font-bold text-[#17352a] shadow-xl shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-[#f3c875]">
                Get Started <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/login" className="inline-flex h-13 items-center justify-center gap-2.5 rounded-full border border-white/40 bg-white/10 px-7 py-3.5 font-bold text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/20">
                Login <Store size={17} />
              </Link>
            </div>

            <p className="mt-4 text-xs text-white/60">Already have an account? <Link href="/login" className="font-bold text-white underline decoration-[#e9ae4a] underline-offset-4">Login</Link></p>
          </div>

        </div>
      </section>

      {/* ── Categories ── */}
      <section id="categories" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="section-kicker">Browse by category</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] sm:text-4xl">Find what you need, right where you are.</h2>
          </div>
          <Link href="/register" className="hidden items-center gap-1 text-sm font-bold text-[#2d7148] sm:flex">
            View all <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(({ emoji, title, text }) => (
            <Link
              key={title}
              href="/register"
              className="group flex flex-col gap-3 rounded-2xl border border-[#d9ded2] bg-white/70 p-6 transition-all hover:-translate-y-1 hover:border-[#2d7148]/40 hover:shadow-lg hover:shadow-[#17352a]/8"
            >
              <span className="text-3xl">{emoji}</span>
              <div className="flex-1">
                <h3 className="font-bold text-[#17352a] group-hover:text-[#2d7148]">{title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-[#5f6d64]">{text}</p>
              </div>
              <ArrowRight size={15} className="text-[#9aab9e] transition-transform group-hover:translate-x-1 group-hover:text-[#2d7148]" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Why Local Connect ── */}
      <section id="why-local-connect" className="border-y border-[#d9ded2] bg-[#e6eee3] px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-xl">
            <p className="section-kicker">Why Local Connect</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] sm:text-4xl">One platform for everything local.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {whyPoints.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-[#cfdccd] bg-white/80 p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#e3eee2] text-[#2d7148]">
                  <Icon size={20} />
                </div>
                <h3 className="font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#5f6d64]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Local Ecosystem ── */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="section-kicker">Local Ecosystem</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] sm:text-4xl">Everything local. One platform.</h2>
            <p className="mt-5 max-w-md leading-7 text-[#5f6d64]">
              Local Connect brings together businesses, services, professionals, education, healthcare and everyday essentials into a single platform designed for your area.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-[#17352a] px-6 text-sm font-bold text-white transition-all hover:bg-[#2d7148]">
                Start Discovering <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/login" className="inline-flex h-12 items-center gap-2.5 rounded-full border border-[#17352a]/30 px-6 text-sm font-bold text-[#17352a] transition-all hover:border-[#17352a] hover:bg-[#17352a]/5">
                Login
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '9+', label: 'Categories' },
              { value: '100+', label: 'Services' },
              { value: '1', label: 'Platform' },
              { value: '∞', label: 'Possibilities' },
            ].map(({ value, label }) => (
              <div key={label} className="rounded-2xl border border-[#d9ded2] bg-white/70 p-6 text-center">
                <p className="text-4xl font-extrabold tracking-[-0.04em] text-[#17352a]">{value}</p>
                <p className="mt-1 text-sm text-[#5f6d64]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-[#17352a] px-5 py-16 text-white sm:px-8 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="section-kicker text-[#f3c875]">Discover everything around you</p>
              <h2 className="mt-2 max-w-2xl text-2xl font-extrabold tracking-[-0.04em] sm:text-4xl">
                From groceries to doctors, schools to engineers — it&apos;s all here.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
                Local Connect helps people discover everything around them through one simple platform.
              </p>
            </div>
            <Link href="/register" className="group inline-flex h-14 shrink-0 items-center gap-3 rounded-full bg-[#e9ae4a] px-7 font-bold text-[#17352a] transition-all hover:bg-[#f3c875]">
              Create your account <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="flex flex-col gap-3 bg-[#10271f] px-5 py-8 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <span className="font-bold text-white/80">Local Connect</span>
        <span>Everything Around You. All in One Place.</span>
      </footer>
    </main>
  );
}
