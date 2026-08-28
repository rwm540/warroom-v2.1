import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Heart, 
  Zap, 
  ArrowLeft, 
  Shield, 
  LogIn,
  UserPlus,
  Flame,
  CheckCircle2,
  Lock,
  Compass,
  Star
} from 'lucide-react';
import warroomLogoJpg from '../assets/images/warroom_logo_1787906676836.jpg';

interface CampaignSelectScreenProps {
  onSelectCampaign: (campaign: 'girls' | 'boys', mode: 'login' | 'register') => void;
  onDirectLogin: () => void;
}

export default function CampaignSelectScreen({ 
  onSelectCampaign, 
  onDirectLogin 
}: CampaignSelectScreenProps) {
  return (
    <div className="min-h-screen bg-[#030612] text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-hidden dir-rtl font-sans select-none">
      
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-600/15 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-600/15 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-80 bg-blue-900/10 blur-[180px] rounded-full pointer-events-none" />

      {/* Top Header */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between pt-2 pb-4 border-b border-slate-800/80 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative p-1.5 rounded-2xl neon-logo-glow">
            <img 
              src={warroomLogoJpg} 
              alt="War Room Logo" 
              referrerPolicy="no-referrer"
              className="w-10 h-10 object-cover rounded-xl border border-white/20 shadow-md"
            />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black text-white tracking-tight">سامانه عملیاتی اتاق جنگ</h1>
            <p className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider">WAR ROOM • NATIONAL PORTAL GATEWAYS</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>پویش سراسری فعال ۱۴۰۳-۱۴۰۴</span>
        </div>
      </div>

      {/* Main Choice Section */}
      <div className="max-w-5xl mx-auto w-full my-auto py-6 sm:py-8 relative z-10 space-y-6 sm:space-y-7 text-center">
        
        {/* Title & Badge */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-amber-300 text-xs font-bold shadow-lg">
            <Sparkles size={14} className="animate-spin-slow text-amber-400" />
            <span>گام نخست ورود به عملیات</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug drop-shadow-md">
            درگاه مورد نظر خود را برای ورود یا ثبت‌نام انتخاب کنید
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            اگر قبلاً ثبت‌نام کرده‌اید از «درگاه ورود مستقیم» استفاده کنید؛ در غیر این صورت یکی از درگاه‌های پویش دختران یا پسران را برای ثبت‌نام جدید برگزینید.
          </p>
        </div>

        {/* 3 Interactive Portal Gateways (1 Direct Login + 2 Gender Campaign Registers) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 text-right pt-2 max-w-4xl mx-auto">
          
          {/* 1. DIRECT LOGIN GATEWAY (درگاه ورود مستقیم با کد ملی) */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDirectLogin}
            className="group relative cursor-pointer overflow-hidden rounded-3xl p-[1.5px] bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 shadow-[0_0_30px_rgba(245,158,11,0.25)] transition-all duration-300 flex flex-col"
          >
            <div className="h-full bg-gradient-to-br from-[#161208] via-[#0f0c05] to-[#080602] p-5 rounded-[23px] flex flex-col justify-between space-y-5 relative overflow-hidden">
              
              <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/15 blur-xl rounded-full pointer-events-none group-hover:scale-125 transition duration-500" />

              <div className="flex items-center justify-between z-10">
                <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400 group-hover:scale-110 transition duration-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                  <LogIn size={24} className="text-amber-400" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-[10px] font-black">
                  قبلاً ثبت‌نام کرده‌ام
                </span>
              </div>

              <div className="space-y-2 z-10 text-right">
                <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-amber-300 transition flex items-center gap-1.5">
                  <span>درگاه ورود رزمندگان</span>
                  <Star size={16} className="text-amber-400 fill-amber-400" />
                </h3>
                <p className="text-xs text-amber-100/70 leading-relaxed">
                  ورود سریع با کد ملی و رمز عبور مستقیم به داشبورد و نقشه مراحل بازی.
                </p>

                <div className="pt-2 space-y-1 text-[11px] text-amber-200/80 font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-amber-400 shrink-0" />
                    <span>ورود آنی به داشبورد عملیات</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-amber-400 shrink-0" />
                    <span>دسترسی به جوخه و مراحل</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-amber-500/20 z-10">
                <span className="text-xs font-black text-amber-300 group-hover:underline">
                  ورود به حساب کاربری
                </span>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-bold group-hover:translate-x-[-3px] transition shadow-md">
                  <ArrowLeft size={18} />
                </div>
              </div>

            </div>
          </motion.div>

          {/* 2. GIRLS CAMPAIGN (درگاه ثبت‌نام پویش دختران - سیندخت) */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCampaign('girls', 'register')}
            className="group relative cursor-pointer overflow-hidden rounded-3xl p-[1.5px] bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-600 shadow-[0_0_30px_rgba(244,63,94,0.3)] transition-all duration-300 flex flex-col"
          >
            <div className="h-full bg-gradient-to-br from-[#1b0720] via-[#120516] to-[#0c030f] p-5 rounded-[23px] flex flex-col justify-between space-y-5 relative overflow-hidden">
              
              <div className="absolute top-0 right-0 w-28 h-28 bg-pink-500/15 blur-xl rounded-full pointer-events-none group-hover:scale-125 transition duration-500" />

              <div className="flex items-center justify-between z-10">
                <div className="w-12 h-12 rounded-2xl bg-pink-950/80 border border-pink-500/50 flex items-center justify-center text-pink-400 group-hover:scale-110 transition duration-300 shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                  <Heart size={24} className="fill-pink-400 text-pink-400 animate-pulse" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-pink-950/80 border border-pink-500/50 text-pink-300 text-[10px] font-black">
                  ثبت‌نام جدید (دختران)
                </span>
              </div>

              <div className="space-y-2 z-10 text-right">
                <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-pink-300 transition flex items-center gap-1.5">
                  <span>پویش دختران (سیندخت)</span>
                  <Sparkles size={16} className="text-pink-400" />
                </h3>
                <p className="text-xs text-pink-100/70 leading-relaxed">
                  تم صورتی و ارغوانی، مأموریت‌های خلاقانه و فرمانده اختصاصی دختران.
                </p>

                <div className="pt-2 space-y-1 text-[11px] text-pink-200/80 font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-pink-400 shrink-0" />
                    <span>تم نئونی صورتی در کل سامانه</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-pink-400 shrink-0" />
                    <span>انتخاب تاریخ تولد شمسی با تقویم</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-pink-500/20 z-10">
                <span className="text-xs font-black text-pink-300 group-hover:underline">
                  ثبت‌نام پویش دختران
                </span>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white flex items-center justify-center font-bold group-hover:translate-x-[-3px] transition shadow-md">
                  <ArrowLeft size={18} />
                </div>
              </div>

            </div>
          </motion.div>

          {/* 3. BOYS CAMPAIGN (درگاه ثبت‌نام پویش پسران - نوید) */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCampaign('boys', 'register')}
            className="group relative cursor-pointer overflow-hidden rounded-3xl p-[1.5px] bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-300 flex flex-col"
          >
            <div className="h-full bg-gradient-to-br from-[#071328] via-[#050c1b] to-[#020610] p-5 rounded-[23px] flex flex-col justify-between space-y-5 relative overflow-hidden">
              
              <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/15 blur-xl rounded-full pointer-events-none group-hover:scale-125 transition duration-500" />

              <div className="flex items-center justify-between z-10">
                <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition duration-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  <Zap size={24} className="fill-cyan-400 text-cyan-400 animate-pulse" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 text-[10px] font-black">
                  ثبت‌نام جدید (پسران)
                </span>
              </div>

              <div className="space-y-2 z-10 text-right">
                <h3 className="text-lg sm:text-xl font-black text-white group-hover:text-cyan-300 transition flex items-center gap-1.5">
                  <span>پویش پسران (نوید)</span>
                  <Flame size={16} className="text-amber-400" />
                </h3>
                <p className="text-xs text-cyan-100/70 leading-relaxed">
                  تم فیروزه‌ای و سایبری، عملیات جوخه‌ای و رقابت در سکوی قهرمانی.
                </p>

                <div className="pt-2 space-y-1 text-[11px] text-cyan-200/80 font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-cyan-400 shrink-0" />
                    <span>تم نئونی فیروزه‌ای در کل سامانه</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-cyan-400 shrink-0" />
                    <span>انتخاب تاریخ تولد شمسی با تقویم</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-cyan-500/20 z-10">
                <span className="text-xs font-black text-cyan-300 group-hover:underline">
                  ثبت‌نام پویش پسران
                </span>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 text-slate-950 flex items-center justify-center font-bold group-hover:translate-x-[-3px] transition shadow-md">
                  <ArrowLeft size={18} />
                </div>
              </div>

            </div>
          </motion.div>

        </div>

      </div>

      {/* Footer Info */}
      <div className="max-w-5xl mx-auto w-full pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400 font-medium relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>قرارگاه مرکزی سامانه عملیاتی اتاق جنگ</span>
        <span className="text-[11px] text-slate-500">پشتیبانی و راهنمایی: <span className="font-mono text-cyan-400 font-bold dir-ltr">۰۲۱-۸۸۹۹۷۷۶۶</span></span>
      </div>

    </div>
  );
}
