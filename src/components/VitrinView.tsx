import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Star, 
  Play, 
  MessageCircle, 
  Share2, 
  Sparkles, 
  X, 
  User as UserIcon, 
  Flame, 
  Award, 
  Eye, 
  Send, 
  ShieldCheck,
  Film,
  Camera,
  Layers
} from 'lucide-react';
import { User } from '../types';
import { formatToPersianDigits } from '../utils/jalali';

interface VitrinViewProps {
  currentUser: User | null;
  triggerAlert: (msg: string) => void;
}

export interface VitrinPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  squadName: string;
  title: string;
  description: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  likesCount: number;
  isLikedByUser: boolean;
  ratingAverage: number; // 1 to 5
  userRating?: number;
  commentsCount: number;
  stageTag: string;
  badge?: string;
  aspectRatio?: 'square' | 'portrait';
}

export default function VitrinView({
  currentUser,
  triggerAlert
}: VitrinViewProps) {
  const isGirls = currentUser?.gender === 'دختر' || localStorage.getItem('hisstory_theme_mode') === 'girls';

  // Sample explore items from users nationwide
  const [posts, setPosts] = useState<VitrinPost[]>([
    {
      id: 'v1',
      authorName: 'سید علی حسینی',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      squadName: 'جوخه صاعقه ۱۲',
      title: 'ماکت عملیاتی قرارگاه تاکتیکی مرحله ۳',
      description: 'طراحی ماکت بازسازی شده از عملیات فتح با مقوا، چراغ‌های ال‌ای‌دی و چوب کبریت.',
      mediaUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image',
      likesCount: 142,
      isLikedByUser: false,
      ratingAverage: 4.8,
      commentsCount: 28,
      stageTag: 'مرحله ۳ - فتح‌المبین',
      badge: 'برگزیده داوران'
    },
    {
      id: 'v2',
      authorName: 'زهرا کاظمی',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      squadName: 'جوخه نسترن‌های نور',
      title: 'مستند ویدیویی مصاحبه با جانباز محله',
      description: 'روایت شفاهی ناگفته‌های شب عملیات از زبان رزمنده پیشکسوت دفاع مقدس.',
      mediaUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
      mediaType: 'video',
      likesCount: 289,
      isLikedByUser: true,
      ratingAverage: 5.0,
      commentsCount: 45,
      stageTag: 'مرحله ۵ - روایت فتح',
      badge: '۵ ستاره طلایی'
    },
    {
      id: 'v3',
      authorName: 'محمدرضا پورمند',
      authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      squadName: 'جوخه طوفان سرخ',
      title: 'کتابچه دیجیتال و تحلیل رمزشکنی',
      description: 'کتابچه مصور ۴۰ صفحه‌ای از تحلیل پیام‌های رمز و سرنخ‌های مرحله اول.',
      mediaUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image',
      likesCount: 95,
      isLikedByUser: false,
      ratingAverage: 4.5,
      commentsCount: 14,
      stageTag: 'مرحله ۱ - سرنخ آغاز'
    },
    {
      id: 'v4',
      authorName: 'فاطمه احمدی',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      squadName: 'جوخه پرواز',
      title: 'نقاشی دیجیتال کارآگاه تاریخ',
      description: 'طراحی چهره قهرمان داستان در سبک کمیک و دیجیتال آرت.',
      mediaUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image',
      likesCount: 310,
      isLikedByUser: false,
      ratingAverage: 4.9,
      commentsCount: 52,
      stageTag: 'مرحله ۲ - چهره‌های ماندگار'
    },
    {
      id: 'v5',
      authorName: 'امیرعلی رضایی',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      squadName: 'جوخه الفجر',
      title: 'پادکست صوتی رازهای خط مقدم',
      description: 'ضبط ۳ دقیقه‌ای با افکت‌های صدای بیسیم و باران در سنگر.',
      mediaUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
      mediaType: 'video',
      likesCount: 180,
      isLikedByUser: false,
      ratingAverage: 4.7,
      commentsCount: 33,
      stageTag: 'مرحله ۴ - بیسیم‌چی'
    },
    {
      id: 'v6',
      authorName: 'مریم سلیمانی',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      squadName: 'جوخه یاس',
      title: 'گزارش روزنامه‌دیواری محله ما',
      description: 'روزنامه دیواری ویژه دهه فجر و بازخوانی اسناد هیس‌طوری.',
      mediaUrl: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?auto=format&fit=crop&w=800&q=80',
      mediaType: 'image',
      likesCount: 125,
      isLikedByUser: true,
      ratingAverage: 4.6,
      commentsCount: 19,
      stageTag: 'مرحله ۶ - رسانه سنگر'
    }
  ]);

  const [activeCategory, setActiveCategory] = useState<'all' | 'video' | 'image' | 'top'>('all');
  const [selectedPost, setSelectedPost] = useState<VitrinPost | null>(null);
  const [heartAnimId, setHeartAnimId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Double Click / Double Tap to Like implementation
  const [lastTap, setLastTap] = useState<{ [key: string]: number }>({});

  const handleDoubleTap = (post: VitrinPost) => {
    const now = Date.now();
    const prevTap = lastTap[post.id] || 0;

    if (now - prevTap < 300) {
      // It's a double tap!
      toggleLike(post.id, true);
      setHeartAnimId(post.id);
      setTimeout(() => setHeartAnimId(null), 800);
    }
    setLastTap({ ...lastTap, [post.id]: now });
  };

  const toggleLike = (postId: string, forceLike = false) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextLiked = forceLike ? true : !p.isLikedByUser;
        return {
          ...p,
          isLikedByUser: nextLiked,
          likesCount: nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
        };
      }
      return p;
    }));

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => prev ? {
        ...prev,
        isLikedByUser: forceLike ? true : !prev.isLikedByUser,
        likesCount: (forceLike || !prev.isLikedByUser) ? prev.likesCount + 1 : prev.likesCount - 1
      } : null);
    }
  };

  // 1 to 5 Star Rating System
  const handleRatePost = (postId: string, stars: number) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          userRating: stars,
          ratingAverage: Number(((p.ratingAverage * 4 + stars) / 5).toFixed(1))
        };
      }
      return p;
    }));

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost(prev => prev ? {
        ...prev,
        userRating: stars,
        ratingAverage: Number(((prev.ratingAverage * 4 + stars) / 5).toFixed(1))
      } : null);
    }

    triggerAlert(`امتیاز ${stars} ستاره برای اثر ثبت شد.`);
  };

  const filteredPosts = posts.filter(p => {
    if (activeCategory === 'video') return p.mediaType === 'video';
    if (activeCategory === 'image') return p.mediaType === 'image';
    if (activeCategory === 'top') return (p.ratingAverage >= 4.8);
    return true;
  });

  return (
    <div className="space-y-6 dir-rtl pb-28 max-w-5xl mx-auto px-3 sm:px-6 pt-4 font-sans select-none">
      
      {/* 1. Explore Header */}
      <div className={`p-5 sm:p-7 rounded-3xl relative overflow-hidden shadow-2xl border transition-all duration-500 ${
        isGirls
          ? 'bg-gradient-to-r from-[#1d091e] via-[#120513] to-[#080208] border-pink-500/40'
          : 'bg-gradient-to-r from-[#07132b] via-[#050c1c] to-[#02060e] border-cyan-400/40'
      }`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-right">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono border ${
              isGirls 
                ? 'bg-pink-950/80 text-pink-300 border-pink-500/50' 
                : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
            }`}>
              WAR ROOM EXPLORE & VITRIN
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              ویترین افتخارات و اکسپلور رزمندگان
            </h1>
            <p className="text-xs text-slate-300">
              مشاهده آثار ویدیویی، دست‌سازه‌ها و گزارش‌های بچه‌های سراسر کشور (دوبار کلیک برای لایک ❤️)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">
              {formatToPersianDigits(posts.length)} اثر ثبت‌شده
            </span>
          </div>
        </div>
      </div>

      {/* 2. Categories Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'همه آثار (Explore)' },
          { id: 'video', label: 'ویدیوها و مستندها' },
          { id: 'image', label: 'تصاویر و دست‌سازه‌ها' },
          { id: 'top', label: 'برگزیدگان داوری (۵ ستاره)' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition border ${
              activeCategory === cat.id
                ? isGirls 
                  ? 'bg-pink-950 border-pink-500 text-pink-200 shadow-md shadow-pink-900/30' 
                  : 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-900/30'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. Instagram-Style Explore Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => handleDoubleTap(post)}
            className="group relative aspect-square sm:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-slate-600 transition cursor-pointer"
          >
            {/* Background Media */}
            <img 
              src={post.mediaUrl} 
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Video Badge if Video */}
            {post.mediaType === 'video' && (
              <div className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white">
                <Play size={13} className="fill-white" />
              </div>
            )}

            {/* Top Stage Tag */}
            <div className="absolute top-2.5 left-2.5">
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-950/80 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                {post.stageTag}
              </span>
            </div>

            {/* Double Tap Big Floating Animated Heart */}
            <AnimatePresence>
              {heartAnimId === post.id && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.3, opacity: 1 }}
                  exit={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                >
                  <Heart size={70} className="fill-rose-500 text-rose-500 drop-shadow-[0_0_25px_rgba(244,63,94,0.9)]" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Instagram Hover / Tap Overlay Info */}
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPost(post);
              }}
              className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <img 
                  src={post.authorAvatar} 
                  alt={post.authorName} 
                  className="w-5 h-5 rounded-full object-cover border border-white/40"
                />
                <span className="text-[11px] font-black line-clamp-1">{post.authorName}</span>
              </div>

              <h4 className="text-xs font-bold line-clamp-1 mb-2 text-slate-100">
                {post.title}
              </h4>

              {/* Interactions Bar */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1">
                    <Heart size={13} className={post.isLikedByUser ? 'fill-rose-500 text-rose-500' : ''} />
                    {formatToPersianDigits(post.likesCount)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    {formatToPersianDigits(post.ratingAverage)}
                  </span>
                </div>

                <span className="text-[10px] text-cyan-300 font-sans font-bold">مشاهده کامل</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Full-Screen Interactive Media Modal with 1-5 Star Rating */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
          <div className="bg-[#090e21] border border-cyan-500/40 rounded-3xl max-w-2xl w-full overflow-hidden text-white shadow-2xl relative flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img 
                  src={selectedPost.authorAvatar} 
                  alt={selectedPost.authorName}
                  className="w-9 h-9 rounded-full object-cover border-2 border-cyan-400" 
                />
                <div>
                  <h3 className="text-sm font-black text-white">{selectedPost.authorName}</h3>
                  <span className="text-[10px] text-cyan-300 font-mono">{selectedPost.squadName}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedPost(null)}
                className="p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Media Box */}
            <div className="relative aspect-video sm:aspect-[16/10] bg-black flex items-center justify-center overflow-hidden">
              <img 
                src={selectedPost.mediaUrl} 
                alt={selectedPost.title}
                className="w-full h-full object-contain"
              />
              {selectedPost.mediaType === 'video' && (
                <div className="absolute p-4 rounded-full bg-cyan-500/80 text-slate-950 shadow-xl cursor-pointer hover:scale-110 transition">
                  <Play size={24} className="fill-slate-950" />
                </div>
              )}
            </div>

            {/* Details & Interactive Rating Bar */}
            <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto">
              <div className="space-y-1">
                <h2 className="text-base font-black text-white">{selectedPost.title}</h2>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedPost.description}</p>
              </div>

              {/* 1-5 Star Interactive Rating System */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-0.5 text-center sm:text-right">
                  <span className="text-xs font-black text-white block">امتیاز شما به این اثر:</span>
                  <span className="text-[10px] text-slate-400">میانگین فعلی: {formatToPersianDigits(selectedPost.ratingAverage)} از ۵</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatePost(selectedPost.id, star)}
                      className="p-1 text-slate-600 hover:text-amber-400 transition transform hover:scale-125"
                    >
                      <Star 
                        size={22} 
                        className={(selectedPost.userRating || 0) >= star ? 'fill-amber-400 text-amber-400' : 'hover:fill-amber-400'} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons (Like, Share) */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLike(selectedPost.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                      selectedPost.isLikedByUser 
                        ? 'bg-rose-950 border-rose-500 text-rose-300' 
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Heart size={15} className={selectedPost.isLikedByUser ? 'fill-rose-500' : ''} />
                    <span>{formatToPersianDigits(selectedPost.likesCount)} لایک</span>
                  </button>

                  <button
                    onClick={() => triggerAlert('لینک اثر با موفقیت کپی شد.')}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5 transition"
                  >
                    <Share2 size={14} />
                    <span>اشتراک‌گذاری</span>
                  </button>
                </div>

                <span className="text-[10px] text-slate-400 font-mono">
                  شناسه اثر: #{selectedPost.id}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
