'use client';

import { useState, useEffect } from 'react';
import { Bell, Plus, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getUser } from '@/lib/auth';
import type { User } from '@/types';

const POSTS = [
  {
    id: 1,
    title: 'Free Medical Camp This Sunday',
    content: 'Free eye checkup and blood sugar testing camp at Village Panchayat Office. All welcome. No prior registration needed. Brought to you by District Health Authority.',
    author: 'Health Department',
    authorRole: 'Official',
    time: '2 hours ago',
    emoji: '🏥',
    category: 'Health',
    likes: 47,
    comments: 12,
  },
  {
    id: 2,
    title: 'Road Closure Notice: Main Bazaar',
    content: 'Road from Bus Stand to Market will be under repair Mon–Wed 8 AM to 5 PM. Please use alternate routes via NH bypass.',
    author: 'Gram Panchayat',
    authorRole: 'Official',
    time: '5 hours ago',
    emoji: '🚧',
    category: 'Infrastructure',
    likes: 31,
    comments: 8,
  },
  {
    id: 3,
    title: 'Weekly Organic Farmers Market',
    content: 'Buy fresh organic vegetables directly from farmers every Saturday 6 AM – 10 AM near the old temple. Support local farmers!',
    author: 'Farmers Society',
    authorRole: 'Community',
    time: '1 day ago',
    emoji: '🌾',
    category: 'Agriculture',
    likes: 89,
    comments: 23,
  },
  {
    id: 4,
    title: 'New Library Opens Next Month',
    content: 'The village library funded by gram panchayat will open next month with 2000+ books, digital access, and a children\'s reading corner.',
    author: 'Village Council',
    authorRole: 'Official',
    time: '2 days ago',
    emoji: '📚',
    category: 'Education',
    likes: 134,
    comments: 41,
  },
  {
    id: 5,
    title: 'Lost Dog: Please Help',
    content: 'Brown labrador named "Tommy" went missing near the river. If found, please contact 9876543210. Reward offered.',
    author: 'Ravi Kumar',
    authorRole: 'Resident',
    time: '3 days ago',
    emoji: '🐶',
    category: 'Alert',
    likes: 22,
    comments: 15,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Health: 'success',
  Infrastructure: 'warning',
  Agriculture: 'default',
  Education: 'info',
  Alert: 'danger',
};

export default function CommunityPage() {
  const [user, setUser] = useState<User | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    setUser(getUser());
  }, []);

  const filters = ['All', 'Health', 'Infrastructure', 'Agriculture', 'Education', 'Alert'];

  const filtered = activeFilter === 'All'
    ? POSTS
    : POSTS.filter((p) => p.category === activeFilter);

  function toggleLike(id: number) {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="min-h-dvh">
      {/* Header */}
      <div
        className="px-4 pt-12 pb-5"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E7B3B 100%)' }}
      >
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold text-white">Community</h1>
          <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <Bell size={16} className="text-white" />
          </button>
        </div>
        <p className="text-white/60 text-sm">
          Updates for {user?.village?.name || 'your village'}
        </p>
      </div>

      {/* Filter chips */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeFilter === f
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="px-4 py-4 space-y-4">
        {filtered.map((post) => (
          <Card key={post.id} shadow="sm">
            <CardContent className="p-4">
              <div className="flex gap-3 mb-3">
                <div className="w-11 h-11 rounded-[12px] bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{post.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-gray-900 leading-tight">
                      {post.title}
                    </h3>
                    <Badge
                      variant={(CATEGORY_COLORS[post.category] || 'default') as 'default' | 'success' | 'warning' | 'danger' | 'info'}
                      className="flex-shrink-0 text-[10px]"
                    >
                      {post.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs text-primary font-medium">{post.author}</span>
                    <span className="text-gray-300 text-xs">•</span>
                    <span className="text-xs text-gray-400">{post.time}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-3">{post.content}</p>

              <div className="flex items-center gap-4 pt-2 border-t border-gray-50">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                    likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  <Heart
                    size={14}
                    fill={likedPosts.has(post.id) ? 'currentColor' : 'none'}
                  />
                  {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                  <MessageCircle size={14} />
                  {post.comments}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-gray-400 font-medium ml-auto">
                  <Share2 size={14} />
                  Share
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAB */}
      <button className="fixed bottom-20 right-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 active:scale-95 transition-transform">
        <Plus size={20} className="text-white" />
      </button>
    </div>
  );
}
