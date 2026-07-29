import React from 'react';
import { User } from '../../types';
import { Swords, ArrowLeft, ClipboardCheck, BookOpen, ShieldCheck, Sparkles } from 'lucide-react';

interface CompetitionHeroProps {
  currentUser: User | null;
  onPrimaryAction: () => void;
  onSecondaryAction: () => void;
  siteSettings?: any;
}

export default function CompetitionHero({
  currentUser,
  onPrimaryAction,
  onSecondaryAction,
  siteSettings
}: CompetitionHeroProps) {
  return (
    <div className="relative mx-4 my-4 p-4 rounded-2xl cyber-card-3d dir-rtl space-y-3.5" id="competition-hero">
      
      {/* Top Title Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm md:text-base font-black text-white flex items-center gap-2">
          <Sparkles size={16} className="text-cyan-400 animate-pulse" />
          <span>{siteSettings?.heroTitle || 'ماموریت اصلی: تسخیر کهکشان'}</span>
        </h2>
        <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-2 py-0.5 rounded-full">
          {siteSettings?.heroProgress || '۷۲٪'}
        </span>
      </div>

      {/* Futuristic Sci-fi Banner Image */}
      <div className="relative h-36 md:h-44 w-full rounded-xl overflow-hidden border border-cyan-500/30 group">
        <img 
          src={siteSettings?.heroImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"} 
          alt="ماموریت اصلی" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f24] via-transparent to-transparent opacity-80" />
      </div>

      {/* Cyan Glowing Progress Bar */}
      <div className="space-y-1">
        <div className="w-full h-2 rounded-full bg-slate-950 border border-cyan-950 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.9)] transition-all duration-1000"
            style={{ width: siteSettings?.heroProgress || '72%' }}
          />
        </div>
      </div>

      {/* Digital Countdown Timer */}
      <div className="text-center pt-1 space-y-0.5">
        <div className="text-lg md:text-2xl font-black text-white font-mono tracking-widest text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">
          {siteSettings?.heroCountdown || '۰۲:۱۴:۳۹:۱۵'}
        </div>
        <div className="text-[9px] font-bold text-slate-400 font-mono tracking-widest uppercase">
          DAYS : HRS : MINS : SECS
        </div>
      </div>

      {/* CTA Button */}
      <div className="pt-1">
        <button
          onClick={onPrimaryAction}
          className="w-full py-2.5 rounded-xl text-xs font-black text-cyan-200 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-400/70 shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-98 transition-all flex items-center justify-center gap-2 group"
          id="btn-hero-action"
        >
          <ClipboardCheck size={16} className="text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span>{siteSettings?.heroButtonText || 'مشاهده ماموریت'}</span>
          <ArrowLeft size={14} className="text-cyan-400 group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
}
