import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Flame, 
  ArrowLeft, 
  Sparkles, 
  Lock, 
  BookOpen, 
  Layers, 
  Compass, 
  X,
  ChevronLeft,
  Users,
  Award
} from 'lucide-react';

interface PortalSelectorViewProps {
  onSelectWarRoom: () => void;
  onBackToHome: () => void;
}

export default function PortalSelectorView({
  onSelectWarRoom,
  onBackToHome
}: PortalSelectorViewProps) {
  return (
    <div className="min-h-screen bg-[#05091a] text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-hidden dir-rtl font-sans">
      
      {/* Background Atmosphere Lights */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-full max-w-2xl h-96 bg-red-600/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-amber-600/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Top Header Bar */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pt-2 pb-6 border-b border-cyan-500/20 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 via-amber-500 to-red-700 p-[1px] shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            <div className="w-full h-full bg-[#080e26] rounded-[15px] flex items-center justify-center text-red-500">
              <Shield size={22} className="animate-pulse" />
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-sm sm:text-base font-black text-white tracking-tight">سامانه جامع ملی</h1>
            <p className="text-[10px] sm:text-xs text-cyan-400 font-mono font-semibold">NATIONAL PORTAL SELECTION</p>
          </div>
        </div>

        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-white hover:border-cyan-500/50 text-xs font-bold transition shadow-md"
        >
          <X size={16} />
          <span>بازگشت به صفحه اصلی</span>
        </button>
      </div>

      {/* Main Body Area */}
      <div className="max-w-3xl mx-auto w-full my-auto py-8 relative z-10 space-y-8 text-center">
        
        {/* Title & Subtitle Badge */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Layers size={14} className="animate-spin-slow" />
            <span>منوی ورود و انتخاب بخش‌های سامانه</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-snug">
            درگاه مورد نظر خود را برای ورود یا ثبت‌نام انتخاب کنید
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            جهت دسترسی به بخش‌های مختلف، روی منوی مربوطه کلیک کنید. در حال حاضر درگاه اصلی «اتاق جنگ» فعال می‌باشد.
          </p>
        </div>

        {/* Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right pt-2">
          
          {/* PRIMARY ACTIVE PORTAL: WAR ROOM (اتاق جنگ) */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelectWarRoom}
            className="group relative cursor-pointer overflow-hidden rounded-3xl p-[1.5px] bg-gradient-to-br from-red-500 via-amber-400 to-rose-600 shadow-[0_0_30px_rgba(220,38,38,0.35)] transition-all duration-300"
          >
            <div className="h-full bg-gradient-to-br from-[#0c122e] via-[#090e24] to-[#130d29] p-5 sm:p-6 rounded-[23px] flex flex-col justify-between space-y-5 relative">
              
              {/* Top Row: Active Status Tag + Icon */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400 group-hover:scale-110 transition duration-300 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                  <Flame size={26} className="animate-pulse text-amber-400" />
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 text-[10px] font-black flex items-center gap-1 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  فعال - درگاه آماده ورود
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-amber-400" />
                  <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-amber-300 transition">
                    اتاق جنگ
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  سامانه ارزیابی استراتژیک، ثبت‌نام انفرادی و جوخه‌ای، مسابقات هوشمند آنلاین، ماموریت‌های عملیاتی و مدیریت فرماندهی.
                </p>
              </div>

              {/* Enter Action Button */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                <span className="text-[11px] font-bold text-amber-400 group-hover:underline">
                  ورود یا ثبت‌نام در اتاق جنگ
                </span>
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold group-hover:translate-x-[-4px] transition shadow-[0_0_12px_rgba(245,158,11,0.6)]">
                  <ArrowLeft size={20} />
                </div>
              </div>

            </div>
          </motion.div>

          {/* INACTIVE BLACK CARDS (No text, pure black placeholder cards) */}
          <div className="relative overflow-hidden rounded-3xl p-[1px] bg-slate-900/30 opacity-40 min-h-[180px] sm:min-h-[220px]">
            <div className="h-full bg-[#02040a] p-5 sm:p-6 rounded-[23px] flex flex-col items-center justify-center border border-slate-900/80 shadow-inner">
              <div className="w-10 h-10 rounded-2xl bg-[#050814] border border-slate-900 flex items-center justify-center text-slate-800">
                <Lock size={20} />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl p-[1px] bg-slate-900/30 opacity-40 min-h-[180px] sm:min-h-[220px]">
            <div className="h-full bg-[#02040a] p-5 sm:p-6 rounded-[23px] flex flex-col items-center justify-center border border-slate-900/80 shadow-inner">
              <div className="w-10 h-10 rounded-2xl bg-[#050814] border border-slate-900 flex items-center justify-center text-slate-800">
                <Lock size={20} />
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl p-[1px] bg-slate-900/30 opacity-40 min-h-[180px] sm:min-h-[220px]">
            <div className="h-full bg-[#02040a] p-5 sm:p-6 rounded-[23px] flex flex-col items-center justify-center border border-slate-900/80 shadow-inner">
              <div className="w-10 h-10 rounded-2xl bg-[#050814] border border-slate-900 flex items-center justify-center text-slate-800">
                <Lock size={20} />
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Footer Info */}
      <div className="max-w-3xl mx-auto w-full pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400 font-medium relative z-10">
        قرارگاه مرکزی سامانه استراتژیک | پشتیبانی ۲۴ ساعته: <span className="font-mono text-cyan-300 dir-ltr font-bold">۰۲۱-۸۸۹۹۷۷۶۶</span>
      </div>

    </div>
  );
}
