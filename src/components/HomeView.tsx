import React, { useState, useEffect } from 'react';
import { User, Group } from '../types';
import { 
  initialHomeAnnouncements, 
  homeStatsData, 
  faqsData, 
  HomeAnnouncement,
  HomeStats,
  FaqItem
} from '../data/home';

import TopHeader from './home/TopHeader';
import NotificationPanel from './home/NotificationPanel';
import AdventureHeroSection from './home/AdventureHeroSection';
import PrizesAwardsBanner from './home/PrizesAwardsBanner';
import SocialMessengersWidgets from './home/SocialMessengersWidgets';
import AnnouncementsList from './home/AnnouncementsList';
import AboutSection from './home/AboutSection';
import StatsStrip from './home/StatsStrip';
import FaqAccordion from './home/FaqAccordion';
import Footer from './home/Footer';
import { Shield, BookOpen, Sparkles, X, CheckCircle, Gem, Trophy } from 'lucide-react';

interface HomeViewProps {
  currentUser: User | null;
  groups: Group[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: (mode: 'login' | 'register_individual' | 'register_group') => void;
  onLogout: () => void;
  onOpenSquadModal: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
  triggerAlert: (msg: string) => void;
  siteSettings?: any;
  homeAnnouncements?: HomeAnnouncement[];
  homeStats?: HomeStats;
  faqs?: FaqItem[];
  campaignTheme?: 'girls' | 'boys';
  onChangeCampaign?: () => void;
}

export default function HomeView({
  currentUser,
  groups,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  onOpenSquadModal,
  onOpenNotifications,
  unreadNotificationsCount = 0,
  triggerAlert,
  siteSettings,
  homeAnnouncements,
  homeStats,
  faqs,
  campaignTheme = 'boys',
  onChangeCampaign
}: HomeViewProps) {
  // Theme Switching State: 'girls' (feminine pastel/pink) vs 'boys' (masculine cyan/blue/amber)
  const [themeMode, setThemeMode] = useState<'girls' | 'boys'>(() => {
    if (campaignTheme) return campaignTheme;
    if (currentUser?.gender === 'دختر') return 'girls';
    const saved = localStorage.getItem('hisstory_theme_mode');
    return (saved === 'girls' || saved === 'boys') ? saved : 'boys';
  });

  useEffect(() => {
    if (campaignTheme) {
      setThemeMode(campaignTheme);
    }
  }, [campaignTheme]);

  const handleThemeChange = (mode: 'girls' | 'boys') => {
    setThemeMode(mode);
    localStorage.setItem('hisstory_theme_mode', mode);
    triggerAlert(mode === 'girls' ? 'پوسته ویژه دختران فعال شد.' : 'پوسته ویژه پسران فعال شد.');
  };

  // Notification Panel Drawer state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<HomeAnnouncement[]>(() => {
    return homeAnnouncements || initialHomeAnnouncements;
  });

  // Modal states
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Keep state updated if props change
  useEffect(() => {
    if (homeAnnouncements) {
      setAnnouncements(homeAnnouncements);
    }
  }, [homeAnnouncements]);

  const isGirls = themeMode === 'girls';

  const handleStartMission = () => {
    setActiveTab('Journey');
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-500 font-sans p-0 md:p-4 lg:p-6 flex justify-center ${
      isGirls ? 'bg-[#0e0410] text-pink-50' : 'bg-[#030712] text-slate-100'
    }`}>
      
      {/* Dynamic Background Ambient Aura */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute -top-40 right-1/2 translate-x-1/2 w-[700px] h-[500px] blur-[160px] rounded-full transition-all duration-700 ${
          isGirls ? 'bg-pink-600/15' : 'bg-cyan-500/15'
        }`} />
        <div className={`absolute bottom-0 right-10 w-[500px] h-[400px] blur-[150px] rounded-full transition-all duration-700 ${
          isGirls ? 'bg-purple-600/15' : 'bg-amber-500/10'
        }`} />
      </div>

      {/* Responsive Container: Mobile-Optimized + Full Desktop Experience */}
      <div className={`w-full max-w-[500px] md:max-w-6xl min-h-screen md:min-h-0 relative shadow-[0_0_60px_rgba(0,0,0,0.95)] border-x md:border md:rounded-3xl flex flex-col pb-16 md:pb-6 overflow-hidden z-10 transition-colors duration-500 ${
        isGirls 
          ? 'bg-[#120516]/95 border-pink-500/30' 
          : 'bg-[#050b18]/95 border-cyan-500/25'
      }`}>
        
        <div className="relative z-10 flex-1 flex flex-col">

          {/* 1. Top Global Navigation Header */}
          <TopHeader 
            currentUser={currentUser}
            activeAnnouncementsCount={unreadNotificationsCount || announcements.filter(a => a.isActive).length}
            activeTab={activeTab}
            setActiveTab={(tab) => setActiveTab(tab)}
            onToggleNotifications={onOpenNotifications || (() => setIsNotificationsOpen(prev => !prev))}
            onOpenLogin={() => onOpenAuth('login')}
            onOpenRegister={() => onOpenAuth('register_individual')}
            onLogout={onLogout}
            onOpenProfile={() => setActiveTab('Profile')}
          />

          {/* Main Landing Content */}
          <div className="p-3 sm:p-5 md:p-6 space-y-6 sm:space-y-8">
            
            {/* Adventure Hero Section (هیس‌طوری! این پرونده هنوز بازه! + شروع ماموریت) */}
            <section aria-label="بخش معرفی مسابقه هیس‌طوری">
              <AdventureHeroSection 
                themeMode={themeMode}
                currentUser={currentUser}
                onStartMission={handleStartMission}
              />
            </section>

            {/* 4. Dedicated Banner for Prizes & Awards (جایزه‌ها) */}
            <section aria-label="جوایز و هدایای مسابقه">
              <PrizesAwardsBanner 
                themeMode={themeMode}
                onExplorePrizes={() => setActiveTab('RewardsLeaderboard')}
              />
            </section>

            {/* 6. Social Media Widgets: Local Messengers (Bale & Eitaa) + Stages & Guide */}
            <section aria-label="شبکه‌های اجتماعی و پیام‌رسان‌های بله و ایتا">
              <SocialMessengersWidgets 
                themeMode={themeMode}
                onOpenStages={() => setActiveTab('Journey')}
                onOpenGuide={() => setShowGuideModal(true)}
                triggerAlert={triggerAlert}
              />
            </section>

            {/* Desktop 2-Column Auxiliary Widgets (Announcements + Fast Stats) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2">
              <div className="md:col-span-7">
                <AnnouncementsList 
                  announcements={announcements}
                  onOpenAll={() => setIsNotificationsOpen(true)}
                />
              </div>
              <div className="md:col-span-5">
                <StatsStrip stats={homeStats || homeStatsData} />
              </div>
            </div>

            {/* FAQ Accordion */}
            <section aria-label="پرسش‌های متداول">
              <FaqAccordion faqs={faqs || faqsData} />
            </section>

            {/* 7. About Us Section (درباره ما) */}
            <section aria-label="درباره ما">
              <AboutSection onOpenMore={() => setActiveTab('About')} />
            </section>

            {/* 8. Footer at the Very Bottom */}
            <Footer 
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenAbout={() => setActiveTab('About')}
            />

          </div>

        </div>

        {/* Notification Panel Drawer */}
        <NotificationPanel 
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          announcements={announcements}
        />

        {/* Competition Guide & Rules Modal */}
        {showGuideModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 dir-rtl">
            <div className={`border rounded-3xl p-5 sm:p-6 max-w-md w-full text-right relative space-y-4 shadow-2xl ${
              isGirls 
                ? 'bg-[#150718] border-pink-500/50 shadow-pink-900/40 text-pink-50' 
                : 'bg-[#081224] border-cyan-500/50 shadow-cyan-900/40 text-slate-100'
            }`}>
              
              <button
                onClick={() => setShowGuideModal(false)}
                className="absolute top-4 left-4 p-1.5 rounded-full bg-slate-800/80 text-slate-400 hover:text-white transition"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2.5 border-b border-slate-700/50 pb-3">
                <div className={`p-2 rounded-xl ${isGirls ? 'bg-pink-950 text-pink-400' : 'bg-cyan-950 text-cyan-400'}`}>
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">راهنما و قوانین ماجراجویی اتاق جنگ</h3>
                  <span className="text-[10px] text-amber-300 font-mono">پرونده بزرگ هفت‌خوان</span>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pl-1">
                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <strong className="text-white flex items-center gap-1.5">
                    <CheckCircle size={14} className="text-emerald-400" />
                    <span>۱. ساختار هفت مرحله مسابقه:</span>
                  </strong>
                  <p className="text-slate-300 text-[11px]">
                    مسابقه شامل ۷ مرحله داستانی به سبک کارآگاهی است. با اتمام هر مرحله کریستال‌های امتیاز آزاد شده و مرحله بعدی باز می‌شود.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <strong className="text-white flex items-center gap-1.5">
                    <Gem size={14} className="text-cyan-400" />
                    <span>۲. کریستال‌ها و رده‌بندی:</span>
                  </strong>
                  <p className="text-slate-300 text-[11px]">
                    کریستال‌ها بر اساس دقت در پاسخ، حل چالش‌ها و سرعت عمل تعلق می‌گیرد. برترین‌های کشور و استان مشمول جوایز ۵۰ میلیارد ریالی خواهند شد.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                  <strong className="text-white flex items-center gap-1.5">
                    <Trophy size={14} className="text-amber-400" />
                    <span>۳. جوایز و کدهای تخفیف:</span>
                  </strong>
                  <p className="text-slate-300 text-[11px]">
                    علاوه بر کنسول‌های بازی، تبلت و تلفن هوشمند، بیش از ۱۰۰ هزار کد تخفیف فروشگاهی به کلیه شرکت‌کنندگان اهدا می‌گردد.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setShowGuideModal(false);
                    setActiveTab('Journey');
                  }}
                  className={`w-full py-3 rounded-2xl font-black text-xs text-slate-950 transition flex items-center justify-center gap-2 ${
                    isGirls 
                      ? 'bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-300' 
                      : 'bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300'
                  }`}
                >
                  <span>ورود به نقشه مراحل مسابقه</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
