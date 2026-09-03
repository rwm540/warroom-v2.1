import React from 'react';
import { User } from '../../types';
import { Shield, LogIn, UserPlus, LogOut, Home, Headphones, Info, Gamepad2, User as UserIcon, Heart, Zap, Sparkles } from 'lucide-react';
import warroomLogoJpg from '../../assets/images/warroom_logo_1787906676836.jpg';

interface TopHeaderProps {
  currentUser: User | null;
  activeAnnouncementsCount: number;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onToggleNotifications: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
  campaignTheme?: 'girls' | 'boys';
  onChangeCampaign?: () => void;
  onToggleTheme?: (mode: 'girls' | 'boys') => void;
}

export default function TopHeader({
  currentUser,
  activeAnnouncementsCount,
  activeTab = 'Home',
  setActiveTab,
  onToggleNotifications,
  onOpenLogin,
  onOpenRegister,
  onLogout,
  onOpenProfile,
  campaignTheme = 'boys'
}: TopHeaderProps) {
  const isGirls = campaignTheme === 'girls';
  const navItems = [
    { id: 'Home', label: 'صفحه اصلی', icon: Home },
    { id: 'Support', label: 'ارتباط با ما', icon: Headphones },
    { id: 'About', label: 'درباره ما', icon: Info },
  ];

  return (
    <header className={`sticky top-0 z-30 w-full backdrop-blur-md border-b px-2 sm:px-4 py-2 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.6)] dir-rtl ${
      isGirls 
        ? 'bg-[#15051c]/95 border-pink-500/30' 
        : 'bg-[#060b1e]/95 border-cyan-500/20'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4">
        
        {/* Right Section: Brand Logo */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className={`flex items-center gap-1.5 p-1 rounded-2xl border shadow-md ${
            isGirls
              ? 'bg-pink-950/80 border-pink-500/40 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
              : 'bg-cyan-950/70 border-cyan-500/35 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
          }`}>
            <img 
              src={warroomLogoJpg} 
              alt="اتاق جنگ" 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border border-white/40 shrink-0 shadow-lg" 
              referrerPolicy="no-referrer" 
            />
          </div>
        </div>

        {/* Center Section: User Info Pill */}
        <div className="flex items-center justify-center min-w-0 flex-1 px-1">
          {/* User Badge / Profile */}
          {currentUser && (
            <button 
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-[#080e26] hover:bg-cyan-950/60 border border-cyan-500/30 transition shadow-[0_0_10px_rgba(6,182,212,0.15)]"
              title="شناسنامه و کد اختصاصی رزمنده"
            >
              {/* Personal Code (Hidden on Mobile) */}
              <div className="hidden sm:flex px-1.5 py-0.5 rounded-md bg-red-950/90 border border-red-500/60 text-red-400 font-mono font-black text-xs shrink-0 tracking-wider">
                {currentUser.personal_code || '۷۴۸۹۷۰۳۴'}
              </div>

              {/* Name & Icon */}
              <div className="flex items-center gap-1 min-w-0">
                <UserIcon size={14} className="text-cyan-400 shrink-0" />
                <span className="text-[11px] sm:text-xs font-black text-slate-100 truncate max-w-[100px] xs:max-w-[140px] sm:max-w-none">
                  {currentUser.first_name} {currentUser.last_name}
                </span>
              </div>
            </button>
          )}
        </div>

        {/* Left Section: Auth Actions */}
        <div className="flex items-center gap-1.5 shrink-0">

          {/* Auth State */}
          {!currentUser ? (
            <div className="flex items-center gap-1">
              <button
                onClick={onOpenLogin}
                className="px-2 py-1.5 rounded-xl text-xs font-bold text-slate-200 bg-[#0d142d] hover:bg-[#121c3f] border border-cyan-500/30 transition flex items-center gap-1"
                title="ورود به سامانه"
              >
                <LogIn size={13} className="text-cyan-400" />
                <span className="text-[11px]">ورود</span>
              </button>
              <button
                onClick={onOpenRegister}
                className="px-2.5 py-1.5 rounded-xl text-xs font-black text-slate-950 bg-cyan-400 hover:bg-cyan-300 border border-cyan-300 transition flex items-center gap-1 shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                title="ثبت‌نام جدید"
              >
                <UserPlus size={13} />
                <span className="text-[11px]">ثبت‌نام</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onLogout}
              className="p-1.5 sm:p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/30 transition focus:outline-none shrink-0"
              title="خروج از حساب کاربری"
              aria-label="خروج"
            >
              <LogOut size={16} />
            </button>
          )}

        </div>

      </div>
    </header>
  );
}

