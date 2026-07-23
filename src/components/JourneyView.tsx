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
  Building
} from 'lucide-react';
import { User } from '../types';

interface JourneyViewProps {
  currentUser: User | null;
  onEnterDashboard: (stageId?: string) => void;
  triggerAlert: (msg: string) => void;
  onOpenNotifications?: () => void;
}

export interface JourneyStage {
  id: string;
  title: string;
  subtitle: string;
  status: 'completed' | 'in_progress' | 'locked';
  icon: any;
  requiredPoints: number;
  description: string;
  missionsCount: number;
  completedMissions: number;
}

export default function JourneyView({
  currentUser,
  onEnterDashboard,
  triggerAlert,
  onOpenNotifications
}: JourneyViewProps) {
  const [selectedStage, setSelectedStage] = useState<JourneyStage | null>(null);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showNotebookModal, setShowNotebookModal] = useState<boolean>(false);
  const [userNotes, setUserNotes] = useState<string[]>(['دیدار اول با اعضای جوخه صاعقه', 'برنامه‌ریزی برای اولین مسابقه استراتژیک']);
  const [newNote, setNewNote] = useState<string>('');

  // 7 Stages of the Journey
  const stages: JourneyStage[] = [
    {
      id: 's1',
      title: 'آغاز مسیر',
      subtitle: 'ورود به جبهه نوآوری و تعهد',
      status: 'completed',
      icon: Flag,
      requiredPoints: 0,
      description: 'ثبت‌نام انفرادی یا جوخه‌ای، دریافت کد ۹ رقمی رزمنده و آشنایی اولیه با قوانین قرارگاه اتاق جنگ.',
      missionsCount: 2,
      completedMissions: 2
    },
    {
      id: 's2',
      title: 'معرفت',
      subtitle: 'شناخت جبهه فکری و عقیدتی',
      status: 'completed',
      icon: Heart,
      requiredPoints: 200,
      description: 'گذراندن دوره‌های آموزش مقدماتی، مطالعه متون استراتژیک و ارزیابی سطح آگاهی فکری.',
      missionsCount: 3,
      completedMissions: 3
    },
    {
      id: 's3',
      title: 'آمادگی',
      subtitle: 'تجهیز به مهارت‌های عملیاتی',
      status: 'completed',
      icon: Shield,
      requiredPoints: 500,
      description: 'ارسال پاسخ عملیات‌های شبیه‌سازی دفاع هوایی و کدگذاری دفاعی AES-256.',
      missionsCount: 4,
      completedMissions: 4
    },
    {
      id: 's4',
      title: 'خدمت',
      subtitle: 'مرحله جاری - عملیات میدان واقعی',
      status: 'in_progress',
      icon: Flame,
      requiredPoints: 1000,
      description: 'ارسال پاسخ عملیات اصلی رصد سایبری و کمک‌های مؤمنانه به ستاد مرکزی.',
      missionsCount: 3,
      completedMissions: 1
    },
    {
      id: 's5',
      title: 'همراهی',
      subtitle: 'هم‌افزایی جوخه‌ها و مسابقات کشوری',
      status: 'locked',
      icon: Users,
      requiredPoints: 1800,
      description: 'همکاری بین‌جویه‌ای در سطح استانی و حل مسئله‌های دفاعی پیچیده آنلاین.',
      missionsCount: 5,
      completedMissions: 0
    },
    {
      id: 's6',
      title: 'زیارت',
      subtitle: 'حضور در میقات معنوی قرارگاه',
      status: 'locked',
      icon: Sparkles,
      requiredPoints: 2500,
      description: 'اعزام برگزیدگان به اردوی تربیتی-زیارتی و تجلیل از فرماندهان برتر.',
      missionsCount: 2,
      completedMissions: 0
    },
    {
      id: 's7',
      title: 'سفیر عشق',
      subtitle: 'قله افتخار و مدال طلایی خادمی',
      status: 'locked',
      icon: Award,
      requiredPoints: 3500,
      description: 'اعطای نشان ملی خادمی و سفیر فرهنگ استراتژیک به زبده‌ترین رزمندگان اتاق جنگ.',
      missionsCount: 1,
      completedMissions: 0
    }
  ];

  const handleStageClick = (stage: JourneyStage) => {
    setSelectedStage(stage);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setUserNotes([newNote.trim(), ...userNotes]);
    setNewNote('');
    triggerAlert('یادداشت جدید به دفترچه سفر شما افزوده شد.');
  };

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 pb-28 pt-3 px-3 sm:px-6 relative overflow-hidden dir-rtl font-sans">
      
      {/* Background Atmosphere Glows & Gold Dust Effect */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-full max-w-lg h-96 bg-amber-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-md md:max-w-2xl mx-auto space-y-4 relative z-10">
        
        {/* Top Header Card - User Welcome & Notification Bell */}
        <div className="flex items-center justify-between bg-[#0b1228]/90 border border-amber-500/25 p-3.5 rounded-2xl backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          
          {/* User Profile info */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-600 p-[1.5px] shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                <div className="w-full h-full bg-[#070b1a] rounded-full flex items-center justify-center overflow-hidden">
                  {currentUser?.avatar_url ? (
                    <img src={currentUser.avatar_url} alt="آواتار" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={22} className="text-amber-400" />
                  )}
                </div>
              </div>
              <span className="absolute -bottom-1 -left-1 bg-amber-500 text-slate-950 font-mono text-[9px] font-black px-1 rounded-full border border-slate-950">
                L3
              </span>
            </div>

            <div className="text-right leading-tight">
              <h1 className="text-xs sm:text-sm font-black text-slate-100">
                سلام {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'کاربر گرامی'}
              </h1>
              <p className="text-[10px] sm:text-[11px] text-amber-300/80 font-medium mt-0.5">
                خوش آمدی به مسیر عشاق الحسین و اتاق جنگ
              </p>
            </div>
          </div>

          {/* Bell Notifications */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-slate-900/90 border border-amber-500/30 text-amber-300 hover:bg-amber-950/40 transition"
            title="اطلاعیه‌ها"
          >
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-600 border border-[#070b19] animate-pulse" />
          </button>
        </div>

        {/* Stats Row Bar (درصد مسیر / نشان‌ها / امتیاز کل / سطح شما) */}
        <div className="grid grid-cols-4 gap-2 bg-[#0a1126]/80 border border-cyan-500/20 p-2.5 rounded-2xl text-center shadow-inner">
          
          <div className="flex flex-col items-center justify-center p-1 border-l border-slate-800/80">
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold mb-1">درصد مسیر</span>
            <div className="flex items-center gap-1">
              <div className="relative w-7 h-7 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-400"
                    strokeDasharray="64, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[8px] font-black text-emerald-400">۶۴٪</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-1 border-l border-slate-800/80">
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold mb-1">نشان‌ها</span>
            <div className="flex items-center gap-1 font-mono font-black text-xs sm:text-sm text-amber-400">
              <Award size={13} className="text-amber-400" />
              <span>۱۲</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-1 border-l border-slate-800/80">
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold mb-1">امتیاز کل</span>
            <div className="flex items-center gap-1 font-mono font-black text-xs sm:text-sm text-cyan-300">
              <Star size={13} className="text-cyan-400" />
              <span>۲,۴۸۰</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-1">
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold mb-1">سطح شما</span>
            <div className="px-2 py-0.5 rounded-lg bg-amber-950/80 border border-amber-500/50 text-amber-300 font-mono font-black text-xs">
              ۳
            </div>
          </div>

        </div>

        {/* Title & Guide Button Bar */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <h2 className="text-base sm:text-lg font-black text-amber-300 tracking-tight flex items-center gap-2">
              <Compass size={20} className="text-amber-400 animate-spin-slow" />
              <span>مسیر سفر و مراحل رشد</span>
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5">
              هر قدم، یک فتح دل است — در این مسیر تا کربلا...
            </p>
          </div>

          <button
            onClick={() => setShowGuideModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 text-[11px] font-bold transition shadow-[0_0_10px_rgba(245,158,11,0.2)]"
          >
            <HelpCircle size={14} />
            <span>راهنمای مسیر</span>
          </button>
        </div>

        {/* Enter Dashboard Big Primary Banner Button */}
        <button
          onClick={() => onEnterDashboard()}
          className="w-full relative group overflow-hidden rounded-2xl p-[1px] bg-gradient-to-r from-cyan-500 via-amber-400 to-rose-500 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition transform active:scale-[0.98]"
        >
          <div className="bg-gradient-to-r from-[#09132e] via-[#0b1738] to-[#120f2b] p-3.5 rounded-[15px] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-400/50 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition">
                <Flame size={22} className="animate-pulse text-amber-400" />
              </div>
              <div className="text-right leading-tight">
                <span className="text-xs font-black text-white block">ورود به اتاق جنگ و شروع ماموریت‌ها</span>
                <span className="text-[10px] text-cyan-300/80">برای اجرای عملیات جاری روی این دکمه بزنید</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold group-hover:translate-x-1 transition shadow-[0_0_10px_rgba(34,211,238,0.8)]">
              <ArrowLeft size={18} />
            </div>
          </div>
        </button>

        {/* Main Winding Roadmap Pathway View */}
        <div className="relative py-6 px-2 min-h-[580px] bg-[#050a17]/90 border border-amber-500/20 rounded-3xl shadow-2xl overflow-hidden">
          
          {/* Subtle Ambient Roadmap Lines Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          {/* SVG S-Curve Roadmap Trail */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path
              d="M 50 8 C 80 20, 80 32, 50 42 C 20 52, 20 64, 50 74 C 80 84, 75 92, 50 96"
              fill="none"
              stroke="#d97706"
              strokeWidth="2.5"
              strokeDasharray="4 3"
              className="opacity-60"
            />
            <path
              d="M 50 8 C 80 20, 80 32, 50 42 C 20 52, 20 64, 50 74"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="3"
              className="opacity-90 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
            />
          </svg>

          {/* SIDE FLOATING CARDS (Matches Provided Screenshot Design) */}

          {/* 1. Daily Prayer Card (دعای روز) - Top Right Side */}
          <div className="absolute top-8 left-3 sm:left-6 max-w-[150px] sm:max-w-[170px] bg-[#1a140a]/90 border border-amber-600/40 p-2.5 rounded-2xl shadow-xl z-20 backdrop-blur-sm text-right">
            <div className="flex items-center gap-1.5 border-b border-amber-700/40 pb-1 mb-1.5">
              <BookOpen size={13} className="text-amber-400" />
              <span className="text-[10px] font-black text-amber-300">دعای روز</span>
            </div>
            <p className="text-[9px] text-amber-200/90 leading-relaxed font-serif">
              اللهم رزقنی فیه طاعة الخاشعین و اشرح فیه صدری...
            </p>
          </div>

          {/* 2. Motivational Quote Card (جمله انگیزشی) - Middle Right Side */}
          <div className="absolute top-[210px] right-3 sm:right-6 max-w-[140px] sm:max-w-[160px] bg-[#0c1228]/95 border border-cyan-500/40 p-2.5 rounded-2xl shadow-xl z-20 backdrop-blur-sm text-right">
            <span className="text-[10px] font-black text-cyan-300 block mb-1">جمله انگیزشی</span>
            <p className="text-[9px] text-slate-200 leading-snug">
              راه کوتاه نیست، اما حسینی است! همین کافیست...
            </p>
          </div>

          {/* 3. Next Mission Card (ماموریت بعدی) - Middle Left Side */}
          <div className="absolute top-[340px] left-3 sm:left-6 max-w-[160px] sm:max-w-[185px] bg-[#180a0f]/95 border border-rose-500/40 p-2.5 rounded-2xl shadow-xl z-20 text-right">
            <span className="text-[9px] font-bold text-rose-400 block uppercase">ماموریت بعدی</span>
            <p className="text-[10px] font-black text-white mt-0.5 leading-tight">
              تهیه بسته کمک مؤمنانه
            </p>
            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-rose-900/50">
              <span className="text-[8px] text-slate-400 font-mono">۱ از ۳ مرحله</span>
              <button 
                onClick={() => onEnterDashboard('Missions')}
                className="bg-rose-600 hover:bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-1"
              >
                <span>ادامه</span>
                <ArrowLeft size={10} />
              </button>
            </div>
          </div>

          {/* 4. Notebook Card (دفترچه سفر) - Bottom Left Side */}
          <button
            onClick={() => setShowNotebookModal(true)}
            className="absolute bottom-6 left-3 sm:left-6 max-w-[140px] sm:max-w-[160px] bg-[#1a1209]/90 hover:bg-[#261b0d] border border-amber-500/50 p-2.5 rounded-2xl shadow-xl z-20 text-right transition group cursor-pointer"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <FileText size={14} className="text-amber-400 group-hover:scale-110 transition" />
              <span className="text-[10px] font-black text-amber-300">دفترچه سفر</span>
            </div>
            <p className="text-[9px] text-amber-200/80">
              یادداشت‌های شما ({userNotes.length})
            </p>
          </button>


          {/* 7 STAGE NODES ALONG THE S-CURVE TRAIL */}
          <div className="relative z-10 flex flex-col items-center justify-between gap-12 py-4">
            
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isCompleted = stage.status === 'completed';
              const isInProgress = stage.status === 'in_progress';
              const isLocked = stage.status === 'locked';

              return (
                <div 
                  key={stage.id} 
                  className={`flex flex-col items-center transition transform duration-300 ${
                    idx % 2 === 0 ? 'translate-x-3 sm:translate-x-6' : '-translate-x-3 sm:-translate-x-6'
                  }`}
                >
                  
                  {/* Stage Node Circle Icon */}
                  <button
                    onClick={() => handleStageClick(stage)}
                    className={`relative group w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                      isCompleted 
                        ? 'bg-gradient-to-tr from-emerald-600 to-emerald-400 text-slate-950 border-2 border-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.6)] hover:scale-110'
                        : isInProgress
                        ? 'bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 text-slate-950 border-2 border-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.8)] animate-bounce hover:scale-110'
                        : 'bg-[#0a0f24] text-slate-500 border border-slate-700/80 opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    
                    {/* Inner Icon */}
                    <Icon size={26} className={isCompleted ? 'text-slate-950 font-bold' : isInProgress ? 'text-slate-950 font-bold' : 'text-slate-400'} />

                    {/* Status Badge Tag above or below node */}
                    {isCompleted && (
                      <span className="absolute -bottom-2 bg-emerald-950 text-emerald-300 border border-emerald-500 text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-md">
                        <CheckCircle2 size={9} />
                        تکمیل شد
                      </span>
                    )}

                    {isInProgress && (
                      <span className="absolute -bottom-2 bg-amber-950 text-amber-300 border border-amber-400 text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-lg animate-pulse">
                        <Flame size={9} />
                        در حال انجام
                      </span>
                    )}

                    {isLocked && (
                      <span className="absolute -bottom-2 bg-slate-900 text-slate-400 border border-slate-700 text-[8px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Lock size={8} />
                        قفل شده
                      </span>
                    )}

                  </button>

                  {/* Stage Title Label Card */}
                  <div className="mt-3 text-center bg-[#070e24]/90 border border-amber-500/30 px-3 py-1 rounded-xl backdrop-blur-sm">
                    <span className="text-xs font-black text-white block">
                      {stage.title}
                    </span>
                    <span className="text-[9px] text-amber-300/80 font-medium">
                      {stage.subtitle}
                    </span>
                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </div>

      {/* 1. STAGE DETAIL MODAL */}
      <AnimatePresence>
        {selectedStage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md dir-rtl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-[#080d24] border border-amber-500/40 rounded-3xl p-5 shadow-[0_0_40px_rgba(245,158,11,0.3)] space-y-4 relative"
            >
              <button
                onClick={() => setSelectedStage(null)}
                className="absolute top-4 left-4 p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  selectedStage.status === 'completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500' :
                  selectedStage.status === 'in_progress' ? 'bg-amber-950 text-amber-400 border border-amber-500' :
                  'bg-slate-900 text-slate-500 border border-slate-700'
                }`}>
                  <selectedStage.icon size={24} />
                </div>
                <div className="text-right">
                  <h3 className="text-base font-black text-white">{selectedStage.title}</h3>
                  <span className="text-xs text-amber-300">{selectedStage.subtitle}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-[#050818] p-3 rounded-2xl border border-slate-800">
                {selectedStage.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-center">
                <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">امتیاز مورد نیاز</span>
                  <span className="text-amber-400 font-mono">{selectedStage.requiredPoints} امتیاز</span>
                </div>
                <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">ماموریت‌ها</span>
                  <span className="text-cyan-300 font-mono">{selectedStage.completedMissions} از {selectedStage.missionsCount}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    const stage = selectedStage;
                    setSelectedStage(null);
                    onEnterDashboard(stage.id);
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs py-3 rounded-xl transition shadow-[0_0_15px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2"
                >
                  <span>ورود به داشبورد و انجام این مرحله</span>
                  <ArrowLeft size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. GUIDE MODAL */}
      <AnimatePresence>
        {showGuideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md dir-rtl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-[#080d24] border border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-4 relative"
            >
              <button
                onClick={() => setShowGuideModal(false)}
                className="absolute top-4 left-4 p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 text-amber-400">
                <HelpCircle size={22} />
                <h3 className="text-base font-black text-white">راهنمای مسیر سفر عشاق الحسین</h3>
              </div>

              <div className="space-y-2 text-xs text-slate-300 leading-relaxed max-h-72 overflow-y-auto pr-1">
                <p>
                  در مسیر «عشاق الحسین»، رزمندگان اتاق جنگ با انجام ماموریت‌های استراتژیک، شرکت در آموزش‌ها و کسب امتیاز به مراحل بالاتر صعود می‌کنند.
                </p>
                <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 space-y-1.5">
                  <span className="font-bold text-amber-300 block">قوانین ارتقای مرحله:</span>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                    <li>تکمیل تمام ماموریت‌های هر مرحله برای باز شدن مرحله بعدی لازم است.</li>
                    <li>کسب امتیازهای فردی و جوخه‌ای در سرعت ارتقا نقش دارد.</li>
                    <li>مدال‌ها و نشان‌های افتخار در شناسنامه رزمنده ثبت می‌گردد.</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setShowGuideModal(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2.5 rounded-xl transition"
              >
                متوجه شدم
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. NOTEBOOK MODAL */}
      <AnimatePresence>
        {showNotebookModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md dir-rtl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-[#0a1026] border border-amber-500/40 rounded-3xl p-5 shadow-2xl space-y-4 relative"
            >
              <button
                onClick={() => setShowNotebookModal(false)}
                className="absolute top-4 left-4 p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 text-amber-400">
                <FileText size={22} />
                <h3 className="text-base font-black text-white">دفترچه یادداشت‌های سفر</h3>
              </div>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="افزودن یادداشت جدید..."
                  className="flex-1 bg-[#050818] border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3 py-2 rounded-xl transition"
                >
                  ثبت
                </button>
              </form>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {userNotes.map((note, idx) => (
                  <div key={idx} className="bg-[#050818] border border-slate-800 p-2.5 rounded-xl text-xs text-amber-200/90 leading-snug flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 shrink-0" />
                    <span>{note}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowNotebookModal(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2 rounded-xl transition"
              >
                بستن
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
