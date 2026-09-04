import React from 'react';
import { motion } from 'motion/react';
import { 
  Gamepad2, 
  Gift, 
  LayoutDashboard, 
  Grid 
} from 'lucide-react';
import { User } from '../../types';

export interface BottomNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser?: User | null;
  isAdminMode?: boolean;
  setIsAdminMode?: (val: boolean) => void;
  campaignTheme?: 'girls' | 'boys';
}

export default function BottomNavigation({
  activeTab,
  setActiveTab,
  currentUser,
  isAdminMode,
  setIsAdminMode,
  campaignTheme
}: BottomNavigationProps) {
  const isGirls = campaignTheme === 'girls' || currentUser?.gender === 'دختر';

  // The 4 Core Android Navigation Tabs
  const items = [
    { id: 'Journey', label: 'نقشه بازی', icon: Gamepad2 },
    { id: 'Rewards', label: 'جوایز و امتیازات', icon: Gift },
    { id: 'Dashboard', label: 'داشبورد عملیات', icon: LayoutDashboard },
    { id: 'Vitrin', label: 'ویترین و آثار', icon: Grid },
  ];

  const handleSelectTab = (tabId: string) => {
    if (setIsAdminMode) {
      setIsAdminMode(false);
    }
    setActiveTab(tabId);
  };

  return (
    <nav 
      aria-label="منوی اندروید"
      className={`fixed bottom-3.5 inset-x-3.5 sm:bottom-5 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-[430px] z-40 rounded-[28px] backdrop-blur-2xl border shadow-[0_12px_45px_rgba(0,0,0,0.85)] dir-rtl px-2 py-1.5 transition-all duration-300 select-none md:hidden ${
        isGirls 
          ? 'bg-[#160619]/95 border-pink-500/40 shadow-[0_12px_45px_rgba(0,0,0,0.85),0_0_25px_rgba(244,63,94,0.22)]'
          : 'bg-[#050b1d]/95 border-cyan-500/35 shadow-[0_12px_45px_rgba(0,0,0,0.85),0_0_25px_rgba(6,182,212,0.22)]'
      }`}
      id="android-bottom-navigation"
    >
      <div className="grid grid-cols-4 items-center justify-items-center relative">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = (activeTab === item.id && !isAdminMode) || (item.id === 'Dashboard' && isAdminMode);

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.88 }}
              onClick={() => handleSelectTab(item.id)}
              aria-label={item.label}
              title={item.label}
              className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all w-full select-none cursor-pointer focus:outline-none ${
                isActive
                  ? isGirls ? 'text-pink-300 font-black' : 'text-cyan-300 font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Animated Sliding Highlight Pill */}
              {isActive && (
                <motion.div
                  layoutId="android-active-pill"
                  transition={{ type: "spring", stiffness: 460, damping: 33 }}
                  className={`absolute inset-0 rounded-2xl border shadow-md ${
                    isGirls
                      ? 'bg-gradient-to-b from-pink-500/25 to-rose-600/15 border-pink-400/40 shadow-[0_0_15px_rgba(244,63,94,0.35)]'
                      : 'bg-gradient-to-b from-cyan-500/25 to-blue-600/15 border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                  }`}
                />
              )}

              <div className="relative z-10 flex flex-col items-center justify-center">
                <motion.div
                  animate={{ scale: isActive ? 1.12 : 1 }}
                  transition={{ type: "spring", stiffness: 420, damping: 26 }}
                >
                  <Icon 
                    size={21} 
                    strokeWidth={isActive ? 2.3 : 1.7} 
                    className={
                      isActive 
                        ? isGirls
                          ? 'text-pink-300 drop-shadow-[0_0_8px_rgba(244,63,94,0.85)]'
                          : 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.85)]'
                        : 'text-slate-400'
                    }
                  />
                </motion.div>
                
                <span className={`text-[10px] font-bold mt-1 tracking-tight truncate max-w-full text-center transition-colors ${
                  isActive 
                    ? isGirls ? 'text-pink-300 font-black' : 'text-cyan-300 font-black'
                    : 'text-slate-400'
                }`}>
                  {item.label}
                </span>

                {/* Active Tiny Glowing Indicator Dot */}
                {isActive && (
                  <motion.span 
                    layoutId="android-active-dot"
                    className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                      isGirls 
                        ? 'bg-pink-400 shadow-[0_0_6px_#f43f5e]'
                        : 'bg-cyan-400 shadow-[0_0_6px_#22d3ee]'
                    }`}
                  />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
