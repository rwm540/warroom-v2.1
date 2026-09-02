import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Flame, 
  ArrowLeft, 
  Sparkles, 
  Lock, 
  Layers, 
  ChevronRight,
  UserPlus,
  LogIn,
  CheckCircle2
} from 'lucide-react';
import warroomLogoJpg from '../assets/images/warroom_logo_1787906676836.jpg';

interface PortalSelectorViewProps {
  onSelectWarRoom: (mode?: 'login' | 'register') => void;
  onBackToHome: () => void;
  isGirls?: boolean;
}

export default function PortalSelectorView({
  onSelectWarRoom,
  onBackToHome,
  isGirls = false
}: PortalSelectorViewProps) {
  return (
    <div className="h-screen max-h-screen bg-[#040818] text-slate-100 flex flex-col justify-between p-3 sm:p-5 relative overflow-hidden dir-rtl font-sans select-none">
      
      {/* Background Atmosphere Lights */}
      <div className={`absolute top-0 right-1/2 translate-x-1/2 w-full max-w-2xl h-96 blur-[150px] rounded-full pointer-events-none ${
        isGirls ? 'bg-pink-600/20' : 'bg-red-600/15'
      }`} />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-amber-600/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Top Header Bar with BACK BUTTON */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between py-2 border-b border-slate-800/80 relative z-10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative p-1 rounded-xl neon-logo-glow">
            <img 
              src={warroomLogoJpg} 
              alt="لوگوی اتاق جنگ" 
              referrerPolicy="no-referrer"
              className="w-9 h-9 sm:w-10 sm:h-10 object-cover rounded-xl border border-white/20 shadow-md"
            />
          </div>
          <div className="text-right">
            <h1 className="text-sm sm:text-base font-black text-white tracking-tight">سامانه جامع انتخاب بازی</h1>
            <p className="text-[10px] sm:text-xs text-cyan-400 font-semibold">درگاه‌های رسمی بازی اتاق جنگ</p>
          </div>
        </div>

        {/* Back Button to Home */}
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-white hover:border-cyan-500/50 text-xs font-bold transition shadow-md group"
        >
          <ChevronRight size={15} className="group-hover:translate-x-1 transition" />
          <span>بازگشت به صفحه اصلی</span>
        </button>
      </div>

      {/* Main Body Area */}
      <div className="max-w-2xl mx-auto w-full my-auto py-2 relative z-10 space-y-4 text-center">
        
        {/* Title & Subtitle Badge */}
        <div className="space-y-1.5 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Layers size={13} className="animate-spin-slow text-cyan-400" />
            <span>درگاه‌های بازی و عملیات</span>
          </div>

          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-snug drop-shadow-md">
            درگاه مورد نظر خود را برای ورود یا ثبت‌نام انتخاب کنید
          </h2>
        </div>

        {/* Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right max-w-2xl mx-auto">
          
          {/* PRIMARY ACTIVE PORTAL: WAR ROOM (اتاق جنگ) */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl p-[1.5px] transition-all duration-300 ${
              isGirls
                ? 'bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-600 shadow-[0_0_25px_rgba(244,63,94,0.3)]'
                : 'bg-gradient-to-br from-red-500 via-amber-400 to-rose-600 shadow-[0_0_25px_rgba(220,38,38,0.3)]'
            }`}
          >
            <div className="h-full bg-gradient-to-br from-[#0c122e] via-[#090e24] to-[#130d29] p-4 sm:p-5 rounded-[21px] sm:rounded-[23px] flex flex-col justify-between space-y-3 sm:space-y-4 relative">
              
              {/* Top Row: Active Status Tag + Icon */}
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition duration-300 shadow-md ${
                  isGirls 
                    ? 'bg-pink-950/80 border border-pink-500/50 text-pink-400 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                    : 'bg-red-950/80 border border-red-500/50 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                }`}>
                  <Flame size={22} className="animate-pulse text-amber-400" />
                </div>

                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 text-[10px] font-black flex items-center gap-1 shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  فعال - آماده ورود
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Shield size={16} className={isGirls ? 'text-pink-400' : 'text-amber-400'} />
                  <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition">
                    اتاق جنگ
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  سامانه ارزیابی استراتژیک، ثبت‌نام انفرادی و گروهی، مسابقات هوشمند آنلاین و ماموریت‌های عملیاتی.
                </p>
              </div>

              {/* Enter Actions: Register and Login */}
              <div className="pt-2.5 border-t border-slate-800/80">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectWarRoom('register')}
                    className={`py-1.5 px-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition shadow-md ${
                      isGirls
                        ? 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500'
                        : 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 hover:from-cyan-400 hover:to-teal-400'
                    }`}
                  >
                    <UserPlus size={13} />
                    <span>ثبت‌نام جدید</span>
                  </button>

                  <button
                    onClick={() => onSelectWarRoom('login')}
                    className="py-1.5 px-2.5 rounded-xl text-xs font-bold bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700/80 flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <LogIn size={13} />
                    <span>ورود به حساب</span>
                  </button>
                </div>
              </div>

            </div>
          </motion.div>

          {/* INACTIVE BLACK CARDS (Locked future games) */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-[1px] bg-slate-900/40 opacity-50 min-h-[180px] sm:min-h-[200px] flex flex-col">
            <div className="h-full bg-[#02040a] p-4 sm:p-5 rounded-[21px] sm:rounded-[23px] flex flex-col items-center justify-center border border-slate-900/80 shadow-inner space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#050814] border border-slate-800/80 flex items-center justify-center text-slate-600">
                <Lock size={18} />
              </div>
              <span className="text-xs font-bold text-slate-500">درگاه بازی ۲ (به‌زودی)</span>
              <p className="text-[10px] text-slate-600 text-center max-w-[160px]">در فازهای بعدی رویداد بازگشایی خواهد شد.</p>
            </div>
          </div>

        </div>

      </div>

      {/* Footer Info */}
      <div className="max-w-4xl mx-auto w-full py-2 border-t border-slate-800/80 text-center text-xs text-slate-400 font-medium relative z-10 flex items-center justify-between shrink-0">
        <span>قرارگاه مرکزی سامانه استراتژیک</span>
        <span className="text-[11px] text-slate-500">پشتیبانی: <span className="font-mono text-cyan-400 dir-ltr font-bold">۰۲۱-۸۸۹۹۷۷۶۶</span></span>
      </div>

    </div>
  );
}
