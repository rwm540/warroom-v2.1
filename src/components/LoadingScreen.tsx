import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Activity, Sparkles, CheckCircle2 } from 'lucide-react';
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
          setTimeout(onComplete, 350);
          return 100;
        }
        return prev + 14;
      });
    }, 110);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#020804] text-white flex flex-col items-center justify-center p-4 dir-rtl font-sans select-none overflow-hidden touch-none">
      
      {/* Background Subtle Tactical Green Radar Grid */}
      <div className="absolute inset-0 radar-grid-green opacity-40 pointer-events-none" />

      {/* Dynamic Military Radar Scanner Animation (Android & Mobile Optimized) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        
        {/* Deep Green Ambient Center Glow */}
        <div className="w-64 h-64 sm:w-80 sm:h-80 bg-emerald-600/20 blur-[90px] rounded-full absolute" />

        {/* Outer Rotating Compass & Degrees Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
          className="w-[290px] h-[290px] sm:w-[370px] sm:h-[370px] rounded-full border border-dashed border-emerald-500/25 absolute pointer-events-none"
        >
          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-emerald-400/80 font-bold bg-[#020804] px-1">000°</span>
          <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-emerald-400/80 font-bold bg-[#020804] px-1">180°</span>
          <span className="absolute top-1/2 -right-3 -translate-y-1/2 text-[8px] font-mono text-emerald-400/80 font-bold bg-[#020804] px-1">090°</span>
          <span className="absolute top-1/2 -left-3 -translate-y-1/2 text-[8px] font-mono text-emerald-400/80 font-bold bg-[#020804] px-1">270°</span>
        </motion.div>

        {/* Expanding Radar Sonar Pulse Wave */}
        <motion.div
          animate={{ scale: [0.6, 1.28], opacity: [0.65, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeOut" }}
          className="w-[270px] h-[270px] sm:w-[350px] sm:h-[350px] rounded-full border border-emerald-400/50 absolute pointer-events-none shadow-[0_0_15px_rgba(16,185,129,0.35)]"
        />

        {/* Concentric Static Radar Range Rings */}
        <div className="w-[270px] h-[270px] sm:w-[350px] sm:h-[350px] rounded-full border border-emerald-500/30 absolute" />
        <div className="w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] rounded-full border border-emerald-500/25 absolute" />
        <div className="w-[130px] h-[130px] sm:w-[170px] sm:h-[170px] rounded-full border border-emerald-400/35 absolute" />

        {/* Active Rotating Radar Sweeper (Beam + Conic Gradient) */}
        <div className="w-[270px] h-[270px] sm:w-[350px] sm:h-[350px] rounded-full absolute pointer-events-none overflow-hidden">
          {/* Conic Sweeper Disc */}
          <div className="w-full h-full rounded-full radar-sweep-green" />

          {/* Synchronously Rotating Glowing Beam Needle */}
          <div className="absolute inset-0 animate-[radar-spin_2.6s_linear_infinite] pointer-events-none">
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-[2px] h-1/2 bg-gradient-to-t from-emerald-400 via-green-300 to-emerald-100 shadow-[0_0_12px_#34d399,0_0_24px_#10b981]" />
          </div>
        </div>

        {/* Crosshair Axes */}
        <div className="w-[300px] sm:w-[380px] h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent absolute" />
        <div className="h-[300px] sm:h-[380px] w-[1px] bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent absolute" />

        {/* Tactical Radar Blips (Targets) */}
        <div className="absolute top-[34%] right-[32%] flex items-center justify-center">
          <span className="w-3 h-3 rounded-full bg-emerald-400/60 animate-ping absolute" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_#34d399]" />
          <span className="text-[7px] font-mono text-emerald-400 absolute -bottom-3 right-0 font-bold whitespace-nowrap">T-01</span>
        </div>

        <div className="absolute bottom-[36%] left-[34%] flex items-center justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400/60 animate-ping absolute" />
          <span className="w-1.5 h-1.5 rounded-full bg-green-300 shadow-[0_0_6px_#4ade80]" />
          <span className="text-[7px] font-mono text-green-400 absolute -bottom-3 left-0 font-bold whitespace-nowrap">S-09</span>
        </div>

        <div className="absolute top-[58%] right-[24%] flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse absolute" />
          <span className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
        </div>
      </div>

      {/* Main Center Content (Compact & Android Friendly) */}
      <div className="relative z-10 flex flex-col items-center space-y-4 max-w-[260px] sm:max-w-xs w-full text-center">
        
        {/* War Room Logo in Deep Vibrant Green Neon Ring */}
        <div className="relative">
          <div className="p-1.5 rounded-2xl bg-gradient-to-tr from-emerald-600 via-slate-950 to-green-500 border-2 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.8)]">
            <img 
              src={warroomLogoJpg} 
              alt="War Room Logo" 
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-emerald-300/40 shadow-xl"
            />
          </div>

          {/* Tactical Badge */}
          <div className="absolute -bottom-2.5 right-1/2 translate-x-1/2 px-2.5 py-0.5 rounded-full bg-slate-950 border border-emerald-400 text-[9px] font-black text-emerald-300 font-mono tracking-wider uppercase shadow-md whitespace-nowrap">
            سامانه اتاق جنگ
          </div>
        </div>

        {/* Text */}
        <div className="space-y-0.5 pt-1">
          <h2 className="text-lg sm:text-xl font-black text-white tracking-wide drop-shadow-[0_2px_10px_rgba(16,185,129,0.4)]">
            اتاق جنگ
          </h2>
          <p className="text-[11px] text-emerald-300 font-mono flex items-center justify-center gap-1.5">
            <Activity size={12} className="animate-spin text-emerald-400" />
            <span>بارگذاری سیستم‌های عملیاتی...</span>
          </p>
        </div>

        {/* Tactical Deep Green Progress Bar */}
        <div className="w-full space-y-1.5">
          <div className="w-full h-2 bg-slate-950 rounded-full border border-emerald-500/40 overflow-hidden p-[1px] shadow-[inset_0_0_8px_rgba(0,0,0,0.9)]">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-300 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.9)]"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.1 }}
            />
          </div>
          
          <div className="flex justify-between items-center text-[10px] font-mono text-emerald-200/80 px-1">
            <span>سیستم آنلاین</span>
            <span className="text-emerald-300 font-black tracking-wider">{progress}٪</span>
          </div>
        </div>

      </div>

    </div>
  );
}
