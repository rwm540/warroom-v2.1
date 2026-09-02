import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Zap, 
  ArrowLeft, 
  Shield
} from 'lucide-react';
import warroomLogoJpg from '../assets/images/warroom_logo_1787906676836.jpg';

interface CampaignSelectScreenProps {
  onSelectCampaign: (campaign: 'girls' | 'boys') => void;
}

export default function CampaignSelectScreen({ 
  onSelectCampaign
}: CampaignSelectScreenProps) {
  return (
    <div className="h-screen max-h-screen bg-[#020510] text-slate-100 flex flex-col justify-between p-3 sm:p-4 md:p-6 relative overflow-hidden dir-rtl font-sans select-none">
      
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-600/15 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-600/15 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-80 bg-blue-900/10 blur-[180px] rounded-full pointer-events-none" />

      {/* Top Header */}
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
          <div>
            <h1 className="text-base sm:text-lg font-black text-white tracking-tight">اتاق جنگ</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>سامانه عملیاتی فعال</span>
          </div>
        </div>
      </div>

      {/* Main Choice Section */}
      <div className="max-w-2xl mx-auto w-full my-auto py-2 relative z-10 text-center">
        
        {/* 2 Choice Cards: Girls & Boys */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 text-right max-w-2xl mx-auto">
          
          {/* 1. GIRLS (ورود دختران) */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCampaign('girls')}
            className="group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl p-[2px] bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-600 shadow-[0_0_30px_rgba(244,63,94,0.3)] transition-all duration-300 flex flex-col"
          >
            <div className="h-full bg-gradient-to-br from-[#1c0822] via-[#130518] to-[#0c030f] p-5 sm:p-6 rounded-[20px] sm:rounded-[22px] flex flex-col justify-between space-y-4 sm:space-y-5 relative overflow-hidden">
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 blur-2xl rounded-full pointer-events-none group-hover:scale-125 transition duration-500" />

              <div className="flex items-center justify-between z-10">
                <div className="w-12 h-12 rounded-xl bg-pink-950/80 border border-pink-500/50 flex items-center justify-center text-pink-400 group-hover:scale-110 transition duration-300 shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                  <Heart size={24} className="fill-pink-400 text-pink-400 animate-pulse" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-pink-950/90 border border-pink-500/60 text-pink-300 text-xs font-black shadow-sm">
                  ویژه دختران
                </span>
              </div>

              <div className="space-y-1 z-10 text-right">
                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-pink-300 transition">
                  ورود دختران
                </h3>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-pink-500/25 z-10">
                <span className="text-xs sm:text-sm font-black text-pink-300 group-hover:underline">
                  ورود به اتاق جنگ
                </span>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white flex items-center justify-center font-bold group-hover:translate-x-[-3px] transition shadow-[0_0_12px_rgba(244,63,94,0.5)]">
                  <ArrowLeft size={18} />
                </div>
              </div>

            </div>
          </motion.div>

          {/* 2. BOYS (ورود پسران) */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCampaign('boys')}
            className="group relative cursor-pointer overflow-hidden rounded-2xl sm:rounded-3xl p-[2px] bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-300 flex flex-col"
          >
            <div className="h-full bg-gradient-to-br from-[#07152c] via-[#050e1d] to-[#020612] p-5 sm:p-6 rounded-[20px] sm:rounded-[22px] flex flex-col justify-between space-y-4 sm:space-y-5 relative overflow-hidden">
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-2xl rounded-full pointer-events-none group-hover:scale-125 transition duration-500" />

              <div className="flex items-center justify-between z-10">
                <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition duration-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  <Zap size={24} className="fill-cyan-400 text-cyan-400 animate-pulse" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-400/60 text-cyan-300 text-xs font-black shadow-sm">
                  ویژه پسران
                </span>
              </div>

              <div className="space-y-1 z-10 text-right">
                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-300 transition">
                  ورود پسران
                </h3>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-cyan-500/25 z-10">
                <span className="text-xs sm:text-sm font-black text-cyan-300 group-hover:underline">
                  ورود به اتاق جنگ
                </span>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 text-slate-950 flex items-center justify-center font-bold group-hover:translate-x-[-3px] transition shadow-[0_0_12px_rgba(6,182,212,0.5)]">
                  <ArrowLeft size={18} />
                </div>
              </div>

            </div>
          </motion.div>

        </div>

      </div>

      {/* Footer Info */}
      <div className="max-w-4xl mx-auto w-full py-2 border-t border-slate-800/80 text-center text-xs text-slate-400 font-medium relative z-10 flex flex-col sm:flex-row items-center justify-between gap-1 shrink-0">
        <span>قرارگاه مرکزی اتاق جنگ</span>
        <span className="text-[11px] text-slate-500">پشتیبانی و راهنمایی: <span className="font-mono text-cyan-400 font-bold dir-ltr">۰۲۱-۸۸۹۹۷۷۶۶</span></span>
      </div>

    </div>
  );
}
