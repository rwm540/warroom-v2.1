import React from 'react';
import { Send, MessageSquare, ExternalLink, HelpCircle, Map, BookOpen, Sparkles, CheckCircle } from 'lucide-react';

interface SocialMessengersWidgetsProps {
  themeMode: 'girls' | 'boys';
  onOpenStages?: () => void;
  onOpenGuide?: () => void;
  triggerAlert: (msg: string) => void;
}

export default function SocialMessengersWidgets({
  themeMode,
  onOpenStages,
  onOpenGuide,
  triggerAlert
}: SocialMessengersWidgetsProps) {
  const isGirls = themeMode === 'girls';

  const handleOpenMessenger = (name: string, url: string) => {
    triggerAlert(`هدایت به کانال رسمی در پیام‌رسان ${name}...`);
  };

  return (
    <div className="w-full space-y-4">
      
      {/* 1. Messenger Channels Grid (2 Side-by-Side Widgets Matching Screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        
        {/* Messenger 1: ایتا (Eitaa) - کانال هیس */}
        <div className={`rounded-3xl p-4 sm:p-5 border transition-all flex flex-col justify-between ${
          isGirls
            ? 'bg-gradient-to-br from-[#1d091b] to-[#0e040f] border-pink-500/40'
            : 'bg-gradient-to-br from-[#0c162b] to-[#050b17] border-slate-800 hover:border-amber-500/50'
        }`}>
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between">
              {/* Eitaa Logo Badge */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-950/80 border border-orange-500/50 text-orange-400 text-[10px] font-bold">
                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                <span>پیام‌رسان ایتا</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">@hisstory_official</span>
            </div>

            <h4 className="text-sm font-black text-white">
              روایت‌ها و پشت‌صحنه اتاق جنگ
            </h4>
            <p className="text-[11px] text-slate-300">
              روایت‌های اختصاصی کارآگاهان، سرنخ‌های مخفی مراحل و چالش‌های ویژه روزانه.
            </p>
          </div>

          <button
            onClick={() => handleOpenMessenger('ایتا (Eitaa)', 'https://eitaa.com/warroom')}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-2 transition"
          >
            <span>کانال اتاق جنگ در ایتا</span>
            <ExternalLink size={13} />
          </button>
        </div>

        {/* Messenger 2: بله (Bale) - کانال اتاق جنگ */}
        <div className={`rounded-3xl p-4 sm:p-5 border transition-all flex flex-col justify-between ${
          isGirls
            ? 'bg-gradient-to-br from-[#1d091b] to-[#0e040f] border-pink-500/40'
            : 'bg-gradient-to-br from-[#0c162b] to-[#050b17] border-slate-800 hover:border-emerald-500/50'
        }`}>
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between">
              {/* Bale Logo Badge */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-[10px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>پیام‌رسان بله</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">@warroom_app</span>
            </div>

            <h4 className="text-sm font-black text-white">
              اخبار و اطلاعیه‌های رسمی اتاق جنگ
            </h4>
            <p className="text-[11px] text-slate-300">
              اطلاعیه‌های فوری ستاد برگزاری، اعلام برندگان هفتگی و زمان‌بندی جوایز.
            </p>
          </div>

          <button
            onClick={() => handleOpenMessenger('بله (Bale)', 'https://ble.ir/warroom')}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-2 transition"
          >
            <span>کانال اتاق جنگ در بله</span>
            <ExternalLink size={13} />
          </button>
        </div>

      </div>

      {/* 2. Quick Navigation Guides (مراحل مسابقه / راهنمای مسابقه) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        
        {/* Card 1: مراحل مسابقه */}
        <div 
          onClick={onOpenStages}
          className={`cursor-pointer rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border transition-all flex items-center justify-between group ${
            isGirls
              ? 'bg-[#150718] border-pink-900/50 hover:border-pink-500/70 shadow-lg'
              : 'bg-[#081224] border-slate-800 hover:border-cyan-500/70 shadow-lg'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition group-hover:scale-105 ${
              isGirls ? 'bg-pink-950/80 text-pink-400 border border-pink-800' : 'bg-cyan-950/80 text-cyan-400 border border-cyan-800'
            }`}>
              <Map size={20} />
            </div>
            <div className="text-right">
              <h5 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition">
                مراحل مسابقه
              </h5>
              <span className="text-[10px] text-slate-400">نقشه ۷ مرحله ماجراجویی</span>
            </div>
          </div>
          <span className="text-xs text-slate-500 group-hover:text-white transition">←</span>
        </div>

        {/* Card 2: راهنمای مسابقه */}
        <div 
          onClick={onOpenGuide}
          className={`cursor-pointer rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border transition-all flex items-center justify-between group ${
            isGirls
              ? 'bg-[#150718] border-pink-900/50 hover:border-pink-500/70 shadow-lg'
              : 'bg-[#081224] border-slate-800 hover:border-cyan-500/70 shadow-lg'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition group-hover:scale-105 ${
              isGirls ? 'bg-purple-950/80 text-purple-400 border border-purple-800' : 'bg-amber-950/80 text-amber-400 border border-amber-800'
            }`}>
              <BookOpen size={20} />
            </div>
            <div className="text-right">
              <h5 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition">
                راهنمای مسابقه
              </h5>
              <span className="text-[10px] text-slate-400">قوانین و نحوه امتیازگیری</span>
            </div>
          </div>
          <span className="text-xs text-slate-500 group-hover:text-white transition">←</span>
        </div>

      </div>

    </div>
  );
}
