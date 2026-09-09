import React, { useState } from 'react';
import { Sparkles, Shield, Gem, ArrowLeft, UserPlus, Heart, Zap, LayoutDashboard, SlidersHorizontal, UserCheck } from 'lucide-react';
import { User } from '../../types';
import warroomLogoJpg from '../../assets/images/warroom_logo_1787906676836.jpg';
import boysBannerJpg from '../../assets/images/boys_registration_banner_1788362378043.jpg';
import girlsBannerJpg from '../../assets/images/girls_registration_banner_1788362396185.jpg';

interface AdventureHeroSectionProps {
  themeMode: 'girls' | 'boys';
  currentUser: User | null;
  onOpenRegister: () => void;
  onGoToDashboard?: () => void;
}

export default function AdventureHeroSection({
  themeMode,
  currentUser,
  onOpenRegister,
  onGoToDashboard
}: AdventureHeroSectionProps) {
  const isGirls = themeMode === 'girls';
  const [logoError, setLogoError] = useState(false);

  const handleBannerAction = () => {
    if (currentUser && onGoToDashboard) {
      onGoToDashboard();
    } else {
      onOpenRegister();
    }
  };

  return (
    <div className="w-full space-y-4 text-center">
      
      {/* 1. Main Logo / Typography Brand Header */}
      <div className="space-y-2 pt-2 flex flex-col items-center justify-center">
        <div className="relative inline-flex flex-col items-center justify-center">
          
          {/* Logo JPG Image with Neon / Luminous Effect */}
          {!logoError ? (
            <div className={`relative p-2 rounded-3xl transition-all duration-300 ${
              isGirls 
                ? 'neon-logo-glow-girls bg-gradient-to-tr from-[#ff1389]/30 via-purple-600/25 to-[#7c3aed]/35 border border-fuchsia-500/40' 
                : 'neon-logo-glow-boys bg-gradient-to-tr from-[#dc2626]/35 via-slate-950/60 to-[#2563eb]/40 border border-blue-500/50 shadow-[0_0_25px_rgba(37,99,235,0.4)]'
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
                  ? 'bg-[#180126] text-fuchsia-200 border-fuchsia-500/70 shadow-[0_0_15px_rgba(255,19,137,0.6)]' 
                  : 'bg-[#030718] text-blue-200 border-blue-500/70 shadow-[0_0_15px_rgba(37,99,235,0.6)]'
              }`}>
                اتاق جنگ
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <Shield size={36} className={isGirls ? 'text-fuchsia-400' : 'text-blue-400'} />
              <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-tight drop-shadow-2xl font-serif ${
                isGirls 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-300 to-purple-300' 
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-red-400'
              }`}>
                اتاق جنگ
              </h1>
            </div>
          )}

          <span className={`h-1 w-32 rounded-full blur-sm mt-3 ${
            isGirls 
              ? 'bg-gradient-to-r from-transparent via-[#ff1389] to-transparent' 
              : 'bg-gradient-to-r from-transparent via-[#2563eb] to-[#dc2626]'
          }`} />
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white drop-shadow-lg pt-1">
          {isGirls ? 'بخش دختران سرافراز اتاق جنگ' : 'بخش پسران سلحشور اتاق جنگ'}
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed px-3">
          {currentUser 
            ? `شما با حساب رزمنده «${currentUser.first_name} ${currentUser.last_name}» وارد شده‌اید. برای دسترسی مستقیم به پنل روی بنر کلیک کنید.`
            : 'برای شرکت در مسابقات، دریافت کریستال‌ها و رقابت در جدول برترین‌های کشور، روی بنر زیر کلیک کرده و ثبت‌نام خود را تکمیل کنید.'
          }
        </p>
      </div>

      {/* 2. Interactive Image Registration Banner Based on Gender Selection */}
      <div 
        onClick={handleBannerAction}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleBannerAction();
          }
        }}
        className={`group relative rounded-3xl overflow-hidden border-2 p-1.5 shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-[1.01] active:scale-[0.99] ${
          isGirls
            ? 'bg-gradient-to-b from-[#21052c]/90 via-[#100118]/95 to-[#040008] border-fuchsia-500/60 shadow-[0_0_45px_rgba(255,19,137,0.4)] hover:border-fuchsia-400 hover:shadow-[0_0_65px_rgba(255,19,137,0.65)]'
            : 'bg-gradient-to-b from-[#0e1832]/95 via-[#050b18]/95 to-[#010207] border-blue-500/60 shadow-[0_0_45px_rgba(37,99,235,0.4)] hover:border-blue-400 hover:shadow-[0_0_65px_rgba(37,99,235,0.65)]'
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
              ? 'from-[#050009]/95 via-[#050009]/40 to-transparent group-hover:from-[#050009]/90'
              : 'from-[#010207]/95 via-[#020512]/45 to-transparent group-hover:from-[#010207]/90'
          }`} />

          {/* Bottom Action Centerpiece (Click to Register or Go to Panel) */}
          <div className="absolute bottom-5 sm:bottom-7 left-0 right-0 flex flex-col items-center justify-center gap-2.5 px-4 z-10">
            <div className={`px-6 sm:px-10 py-3 sm:py-3.5 rounded-2xl font-black text-sm sm:text-base border shadow-2xl flex items-center gap-3 transition transform group-hover:scale-105 ${
              isGirls
                ? 'girls-button-neon text-white border-pink-200/50 shadow-[0_0_35px_rgba(255,19,137,0.85)]'
                : 'boys-button-tactical text-white border-blue-200/50 shadow-[0_0_35px_rgba(37,99,235,0.85)]'
            }`}>
              {currentUser ? (
                currentUser.role === 'admin' ? (
                  <>
                    <SlidersHorizontal size={20} className="group-hover:rotate-12 transition-transform text-amber-300" />
                    <span>ورود مستقیم به پنل مدیریت کل</span>
                  </>
                ) : (
                  <>
                    <LayoutDashboard size={20} className="group-hover:rotate-12 transition-transform" />
                    <span>ورود مستقیم به پنل کاربری ({currentUser.first_name})</span>
                  </>
                )
              ) : (
                <>
                  <UserPlus size={20} className="group-hover:rotate-12 transition-transform" />
                  <span>{isGirls ? 'ورود و ثبت‌نام دختران' : 'ورود و ثبت‌نام پسران'}</span>
                </>
              )}
              <ArrowLeft size={18} className="group-hover:translate-x-[-4px] transition-transform" />
            </div>

            <p className="text-[11px] sm:text-xs text-slate-200 font-medium drop-shadow-md bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
              {currentUser 
                ? 'حساب کاربری شما فعال و ذخیره است — برای رفتن به اتاق عملیات کلیک کنید'
                : 'برای آغاز ثبت‌نام و دریافت کد اختصاصی، روی بنر کلیک کنید'
              }
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
