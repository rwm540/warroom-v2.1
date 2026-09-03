import React, { useState } from 'react';
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
  MapPin
} from 'lucide-react';
import { User, Mission, MissionSubmission } from '../types';
import { formatToPersianDigits } from '../utils/jalali';

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
  onSubmitMission
}: JourneyViewProps) {
  const [selectedStage, setSelectedStage] = useState<JourneyStage | null>(null);
  const [activeTabSub, setActiveTabSub] = useState<'journey' | 'journal' | 'prayer'>('journey');
  const [widgetNote, setWidgetNote] = useState('');
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [journalNote, setJournalNote] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

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
    const iconSize = 28;
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
    <div className="min-h-screen bg-[#070b13] text-slate-100 pb-16 pt-2 px-2 sm:px-4 relative overflow-hidden dir-rtl font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Subtle Background Lighting and Textures */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-full max-w-2xl h-[550px] bg-emerald-950/20 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-amber-950/20 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-emerald-950/15 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-5 relative z-10">

        {/* ========================================================================= */}
        {/* 1. TOP HEADER (Matching the Reference Screenshot)                        */}
        {/* ========================================================================= */}
        <header className="flex items-center justify-between px-2 pt-2">
          {/* Left Actions: Back to Home + Notification Bell */}
          <div className="flex items-center gap-2">
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('Home')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111927] border border-slate-700/70 text-slate-200 hover:text-white hover:border-cyan-500/50 text-xs font-bold transition shadow-md group"
                title="بازگشت به صفحه اصلی"
              >
                <Home size={14} className="text-cyan-400 group-hover:scale-110 transition" />
                <span>صفحه اصلی</span>
              </button>
            )}

            <button
              onClick={onOpenNotifications || (() => triggerAlert('صندوق اعلانات باز شد.'))}
              className="relative p-2.5 rounded-full bg-[#111927] border border-slate-700/60 text-slate-200 hover:text-amber-400 hover:border-amber-500/50 transition shadow-lg"
              title="اعلان‌ها"
            >
              <Bell size={20} />
              <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-[#070b13] animate-pulse" />
            </button>
          </div>

          {/* User Welcome & Avatar */}
          <div className="flex items-center gap-3">
            <div className="text-left">
              <h2 className="text-base font-black text-white leading-tight flex items-center justify-end gap-1.5">
                <span>سلام</span>
                <span className="text-amber-300">
                  {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'علی رضایی'}
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                <Sparkles size={11} className="text-amber-400" />
                <span>خوش آمدی به مسیر عشاق الحسین</span>
              </p>
            </div>

            {/* Circular Avatar */}
            <div 
              onClick={onOpenProfile || (() => triggerAlert('پروفایل کاربر باز شد.'))}
              className="relative cursor-pointer group"
              title="مشاهده پروفایل"
            >
              <div className="w-12 h-12 rounded-full ring-2 ring-emerald-500/80 p-0.5 bg-slate-900 overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                {currentUser?.avatar_url ? (
                  <img src={currentUser.avatar_url} alt="آواتار" className="w-full h-full object-cover rounded-full group-hover:scale-110 transition" />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#132035] flex items-center justify-center text-emerald-400 font-black">
                    <UserIcon size={22} />
                  </div>
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#070b13]" />
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* 2. STATS BAR (4 Columns: سطح شما, امتیاز کل, نشان‌ها, درصد مسیر)        */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-4 gap-2 sm:gap-3 bg-[#0d1524]/90 border border-slate-800/80 rounded-2xl p-3 sm:p-4 backdrop-blur-md shadow-xl">
          
          {/* 1. سطح شما */}
          <div className="flex flex-col items-center justify-center text-center p-1 rounded-xl bg-[#090e1a]/60 border border-slate-800/40">
            <span className="text-[10px] sm:text-xs text-slate-400 font-medium mb-1">سطح شما</span>
            <div className="flex items-center gap-1">
              <span className="text-slate-500 text-[10px] sm:text-xs font-mono">🔰</span>
              <strong className="text-base sm:text-lg font-black text-white font-mono">
                {formatToPersianDigits(currentUser?.level || 3)}
              </strong>
            </div>
          </div>

          {/* 2. امتیاز کل */}
          <div className="flex flex-col items-center justify-center text-center p-1 rounded-xl bg-[#090e1a]/60 border border-slate-800/40">
            <span className="text-[10px] sm:text-xs text-slate-400 font-medium mb-1">امتیاز کل</span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star size={14} className="fill-amber-400 shrink-0" />
              <strong className="text-sm sm:text-base font-black font-mono">
                {formatToPersianDigits(currentUser?.points || 2480)}
              </strong>
            </div>
          </div>

          {/* 3. نشان‌ها */}
          <div className="flex flex-col items-center justify-center text-center p-1 rounded-xl bg-[#090e1a]/60 border border-slate-800/40">
            <span className="text-[10px] sm:text-xs text-slate-400 font-medium mb-1">نشان‌ها</span>
            <div className="flex items-center gap-1 text-cyan-400">
              <Trophy size={14} className="shrink-0" />
              <strong className="text-base sm:text-lg font-black font-mono">
                {formatToPersianDigits(12)}
              </strong>
            </div>
          </div>

          {/* 4. درصد مسیر */}
          <div className="flex flex-col items-center justify-center text-center p-1 rounded-xl bg-[#090e1a]/60 border border-slate-800/40">
            <span className="text-[10px] sm:text-xs text-slate-400 font-medium mb-1">درصد مسیر</span>
            <div className="flex items-center gap-1 text-emerald-400">
              <div className="relative w-5 h-5 flex items-center justify-center">
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
        {/* 3. MAIN INTERACTIVE SERPENTINE JOURNEY MAP WITH ROAD & SIDE WIDGETS      */}
        {/* ========================================================================= */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-4 items-start pt-2">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN WIDGETS (مسیر سفر, ماموریت بعدی, دفترچه سفر)  */}
          {/* ========================================================= */}
          <div className="order-2 lg:order-1 lg:col-span-3 space-y-4">
            
            {/* Widget 1: Header / Motivation Intro */}
            <div className="bg-[#0e1626]/80 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-md space-y-2.5">
              <h3 className="text-xl font-black text-amber-300 flex items-center gap-2">
                <Compass className="text-amber-400" size={22} />
                <span>مسیر سفر</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-serif italic">
                «هر قدم، یک فتح دل است در این مسیر نورانی تا کربلا...»
              </p>
              <button
                onClick={() => setShowGuideModal(true)}
                className="w-full flex items-center justify-center gap-2 bg-[#142138] hover:bg-[#1a2c4b] border border-cyan-500/30 text-cyan-300 text-xs font-bold py-2 rounded-xl transition"
              >
                <Compass size={15} />
                <span>راهنمای مسیر و مراحل</span>
              </button>
            </div>

            {/* Widget 2: ماموریت بعدی */}
            <div className="bg-gradient-to-br from-[#121c2e] to-[#0d1422] border border-amber-500/30 rounded-2xl p-4 backdrop-blur-md shadow-lg space-y-2.5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950/70 border border-amber-800/50">
                  مأموریت بعدی
                </span>
                <span className="text-[10px] text-slate-400 font-mono">۱ از ۳ مرحله</span>
              </div>
              <h4 className="font-black text-sm text-white">تهیه بسته کمک مؤمنانه</h4>
              <p className="text-[11px] text-slate-400">توزیع بسته‌های ارزاق به نیابت از شهدای والامقام</p>
              
              <button 
                onClick={() => {
                  const stage = stages.find(s => s.id === 's4') || stages[0];
                  setSelectedStage(stage);
                }}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs py-2 rounded-xl transition shadow-md"
              >
                <span>ادامه مأموریت</span>
                <ArrowLeft size={14} />
              </button>
            </div>

            {/* Widget 3: دفترچه سفر */}
            <div 
              onClick={() => setShowJournalModal(true)}
              className="bg-[#0e1626]/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 backdrop-blur-md cursor-pointer group transition shadow-md flex items-center gap-3.5"
            >
              <div className="w-12 h-14 rounded-lg bg-amber-950/40 border border-amber-700/50 flex flex-col items-center justify-center text-amber-400 group-hover:scale-105 transition shadow">
                <BookOpen size={22} />
                <span className="text-[8px] font-bold mt-0.5">یادداشت</span>
              </div>
              <div className="flex-1 text-right">
                <h4 className="font-bold text-xs text-white group-hover:text-amber-300 transition flex items-center justify-between">
                  <span>دفترچه سفر</span>
                  <span className="text-[9px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                    فعال
                  </span>
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">ثبت خاطرات و دل‌نوشته‌های مسیر</p>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* CENTER COLUMN: THE SERPENTINE WINDING ROAD CANVAS         */}
          {/* ========================================================= */}
          <div className="order-1 lg:order-2 lg:col-span-6 relative min-h-[920px] flex justify-center py-6">
            
            {/* SVG Winding Road Path with Textured Glowing Curves */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              viewBox="0 0 400 920" 
              preserveAspectRatio="none"
            >
              <defs>
                {/* Road Surface Gradient */}
                <linearGradient id="roadGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.3" />
                </linearGradient>

                <linearGradient id="roadBorder" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" stopOpacity="0.7" />
                  <stop offset="45%" stopColor="#fbbf24" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#475569" stopOpacity="0.4" />
                </linearGradient>

                <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Road Glow Aura */}
              <path
                d="M 200 40 
                   C 200 100, 110 120, 110 190 
                   C 110 260, 290 280, 290 350 
                   C 290 420, 120 440, 120 510 
                   C 120 580, 280 600, 280 670 
                   C 280 740, 140 760, 140 820
                   L 270 890"
                fill="none"
                stroke="url(#roadGlow)"
                strokeWidth="70"
                strokeLinecap="round"
                filter="url(#glowFilter)"
                opacity="0.3"
              />

              {/* Main Asphalt Road Base */}
              <path
                d="M 200 40 
                   C 200 100, 110 120, 110 190 
                   C 110 260, 290 280, 290 350 
                   C 290 420, 120 440, 120 510 
                   C 120 580, 280 600, 280 670 
                   C 280 740, 140 760, 140 820
                   L 270 890"
                fill="none"
                stroke="#172236"
                strokeWidth="54"
                strokeLinecap="round"
              />

              {/* Road Outer Golden/Emerald Luminous Edge Borders */}
              <path
                d="M 200 40 
                   C 200 100, 110 120, 110 190 
                   C 110 260, 290 280, 290 350 
                   C 290 420, 120 440, 120 510 
                   C 120 580, 280 600, 280 670 
                   C 280 740, 140 760, 140 820
                   L 270 890"
                fill="none"
                stroke="url(#roadBorder)"
                strokeWidth="56"
                strokeLinecap="round"
                opacity="0.25"
              />

              {/* Center Dashed Highway Line */}
              <path
                d="M 200 40 
                   C 200 100, 110 120, 110 190 
                   C 110 260, 290 280, 290 350 
                   C 290 420, 120 440, 120 510 
                   C 120 580, 280 600, 280 670 
                   C 280 740, 140 760, 140 820
                   L 270 890"
                fill="none"
                stroke="#facc15"
                strokeWidth="2.5"
                strokeDasharray="8 10"
                opacity="0.8"
              />
            </svg>

            {/* Stages Embedded Along the S-Curve Road */}
            <div className="relative w-full h-full flex flex-col justify-between items-center py-2 z-10">
              {stages.map((stage, idx) => {
                const isCompleted = stage.status === 'completed';
                const isInProgress = stage.status === 'in_progress';
                const isLocked = stage.status === 'locked';

                // Pre-calculated horizontal offsets matching the S-curves
                const xOffsets = [
                  'translate-x-0', // Stage 1 (top center)
                  '-translate-x-24 sm:-translate-x-28', // Stage 2 (curve left)
                  'translate-x-20 sm:translate-x-28', // Stage 3 (curve right)
                  '-translate-x-20 sm:-translate-x-24', // Stage 4 (curve left)
                  'translate-x-16 sm:translate-x-24', // Stage 5 (curve right)
                  '-translate-x-16 sm:-translate-x-20', // Stage 6 (curve left)
                  'translate-x-16 sm:translate-x-20' // Stage 7 (curve right)
                ];

                return (
                  <motion.div
                    key={stage.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.08 }}
                    className={`relative flex items-center justify-center ${xOffsets[idx]} my-2`}
                  >
                    {/* Stage Interactive Node Button */}
                    <div 
                      onClick={() => handleStageClick(stage)}
                      className="flex flex-col sm:flex-row items-center gap-2 cursor-pointer group select-none"
                    >
                      {/* Circular Stage Emblem */}
                      <div className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-2xl ${
                        isCompleted 
                          ? 'bg-[#06241a] border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.7)]'
                          : isInProgress
                          ? 'bg-[#2b1e06] border-2 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.9)] animate-pulse'
                          : 'bg-[#101726] border-2 border-slate-700/80 shadow-[0_0_15px_rgba(0,0,0,0.6)] opacity-90'
                      }`}>
                        
                        {/* Status Icon */}
                        {renderStageIcon(stage.iconName, stage.status)}

                        {/* Top Number Indicator Pin */}
                        <div className={`absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-black border shadow ${
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
                      <div className={`px-3.5 py-1.5 rounded-2xl backdrop-blur-md border transition-all text-right shadow-lg flex flex-col justify-center min-w-[110px] ${
                        isCompleted
                          ? 'bg-[#081f18]/90 border-emerald-500/50 group-hover:border-emerald-400'
                          : isInProgress
                          ? 'bg-[#231805]/95 border-amber-500/70 group-hover:border-amber-400'
                          : 'bg-[#0d1424]/90 border-slate-800 group-hover:border-slate-600'
                      }`}>
                        <h4 className="font-black text-xs text-white leading-tight">
                          {stage.title}
                        </h4>
                        
                        <div className="flex items-center gap-1 mt-0.5">
                          {isCompleted && (
                            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 size={11} className="text-emerald-400" />
                              <span>تکمیل شد</span>
                            </span>
                          )}
                          {isInProgress && (
                            <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                              <span>در حال انجام</span>
                            </span>
                          )}
                          {isLocked && (
                            <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                              <Lock size={10} className="text-slate-500" />
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

          {/* ========================================================= */}
          {/* RIGHT COLUMN WIDGETS (دعای روز, جمله انگیزشی)             */}
          {/* ========================================================= */}
          <div className="order-3 lg:col-span-3 space-y-4">
            
            {/* Widget 1: دعای روز (Daily Prayer Card with Parchment Aesthetics) */}
            <div className="bg-[#101726]/90 border border-amber-600/30 rounded-2xl p-4 backdrop-blur-md shadow-xl space-y-2.5 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                  <span>✨</span>
                  <span>دعای روز</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">فراز ۴</span>
              </div>
              
              <p className="text-xs text-amber-100/90 leading-relaxed font-serif text-justify dir-rtl">
                «اللَّهُمَّ ارْزُقْنِي فِيهِ طَاعَةَ الْخَاشِعِينَ، وَ اشْرَحْ فِيهِ صَدْرِي بِإِنَابَةِ الْمُخْبِتِينَ، بِأَمَانِكَ يَا أَمَانَ الْخَائِفِينَ...»
              </p>

              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                <span>ترجمه: خدایا در این روز طاعت بندگان فروتن را روزی‌ام فرما...</span>
              </div>
            </div>

            {/* Widget 2: جمله انگیزشی (Inspirational Banner Art) */}
            <div className="rounded-2xl border border-slate-800 overflow-hidden relative shadow-xl group">
              <div className="h-44 w-full relative">
                <img 
                  src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" 
                  alt="پرچم سرخ" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090e1a] via-[#090e1a]/60 to-transparent" />
                
                <div className="absolute top-2 right-2">
                  <span className="bg-rose-950/80 border border-rose-600/50 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded">
                    جمله انگیزشی
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 left-3">
                  <p className="text-xs sm:text-sm font-black text-white leading-relaxed drop-shadow-md">
                    «راه کوتاه نیست، اما حسینی است! همین کافیست...»
                  </p>
                </div>
              </div>
            </div>

            {/* Widget 3: پشتیبانی و پاسخگویی سریع */}
            <div className="bg-[#0e1626]/80 border border-slate-800 rounded-2xl p-3.5 backdrop-blur-md flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <HelpCircle size={17} className="text-cyan-400" />
                <span>نیاز به راهنمایی دارید؟</span>
              </div>
              <button 
                onClick={() => onNavigateTab ? onNavigateTab('Support') : triggerAlert('واحد پشتیبانی آماده پاسخگویی است.')}
                className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition"
              >
                ارسال تیکت ←
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE STAGE DETAILS MODAL (Opens on click of any Stage Icon)     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedStage && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 dir-rtl overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#0a1122] border border-cyan-500/40 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative my-auto max-h-[90vh] flex flex-col"
            >
              
              {/* Stage Header Banner */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                <img 
                  src={selectedStage.bgThemeUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'} 
                  alt="تصویر مرحله" 
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1122] via-[#0a1122]/40 to-transparent" />
                
                {/* Close Button */}
                <button
                  onClick={() => setSelectedStage(null)}
                  className="absolute top-4 left-4 p-2 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-300 hover:text-white transition z-10"
                >
                  <X size={18} />
                </button>

                <div className="absolute bottom-4 right-4 left-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-cyan-950/90 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md">
                      مرحله {formatToPersianDigits(selectedStage.number)} از ۷
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      selectedStage.status === 'completed' 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                        : selectedStage.status === 'in_progress'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}>
                      {selectedStage.status === 'completed' ? 'تکمیل شده' : selectedStage.status === 'in_progress' ? 'در حال انجام (جاری)' : 'قفل مرحله'}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-white">{selectedStage.title}</h2>
                  <p className="text-xs text-slate-300 font-medium">{selectedStage.subtitle}</p>
                </div>
              </div>

              {/* Stage Widgets & Deliverable Form */}
              <div className="p-5 overflow-y-auto space-y-4 text-xs">
                
                {/* Countdown Timer Widget */}
                <div className="bg-amber-950/30 border border-amber-500/40 p-3 rounded-2xl flex items-center justify-between text-amber-300">
                  <div className="flex items-center gap-2">
                    <Clock size={17} className="animate-pulse text-amber-400" />
                    <span className="font-bold">زمان باقی‌مانده تا پایان مأموریت:</span>
                  </div>
                  <span className="font-mono font-black text-xs tracking-wider">۰۲ : ۱۴ : ۳۵ : ۱۲</span>
                </div>

                {/* Description Text */}
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                  <h4 className="font-black text-slate-200 flex items-center gap-2 text-xs">
                    <FileText size={15} className="text-cyan-400" />
                    <span>شرح سناریو و اهداف مأموریت:</span>
                  </h4>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    {selectedStage.description} رزمندگان عزیز می‌توانند پس از انجام اقدامات خواسته شده، گزارش کار، صوت، عکس یا مستندات مربوطه را از بخش بارگذاری ارسال نمایند.
                  </p>
                </div>

                {/* Audio Briefing Player Widget */}
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800">
                      <Volume2 size={18} />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-200">فایل صوتی توجیهی مرحله</h5>
                      <span className="text-[10px] text-slate-400">مدت زمان: ۰۲:۴۵ دقیقه</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setIsPlayingAudio(!isPlayingAudio);
                      triggerAlert(isPlayingAudio ? 'پخش صوت متوقف شد.' : 'پخش صوت توجیهی مرحله آغاز شد.');
                    }}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs transition"
                  >
                    {isPlayingAudio ? 'توقف' : 'پخش صوت'}
                  </button>
                </div>

                {/* Video Widget Preview */}
                <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-200 flex items-center gap-1.5">
                      <Video size={15} className="text-rose-400" />
                      <span>ویدئوی آموزشی و راهنمای مرحله</span>
                    </h5>
                    <span className="text-[10px] text-slate-400 font-mono">HD 1080p</span>
                  </div>
                  <div className="relative h-36 rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-800">
                    <img src={selectedStage.bgThemeUrl} alt="ویدئو" className="w-full h-full object-cover opacity-40" />
                    <button 
                      onClick={() => triggerAlert('پخش ویدئوی آموزشی مرحله آغاز شد.')}
                      className="absolute w-12 h-12 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-lg hover:scale-110 transition"
                    >
                      <Play size={20} className="fill-slate-950 mr-0.5" />
                    </button>
                  </div>
                </div>

                {/* Deliverable File Upload Widget */}
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                  <h5 className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Upload size={15} className="text-emerald-400" />
                    <span>بارگذاری مستندات و پاسخ مرحله:</span>
                  </h5>
                  
                  <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 p-4 rounded-xl text-center space-y-2 transition bg-slate-900/50">
                    <input 
                      type="file" 
                      id="stage-file-upload" 
                      onChange={handleFileUploadSim}
                      className="hidden" 
                    />
                    <label htmlFor="stage-file-upload" className="cursor-pointer block space-y-1">
                      <Upload size={24} className="mx-auto text-cyan-400" />
                      <span className="text-slate-300 font-bold block">برای انتخاب فایل کلیک کنید یا فایل را اینجا رها کنید</span>
                      <span className="text-[10px] text-slate-500 block">پشتیبانی از فرمت‌های ZIP, DOCX, MP4, PDF (حداکثر ۵۰ مگابایت)</span>
                    </label>
                    {uploadedFile && (
                      <div className="mt-2 bg-emerald-950/60 border border-emerald-800 text-emerald-300 p-2 rounded-lg text-xs font-mono font-bold">
                        فایل انتخاب شده: {uploadedFile}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate-300">یادداشت برای هیئت داوران ستاد:</label>
                    <textarea 
                      rows={2}
                      value={widgetNote}
                      onChange={(e) => setWidgetNote(e.target.value)}
                      placeholder="توضیحات تکمیلی پیرامون اقدام انجام شده..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    onClick={() => {
                      triggerAlert(`پاسخ مرحله «${selectedStage.title}» با موفقیت برای ستاد ارسال گردید.`);
                      setSelectedStage(null);
                    }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs py-2.5 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <Send size={15} />
                    <span>ارسال نهایی مستندات مرحله</span>
                  </button>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 5. JOURNAL MODAL (دفترچه سفر)                                            */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showJournalModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 dir-rtl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0b1222] border border-amber-500/40 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl"
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
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 dir-rtl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0b1222] border border-cyan-500/40 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-cyan-400 font-black text-base">
                  <Compass size={20} />
                  <span>راهنمای پیمایش مسیر سفر</span>
                </div>
                <button 
                  onClick={() => setShowGuideModal(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <div className="flex items-start gap-2.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-emerald-400 text-sm">🟢</span>
                  <div>
                    <strong className="text-white block">مراحل سبز:</strong>
                    <span>مراحلی که شما با موفقیت آن‌ها را پشت سر گذاشته‌اید.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-amber-400 text-sm">🟡</span>
                  <div>
                    <strong className="text-white block">مراحل طلایی:</strong>
                    <span>مرحله جاری و در دست اقدام شما؛ با کلیک روی آن مأموریت را تکمیل فرمایید.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 text-sm">🔒</span>
                  <div>
                    <strong className="text-white block">مراحل قفل شده:</strong>
                    <span>پس از کسب امتیاز و گذراندن مراحل قبلی، به صورت خودکار بازگشایی خواهند شد.</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowGuideModal(false)}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs py-2.5 rounded-xl transition"
              >
                متوجه شدم
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
