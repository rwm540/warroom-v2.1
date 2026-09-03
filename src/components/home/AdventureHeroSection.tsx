import React, { useState } from 'react';
import { Sparkles, Shield, Gem, ArrowLeft, UserPlus, Heart, Zap } from 'lucide-react';
import { User } from '../../types';
import warroomLogoJpg from '../../assets/images/warroom_logo_1787906676836.jpg';
import boysBannerJpg from '../../assets/images/boys_registration_banner_1788362378043.jpg';
import girlsBannerJpg from '../../assets/images/girls_registration_banner_1788362396185.jpg';

interface AdventureHeroSectionProps {
  themeMode: 'girls' | 'boys';
  currentUser: User | null;
  onOpenRegister: () => void;
}

export default function AdventureHeroSection({
  themeMode,
  currentUser,
  onOpenRegister
}: AdventureHeroSectionProps) {
  const isGirls = themeMode === 'girls';
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="w-full space-y-4 text-center">
      
      {/* 1. Main Logo / Typography Brand Header */}
      <div className="space-y-2 pt-2 flex flex-col items-center justify-center">
        <div className="relative inline-flex flex-col items-center justify-center">
          
          {/* Logo JPG Image with Neon / Luminous Effect */}
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
          {isGirls ? 'بخش دختران سرافراز اتاق جنگ' : 'بخش پسران سلحشور اتاق جنگ'}
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed px-3">
          برای شرکت در مسابقات، دریافت کریستال‌ها و رقابت در جدول برترین‌های کشور، روی بنر زیر کلیک کرده و ثبت‌نام خود را تکمیل کنید.
        </p>
      </div>

      {/* 2. Interactive Image Registration Banner Based on Gender Selection */}
      <div 
        onClick={onOpenRegister}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpenRegister();
          }
        }}
        className={`group relative rounded-3xl overflow-hidden border-2 p-1.5 shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-[1.01] active:scale-[0.99] ${
          isGirls
            ? 'bg-gradient-to-b from-pink-950/80 to-[#120516] border-pink-500/60 shadow-[0_0_45px_rgba(244,63,94,0.4)] hover:border-pink-400 hover:shadow-[0_0_60px_rgba(244,63,94,0.6)]'
            : 'bg-gradient-to-b from-[#111f3d]/90 to-[#060c18] border-cyan-400/60 shadow-[0_0_45px_rgba(6,182,212,0.4)] hover:border-cyan-300 hover:shadow-[0_0_60px_rgba(6,182,212,0.6)]'
        }`}
      >
        
        {/* Banner Artwork Container */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-[20px] overflow-hidden">
          
          {/* Customized Image Banner (Girls / Boys) */}
          <img 
            src={isGirls ? girlsBannerJpg : boysBannerJpg} 
            alt={isGirls ? "بنر ثبت‌نام دختران اتاق جنگ" : "بنر ثبت‌نام پسران اتاق جنگ"} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center brightness-[0.9] group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Glowing Atmospheric Overlays */}
          <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-300 ${
            isGirls
              ? 'from-[#0e0410]/95 via-[#0e0410]/40 to-transparent group-hover:from-[#0e0410]/90'
              : 'from-[#040813]/95 via-[#040813]/40 to-transparent group-hover:from-[#040813]/90'
          }`} />

          {/* Bottom Action Centerpiece (Click to Register Call to Action) */}
          <div className="absolute bottom-5 sm:bottom-7 left-0 right-0 flex flex-col items-center justify-center gap-2.5 px-4 z-10">
            <div className={`px-6 sm:px-10 py-3 sm:py-3.5 rounded-2xl font-black text-sm sm:text-base border shadow-2xl flex items-center gap-3 transition transform group-hover:scale-105 ${
              isGirls
                ? 'bg-gradient-to-r from-pink-600 via-rose-500 to-pink-500 text-white border-pink-300/50 shadow-[0_0_35px_rgba(244,63,94,0.9)]'
                : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-400 text-white border-cyan-200/50 shadow-[0_0_35px_rgba(6,182,212,0.9)]'
            }`}>
              <UserPlus size={20} className="group-hover:rotate-12 transition-transform" />
              <span>{isGirls ? 'ورود و ثبت‌نام دختران' : 'ورود و ثبت‌نام پسران'}</span>
              <ArrowLeft size={18} className="group-hover:translate-x-[-4px] transition-transform" />
            </div>

            <p className="text-[11px] sm:text-xs text-slate-200 font-medium drop-shadow-md bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
              برای آغاز ثبت‌نام و دریافت کد اختصاصی، روی بنر کلیک کنید
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
