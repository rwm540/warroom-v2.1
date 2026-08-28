import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Gamepad2, 
  User as UserIcon, 
  Copy, 
  Check, 
  LogOut, 
  Users, 
  SlidersHorizontal, 
  Bell, 
  LayoutDashboard, 
  Target, 
  BookOpen, 
  Home, 
  MoreHorizontal, 
  X, 
  Headphones, 
  Info, 
  Award, 
  ChevronLeft, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Radio, 
  Trophy,
  Gift,
  Grid
} from 'lucide-react';
import { User } from '../types';
import { formatToPersianDigits } from '../utils/jalali';

interface NavbarProps {
  currentUser: User | null;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onLogout: () => void;
  onOpenSquadModal: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
  isAdminView: boolean;
  setIsAdminView: (val: boolean) => void;
  unreadTicketsCount?: number;
}

export default function Navbar({
  currentUser,
  currentTab,
  setCurrentTab,
  onLogout,
  onOpenSquadModal,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  isAdminView,
  setIsAdminView,
  unreadTicketsCount = 0
}: NavbarProps) {
  const [copied, setCopied] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

  const copyPersonalCode = () => {
    if (currentUser?.personal_code) {
      navigator.clipboard.writeText(currentUser.personal_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'admin':
        return 'مدیریت کل ستاد';
      case 'leader':
        return 'فرمانده ارشد جوخه';
      case 'member':
        return 'عضو جوخه عملیاتی';
      case 'user':
      default:
        return 'رزمنده انفرادی جنگ';
    }
  };

  const handleSelectTab = (tab: string, isAdmin = false) => {
    setIsAdminView(isAdmin);
    setCurrentTab(tab);
    setIsMobileMoreOpen(false);
  };

  // Full Desktop Navigation items (all visible on desktop/laptop)
  const desktopNavItems = [
    { id: 'Journey', label: 'نقشه مراحل بازی (Game Map)', icon: Gamepad2 },
    { id: 'Rewards', label: 'جوایز و امتیازات (Prizes)', icon: Gift },
    { id: 'Vitrin', label: 'ویترین و اکسپلور (Vitrin)', icon: Grid },
    { id: 'Leaderboard', label: 'جدول رده‌بندی (Leaderboard)', icon: Trophy },
    { id: 'Dashboard', label: 'داشبورد عملیات', icon: LayoutDashboard },
    { id: 'Trainings', label: 'آموزش‌ها', icon: BookOpen },
    { id: 'Profile', label: 'پروفایل و نشان‌ها', icon: Award },
    { id: 'Support', label: 'پشتیبانی و تیکت‌ها', icon: Headphones, badge: unreadTicketsCount > 0 ? formatToPersianDigits(unreadTicketsCount) : undefined },
    { id: 'About', label: 'درباره ما', icon: Info },
  ];

  // Android Mobile Bottom Navigation (Core 4 tabs)
  const mobileBottomItems = [
    { id: 'Journey', label: 'نقشه بازی', icon: Gamepad2 },
    { id: 'Rewards', label: 'جوایز ۹‌گانه', icon: Gift },
    { id: 'Vitrin', label: 'ویترین آثار', icon: Grid },
    { id: 'Leaderboard', label: 'رده‌بندی', icon: Trophy },
  ];

  // Items shown inside the Mobile Android Bottom Sheet (More ...)
  const mobileSheetItems = [
    { 
      id: 'Profile', 
      label: 'پروفایل و مدال‌های فردی', 
      desc: 'مشاهده نشان‌ها، آمار عملیاتی و دستاوردهای شخصی',
      icon: Award, 
      badge: 'شخصی' 
    },
    ...(currentUser?.role === 'admin' ? [
      { 
        id: 'Admin', 
        label: 'پنل ارزیابی و مدیریت ستاد', 
        desc: 'داوری مأموریت‌ها، مدیریت کاربران، جوخه‌ها و اخبار',
        icon: SlidersHorizontal, 
        isAdmin: true,
        badge: 'مدیر کل' 
      }
    ] : []),
    { 
      id: 'Home', 
      label: 'صفحه اصلی و معرفی رویداد', 
      desc: 'مشاهده پوسترها، تیزرها و بخش عمومی سایت',
      icon: Home 
    },
    { 
      id: 'Support', 
      label: 'پشتیبانی و تیکت‌های پاسخ‌گویی', 
      desc: 'ارتباط مستقیم با مرکز پشتیبانی فنی و داوری',
      icon: Headphones,
      badge: unreadTicketsCount > 0 ? `${formatToPersianDigits(unreadTicketsCount)} تیکت` : undefined
    },
    { 
      id: 'About', 
      label: 'درباره پلتفرم اتاق جنگ', 
      desc: 'اهداف طرح، ساختار مسابقات و اطلاعات قرارگاه',
      icon: Info 
    },
  ];

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. TOP HEADER (DESKTOP & MOBILE TOP BAR)                                  */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#050816]/95 backdrop-blur-md border-b border-cyan-500/20 shadow-[0_4px_25px_rgba(0,0,0,0.7)] dir-rtl font-sans">
        
        {/* Top Utility Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between border-b border-slate-800/80 text-xs">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-600 to-rose-600 p-[1.5px] shadow-[0_0_12px_rgba(6,182,212,0.4)]">
              <div className="w-full h-full bg-[#070b1e] rounded-[11px] flex items-center justify-center text-cyan-400 font-bold">
                <ShieldAlert size={18} className="animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-xs sm:text-sm md:text-base text-white tracking-tight">اتاق جنگ</h1>
                <span className="bg-cyan-950/80 text-cyan-300 text-[9px] font-mono px-1.5 py-0.5 rounded border border-cyan-500/40 font-bold">
                  OPERATIONAL v2.5
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden md:block">سامانه ارزیابی، مسابقه و آموزش‌های استراتژیک دانش‌آموزی</p>
            </div>
          </div>

          {/* User Controls / Status */}
          {currentUser && (
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* 9-Digit Personal Code Badge (Visible on desktop & tablet) */}
              <div 
                onClick={copyPersonalCode}
                title="برای کپی کد اختصاصی ۹ رقمی کلیک کنید"
                className="hidden sm:flex items-center gap-1.5 bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 px-2.5 py-1 rounded-lg text-slate-300 hover:text-white cursor-pointer transition font-mono text-[11px]"
              >
                <span className="text-[10px] text-slate-400 font-sans">کد اختصاصی:</span>
                <span className="font-black text-cyan-300 tracking-wider">
                  {formatToPersianDigits(currentUser.personal_code)}
                </span>
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} className="text-slate-400" />}
              </div>

              {/* Role Badge */}
              <span className={`hidden md:inline-block text-[10px] font-bold px-2 py-1 rounded-md border ${
                currentUser.role === 'admin' 
                  ? 'bg-amber-950/60 text-amber-300 border-amber-800/60' 
                  : currentUser.role === 'leader' 
                  ? 'bg-red-950/80 text-red-300 border-red-800/60' 
                  : 'bg-cyan-950/60 text-cyan-300 border-cyan-800/50'
              }`}>
                {getRoleLabel(currentUser.role)}
              </span>

              {/* Leader Squad Management (Desktop trigger) */}
              {currentUser.role === 'leader' && (
                <button
                  onClick={onOpenSquadModal}
                  className="hidden md:flex items-center gap-1 bg-red-900/40 hover:bg-red-900/70 border border-red-700/60 text-red-200 px-2.5 py-1 rounded-lg text-xs font-bold transition shadow-[0_0_10px_rgba(220,38,38,0.2)]"
                >
                  <Users size={14} />
                  <span>مدیریت جوخه</span>
                </button>
              )}

              {/* Admin Panel Switcher (Desktop trigger) */}
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => {
                    const target = !isAdminView;
                    setIsAdminView(target);
                    setCurrentTab(target ? 'Admin' : 'Dashboard');
                  }}
                  className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition border ${
                    isAdminView 
                      ? 'bg-amber-500 text-black border-amber-400 font-black shadow-[0_0_12px_rgba(245,158,11,0.5)]' 
                      : 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/50'
                  }`}
                >
                  <SlidersHorizontal size={14} />
                  <span>{isAdminView ? 'خروج از پنل ادمین' : 'پنل مدیریت ستاد'}</span>
                </button>
              )}

              {/* Notification Bell */}
              {onOpenNotifications && (
                <button
                  onClick={onOpenNotifications}
                  className="relative p-1.5 bg-slate-900 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 rounded-lg transition"
                  title="پیام‌ها و اعلانات ستاد"
                >
                  <Bell size={16} />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center border border-black animate-pulse">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>
              )}

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="p-1.5 bg-slate-900 hover:bg-red-950/80 border border-slate-800 hover:border-red-800 text-slate-400 hover:text-red-300 rounded-lg transition"
                title="خروج از سامانه"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP FULL NAVIGATION BAR (VISIBLE ONLY ON MD / DESKTOP SCREENS)         */}
        {/* ========================================================================= */}
        {currentUser && (
          <div className="hidden md:block max-w-7xl mx-auto px-4 py-2">
            <nav className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                {desktopNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id && !isAdminView;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id, false)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 border cursor-pointer ${
                        isActive
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                          : 'bg-slate-900/60 text-slate-300 hover:text-white border-slate-800/80 hover:border-cyan-500/30 hover:bg-slate-800/80'
                      }`}
                    >
                      <Icon size={15} strokeWidth={1.8} className={isActive ? 'text-slate-950' : 'text-cyan-400'} />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="bg-rose-500 text-white text-[9px] font-mono px-1.5 py-0.2 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Desktop Admin Quick Access Button */}
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => handleSelectTab('Admin', true)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition border cursor-pointer ${
                    isAdminView
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                      : 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/50'
                  }`}
                >
                  <SlidersHorizontal size={15} />
                  <span>داوری و مدیریت ستاد</span>
                </button>
              )}
            </nav>
          </div>
        )}

      </header>

      {/* ========================================================================= */}
      {/* 2. ANDROID MOBILE BOTTOM NAVIGATION (VISIBLE ONLY ON MOBILE < MD)         */}
      {/* ========================================================================= */}
      {currentUser && (
        <nav 
          aria-label="منوی موبایل اندروید"
          className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#050816]/95 backdrop-blur-xl border-t border-cyan-500/30 shadow-[0_-8px_30px_rgba(0,0,0,0.85)] dir-rtl"
        >
          <div className="grid grid-cols-4 items-center justify-items-center px-4 py-2">
            
            {/* 4 Primary Android Tabs */}
            {mobileBottomItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id && !isAdminView;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id, false)}
                  title={item.label}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all ${
                    isActive
                      ? 'text-cyan-300 font-black scale-105'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className={`p-2 rounded-xl transition ${
                    isActive ? 'bg-cyan-500/25 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)] border border-cyan-500/40' : 'hover:bg-slate-900/80'
                  }`}>
                    <Icon size={22} strokeWidth={isActive ? 2.4 : 1.7} />
                  </div>
                </button>
              );
            })}

            {/* 5th Tab: Android Three-Dots ("سایر") -> Opens Slide-up Sheet */}
            <button
              onClick={() => setIsMobileMoreOpen(true)}
              title="سایر امکانات و منو"
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all ${
                isMobileMoreOpen
                  ? 'text-amber-400 font-black scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-2 rounded-xl transition ${
                isMobileMoreOpen ? 'bg-amber-500/25 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)] border border-amber-500/40' : 'hover:bg-slate-900/80'
              }`}>
                <MoreHorizontal size={22} strokeWidth={2.2} />
              </div>
            </button>

          </div>
        </nav>
      )}

      {/* ========================================================================= */}
      {/* 3. ANDROID SLIDE-UP BOTTOM SHEET (OPENS ON MOBILE WHEN "سایر" IS CLICKED) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isMobileMoreOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center dir-rtl md:hidden">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMoreOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            />

            {/* Android Slide-Up Sheet Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative z-10 w-full bg-[#070c20] border-t border-x border-cyan-500/40 rounded-t-3xl p-5 pb-8 shadow-[0_-15px_50px_rgba(0,0,0,0.95)] max-h-[85vh] overflow-y-auto"
            >
              
              {/* Android Top Handle Bar */}
              <div className="w-12 h-1.5 bg-slate-600 rounded-full mx-auto mb-4 cursor-pointer" onClick={() => setIsMobileMoreOpen(false)} />

              {/* Sheet Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">منوی دسترسی و بخش‌های تکمیلی</h3>
                    <p className="text-[10px] text-slate-400">اتاق جنگ استراتژیک نوجوانان</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsMobileMoreOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Sheet Extended Items */}
              <div className="space-y-2">
                {mobileSheetItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.isAdmin 
                    ? isAdminView 
                    : currentTab === item.id && !isAdminView;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTab(item.id, !!item.isAdmin)}
                      className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between text-right ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-950/90 to-slate-900 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.2)] text-white'
                          : 'bg-[#050816] hover:bg-slate-900/90 border-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                          isActive
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}>
                          <Icon size={18} strokeWidth={1.6} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{item.label}</span>
                            {item.badge && (
                              <span className="text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{item.desc}</p>
                        </div>
                      </div>

                      <ChevronLeft size={16} className="text-slate-500 shrink-0" />
                    </button>
                  );
                })}

                {/* Leader Squad Management Tile inside Sheet */}
                {currentUser?.role === 'leader' && (
                  <button
                    onClick={() => {
                      setIsMobileMoreOpen(false);
                      onOpenSquadModal();
                    }}
                    className="w-full p-3 rounded-2xl bg-gradient-to-r from-red-950/80 to-slate-900 border border-red-700/60 hover:border-red-500 transition-all flex items-center justify-between text-right mt-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-900/40 text-red-300 border border-red-700/60 flex items-center justify-center shrink-0">
                        <Users size={18} strokeWidth={1.6} />
                      </div>
                      <div>
                        <span className="text-xs font-black text-red-200 block">مدیریت و اصلاح اعضای جوخه</span>
                        <p className="text-[10px] text-red-400/80">تغییر اعضا، بازبینی مشخصات و مدیریت دسترسی جوخه</p>
                      </div>
                    </div>
                    <ChevronLeft size={16} className="text-red-400 shrink-0" />
                  </button>
                )}
              </div>

              {/* Bottom Quick Logout */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px]">کاربر: <strong className="text-white">{currentUser?.first_name} {currentUser?.last_name}</strong></span>
                <button
                  onClick={() => {
                    setIsMobileMoreOpen(false);
                    onLogout();
                  }}
                  className="flex items-center gap-1.5 text-red-400 hover:text-red-300 font-bold bg-red-950/40 px-3 py-1.5 rounded-xl border border-red-800/40 transition"
                >
                  <LogOut size={14} />
                  <span>خروج از حساب</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
