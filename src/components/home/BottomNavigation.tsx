import React, { useState } from 'react';
import { 
  Home, 
  BookOpen, 
  MoreHorizontal, 
  User as UserIcon, 
  Headphones, 
  PhoneCall,
  Users, 
  SlidersHorizontal, 
  LogOut, 
  X, 
  Award, 
  Info,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../../types';

interface BottomNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser?: User | null;
  onOpenCentralModal?: () => void;
  onOpenSquadModal?: () => void;
  onOpenAboutModal?: () => void;
  onLogout?: () => void;
  isAdminMode?: boolean;
  setIsAdminMode?: (val: boolean) => void;
  unreadTicketsCount?: number;
}

export default function BottomNavigation({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenCentralModal,
  onOpenSquadModal,
  onOpenAboutModal,
  onLogout,
  isAdminMode = false,
  setIsAdminMode,
  unreadTicketsCount = 0
}: BottomNavigationProps) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainItems = [
    { id: 'Home', label: 'صفحه اصلی', icon: Home },
    { id: 'Trainings', label: 'آموزش‌ها', icon: BookOpen },
    { id: 'Support', label: 'ارتباط با ما', icon: Headphones, isCentral: true },
    { id: 'Contact', label: 'تماس با ما', icon: PhoneCall },
    { id: 'More', label: 'بیشتر', icon: MoreHorizontal, isMore: true }
  ];

  const handleMoreItemClick = (action: () => void) => {
    setIsMoreOpen(false);
    action();
  };

  return (
    <>
      {/* Android Bottom Navigation Bar */}
      <nav 
        aria-label="ناوبری اصلی اندروید" 
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden w-full max-w-xl mx-auto bg-[#080d22]/95 backdrop-blur-2xl border-t border-cyan-500/30 px-2 py-1.5 flex items-center justify-around dir-rtl shadow-[0_-8px_32px_rgba(0,0,0,0.9)] rounded-t-2xl"
      >
        {mainItems.map((item) => {
          const Icon = item.icon;
          const isActive = !isMoreOpen && activeTab === item.id;

          if (item.isCentral) {
            return (
              <button
                key={item.id}
                onClick={() => {
                  setIsMoreOpen(false);
                  setActiveTab('Support');
                }}
                aria-label={item.label}
                title={item.label}
                className="relative -top-3 flex flex-col items-center justify-center focus:outline-none group"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00f0ff] via-[#3b82f6] to-[#06b6d4] p-0.5 shadow-[0_0_20px_rgba(6,182,212,0.6)] group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full bg-[#070b1a] flex items-center justify-center text-white border border-cyan-400/50">
                    <Headphones size={20} className="text-cyan-400 animate-pulse drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  </div>
                </div>
                <span className="text-[9px] font-black text-cyan-400 mt-0.5 tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          }

          if (item.isMore) {
            return (
              <button
                key={item.id}
                onClick={() => setIsMoreOpen(prev => !prev)}
                aria-label="امکانات و بخش‌های بیشتر"
                title="بیشتر"
                className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all focus:outline-none ${
                  isMoreOpen 
                    ? 'text-cyan-400 bg-cyan-950/60 border border-cyan-500/40' 
                    : isAdminMode 
                    ? 'text-amber-400 bg-amber-950/40 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isMoreOpen && (
                  <span className="absolute -top-1.5 w-6 h-0.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                )}
                {isAdminMode && !isMoreOpen && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-[#080d22] animate-pulse" />
                )}
                <MoreHorizontal size={20} className={isMoreOpen ? 'scale-110 text-cyan-300 animate-bounce' : isAdminMode ? 'text-amber-400' : ''} />
                <span className={`text-[9px] font-bold mt-0.5 ${isMoreOpen ? 'text-cyan-300 font-black' : isAdminMode ? 'text-amber-300 font-black' : 'text-slate-400'}`}>
                  {isAdminMode ? 'ادمین' : item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => {
                setIsMoreOpen(false);
                setActiveTab(item.id);
              }}
              aria-label={item.label}
              title={item.label}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all focus:outline-none ${
                isActive 
                  ? 'text-cyan-400' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 w-6 h-0.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
              )}
              <Icon size={19} className={isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] text-cyan-400' : ''} />
              <span className={`text-[9px] font-bold mt-0.5 ${isActive ? 'text-cyan-300 font-black' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Animated Android Bottom Sheet Drawer for "بیشتر" */}
      <AnimatePresence>
        {isMoreOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
            
            {/* Backdrop Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMoreOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Bottom Drawer Card */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative w-full max-w-xl mx-auto bg-[#070c1e] border-t border-cyan-500/40 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.95)] p-4 pb-20 dir-rtl space-y-4"
            >
              {/* Drag Handle Pill */}
              <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto" />

              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
                    <Shield size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">منوی دسترسی سریع و امکانات</h3>
                    <p className="text-[10px] text-cyan-400/80">سامانه ارزیابی و اتاق جنگ دانش‌آموزی</p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsMoreOpen(false)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Grid of Action Options */}
              <div className="grid grid-cols-2 gap-2.5">
                
                {/* Trainings */}
                <button
                  onClick={() => handleMoreItemClick(() => setActiveTab('Trainings'))}
                  className={`flex items-center justify-between p-3 rounded-2xl border text-right transition ${
                    activeTab === 'Trainings'
                      ? 'bg-amber-950/80 border-amber-400 text-amber-300'
                      : 'bg-[#0b122c] border-cyan-500/20 text-slate-200 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-900/40 text-amber-400">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-black">آموزش‌های استراتژیک</div>
                      <div className="text-[9px] text-slate-400">دوره‌ها و فیلم‌ها</div>
                    </div>
                  </div>
                  <ChevronLeft size={16} className="text-slate-500" />
                </button>
                
                {/* Support & Tickets */}
                <button
                  onClick={() => handleMoreItemClick(() => setActiveTab('Support'))}
                  className={`flex items-center justify-between p-3 rounded-2xl border text-right transition relative ${
                    activeTab === 'Support'
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                      : 'bg-[#0b122c] border-cyan-500/20 text-slate-200 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-900/40 text-blue-400">
                      <Headphones size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-black flex items-center gap-1">
                        <span>پشتیبانی و تیکت</span>
                        {unreadTicketsCount > 0 && (
                          <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                            {unreadTicketsCount}
                          </span>
                        )}
                      </div>
                      <div className="text-[9px] text-slate-400">ارتباط مستقیم با پشتیبان</div>
                    </div>
                  </div>
                  <ChevronLeft size={16} className="text-slate-500" />
                </button>

                {/* Profile & Medals */}
                <button
                  onClick={() => handleMoreItemClick(() => setActiveTab('Profile'))}
                  className={`flex items-center justify-between p-3 rounded-2xl border text-right transition ${
                    activeTab === 'Profile'
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                      : 'bg-[#0b122c] border-cyan-500/20 text-slate-200 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-cyan-900/40 text-cyan-400">
                      <UserIcon size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-black">شناسنامه و مدال‌ها</div>
                      <div className="text-[9px] text-slate-400">پروفایل رزمنده</div>
                    </div>
                  </div>
                  <ChevronLeft size={16} className="text-slate-500" />
                </button>

                {/* Contact Us - تماس با ما */}
                <button
                  onClick={() => handleMoreItemClick(() => setActiveTab('Contact'))}
                  className={`flex items-center justify-between p-3 rounded-2xl border text-right transition ${
                    activeTab === 'Contact'
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                      : 'bg-[#0b122c] border-cyan-500/20 text-slate-200 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-cyan-900/40 text-cyan-400">
                      <PhoneCall size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-black">تماس با ما</div>
                      <div className="text-[9px] text-slate-400">شماره‌ها و آدرس ستاد</div>
                    </div>
                  </div>
                  <ChevronLeft size={16} className="text-slate-500" />
                </button>

                {/* About Competition */}
                {onOpenAboutModal && (
                  <button
                    onClick={() => handleMoreItemClick(onOpenAboutModal)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#0b122c] border border-cyan-500/20 text-slate-200 hover:border-cyan-500/40 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-emerald-900/30 text-emerald-400">
                        <Info size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-black">درباره قرارگاه</div>
                        <div className="text-[9px] text-slate-400">قوانین و راهنما</div>
                      </div>
                    </div>
                    <ChevronLeft size={16} className="text-slate-500" />
                  </button>
                )}

                {/* Squad Management for Leaders */}
                {currentUser?.role === 'leader' && onOpenSquadModal && (
                  <button
                    onClick={() => handleMoreItemClick(onOpenSquadModal)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#140b2a] border border-purple-500/30 text-purple-200 hover:border-purple-400 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-purple-900/40 text-purple-400">
                        <Users size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-black">مدیریت جوخه</div>
                        <div className="text-[9px] text-purple-300/80">فرماندهی تیم</div>
                      </div>
                    </div>
                    <ChevronLeft size={16} className="text-purple-400" />
                  </button>
                )}

                {/* Admin Mode Switcher for Admins */}
                {currentUser?.role === 'admin' && setIsAdminMode && (
                  <button
                    onClick={() => handleMoreItemClick(() => {
                      const target = !isAdminMode;
                      setIsAdminMode(target);
                      setActiveTab(target ? 'Admin' : 'Home');
                    })}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#241304] border border-amber-500/40 text-amber-200 hover:border-amber-400 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-900/40 text-amber-400">
                        <SlidersHorizontal size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-black">پنل مدیریت کل</div>
                        <div className="text-[9px] text-amber-300/80">
                          {isAdminMode ? 'برگشت به کاربر' : 'ورود به پنل ارزیابی'}
                        </div>
                      </div>
                    </div>
                    <ChevronLeft size={16} className="text-amber-400" />
                  </button>
                )}

              </div>

              {/* Logout Button */}
              {onLogout && currentUser && (
                <button
                  onClick={() => handleMoreItemClick(onLogout)}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-rose-950/60 border border-rose-600/40 text-rose-300 font-bold text-xs hover:bg-rose-900/80 transition"
                >
                  <LogOut size={16} />
                  <span>خروج از حساب کاربری</span>
                </button>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

