import React, { useState } from 'react';
import { 
  Shield, ArrowLeft, UserPlus, 
  LayoutDashboard, SlidersHorizontal 
} from 'lucide-react';
import { User, SiteSettings } from '../../types';
import warroomLogoJpg from '../../assets/images/warroom_logo_1787906676836.jpg';
import boysBannerJpg from '../../assets/images/boys_registration_banner_1788362378043.jpg';
import girlsBannerJpg from '../../assets/images/girls_registration_banner_1788362396185.jpg';

interface AdventureHeroSectionProps {
  themeMode: 'girls' | 'boys';
  currentUser: User | null;
  onOpenRegister: () => void;
  onGoToDashboard?: () => void;
  siteSettings?: SiteSettings;
  onNavigate?: (tab: string) => void;
}

export default function AdventureHeroSection({
  themeMode,
  currentUser,
  onOpenRegister,
  onGoToDashboard,
  siteSettings,
}: AdventureHeroSectionProps) {
  const isGirls = themeMode === 'girls';
  const [logoError, setLogoError] = useState(false);

  // کاربر واردشده (ثبت‌نام/ورود انجام شده) → دکمه با نام او نمایش داده می‌شود
  const isLoggedIn = Boolean(currentUser);
  const honorific = currentUser?.gender === 'دختر' ? 'خانم' : 'آقای';

  const logoSrc = siteSettings?.heroImage || warroomLogoJpg;
  const girlsBannerSrc = siteSettings?.girlsBannerImage || girlsBannerJpg;
  const boysBannerSrc = siteSettings?.boysBannerImage || boysBannerJpg;
  const siteTitle = siteSettings?.heroTitle || 'اتاق جنگ';
  const badgeText = siteSettings?.badgeText || 'اتاق جنگ';

  const handleBannerAction = () => {
    if (currentUser) {
      // کاربر شناسایی شده → ورود مستقیم به پنل
      onGoToDashboard?.();
    } else {
      onOpenRegister();
    }
  };

  return (
    <div className="w-full space-y-4 text-center">
      
      {/* 1. Main Logo Icon Only (بدون نوشته زیر آیکون) */}
      <div className="pt-2 flex flex-col items-center justify-center">
        <div className="relative inline-flex flex-col items-center justify-center">
          
          {/* Logo Image with Neon / Luminous Effect */}
          {!logoError ? (
            <div className={`relative p-2 rounded-3xl transition-all duration-300 ${
              isGirls 
                ? 'neon-logo-glow-girls bg-gradient-to-tr from-[#ff1389]/30 via-purple-600/25 to-[#7c3aed]/35 border border-fuchsia-500/40' 
                : 'neon-logo-glow-boys bg-gradient-to-tr from-[#dc2626]/35 via-slate-950/60 to-[#2563eb]/40 border border-blue-500/50 shadow-[0_0_25px_rgba(37,99,235,0.4)]'
            }`}>
              <img 
                src={logoSrc} 
                alt="لوگوی رسمی"
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
                className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-2xl border-2 border-white/20 shadow-2xl transition hover:scale-105"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center p-3">
              <Shield size={48} className={isGirls ? 'text-fuchsia-400' : 'text-blue-400'} />
            </div>
          )}
        </div>
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
            src={isGirls ? girlsBannerSrc : boysBannerSrc} 
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

          {/* Bottom Action Centerpiece (مهمان: ثبت‌نام | کاربر واردشده: نام او + دعوت به ورود به پنل) */}
          <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 flex flex-col items-center justify-center px-4 z-10">
            <div className={`px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-2xl font-black text-xs sm:text-sm border shadow-2xl flex items-center gap-2.5 sm:gap-3 transition transform group-hover:scale-105 cursor-pointer max-w-full text-center ${
              isGirls
                ? 'girls-button-neon text-white border-pink-200/50 shadow-[0_0_35px_rgba(255,19,137,0.85)]'
                : 'boys-button-tactical text-white border-blue-200/50 shadow-[0_0_35px_rgba(37,99,235,0.85)]'
            }`}>
              {isLoggedIn ? (
                <LayoutDashboard size={22} className="shrink-0 group-hover:rotate-6 transition-transform" />
              ) : (
                <UserPlus size={22} className="shrink-0 group-hover:rotate-12 transition-transform" />
              )}
              {isLoggedIn && currentUser ? (
                <span className="tracking-wide leading-snug py-0.5">
                  <span>{honorific} {currentUser.first_name} {currentUser.last_name}</span>
                  <span className="block text-[10px] sm:text-xs font-bold opacity-90 mt-0.5">برای ورود به پنل کلیک کنید</span>
                </span>
              ) : (
                <span className="tracking-wide">ثبت‌نام</span>
              )}
              <ArrowLeft size={18} className="shrink-0 group-hover:translate-x-[-4px] transition-transform" />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

