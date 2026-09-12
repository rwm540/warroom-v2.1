import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  IdCard, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  Sparkles, 
  Lock, 
  Eye, 
  EyeOff, 
  UserCheck, 
  UserPlus, 
  Shield, 
  Zap, 
  Heart, 
  KeyRound, 
  ArrowRight,
  HelpCircle,
  Phone,
  RefreshCw,
  ChevronDown,
  X
} from 'lucide-react';
import { User, Group, RoleType, Gender } from '../types';
import { 
  validateNationalCode, 
  validateJalaliDate, 
  generatePersonalCode, 
  normalizeToEnglishDigits, 
  formatToPersianDigits 
} from '../utils/jalali';
import PersianDatePicker from './PersianDatePicker';
import warroomLogoJpg from '../assets/images/warroom_logo_1787906676836.jpg';
import { isSupabaseEnabled, sha256Hex } from '../lib/supabaseData';

interface AuthViewProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  onLoginSuccess: (user: User) => void;
  triggerAlert: (msg: string) => void;
  onBackToHome?: () => void;
  initialAuthMode?: 'login' | 'register_individual' | 'register_group';
  campaignTheme?: 'girls' | 'boys';
}

export default function AuthView({
  users,
  setUsers,
  groups,
  setGroups,
  onLoginSuccess,
  triggerAlert,
  onBackToHome,
  initialAuthMode = 'register_individual',
  campaignTheme
}: AuthViewProps) {
  // Tab state: 'register' vs 'login'
  const [activeTab, setActiveTab] = useState<'register' | 'login'>(
    initialAuthMode === 'login' ? 'login' : 'register'
  );

  // Theme detection from prop or localStorage
  const [selectedGender, setSelectedGender] = useState<Gender>(() => {
    if (campaignTheme) {
      return campaignTheme === 'girls' ? 'دختر' : 'پسر';
    }
    const savedTheme = localStorage.getItem('hisstory_theme_mode');
    return savedTheme === 'girls' ? 'دختر' : 'پسر';
  });

  useEffect(() => {
    if (initialAuthMode === 'login') {
      setActiveTab('login');
    } else {
      setActiveTab('register');
    }
  }, [initialAuthMode]);

  useEffect(() => {
    if (campaignTheme) {
      const g: Gender = campaignTheme === 'girls' ? 'دختر' : 'پسر';
      setSelectedGender(g);
      setRegisterForm(prev => ({ ...prev, gender: g }));
    }
  }, [campaignTheme]);

  const isGirls = selectedGender === 'دختر';

  // 1. Unified Registration Form (Name, Surname, National ID, Birthdate)
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    nationalCode: '',
    birthDate: '1388/06/20',
    gender: selectedGender,
    password: ''
  });

  const [registerError, setRegisterError] = useState<string | null>(null);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate secure password containing uppercase, lowercase, and numbers
  const handleGenerateRandomPassword = () => {
    const uppers = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lowers = 'abcdefghjkmnpqrstuvwxyz';
    const digits = '23456789';
    const all = uppers + lowers + digits;

    // Guarantee characters from each group (avoid ambiguous chars like 0, O, 1, l)
    let generated = [
      uppers[Math.floor(Math.random() * uppers.length)],
      uppers[Math.floor(Math.random() * uppers.length)],
      lowers[Math.floor(Math.random() * lowers.length)],
      lowers[Math.floor(Math.random() * lowers.length)],
      digits[Math.floor(Math.random() * digits.length)],
      digits[Math.floor(Math.random() * digits.length)],
      all[Math.floor(Math.random() * all.length)],
      all[Math.floor(Math.random() * all.length)]
    ].sort(() => 0.5 - Math.random()).join('');

    setRegisterForm(prev => ({ ...prev, password: generated }));
    setShowRegisterPassword(true);
    triggerAlert(`رمز عبور قوی ایجاد شد: ${generated}`);
  };

  // 2. Login Form (National ID as username + Password)
  const [loginNationalId, setLoginNationalId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [detectedUser, setDetectedUser] = useState<User | null>(null);

  // Detect if there is already a saved active user session
  const [activeSessionUser, setActiveSessionUser] = useState<User | null>(() => {
    try {
      const savedUserData = localStorage.getItem('warroom_current_user_data');
      if (savedUserData) return JSON.parse(savedUserData);
      const savedId = localStorage.getItem('warroom_current_user_id');
      if (savedId) {
        const found = users.find(u => u.id === savedId);
        if (found) return found;
      }
    } catch (e) {}
    return null;
  });

  // Auto-detect registered user profile gender upon entering National ID or Personal Code
  useEffect(() => {
    const natId = normalizeToEnglishDigits(loginNationalId.trim());
    if (natId.length >= 8) {
      const found = users.find(u => 
        normalizeToEnglishDigits(u.national_code) === natId || 
        normalizeToEnglishDigits(u.personal_code) === natId
      );
      if (found) {
        setDetectedUser(found);
        // Force the theme to the registered user's gender!
        setSelectedGender(found.gender);
        const targetTheme = found.gender === 'دختر' ? 'girls' : 'boys';
        localStorage.setItem('hisstory_theme_mode', targetTheme);
        window.dispatchEvent(new Event('storage'));
      } else {
        setDetectedUser(null);
      }
    } else {
      setDetectedUser(null);
    }
  }, [loginNationalId, users]);

  // 3. Forgot Password Modal State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotNationalId, setForgotNationalId] = useState('');
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotMessage, setForgotMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // Handle Unified Register Submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);

    const nationalCode = normalizeToEnglishDigits(registerForm.nationalCode.trim());
    const birthDate = normalizeToEnglishDigits(registerForm.birthDate.trim());
    const firstName = registerForm.firstName.trim();
    const lastName = registerForm.lastName.trim();

    if (!firstName || !lastName) {
      setRegisterError('لطفاً نام و نام خانوادگی را وارد نمایید.');
      return;
    }

    if (!validateNationalCode(nationalCode)) {
      setRegisterError('کد ملی ۱۰ رقمی وارد شده معتبر نمی‌باشد.');
      return;
    }

    // Check if national code already exists
    const existing = users.find(u => normalizeToEnglishDigits(u.national_code) === nationalCode);
    if (existing) {
      setRegisterError('این کد ملی قبلاً ثبت شده است. لطفاً وارد شوید.');
      return;
    }

    if (!validateJalaliDate(birthDate)) {
      setRegisterError('فرمت تاریخ تولد معتبر نیست (مثال: 1388/06/20).');
      return;
    }

    if (!registerForm.password || registerForm.password.trim().length < 4) {
      setRegisterError('لطفاً رمز عبور را وارد نمایید (حداقل ۴ کاراکتر).');
      return;
    }

    setIsSubmitting(true);

    const personalCode = generatePersonalCode();
    const rawPassword = registerForm.password.trim();
    // در حالت Supabase رمزها به‌صورت هش SHA-256 ذخیره می‌شوند
    const storedPassword = isSupabaseEnabled ? await sha256Hex(rawPassword) : rawPassword;
    const newUser: User = {
      id: `warroom-user-${Date.now()}`,
      first_name: firstName,
      last_name: lastName,
      national_code: nationalCode,
      phone: `09${Math.floor(100000000 + Math.random() * 900000000)}`,
      province: 'تهران',
      city: 'تهران',
      school_name: 'دبیرستان شهید بهشتی',
      education_level: 'متوسطه اول',
      grade: 'هشتم',
      gender: selectedGender,
      birth_date: birthDate,
      password: storedPassword,
      role: 'user',
      personal_code: personalCode,
      avatar_url: isGirls
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };

    setTimeout(() => {
      setUsers(prev => [...prev, newUser]);
      setIsSubmitting(false);
      // Explicitly lock theme to newly registered user gender
      const targetTheme = selectedGender === 'دختر' ? 'girls' : 'boys';
      localStorage.setItem('hisstory_theme_mode', targetTheme);
      window.dispatchEvent(new Event('storage'));
      triggerAlert(`ثبت‌نام شما با موفقیت انجام شد! به اتاق جنگ خوش آمدید ${firstName} عزیز.`);
      onLoginSuccess(newUser);
    }, 400);
  };

  // Handle Login Submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const natId = normalizeToEnglishDigits(loginNationalId.trim());
    if (!natId) {
      setLoginError('لطفاً کد ملی خود را وارد کنید.');
      return;
    }

    const user = users.find(u => 
      normalizeToEnglishDigits(u.national_code) === natId || 
      normalizeToEnglishDigits(u.personal_code) === natId
    );

    if (user) {
      // رمز عبور: در حالت Supabase هش SHA-256 مقایسه می‌شود، در حالت محلی متن ساده
      const suppliedPassword = isSupabaseEnabled ? await sha256Hex(loginPassword) : loginPassword;
      if (user.password && loginPassword && user.password !== suppliedPassword) {
        setLoginError('رمز عبور وارد شده صحیح نیست. از گزینه فراموشی رمز عبور استفاده کنید.');
        return;
      }
      
      // CRITICAL: Strictly enforce the registered user's profile gender theme
      const targetTheme = user.gender === 'دختر' ? 'girls' : 'boys';
      setSelectedGender(user.gender);
      localStorage.setItem('hisstory_theme_mode', targetTheme);
      window.dispatchEvent(new Event('storage'));

      triggerAlert(`خوش آمدید ${user.first_name} ${user.last_name}`);
      onLoginSuccess(user);
    } else {
      setLoginError('کاربری با این کد ملی یافت نشد. لطفاً ابتدا ثبت‌نام کنید.');
    }
  };

  // Handle Forgot Password Step 1
  const handleForgotVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotMessage(null);
    const natId = normalizeToEnglishDigits(forgotNationalId.trim());
    const user = users.find(u => normalizeToEnglishDigits(u.national_code) === natId);

    if (!user) {
      setForgotMessage({ type: 'error', text: 'کاربری با این کد ملی در سامانه ثبت نشده است.' });
      return;
    }

    setForgotStep(2);
    setForgotMessage({ type: 'success', text: `هویت شما (${user.first_name} ${user.last_name}) تایید شد. رمز جدید را وارد کنید.` });
  };

  // Handle Forgot Password Step 2 (Update password)
  const handleForgotReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotNewPassword || forgotNewPassword.length < 4) {
      setForgotMessage({ type: 'error', text: 'رمز عبور جدید باید حداقل ۴ رقم/حرف باشد.' });
      return;
    }

    const natId = normalizeToEnglishDigits(forgotNationalId.trim());
    const hashedPassword = isSupabaseEnabled ? await sha256Hex(forgotNewPassword) : forgotNewPassword;
    setUsers(prev => prev.map(u => 
      normalizeToEnglishDigits(u.national_code) === natId 
        ? { ...u, password: hashedPassword } 
        : u
    ));

    triggerAlert('رمز عبور شما با موفقیت به‌روزرسانی شد. اکنون می‌توانید وارد شوید.');
    setShowForgotPassword(false);
    setLoginPassword(forgotNewPassword);
    setForgotStep(1);
    setForgotMessage(null);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-2.5 sm:p-4 transition-colors duration-700 dir-rtl font-sans relative overflow-x-hidden ${
      isGirls ? 'girls-atmosphere-bg text-pink-50' : 'boys-atmosphere-bg text-slate-100'
    }`}>

      {/* Atmospheric Background Lighting (Obsidian top, Crimson-red bottom-left, Electric Cobalt-blue bottom-right with crisp grid) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {isGirls ? (
          <>
            <div className="absolute top-0 inset-x-0 h-[35vh] bg-gradient-to-b from-[#020005] via-[#090112]/70 to-transparent" />
            <div className="absolute -bottom-24 -left-20 w-[550px] sm:w-[700px] h-[550px] sm:h-[700px] blur-[140px] sm:blur-[170px] rounded-full bg-[#ff1389]/30 transition-all duration-700" />
            <div className="absolute -bottom-24 -right-20 w-[600px] sm:w-[750px] h-[600px] sm:h-[750px] blur-[150px] sm:blur-[180px] rounded-full bg-[#7c3aed]/35 transition-all duration-700" />
          </>
        ) : (
          <>
            <div className="absolute top-0 inset-x-0 h-[45vh] bg-gradient-to-b from-[#000104] via-[#010309]/85 to-transparent" />
            <div className="absolute -bottom-20 -left-20 w-[550px] sm:w-[700px] h-[550px] sm:h-[700px] blur-[130px] rounded-full bg-gradient-to-tr from-[#991b1b] via-[#dc2626] to-[#e11d48] opacity-70 transition-all duration-700" />
            <div className="absolute -bottom-20 -right-20 w-[600px] sm:w-[750px] h-[600px] sm:h-[750px] blur-[140px] rounded-full bg-gradient-to-tl from-[#1e40af] via-[#2563eb] to-[#3b82f6] opacity-75 transition-all duration-700" />
            <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[550px] h-[350px] blur-[150px] rounded-full bg-[#581c87]/35" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:28px_28px] opacity-75" />
          </>
        )}
      </div>

      {/* Top Header */}
      <div className="w-full max-w-md mb-2 flex items-center justify-between z-10 px-1">
        {onBackToHome && (
          <button
            type="button"
            onClick={onBackToHome}
            className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-md cursor-pointer ${
              isGirls
                ? 'bg-[#180126]/80 hover:bg-[#25033c]/90 text-pink-200 border-fuchsia-500/50 hover:border-fuchsia-400 shadow-[0_0_15px_rgba(255,19,137,0.25)]'
                : 'bg-[#0a1226]/80 hover:bg-[#121e3d]/90 text-blue-200 border-blue-500/50 hover:border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.25)]'
            }`}
            title="بازگشت به صفحه اصلی سایت"
          >
            <ArrowRight size={16} className="text-amber-400 group-hover:-translate-x-1 transition-transform" />
            <span>صفحه اصلی سایت</span>
          </button>
        )}

        <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-mono mr-auto">
          <Shield size={14} className={isGirls ? 'text-fuchsia-400' : 'text-blue-400'} />
          <span>{isGirls ? 'بخش دختران' : 'بخش پسران'}</span>
        </div>
      </div>

      {/* Main Card */}
      <div className={`w-full max-w-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-2xl relative z-10 border transition-all duration-300 shadow-2xl my-auto ${
        isGirls
          ? 'girls-card-surface border-fuchsia-500/40 shadow-[0_0_60px_rgba(255,19,137,0.3)]'
          : 'boys-card-surface border-blue-500/40 shadow-[0_0_60px_rgba(37,99,235,0.3)]'
      }`}>

        {/* 1. Luminous Neon Logo Header (Clean - No unnecessary text) */}
        <div className="flex flex-col items-center justify-center space-y-2 mb-3.5 text-center">
          <div className={`relative p-1.5 rounded-2xl transition-transform hover:scale-105 duration-300 ${
            isGirls ? 'neon-logo-glow-girls' : 'neon-logo-glow'
          }`}>
            <img 
              src={warroomLogoJpg} 
              alt="لوگوی اتاق جنگ" 
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl border-2 border-white/20 shadow-2xl"
            />
          </div>

          <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${
            isGirls ? 'neon-text-girls' : 'neon-text-cyan'
          }`}>
            اتاق جنگ
          </h1>

          {/* Mode Switcher Tabs */}
          <div className="w-full grid grid-cols-2 gap-1 p-1 rounded-2xl bg-slate-950/90 border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setRegisterError(null);
              }}
              className={`py-1.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? isGirls
                    ? 'girls-button-neon text-white shadow-lg'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-900/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus size={14} />
              <span>ثبت‌نام جدید</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setLoginError(null);
              }}
              className={`py-1.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? isGirls
                    ? 'girls-button-neon text-white shadow-lg'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-900/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck size={14} />
              <span>ورود به بازی</span>
            </button>
          </div>
        </div>

        {/* Active Session Fast Direct Entry Banner */}
        {activeSessionUser && (
          <div className={`mb-4 p-3.5 rounded-2xl border flex flex-col gap-2.5 shadow-xl animate-fade-in ${
            activeSessionUser.gender === 'دختر'
              ? 'bg-pink-950/70 border-pink-500/50 shadow-pink-950/40'
              : 'bg-cyan-950/70 border-cyan-500/50 shadow-cyan-950/40'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className={activeSessionUser.gender === 'دختر' ? 'text-pink-400' : 'text-cyan-400'} />
                <span className="text-xs font-black text-white">نشست فعال شما ذخیره است</span>
              </div>
              <span className="text-[10px] font-mono text-slate-300">
                {activeSessionUser.personal_code}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed text-right">
              رزمنده گرامی <strong className="text-white">{activeSessionUser.first_name} {activeSessionUser.last_name}</strong>، شما قبلاً وارد سامانه شده‌اید. نیازی به ورود یا ثبت‌نام مجدد نیست.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => onLoginSuccess(activeSessionUser)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                  activeSessionUser.gender === 'دختر'
                    ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-pink-900/50 hover:brightness-110'
                    : 'bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 shadow-cyan-900/50 hover:brightness-110'
                }`}
              >
                <ArrowLeft size={16} />
                <span>ورود مستقیم به پنل کاربری ({activeSessionUser.first_name})</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('warroom_current_user_id');
                  localStorage.removeItem('warroom_current_user_data');
                  setActiveSessionUser(null);
                  triggerAlert('نشست قبلی پاک شد. اکنون می‌توانید ثبت‌نام یا ورود جدید انجام دهید.');
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 text-[11px] font-bold transition whitespace-nowrap"
              >
                خروج و تعویض
              </button>
            </div>
          </div>
        )}

        {/* 2. Unified Registration Form */}
        {activeTab === 'register' ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            
            {registerError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs flex items-center gap-2">
                <AlertTriangle size={15} className="text-rose-400 shrink-0" />
                <span>{registerError}</span>
              </div>
            )}

            {/* Gender Selection */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 block">انتخاب جنسیت</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGender('پسر');
                    setRegisterForm({ ...registerForm, gender: 'پسر' });
                    localStorage.setItem('hisstory_theme_mode', 'boys');
                    window.dispatchEvent(new Event('storage'));
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                    selectedGender === 'پسر'
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-950/70 text-slate-300 border-slate-700/80 hover:bg-slate-900'
                  }`}
                >
                  <Zap size={14} />
                  <span>پسران (ویژه رزمندگان)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGender('دختر');
                    setRegisterForm({ ...registerForm, gender: 'دختر' });
                    localStorage.setItem('hisstory_theme_mode', 'girls');
                    window.dispatchEvent(new Event('storage'));
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                    selectedGender === 'دختر'
                      ? 'bg-pink-500 text-white border-pink-400 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                      : 'bg-slate-950/70 text-slate-300 border-slate-700/80 hover:bg-slate-900'
                  }`}
                >
                  <Heart size={14} />
                  <span>دختران (ویژه رزمندگان)</span>
                </button>
              </div>
            </div>

            {/* Name & Surname */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 block">نام</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: علی / سارا"
                  value={registerForm.firstName}
                  onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl bg-slate-950/70 border border-slate-700/80 focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 focus:outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 block">نام خانوادگی</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: محمدی"
                  value={registerForm.lastName}
                  onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl bg-slate-950/70 border border-slate-700/80 focus:border-cyan-400 text-xs text-white placeholder:text-slate-500 focus:outline-none transition"
                />
              </div>
            </div>

            {/* National ID & Birthdate */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 block">کد ملی (نام کاربری)</label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  placeholder="۰۰۱۱۱۱۱۱۱۱"
                  value={registerForm.nationalCode}
                  onChange={(e) => setRegisterForm({ ...registerForm, nationalCode: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl bg-slate-950/70 border border-slate-700/80 focus:border-cyan-400 text-xs text-white font-mono placeholder:text-slate-500 focus:outline-none transition text-left"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300 block">تاریخ تولد (شمسی)</label>
                <PersianDatePicker
                  value={registerForm.birthDate}
                  onChange={(val) => setRegisterForm({ ...registerForm, birthDate: val })}
                  isGirls={isGirls}
                  required
                />
              </div>
            </div>

            {/* Password (Required with Auto Generator & Eye Toggle) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-300 block">
                  رمز عبور <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateRandomPassword}
                  className={`text-[11px] font-bold flex items-center gap-1 transition px-2 py-0.5 rounded-lg border ${
                    isGirls
                      ? 'text-pink-400 hover:text-pink-300 bg-pink-950/40 border-pink-500/30 hover:border-pink-500/60'
                      : 'text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 border-cyan-500/30 hover:border-cyan-500/60'
                  }`}
                  title="تولید رمز عبور قوی ترکیبی (حروف بزرگ، کوچک و عدد)"
                >
                  <KeyRound size={12} />
                  <span>تولید خودکار رمز</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type={showRegisterPassword ? 'text' : 'password'}
                  required
                  placeholder="رمز عبور دلخواه یا تولید خودکار"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  className="w-full py-2 px-3 pr-9 pl-9 rounded-xl bg-slate-950/70 border border-slate-700/80 focus:border-cyan-400 text-xs text-white font-mono placeholder:text-slate-500 focus:outline-none transition text-left"
                />
                <Lock size={15} className="absolute right-3 top-2.5 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-200 transition"
                  title={showRegisterPassword ? "مخفی‌سازی رمز" : "نمایش رمز"}
                >
                  {showRegisterPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-2xl font-black text-xs sm:text-sm transition transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-xl ${
                isGirls
                  ? 'girls-button-neon text-white shadow-[0_0_25px_rgba(255,19,137,0.4)]'
                  : 'bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 text-slate-950 shadow-cyan-900/40'
              }`}
            >
              <Sparkles size={16} />
              <span>{isSubmitting ? 'در حال راه‌اندازی...' : 'ثبت‌نام و ورود به بازی'}</span>
              <ArrowLeft size={16} />
            </button>

          </form>
        ) : (
          /* 3. Login Form with National ID & Password & Forgot Password */
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs flex items-center gap-2">
                <AlertTriangle size={15} className="text-rose-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300 block">
                کد ملی (نام کاربری):
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="کد ملی ۱۰ رقمی"
                  value={loginNationalId}
                  onChange={(e) => setLoginNationalId(e.target.value)}
                  className={`w-full py-2.5 px-3 pr-9 rounded-xl bg-slate-950/70 border text-xs text-white font-mono placeholder:text-slate-500 focus:outline-none transition text-left ${
                    isGirls ? 'border-pink-500/40 focus:border-pink-400' : 'border-slate-700/80 focus:border-cyan-400'
                  }`}
                />
                <IdCard size={15} className={`absolute right-3 top-3 ${isGirls ? 'text-pink-400' : 'text-slate-400'}`} />
              </div>

              {detectedUser && (
                <div className={`mt-1.5 p-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5 border transition-all ${
                  detectedUser.gender === 'دختر'
                    ? 'bg-rose-950/80 border-rose-500/50 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.25)]'
                    : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                }`}>
                  <UserCheck size={14} className={detectedUser.gender === 'دختر' ? 'text-rose-400' : 'text-cyan-400'} />
                  <span>
                    کاربر گرامی {detectedUser.first_name} {detectedUser.last_name} ({detectedUser.gender === 'دختر' ? 'بخش ویژه دختران' : 'بخش ویژه پسران'} — پوسته {detectedUser.gender === 'دختر' ? 'دخترانه' : 'پسرانه'} تثبیت شد)
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-300 block">
                  رمز عبور:
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setForgotNationalId(loginNationalId);
                  }}
                  className={`text-[10px] hover:underline transition ${
                    isGirls ? 'text-pink-400 hover:text-pink-300' : 'text-cyan-400 hover:text-cyan-300'
                  }`}
                >
                  فراموشی رمز عبور؟
                </button>
              </div>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="رمز عبور خود را وارد کنید"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className={`w-full py-2.5 px-3 pr-9 pl-9 rounded-xl bg-slate-950/70 border text-xs text-white font-mono placeholder:text-slate-500 focus:outline-none transition text-left ${
                    isGirls ? 'border-pink-500/40 focus:border-pink-400' : 'border-slate-700/80 focus:border-cyan-400'
                  }`}
                />
                <Lock size={15} className={`absolute right-3 top-3 ${isGirls ? 'text-pink-400' : 'text-slate-400'}`} />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute left-3 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showLoginPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-2xl font-black text-xs sm:text-sm transition transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-xl ${
                isGirls
                  ? 'girls-button-neon text-white shadow-[0_0_25px_rgba(255,19,137,0.4)]'
                  : 'bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 text-slate-950 shadow-cyan-900/40'
              }`}
            >
              <UserCheck size={16} />
              <span>ورود مستقیم به بازی</span>
              <ArrowLeft size={16} />
            </button>

            {/* حساب پیش‌فرض مدیر سامانه (تنها حساب پیش‌فرض ورود به پنل مدیریت) */}
            <details className="group rounded-xl border border-slate-700/60 bg-slate-950/50 overflow-hidden">
              <summary className="flex items-center justify-between gap-2 px-3 py-2 cursor-pointer select-none text-[10px] font-bold text-slate-400 hover:text-slate-200 transition list-none">
                <span className="flex items-center gap-1.5">
                  <Shield size={12} className="text-amber-400" />
                  ورود مدیر سامانه (پنل مدیریت)
                </span>
                <ChevronDown size={12} className="transition group-open:rotate-180" />
              </summary>
              <div className="px-3 pb-2.5 pt-1 space-y-1.5 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">کد ملی مدیر:</span>
                  <code className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-cyan-300 font-mono tracking-wider" dir="ltr">0012345678</code>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">رمز عبور پیش‌فرض:</span>
                  <code className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-amber-300 font-mono tracking-wider" dir="ltr">admin</code>
                </div>
                <p className="text-[9px] text-slate-600 leading-relaxed pt-0.5">
                  پس از نخستین ورود، رمز عبور را از بخش مدیریت کاربران تغییر دهید.
                </p>
              </div>
            </details>

          </form>
        )}

      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 dir-rtl overflow-y-auto">
          <div className="bg-[#0b1226] border border-cyan-500/40 rounded-3xl p-5 sm:p-6 max-w-sm w-full space-y-4 text-white shadow-2xl relative my-auto max-h-[85vh] sm:max-h-[88vh] overflow-y-auto">
            
            <button
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-900"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                <KeyRound size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">بازیابی رمز عبور</h3>
                <p className="text-[10px] text-slate-400">تغییر رمز عبور با اعتبارسنجی کد ملی</p>
              </div>
            </div>

            {forgotMessage && (
              <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                forgotMessage.type === 'error' 
                  ? 'bg-rose-950 border border-rose-500/60 text-rose-200' 
                  : 'bg-emerald-950 border border-emerald-500/60 text-emerald-200'
              }`}>
                <span>{forgotMessage.text}</span>
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleForgotVerify} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 block">کد ملی ثبت‌شده در سامانه:</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="۰۰۱۱۱۱۱۱۱۱"
                    value={forgotNationalId}
                    onChange={(e) => setForgotNationalId(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono text-left focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs transition"
                >
                  بررسی و تایید هویت
                </button>
              </form>
            ) : (
              <form onSubmit={handleForgotReset} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 block">رمز عبور جدید:</label>
                  <input
                    type="password"
                    required
                    placeholder="حداقل ۴ کاراکتر"
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono text-left focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition"
                >
                  ثبت رمز جدید و بازگشت
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
