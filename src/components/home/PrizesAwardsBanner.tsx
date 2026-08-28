import React from 'react';
import { Gift, Trophy, Sparkles, Gem, ShoppingBag, Smartphone, Gamepad, Camera, Tablet, Award } from 'lucide-react';
import { formatToPersianDigits } from '../../utils/jalali';

interface PrizesAwardsBannerProps {
  themeMode: 'girls' | 'boys';
  onExplorePrizes?: () => void;
}

export default function PrizesAwardsBanner({
  themeMode,
  onExplorePrizes
}: PrizesAwardsBannerProps) {
  const isGirls = themeMode === 'girls';

  const prizeHighlights = [
    { title: 'کنسول بازی Xbox Series X', count: '۵۰ دستگاه', icon: Gamepad },
    { title: 'تبلت‌های هوشمند دانش‌آموزی', count: '۲۰۰ دستگاه', icon: Tablet },
    { title: 'گوشی‌های هوشمند ماجراجو', count: '۳۰۰ دستگاه', icon: Smartphone },
    { title: 'دوربین‌های عکاسی دیجیتال', count: '۱۵۰ دستگاه', icon: Camera },
  ];

  return (
    <div className="w-full space-y-3">
      
      {/* Section Header */}
      <div className="text-center sm:text-right space-y-1">
        <h3 className="text-lg sm:text-xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
          <Trophy size={20} className={isGirls ? 'text-pink-400' : 'text-amber-400'} />
          <span>جایزه‌ها</span>
        </h3>
        <p className="text-xs text-slate-300 font-medium flex items-center justify-center sm:justify-start gap-1.5">
          <Sparkles size={13} className={isGirls ? 'text-pink-400' : 'text-cyan-400'} />
          <span>کریستال جمع کن و جایزه ببر</span>
        </p>
      </div>

      {/* Main Big Prizes Showcase Card (Matches Reference Image) */}
      <div className={`relative rounded-3xl p-5 sm:p-7 overflow-hidden border transition-all ${
        isGirls
          ? 'bg-gradient-to-br from-[#280c25] via-[#1a081c] to-[#0c040d] border-pink-500/50 shadow-[0_0_35px_rgba(244,63,94,0.25)]'
          : 'bg-gradient-to-br from-[#0c1a33] via-[#081226] to-[#040914] border-cyan-400/50 shadow-[0_0_35px_rgba(6,182,212,0.25)]'
      }`}>
        
        {/* Ambient Cosmic Background Lighting */}
        <div className={`absolute top-0 left-1/4 w-72 h-72 blur-[90px] rounded-full pointer-events-none ${
          isGirls ? 'bg-pink-600/20' : 'bg-cyan-500/20'
        }`} />
        <div className="absolute bottom-0 right-0 w-60 h-60 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column (Visual Showcase: Gadgets & Glowing Crystals) */}
          <div className="lg:col-span-6 flex items-center justify-center relative">
            <div className="relative w-full max-w-sm h-52 sm:h-64 flex items-center justify-center">
              
              {/* Central Glowing Shield / Crystal Art Backdrop */}
              <div className={`absolute w-44 h-44 rounded-full blur-2xl ${
                isGirls ? 'bg-pink-500/30' : 'bg-cyan-500/30'
              }`} />

              {/* Realistic Gadget Collage Illustration Box */}
              <div className="relative z-10 flex items-center justify-center gap-2">
                
                {/* 1. Camera Card */}
                <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl bg-slate-900/90 border border-slate-700/80 p-2 shadow-2xl flex flex-col items-center justify-center -rotate-12 translate-y-3">
                  <Camera size={24} className="text-cyan-300 mb-1" />
                  <span className="text-[8px] font-bold text-slate-300">دوربین عکاسی</span>
                </div>

                {/* 2. Main Centerpiece: Xbox / Gaming Console */}
                <div className={`w-28 h-36 sm:w-36 sm:h-44 rounded-3xl p-3 shadow-2xl flex flex-col items-center justify-center relative border-2 ${
                  isGirls 
                    ? 'bg-gradient-to-b from-pink-950/90 to-slate-950 border-pink-400 shadow-[0_0_25px_rgba(244,63,94,0.6)]' 
                    : 'bg-gradient-to-b from-cyan-950/90 to-slate-950 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.6)]'
                }`}>
                  <div className="absolute -top-3 w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg">
                    <Trophy size={16} />
                  </div>
                  <Gamepad size={36} className={isGirls ? 'text-pink-300' : 'text-cyan-300'} />
                  <span className="text-[10px] sm:text-xs font-black text-white mt-2 text-center">Xbox Series X</span>
                  <span className="text-[8px] text-amber-300 font-mono mt-0.5">۵۰ میلیارد ریال</span>
                </div>

                {/* 3. Tablet / Smartphone Card */}
                <div className="w-16 h-24 sm:w-20 sm:h-28 rounded-2xl bg-slate-900/90 border border-slate-700/80 p-2 shadow-2xl flex flex-col items-center justify-center rotate-12 translate-y-1">
                  <Smartphone size={24} className="text-amber-300 mb-1" />
                  <span className="text-[8px] font-bold text-slate-300">گوشی و تبلت</span>
                </div>

              </div>

              {/* Floating Glowing Crystals Particles */}
              <div className="absolute top-2 right-4 animate-bounce duration-1000">
                <div className="p-1.5 rounded-xl bg-pink-500/20 border border-pink-400 text-pink-300 shadow-[0_0_15px_rgba(244,63,94,0.8)]">
                  <Gem size={16} />
                </div>
              </div>
              <div className="absolute bottom-3 left-4 animate-pulse">
                <div className="p-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.8)]">
                  <Gem size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Text & Value Badges) */}
          <div className="lg:col-span-6 space-y-4 text-right">
            
            {/* Grand Prize Statement 1 */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-bold shadow-sm">
                <Award size={14} className="text-amber-400" />
                <span>جوایز کشوری و استانی</span>
              </div>
              <h4 className="text-base sm:text-xl font-black text-white leading-snug">
                {formatToPersianDigits(2000)} جایزه برای نفرات برتر کشور و استان، به ارزش{' '}
                <span className="text-amber-300 font-mono">{formatToPersianDigits(50)} میلیارد ریال</span>
              </h4>
            </div>

            {/* Shopping Discount Code Statement 2 */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-xs font-black text-cyan-300">
                <ShoppingBag size={15} className="text-cyan-400" />
                <span>{formatToPersianDigits(100)} هزار کد تخفیف فروشگاهی</span>
              </div>
              <p className="text-[11px] text-slate-300">
                برای کلیه ماجراجوها و رزمندگانی که مراحل را تکمیل نموده و کریستال‌های مسابقه را ذخیره نمایند.
              </p>
            </div>

            {/* Prize mini tags */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {prizeHighlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[10px]">
                    <Icon size={14} className={isGirls ? 'text-pink-400' : 'text-cyan-400'} />
                    <div className="text-right">
                      <span className="text-white font-bold block">{item.title}</span>
                      <span className="text-slate-400 font-mono">{item.count}</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
