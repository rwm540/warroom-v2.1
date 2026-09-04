import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Flag, 
  Heart, 
  Shield, 
  Users, 
  BookOpen, 
  Compass, 
  ArrowLeft, 
  Award, 
  Star, 
  Bell, 
  X, 
  FileText, 
  Flame, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Navigation,
  User as UserIcon,
  HelpCircle,
  Building,
  Camera,
  Activity,
  Zap,
  Radio,
  Video,
  Upload,
  Link as LinkIcon,
  Clock,
  Send,
  MessageSquare,
  Volume2,
  Check,
  Trophy,
  Play,
  Share2,
  Book,
  Home,
  MessageCircle,
  MapPin,
  Copy,
  ShieldCheck,
  Phone,
  School,
  Bookmark
} from 'lucide-react';
import { User, Mission, MissionSubmission, Group, Medal, UserMedal } from '../types';
import { formatToPersianDigits } from '../utils/jalali';
import { getSavedPostIds } from '../data/vitrinData';
import SavedVitrinReelsModal from './SavedVitrinReelsModal';
import StageQuizModal from './StageQuizModal';

interface JourneyViewProps {
  currentUser: User | null;
  onEnterDashboard: (stageId?: string) => void;
  triggerAlert: (msg: string) => void;
  onOpenNotifications?: () => void;
  onOpenProfile?: () => void;
  onNavigateTab?: (tab: string) => void;
  missions?: Mission[];
  submissions?: MissionSubmission[];
  onSubmitMission?: (missionId: string, note: string, fileName: string) => void;
  groups?: Group[];
  medals?: Medal[];
  userMedals?: UserMedal[];
  onUpdateAvatar?: (avatarUrl: string) => void;
  initialOpenProfile?: boolean;
}

export interface JourneyStage {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  status: 'completed' | 'in_progress' | 'locked';
  iconName: 'flag' | 'heart' | 'shield' | 'service' | 'users' | 'shrine' | 'star' | 'trophy';
  requiredPoints: number;
  description: string;
  missionsCount: number;
  completedMissions: number;
  bgThemeUrl?: string;
  // Position along the curved winding road (% from left, % from top in relative layout)
  xOffsetPercent: number; // 0 is center, -30 is left, +30 is right
}

export default function JourneyView({
  currentUser,
  onEnterDashboard,
  triggerAlert,
  onOpenNotifications,
  onOpenProfile,
  onNavigateTab,
  missions = [],
  submissions = [],
  onSubmitMission,
  groups = [],
  medals = [],
  userMedals = [],
  onUpdateAvatar,
  initialOpenProfile = false
}: JourneyViewProps) {
  const [selectedStage, setSelectedStage] = useState<JourneyStage | null>(null);
  const [activeTabSub, setActiveTabSub] = useState<'journey' | 'journal' | 'prayer'>('journey');
  const [widgetNote, setWidgetNote] = useState('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [journalNote, setJournalNote] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Saved Vitrin Posts Reels Modal state
  const [showSavedReelsModal, setShowSavedReelsModal] = useState(false);
  const [savedPostsCount, setSavedPostsCount] = useState(0);

  // Map Scroll and Navigation Refs
  const mapScrollContainerRef = useRef<HTMLDivElement>(null);
  const activeStageRef = useRef<HTMLDivElement>(null);

  // Integrated Profile state
  const [showProfileDrawer, setShowProfileDrawer] = useState(initialOpenProfile);
  const [copiedCode, setCopiedCode] = useState(false);
  const [profileSubTab, setProfileSubTab] = useState<'dossier' | 'medals' | 'avatar' | 'saved'>('dossier');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(currentUser?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80');

  useEffect(() => {
    const ids = getSavedPostIds(currentUser?.id);
    setSavedPostsCount(ids.length);
  }, [currentUser, showSavedReelsModal, showProfileDrawer]);

  // Smoothly center the active in-progress stage on load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeStageRef.current) {
        activeStageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 450);
    return () => clearTimeout(timer);
  }, []);

  const scrollToActiveStage = () => {
    if (activeStageRef.current) {
      activeStageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToTopStage = () => {
    if (mapScrollContainerRef.current) {
      mapScrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToBottomStage = () => {
    if (mapScrollContainerRef.current) {
      mapScrollContainerRef.current.scrollTo({ 
        top: mapScrollContainerRef.current.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  };

  const PREDEFINED_AVATARS = [
    { id: 'av1', name: 'رزمنده سایبری ۱', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
    { id: 'av2', name: 'فرمانده جوخه', url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80' },
    { id: 'av3', name: 'رزمنده پیشتاز', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
    { id: 'av4', name: 'افسر ارشد', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' },
    { id: 'av5', name: 'تکاور سایبری', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
    { id: 'av6', name: 'پیشگام عملیات', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
  ];

  const userGroup = groups.find(g => g.id === currentUser?.group_id);
  const earnedUserMedals = userMedals.filter(um => um.personal_code === currentUser?.personal_code);

  const handleCopyPersonalCode = () => {
    if (!currentUser?.personal_code) return;
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(currentUser.personal_code);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = currentUser.personal_code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.warn('Clipboard copy error:', err);
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    triggerAlert('کد ۹ رقمی شما کپی شد.');
  };

  const handleSaveAvatar = (url: string) => {
    setSelectedAvatarUrl(url);
    if (onUpdateAvatar) {
      onUpdateAvatar(url);
    }
    triggerAlert('آواتار پروفایل شما با موفقیت به‌روزرسانی شد.');
  };

  // 7 Defined Journey Stages following the exact reference photo ("مسیر سفر")
  const stages: JourneyStage[] = [
    {
      id: 's1',
      number: 1,
      title: 'آغاز مسیر',
      subtitle: 'نیت خالصانه و ثبت‌نام اولیه در کاروان',
      status: 'completed',
      iconName: 'flag',
      requiredPoints: 0,
      description: 'گام نخست حضور در کاروان و حرکت در مسیر نورانی. در این مرحله رزمنده ثبت‌نام خود را قطعی کرده و با مرام‌نامه و اهداف آشنا می‌شود.',
      missionsCount: 2,
      completedMissions: 2,
      bgThemeUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      xOffsetPercent: 0 // Top center
    },
    {
      id: 's2',
      number: 2,
      title: 'معرفت',
      subtitle: 'شناخت مبانی، بصیرت و تعالیم استراتژیک',
      status: 'completed',
      iconName: 'heart',
      requiredPoints: 300,
      description: 'کسب معرفت و بینش عمیق نسبت به آرمان‌ها. رزمنده در این مرحله با مطالعه متون راهنما و پاسخ به سوالات فکری، شایستگی لازم را احراز می‌کند.',
      missionsCount: 3,
      completedMissions: 3,
      bgThemeUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      xOffsetPercent: -28 // Curves left
    },
    {
      id: 's3',
      number: 3,
      title: 'آمادگی',
      subtitle: 'مهارت‌افزایی و سازماندهی نیروها',
      status: 'completed',
      iconName: 'shield',
      requiredPoints: 750,
      description: 'آمادگی روحی، جسمی و تشکیلاتی جهت انجام عملیات‌های مشترک و فعالیت‌های جهادی.',
      missionsCount: 3,
      completedMissions: 3,
      bgThemeUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
      xOffsetPercent: 22 // Curves right
    },
    {
      id: 's4',
      number: 4,
      title: 'خدمت',
      subtitle: 'امدادرسانی و بسته‌های کمک مؤمنانه',
      status: 'in_progress',
      iconName: 'service',
      requiredPoints: 1400,
      description: 'مشارکت در خدمت‌رسانی به نیازمندان، توزیع ارزاق و اجرای برنامه‌های خیرخواهانه جهادی.',
      missionsCount: 4,
      completedMissions: 1,
      bgThemeUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
      xOffsetPercent: -22 // Curves left
    },
    {
      id: 's5',
      number: 5,
      title: 'همراهی',
      subtitle: 'همدلی تیمی، جوخه‌بندی و مأموریت میدانی',
      status: 'locked',
      iconName: 'users',
      requiredPoints: 2200,
      description: 'هم‌افزایی جوخه‌ای، تقویت پیوندهای برادری و هماهنگی عملیاتی با سایر ارکان ستاد.',
      missionsCount: 3,
      completedMissions: 0,
      bgThemeUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      xOffsetPercent: 18 // Curves right
    },
    {
      id: 's6',
      number: 6,
      title: 'زیارت',
      subtitle: 'میثاق با شهدا و حضور در اماکن مقدس',
      status: 'locked',
      iconName: 'shrine',
      requiredPoints: 3400,
      description: 'تجدید بیعت با آرمان‌های والای شهدا و بهره‌مندی از فیوضات معنوی زیارت.',
      missionsCount: 3,
      completedMissions: 0,
      bgThemeUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
      xOffsetPercent: -18 // Curves left
    },
    {
      id: 's7',
      number: 7,
      title: 'سفیر عشق',
      subtitle: 'کسب نشان خادمی و پیروزی نهایی',
      status: 'locked',
      iconName: 'trophy',
      requiredPoints: 5000,
      description: 'رسیدن به بالاترین مرتبه خادمی و سفارت جهادی، دریافت مدال زرین و گواهینامه معتبر ستاد.',
      missionsCount: 2,
      completedMissions: 0,
      bgThemeUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      xOffsetPercent: 20 // Curves right
    }
  ];

  // Helper to render Stage Icon based on design reference
  const renderStageIcon = (iconName: string, status: string) => {
    const iconSize = 20;
    switch (iconName) {
      case 'flag':
        return <Flag size={iconSize} className={status === 'completed' ? 'text-emerald-300' : 'text-slate-300'} />;
      case 'heart':
        return <Heart size={iconSize} className={status === 'completed' ? 'text-emerald-300' : 'text-slate-300'} />;
      case 'shield':
        return <Shield size={iconSize} className={status === 'completed' ? 'text-emerald-300' : 'text-slate-300'} />;
      case 'service':
        return <Heart size={iconSize} className="text-amber-300" />;
      case 'users':
        return <Users size={iconSize} className="text-slate-400" />;
      case 'shrine':
        return <Sparkles size={iconSize} className="text-slate-400" />;
      case 'trophy':
      default:
        return <Award size={iconSize} className="text-slate-400" />;
    }
  };

  const handleStageClick = (stage: JourneyStage) => {
    setSelectedStage(stage);
  };

  const handleFileUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0].name);
      triggerAlert(`فایل "${e.target.files[0].name}" با موفقیت بارگذاری شد.`);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#070b13] text-slate-100 p-1 sm:p-2 relative overflow-y-auto lg:overflow-hidden dir-rtl font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Subtle Background Lighting and Textures */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-full max-w-2xl h-[450px] bg-emerald-950/20 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-amber-950/20 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-emerald-950/15 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full h-full flex flex-col justify-between relative z-10 lg:overflow-hidden gap-1.5 sm:gap-2">

        {/* ========================================================================= */}
        {/* 1. TOP HEADER                                                             */}
        {/* ========================================================================= */}
        <header className="flex items-center justify-between px-2 pt-0.5 pb-0.5 shrink-0">
          {/* Left Actions: Guide button + Notification Bell + Saved Vitrin Videos button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGuideModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-400 text-xs font-bold transition shadow-sm group cursor-pointer"
              title="مشاهده راهنمای نقشه و دستورات تاکتیکی فرمانده"
            >
              <Compass size={14} className="text-cyan-400 group-hover:rotate-45 transition shrink-0" />
              <span className="hidden sm:inline">راهنمای مسیر و فرمانده</span>
              <span className="sm:hidden">راهنما</span>
            </button>

            <button
              onClick={() => setShowSavedReelsModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/40 text-amber-300 hover:text-white hover:border-amber-400 text-xs font-bold transition shadow-sm group"
              title="مشاهده ویدیوها و آثار ذخیره‌شده ویترین (فید ریلز)"
            >
              <Bookmark size={14} className="fill-amber-400 text-amber-400 group-hover:scale-110 transition shrink-0" />
              <span className="hidden sm:inline">ذخیره‌های ویترین</span>
              {savedPostsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-black bg-amber-400 text-black">
                  {formatToPersianDigits(savedPostsCount)}
                </span>
              )}
            </button>

            <button
              onClick={onOpenNotifications || (() => triggerAlert('صندوق اعلانات باز شد.'))}
              className="relative p-2 rounded-full bg-[#111927] border border-slate-700/60 text-slate-200 hover:text-amber-400 hover:border-amber-500/50 transition shadow-sm"
              title="اعلان‌ها"
            >
              <Bell size={17} />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#070b13] animate-pulse" />
            </button>
          </div>

          {/* User Welcome, Avatar & Integrated Profile Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setProfileSubTab('dossier');
                setShowProfileDrawer(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-cyan-500/20 border border-amber-500/40 text-amber-300 hover:text-white hover:border-amber-400 text-xs font-bold transition shadow-sm group"
              title="مشاهده شناسنامه، پروفایل و نشان‌های رزمنده"
            >
              <Award size={14} className="text-amber-400 group-hover:scale-110 transition shrink-0" />
              <span className="hidden xs:inline">پروفایل و نشان‌ها</span>
            </button>

            <div className="text-left hidden sm:block">
              <h2 className="text-xs sm:text-sm font-black text-white leading-tight flex items-center justify-end gap-1.5">
                <span>سلام</span>
                <span className="text-amber-300">
                  {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'علی رضایی'}
                </span>
              </h2>
              <p className="text-[10px] text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                <Sparkles size={10} className="text-amber-400" />
                <span>خوش آمدی به مسیر عشاق الحسین</span>
              </p>
            </div>

            {/* Circular Avatar */}
            <div 
              onClick={() => {
                setProfileSubTab('dossier');
                setShowProfileDrawer(true);
              }}
              className="relative cursor-pointer group"
              title="مشاهده شناسنامه، پروفایل و انتخاب آواتار"
            >
              <div className="w-10 h-10 rounded-full ring-2 ring-emerald-500/80 p-0.5 bg-slate-900 overflow-hidden shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                {currentUser?.avatar_url || selectedAvatarUrl ? (
                  <img src={currentUser?.avatar_url || selectedAvatarUrl} alt="آواتار" className="w-full h-full object-cover rounded-full group-hover:scale-110 transition" />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#132035] flex items-center justify-center text-emerald-400 font-black">
                    <UserIcon size={18} />
                  </div>
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#070b13]" />
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 2. STATS BAR (4 Columns: سطح شما, امتیاز کل, نشان‌ها, درصد مسیر)        */}
        {/* ========================================================================= */}
        <section className="shrink-0 grid grid-cols-4 gap-1.5 sm:gap-2 bg-[#0d1524]/90 border border-slate-800/80 rounded-xl p-1.5 sm:p-2 backdrop-blur-md shadow-md">
          
          {/* 1. سطح شما */}
          <div className="flex flex-col items-center justify-center text-center p-1 rounded-lg bg-[#090e1a]/60 border border-slate-800/40">
            <span className="text-[10px] text-slate-400 font-medium mb-0.5">سطح شما</span>
            <div className="flex items-center gap-1">
              <span className="text-slate-500 text-[10px] font-mono">🔰</span>
              <strong className="text-xs sm:text-sm md:text-base font-black text-white font-mono">
                {formatToPersianDigits(currentUser?.level || 3)}
              </strong>
            </div>
          </div>

          {/* 2. امتیاز کل */}
          <div className="flex flex-col items-center justify-center text-center p-1 rounded-lg bg-[#090e1a]/60 border border-slate-800/40">
            <span className="text-[10px] text-slate-400 font-medium mb-0.5">امتیاز کل</span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star size={13} className="fill-amber-400 shrink-0" />
              <strong className="text-xs sm:text-sm md:text-base font-black font-mono">
                {formatToPersianDigits(currentUser?.points || 2480)}
              </strong>
            </div>
          </div>

          {/* 3. نشان‌ها */}
          <div 
            onClick={() => {
              setProfileSubTab('medals');
              setShowProfileDrawer(true);
            }}
            className="flex flex-col items-center justify-center text-center p-1 rounded-lg bg-[#090e1a]/60 border border-slate-800/40 cursor-pointer hover:border-cyan-500/50 transition group"
            title="مشاهده نشان‌ها و مدال‌ها در پروفایل"
          >
            <span className="text-[10px] text-slate-400 font-medium mb-0.5 group-hover:text-cyan-300 transition">نشان‌ها</span>
            <div className="flex items-center gap-1 text-cyan-400">
              <Trophy size={13} className="shrink-0 group-hover:scale-110 transition" />
              <strong className="text-xs sm:text-sm md:text-base font-black font-mono">
                {formatToPersianDigits(earnedUserMedals.length || 4)}
              </strong>
            </div>
          </div>

          {/* 4. درصد مسیر */}
          <div className="flex flex-col items-center justify-center text-center p-1 rounded-lg bg-[#090e1a]/60 border border-slate-800/40">
            <span className="text-[10px] text-slate-400 font-medium mb-0.5">درصد مسیر</span>
            <div className="flex items-center gap-1 text-emerald-400">
              <div className="relative w-4 h-4 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500"
                    strokeDasharray="64, 100"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
              </div>
              <strong className="text-xs sm:text-sm font-black font-mono">
                {formatToPersianDigits(64)}٪
              </strong>
            </div>
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 3. MAIN INTERACTIVE SERPENTINE JOURNEY MAP (Scrollable & Spacious)       */}
        {/* ========================================================================= */}
        <div className="relative flex-1 min-h-0 w-full max-w-xl mx-auto rounded-2xl bg-[#080d19]/80 border border-slate-800/80 backdrop-blur-md overflow-hidden flex flex-col shadow-[inset_0_2px_12px_rgba(0,0,0,0.6)]">
          
          {/* Top Subtle Atmospheric Fade Mask */}
          <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-[#080d19] via-[#080d19]/80 to-transparent pointer-events-none z-20" />
          
          {/* Bottom Subtle Atmospheric Fade Mask */}
          <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#080d19] via-[#080d19]/80 to-transparent pointer-events-none z-20" />

          {/* Quick Floating Navigation Pill & Quick-Jump Actions */}
          <div className="absolute top-2 left-2 z-30 flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={scrollToActiveStage}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 hover:text-white text-[11px] font-bold shadow-lg transition backdrop-blur-md group cursor-pointer"
              title="پرش مستقیم به مرحله در حال انجام"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping group-hover:scale-125" />
              <span>مرحله جاری</span>
              <Navigation size={11} className="text-amber-400 rotate-45" />
            </button>
          </div>

          <div className="absolute top-2 right-2 z-30 flex items-center gap-1 pointer-events-auto">
            <button
              onClick={scrollToTopStage}
              className="p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-cyan-400 text-xs shadow-md transition backdrop-blur-md cursor-pointer"
              title="شروع مسیر (بالا)"
            >
              <ChevronUp size={14} />
            </button>
            <button
              onClick={scrollToBottomStage}
              className="p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-amber-400 text-xs shadow-md transition backdrop-blur-md cursor-pointer"
              title="پایان مسیر (پایین)"
            >
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Scrollable Map Track */}
          <div 
            ref={mapScrollContainerRef}
            className="w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth custom-scrollbar-thin px-3 py-6 relative overscroll-contain"
          >
            <div className="relative w-full max-w-lg mx-auto h-[980px] sm:h-[1060px] flex flex-col justify-between items-center py-6">
              
              {/* SVG Winding Road Path with Textured Glowing Curves */}
              <svg 
                className="absolute inset-0 w-full h-full pointer-events-none" 
                viewBox="0 0 400 900" 
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Road Surface Gradient */}
                  <linearGradient id="roadGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                    <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.35" />
                  </linearGradient>

                  <linearGradient id="roadBorder" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.75" />
                    <stop offset="45%" stopColor="#fbbf24" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#475569" stopOpacity="0.4" />
                  </linearGradient>

                  <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Road Glow Aura */}
                <path
                  d="M 200 35 
                     C 200 95, 110 115, 110 185 
                     C 110 255, 290 275, 290 345 
                     C 290 415, 120 435, 120 505 
                     C 120 575, 280 595, 280 665 
                     C 280 735, 140 755, 140 815
                     L 260 885"
                  fill="none"
                  stroke="url(#roadGlow)"
                  strokeWidth="70"
                  strokeLinecap="round"
                  filter="url(#glowFilter)"
                  opacity="0.35"
                />

                {/* Main Asphalt Road Base */}
                <path
                  d="M 200 35 
                     C 200 95, 110 115, 110 185 
                     C 110 255, 290 275, 290 345 
                     C 290 415, 120 435, 120 505 
                     C 120 575, 280 595, 280 665 
                     C 280 735, 140 755, 140 815
                     L 260 885"
                  fill="none"
                  stroke="#172236"
                  strokeWidth="50"
                  strokeLinecap="round"
                />

                {/* Road Outer Golden/Emerald Luminous Edge Borders */}
                <path
                  d="M 200 35 
                     C 200 95, 110 115, 110 185 
                     C 110 255, 290 275, 290 345 
                     C 290 415, 120 435, 120 505 
                     C 120 575, 280 595, 280 665 
                     C 280 735, 140 755, 140 815
                     L 260 885"
                  fill="none"
                  stroke="url(#roadBorder)"
                  strokeWidth="52"
                  strokeLinecap="round"
                  opacity="0.3"
                />

                {/* Center Dashed Highway Line */}
                <path
                  d="M 200 35 
                     C 200 95, 110 115, 110 185 
                     C 110 255, 290 275, 290 345 
                     C 290 415, 120 435, 120 505 
                     C 120 575, 280 595, 280 665 
                     C 280 735, 140 755, 140 815
                     L 260 885"
                  fill="none"
                  stroke="#facc15"
                  strokeWidth="2"
                  strokeDasharray="7 9"
                  opacity="0.85"
                />
              </svg>

              {/* Stages Embedded Along the S-Curve Road */}
              <div className="relative w-full h-full flex flex-col justify-between items-center py-2 z-10">
                {stages.map((stage, idx) => {
                  const isCompleted = stage.status === 'completed';
                  const isInProgress = stage.status === 'in_progress';
                  const isLocked = stage.status === 'locked';

                  // Balanced horizontal offsets matching the S-curves
                  const xOffsets = [
                    'translate-x-0', // Stage 1 (top center)
                    '-translate-x-16 sm:-translate-x-20', // Stage 2 (curve left)
                    'translate-x-14 sm:translate-x-18', // Stage 3 (curve right)
                    '-translate-x-14 sm:-translate-x-18', // Stage 4 (curve left)
                    'translate-x-12 sm:translate-x-16', // Stage 5 (curve right)
                    '-translate-x-12 sm:-translate-x-16', // Stage 6 (curve left)
                    'translate-x-12 sm:translate-x-16' // Stage 7 (curve right)
                  ];

                  return (
                    <motion.div
                      key={stage.id}
                      ref={isInProgress ? activeStageRef : undefined}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`relative flex items-center justify-center ${xOffsets[idx]} my-2`}
                    >
                      {/* Stage Interactive Node Button */}
                      <div 
                        onClick={() => handleStageClick(stage)}
                        className="flex flex-row items-center gap-1.5 sm:gap-2 cursor-pointer group select-none"
                      >
                        {/* Circular Stage Emblem */}
                        <div className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg ${
                          isCompleted 
                            ? 'bg-[#06241a] border-2 border-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.7)]'
                            : isInProgress
                            ? 'bg-[#2b1e06] border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.9)] animate-pulse'
                            : 'bg-[#101726] border-2 border-slate-700/80 shadow-[0_0_10px_rgba(0,0,0,0.6)] opacity-90'
                        }`}>
                          
                          {/* Status Icon */}
                          {renderStageIcon(stage.iconName, stage.status)}

                          {/* Top Number Indicator Pin */}
                          <div className={`absolute -top-1 -right-1 w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full flex items-center justify-center font-mono text-[8px] sm:text-[9px] font-black border shadow ${
                            isCompleted
                              ? 'bg-emerald-500 text-slate-950 border-slate-950'
                              : isInProgress
                              ? 'bg-amber-500 text-slate-950 border-slate-950 animate-bounce'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}>
                            {formatToPersianDigits(stage.number)}
                          </div>
                        </div>

                        {/* Attached Label Pill (Matching exact design) */}
                        <div className={`px-2.5 py-1 rounded-xl backdrop-blur-md border transition-all text-right shadow-md flex flex-col justify-center min-w-[95px] max-w-[135px] ${
                          isCompleted
                            ? 'bg-[#081f18]/90 border-emerald-500/50 group-hover:border-emerald-400'
                            : isInProgress
                            ? 'bg-[#231805]/95 border-amber-500/70 group-hover:border-amber-400'
                            : 'bg-[#0d1424]/90 border-slate-800 group-hover:border-slate-600'
                        }`}>
                          <h4 className="font-black text-[11px] sm:text-xs text-white leading-tight truncate">
                            {stage.title}
                          </h4>
                          
                          <div className="flex items-center gap-1 mt-0.5">
                            {isCompleted && (
                              <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-0.5">
                                <CheckCircle2 size={10} className="text-emerald-400 shrink-0" />
                                <span>تکمیل شد</span>
                              </span>
                            )}
                            {isInProgress && (
                              <span className="text-[9px] font-bold text-amber-300 flex items-center gap-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping shrink-0" />
                                <span>در حال انجام</span>
                              </span>
                            )}
                            {isLocked && (
                              <span className="text-[9px] font-medium text-slate-400 flex items-center gap-0.5">
                                <Lock size={9} className="text-slate-500 shrink-0" />
                                <span>قفل شده</span>
                              </span>
                            )}
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE STAGE DETAILS & 4-OPTION QUIZ MODAL WITH TIMER & MEDIA     */}
      {/* ========================================================================= */}
      <StageQuizModal
        isOpen={Boolean(selectedStage)}
        onClose={() => setSelectedStage(null)}
        stage={selectedStage}
        currentUser={currentUser}
        triggerAlert={triggerAlert}
        onStageCompleted={(stageId, earnedPoints) => {
          triggerAlert(`مرحله با موفقیت فتح شد و ${formatToPersianDigits(earnedPoints)} کریستال پاداش به رزمنده تعلق گرفت.`);
        }}
      />

      {/* ========================================================================= */}
      {/* 5. JOURNAL MODAL (دفترچه سفر)                                            */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showJournalModal && (
          <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 dir-rtl overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0b1222] border border-amber-500/40 rounded-3xl max-w-md w-full p-4 sm:p-5 space-y-4 shadow-2xl my-auto max-h-[85vh] sm:max-h-[88vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-amber-400 font-black text-base">
                  <BookOpen size={20} />
                  <span>دفترچه خاطرات و دل‌نوشته‌های سفر</span>
                </div>
                <button 
                  onClick={() => setShowJournalModal(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                احساسات، تجربیات و دل‌نوشته‌های معنوی خود در طول این مسیر را ثبت کنید:
              </p>

              <textarea
                rows={5}
                value={journalNote}
                onChange={(e) => setJournalNote(e.target.value)}
                placeholder="امروز در گام خدمت، لحظات به یاد ماندنی رقم خورد..."
                className="w-full bg-[#070b14] border border-slate-700/80 rounded-2xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />

              <button
                onClick={() => {
                  triggerAlert('یادداشت شما با موفقیت در دفترچه سفر ذخیره شد.');
                  setShowJournalModal(false);
                }}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2.5 rounded-xl transition shadow-lg"
              >
                ثبت در دفترچه سفر
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 6. ROUTE GUIDE MODAL (راهنمای مسیر)                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showGuideModal && (
          <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 dir-rtl overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0b1222] border border-cyan-500/40 rounded-3xl max-w-md w-full p-4 sm:p-5 space-y-4 shadow-2xl my-auto max-h-[85vh] sm:max-h-[88vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5 text-cyan-400 font-black text-base">
                  <Compass size={22} className="animate-spin-slow" />
                  <span>راهنمای نقشه و دستورات فرمانده قرارگاه</span>
                </div>
                <button 
                  onClick={() => setShowGuideModal(false)}
                  className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                  title="بستن پنجره"
                >
                  <X size={18} />
                </button>
              </div>

              {/* COMMANDER AVATAR & TAC DEBRIEFING CARD */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#071329] via-[#0d1f3d] to-[#08152c] border border-cyan-500/50 relative overflow-hidden shadow-lg space-y-3">
                
                <div className="flex items-center gap-3.5">
                  {/* Commander Avatar Frame */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-[2px] bg-gradient-to-tr from-amber-400 via-cyan-400 to-emerald-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] shrink-0">
                    <div className="w-full h-full bg-[#050b18] rounded-[14px] overflow-hidden relative">
                      <img 
                        src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80" 
                        alt="فرمانده قرارگاه تاکتیکی" 
                        className="w-full h-full object-cover object-top"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050b18]/70 via-transparent to-transparent" />
                    </div>
                    {/* Live Online Indicator */}
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#071329] animate-pulse" />
                  </div>

                  {/* Commander Identity & Titles */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        فرماندهی ارشد عملیات
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                        اتاق فرماندهی آنلاین
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-white">
                      سردار ستاد قرارگاه تاکتیکی اتاق جنگ
                    </h3>
                    <p className="text-[11px] text-cyan-300 font-bold">
                      راهبر عالی عملیات‌های هفت‌خوان دانش‌آموزی مقاومت
                    </p>
                  </div>
                </div>

                {/* Commander's Strategic Briefing Speech Bubble */}
                <div className="bg-[#050b18]/85 p-3 rounded-xl border border-cyan-800/40 text-xs text-slate-200 leading-relaxed relative space-y-1.5">
                  <div className="text-amber-400 font-black flex items-center gap-1.5 text-[11px]">
                    <Sparkles size={13} />
                    <span>دستورالعمل تاکتیکی فرمانده برای رزمندگان:</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    «رزمندگان غیور! نقشه هفت‌خوان پیش روی شما، میدان فتح و محک آمادگی علمی، بصیرتی و عملیاتی است. با کلیک بر روی هر یک از آیکون‌های مسیر، وارد آزمون‌های زمان‌دار چهارگزینه‌ای به همراه عکس‌ها و فیلم‌های توجیهی مرحله می‌شوید. زمان تایمر محدود است؛ با تمرکز و مشورت با جوخه، گزینه‌های صحیح را انتخاب کنید تا بالاترین کریستال‌های امتیاز به حسابتان افزوده شود.»
                  </p>
                </div>

              </div>

              {/* Status Legend */}
              <div className="space-y-2.5 text-xs text-slate-300">
                <span className="font-bold text-slate-400 block text-[11px]">راهنمای وضعیت آیکون‌های مراحل روی نقشه:</span>
                
                <div className="flex items-start gap-2.5 bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-emerald-400 text-sm shrink-0">🟢</span>
                  <div>
                    <strong className="text-white block">مراحل سبز (فتح‌شده):</strong>
                    <span>مراحلی که آزمون ۴ گزینه‌ای و مأموریت آن تکمیل گردیده و مدال‌های آن به شما تعلق گرفته است. (می‌توانید جهت مرور دوباره روی آن کلیک کنید).</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-amber-950/20 p-2.5 rounded-xl border border-amber-500/40">
                  <span className="text-amber-400 text-sm shrink-0 animate-pulse">🟡</span>
                  <div>
                    <strong className="text-amber-300 block">مراحل طلایی (مرحله جاری):</strong>
                    <span>مرحله فعال کنونی شما؛ با کلیک روی آن فوراً آزمون زمان‌دار ۴ گزینه‌ای با فیلم و تصویر آغاز می‌شود.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-slate-900/70 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-sm shrink-0">🔒</span>
                  <div>
                    <strong className="text-slate-300 block">مراحل قفل‌شده (آتی):</strong>
                    <span>پس از پاسخ به سوالات مرحله جاری و افزایش امتیاز کریستال‌ها، به صورت خودکار بازگشایی می‌شوند.</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowGuideModal(false)}
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs py-3 rounded-xl transition shadow-lg shadow-cyan-950/40 cursor-pointer"
              >
                تایید، اجرای دستورات فرمانده و بازگشت به نقشه
              </button>
            </motion.div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* INTEGRATED PROFILE & DOSSIER MODAL (پروفایل و نشان‌های رزمنده)             */}
        {/* ========================================================================= */}
        {showProfileDrawer && (
          <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 dir-rtl overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-[#090e1c] border border-cyan-500/40 rounded-3xl max-w-xl w-full p-4 sm:p-6 space-y-5 shadow-2xl relative my-auto max-h-[85vh] sm:max-h-[88vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-cyan-950/80 text-cyan-400 border border-cyan-700/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <UserIcon size={22} />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-white">
                      شناسنامه و پروفایل رزمنده
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      مشاهده اطلاعات هویتی، آمار مأموریت‌ها و نشان‌های افتخار
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfileDrawer(false)}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Sub-Tabs: شناسنامه و اطلاعات / مدال‌ها و نشان‌ها / تغییر آواتار / ذخیره‌های ویترین */}
              <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950/90 p-1 rounded-2xl border border-slate-800">
                <button
                  onClick={() => setProfileSubTab('dossier')}
                  className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    profileSubTab === 'dossier'
                      ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck size={14} />
                  <span className="hidden sm:inline">شناسنامه</span>
                  <span className="sm:hidden">هویت</span>
                </button>
                <button
                  onClick={() => setProfileSubTab('medals')}
                  className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    profileSubTab === 'medals'
                      ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Award size={14} />
                  <span>مدال‌ها ({formatToPersianDigits(earnedUserMedals.length || 4)})</span>
                </button>
                <button
                  onClick={() => setProfileSubTab('avatar')}
                  className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    profileSubTab === 'avatar'
                      ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserIcon size={14} />
                  <span className="hidden sm:inline">آواتار تاکتیکی</span>
                  <span className="sm:hidden">آواتار</span>
                </button>
                <button
                  onClick={() => setProfileSubTab('saved')}
                  className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    profileSubTab === 'saved'
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Bookmark size={14} className={profileSubTab === 'saved' ? 'fill-slate-950' : 'fill-amber-400 text-amber-400'} />
                  <span>ذخیره‌ها ({formatToPersianDigits(savedPostsCount)})</span>
                </button>
              </div>

              {/* TAB 1: DOSSIER (شناسنامه) */}
              {profileSubTab === 'dossier' && (
                <div className="space-y-4">
                  {/* Personal Code Card with 1-Click Copy */}
                  <div className="bg-gradient-to-r from-amber-500/15 via-amber-600/10 to-transparent border border-amber-500/40 p-4 rounded-2xl flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-amber-400 block">
                        کد ۹ رقمی رزمنده (شناسه اختصاصی):
                      </span>
                      <strong className="text-xl font-black font-mono tracking-widest text-white">
                        {currentUser?.personal_code || '987654321'}
                      </strong>
                    </div>
                    <button
                      onClick={handleCopyPersonalCode}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-bold transition shadow-sm"
                    >
                      {copiedCode ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                      <span>{copiedCode ? 'کپی شد!' : 'کپی کد'}</span>
                    </button>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-1">
                      <span className="text-slate-400 text-[10px]">نام و نام خانوادگی</span>
                      <p className="font-bold text-white">{currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'علی رضایی'}</p>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-1">
                      <span className="text-slate-400 text-[10px]">نقش عملیاتی</span>
                      <p className="font-bold text-cyan-300">
                        {currentUser?.role === 'admin' ? 'فرمانده ارشد / مدیر کل' : currentUser?.role === 'leader' ? 'فرمانده جوخه' : 'رزمنده میدانی'}
                      </p>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-1">
                      <span className="text-slate-400 text-[10px]">جوخه عملیاتی</span>
                      <p className="font-bold text-amber-300">
                        {userGroup ? userGroup.name : 'جوخه صاعقه ۱۲ (تهران)'}
                      </p>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-1">
                      <span className="text-slate-400 text-[10px]">شماره تماس</span>
                      <p className="font-mono text-slate-200">{currentUser?.phone || '۰۹۱۲۳۴۵۶۷۸۹'}</p>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-1">
                      <span className="text-slate-400 text-[10px]">استان و شهر</span>
                      <p className="font-bold text-white">{currentUser?.province || 'تهران'} - {currentUser?.city || 'تهران'}</p>
                    </div>

                    <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-1">
                      <span className="text-slate-400 text-[10px]">مدرسه و پایه</span>
                      <p className="font-bold text-white">{currentUser?.school_name || 'دبیرستان شهید بهشتی'} ({currentUser?.grade || 'پایه دهم'})</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: MEDALS & HONORS */}
              {profileSubTab === 'medals' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-300">
                    نشان‌های افتخار کسب شده در جریان مراحل و مأموریت‌های استراتژیک:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { id: 'm1', title: 'مدال طلای نصر کشوری', desc: 'کسب رتبه برتر در مأموریت‌های جهادی', icon: '🥇', color: 'border-amber-500/50 bg-amber-950/30 text-amber-300' },
                      { id: 'm2', title: 'نشان تکاور بصیرت', desc: 'پاسخ کامل به چالش‌های فکری و تاریخی', icon: '🎖️', color: 'border-cyan-500/50 bg-cyan-950/30 text-cyan-300' },
                      { id: 'm3', title: 'مدال پیشگام رسانه', desc: 'ثبت و ارسال گزارش‌های میدانی تصویری', icon: '⭐', color: 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300' },
                      { id: 'm4', title: 'نشان شجاعت و ایثار', desc: 'همکاری ویژه تیمی و انسجام گروهی', icon: '🛡️', color: 'border-purple-500/50 bg-purple-950/30 text-purple-300' }
                    ].map(medal => (
                      <div key={medal.id} className={`p-3 rounded-2xl border ${medal.color} flex items-center gap-3`}>
                        <span className="text-2xl">{medal.icon}</span>
                        <div>
                          <h4 className="text-xs font-black">{medal.title}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">{medal.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: AVATAR SELECTOR */}
              {profileSubTab === 'avatar' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-300">
                    تصویر آواتار دلخواه خود را جهت نمایش در نقشه بازی و جوخه انتخاب فرمایید:
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {PREDEFINED_AVATARS.map(avatar => {
                      const isSelected = (selectedAvatarUrl || currentUser?.avatar_url) === avatar.url;
                      return (
                        <div
                          key={avatar.id}
                          onClick={() => handleSaveAvatar(avatar.url)}
                          className={`relative rounded-2xl p-2 cursor-pointer border transition text-center space-y-1.5 ${
                            isSelected
                              ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                          }`}
                        >
                          <div className="w-14 h-14 rounded-full mx-auto overflow-hidden ring-2 ring-slate-700">
                            <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-300 block truncate">
                            {avatar.name}
                          </span>
                          {isSelected && (
                            <span className="absolute top-1.5 right-1.5 p-1 rounded-full bg-cyan-500 text-slate-950">
                              <Check size={10} strokeWidth={3} />
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: SAVED VITRIN POSTS (ذخیره‌های ویترین) */}
              {profileSubTab === 'saved' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-transparent border border-amber-500/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <Video size={16} className="text-amber-400" />
                        <span>فید ریلز آثار ذخیره‌شده ویترین</span>
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400 text-black">
                        {formatToPersianDigits(savedPostsCount)} اثر ذخیره
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      تمام ویدیوها، مستندات جهادی و دست‌سازه‌هایی که در ویترین نشان‌گذاری کرده‌اید به صورت فید ریلز ویدیویی در دسترس شماست.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowSavedReelsModal(true)}
                      className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-xs transition shadow-lg flex items-center justify-center gap-2"
                    >
                      <Play size={15} className="fill-slate-950" />
                      <span>باز کردن پخش‌کننده ریلز ذخیره‌ها</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Close / Action footer */}
              <div className="border-t border-slate-800 pt-3 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  امتیاز کل: {formatToPersianDigits(currentUser?.points || 2480)} کریستال
                </span>
                <button
                  onClick={() => setShowProfileDrawer(false)}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition"
                >
                  بازگشت به نقشه بازی
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 8. SAVED VITRIN REELS MODAL (پخش‌کننده ریلز آثار ذخیره‌شده)                 */}
      {/* ========================================================================= */}
      <SavedVitrinReelsModal
        isOpen={showSavedReelsModal}
        onClose={() => setShowSavedReelsModal(false)}
        currentUser={currentUser}
        triggerAlert={triggerAlert}
        onNavigateToVitrin={() => {
          setShowSavedReelsModal(false);
          onNavigateTab?.('Vitrin');
        }}
      />

    </div>
  );
}
