'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

type Album = {
  id: number;
  title: string;
  date: string;
  count: number;
  cover: string;
  color: string;
  photos: string[];
};

const albums: Album[] = [];

export default function GalleryPage() {
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);

  if (activeAlbum) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 lg:px-6">
        <div className="mb-5 flex items-center gap-3">
          <button onClick={() => setActiveAlbum(null)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#d9ded2] text-[#5f6d64] hover:text-[#17352a] transition-colors">
            <X size={15} />
          </button>
          <div>
            <h2 className="font-bold text-[#17352a]">{activeAlbum.title}</h2>
            <p className="text-xs text-[#5f6d64]">{activeAlbum.count} photos · {activeAlbum.date}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {activeAlbum.photos.map((emoji, i) => (
            <div key={i} className="aspect-square rounded-xl flex items-center justify-center text-4xl cursor-pointer hover:opacity-80 transition-opacity"
              style={{ background: `${activeAlbum.color}18` }}>
              {emoji}
            </div>
          ))}
          {Array.from({ length: Math.max(0, 12 - activeAlbum.photos.length) }).map((_, i) => (
            <div key={`ph-${i}`} className="aspect-square rounded-xl bg-[#f5f3ed] border-2 border-dashed border-[#d9ded2] flex items-center justify-center text-[#9aab9e] text-2xl">+</div>
          ))}
        </div>
        <button className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#d9ded2] px-5 py-2.5 text-sm font-bold text-[#17352a] hover:border-[#17352a]/40 transition-colors">
          Upload Photos
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#17352a]">Gallery</h2>
          <p className="text-sm text-[#5f6d64]">Match photos and team memories</p>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-full bg-[#1E7B3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#2d9b4e] transition-colors">
          + Upload
        </button>
      </div>

      {albums.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((a) => (
            <div key={a.id} onClick={() => setActiveAlbum(a)}
              className="rounded-2xl border border-[#d9ded2] bg-white overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer">
              <div className="h-36 flex items-center justify-center text-6xl" style={{ background: `${a.color}18` }}>{a.cover}</div>
              <div className="p-4">
                <p className="font-bold text-[#17352a] leading-tight">{a.title}</p>
                <p className="mt-1 text-xs text-[#5f6d64]">{a.count} photos · {a.date}</p>
              </div>
            </div>
          ))}
          <CreateAlbumCard />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CreateAlbumCard />
        </div>
      )}
    </div>
  );
}

function CreateAlbumCard() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-[#d9ded2] bg-white flex flex-col items-center justify-center gap-2 p-8 text-center hover:border-[#1E7B3B]/40 hover:bg-[#fafaf9] transition-all cursor-pointer min-h-[200px]">
      <span className="text-4xl">📸</span>
      <p className="text-sm font-bold text-[#17352a]">Create Album</p>
      <p className="text-xs text-[#9aab9e]">Upload match photos and moments</p>
    </div>
  );
}
