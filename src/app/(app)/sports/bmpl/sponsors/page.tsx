'use client';

import { useRouter } from 'next/navigation';

const PACKAGES = [
  {
    tier: 'Title Sponsor',
    price: '₹50,000',
    color: '#F59E0B',
    bg: 'bg-[#F59E0B]/10 border-[#F59E0B]/30',
    badge: 'bg-[#F59E0B] text-[#17352a]',
    perks: [
      'Tournament named after sponsor',
      'Banner at all 6 match venues',
      'Announcement at every match',
      'Logo on all jerseys',
      'Social media promotion',
      'Logo on Local Connect app banner',
    ],
    sold: false,
  },
  {
    tier: 'Co-Sponsor',
    price: '₹20,000',
    color: '#1E7B3B',
    bg: 'bg-[#1E7B3B]/5 border-[#1E7B3B]/20',
    badge: 'bg-[#1E7B3B] text-white',
    perks: [
      'Large banner at main venue',
      '2 teams sponsored with logo',
      'Announcement at key matches',
      'Social media mention (5 posts)',
      'Logo on match scorecards',
    ],
    sold: false,
  },
  {
    tier: 'Team Sponsor',
    price: '₹5,000',
    color: '#1a4f8a',
    bg: 'bg-[#1a4f8a]/5 border-[#1a4f8a]/20',
    badge: 'bg-[#1a4f8a] text-white',
    perks: [
      'Sponsor one team',
      'Logo on team jersey',
      'Banner at team home matches',
      'Mentioned in team announcements',
    ],
    sold: false,
  },
  {
    tier: 'Ground Sponsor',
    price: '₹3,000',
    color: '#6d28d9',
    bg: 'bg-[#6d28d9]/5 border-[#6d28d9]/20',
    badge: 'bg-[#6d28d9] text-white',
    perks: [
      'Banner at one match venue',
      'Mentioned in pre-match announcement',
      'Social media mention (2 posts)',
    ],
    sold: false,
  },
];

export default function SponsorsPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:px-6">
      <div className="mb-8 text-center">
        <span className="text-4xl">🏅</span>
        <h2 className="mt-3 text-2xl font-extrabold text-[#17352a]">Sponsor BMPL 2027</h2>
        <p className="mt-2 text-[#5f6d64] max-w-md mx-auto text-sm">
          Reach thousands of cricket fans across Biccavolu Mandal. Support local sports and grow your brand.
        </p>
        <a href="/discover?view=businesses"
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#1E7B3B]/20 bg-[#1E7B3B]/5 px-4 py-1.5 text-xs font-semibold text-[#1E7B3B] hover:bg-[#1E7B3B]/10 transition-colors">
          🏪 Existing sponsors are listed in Businesses →
        </a>
      </div>

      {/* Sponsorship packages */}
      <div className="grid gap-4 sm:grid-cols-2">
        {PACKAGES.map((pkg) => (
          <div key={pkg.tier} className={`rounded-2xl border-2 bg-white ${pkg.bg} overflow-hidden`}>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <span className={`inline-block rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] ${pkg.badge}`}>{pkg.tier}</span>
                  <p className="mt-2 text-2xl font-black text-[#17352a]">{pkg.price}</p>
                  {pkg.sold && <span className="text-xs font-bold text-red-500">SOLD</span>}
                </div>
              </div>

              <ul className="space-y-1.5 mb-5">
                {pkg.perks.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#5f6d64]">
                    <span className="text-[#1E7B3B] shrink-0 mt-0.5">✓</span>
                    {p}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => router.push('/sports/bmpl')}
                disabled={pkg.sold}
                className={`w-full rounded-xl py-2.5 text-sm font-bold transition-colors ${pkg.sold ? 'bg-[#f5f3ed] text-[#9aab9e] cursor-not-allowed' : 'text-white hover:opacity-90'}`}
                style={pkg.sold ? {} : { background: pkg.color }}
              >
                {pkg.sold ? 'Sold Out' : 'Enquire Now'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="mt-8 rounded-2xl bg-[#0a2016] text-white p-6 text-center">
        <p className="text-lg font-extrabold">Interested in Sponsoring BMPL 2027?</p>
        <p className="mt-1.5 text-sm text-white/60">Contact the tournament organizers to discuss packages and custom branding.</p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="tel:+919999999999" className="rounded-full bg-[#1E7B3B] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2d9b4e] transition-colors">
            📞 Call Organizer
          </a>
          <button className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/10 transition-colors">
            📧 Send Enquiry
          </button>
        </div>
      </div>

      {/* Powered by */}
      <div className="mt-6 text-center">
        <p className="text-xs text-[#9aab9e]">Powered by <span className="font-semibold text-[#1E7B3B]">Local Connect</span> · Official digital platform of BMPL 2027</p>
      </div>
    </div>
  );
}
