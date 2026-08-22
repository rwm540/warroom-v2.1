import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Radio } from 'lucide-react';

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
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#050814] text-white flex flex-col items-center justify-center p-6 dir-rtl font-sans select-none">
      {/* Background Radar Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[500px] h-[500px] rounded-full border border-cyan-500/10 animate-ping absolute" />
        <div className="w-[350px] h-[350px] rounded-full border border-cyan-500/20 absolute" />
        <div className="w-[200px] h-[200px] rounded-full border border-cyan-500/30 absolute" />
        <div className="w-96 h-96 bg-cyan-600/10 blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-6 max-w-sm w-full text-center">
        
        {/* Radar & Shield Logo */}
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-rose-600 p-[2px] shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center">
            <div className="w-full h-full bg-[#070b1e] rounded-[22px] flex items-center justify-center text-cyan-400">
              <ShieldAlert size={42} className="animate-pulse" />
            </div>
          </div>
          
          {/* Radar Sweep Icon */}
          <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-cyan-500 p-2 rounded-xl text-cyan-400 shadow-lg">
            <Radio size={20} className="animate-spin" />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-black text-white tracking-wide">قرارگاه مرکزی اتاق جنگ</h2>
          <p className="text-xs text-cyan-400 font-mono">در حال برقراری ارتباط امن با سرورهای تاکتیکی...</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-2">
          <div className="w-full h-2.5 bg-slate-900 rounded-full border border-slate-800 overflow-hidden p-0.5">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.8)]"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut', duration: 0.1 }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
            <span>رمزنگاری داده‌ها</span>
            <span className="text-cyan-300 font-bold">{progress}٪</span>
          </div>
        </div>

      </div>
    </div>
  );
}
