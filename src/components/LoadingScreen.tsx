import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Radio } from 'lucide-react';
import warroomLogoJpg from '../assets/images/warroom_logo_1787906676836.jpg';

interface LoadingScreenProps {
  onComplete: () => void;
  isGirls?: boolean;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onComplete();
          return 100;
        }
        return prev + 50;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#020703] text-white flex flex-col items-center justify-center p-4 dir-rtl font-sans select-none overflow-hidden touch-none">
      
      {/* Background Subtle Green Tactical Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.06)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none opacity-40" />

      {/* Ambient Center Green Glow */}
      <div className="w-72 h-72 sm:w-96 sm:h-96 blur-[100px] rounded-full absolute bg-emerald-500/15 pointer-events-none" />

      {/* Simple Green Tactical Radar Container */}
      <div className="relative flex items-center justify-center pointer-events-none mb-6">
        
        {/* Radar Circular Scope Frame */}
        <div className="w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] rounded-full border border-emerald-500/40 relative flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.15)] bg-[#030d06]/50 backdrop-blur-[2px]">
          
          {/* Concentric Range Rings (Simple: 2 rings) */}
          <div className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] rounded-full border border-emerald-500/25 absolute" />
          <div className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] rounded-full border border-emerald-500/20 absolute" />

          {/* Simple Crosshair Axes */}
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/35 to-transparent absolute" />
          <div className="h-full w-[1px] bg-gradient-to-b from-transparent via-emerald-500/35 to-transparent absolute" />

          {/* Rotating Radar Sweeper (Phosphor Green) */}
          <div className="w-full h-full rounded-full absolute pointer-events-none overflow-hidden">
            <div className="w-full h-full rounded-full radar-sweep-green" />
            <div className="absolute inset-0 animate-[radar-spin_2.6s_linear_infinite] pointer-events-none">
              <div className="absolute top-0 right-1/2 translate-x-1/2 w-[1.5px] h-1/2 bg-gradient-to-t from-emerald-500 via-emerald-400 to-emerald-200 shadow-[0_0_8px_#34d399]" />
            </div>
          </div>

          {/* Single Simple Radar Target Blip */}
          <div className="absolute top-[28%] right-[30%] flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-emerald-400/50 animate-ping absolute" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_#10b981]" />
          </div>

          {/* Center Logo Emblem */}
          <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-emerald-500/50 bg-[#020b05] p-1 shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center justify-center">
            <img 
              src={warroomLogoJpg} 
              alt="War Room Logo" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-xl border border-emerald-400/30"
            />
          </div>

        </div>

      </div>

      {/* Main Bottom Content (Simple, Minimalist) */}
      <div className="relative z-10 flex flex-col items-center space-y-3 max-w-[240px] sm:max-w-xs w-full text-center">
        
        {/* Title */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black tracking-wide text-white drop-shadow-[0_0_12px_rgba(16,185,129,0.7)]">
            اتاق جنگ
          </h2>
          <p className="text-[11px] font-mono text-emerald-300/80 flex items-center justify-center gap-1.5">
            <Radio size={13} className="text-emerald-400 animate-pulse" />
            <span>در حال اسکن رادار و بارگذاری...</span>
          </p>
        </div>

        {/* Tactical Simple Green Progress Bar */}
        <div className="w-full space-y-1.5 pt-1">
          <div className="w-full h-2 rounded-full border border-emerald-500/35 bg-[#030f06] overflow-hidden p-[1px] shadow-[inset_0_0_8px_rgba(0,0,0,0.8)]">
            <motion.div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-green-300 shadow-[0_0_12px_rgba(52,211,153,0.9)]"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.1 }}
            />
          </div>
          
          <div className="flex justify-between items-center text-[10px] font-mono px-1">
            <span className="text-emerald-400/70">رادار فعال</span>
            <span className="font-bold text-emerald-400">{progress}٪</span>
          </div>
        </div>

      </div>

    </div>
  );
}
