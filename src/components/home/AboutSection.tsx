import React from 'react';
import { ChevronLeft, Target } from 'lucide-react';

interface AboutSectionProps {
  onOpenMore: () => void;
}

export default function AboutSection({ onOpenMore }: AboutSectionProps) {
  return (
    <div className="my-6 mx-4 p-4 rounded-2xl bg-[#0a0f24]/80 backdrop-blur-xl border border-cyan-500/25 relative overflow-hidden dir-rtl shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      {/* Background Subtle Tactical Grid Texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

      <div className="relative z-10 space-y-2.5 text-right">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-cyan-950/70 border border-cyan-400/50 flex items-center justify-center text-cyan-400">
            <Target size={15} />
          </div>
          <h2 className="text-sm font-black text-white">
            اتاق جنگ چیست؟
          </h2>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          اتاق جنگ، محیطی برای رقابت، آموزش و همکاری گروهی است؛ هر رزمنده با انجام مأموریت‌ها و یادگیری مستمر، در موفقیت جوخه خود نقش دارد.
        </p>

        <button
          onClick={onOpenMore}
          className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 pt-1 transition-colors"
        >
          <span>آشنایی بیشتر با قوانین و نحوه شرکت</span>
          <ChevronLeft size={14} />
        </button>
      </div>
    </div>
  );
}
