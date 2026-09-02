import React, { useState } from 'react';
import { Play, Sparkles, Compass, Shield, Flame, Gem, ArrowLeft, Search } from 'lucide-react';
import { User } from '../../types';
import warroomLogoJpg from '../../assets/images/warroom_logo_1787906676836.jpg';

interface AdventureHeroSectionProps {
  themeMode: 'girls' | 'boys';
  currentUser: User | null;
  onStartMission: () => void;
}

export default function AdventureHeroSection({
  themeMode,
  currentUser,
  onStartMission
}: AdventureHeroSectionProps) {
  const isGirls = themeMode === 'girls';
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="w-full space-y-4 text-center">
      
      {/* 1. Main Logo / Typography Brand Header (Replaced with JPG Image Logo) */}
      <div className="space-y-2 pt-2 flex flex-col items-center justify-center">
        <div className="relative inline-flex flex-col items-center justify-center">
          
          {/* Logo JPG Image Placeholder with Neon / Luminous Effect */}
          {!logoError ? (
            <div className={`relative p-2 rounded-3xl transition-all duration-300 ${
              isGirls 
                ? 'neon-logo-glow-pink bg-gradient-to-tr from-pink-500/30 to-purple-500/20' 
                : 'neon-logo-glow bg-gradient-to-tr from-amber-500/30 via-cyan-500/20 to-blue-500/30'
            }`}>
              <img 
                src={warroomLogoJpg} 
                alt="لوگوی اتاق جنگ"
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-2xl border-2 border-white/20 shadow-2xl transition hover:scale-105"
              />
              
              <div className={`absolute -bottom-2 right-1/2 translate-x-1/2 px-3.5 py-0.5 rounded-full text-xs font-black tracking-wide border shadow-md whitespace-nowrap ${
                isGirls 
                  ? 'bg-pink-950 text-pink-300 border-pink-500/60 shadow-[0_0_15px_rgba(244,63,94,0.5)]' 
                  : 'bg-slate-950 text-cyan-300 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
              }`}>
                اتاق جنگ
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <Shield size={36} className={isGirls ? 'text-pink-400' : 'text-cyan-400'} />
              <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-tight drop-shadow-2xl font-serif ${
                isGirls 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-200' 
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-cyan-300'
              }`}>
                اتاق جنگ
              </h1>
            </div>
          )}

          <span className={`h-1 w-32 rounded-full blur-sm mt-3 ${
            isGirls ? 'bg-pink-500' : 'bg-amber-400'
          }`} />
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white drop-shadow-lg pt-1">
          این پرونده هنوز بازه!
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed px-3">
          توی <strong className={isGirls ? 'text-pink-300' : 'text-amber-300'}>اتاق جنگ</strong> قراره مثل یه کارآگاه و رزمنده کارکشته، رد سرنخ‌های عملیات و پرونده‌های حساس رو بگیریم. ماموریت‌های هفت‌گانه رو پشت سر بذار، کریستال جمع کن و به جمع برترین‌های کشور بپیوند...
        </p>
      </div>

      {/* 2. Hero Visual Showcase Card (Matches Reference Screenshot) */}
      <div className={`relative rounded-3xl overflow-hidden border p-1 shadow-2xl transition-all ${
        isGirls
          ? 'bg-gradient-to-b from-pink-950/80 to-[#120516] border-pink-500/50 shadow-[0_0_40px_rgba(244,63,94,0.35)]'
          : 'bg-gradient-to-b from-[#111f3d]/90 to-[#060c18] border-cyan-400/50 shadow-[0_0_40px_rgba(6,182,212,0.35)]'
      }`}>
        
        {/* Banner Artwork Container */}
        <div className="relative h-60 sm:h-72 md:h-80 w-full rounded-[22px] overflow-hidden">
          
          {/* Visual Artwork representing Detective / Castle / Adventure */}
          <img 
            src={isGirls 
              ? "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80" 
              : "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=1200&q=80"
            } 
            alt="ماجراجویی اتاق جنگ" 
            className="w-full h-full object-cover brightness-[0.75] contrast-125"
          />

          {/* Glowing Atmospheric Overlays */}
          <div className={`absolute inset-0 bg-gradient-to-t ${
            isGirls
              ? 'from-[#0e0410] via-[#0e0410]/50 to-transparent'
              : 'from-[#040813] via-[#040813]/50 to-transparent'
          }`} />

          {/* Floating Badges */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[11px] font-bold text-amber-300">
            <Search size={13} className="text-amber-400" />
            <span>پرونده سری شماره ۴۰۳</span>
          </div>

          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[11px] font-bold text-cyan-300">
            <Gem size={13} className="text-cyan-400" />
            <span>۷ مرحله پرهیجان</span>
          </div>

          {/* Action Centerpiece: Glowing Orange/Amber Button "شروع ماموریت" */}
          <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center justify-center gap-2 px-4 z-10">
            <button
              onClick={onStartMission}
              className="px-8 sm:px-12 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm sm:text-base shadow-[0_0_30px_rgba(245,158,11,0.85)] hover:shadow-[0_0_40px_rgba(245,158,11,1)] transition transform hover:scale-105 active:scale-95 flex items-center gap-2.5 group cursor-pointer"
            >
              <Play size={18} className="fill-slate-950 group-hover:translate-x-[-2px] transition" />
              <span>شروع ماموریت</span>
              <ArrowLeft size={16} />
            </button>
            <span className="text-[10px] text-slate-300 drop-shadow">
              بدون نیاز به پیش‌نیاز، همین حالا ماجراجویی خودت رو آغاز کن
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
