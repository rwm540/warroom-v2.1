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

  // The 3 Core Android Navigation Tabs for users (Dashboard is now exclusively in Admin Panel)
  const items = [
    { id: 'Journey', label: 'نقشه بازی', icon: Gamepad2 },
    { id: 'Rewards', label: 'جوایز و امتیازات', icon: Gift },
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
          ? 'bg-gradient-to-r from-[#180323]/95 via-[#0c0114]/95 to-[#1c0429]/95 border-fuchsia-500/40 shadow-[0_12px_45px_rgba(0,0,0,0.85),0_0_25px_rgba(255,19,137,0.3)]'
          : 'bg-gradient-to-r from-[#060c22]/95 via-[#0a1538]/95 to-[#160614]/95 border-blue-500/40 shadow-[0_12px_45px_rgba(0,0,0,0.85),0_0_25px_rgba(37,99,235,0.35),0_0_12px_rgba(220,38,38,0.2)]'
      }`}
      id="android-bottom-navigation"
    >
      <div className="grid grid-cols-3 items-center justify-items-center relative">
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
                  ? isGirls ? 'text-fuchsia-300 font-black' : 'text-blue-300 font-black'
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
                      ? 'bg-gradient-to-b from-[#ff1389]/30 to-[#7c3aed]/20 border-fuchsia-400/50 shadow-[0_0_15px_rgba(255,19,137,0.4)]'
                      : 'bg-gradient-to-b from-blue-600/30 via-blue-500/20 to-red-600/20 border-blue-400/50 shadow-[0_0_15px_rgba(37,99,235,0.4)]'
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
                          : 'text-blue-300 drop-shadow-[0_0_8px_rgba(37,99,235,0.85)]'
                        : 'text-slate-400'
                    }
                  />
                </motion.div>
                
                <span className={`text-[10px] font-bold mt-1 tracking-tight truncate max-w-full text-center transition-colors ${
                  isActive 
                    ? isGirls ? 'text-pink-300 font-black' : 'text-blue-300 font-black'
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
                        : 'bg-blue-400 shadow-[0_0_6px_#3b82f6]'
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
