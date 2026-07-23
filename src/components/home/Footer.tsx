import React, { useState } from 'react';
import { 
  Shield, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  Info, 
  FileText, 
  Lock,
  Copy,
  Check,
  CreditCard,
  Building2,
  X,
  Send,
  MessageCircle
} from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenAbout: () => void;
}

export default function Footer({ onNavigate, onOpenAbout }: FooterProps) {
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);
  const [activeTrustModal, setActiveTrustModal] = useState<'enamad' | 'zarinpal' | 'contact' | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedChannel(id);
    setTimeout(() => setCopiedChannel(null), 2000);
  };

  return (
    <footer className="mt-12 mb-20 md:mb-6 px-4 py-8 border-t border-cyan-500/30 bg-[#05091a]/95 text-slate-200 dir-rtl rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.8)] relative overflow-hidden">
      
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-600/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-amber-600/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Top Grid: Brand Info + Communication Channels + Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right pb-8 border-b border-cyan-500/15">
          
          {/* Col 1: About Platform & Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-red-800 to-black p-[1px] shadow-[0_0_12px_rgba(220,38,38,0.5)]">
                <div className="w-full h-full bg-[#070b1e] rounded-[11px] flex items-center justify-center text-red-500 font-bold">
                  <Shield size={22} className="animate-pulse" />
                </div>
              </div>
              <div>
                <h2 className="text-sm font-black text-white tracking-tight">سامانه ملی «اتاق جنگ»</h2>
                <p className="text-[10px] text-cyan-400 font-mono font-semibold">WAR ROOM STRATEGIC PLATFORM</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed text-justify">
              تنها سامانه رسمی ارزیابی، مسابقه و آموزش‌های استراتژیک دانش‌آموزی کشور تحت نظارت قرارگاه مرکزی. این مجموعه با هدف توانمندسازی فکری، تفکر تفکیکی و ارتقای آمادگی نخبگان نوجوان فعالیت می‌کند.
            </p>

            {/* Quick Links Row */}
            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={onOpenAbout}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
              >
                <Info size={14} />
                <span>درباره ما و قوانین</span>
              </button>
              <span className="text-slate-700">•</span>
              <button 
                onClick={() => setActiveTrustModal('contact')}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
              >
                <Phone size={14} />
                <span>اطلاعات تماس</span>
              </button>
            </div>
          </div>

          {/* Col 2: Official Communication Channels (Rubika & Eitaa ONLY) */}
          <div className="space-y-3 bg-[#080e26]/80 p-4 rounded-2xl border border-cyan-500/20 shadow-inner">
            <div className="flex items-center gap-2 text-cyan-300 font-black text-xs border-b border-cyan-500/20 pb-2">
              <Send size={16} className="text-cyan-400" />
              <span>کانال‌های ارتباطی رسمی (روبیکا و ایتا)</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-snug">
              اطلاعیه‌ها، اخبار مسابقات و نتایج داوری صرفاً از طریق دو کانال زیر منتشر می‌شود:
            </p>

            <div className="space-y-2.5 pt-1">
              
              {/* Eitaa Messenger Channel Badge */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#141d38] border border-amber-500/30 hover:border-amber-400/60 transition group">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 font-black text-xs shadow-md">
                    ایتا
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">کانال رسمی در ایتا</span>
                    <span className="text-[10px] text-amber-300/90 font-mono dir-ltr block">@WarRoom_ir</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => copyToClipboard('@WarRoom_ir', 'eitaa')}
                    className="p-1.5 rounded-lg bg-slate-900/90 text-amber-300 hover:text-white border border-slate-700/80 text-[10px] font-bold flex items-center gap-1 transition"
                    title="کپی شناسه ایتا"
                  >
                    {copiedChannel === 'eitaa' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedChannel === 'eitaa' ? 'کپی شد' : 'کپی'}</span>
                  </button>

                  <a
                    href="https://eitaa.com/WarRoom_ir"
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] flex items-center gap-1 transition shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                  >
                    <span>عضویت</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Rubika Messenger Channel Badge */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#141d38] border border-rose-500/30 hover:border-rose-400/60 transition group">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 flex items-center justify-center text-white font-black text-xs shadow-md">
                    روبیکا
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">کانال رسمی در روبیکا</span>
                    <span className="text-[10px] text-rose-300/90 font-mono dir-ltr block">@WarRoom_ir</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => copyToClipboard('@WarRoom_ir', 'rubika')}
                    className="p-1.5 rounded-lg bg-slate-900/90 text-rose-300 hover:text-white border border-slate-700/80 text-[10px] font-bold flex items-center gap-1 transition"
                    title="کپی شناسه روبیکا"
                  >
                    {copiedChannel === 'rubika' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedChannel === 'rubika' ? 'کپی شد' : 'کپی'}</span>
                  </button>

                  <a
                    href="https://rubika.ir/WarRoom_ir"
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-black text-[10px] flex items-center gap-1 transition shadow-[0_0_10px_rgba(225,29,72,0.3)]"
                  >
                    <span>عضویت</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Col 3: Contact & Support Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-cyan-300 font-black text-xs border-b border-cyan-500/20 pb-2">
              <Phone size={16} className="text-cyan-400" />
              <span>ارتباط با دبیرخانه و پشتیبانی</span>
            </div>

            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-amber-400 shrink-0" />
                <span>تلفن پشتیبانی:</span>
                <span className="font-mono font-bold text-white text-xs dir-ltr">۰۲۱-۸۸۹۹۷۷۶۶</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="text-amber-400 shrink-0" />
                <span>ساعات پاسخگویی:</span>
                <span className="text-slate-300">شنبه تا چهارشنبه ۸:۰۰ الی ۱۶:۰۰</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-amber-400 shrink-0" />
                <span>پست الکترونیکی:</span>
                <span className="font-mono text-cyan-300">support@warroom.ir</span>
              </li>
              <li className="flex items-start gap-2 pt-1">
                <MapPin size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 text-[11px] leading-relaxed">
                  نشانی: تهران، خیابان آزادی، مرکز فناوری و نوآوری‌های استراتژیک، پلاک ۱۱۰
                </span>
              </li>
            </ul>

            <div className="pt-1">
              <button
                onClick={() => onNavigate('Support')}
                className="w-full bg-cyan-950/80 hover:bg-cyan-900/90 border border-cyan-500/50 text-cyan-300 font-bold text-xs py-2 rounded-xl transition flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
              >
                <MessageCircle size={15} />
                <span>ارسال تیکت پشتیبانی آنلاین ۲۴/۷</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Trust Badges (eNamad & ZarinPal) + Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2">
          
          {/* Copyright text */}
          <div className="text-[11px] text-slate-400 font-medium text-center md:text-right space-y-1">
            <p className="text-slate-200 font-bold">
              © ۱۴۰۳ تمامی حقوق مادی و معنوی متعلق به قرارگاه مرکزی مسابقات استراتژیک «اتاق جنگ» می‌باشد.
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              طراحی و توسعه یافته با استاندارد امنیتی AES-256 و پروتکل TLS 1.3
            </p>
          </div>

          {/* Official Electronic Badges: eNamad & ZarinPal */}
          <div className="flex items-center justify-center gap-3 shrink-0">
            
            {/* eNamad Badge */}
            <button
              onClick={() => setActiveTrustModal('enamad')}
              className="group flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-[#080d22] border border-amber-500/40 hover:border-amber-400 transition shadow-[0_0_15px_rgba(245,158,11,0.15)] text-right"
              title="برای مشاهده تاییدیه نماد اعتماد الکترونیکی کلیک کنید"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/50 flex flex-col items-center justify-center text-amber-400 shrink-0 group-hover:scale-105 transition">
                <Building2 size={18} />
                <span className="text-[8px] font-black mt-0.5">اینماد</span>
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black text-white">نماد اعتماد الکترونیکی</span>
                  <CheckCircle2 size={12} className="text-emerald-400" />
                </div>
                <span className="text-[9px] text-amber-300/80 font-mono font-bold block mt-0.5">وزارت صنعت، معدن و تجارت</span>
              </div>
            </button>

            {/* ZarinPal Badge */}
            <button
              onClick={() => setActiveTrustModal('zarinpal')}
              className="group flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-[#080d22] border border-cyan-500/40 hover:border-cyan-400 transition shadow-[0_0_15px_rgba(6,182,212,0.15)] text-right"
              title="برای مشاهده تاییدیه درگاه ایمن زرین‌پال کلیک کنید"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex flex-col items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition">
                <CreditCard size={18} />
                <span className="text-[8px] font-black mt-0.5">زرین‌پال</span>
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black text-white">درگاه پرداخت زرین‌پال</span>
                  <Lock size={12} className="text-emerald-400" />
                </div>
                <span className="text-[9px] text-cyan-300/80 font-mono font-bold block mt-0.5">پرداخت ایمن ۲۵۶ بیتی</span>
              </div>
            </button>

          </div>

        </div>

      </div>

      {/* TRUST & VERIFICATION MODALS */}
      {activeTrustModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 dir-rtl">
          <div className="bg-[#080d24] border border-cyan-500/50 rounded-3xl p-6 max-w-sm w-full text-right shadow-[0_0_50px_rgba(6,182,212,0.4)] relative space-y-4">
            
            <button
              onClick={() => setActiveTrustModal(null)}
              className="absolute top-4 left-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X size={18} />
            </button>

            {activeTrustModal === 'enamad' && (
              <>
                <div className="flex items-center gap-3 border-b border-amber-500/30 pb-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-950 text-amber-400 border border-amber-500 flex items-center justify-center">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">نماد اعتماد الکترونیکی (اینماد)</h3>
                    <span className="text-[10px] text-amber-300 font-mono">احراز هویت و صلاحیت قانونی</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300 leading-relaxed bg-[#050818] p-3.5 rounded-2xl border border-slate-800">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">نام کسب‌وکار:</span>
                    <span className="font-bold text-white">سامانه ملی اتاق جنگ</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">شماره مجوز اینماد:</span>
                    <span className="font-mono text-amber-400 font-bold">۱۴۰۳/۹۸۷۴۲۱</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">وضعیت نماد:</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      تأیید شده و فعال (۵ ستاره)
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">مرجع صدور:</span>
                    <span className="text-slate-200">وزارت صنعت، معدن و تجارت</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTrustModal(null)}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition"
                >
                  تایید و بستن
                </button>
              </>
            )}

            {activeTrustModal === 'zarinpal' && (
              <>
                <div className="flex items-center gap-3 border-b border-cyan-500/30 pb-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-950 text-cyan-400 border border-cyan-500 flex items-center justify-center">
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">درگاه پرداخت اینترنتی زرین‌پال</h3>
                    <span className="text-[10px] text-cyan-300 font-mono">تضمین امنیت تراکنش‌ها</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300 leading-relaxed bg-[#050818] p-3.5 rounded-2xl border border-slate-800">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">عنوان درگاه:</span>
                    <span className="font-bold text-white">زرین‌پال (ZarinPal Verified)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">شناسه درگاه (Merchant ID):</span>
                    <span className="font-mono text-cyan-300 font-bold">98743201-warroom</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">سطح امنیت:</span>
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <Lock size={12} />
                      پروتکل رمزنگاری SSL 256-bit
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">وضعیت اتصال:</span>
                    <span className="text-emerald-400 font-bold">مستقیم به شبکه شتاب</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTrustModal(null)}
                  className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs transition"
                >
                  تایید و بستن
                </button>
              </>
            )}

            {activeTrustModal === 'contact' && (
              <>
                <div className="flex items-center gap-3 border-b border-cyan-500/30 pb-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 border border-amber-500 flex items-center justify-center">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">اطلاعات کامل ارتباط با دبیرخانه</h3>
                    <span className="text-[10px] text-slate-400">ستاد مرکزی مسابقات اتاق جنگ</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300 bg-[#050818] p-3.5 rounded-2xl border border-slate-800">
                  <p>
                    <strong>تلفن مستقیم:</strong> <span className="font-mono font-bold text-amber-400 text-sm">۰۲۱-۸۸۹۹۷۷۶۶</span>
                  </p>
                  <p>
                    <strong>کانال ایتا:</strong> <span className="font-mono text-amber-300">@WarRoom_ir</span>
                  </p>
                  <p>
                    <strong>کانال روبیکا:</strong> <span className="font-mono text-rose-400">@WarRoom_ir</span>
                  </p>
                  <p>
                    <strong>آدرس:</strong> تهران، خیابان آزادی، مرکز نوآوری و فناوری‌های استراتژیک، پلاک ۱۱۰
                  </p>
                </div>

                <button
                  onClick={() => setActiveTrustModal(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
                >
                  بستن
                </button>
              </>
            )}

          </div>
        </div>
      )}

    </footer>
  );
}
