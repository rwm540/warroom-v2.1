import React from 'react';
import { User } from '../../types';
import { Bell, Shield, LogIn, UserPlus, LogOut, Home, ClipboardCheck, BookOpen, Headphones, LayoutDashboard, User as UserIcon } from 'lucide-react';

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
  onOpenProfile
}: TopHeaderProps) {
  const navItems = [
    { id: 'Home', label: 'صفحه اصلی', icon: Home },
    { id: 'Dashboard', label: 'اتاق جنگ', icon: LayoutDashboard },
    { id: 'Missions', label: 'مأموریت‌ها', icon: ClipboardCheck },
    { id: 'Trainings', label: 'آموزش‌ها', icon: BookOpen },
    { id: 'Support', label: 'پشتیبانی', icon: Headphones },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-[#060b1e]/95 backdrop-blur-md border-b border-cyan-500/20 px-2 sm:px-4 py-2 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.6)] dir-rtl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4">
        
        {/* Right Section: Brand Logo */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-cyan-950/70 border border-cyan-500/35 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <Shield size={16} className="text-cyan-400 shrink-0" />
            <span className="text-xs sm:text-sm font-black text-white font-sans whitespace-nowrap">
              اتاق جنگ
            </span>
            <span className="hidden md:inline-block text-[9px] text-cyan-300 font-mono font-bold bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/25">
              v2.5
            </span>
          </div>
        </div>

        {/* Center Section: User Info Pill (Mobile + Desktop) OR Desktop Navigation */}
        <div className="flex items-center justify-center min-w-0 flex-1 px-1">
          {/* Desktop Nav Items (Hidden on Mobile) */}
          {setActiveTab && (
            <nav className="hidden lg:flex items-center gap-1 bg-[#05091a]/80 p-1 rounded-xl border border-cyan-500/20">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      isActive 
                        ? 'bg-cyan-400 text-slate-950 font-black shadow-[0_0_12px_rgba(34,211,238,0.4)]' 
                        : 'text-slate-300 hover:text-white hover:bg-cyan-950/40'
                    }`}
                  >
                    <Icon size={14} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* User Badge / Profile (Compact on Mobile) */}
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

        {/* Left Section: Notifications & Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {/* Notifications Button */}
          <button
            onClick={onToggleNotifications}
            aria-label="اطلاعیه‌ها"
            title="اطلاعیه‌های قرارگاه"
            className="relative p-1.5 sm:p-2 rounded-xl bg-[#0c132a] hover:bg-cyan-950/80 text-slate-300 hover:text-cyan-300 border border-cyan-500/30 transition focus:outline-none shrink-0"
          >
            <Bell size={16} />
            {activeAnnouncementsCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-1 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center border border-[#060b1e] animate-pulse">
                {activeAnnouncementsCount}
              </span>
            )}
          </button>

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

