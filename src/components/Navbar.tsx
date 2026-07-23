import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Gamepad2, 
  HelpCircle, 
  PhoneCall,
  User as UserIcon, 
  Copy, 
  Check, 
  LogOut, 
  Users, 
  SlidersHorizontal,
  Bell
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

  return (
    <header className="sticky top-0 z-40 bg-[#050816]/95 backdrop-blur-md border-b border-red-950/60 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between border-b border-slate-900/80 text-xs">
        
        {/* Logo & Operational Status */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-red-600 via-red-800 to-black p-[1px] shadow-[0_0_12px_rgba(220,38,38,0.4)]">
            <div className="w-full h-full bg-[#070b1e] rounded-[7px] flex items-center justify-center text-red-500 font-bold">
              <ShieldAlert size={18} className="animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-xs sm:text-sm md:text-base text-white tracking-tight">اتاق جنگ</h1>
              <span className="hidden sm:inline-block bg-red-950/80 text-red-400 text-[9px] font-mono px-1.5 py-0.5 rounded border border-red-800/50 font-bold">
                OPERATIONAL v2.5
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium hidden md:block">سامانه ارزیابی، مسابقه و آموزش‌های استراتژیک دانش‌آموزی</p>
          </div>
        </div>

        {/* User Info & Actions */}
        {currentUser && (
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* 9-Digit Personal Code Badge (Hidden on Mobile) */}
            <div 
              onClick={copyPersonalCode}
              title="برای کپی کد اختصاصی ۹ رقمی کلیک کنید"
              className="hidden md:flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 hover:border-red-600/50 px-2.5 py-1 rounded-lg text-slate-300 hover:text-white cursor-pointer transition font-mono text-[11px]"
            >
              <span className="text-[10px] text-slate-500 font-sans">کد اختصاصی:</span>
              <span className="font-bold text-red-400 tracking-wider">
                {formatToPersianDigits(currentUser.personal_code)}
              </span>
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} className="text-slate-400" />}
            </div>

            {/* Role Badge (Hidden on Mobile) */}
            <span className={`hidden md:inline-block text-[10px] font-bold px-2 py-1 rounded-md border ${
              currentUser.role === 'admin' 
                ? 'bg-amber-950/60 text-amber-400 border-amber-800/60' 
                : currentUser.role === 'leader' 
                ? 'bg-red-950/80 text-red-400 border-red-800/60' 
                : 'bg-slate-900 text-slate-300 border-slate-800'
            }`}>
              {getRoleLabel(currentUser.role)}
            </span>

            {/* Leader Squad Management Button */}
            {currentUser.role === 'leader' && (
              <button
                onClick={onOpenSquadModal}
                className="flex items-center gap-1 bg-red-900/40 hover:bg-red-900/70 border border-red-700/60 text-red-200 p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-bold transition shadow-[0_0_10px_rgba(220,38,38,0.2)]"
                title="مدیریت جوخه"
              >
                <Users size={15} />
                <span className="hidden sm:inline">مدیریت جوخه</span>
              </button>
            )}

            {/* Admin Switcher / Mode Toggle (Icon on Mobile) */}
            {currentUser.role === 'admin' && (
              <button
                onClick={() => {
                  const target = !isAdminView;
                  setIsAdminView(target);
                  setCurrentTab(target ? 'Admin' : 'Home');
                }}
                className={`flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-bold transition border ${
                  isAdminView 
                    ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]' 
                    : 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/50'
                }`}
                title={isAdminView ? 'خروج از پنل مدیریت' : 'پنل مدیریت'}
              >
                <SlidersHorizontal size={15} />
                <span className="hidden sm:inline">{isAdminView ? 'خروج از مدیریت' : 'مدیریت'}</span>
              </button>
            )}

            {/* Notifications Bell */}
            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="relative p-1.5 bg-slate-900 hover:bg-cyan-950 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 rounded-lg transition"
                title="اعلان‌ها و پیام‌های قرارگاه"
              >
                <Bell size={15} />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center border border-black animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            )}

            {/* Logout */}
            <button
              onClick={onLogout}
              className="p-1.5 bg-slate-900 hover:bg-red-950/80 border border-slate-800 hover:border-red-800 text-slate-400 hover:text-red-300 rounded-lg transition"
              title="خروج از سامانه"
            >
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Main Desktop Navigation Links */}
      {currentUser && (
        <div className="max-w-7xl mx-auto px-4 hidden md:block">
          <nav className="flex items-center gap-2 py-2 overflow-x-auto no-scrollbar">
            
            {/* Home Landing */}
            <button
              onClick={() => { setIsAdminView(false); setCurrentTab('Home'); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                currentTab === 'Home' && !isAdminView
                  ? 'bg-red-900/60 text-white border border-red-600/60 shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <ShieldAlert size={16} />
              <span>صفحه اصلی</span>
            </button>

            {/* Game Selection */}
            <button
              onClick={() => { setIsAdminView(false); setCurrentTab('PortalSelector'); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                currentTab === 'PortalSelector' && !isAdminView
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Gamepad2 size={16} className="text-amber-400" />
              <span>انتخاب بازی</span>
            </button>

            {/* Support - ارتباط با ما */}
            <button
              onClick={() => { setIsAdminView(false); setCurrentTab('Support'); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition relative ${
                currentTab === 'Support' && !isAdminView
                  ? 'bg-red-900/60 text-white border border-red-600/60 shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <HelpCircle size={16} />
              <span>ارتباط با ما</span>
              {unreadTicketsCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold">
                  {unreadTicketsCount}
                </span>
              )}
            </button>

            {/* Contact - تماس با ما */}
            <button
              onClick={() => { setIsAdminView(false); setCurrentTab('Contact'); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                currentTab === 'Contact' && !isAdminView
                  ? 'bg-cyan-900/60 text-cyan-200 border border-cyan-500/60 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <PhoneCall size={16} />
              <span>تماس با ما</span>
            </button>

            {/* Profile & Medals */}
            <button
              onClick={() => { setIsAdminView(false); setCurrentTab('Profile'); }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                currentTab === 'Profile' && !isAdminView
                  ? 'bg-red-900/60 text-white border border-red-600/60 shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <UserIcon size={16} />
              <span>پروفایل و مدال‌ها</span>
            </button>

            {/* Admin Panel Tab (Visible to admins) */}
            {currentUser.role === 'admin' && (
              <button
                onClick={() => { setIsAdminView(true); setCurrentTab('Admin'); }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition border ${
                  isAdminView
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-[0_0_12px_rgba(245,158,11,0.4)]'
                    : 'bg-amber-950/30 text-amber-400 border-amber-800/40 hover:bg-amber-900/50'
                }`}
              >
                <SlidersHorizontal size={16} />
                <span>پنل ارزیابی و مدیریت</span>
              </button>
            )}

          </nav>
        </div>
      )}
    </header>
  );
}
