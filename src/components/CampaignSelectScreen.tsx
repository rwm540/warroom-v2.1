import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Heart, 
  Zap, 
  ArrowLeft, 
  Flame, 
  CheckCircle2, 
  ChevronRight,
  X,
  Compass
} from 'lucide-react';
import warroomLogoJpg from '../assets/images/warroom_logo_1787906676836.jpg';

interface CampaignSelectScreenProps {
  onSelectCampaign: (campaign: 'girls' | 'boys') => void;
}

export default function CampaignSelectScreen({ 
  onSelectCampaign
}: CampaignSelectScreenProps) {
  return (
    <div className="min-h-screen bg-[#020510] text-slate-100 flex flex-col justify-between p-4 sm:p-6 md:p-8 relative overflow-hidden dir-rtl font-sans select-none">
      
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
            <h1 className="text-sm sm:text-base font-black text-white tracking-tight">سامانه سراسری هیس‌طوری</h1>
            <p className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider">NATIONAL CAMPAIGN SELECTION</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>پویش سراسری فعال ۱۴۰۳-۱۴۰۴</span>
          </div>
        </div>
      </div>

      {/* Main Choice Section */}
      <div className="max-w-4xl mx-auto w-full my-auto py-6 sm:py-10 relative z-10 space-y-6 sm:space-y-8 text-center">
        
        {/* Title & Badge */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-amber-300 text-xs font-bold shadow-lg">
            <Sparkles size={14} className="animate-spin-slow text-amber-400" />
            <span>گام نخست ورود به سامانه</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug drop-shadow-md">
            پویش مورد نظر خود را انتخاب کنید
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            لطفاً پویش مد نظر خود را انتخاب فرمایید. پس از انتخاب، تم و رنگ‌بندی اختصاصی در کل سامانه اعمال شده و به صفحه اصلی منتقل می‌شوید.
          </p>
        </div>

        {/* 2 Campaign Cards: Girls (سیندخت) and Boys (نوید) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 text-right pt-2 max-w-3xl mx-auto">
          
          {/* 1. GIRLS CAMPAIGN (پویش دختران - سیندخت) */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCampaign('girls')}
            className="group relative cursor-pointer overflow-hidden rounded-3xl p-[2px] bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-600 shadow-[0_0_35px_rgba(244,63,94,0.35)] transition-all duration-300 flex flex-col"
          >
            <div className="h-full bg-gradient-to-br from-[#1c0822] via-[#130518] to-[#0c030f] p-6 sm:p-7 rounded-[22px] flex flex-col justify-between space-y-6 relative overflow-hidden">
              
              <div className="absolute top-0 right-0 w-36 h-36 bg-pink-500/20 blur-2xl rounded-full pointer-events-none group-hover:scale-125 transition duration-500" />

              <div className="flex items-center justify-between z-10">
                <div className="w-14 h-14 rounded-2xl bg-pink-950/80 border border-pink-500/50 flex items-center justify-center text-pink-400 group-hover:scale-110 transition duration-300 shadow-[0_0_20px_rgba(244,63,94,0.45)]">
                  <Heart size={28} className="fill-pink-400 text-pink-400 animate-pulse" />
                </div>
                <span className="px-3 py-1 rounded-full bg-pink-950/90 border border-pink-500/60 text-pink-300 text-xs font-black shadow-sm">
                  ویژه دانش‌آموزان دختر
                </span>
              </div>

              <div className="space-y-2.5 z-10 text-right">
                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-pink-300 transition flex items-center gap-2">
                  <span>پویش دختران (سیندخت)</span>
                  <Sparkles size={18} className="text-pink-400" />
                </h3>
                <p className="text-xs sm:text-sm text-pink-100/75 leading-relaxed">
                  تم اختصاصی صورتی و ارغوانی، مأموریت‌ها و روایت‌های اختصاصی سیندخت و رقابت‌های هیجان‌انگیز دخترانه.
                </p>

                <div className="pt-3 space-y-1.5 text-xs text-pink-200/90 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-pink-400 shrink-0" />
                    <span>فعال‌سازی تم صورتی-نئونی در تمام صفحات</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-pink-400 shrink-0" />
                    <span>ورود مستقیم به صفحه اصلی پویش دختران</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-pink-500/25 z-10">
                <span className="text-xs sm:text-sm font-black text-pink-300 group-hover:underline">
                  انتخاب پویش دختران و ورود
                </span>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white flex items-center justify-center font-bold group-hover:translate-x-[-4px] transition shadow-[0_0_15px_rgba(244,63,94,0.6)]">
                  <ArrowLeft size={20} />
                </div>
              </div>

            </div>
          </motion.div>

          {/* 2. BOYS CAMPAIGN (پویش پسران - نوید) */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCampaign('boys')}
            className="group relative cursor-pointer overflow-hidden rounded-3xl p-[2px] bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 shadow-[0_0_35px_rgba(6,182,212,0.35)] transition-all duration-300 flex flex-col"
          >
            <div className="h-full bg-gradient-to-br from-[#07152c] via-[#050e1d] to-[#020612] p-6 sm:p-7 rounded-[22px] flex flex-col justify-between space-y-6 relative overflow-hidden">
              
              <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/20 blur-2xl rounded-full pointer-events-none group-hover:scale-125 transition duration-500" />

              <div className="flex items-center justify-between z-10">
                <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition duration-300 shadow-[0_0_20px_rgba(6,182,212,0.45)]">
                  <Zap size={28} className="fill-cyan-400 text-cyan-400 animate-pulse" />
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-400/60 text-cyan-300 text-xs font-black shadow-sm">
                  ویژه دانش‌آموزان پسر
                </span>
              </div>

              <div className="space-y-2.5 z-10 text-right">
                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-300 transition flex items-center gap-2">
                  <span>پویش پسران (نوید)</span>
                  <Flame size={18} className="text-amber-400" />
                </h3>
                <p className="text-xs sm:text-sm text-cyan-100/75 leading-relaxed">
                  تم سایبری فیروزه‌ای، عملیات گروهی جوخه، چالش‌های تاکتیکی و رقابت در جدول قهرمانی سراسری.
                </p>

                <div className="pt-3 space-y-1.5 text-xs text-cyan-200/90 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                    <span>فعال‌سازی تم فیروزه‌ای-سایبری در تمام صفحات</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                    <span>ورود مستقیم به صفحه اصلی پویش پسران</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-cyan-500/25 z-10">
                <span className="text-xs sm:text-sm font-black text-cyan-300 group-hover:underline">
                  انتخاب پویش پسران و ورود
                </span>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 text-slate-950 flex items-center justify-center font-bold group-hover:translate-x-[-4px] transition shadow-[0_0_15px_rgba(6,182,212,0.6)]">
                  <ArrowLeft size={20} />
                </div>
              </div>

            </div>
          </motion.div>

        </div>

      </div>

      {/* Footer Info */}
      <div className="max-w-5xl mx-auto w-full pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400 font-medium relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>قرارگاه مرکزی سامانه سراسری هیس‌طوری</span>
        <span className="text-[11px] text-slate-500">پشتیبانی و راهنمایی: <span className="font-mono text-cyan-400 font-bold dir-ltr">۰۲۱-۸۸۹۹۷۷۶۶</span></span>
      </div>

    </div>
  );
}
