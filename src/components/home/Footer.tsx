import React from 'react';
import { Shield } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenAbout: () => void;
}

export default function Footer({ onNavigate, onOpenAbout }: FooterProps) {
  return (
    <footer className="mt-8 mb-20 md:mb-6 px-4 py-6 border-t border-cyan-500/20 bg-[#060b1e]/80 text-center space-y-4 dir-rtl rounded-t-2xl">
      {/* Brand & Title */}
      <div className="flex items-center justify-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
          <Shield size={16} />
        </div>
        <span className="text-xs font-black text-white">
          سامانه ملی مسابقات «اتاق جنگ»
        </span>
      </div>

      {/* Nav Links */}
      <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-400 flex-wrap">
        <button 
          onClick={onOpenAbout} 
          className="hover:text-cyan-300 transition-colors"
        >
          درباره ما
        </button>
        <span className="text-slate-800">•</span>
        <button 
          onClick={onOpenAbout} 
          className="hover:text-cyan-300 transition-colors"
        >
          قوانین مسابقه
        </button>
        <span className="text-slate-800">•</span>
        <button 
          onClick={() => onNavigate('Support')} 
          className="hover:text-cyan-300 transition-colors"
        >
          پشتیبانی
        </button>
      </div>

      {/* Persian Copyright */}
      <div className="text-[10px] text-slate-400/80 font-mono leading-relaxed pt-2 border-t border-cyan-500/10">
        © ۱۴۰۳ تمامی حقوق مادی و معنوی متعلق به قرارگاه مرکزی مسابقات اتاق جنگ می‌باشد.
      </div>
    </footer>
  );
}
