'use client';

export default function AnnouncementsPage() {
  const ANNOUNCEMENTS = [
    {
      id: 1,
      title: 'BMPL 2027 Player Registration is Open!',
      body: 'Phase 1 has officially begun. All players from Biccavolu Mandal (14 villages) are eligible to register. Registration fee is ₹10. Upload your photo and Aadhaar to complete your application.',
      date: 'Oct 1, 2027',
      tag: 'Registration',
      tagColor: 'bg-green-100 text-green-700',
      icon: '📝',
    },
    {
      id: 2,
      title: 'Captains will be elected by players — not appointed',
      body: 'BMPL 2027 introduces democratic captain selection. Every verified player gets one vote. The top 10 vote-getters become team captains. Nominations open Nov 11.',
      date: 'Oct 1, 2027',
      tag: 'Important',
      tagColor: 'bg-amber-100 text-amber-700',
      icon: '🗳️',
    },
    {
      id: 3,
      title: 'Player photo is mandatory for registration',
      body: 'All players must upload a clear face photo during registration. Players without a photo cannot complete their application. This ensures player identity is verifiable.',
      date: 'Oct 1, 2027',
      tag: 'Notice',
      tagColor: 'bg-blue-100 text-blue-700',
      icon: '📸',
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-6 space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-[#17352a]">📢 BMPL 2027 Announcements</h2>
        <p className="text-sm text-[#5f6d64] mt-1">Official updates from the tournament committee.</p>
      </div>

      {ANNOUNCEMENTS.map((a) => (
        <div key={a.id} className="rounded-2xl border border-[#d9ded2] bg-white p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f5f3ed] text-2xl">
              {a.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${a.tagColor}`}>{a.tag}</span>
                <span className="text-[10px] text-[#9aab9e]">{a.date}</span>
              </div>
              <p className="font-bold text-[#17352a]">{a.title}</p>
              <p className="text-sm text-[#5f6d64] mt-1.5 leading-relaxed">{a.body}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
