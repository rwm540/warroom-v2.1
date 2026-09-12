import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, ShieldAlert, X, Radio } from 'lucide-react';

// Types
import { 
  User, 
  Group, 
  Mission, 
  MissionSubmission, 
  Training, 
  Medal, 
  UserMedal, 
  SupportTicket, 
  SupportReply, 
  Announcement, 
  News,
  AppNotification 
} from './types';

// Mock Data
import { 
  initialUsers, 
  initialGroups, 
  initialMissions, 
  initialSubmissions, 
  initialTrainings, 
  initialMedals, 
  initialUserMedals, 
  initialSupportTickets, 
  initialSupportReplies, 
  initialAnnouncements, 
  initialNews,
  initialNotifications 
} from './data';

import {
  initialHomeAnnouncements, 
  homeStatsData, 
  faqsData, 
  defaultHomeButtons,
  defaultHomeBlocks,
  HomeAnnouncement, 
  HomeStats, 
  FaqItem 
} from './data/home';

// Supabase Data Sync Layer (falls back to localStorage automatically)
import { useSyncedCollection, useSyncedSetting } from './lib/supabaseData';

// Static Base Views
import HomeView from './components/HomeView';
import Navbar from './components/Navbar';
import BottomNavigation from './components/home/BottomNavigation';
import AuthView from './components/AuthView';
import LoadingScreen from './components/LoadingScreen';
import BackgroundMusic from './components/BackgroundMusic';
import PersistentMusicBar from './components/PersistentMusicBar';

// پس‌زمینه نقشه تاکتیکی — فقط برای پنل ادمین
import tacticalMapBg from './assets/images/tactical_war_map_background_1787351981076.jpg';

// Core Views - Imported directly for zero-latency, instant tab switching
import DashboardView from './components/DashboardView';
import JourneyView from './components/JourneyView';
import MissionsView from './components/MissionsView';
import TrainingsView from './components/TrainingsView';
import SupportView from './components/SupportView';
import ContactView from './components/ContactView';
import AboutView from './components/AboutView';
import ProfileView from './components/ProfileView';
import PrizesPointsView from './components/PrizesPointsView';
import VitrinView from './components/VitrinView';
import SquadManagementModal from './components/SquadManagementModal';
import ProfileModal from './components/ProfileModal';
import GameSelectionPortalModal from './components/GameSelectionPortalModal';
import NotificationCenterModal from './components/NotificationCenterModal';
import LiveNotificationToast from './components/LiveNotificationToast';
import OnboardingCommanderTutorial from './components/OnboardingCommanderTutorial';

// Only AdminPanel kept lazy as an internal administrative tool
const AdminPanel = lazy(() => import('./components/AdminPanel'));

const ViewFallback = () => (
  <div className="w-full min-h-[160px] py-6 flex items-center justify-center text-center text-slate-400 font-sans dir-rtl">
    <div className="flex items-center gap-2 text-xs text-emerald-400">
      <Radio size={16} className="animate-pulse text-emerald-400" />
      <span>در حال آماده‌سازی...</span>
    </div>
  </div>
);

export default function App() {
  // Global Data State
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('warroom_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem('warroom_groups');
    return saved ? JSON.parse(saved) : initialGroups;
  });

  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem('warroom_missions');
    return saved ? JSON.parse(saved) : initialMissions;
  });

  const [submissions, setSubmissions] = useState<MissionSubmission[]>(() => {
    const saved = localStorage.getItem('warroom_submissions');
    return saved ? JSON.parse(saved) : initialSubmissions;
  });

  const [trainings, setTrainings] = useState<Training[]>(() => {
    const saved = localStorage.getItem('warroom_trainings');
    return saved ? JSON.parse(saved) : initialTrainings;
  });

  const [medals, setMedals] = useState<Medal[]>(() => {
    const saved = localStorage.getItem('warroom_medals');
    return saved ? JSON.parse(saved) : initialMedals;
  });

  const [userMedals, setUserMedals] = useState<UserMedal[]>(() => {
    const saved = localStorage.getItem('warroom_user_medals');
    return saved ? JSON.parse(saved) : initialUserMedals;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('warroom_tickets');
    return saved ? JSON.parse(saved) : initialSupportTickets;
  });

  const [replies, setReplies] = useState<SupportReply[]>(() => {
    const saved = localStorage.getItem('warroom_replies');
    return saved ? JSON.parse(saved) : initialSupportReplies;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('warroom_announcements');
    return saved ? JSON.parse(saved) : initialAnnouncements;
  });

  const [news, setNews] = useState<News[]>(() => {
    const saved = localStorage.getItem('warroom_news');
    return saved ? JSON.parse(saved) : initialNews;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('warroom_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [showNotificationCenter, setShowNotificationCenter] = useState<boolean>(false);
  const [liveToastNotification, setLiveToastNotification] = useState<AppNotification | null>(null);

  // Dynamic CMS States (synced with Supabase when configured)
  const [siteSettings, setSiteSettings] = useSyncedSetting<Record<string, any>>({
    storageKey: 'warroom_site_settings',
    settingKey: 'site_settings',
    initial: () => {
      let parsed: Record<string, any> = {};
      try {
        const saved = localStorage.getItem('warroom_site_settings');
        parsed = saved ? JSON.parse(saved) : {};
      } catch {}
      return {
        siteName: parsed.siteName || 'اتاق جنگ',
        siteTagline: parsed.siteTagline || 'سامانه جامع مسابقات، مأموریت‌ها و ارزیابی هوشمند',
        badgeText: parsed.badgeText || 'پرونده ماجراجویی هفت‌خوان',
        heroTitle: parsed.heroTitle || 'مأموریت اصلی: مسابقه بزرگ اتاق جنگ',
        heroProgress: parsed.heroProgress || '۷۲٪',
        heroCountdown: parsed.heroCountdown || '۰۲:۱۴:۳۹:۱۵',
        heroImage: parsed.heroImage || '',
        heroVideoUrl: parsed.heroVideoUrl || '',
        girlsBannerImage: parsed.girlsBannerImage || '',
        boysBannerImage: parsed.boysBannerImage || '',
        heroButtonText: parsed.heroButtonText || 'ورود و ثبت‌نام',
        contactPhone: parsed.contactPhone || '۰۲۱-۸۸۹۹۷۷۶۶',
        contactEmail: parsed.contactEmail || 'info@warroom.ir',
        telegram: parsed.telegram || 'WarRoom_Support',
        baleLink: parsed.baleLink || 'https://bale.ai/warroom',
        eitaaLink: parsed.eitaaLink || 'https://eitaa.com/warroom',
        address: parsed.address || 'تهران، بزرگراه شهید همت، ستاد مرکزی قرارگاه فضای مجازی',
        aboutText: parsed.aboutText || 'پلتفرم اتاق جنگ یک سامانه تعاملی، رقابتی و آموزشی است که با هدف پرورش تفکر استراتژیک، افزایش توان تحلیل مسئله و تقویت روحیه کار تیمی در میان نوجوانان و جوانان طراحی شده است.',
        prizeTitle: parsed.prizeTitle || 'جایزه‌ها و هدایای مسابقه بزرگ',
        prizeDescription: parsed.prizeDescription || 'کریستال جمع کن و جایزه‌های نفیس اعم از کنسول بازی، تبلت و گوشی برنده شو!',
        homeButtons: (parsed.homeButtons && Array.isArray(parsed.homeButtons) && parsed.homeButtons.length > 0) 
          ? parsed.homeButtons 
          : defaultHomeButtons,
        homeBlocks: (parsed.homeBlocks && Array.isArray(parsed.homeBlocks) && parsed.homeBlocks.length > 0)
          ? parsed.homeBlocks
          : defaultHomeBlocks
      };
    }
  });

  const [homeAnnouncements, setHomeAnnouncements] = useSyncedCollection<HomeAnnouncement>({
    storageKey: 'warroom_home_announcements',
    table: 'warroom_home_announcements',
    initial: initialHomeAnnouncements
  });

  const [homeStats, setHomeStats] = useSyncedSetting<HomeStats>({
    storageKey: 'warroom_home_stats',
    settingKey: 'home_stats',
    initial: () => {
      try {
        const saved = localStorage.getItem('warroom_home_stats');
        if (saved) return JSON.parse(saved);
      } catch {}
      return homeStatsData;
    }
  });

  const [faqs, setFaqs] = useSyncedCollection<FaqItem>({
    storageKey: 'warroom_faqs',
    table: 'warroom_faqs',
    initial: faqsData
  });

  // Current Logged-in User with Full Persistence
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUserData = localStorage.getItem('warroom_current_user_data');
      if (savedUserData) {
        return JSON.parse(savedUserData);
      }
      const savedId = localStorage.getItem('warroom_current_user_id');
      if (savedId) {
        const savedUsersStr = localStorage.getItem('warroom_users');
        const allUsers: User[] = savedUsersStr ? JSON.parse(savedUsersStr) : initialUsers;
        const found = allUsers.find(u => u.id === savedId);
        if (found) return found;
      }
    } catch (e) {
      console.error('Session restore error:', e);
    }
    return null;
  });

  // Keep localStorage in sync when currentUser data updates & enforce theme locking by user gender
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('warroom_current_user_id', currentUser.id);
      localStorage.setItem('warroom_current_user_data', JSON.stringify(currentUser));
      if (currentUser.gender === 'دختر') {
        setCampaignTheme('girls');
        localStorage.setItem('hisstory_theme_mode', 'girls');
      } else if (currentUser.gender === 'پسر') {
        setCampaignTheme('boys');
        localStorage.setItem('hisstory_theme_mode', 'boys');
      }
    }
  }, [currentUser]);

  // Active Campaign Theme: 'girls' vs 'boys' (prioritizes logged-in user profile gender)
  const [campaignTheme, setCampaignTheme] = useState<'girls' | 'boys'>(() => {
    try {
      const savedUserData = localStorage.getItem('warroom_current_user_data');
      if (savedUserData) {
        const parsed = JSON.parse(savedUserData);
        if (parsed?.gender === 'دختر') return 'girls';
        if (parsed?.gender === 'پسر') return 'boys';
      }
      const saved = localStorage.getItem('hisstory_theme_mode');
      if (saved === 'girls' || saved === 'boys') return saved;
    } catch (e) {}
    return 'boys';
  });

  // Sync campaignTheme with localStorage (guaranteeing logged-in user gender cannot be overridden)
  useEffect(() => {
    const handleStorage = () => {
      if (currentUser?.gender === 'دختر') {
        setCampaignTheme('girls');
        localStorage.setItem('hisstory_theme_mode', 'girls');
        return;
      }
      if (currentUser?.gender === 'پسر') {
        setCampaignTheme('boys');
        localStorage.setItem('hisstory_theme_mode', 'boys');
        return;
      }
      const saved = localStorage.getItem('hisstory_theme_mode');
      if (saved === 'girls' || saved === 'boys') {
        setCampaignTheme(saved);
      }
    };
    handleStorage();
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [currentUser]);

  // UI Navigation State - restore activeTab or default to Journey if logged in!
  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      const savedUser = localStorage.getItem('warroom_current_user_id') || localStorage.getItem('warroom_current_user_data');
      if (savedUser) {
        const savedTab = localStorage.getItem('warroom_active_tab');
        return savedTab || 'Journey';
      }
    } catch (e) {}
    return 'Home';
  });

  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    try {
      const savedUserData = localStorage.getItem('warroom_current_user_data');
      if (savedUserData) {
        const parsed = JSON.parse(savedUserData);
        return parsed?.role === 'admin';
      }
    } catch (e) {}
    return false;
  });

  const [showAuthScreen, setShowAuthScreen] = useState<boolean>(false);
  const [showGamePortal, setShowGamePortal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register_individual' | 'register_group'>('register_individual');

  // Global active modal tracking (hides bottom nav & music bar with smooth exit animation when any modal opens)
  const [modalActiveCount, setModalActiveCount] = useState<number>(0);

  useEffect(() => {
    const handleModalChange = (e: any) => {
      if (e.detail && typeof e.detail.active === 'boolean') {
        if (e.detail.active) {
          setModalActiveCount(prev => prev + 1);
        } else {
          setModalActiveCount(prev => Math.max(0, prev - 1));
        }
      }
    };

    window.addEventListener('warroom_modal_active_change' as any, handleModalChange);
    return () => {
      window.removeEventListener('warroom_modal_active_change' as any, handleModalChange);
    };
  }, []);

  const isModalActive = modalActiveCount > 0;

  const handleDirectLogin = () => {
    let activeUser = currentUser;
    if (!activeUser) {
      try {
        const savedUserData = localStorage.getItem('warroom_current_user_data');
        if (savedUserData) activeUser = JSON.parse(savedUserData);
      } catch (e) {}
    }

    if (activeUser) {
      if (activeUser.role === 'admin') {
        setIsAdminMode(true);
        setActiveTab('Admin');
        setShowGamePortal(false);
        setShowAuthScreen(false);
        localStorage.setItem('warroom_active_tab', 'Admin');
        triggerAlert(`ورود مستقیم به پنل مدیریت: ${activeUser.first_name} ${activeUser.last_name}`);
      } else {
        setShowGamePortal(true);
        setShowAuthScreen(false);
        triggerAlert(`ورود به درگاه انتخاب بازی: ${activeUser.first_name} ${activeUser.last_name}`);
      }
      return;
    }
    setAuthMode('login');
    setShowAuthScreen(true);
  };

  const handleTabChange = (tab: string) => {
    setShowAuthScreen(false);
    setShowGamePortal(false);
    setIsAdminMode(tab === 'Admin');
    setActiveTab(tab);
    localStorage.setItem('warroom_active_tab', tab);
  };
  const [showSquadModal, setShowSquadModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showOnboardingTutorial, setShowOnboardingTutorial] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alertNotification, setAlertNotification] = useState<string | null>(null);

  // Eligibility checker for real-time notifications
  const isEligibleForNotification = (notif: AppNotification, user: User | null) => {
    if (!user) return notif.target === 'all';
    if (notif.target === 'all') return true;
    if (notif.target === 'girls' && user.gender === 'دختر') return true;
    if (notif.target === 'boys' && user.gender === 'پسر') return true;
    if (notif.target === 'leaders' && user.role === 'leader') return true;
    if (notif.target === 'users' && user.role === 'user') return true;
    if (notif.target === 'specific_user' && (notif.target_user_id === user.id || notif.target_personal_code === user.personal_code)) return true;
    if (notif.target === 'specific_squad' && user.group_id && notif.target_group_id === user.group_id) return true;
    if (user.role === 'admin') return true;
    return false;
  };

  // Real-time notification broadcaster & listener across browser tabs
  useEffect(() => {
    const handleBroadcastEvent = (e: any) => {
      const notif: AppNotification = e.detail;
      if (notif && isEligibleForNotification(notif, currentUser)) {
        setLiveToastNotification(notif);
      }
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'warroom_last_live_notification' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed?.notif && isEligibleForNotification(parsed.notif, currentUser)) {
            setLiveToastNotification(parsed.notif);
          }
        } catch (err) {}
      }
      if (e.key === 'warroom_notifications' && e.newValue) {
        try {
          setNotifications(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };

    window.addEventListener('warroom_live_broadcast', handleBroadcastEvent);
    window.addEventListener('storage', handleStorageEvent);
    return () => {
      window.removeEventListener('warroom_live_broadcast', handleBroadcastEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [currentUser]);

  // Calculate unread notifications count for current user
  const unreadNotificationsCount = notifications.filter(n => {
    if (!currentUser) return false;
    if (!isEligibleForNotification(n, currentUser)) return false;
    return !n.is_read_by.includes(currentUser.id);
  }).length;

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('warroom_current_user_id', currentUser.id);
    } else {
      localStorage.removeItem('warroom_current_user_id');
    }
  }, [currentUser]);

  // System notification alert trigger
  const triggerAlert = (msg: string) => {
    setAlertNotification(msg);
    setTimeout(() => {
      setAlertNotification(null);
    }, 4500);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminMode(false);
    setActiveTab('Home');
    setShowAuthScreen(false);
    localStorage.removeItem('warroom_current_user_id');
    localStorage.removeItem('warroom_current_user_data');
    localStorage.removeItem('warroom_active_tab');
    triggerAlert('خروج از سامانه اتاق جنگ با موفقیت انجام شد.');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setShowAuthScreen(false);
    localStorage.setItem('warroom_current_user_id', user.id);
    localStorage.setItem('warroom_current_user_data', JSON.stringify(user));

    if (user.gender === 'دختر') {
      setCampaignTheme('girls');
      localStorage.setItem('hisstory_theme_mode', 'girls');
    } else {
      setCampaignTheme('boys');
      localStorage.setItem('hisstory_theme_mode', 'boys');
    }

    if (user.role === 'admin') {
      setIsAdminMode(true);
      setActiveTab('Admin');
      setShowGamePortal(false);
      localStorage.setItem('warroom_active_tab', 'Admin');
      triggerAlert(`خوش آمدید مدیر کل ${user.first_name} ${user.last_name} — وارد پنل مدیریت شدید.`);
    } else {
      setShowGamePortal(true);
      triggerAlert(`خوش آمدید رزمنده ${user.first_name} ${user.last_name} — لطفا سامانه بازی را انتخاب کنید.`);
    }
  };

  const handleSelectWarRoom = () => {
    setShowGamePortal(false);
    let user = currentUser;
    if (!user) {
      try {
        const savedUserData = localStorage.getItem('warroom_current_user_data');
        if (savedUserData) user = JSON.parse(savedUserData);
      } catch (e) {}
    }

    if (user) {
      if (user.role === 'admin') {
        setIsAdminMode(true);
        setActiveTab('Admin');
        localStorage.setItem('warroom_active_tab', 'Admin');
      } else {
        setIsAdminMode(false);
        setActiveTab('Journey');
        localStorage.setItem('warroom_active_tab', 'Journey');
        setShowOnboardingTutorial(true); // Launch Commander Guided Tutorial
      }
      triggerAlert(`ورود موفقیت‌آمیز به اتاق جنگ`);
    }
  };

  const handleOpenAuth = (mode: 'login' | 'register_individual' | 'register_group') => {
    let activeUser = currentUser;
    if (!activeUser) {
      try {
        const savedUserData = localStorage.getItem('warroom_current_user_data');
        if (savedUserData) activeUser = JSON.parse(savedUserData);
      } catch (e) {}
    }

    if (activeUser) {
      if (activeUser.role === 'admin') {
        setIsAdminMode(true);
        setActiveTab('Admin');
        setShowGamePortal(false);
        setShowAuthScreen(false);
        localStorage.setItem('warroom_active_tab', 'Admin');
        return;
      }
      setShowGamePortal(true);
      setShowAuthScreen(false);
      return;
    }

    setAuthMode(mode);
    setShowAuthScreen(true);
  };

  // Guard: If currentUser is logged in, immediately dismiss any auth screen
  useEffect(() => {
    if (currentUser && showAuthScreen) {
      setShowAuthScreen(false);
      if (currentUser.role === 'admin') {
        setIsAdminMode(true);
        setActiveTab('Admin');
        localStorage.setItem('warroom_active_tab', 'Admin');
      } else {
        setIsAdminMode(false);
        setActiveTab('Journey');
        localStorage.setItem('warroom_active_tab', 'Journey');
      }
    }
  }, [currentUser, showAuthScreen]);

  // Guard: Regular users are routed to Journey if they attempt to access Dashboard
  useEffect(() => {
    if (!isAdminMode && activeTab === 'Dashboard') {
      setActiveTab('Journey');
      localStorage.setItem('warroom_active_tab', 'Journey');
    }
  }, [isAdminMode, activeTab]);

  const isGirlsTheme = campaignTheme === 'girls' || currentUser?.gender === 'دختر';

  return (
    <div className={`text-slate-100 min-h-screen w-full overflow-x-hidden flex flex-col relative font-sans dir-rtl transition-colors duration-700 ${
      isGirlsTheme ? 'girls-atmosphere-bg' : 'boys-atmosphere-bg'
    }`}>
      
      {/* Loading Screen with Radar & Logo */}
      {isLoading && (
        <LoadingScreen onComplete={() => setIsLoading(false)} isGirls={isGirlsTheme} />
      )}

      {/* Background Epic Music Toggle */}
      <BackgroundMusic />

      {/* Dynamic Background Atmosphere */}
      {isAdminMode ? (
        /* پس‌زمینه پنل ادمین: نقشه تاکتیکی جنگ — واضح و فیکس (فقط بخش ادمین) */
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-100"
            style={{ backgroundImage: `url(${tacticalMapBg})` }}
          />
        </div>
      ) : isGirlsTheme ? (
        /* Girls Wallpaper Atmosphere: Obsidian top, Neon Magenta bottom-left, Royal Violet bottom-right */
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 inset-x-0 h-[40vh] bg-gradient-to-b from-[#020005] via-[#080110]/60 to-transparent" />
          <div className="absolute -bottom-24 -left-20 w-[550px] sm:w-[700px] h-[550px] sm:h-[700px] blur-[140px] sm:blur-[170px] rounded-full bg-[#ff1389]/30 pointer-events-none transition-all duration-700" />
          <div className="absolute -bottom-24 -right-20 w-[600px] sm:w-[750px] h-[600px] sm:h-[750px] blur-[150px] sm:blur-[180px] rounded-full bg-[#7c3aed]/35 pointer-events-none transition-all duration-700" />
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[400px] blur-[160px] rounded-full bg-[#4a0d67]/25 pointer-events-none" />
        </div>
      ) : (
        /* Boys Wallpaper Atmosphere: Exactly matching uploaded wallpaper (Obsidian void top, Crimson Red bottom-left, Electric Cobalt Blue bottom-right, Central violet blend, and crisp 32px grid) */
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 inset-x-0 h-[45vh] bg-gradient-to-b from-[#000104] via-[#010309]/85 to-transparent" />
          <div className="absolute -bottom-20 -left-20 w-[550px] sm:w-[750px] h-[550px] sm:h-[750px] blur-[130px] sm:blur-[160px] rounded-full bg-gradient-to-tr from-[#991b1b] via-[#dc2626] to-[#e11d48] opacity-65 pointer-events-none transition-all duration-700" />
          <div className="absolute -bottom-20 -right-20 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] blur-[140px] sm:blur-[170px] rounded-full bg-gradient-to-tl from-[#1e40af] via-[#2563eb] to-[#3b82f6] opacity-70 pointer-events-none transition-all duration-700" />
          <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[550px] h-[350px] blur-[150px] rounded-full bg-[#581c87]/35 pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.075)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.075)_1px,transparent_1px)] bg-[size:32px_32px] opacity-80" />
        </div>
      )}

      {/* Global Toast Alert Notification (Swipeable right on Touch/Mobile + Close X Button) */}
      <AnimatePresence>
        {alertNotification && (
          <motion.div
            key="global-alert-toast"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, x: 280, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.05, right: 0.8 }}
            onDragEnd={(_e, info) => {
              // Swipe right gesture detection
              if (info.offset.x > 50 || info.velocity.x > 150) {
                setAlertNotification(null);
              }
            }}
            className="fixed top-4 left-3 right-3 sm:left-auto sm:right-6 z-50 p-[1px] rounded-2xl bg-gradient-to-r from-red-600 via-amber-500 to-rose-600 shadow-[0_0_30px_rgba(220,38,38,0.6)] sm:max-w-md cursor-grab active:cursor-grabbing touch-pan-y"
          >
            <div className="p-3.5 sm:p-4 rounded-[15px] bg-[#050818]/95 flex items-start justify-between gap-3 border border-red-500/40 dir-rtl select-none">
              <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-red-950 text-red-400 border border-red-800 shadow-inner">
                  <Bell size={16} className="animate-bounce" />
                </span>
                <div className="space-y-0.5 text-right min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-400 font-mono">پیام سیستم اتاق جنگ</span>
                    <span className="text-[9px] text-amber-400/80 font-mono hidden sm:inline-block">← بکشید به راست</span>
                  </div>
                  <p className="text-xs text-slate-100 font-semibold leading-relaxed break-words">
                    {alertNotification}
                  </p>
                </div>
              </div>

              {/* Close Button ('X') for Web & Desktop */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAlertNotification(null);
                }}
                className="p-1 rounded-lg bg-slate-900/90 text-slate-400 hover:text-white hover:bg-red-950/80 border border-slate-800 hover:border-red-500/50 transition shrink-0"
                title="بستن هشدار"
                aria-label="بستن هشدار"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAuthScreen ? (
          /* Authentication / Registration Page for War Room */
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <AuthView 
              users={users}
              setUsers={setUsers}
              groups={groups}
              setGroups={setGroups}
              onLoginSuccess={handleLoginSuccess}
              triggerAlert={triggerAlert}
              onBackToHome={() => {
                setShowAuthScreen(false);
                setActiveTab('Home');
              }}
              initialAuthMode={authMode}
              campaignTheme={campaignTheme}
            />
          </motion.div>
        ) : activeTab === 'Home' ? (
          /* Primary Mobile-First Home Landing View */
          <motion.div
            key="homeView"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <HomeView 
              currentUser={currentUser}
              groups={groups}
              activeTab={activeTab}
              setActiveTab={handleTabChange}
              onOpenAuth={handleOpenAuth}
              onLogout={handleLogout}
              onOpenSquadModal={() => setShowSquadModal(true)}
              triggerAlert={triggerAlert}
              siteSettings={siteSettings}
              homeAnnouncements={homeAnnouncements}
              homeStats={homeStats}
              faqs={faqs}
              campaignTheme={campaignTheme}
              onChangeCampaign={() => {
                const newTheme = campaignTheme === 'boys' ? 'girls' : 'boys';
                setCampaignTheme(newTheme);
                localStorage.setItem('hisstory_theme_mode', newTheme);
                triggerAlert(newTheme === 'girls' ? 'پویش دختران فعال شد.' : 'پویش پسران فعال شد.');
              }}
            />
          </motion.div>
        ) : (activeTab === 'Support' || activeTab === 'Contact') ? (
          /* Standalone Animated Contact Us Page (Public & Independent) */
          <motion.div
            key="contactPage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="min-h-screen bg-[#05091a] text-slate-100 py-6 px-3 sm:px-6 dir-rtl"
          >
            <ContactView 
              onNavigate={(tab) => handleTabChange(tab)}
              triggerAlert={triggerAlert}
              siteSettings={siteSettings}
            />
          </motion.div>
        ) : activeTab === 'About' ? (
          /* Standalone Animated About Us Page */
          <motion.div
            key="aboutPage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="min-h-screen bg-[#05091a] text-slate-100 py-6 px-3 sm:px-6 dir-rtl"
          >
            <AboutView 
              onNavigate={(tab) => handleTabChange(tab)}
              siteSettings={siteSettings}
              homeStats={homeStats}
            />
          </motion.div>
        ) : (
          /* Main Platform View for other logged-in tabs */
          <motion.div
            key="platform"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="min-h-screen flex flex-col relative z-10"
          >
            {/* Top Navigation Bar */}
            <Navbar 
              currentUser={currentUser}
              currentTab={activeTab}
              setCurrentTab={handleTabChange}
              onLogout={handleLogout}
              onOpenSquadModal={() => setShowSquadModal(true)}
              onOpenNotifications={() => setShowNotificationCenter(true)}
              onOpenGamePortal={() => setShowGamePortal(true)}
              unreadNotificationsCount={unreadNotificationsCount}
              isAdminView={isAdminMode}
              setIsAdminView={setIsAdminMode}
              campaignTheme={campaignTheme}
            />

            {/* Main Content Body */}
            <main className={`flex-1 w-full mx-auto ${
              isAdminMode ? 'relative z-10 ' : ''
            }${
              activeTab === 'Journey'
                ? 'max-w-full px-0 py-0 flex flex-col h-[calc(100vh-64px)] overflow-hidden'
                : 'max-w-7xl px-4 md:px-8 pt-5 pb-28 md:pb-8'
            }`}>
              <Suspense fallback={<ViewFallback />}>
                {isAdminMode ? (
                  <AdminPanel 
                    currentUser={currentUser!}
                    users={users}
                    setUsers={setUsers}
                    groups={groups}
                    missions={missions}
                    setMissions={setMissions}
                    submissions={submissions}
                    setSubmissions={setSubmissions}
                    trainings={trainings}
                    setTrainings={setTrainings}
                    medals={medals}
                    setMedals={setMedals}
                    userMedals={userMedals}
                    setUserMedals={setUserMedals}
                    tickets={tickets}
                    setTickets={setTickets}
                    replies={replies}
                    setReplies={setReplies}
                    announcements={announcements}
                    setAnnouncements={setAnnouncements}
                    news={news}
                    setNews={setNews}
                    notifications={notifications}
                    setNotifications={setNotifications}
                    onBroadcastNotification={(notif) => {
                      setLiveToastNotification(notif);
                    }}
                    triggerAlert={triggerAlert}
                    siteSettings={siteSettings}
                    setSiteSettings={setSiteSettings}
                    homeAnnouncements={homeAnnouncements}
                    setHomeAnnouncements={setHomeAnnouncements}
                    homeStats={homeStats}
                    setHomeStats={setHomeStats}
                    faqs={faqs}
                    setFaqs={setFaqs}
                    onNavigate={(tab) => handleTabChange(tab)}
                  />
                ) : (
                  <>
                    {(activeTab === 'Journey' || activeTab === 'Profile') && (
                      <JourneyView 
                        currentUser={currentUser}
                        showMapBackground={activeTab === 'Journey'}
                        groups={groups}
                        medals={medals}
                        userMedals={userMedals}
                        initialOpenProfile={activeTab === 'Profile'}
                        onEnterDashboard={(stageId) => {
                          handleTabChange('Dashboard');
                        }}
                        onNavigateTab={(tab) => {
                          handleTabChange(tab);
                        }}
                        triggerAlert={triggerAlert}
                        onOpenProfile={() => setShowProfileModal(true)}
                        onOpenNotifications={() => setShowNotificationCenter(true)}
                        onUpdateAvatar={(newUrl) => {
                          if (currentUser) {
                            const updated = { ...currentUser, avatar_url: newUrl };
                            setCurrentUser(updated);
                            setUsers(users.map(u => u.id === updated.id ? updated : u));
                          }
                        }}
                      />
                    )}

                    {(activeTab === 'Rewards' || activeTab === 'Prizes' || activeTab === 'RewardsLeaderboard' || activeTab === 'Leaderboard') && (
                      <PrizesPointsView 
                        currentUser={currentUser}
                        users={users}
                        groups={groups}
                        medals={medals}
                        userMedals={userMedals}
                        initialSubTab={activeTab === 'Leaderboard' || activeTab === 'RewardsLeaderboard' ? 'leaderboard' : 'prizes'}
                        triggerAlert={triggerAlert}
                        onNavigate={(tab) => handleTabChange(tab)}
                      />
                    )}

                    {activeTab === 'Vitrin' && (
                      <VitrinView 
                        currentUser={currentUser}
                        triggerAlert={triggerAlert}
                        onNavigate={(tab) => handleTabChange(tab)}
                      />
                    )}

                    {activeTab === 'Dashboard' && (
                      <DashboardView 
                        currentUser={currentUser!}
                        users={users}
                        groups={groups}
                        missions={missions}
                        submissions={submissions}
                        announcements={announcements}
                        news={news}
                        onNavigate={(tab) => handleTabChange(tab)}
                        onOpenSquadModal={() => setShowSquadModal(true)}
                      />
                    )}

                    {activeTab === 'Missions' && (
                      <MissionsView 
                        currentUser={currentUser!}
                        missions={missions}
                        submissions={submissions}
                        setSubmissions={setSubmissions}
                        triggerAlert={triggerAlert}
                        onNavigate={(tab) => handleTabChange(tab)}
                      />
                    )}

                    {activeTab === 'Trainings' && (
                      <TrainingsView 
                        currentUser={currentUser!}
                        trainings={trainings}
                        onNavigate={(tab) => handleTabChange(tab)}
                      />
                    )}

                    {activeTab === 'Profile' && (
                      <ProfileView 
                        currentUser={currentUser!}
                        groups={groups}
                        medals={medals}
                        userMedals={userMedals}
                        onNavigate={(tab) => handleTabChange(tab)}
                        triggerAlert={triggerAlert}
                      />
                    )}
                  </>
                )}
              </Suspense>
            </main>

            {/* Squad Management Modal for Commanders */}
            {showSquadModal && currentUser && (
              <SquadManagementModal 
                currentUser={currentUser}
                users={users}
                setUsers={setUsers}
                groups={groups}
                setGroups={setGroups}
                onClose={() => setShowSquadModal(false)}
                triggerAlert={triggerAlert}
              />
            )}

            {/* Profile & Avatar Selection Modal */}
            {showProfileModal && currentUser && (
              <ProfileModal 
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                currentUser={currentUser}
                onUpdateAvatar={(newUrl) => {
                  const updated = { ...currentUser, avatar_url: newUrl };
                  setCurrentUser(updated);
                  setUsers(users.map(u => u.id === updated.id ? updated : u));
                }}
                medals={medals}
                userMedals={userMedals}
                triggerAlert={triggerAlert}
                onNavigateTab={(tab) => handleTabChange(tab)}
              />
            )}

            {/* Clash of Clans Style Commander Onboarding Tutorial */}
            {showOnboardingTutorial && (
              <OnboardingCommanderTutorial 
                currentUser={currentUser}
                onComplete={() => setShowOnboardingTutorial(false)}
                onNavigateTab={(tab) => handleTabChange(tab)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Floating Android Mobile Bottom Navigation (Visible in all sections: User views & Admin) */}
      <AnimatePresence>
        {!(isModalActive || showNotificationCenter || showGamePortal || showSquadModal || showProfileModal || showOnboardingTutorial) && !showAuthScreen && currentUser && (
          <motion.div
            key="android-bottom-nav-container"
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-0 inset-x-0 z-40 pointer-events-auto"
          >
            <BottomNavigation 
              activeTab={isAdminMode ? 'Admin' : activeTab}
              setActiveTab={(tab) => {
                setIsAdminMode(false);
                handleTabChange(tab);
              }}
              currentUser={currentUser}
              isAdminMode={isAdminMode}
              setIsAdminMode={setIsAdminMode}
              campaignTheme={campaignTheme}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Real-Time Live Notification Floating Toast */}
      <LiveNotificationToast 
        notification={liveToastNotification}
        onDismiss={() => setLiveToastNotification(null)}
        onOpenCenter={() => {
          setLiveToastNotification(null);
          setShowNotificationCenter(true);
        }}
        onActionClick={(tab) => {
          if (liveToastNotification && currentUser) {
            setNotifications(prev => prev.map(n => 
              n.id === liveToastNotification.id && !n.is_read_by.includes(currentUser.id)
                ? { ...n, is_read_by: [...n.is_read_by, currentUser.id] }
                : n
            ));
          }
          setLiveToastNotification(null);
          handleTabChange(tab);
        }}
      />

      {/* Global Comprehensive Notification Center Modal */}
      <Suspense fallback={null}>
        {showNotificationCenter && (
          <NotificationCenterModal 
            isOpen={showNotificationCenter}
            onClose={() => setShowNotificationCenter(false)}
            notifications={notifications}
            setNotifications={setNotifications}
            currentUser={currentUser}
            onNavigate={(tab) => {
              setShowNotificationCenter(false);
              handleTabChange(tab);
            }}
          />
        )}

        {/* Game / Campaign Selection Portal Modal */}
        <GameSelectionPortalModal 
          isOpen={showGamePortal}
          onClose={() => setShowGamePortal(false)}
          currentUser={currentUser}
          onSelectWarRoom={handleSelectWarRoom}
          campaignTheme={campaignTheme}
        />
      </Suspense>

      {/* Global Fixed Persistent Music Player Bar (Visible across all tabs and views) */}
      <AnimatePresence>
        {!(isModalActive || showNotificationCenter || showGamePortal || showSquadModal || showProfileModal || showOnboardingTutorial) && (
          <motion.div
            key="persistent-music-bar-container"
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-0 left-0 z-40 pointer-events-auto"
          >
            <PersistentMusicBar 
              hasBottomNav={Boolean(!showAuthScreen && currentUser)} 
              isGirls={isGirlsTheme}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
