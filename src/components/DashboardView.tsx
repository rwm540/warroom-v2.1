import React from 'react';
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
  Newspaper
} from 'lucide-react';
import { User, Group, Mission, MissionSubmission, Announcement, News } from '../types';
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
  const [copied, setCopied] = React.useState(false);

  // Null check safety for non-logged in guests
  if (!currentUser) {
    return (
      <div className="dir-rtl max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-600/60 flex items-center justify-center text-red-400 mx-auto shadow-[0_0_20px_rgba(220,38,38,0.3)]">
          <ShieldAlert size={32} className="animate-pulse" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white">ورود به بخش اتاق جنگ</h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
            برای مشاهده کامل داشبورد، ثبت مأموریت‌ها و آمار عملیاتی لطفاً ابتدا وارد حساب کاربری خود شوید یا در صفحه اصلی ثبت‌نام کنید.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('Journey')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs shadow-[0_0_15px_rgba(245,158,11,0.4)] transition"
          >
            مشاهده مسیر بازی‌ها و مراحل اتاق جنگ
          </button>
        </div>
      </div>
    );
  }

  // User rank label calculation
  const rankTitle = currentUser.role === 'leader' ? 'فرمانده ارشد جوخه' : 'رزمنده جنگ استراتژیک';

  // Calculate user total approved score
  const userSubmissions = submissions.filter(s => s.user_id === currentUser.id);
  const totalScore = userSubmissions
    .filter(s => s.status === 'approved')
    .reduce((acc, curr) => acc + (curr.awarded_score || 0), 0);

  // Active main missions count
  const activeMissions = missions.filter(m => m.is_active);

  // Squad details if user belongs to a group
  const userGroup = groups.find(g => g.id === currentUser.group_id);
  const squadMembers = users.filter(u => u.group_id === currentUser.group_id);

  const copyCode = () => {
    navigator.clipboard.writeText(currentUser.personal_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 dir-rtl pb-8">
      
      {/* 1. Tactical Welcome Banner / User Profile Hero */}
      <div className="cyber-card-3d rounded-2xl p-5 md:p-6 relative overflow-hidden">
        
        {/* Background glow & subtle radar scan line */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          
          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-rose-600 p-[1px] shadow-[0_0_20px_rgba(34,211,238,0.4)] flex-shrink-0">
              <div className="w-full h-full bg-[#070b1a] rounded-[15px] flex items-center justify-center text-cyan-300 font-extrabold text-xl">
                {currentUser.first_name[0]}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg md:text-xl font-black text-white">
                  {currentUser.first_name} {currentUser.last_name}
                </h2>
                <span className="bg-cyan-950/80 text-cyan-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                  {rankTitle}
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-slate-300 mt-1 font-medium flex-wrap">
                <span>استان {currentUser.province} - {currentUser.school_name}</span>
                <span>•</span>
                <span>پایه {currentUser.grade} ({currentUser.education_level})</span>
              </div>
            </div>
          </div>

          {/* Quick Copy 9-Digit Personal Code Card */}
          <div className="bg-[#05091a] border border-cyan-500/30 rounded-xl p-3 flex items-center justify-between gap-4 shadow-inner">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">کد اختصاصی ۹ رقمی رزمنده:</span>
              <span className="text-base font-black text-cyan-400 font-mono tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
                {formatToPersianDigits(currentUser.personal_code)}
              </span>
            </div>
            <button
              onClick={copyCode}
              className="bg-cyan-950 hover:bg-cyan-900 text-cyan-300 p-2 rounded-lg border border-cyan-500/40 transition"
              title="کپی کد اختصاصی"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            </button>
          </div>

        </div>

        {/* Commander Special Squad Management Trigger */}
        {currentUser.role === 'leader' && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-red-300 font-bold">
              <Users size={16} className="text-red-400" />
              <span>فرمانده محترم، شما سرگروه {userGroup ? `"${userGroup.name}"` : 'جوخه'} هستید.</span>
            </div>
            <button
              onClick={onOpenSquadModal}
              className="w-full sm:w-auto bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white font-black text-xs px-4 py-2 rounded-xl transition shadow-[0_0_15px_rgba(220,38,38,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Users size={15} />
              <span>مدیریت رزمندگان جوخه (افزودن / ویرایش اعضا)</span>
            </button>
          </div>
        )}

      </div>

      {/* 2. Key Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        
        {/* Total Score */}
        <div className="cyber-card-3d p-4 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
            <Award size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">مجموع امتیازات تأییدشده</span>
            <span className="text-base font-black text-amber-300 font-mono">
              {formatToPersianDigits(totalScore)} <span className="text-xs font-sans text-slate-500">امتیاز</span>
            </span>
          </div>
        </div>

        {/* Active Missions */}
        <div className="cyber-card-3d p-4 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-800/50 flex items-center justify-center text-red-400 flex-shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
            <Target size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">مأموریت‌های اصلی فعال</span>
            <span className="text-base font-black text-red-400 font-mono">
              {formatToPersianDigits(activeMissions.length)} <span className="text-xs font-sans text-slate-500">مأموریت</span>
            </span>
          </div>
        </div>

        {/* Approved Submissions */}
        <div className="cyber-card-3d p-4 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">مأموریت‌های موفق شما</span>
            <span className="text-base font-black text-emerald-300 font-mono">
              {formatToPersianDigits(userSubmissions.filter(s => s.status === 'approved').length)}
            </span>
          </div>
        </div>

        {/* Pending Submissions */}
        <div className="cyber-card-3d p-4 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-950/60 border border-blue-800/50 flex items-center justify-center text-blue-400 flex-shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">در انتظار ارزیابی داور</span>
            <span className="text-base font-black text-blue-300 font-mono">
              {formatToPersianDigits(userSubmissions.filter(s => s.status === 'pending').length)}
            </span>
          </div>
        </div>

      </div>

      {/* 3. Commander Squad Progress Section (If Commander / Leader) */}
      {(currentUser.role === 'leader' || currentUser.role === 'member') && userGroup && (
        <div className="bg-[#080d21] border border-red-900/40 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Users className="text-red-400" size={18} />
              <h3 className="text-sm font-black text-white">
                وضعیت آمادگی و مشارکت جوخه: <span className="text-red-400">{userGroup.name}</span>
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-bold">
              تعداد اعضای جوخه: <span className="text-white font-mono">{formatToPersianDigits(squadMembers.length)} نفر</span>
            </span>
          </div>

          {/* Progress per active mission */}
          <div className="space-y-3">
            {activeMissions.map(m => {
              // Count how many squad members have submitted for this mission
              const squadMemberIds = squadMembers.map(sm => sm.id);
              const submittedMemberIds = new Set(
                submissions
                  .filter(s => s.mission_id === m.id && squadMemberIds.includes(s.user_id))
                  .map(s => s.user_id)
              );
              const totalSquad = squadMembers.length || 1;
              const submittedCount = submittedMemberIds.size;
              const progressPct = Math.round((submittedCount / totalSquad) * 100);

              return (
                <div key={m.id} className="bg-slate-950/80 border border-slate-800 p-3 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-200">{m.title}</span>
                    <span className="text-red-400 font-mono">{formatToPersianDigits(progressPct)}٪ پیشرفت</span>
                  </div>

                  <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="bg-gradient-to-r from-red-800 to-red-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      ارسال‌شده توسط <strong className="text-slate-200 font-mono">{formatToPersianDigits(submittedCount)}</strong> از <strong className="text-slate-200 font-mono">{formatToPersianDigits(totalSquad)}</strong> عضو جوخه
                    </span>
                    {progressPct === 100 ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 size={13} /> تمام اعضا ارسال کردند
                      </span>
                    ) : (
                      <span className="text-amber-400 font-bold">در حال پیگیری...</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Active Main Missions List Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-red-400" />
            <h3 className="text-sm font-black text-white">مأموریت‌های عملیاتی اصلی در جریان</h3>
          </div>
          <button
            onClick={() => onNavigate('Missions')}
            className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 transition"
          >
            <span>مشاهده همه مأموریت‌ها</span>
            <ChevronLeft size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeMissions.slice(0, 2).map(m => {
            const userSub = userSubmissions.find(s => s.mission_id === m.id);
            return (
              <div 
                key={m.id}
                className="bg-[#080d21] border border-slate-800 hover:border-red-900/60 rounded-xl p-4 transition shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-800/60">
                      سقف امتیاز: {formatToPersianDigits(m.max_score)}
                    </span>
                    {userSub ? (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        userSub.status === 'approved' 
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                          : userSub.status === 'rejected'
                          ? 'bg-red-950 text-red-300 border-red-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}>
                        {userSub.status === 'approved' ? 'تأیید شده' : userSub.status === 'rejected' ? 'نیازمند اصلاح' : 'در انتظار داوری'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                        هنوز ارسال نشده
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-sm text-white mb-1.5">{m.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">{m.description}</p>
                </div>

                <button
                  onClick={() => onNavigate('Missions')}
                  className="w-full bg-slate-900 hover:bg-red-950/80 text-slate-200 hover:text-white border border-slate-800 hover:border-red-700 text-xs font-bold py-2 rounded-lg transition text-center"
                >
                  {userSub ? 'مشاهده / جایگزینی پاسخ' : 'ورود به مأموریت و بارگذاری فایل'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Announcements & Operational News Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Operational Banners / Announcements */}
        <div className="bg-[#080d21] border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Megaphone size={16} className="text-amber-400" />
            <h3 className="text-xs font-black text-white">اطلاعیه‌های فوری ستاد فرماندهی</h3>
          </div>

          <div className="space-y-2.5">
            {announcements.filter(a => a.is_active).map(a => (
              <div key={a.id} className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-lg space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                  <span>{a.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{a.created_at}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{a.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Operational News */}
        <div className="bg-[#080d21] border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <Newspaper size={16} className="text-blue-400" />
            <h3 className="text-xs font-black text-white">اخبار و رویدادهای اتاق جنگ</h3>
          </div>

          <div className="space-y-2.5">
            {news.filter(n => n.is_active).map(n => (
              <div key={n.id} className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-lg space-y-1">
                <div className="flex items-center justify-between text-xs font-bold text-blue-300">
                  <span>{n.title}</span>
                  <span className="text-[10px] bg-blue-950 text-blue-400 px-1.5 py-0.2 rounded font-mono">{n.category}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">{n.description}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
