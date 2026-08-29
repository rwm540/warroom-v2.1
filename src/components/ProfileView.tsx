import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Award, 
  Copy, 
  Check, 
  Users, 
  ShieldCheck, 
  Phone, 
  IdCard, 
  MapPin, 
  School, 
  Calendar,
  Lock,
  Home,
  ArrowLeft
} from 'lucide-react';
import { User, Group, Medal, UserMedal } from '../types';
import { formatToPersianDigits } from '../utils/jalali';

interface ProfileViewProps {
  currentUser: User;
  groups: Group[];
  medals: Medal[];
  userMedals: UserMedal[];
  onNavigate?: (tab: string) => void;
}

export default function ProfileView({
  currentUser,
  groups,
  medals,
  userMedals,
  onNavigate
}: ProfileViewProps) {
  const [copied, setCopied] = useState(false);

  if (!currentUser) {
    return (
      <div className="dir-rtl max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-950/80 border border-amber-600/60 flex items-center justify-center text-amber-400 mx-auto shadow-[0_0_20px_rgba(245,158,11,0.3)]">
          <UserIcon size={32} />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white">شناسنامه و مدال‌های رزمنده</h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
            برای مشاهده آمار انفرادی، کد ۹ رقمی اختصاصی و مدال‌های کسب شده، ابتدا وارد حساب کاربری خود شوید.
          </p>
        </div>
      </div>
    );
  }

  // Filter medals earned by this user via personal_code
  const earnedUserMedals = userMedals.filter(um => um.personal_code === currentUser.personal_code);
  const earnedMedalIds = new Set(earnedUserMedals.map(um => um.medal_id));

  // User Squad if any
  const userGroup = groups.find(g => g.id === currentUser.group_id);

  const copyCode = () => {
    navigator.clipboard.writeText(currentUser.personal_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 dir-rtl pb-8">
      
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
            <UserIcon className="text-red-500" size={24} />
            پروفایل رزمنده و ویترین مدال‌های افتخار
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            مشخصات ثبتی، اطلاعات جوخه و نشان‌های اعطا شده توسط ستاد اتاق جنگ
          </p>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('Home')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 hover:text-white hover:border-red-500/50 text-xs font-bold transition shadow-md group shrink-0"
          >
            <Home size={14} className="text-red-400 group-hover:scale-110 transition" />
            <span>بازگشت به صفحه اصلی</span>
            <ArrowLeft size={14} className="text-slate-400" />
          </button>
        )}
      </div>

      {/* Top Personal Profile Card */}
      <div className="bg-[#080d21] border border-slate-800 rounded-2xl p-5 md:p-6 space-y-6 shadow-lg">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-4 text-center sm:text-right">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-black p-[1px] shadow-[0_0_20px_rgba(220,38,38,0.4)] flex-shrink-0">
              <div className="w-full h-full bg-[#050816] rounded-[15px] flex items-center justify-center text-red-400 font-extrabold text-2xl">
                {currentUser.first_name[0]}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black text-white">
                {currentUser.first_name} {currentUser.last_name}
              </h3>
              <p className="text-xs text-red-400 font-bold mt-0.5">
                {currentUser.role === 'leader' ? 'فرمانده ارشد جوخه' : currentUser.role === 'member' ? 'عضو جوخه عملیاتی' : 'رزمنده انفرادی'}
              </p>
            </div>
          </div>

          {/* 9-Digit Personal Code Card */}
          <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center gap-4">
            <div>
              <span className="text-[10px] text-slate-500 font-bold block">کد اختصاصی ۹ رقمی:</span>
              <span className="text-base font-black text-red-400 font-mono tracking-widest">
                {formatToPersianDigits(currentUser.personal_code)}
              </span>
            </div>
            <button
              onClick={copyCode}
              className="bg-slate-900 hover:bg-slate-800 text-slate-300 p-2 rounded-lg border border-slate-700 transition"
              title="کپی کد اختصاصی"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold block mb-1">کد ملی ۱۰ رقمی:</span>
            <span className="font-mono text-slate-200 font-bold">{currentUser.national_code}</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold block mb-1">شماره تماس:</span>
            <span className="font-mono text-slate-200 font-bold">{currentUser.phone}</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold block mb-1">استان و شهر:</span>
            <span className="text-slate-200 font-bold">{currentUser.province} - {currentUser.city}</span>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-bold block mb-1">مدرسه و پایه:</span>
            <span className="text-slate-200 font-bold">{currentUser.school_name} ({currentUser.grade})</span>
          </div>

        </div>

        {/* Squad Details Banner if Squad Member */}
        {userGroup && (
          <div className="bg-red-950/20 border border-red-900/60 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Users className="text-red-400" size={24} />
              <div>
                <h4 className="text-xs font-black text-white">
                  عضویت در جوخه: <span className="text-red-400">{userGroup.name}</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  مقطع {userGroup.education_level} | استان {userGroup.province} - {userGroup.city}
                </p>
              </div>
            </div>

            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono">
              کد ثبت‌نام جوخه: <strong className="text-red-400">{userGroup.registration_code}</strong>
            </div>
          </div>
        )}

      </div>

      {/* Medals & Honors Showcase Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Award className="text-amber-400" size={20} />
            <h3 className="text-sm font-black text-white">ویترین نشان‌ها و مدال‌های افتخار کسب‌شده</h3>
          </div>
          <span className="text-xs text-amber-400 font-bold font-mono">
            {formatToPersianDigits(earnedUserMedals.length)} از {formatToPersianDigits(medals.length)} نشان کسب شده
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {medals.map(m => {
            const isEarned = earnedMedalIds.has(m.id);
            const userMedalRecord = earnedUserMedals.find(um => um.medal_id === m.id);

            return (
              <div
                key={m.id}
                className={`p-4 rounded-xl border transition shadow-md flex items-start gap-3 relative overflow-hidden ${
                  isEarned
                    ? 'bg-[#0b122b] border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                    : 'bg-[#060917] border-slate-800 opacity-60'
                }`}
              >
                {/* Medal Icon Badge */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 border ${
                  isEarned ? 'bg-amber-950/80 border-amber-500 text-amber-300' : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}>
                  {m.image || '🎖️'}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className={`font-black text-xs ${isEarned ? 'text-amber-300' : 'text-slate-400'}`}>
                      {m.name}
                    </h4>
                    {!isEarned && <Lock size={12} className="text-slate-600" />}
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">{m.description}</p>

                  {isEarned && userMedalRecord && (
                    <div className="pt-2 border-t border-amber-900/40 text-[10px] space-y-0.5">
                      {userMedalRecord.note && (
                        <p className="text-amber-200/90 italic">«{userMedalRecord.note}»</p>
                      )}
                      <p className="text-slate-400 font-mono">اهدا شده در: {userMedalRecord.awarded_at}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
