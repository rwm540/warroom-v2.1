import React from 'react';
import { Sparkles, UserCheck, Heart, Zap, ArrowLeft, Shield } from 'lucide-react';

interface ThemeSwitcherHeaderProps {
  themeMode: 'girls' | 'boys';
  setThemeMode: (mode: 'girls' | 'boys') => void;
  onOpenRegister: (gender: 'female' | 'male') => void;
}

export default function ThemeSwitcherHeader({
  themeMode,
  setThemeMode,
  onOpenRegister
}: ThemeSwitcherHeaderProps) {
  const isGirls = themeMode === 'girls';

  return (
    <div className="w-full space-y-3">
      {/* Dynamic Theme Banner Widget: 2 Side-by-Side Banners */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
        
        {/* 1. Girls Banner Widget (پوسته و بخش دختران) */}
        <div
          onClick={() => setThemeMode('girls')}
          className={`relative cursor-pointer rounded-2xl sm:rounded-3xl p-3 sm:p-5 transition-all duration-300 overflow-hidden flex flex-col justify-between select-none ${
            isGirls
              ? 'bg-gradient-to-br from-pink-950/90 via-rose-950/70 to-[#18081a] border-2 border-pink-500 shadow-[0_0_30px_rgba(244,63,94,0.45)] scale-[1.02]'
              : 'bg-[#120a17]/70 border border-pink-900/40 hover:border-pink-500/50 opacity-75 hover:opacity-100'
          }`}
        >
          {/* Ambient Glow */}
          {isGirls && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 blur-2xl rounded-full pointer-events-none" />
          )}

          {/* Top Indicator */}
          <div className="flex items-center justify-between z-10">
            <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              isGirls 
                ? 'bg-pink-500 text-white shadow-sm' 
                : 'bg-pink-950/60 text-pink-300 border border-pink-800/40'
            }`}>
              <Heart size={12} className="fill-current" />
              <span>پویش دختران</span>
            </span>

            {isGirls && (
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
            )}
          </div>

          {/* Center Graphic / Text */}
          <div className="my-2.5 z-10 text-right">
            <h3 className="text-sm sm:text-lg font-black text-pink-100 flex items-center gap-1.5">
              <span>ورود دختران</span>
              <Sparkles size={16} className="text-pink-400" />
            </h3>
            <p className="text-[10px] sm:text-xs text-pink-200/80 mt-0.5 line-clamp-1">
              تم اختصاصی، مأموریت‌ها و جوایز ویژه
            </p>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center justify-between pt-1 border-t border-pink-500/20 z-10">
            <span className="text-[10px] sm:text-xs text-pink-300 font-bold">
              {isGirls ? '✓ پوسته فعال' : 'انتخاب تم صورتی'}
            </span>
            <div className={`p-1 sm:p-1.5 rounded-xl ${isGirls ? 'bg-pink-500 text-slate-950' : 'bg-pink-950/80 text-pink-400'}`}>
              <ArrowLeft size={13} />
            </div>
          </div>
        </div>

        {/* 2. Boys Banner Widget (پوسته و بخش پسران) */}
        <div
          onClick={() => setThemeMode('boys')}
          className={`relative cursor-pointer rounded-2xl sm:rounded-3xl p-3 sm:p-5 transition-all duration-300 overflow-hidden flex flex-col justify-between select-none ${
            !isGirls
              ? 'bg-gradient-to-br from-cyan-950/90 via-blue-950/70 to-[#081224] border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.45)] scale-[1.02]'
              : 'bg-[#081120]/70 border border-cyan-900/40 hover:border-cyan-500/50 opacity-75 hover:opacity-100'
          }`}
        >
          {/* Ambient Glow */}
          {!isGirls && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-2xl rounded-full pointer-events-none" />
          )}

          {/* Top Indicator */}
          <div className="flex items-center justify-between z-10">
            <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              !isGirls 
                ? 'bg-cyan-400 text-slate-950 shadow-sm' 
                : 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/40'
            }`}>
              <Zap size={12} className="fill-current" />
              <span>پویش پسران</span>
            </span>

            {!isGirls && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            )}
          </div>

          {/* Center Graphic / Text */}
          <div className="my-2.5 z-10 text-right">
            <h3 className="text-sm sm:text-lg font-black text-cyan-100 flex items-center gap-1.5">
              <span>ورود پسران</span>
              <Shield size={16} className="text-cyan-400" />
            </h3>
            <p className="text-[10px] sm:text-xs text-cyan-200/80 mt-0.5 line-clamp-1">
              تم سایبری، جوخه‌بندی و مأموریت‌های استراتژیک
            </p>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center justify-between pt-1 border-t border-cyan-500/20 z-10">
            <span className="text-[10px] sm:text-xs text-cyan-300 font-bold">
              {!isGirls ? '✓ پوسته فعال' : 'انتخاب تم آبی'}
            </span>
            <div className={`p-1 sm:p-1.5 rounded-xl ${!isGirls ? 'bg-cyan-400 text-slate-950' : 'bg-cyan-950/80 text-cyan-400'}`}>
              <ArrowLeft size={13} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
