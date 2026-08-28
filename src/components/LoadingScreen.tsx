import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Radio, Sparkles, Activity } from 'lucide-react';
import warroomLogoJpg from '../assets/images/warroom_logo_1787906676836.jpg';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return prev + 12;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#030712] text-white flex flex-col items-center justify-center p-6 dir-rtl font-sans select-none overflow-hidden">
      
      {/* Background Radar Scanner Animation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden radar-grid">
        
        {/* Outer concentric radar rings */}
        <div className="w-[580px] h-[580px] rounded-full border border-cyan-500/15 absolute animate-pulse" />
        <div className="w-[440px] h-[440px] rounded-full border border-cyan-500/25 absolute" />
        <div className="w-[300px] h-[300px] rounded-full border border-cyan-500/35 absolute" />
        <div className="w-[160px] h-[160px] rounded-full border border-cyan-500/45 absolute" />

        {/* Crosshair lines */}
        <div className="w-[600px] h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent absolute" />
        <div className="h-[600px] w-[1px] bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent absolute" />

        {/* 360-degree Rotating Conic Radar Sweep */}
        <div className="w-[500px] h-[500px] radar-sweep absolute pointer-events-none opacity-80" />

        {/* Target Blips */}
        <div className="absolute top-[32%] right-[38%] w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <div className="absolute bottom-[35%] left-[40%] w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
        <div className="absolute top-[42%] left-[32%] w-2 h-2 rounded-full bg-rose-400 animate-ping" />

        {/* Center Glow */}
        <div className="w-80 h-80 bg-cyan-500/15 blur-[120px] rounded-full absolute" />
      </div>

      {/* Main Center Content */}
      <div className="relative z-10 flex flex-col items-center space-y-6 max-w-xs w-full text-center">
        
        {/* War Room Neon Logo over Radar */}
        <div className="relative">
          <div className="p-2 rounded-3xl neon-logo-glow bg-gradient-to-tr from-cyan-500/30 via-slate-900 to-blue-600/30 border border-cyan-400/50 shadow-[0_0_35px_rgba(6,182,212,0.6)]">
            <img 
              src={warroomLogoJpg} 
              alt="War Room Logo" 
              referrerPolicy="no-referrer"
              className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-2xl border border-white/20 shadow-2xl"
            />
          </div>

          {/* Tactical Badge */}
          <div className="absolute -bottom-2 right-1/2 translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-950 border border-cyan-400/60 text-[10px] font-black text-cyan-300 font-mono tracking-widest uppercase shadow-md whitespace-nowrap">
            WAR ROOM RADAR
          </div>
        </div>

        {/* Clean, Minimalist Text */}
        <div className="space-y-1 pt-1">
          <h2 className="text-xl font-black text-white tracking-wide drop-shadow-md">
            اتاق جنگ
          </h2>
          <p className="text-xs text-cyan-300/80 font-mono flex items-center justify-center gap-1.5">
            <Activity size={13} className="animate-spin text-cyan-400" />
            <span>پایش راداری و بارگذاری سرورهای عملیاتی...</span>
          </p>
        </div>

        {/* Tactical Progress Bar */}
        <div className="w-full space-y-2">
          <div className="w-full h-2 bg-slate-950/80 rounded-full border border-cyan-500/30 overflow-hidden p-[1px] shadow-[inset_0_0_8px_rgba(0,0,0,0.8)]">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.9)]"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.1 }}
            />
          </div>
          
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span className="text-slate-400">سیستم دفاعی آنلاین</span>
            <span className="text-cyan-300 font-bold tracking-wider">{progress}٪</span>
          </div>
        </div>

      </div>

    </div>
  );
}
