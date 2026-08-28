import React from 'react';
import { 
  Gamepad2, 
  Headphones, 
  Info,
  Home as HomeIcon
} from 'lucide-react';
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
}: BottomNavigationProps) {
  const mainItems = [
    { id: 'Home', label: 'صفحه اصلی', icon: HomeIcon },
    { id: 'Support', label: 'ارتباط با ما', icon: Headphones },
    { id: currentUser ? 'Journey' : 'CampaignSelect', label: currentUser ? 'پنل کاربری' : 'انتخاب پویش', icon: Gamepad2, isCentral: true },
    { id: 'About', label: 'درباره ما', icon: Info }
  ];

  return (
    <>
      {/* Slim & Elegant Android Bottom Navigation Bar */}
      <nav 
        aria-label="ناوبری پنل اندروید" 
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden w-full max-w-xl mx-auto bg-[#040814]/95 backdrop-blur-xl border-t border-slate-800/80 px-4 py-1.5 flex items-center justify-around dir-rtl shadow-[0_-4px_24px_rgba(0,0,0,0.8)] h-[56px] rounded-t-xl"
        id="bottom-navigation-mobile"
      >
        {mainItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
              }}
              aria-label={item.label}
              title={item.label}
              className="relative flex flex-col items-center justify-center h-full w-20 focus:outline-none transition-all duration-200"
            >
              {/* Sleek, Line-style Container with Clean Border */}
              <div className={`flex flex-col items-center justify-center w-full py-1 px-2.5 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-cyan-950/30 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)] text-cyan-400' 
                  : 'border border-transparent text-slate-400 hover:text-slate-200'
              }`}>
                <Icon 
                  size={18} 
                  strokeWidth={1.5} /* Thin, line-style vector lines */
                  className={`transition-all duration-200 ${
                    isActive ? 'scale-105' : ''
                  }`}
                />
                
                {/* Micro Label */}
                <span className={`text-[9px] mt-0.5 tracking-tight transition-all duration-200 font-bold ${
                  isActive ? 'text-cyan-400' : 'text-slate-500'
                }`}>
                  {item.label}
                </span>
              </div>

              {/* Tiny indicator bar at the bottom */}
              {isActive && (
                <div className="absolute bottom-0.5 w-4 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}

