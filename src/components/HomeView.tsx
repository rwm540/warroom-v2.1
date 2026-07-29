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
import UserStatusCard from './home/UserStatusCard';
import CompetitionHero from './home/CompetitionHero';
import QuickActionsGrid from './home/QuickActionsGrid';
import AnnouncementsList from './home/AnnouncementsList';
import AboutSection from './home/AboutSection';
import StatsStrip from './home/StatsStrip';
import FaqAccordion from './home/FaqAccordion';
import Footer from './home/Footer';
import BottomNavigation from './home/BottomNavigation';
import { Shield, RefreshCw } from 'lucide-react';

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
  faqs
}: HomeViewProps) {
  // Notification Panel Drawer state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [announcements, setAnnouncements] = useState<HomeAnnouncement[]>(() => {
    return homeAnnouncements || initialHomeAnnouncements;
  });

  // Keep state updated if props change
  useEffect(() => {
    if (homeAnnouncements) {
      setAnnouncements(homeAnnouncements);
    }
  }, [homeAnnouncements]);

  // Simulated API Loading & Error states
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // About Modal state
  const [showAboutModal, setShowAboutModal] = useState(false);

  const activeUserGroup = currentUser?.group_id 
    ? groups.find(g => g.id === currentUser.group_id) || null
    : null;

  const handleProtectedAction = (targetTab: string) => {
    if (!currentUser) {
      triggerAlert('جهت دسترسی به این بخش، ابتدا وارد سامانه شوید.');
      onOpenAuth('login');
    } else {
      setActiveTab(targetTab);
    }
  };

  const handleRetryApi = () => {
    setIsLoading(true);
    setIsError(false);
    setTimeout(() => {
      setIsLoading(false);
      triggerAlert('اطلاعات سامانه همگام‌سازی شد.');
    }, 600);
  };

  return (
    <div className="w-full min-h-screen bg-[#030610] text-slate-100 flex justify-center font-sans p-0 md:p-4 lg:p-6">
      
      {/* Responsive Container: Compact on Mobile, Multi-Column Website on Desktop */}
      <div className="w-full max-w-[480px] md:max-w-6xl min-h-screen md:min-h-0 cyber-grid-bg relative shadow-[0_0_60px_rgba(0,0,0,0.95)] border-x md:border border-cyan-500/25 md:rounded-3xl flex flex-col pb-16 md:pb-6 overflow-hidden">
        
        <div className="relative z-10 flex-1 flex flex-col">

          {/* 1. Top Header */}
          <TopHeader 
            currentUser={currentUser}
            activeAnnouncementsCount={unreadNotificationsCount || announcements.filter(a => a.isActive).length}
            activeTab={activeTab}
            setActiveTab={(tab) => {
              if (tab === 'Missions' || tab === 'Trainings') {
                handleProtectedAction(tab);
              } else {
                setActiveTab(tab);
              }
            }}
            onToggleNotifications={onOpenNotifications || (() => setIsNotificationsOpen(prev => !prev))}
            onOpenLogin={() => onOpenAuth('login')}
            onOpenRegister={() => onOpenAuth('register_individual')}
            onLogout={onLogout}
            onOpenProfile={() => setActiveTab('Profile')}
          />

          {/* Simulated API Error Banner if error state active */}
          {isError && (
            <div className="mx-4 my-2 p-3 rounded-xl bg-red-950/80 border border-red-600/60 text-right flex items-center justify-between text-xs text-red-200 shadow-lg">
              <span>خطا در دریافت آخرین اطلاعات سامانه</span>
              <button 
                onClick={handleRetryApi}
                className="px-2.5 py-1 rounded-lg bg-red-900 hover:bg-red-800 text-white font-bold flex items-center gap-1 transition"
              >
                <RefreshCw size={12} />
                <span>تلاش مجدد</span>
              </button>
            </div>
          )}

          {isLoading ? (
            /* Skeleton Loading State */
            <div className="p-4 space-y-4 animate-pulse">
              <div className="h-12 bg-slate-900/60 rounded-xl" />
              <div className="h-48 bg-slate-900/60 rounded-xl" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="h-20 bg-slate-900/60 rounded-xl" />
                <div className="h-20 bg-slate-900/60 rounded-xl" />
                <div className="h-20 bg-slate-900/60 rounded-xl" />
                <div className="h-20 bg-slate-900/60 rounded-xl" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              
              {/* Desktop Responsive Layout (Grid on md+, Stack on mobile) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:p-4">
                
                {/* Main Hero & Actions Column */}
                <div className="md:col-span-7 lg:col-span-8 space-y-4">
                  {/* 2. User Status Card */}
                  <UserStatusCard 
                    currentUser={currentUser}
                    userGroup={activeUserGroup}
                    onOpenRegister={() => onOpenAuth('register_individual')}
                    onOpenLogin={() => onOpenAuth('login')}
                    onOpenSquadModal={onOpenSquadModal}
                  />

                  {/* 3. Competition Hero Section */}
                  <CompetitionHero 
                    currentUser={currentUser}
                    onPrimaryAction={() => {
                      if (currentUser) {
                        setActiveTab('Missions');
                      } else {
                        onOpenAuth('register_individual');
                      }
                    }}
                    onSecondaryAction={() => setActiveTab('About')}
                    siteSettings={siteSettings}
                  />

                  {/* 4. Quick Actions Grid */}
                  <QuickActionsGrid 
                    onNavigate={(tab) => {
                      if (tab === 'Missions' || tab === 'Trainings') {
                        handleProtectedAction(tab);
                      } else {
                        setActiveTab(tab);
                      }
                    }}
                    onOpenAbout={() => setActiveTab('About')}
                  />
                </div>

                {/* Sidebar Column for Desktop */}
                <div className="md:col-span-5 lg:col-span-4 space-y-4">
                  {/* 5. Headquarters Announcements */}
                  <AnnouncementsList 
                    announcements={announcements}
                    onOpenAll={() => setIsNotificationsOpen(true)}
                  />

                  {/* 6. Short About Section */}
                  <AboutSection 
                    onOpenMore={() => setActiveTab('About')}
                  />

                  {/* 7. Stats Strip */}
                  <StatsStrip 
                    stats={homeStats || homeStatsData}
                  />
                </div>

              </div>

              {/* FAQ Section across full width */}
              <div className="md:px-4">
                {/* 8. FAQ Accordion */}
                <FaqAccordion 
                  faqs={faqs || faqsData}
                />
              </div>

              {/* 9. Footer */}
              <Footer 
                onNavigate={(tab) => {
                  setActiveTab(tab);
                }}
                onOpenAbout={() => setActiveTab('About')}
              />
            </div>
          )}

        </div>

        {/* 10. Notification Panel (Drawer / Popover) */}
        <NotificationPanel 
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          announcements={announcements}
        />

        {/* Modal for "درباره مسابقه / قوانین" */}
        {showAboutModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 dir-rtl">
            <div className="bg-[#0a0f24]/90 border border-cyan-500/40 rounded-2xl p-5 max-w-sm w-full space-y-4 text-right shadow-[0_0_40px_rgba(6,182,212,0.3)] relative">
              <div className="flex items-center gap-2 border-b border-cyan-500/25 pb-3">
                <Shield size={20} className="text-cyan-400 animate-pulse" />
                <h3 className="text-sm font-black text-white">
                  راهنما و قوانین مسابقات اتاق جنگ
                </h3>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pl-1">
                <p>
                  <strong>۱. شرایط شرکت:</strong> کلیه دانش‌آموزان مقاطع تحصیلی می‌توانند به‌صورت انفرادی یا در قالب جوخه‌های ۲ تا ۶ نفره ثبت‌نام کنند.
                </p>
                <p>
                  <strong>۲. ارسال مأموریت‌ها:</strong> پاسخ مأموریت‌ها باید قبل از اتمام مهلت زمان‌بندی شده در فرمت‌های مشخص بارگذاری شوند.
                </p>
                <p>
                  <strong>۳. داوری و امتیازدهی:</strong> امتیازها بر اساس صحت پاسخ، دقت عملیاتی و سرعت عمل جوخه‌ها محاسبه و مدال‌های مربوطه صادر می‌شود.
                </p>
                <p>
                  <strong>۴. پشتیبانی:</strong> در صورت بروز سوالات یا مشکلات فنی، تیکت پشتیبانی ارسال فرمایید.
                </p>
              </div>

              <button
                onClick={() => setShowAboutModal(false)}
                className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-colors"
              >
                متوجه شدم
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
