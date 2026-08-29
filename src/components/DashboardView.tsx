import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Award, 
  Target, 
  Users, 
  Megaphone, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  ChevronLeft,
  Copy,
  Check,
  Zap,
  Flame,
  Newspaper,
  Compass,
  Star,
  Sparkles,
  Lock,
  Flag,
  Heart,
  Shield,
  FileText,
  Video,
  Gift,
  Trophy,
  User as UserIcon,
  Search,
  Filter,
  Home
} from 'lucide-react';
import { User, Group, Mission, MissionSubmission, Announcement, News, Gender } from '../types';
import { formatToPersianDigits } from '../utils/jalali';

interface DashboardViewProps {
  currentUser: User;
  users: User[];
  groups: Group[];
  missions: Mission[];
  submissions: MissionSubmission[];
  announcements: Announcement[];
  news: News[];
  onNavigate: (tab: string) => void;
  onOpenSquadModal: () => void;
}

export default function DashboardView({
  currentUser,
  users,
  groups,
  missions,
  submissions,
  announcements,
  news,
  onNavigate,
  onOpenSquadModal
}: DashboardViewProps) {
  const [copied, setCopied] = useState(false);
  const [dashboardCategory, setDashboardCategory] = useState<'map_missions' | 'trainings' | 'rewards' | 'rankings'>('map_missions');
  const [rankingMode, setRankingMode] = useState<'groups' | 'individuals'>('groups');
  const [searchRanking, setSearchRanking] = useState('');

  // Safety fallback
  if (!currentUser) {
    return (
      <div className="dir-rtl max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 mx-auto shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <ShieldAlert size={32} className="animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white">ورود به بخش اتاق جنگ</h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
            برای مشاهده کامل داشبورد، نقشه مراحل و مأموریت‌ها لطفاً ابتدا وارد حساب کاربری خود شوید یا ثبت‌نام کنید.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('Home')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-xs shadow-lg transition"
          >
            صفحه اصلی و ثبت‌نام
          </button>
        </div>
      </div>
    );
  }

  const isGirl = currentUser.gender === 'دختر';
  const rankTitle = currentUser.role === 'leader' ? 'فرمانده ارشد جوخه' : 'رزمنده جنگ استراتژیک';

  // Submissions calculation
  const userSubmissions = submissions.filter(s => s.user_id === currentUser.id);
  const totalScore = userSubmissions
    .filter(s => s.status === 'approved')
    .reduce((acc, curr) => acc + (curr.awarded_score || 0), 0);

  const activeMissions = missions.filter(m => m.is_active);
  const userGroup = groups.find(g => g.id === currentUser.group_id);
  const squadMembers = users.filter(u => u.group_id === currentUser.group_id);

  const copyCode = () => {
    navigator.clipboard.writeText(currentUser.personal_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Group Leaderboard data calculation
  const groupScores = groups.map(g => {
    const mems = users.filter(u => u.group_id === g.id);
    const memIds = mems.map(m => m.id);
    const gSubs = submissions.filter(s => memIds.includes(s.user_id) && s.status === 'approved');
    const score = gSubs.reduce((sum, s) => sum + (s.awarded_score || 0), 0) + (mems.length * 50);
    return {
      group: g,
      membersCount: mems.length,
      score,
      completedMissions: gSubs.length
    };
  }).sort((a, b) => b.score - a.score);

  // Individual Leaderboard data calculation
  const individualScores = users.map(u => {
    const uSubs = submissions.filter(s => s.user_id === u.id && s.status === 'approved');
    const score = uSubs.reduce((sum, s) => sum + (s.awarded_score || 0), 0);
    const g = groups.find(gr => gr.id === u.group_id);
    return {
      user: u,
      score,
      groupName: g?.name || 'انفرادی',
      completedMissions: uSubs.length
    };
  }).sort((a, b) => b.score - a.score);

  // Filtered Leaderboard
  const filteredGroups = groupScores.filter(g => 
    g.group.name.includes(searchRanking) || g.group.province.includes(searchRanking)
  );

  const filteredIndividuals = individualScores.filter(i => 
    i.user.first_name.includes(searchRanking) || 
    i.user.last_name.includes(searchRanking) || 
    i.groupName.includes(searchRanking)
  );

  // 7 Stages Roadmap definition
  const stagesList = [
    { id: 's1', title: 'آغاز مسیر', subtitle: 'پذیرش در قرارگاه', status: 'completed', icon: Flag, score: 0 },
    { id: 's2', title: 'معرفت', subtitle: 'شناخت جبهه فکری', status: 'completed', icon: Heart, score: 200 },
    { id: 's3', title: 'آمادگی', subtitle: 'تجهیز به مهارت‌های عملیاتی', status: 'completed', icon: Shield, score: 500 },
    { id: 's4', title: 'خدمت', subtitle: 'عملیات رصد سایبری (جاری)', status: 'in_progress', icon: Flame, score: 1000 },
    { id: 's5', title: 'همراهی', subtitle: 'هم‌افزایی استانی جوخه‌ها', status: 'locked', icon: Users, score: 1800 },
    { id: 's6', title: 'زیارت', subtitle: 'میقات معنوی و اردوی تربیتی', status: 'locked', icon: Sparkles, score: 2500 },
    { id: 's7', title: 'سفیر عشق', subtitle: 'نشان زرین خادمی ملی', status: 'locked', icon: Award, score: 3500 }
  ];

  return (
    <div className={`space-y-5 dir-rtl pb-16 font-sans ${isGirl ? 'girl-theme' : 'boy-theme'}`}>
      
      {/* 1. Tactical Profile Hero Banner with Gender Customization */}
      <div className={`rounded-3xl p-5 md:p-6 relative overflow-hidden border shadow-2xl ${
        isGirl 
          ? 'bg-gradient-to-r from-[#170919] via-[#210c22] to-[#0d0414] border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.25)]' 
          : 'bg-gradient-to-r from-[#070e24] via-[#091538] to-[#040916] border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.25)]'
      }`}>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          
          {/* User Profile Details */}
          <div className="flex items-center gap-4">
            <div className={`relative w-16 h-16 rounded-2xl p-[2px] shadow-lg flex-shrink-0 ${
              isGirl 
                ? 'bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-300' 
                : 'bg-gradient-to-tr from-cyan-400 via-blue-500 to-amber-400'
            }`}>
              <div className="w-full h-full bg-[#050816] rounded-[14px] flex items-center justify-center overflow-hidden">
                {currentUser.avatar_url ? (
                  <img src={currentUser.avatar_url} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className={`font-black text-xl ${isGirl ? 'text-rose-300' : 'text-cyan-300'}`}>
                    {currentUser.first_name[0]}
                  </span>
                )}
              </div>
              <span className={`absolute -bottom-1 -left-1 text-[9px] font-black font-mono px-1.5 py-0.2 rounded-full border border-black ${
                isGirl ? 'bg-rose-500 text-white' : 'bg-amber-400 text-black'
              }`}>
                L3
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base md:text-xl font-black text-white">
                  {currentUser.first_name} {currentUser.last_name}
                </h2>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  isGirl 
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500/50' 
                    : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
                }`}>
                  {rankTitle}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium flex-wrap">
                <span>استان {currentUser.province} - {currentUser.school_name}</span>
                <span>•</span>
                <span>پایه {currentUser.grade} ({currentUser.education_level})</span>
                {userGroup && (
                  <span className="text-amber-300 font-bold">• جوخه {userGroup.name}</span>
                )}
              </div>
            </div>
          </div>

          {/* Actions: Back to Home + Quick Copy 9-Digit Personal Code Card */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => onNavigate('Home')}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-slate-200 hover:text-white hover:border-cyan-500/50 text-xs font-bold transition shadow-md group"
              title="بازگشت به صفحه اصلی"
            >
              <Home size={15} className="text-cyan-400 group-hover:scale-110 transition" />
              <span>صفحه اصلی</span>
            </button>

            <div className="bg-[#050816]/90 border border-slate-700/80 rounded-2xl p-3 flex items-center justify-between gap-4 shadow-inner">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">کد اختصاصی ۹ رقمی رزمنده:</span>
                <span className={`text-base font-black font-mono tracking-widest ${
                  isGirl ? 'text-rose-300' : 'text-cyan-300'
                }`}>
                  {formatToPersianDigits(currentUser.personal_code)}
                </span>
              </div>
              <button
                onClick={copyCode}
                className={`p-2 rounded-xl border transition ${
                  isGirl 
                    ? 'bg-rose-950 text-rose-300 border-rose-600/50 hover:bg-rose-900' 
                    : 'bg-cyan-950 text-cyan-300 border-cyan-600/50 hover:bg-cyan-900'
                }`}
                title="کپی کد اختصاصی"
              >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

        </div>

        {/* Commander Squad Management Trigger */}
        {currentUser.role === 'leader' && (
          <div className="mt-4 pt-3.5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-amber-300 font-bold">
              <Users size={16} className="text-amber-400" />
              <span>فرمانده گرامی، کد دعوت اختصاصی جوخه شما: <strong className="font-mono text-white text-sm bg-slate-900 px-2 py-0.5 rounded border border-amber-500/40">{userGroup?.registration_code || 'WRS-4820'}</strong></span>
            </div>
            <button
              onClick={onOpenSquadModal}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs px-4 py-2 rounded-xl transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-95"
            >
              <Users size={15} />
              <span>مدیریت و اصلاح اعضای جوخه</span>
            </button>
          </div>
        )}

      </div>

      {/* 2. Main Game Categories Bar: آموزش‌ها / جوایز و مدال‌ها / رتبه‌بندی / محتواها و مأموریت‌ها */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-[#05091a] p-1.5 rounded-2xl border border-cyan-500/20 shadow-inner text-xs font-bold">
        <button
          onClick={() => setDashboardCategory('map_missions')}
          className={`py-3 px-2 rounded-xl flex items-center justify-center gap-2 transition ${
            dashboardCategory === 'map_missions'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Compass size={16} />
          <span>نقشه مراحل و مأموریت‌ها</span>
        </button>

        <button
          onClick={() => setDashboardCategory('trainings')}
          className={`py-3 px-2 rounded-xl flex items-center justify-center gap-2 transition ${
            dashboardCategory === 'trainings'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <BookOpen size={16} />
          <span>آموزش‌ها و محتواها</span>
        </button>

        <button
          onClick={() => setDashboardCategory('rewards')}
          className={`py-3 px-2 rounded-xl flex items-center justify-center gap-2 transition ${
            dashboardCategory === 'rewards'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Gift size={16} />
          <span>جوایز و مدال‌ها</span>
        </button>

        <button
          onClick={() => setDashboardCategory('rankings')}
          className={`py-3 px-2 rounded-xl flex items-center justify-center gap-2 transition ${
            dashboardCategory === 'rankings'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Trophy size={16} />
          <span>جدول رتبه‌بندی (دوگانه)</span>
        </button>
      </div>

      {/* 3. DYNAMIC CATEGORY VIEWS */}

      {/* CATEGORY 1: Central Stage Map & Missions Pipeline */}
      {dashboardCategory === 'map_missions' && (
        <div className="space-y-4">
          
          {/* Stage Map Strip Header */}
          <div className="cyber-card-3d p-4 rounded-2xl border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass size={18} className="text-amber-400 animate-spin-slow" />
                <h3 className="text-sm font-black text-white">نقشه مرکزی مراحل رشد (۷ مرحله سفر استراتژیک)</h3>
              </div>
              <button
                onClick={() => onNavigate('Journey')}
                className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1"
              >
                <span>مشاهده نقشه کامل مسیر</span>
                <ChevronLeft size={14} />
              </button>
            </div>

            {/* Visual Interactive Pipeline Horizontal Nodes */}
            <div className="grid grid-cols-7 gap-1 pt-2 overflow-x-auto no-scrollbar">
              {stagesList.map((st, i) => {
                const Icon = st.icon;
                const isCurrent = st.status === 'in_progress';
                const isDone = st.status === 'completed';
                return (
                  <div key={st.id} className="flex flex-col items-center text-center p-2 rounded-xl bg-[#050818] border border-slate-800 relative group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 transition ${
                      isDone 
                        ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                        : isCurrent 
                        ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.8)] animate-pulse' 
                        : 'bg-slate-900 text-slate-500 border border-slate-800'
                    }`}>
                      <Icon size={14} />
                    </div>
                    <span className="text-[10px] font-black text-white truncate max-w-full">{st.title}</span>
                    <span className="text-[8px] text-slate-400 truncate max-w-full">{st.score} ام</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Missions Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target size={18} className="text-cyan-400" />
                <h3 className="text-sm font-black text-white">مأموریت‌های فعال اتاق جنگ</h3>
              </div>
              <button
                onClick={() => onNavigate('Missions')}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>مشاهده فرم ارسال</span>
                <ChevronLeft size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeMissions.map(m => {
                const userSub = userSubmissions.find(s => s.mission_id === m.id);
                return (
                  <div 
                    key={m.id}
                    className="cyber-card-3d rounded-2xl p-4 flex flex-col justify-between space-y-3 transition hover:translate-y-[-2px]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-black bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/40">
                          حداکثر امتیاز: {formatToPersianDigits(m.max_score)}
                        </span>
                        {userSub ? (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            userSub.status === 'approved' 
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                              : userSub.status === 'rejected'
                              ? 'bg-rose-950 text-rose-300 border-rose-800'
                              : 'bg-amber-950 text-amber-300 border-amber-800'
                          }`}>
                            {userSub.status === 'approved' ? 'تأیید شده' : userSub.status === 'rejected' ? 'نیازمند اصلاح' : 'در انتظار داوری'}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-slate-900 text-slate-400 px-2 py-0.5 rounded-full border border-slate-800">
                            آماده ارسال
                          </span>
                        )}
                      </div>

                      <h4 className="font-extrabold text-sm text-white mb-1">{m.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{m.description}</p>
                    </div>

                    <button
                      onClick={() => onNavigate('Missions')}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-slate-950 font-black text-xs py-2.5 rounded-xl transition shadow-md flex items-center justify-center gap-1.5"
                    >
                      <span>{userSub ? 'مشاهده و ویرایش پاسخ ارسال‌شده' : 'بارگذاری پاسخ مأموریت'}</span>
                      <ChevronLeft size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* CATEGORY 2: Trainings & Educational Content */}
      {dashboardCategory === 'trainings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-cyan-400" />
              <h3 className="text-sm font-black text-white">دوره‌های آموزشی و محتوای استراتژیک</h3>
            </div>
            <button
              onClick={() => onNavigate('Trainings')}
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300"
            >
              مشاهده کتابخانه جامع
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="cyber-card-3d p-4 rounded-2xl space-y-2">
              <div className="h-28 rounded-xl bg-slate-900 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80" 
                  alt="دوره" 
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-slate-950/80 text-[10px] text-cyan-300 px-2 py-0.5 rounded font-mono">۴ جلسه</span>
              </div>
              <h4 className="text-xs font-black text-white">مبانی امنیت شبکه و دفاع سایبری</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">آشنایی با پروتکل‌های رمزگذاری و پدافند در فضای مجازی.</p>
              <button onClick={() => onNavigate('Trainings')} className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                مشاهده دوره
              </button>
            </div>

            <div className="cyber-card-3d p-4 rounded-2xl space-y-2">
              <div className="h-28 rounded-xl bg-slate-900 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80" 
                  alt="دوره" 
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-slate-950/80 text-[10px] text-cyan-300 px-2 py-0.5 rounded font-mono">۶ جلسه</span>
              </div>
              <h4 className="text-xs font-black text-white">تحلیل سناریوهای اتاق جنگ و تصمیم‌گیری</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">تکنیک‌های مدیریت زمان و تصمیم‌گیری تحت فشار عملیاتی.</p>
              <button onClick={() => onNavigate('Trainings')} className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                مشاهده دوره
              </button>
            </div>

            <div className="cyber-card-3d p-4 rounded-2xl space-y-2">
              <div className="h-28 rounded-xl bg-slate-900 overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=80" 
                  alt="دوره" 
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 right-2 bg-slate-950/80 text-[10px] text-cyan-300 px-2 py-0.5 rounded font-mono">۳ جلسه</span>
              </div>
              <h4 className="text-xs font-black text-white">روایت فتح و رسانه‌های نوین</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">ساخت پادکست، کلیپ مستند و موشن گرافیک تأثیرگذار.</p>
              <button onClick={() => onNavigate('Trainings')} className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                مشاهده دوره
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 3: Rewards & Medals */}
      {dashboardCategory === 'rewards' && (
        <div className="space-y-4">
          <div className="cyber-card-3d p-5 rounded-3xl border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-black text-sm">
              <Trophy size={20} />
              <span>جوایز نقدی و هدایای مسابقات کشوری</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              جوخه‌های برتر کشوری بر اساس جدول رتبه‌بندی نهایی، علاوه بر دریافت لوح تقدیر رسمی ستاد و مدال‌های طلا، نقره و برنز، از جوایز نقدی و تجهیزات فناوری بهره‌مند می‌شوند.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-[#050818] p-3 rounded-2xl border border-amber-500/40 text-center space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">جوخه رتبه اول</span>
                <span className="text-amber-400 font-black text-sm block">۲۰ میلیون تومان</span>
                <span className="text-[9px] text-slate-400">+ مدال طلای نخبگی</span>
              </div>
              <div className="bg-[#050818] p-3 rounded-2xl border border-slate-700 text-center space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">جوخه رتبه دوم</span>
                <span className="text-slate-200 font-black text-sm block">۱۵ میلیون تومان</span>
                <span className="text-[9px] text-slate-400">+ مدال نقره افتخار</span>
              </div>
              <div className="bg-[#050818] p-3 rounded-2xl border border-slate-700 text-center space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">جوخه رتبه سوم</span>
                <span className="text-amber-600 font-black text-sm block">۱۰ میلیون تومان</span>
                <span className="text-[9px] text-slate-400">+ مدال برنز شجاعت</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 4: Dual Leaderboard (Group vs. Individual Rankings) */}
      {dashboardCategory === 'rankings' && (
        <div className="space-y-4">
          
          {/* Dual Toggle Bar & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#05091a] p-2 rounded-2xl border border-cyan-500/20">
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                onClick={() => setRankingMode('groups')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition ${
                  rankingMode === 'groups'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                رتبه‌بندی جوخه‌ها (تیمی)
              </button>
              <button
                onClick={() => setRankingMode('individuals')}
                className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition ${
                  rankingMode === 'individuals'
                    ? 'bg-cyan-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                رتبه‌بندی رزمندگان (انفرادی)
              </button>
            </div>

            {/* Search filter */}
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute right-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="جستجوی نام جوخه یا رزمنده..."
                value={searchRanking}
                onChange={(e) => setSearchRanking(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-8 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* GROUPS LEADERBOARD TABLE */}
          {rankingMode === 'groups' && (
            <div className="cyber-card-3d rounded-2xl overflow-hidden border border-amber-500/30">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#050818] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">رتبه</th>
                      <th className="p-3">نام جوخه</th>
                      <th className="p-3">استان</th>
                      <th className="p-3">تعداد اعضا</th>
                      <th className="p-3">مأموریت‌های انجام‌شده</th>
                      <th className="p-3 text-left">امتیاز کل جوخه</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredGroups.map((item, idx) => (
                      <tr key={item.group.id} className="hover:bg-slate-900/50 transition">
                        <td className="p-3 font-mono font-black">
                          {idx === 0 ? <span className="text-amber-400 font-bold">🥇 ۱</span> :
                           idx === 1 ? <span className="text-slate-300 font-bold">🥈 ۲</span> :
                           idx === 2 ? <span className="text-amber-600 font-bold">🥉 ۳</span> :
                           <span className="text-slate-400">{formatToPersianDigits(idx + 1)}</span>}
                        </td>
                        <td className="p-3 font-extrabold text-white">{item.group.name}</td>
                        <td className="p-3 text-slate-300">{item.group.province}</td>
                        <td className="p-3 font-mono text-slate-300">{formatToPersianDigits(item.membersCount)} نفر</td>
                        <td className="p-3 font-mono text-cyan-300">{formatToPersianDigits(item.completedMissions)}</td>
                        <td className="p-3 text-left font-mono font-black text-amber-300 text-sm">
                          {formatToPersianDigits(item.score)} <span className="text-[10px] text-slate-400 font-sans">امتیاز</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* INDIVIDUALS LEADERBOARD TABLE */}
          {rankingMode === 'individuals' && (
            <div className="cyber-card-3d rounded-2xl overflow-hidden border border-cyan-500/30">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#050818] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">رتبه</th>
                      <th className="p-3">نام و نام خانوادگی</th>
                      <th className="p-3">جوخه</th>
                      <th className="p-3">استان / مدرسه</th>
                      <th className="p-3">مقطع</th>
                      <th className="p-3 text-left">امتیاز انفرادی</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredIndividuals.map((item, idx) => (
                      <tr key={item.user.id} className="hover:bg-slate-900/50 transition">
                        <td className="p-3 font-mono font-black">
                          {idx === 0 ? <span className="text-cyan-400 font-bold">🥇 ۱</span> :
                           idx === 1 ? <span className="text-slate-300 font-bold">🥈 ۲</span> :
                           idx === 2 ? <span className="text-amber-600 font-bold">🥉 ۳</span> :
                           <span className="text-slate-400">{formatToPersianDigits(idx + 1)}</span>}
                        </td>
                        <td className="p-3 font-extrabold text-white">
                          {item.user.first_name} {item.user.last_name}
                        </td>
                        <td className="p-3 text-amber-300 font-bold">{item.groupName}</td>
                        <td className="p-3 text-slate-300">{item.user.province} - {item.user.school_name}</td>
                        <td className="p-3 text-slate-400">{item.user.education_level} (پایه {item.user.grade})</td>
                        <td className="p-3 text-left font-mono font-black text-cyan-300 text-sm">
                          {formatToPersianDigits(item.score)} <span className="text-[10px] text-slate-400 font-sans">امتیاز</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* 4. BOTTOM NOTIFICATION & TICKER BAR (Neatly positioned at the bottom as requested) */}
      <div className="bg-[#060a1c] border border-cyan-500/30 rounded-2xl p-3.5 space-y-2 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Megaphone size={16} className="text-amber-400 animate-pulse" />
            <h3 className="text-xs font-black text-white">نوار اعلانات و پیام‌های ستاد مرکزی</h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">بروزرسانی لحظه‌ای</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {announcements.filter(a => a.is_active).slice(0, 2).map(a => (
            <div key={a.id} className="bg-[#030612] p-2.5 rounded-xl border border-slate-800/80 flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0 animate-ping" />
              <div>
                <span className="font-bold text-cyan-300 block">{a.title}</span>
                <p className="text-[11px] text-slate-300 leading-snug mt-0.5 line-clamp-1">{a.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
