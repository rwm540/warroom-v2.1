import React, { useState } from 'react';
import { 
  ShieldAlert, 
  User as UserIcon, 
  Users, 
  Key, 
  Phone, 
  IdCard, 
  School, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { User, Group, RoleType, EducationLevel, Gender } from '../types';
import { validateNationalCode, validatePhoneNumber, validateJalaliDate, generatePersonalCode, generateRegistrationCode } from '../utils/jalali';

interface AuthViewProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  onLoginSuccess: (user: User) => void;
  triggerAlert: (msg: string) => void;
  onBackToHome?: () => void;
  initialAuthMode?: 'login' | 'register_individual' | 'register_group';
}

const PROVINCES = [
  'تهران', 'اصفهان', 'خراسان رضوی', 'فارس', 'خوزستان', 'آذربایجان شرقی', 
  'مازندران', 'البرز', 'کرمان', 'گیلان', 'کرمانشاه', 'سیستان و بلوچستان', 'یزد', 'قم'
];

export default function AuthView({
  users,
  setUsers,
  groups,
  setGroups,
  onLoginSuccess,
  triggerAlert,
  onBackToHome,
  initialAuthMode = 'login'
}: AuthViewProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register_individual' | 'register_group'>(initialAuthMode);
  
  // Login State
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Individual Register State
  const [indForm, setIndForm] = useState({
    first_name: '',
    last_name: '',
    national_code: '',
    phone: '',
    province: 'تهران',
    city: 'تهران',
    school_name: '',
    education_level: 'متوسطه دوم' as EducationLevel,
    grade: 'یازدهم',
    gender: 'پسر' as Gender,
    birth_date: '1386/05/15',
    password: ''
  });
  const [indError, setIndError] = useState<string | null>(null);

  // Group Register State (2-step)
  const [groupStep, setGroupStep] = useState<1 | 2>(1);
  const [groupStep1, setGroupStep1] = useState({
    name: 'جوخه صاعقه ۲',
    members_count: 3, // 2 to 6
    province: 'تهران',
    city: 'تهران',
    education_level: 'متوسطه دوم' as EducationLevel,
    gender: 'پسر' as Gender
  });

  // Step 2: Leader + Members Info
  const [groupLeader, setGroupLeader] = useState({
    first_name: '',
    last_name: '',
    national_code: '',
    phone: '',
    birth_date: '1386/03/20',
    school_name: '',
    grade: 'یازدهم',
    password: ''
  });

  const [groupMembers, setGroupMembers] = useState<Array<{
    first_name: string;
    last_name: string;
    national_code: string;
    phone: string;
    birth_date: string;
    grade: string;
  }>>([
    { first_name: '', last_name: '', national_code: '', phone: '', birth_date: '1386/08/10', grade: 'یازدهم' },
    { first_name: '', last_name: '', national_code: '', phone: '', birth_date: '1386/09/12', grade: 'یازدهم' }
  ]);

  const [groupError, setGroupError] = useState<string | null>(null);

  // Quick Demo Login Handler
  const quickLogin = (role: RoleType) => {
    let targetUser = users.find(u => u.role === role);
    if (!targetUser) {
      if (role === 'admin') targetUser = users[0];
      else if (role === 'leader') targetUser = users[1];
      else targetUser = users[users.length - 1];
    }
    if (targetUser) {
      triggerAlert(`ورود موفقیت‌آمیز به عنوان ${targetUser.first_name} ${targetUser.last_name} (${targetUser.role})`);
      onLoginSuccess(targetUser);
    }
  };

  // Login Submit Handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const term = loginPhone.trim();
    const user = users.find(u => 
      (u.phone === term || u.national_code === term || u.personal_code === term) && 
      u.password === loginPassword
    );

    if (user) {
      triggerAlert(`خوش آمدید، رزمنده ${user.first_name} ${user.last_name}`);
      onLoginSuccess(user);
    } else {
      setLoginError('اطلاعات ورود اشتباه است. لطفاً شماره موبایل/کد ملی و رمز عبور را بررسی فرمایید.');
    }
  };

  // Individual Register Handler
  const handleIndRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIndError(null);

    if (!indForm.first_name || !indForm.last_name) {
      setIndError('لطفاً نام و نام خانوادگی را وارد کنید.');
      return;
    }

    if (!validateNationalCode(indForm.national_code)) {
      setIndError('کد ملی ۱۰ رقمی وارد شده معتبر نیست.');
      return;
    }

    if (users.some(u => u.national_code === indForm.national_code)) {
      setIndError('این کد ملی قبلاً در سامانه ثبت شده است.');
      return;
    }

    if (!validatePhoneNumber(indForm.phone)) {
      setIndError('شماره موبایل ۱۱ رقمی معتبر نیست (مثال: 09121234567).');
      return;
    }

    if (users.some(u => u.phone === indForm.phone)) {
      setIndError('این شماره موبایل قبلاً در سامانه ثبت شده است.');
      return;
    }

    if (!validateJalaliDate(indForm.birth_date)) {
      setIndError('تاریخ تولد شمسی معتبر نیست (فرمت: 1386/05/15).');
      return;
    }

    if (!indForm.password || indForm.password.length < 3) {
      setIndError('رمز عبور باید حداقل ۳ کاراکتر باشد.');
      return;
    }

    const personalCode = generatePersonalCode();
    const newUser: User = {
      id: `u-${Date.now()}`,
      ...indForm,
      role: 'user',
      personal_code: personalCode
    };

    setUsers(prev => [...prev, newUser]);
    triggerAlert(`ثبت‌نام انفرادی با موفقیت انجام شد! کد اختصاصی شما: ${personalCode}`);
    onLoginSuccess(newUser);
  };

  // Step 1 -> Step 2 Group Transition
  const handleGroupStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setGroupError(null);

    if (!groupStep1.name.trim()) {
      setGroupError('لطفاً نام جوخه را وارد کنید.');
      return;
    }

    // Update members count array length
    const memberNeedsCount = groupStep1.members_count - 1; // excluding leader
    const updatedMembers = [];
    for (let i = 0; i < memberNeedsCount; i++) {
      if (groupMembers[i]) {
        updatedMembers.push(groupMembers[i]);
      } else {
        updatedMembers.push({
          first_name: '',
          last_name: '',
          national_code: '',
          phone: '',
          birth_date: '1386/05/15',
          grade: groupStep1.education_level === 'متوسطه اول' ? 'هشتم' : 'یازدهم'
        });
      }
    }
    setGroupMembers(updatedMembers);
    setGroupStep(2);
  };

  // Group Final Register Handler
  const handleGroupFinalRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setGroupError(null);

    // Validate Leader
    if (!groupLeader.first_name || !groupLeader.last_name) {
      setGroupError('اطلاعات نام و نام خانوادگی فرمانده کامل نیست.');
      return;
    }
    if (!validateNationalCode(groupLeader.national_code)) {
      setGroupError('کد ملی فرمانده معتبر نیست.');
      return;
    }
    if (!validatePhoneNumber(groupLeader.phone)) {
      setGroupError('شماره موبایل فرمانده معتبر نیست.');
      return;
    }
    if (!validateJalaliDate(groupLeader.birth_date)) {
      setGroupError('تاریخ تولد فرمانده معتبر نیست.');
      return;
    }
    if (!groupLeader.password) {
      setGroupError('رمز عبور فرمانده وارد نشده است.');
      return;
    }

    // Validate Members
    for (let i = 0; i < groupMembers.length; i++) {
      const m = groupMembers[i];
      if (!m.first_name || !m.last_name) {
        setGroupError(`نام و نام خانوادگی عضو شماره ${i + 1} وارد نشده است.`);
        return;
      }
      if (!validateNationalCode(m.national_code)) {
        setGroupError(`کد ملی عضو شماره ${i + 1} معتبر نیست.`);
        return;
      }
      if (!validatePhoneNumber(m.phone)) {
        setGroupError(`شماره موبایل عضو شماره ${i + 1} معتبر نیست.`);
        return;
      }
    }

    const groupId = `g-${Date.now()}`;
    const regCode = generateRegistrationCode();

    // Create Group record
    const newGroup: Group = {
      id: groupId,
      leader_id: '',
      name: groupStep1.name,
      members_count: groupStep1.members_count,
      education_level: groupStep1.education_level,
      gender: groupStep1.gender,
      province: groupStep1.province,
      city: groupStep1.city,
      registration_code: regCode,
      created_at: '۱۴۰۳/۰۲/۲۰'
    };

    // Create Leader User
    const leaderUser: User = {
      id: `u-lead-${Date.now()}`,
      first_name: groupLeader.first_name,
      last_name: groupLeader.last_name,
      national_code: groupLeader.national_code,
      phone: groupLeader.phone,
      password: groupLeader.password,
      role: 'leader',
      education_level: groupStep1.education_level,
      grade: groupLeader.grade,
      gender: groupStep1.gender,
      province: groupStep1.province,
      city: groupStep1.city,
      birth_date: groupLeader.birth_date,
      school_name: groupLeader.school_name || 'دبیرستان ' + groupStep1.name,
      personal_code: generatePersonalCode(),
      group_id: groupId
    };

    newGroup.leader_id = leaderUser.id;

    // Create Member Users
    const memberUsers: User[] = groupMembers.map((m, idx) => ({
      id: `u-mem-${Date.now()}-${idx}`,
      first_name: m.first_name,
      last_name: m.last_name,
      national_code: m.national_code,
      phone: m.phone,
      password: groupLeader.password, // same password or default
      role: 'member',
      education_level: groupStep1.education_level,
      grade: m.grade,
      gender: groupStep1.gender,
      province: groupStep1.province,
      city: groupStep1.city,
      birth_date: m.birth_date,
      school_name: groupLeader.school_name || 'دبیرستان ' + groupStep1.name,
      personal_code: generatePersonalCode(),
      group_id: groupId
    }));

    setGroups(prev => [...prev, newGroup]);
    setUsers(prev => [...prev, leaderUser, ...memberUsers]);

    triggerAlert(`ثبت‌نام جوخه "${newGroup.name}" با موفقیت ثبت شد! کد ثبت‌نام جوخه: ${regCode}`);
    onLoginSuccess(leaderUser);
  };

  return (
    <div className="min-h-screen py-8 px-4 flex flex-col items-center justify-center relative z-10 dir-rtl">
      
      {/* Decorative Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-950/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Glass Card (Centered operational container ~520px width with 3D Depth) */}
      <div className="w-full max-w-xl cyber-card-3d rounded-3xl p-6 md:p-8 relative overflow-hidden my-auto">
        
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="absolute top-5 right-5 text-xs text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 bg-cyan-950/60 hover:bg-cyan-900/80 px-3 py-1.5 rounded-xl border border-cyan-500/30 transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)]"
          >
            <ArrowRight size={14} />
            <span>صفحه اصلی</span>
          </button>
        )}

        {/* Top Header Badge */}
        <div className="text-center space-y-2 mb-6 pt-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-rose-600 p-[1px] shadow-[0_0_25px_rgba(34,211,238,0.4)] mb-2">
            <div className="w-full h-full bg-[#070b1e] rounded-[15px] flex items-center justify-center text-cyan-400">
              <ShieldAlert size={34} className="animate-pulse" />
            </div>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">ستاد ورودی پلتفرم اتاق جنگ</h2>
          <p className="text-xs text-cyan-300/80 font-medium">سامانه ملی مسابقات، آموزش و ارزیابی استراتژیک دانش‌آموزی</p>
        </div>

        {/* Tab Toggle (ورود / ثبت‌نام انفرادی / ثبت‌نام گروهی) */}
        <div className="grid grid-cols-3 gap-1.5 bg-[#05091a] p-1.5 rounded-2xl border border-cyan-500/25 mb-6 text-xs font-bold shadow-inner">
          <button
            onClick={() => setAuthMode('login')}
            className={`py-2.5 rounded-xl transition-all ${
              authMode === 'login' 
                ? 'bg-cyan-400 text-slate-950 font-black shadow-[0_0_15px_rgba(34,211,238,0.5)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-cyan-950/30'
            }`}
          >
            ورود به سامانه
          </button>
          <button
            onClick={() => setAuthMode('register_individual')}
            className={`py-2.5 rounded-xl transition-all ${
              authMode === 'register_individual' 
                ? 'bg-cyan-400 text-slate-950 font-black shadow-[0_0_15px_rgba(34,211,238,0.5)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-cyan-950/30'
            }`}
          >
            ثبت‌نام انفرادی
          </button>
          <button
            onClick={() => { setAuthMode('register_group'); setGroupStep(1); }}
            className={`py-2.5 rounded-xl transition-all ${
              authMode === 'register_group' 
                ? 'bg-cyan-400 text-slate-950 font-black shadow-[0_0_15px_rgba(34,211,238,0.5)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-cyan-950/30'
            }`}
          >
            ثبت‌نام گروهی
          </button>
        </div>

        {/* Quick Demo Login Switcher */}
        {authMode === 'login' && (
          <div className="mb-6 bg-slate-900/80 border border-slate-800/80 rounded-xl p-3">
            <p className="text-[11px] text-slate-400 font-bold mb-2 text-center">ورود سریع آزمایشی (بدون نیاز به تایپ):</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => quickLogin('admin')}
                className="bg-amber-950/60 hover:bg-amber-900/80 border border-amber-800/60 text-amber-300 text-[11px] font-bold py-1.5 px-2 rounded-lg transition"
              >
                ادمین کل
              </button>
              <button
                onClick={() => quickLogin('leader')}
                className="bg-red-950/80 hover:bg-red-900/80 border border-red-800/60 text-red-300 text-[11px] font-bold py-1.5 px-2 rounded-lg transition"
              >
                فرمانده جوخه
              </button>
              <button
                onClick={() => quickLogin('user')}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] font-bold py-1.5 px-2 rounded-lg transition"
              >
                رزمنده انفرادی
              </button>
            </div>
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="bg-red-950/80 border border-red-800 text-red-300 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertTriangle size={16} className="flex-shrink-0 text-red-400" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">شماره موبایل / کد ملی / کد اختصاصی ۹ رقمی:</label>
              <div className="relative">
                <Phone size={16} className="absolute right-3.5 top-3.5 text-cyan-500/70" />
                <input
                  type="text"
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value)}
                  placeholder="مثال: 09121111111 یا 839201745"
                  className="w-full bg-[#05091a] border border-cyan-500/30 rounded-xl pr-10 pl-3 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.25)] transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">رمز عبور:</label>
              <div className="relative">
                <Lock size={16} className="absolute right-3.5 top-3.5 text-cyan-500/70" />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="رمز عبور خود را وارد کنید"
                  className="w-full bg-[#05091a] border border-cyan-500/30 rounded-xl pr-10 pl-3 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.25)] transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full cyber-button-3d text-slate-950 font-black text-sm py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ورود به اتاق جنگ</span>
              <ArrowLeft size={18} />
            </button>
          </form>
        )}

        {/* 2. INDIVIDUAL REGISTER FORM */}
        {authMode === 'register_individual' && (
          <form onSubmit={handleIndRegister} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {indError && (
              <div className="bg-red-950/80 border border-red-800 text-red-300 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertTriangle size={16} className="flex-shrink-0 text-red-400" />
                <span>{indError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">نام:</label>
                <input
                  type="text"
                  value={indForm.first_name}
                  onChange={(e) => setIndForm({ ...indForm, first_name: e.target.value })}
                  placeholder="مثال: علی"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">نام خانوادگی:</label>
                <input
                  type="text"
                  value={indForm.last_name}
                  onChange={(e) => setIndForm({ ...indForm, last_name: e.target.value })}
                  placeholder="مثال: محمدی"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">کد ملی ۱۰ رقمی:</label>
                <input
                  type="text"
                  maxLength={10}
                  value={indForm.national_code}
                  onChange={(e) => setIndForm({ ...indForm, national_code: e.target.value })}
                  placeholder="0012345678"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-600"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">شماره موبایل:</label>
                <input
                  type="text"
                  maxLength={11}
                  value={indForm.phone}
                  onChange={(e) => setIndForm({ ...indForm, phone: e.target.value })}
                  placeholder="09121234567"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">استان:</label>
                <select
                  value={indForm.province}
                  onChange={(e) => setIndForm({ ...indForm, province: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                >
                  {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">شهر:</label>
                <input
                  type="text"
                  value={indForm.city}
                  onChange={(e) => setIndForm({ ...indForm, city: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">نام مدرسه:</label>
              <input
                type="text"
                value={indForm.school_name}
                onChange={(e) => setIndForm({ ...indForm, school_name: e.target.value })}
                placeholder="نام مدرسه یا دبیرستان"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">مطع تحصیلی:</label>
                <select
                  value={indForm.education_level}
                  onChange={(e) => setIndForm({ ...indForm, education_level: e.target.value as EducationLevel })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                >
                  <option value="متوسطه اول">متوسطه اول</option>
                  <option value="متوسطه دوم">متوسطه دوم</option>
                  <option value="ابتدایی">ابتدایی</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">پایه:</label>
                <input
                  type="text"
                  value={indForm.grade}
                  onChange={(e) => setIndForm({ ...indForm, grade: e.target.value })}
                  placeholder="مثال: دهم"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">جنسیت:</label>
                <select
                  value={indForm.gender}
                  onChange={(e) => setIndForm({ ...indForm, gender: e.target.value as Gender })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                >
                  <option value="پسر">پسر</option>
                  <option value="دختر">دختر</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">تاریخ تولد شمسی:</label>
                <input
                  type="text"
                  value={indForm.birth_date}
                  onChange={(e) => setIndForm({ ...indForm, birth_date: e.target.value })}
                  placeholder="1386/05/15"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-600"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">رمز عبور:</label>
                <input
                  type="password"
                  value={indForm.password}
                  onChange={(e) => setIndForm({ ...indForm, password: e.target.value })}
                  placeholder="رمز عبور"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-700 hover:bg-red-600 text-white font-extrabold text-xs py-3 rounded-xl transition shadow-[0_0_15px_rgba(220,38,38,0.4)] mt-2"
            >
              تکمیل ثبت‌نام و دریافت کد اختصاصی ۹ رقمی
            </button>
          </form>
        )}

        {/* 3. GROUP REGISTER FORM (2 STEPS) */}
        {authMode === 'register_group' && (
          <div>
            {/* Step Wizard Header */}
            <div className="flex items-center justify-between mb-4 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
              <span className={`font-bold flex items-center gap-1.5 ${groupStep === 1 ? 'text-red-400' : 'text-slate-500'}`}>
                <span className="w-5 h-5 rounded-full bg-red-950 border border-red-800 flex items-center justify-center text-[10px]">۱</span>
                مشخصات اولیه جوخه
              </span>
              <span className={`font-bold flex items-center gap-1.5 ${groupStep === 2 ? 'text-red-400' : 'text-slate-500'}`}>
                <span className="w-5 h-5 rounded-full bg-red-950 border border-red-800 flex items-center justify-center text-[10px]">۲</span>
                اطلاعات فرمانده و اعضا
              </span>
            </div>

            {groupError && (
              <div className="bg-red-950/80 border border-red-800 text-red-300 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 mb-3">
                <AlertTriangle size={16} className="flex-shrink-0 text-red-400" />
                <span>{groupError}</span>
              </div>
            )}

            {/* STEP 1: Squad Specs */}
            {groupStep === 1 && (
              <form onSubmit={handleGroupStep1Next} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">نام جوخه:</label>
                  <input
                    type="text"
                    value={groupStep1.name}
                    onChange={(e) => setGroupStep1({ ...groupStep1, name: e.target.value })}
                    placeholder="مثال: جوخه صاعقه ۱"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">تعداد اعضا (۲ تا ۶ نفر):</label>
                    <select
                      value={groupStep1.members_count}
                      onChange={(e) => setGroupStep1({ ...groupStep1, members_count: parseInt(e.target.value, 10) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    >
                      <option value={2}>۲ نفر (فرمانده + ۱ عضو)</option>
                      <option value={3}>۳ نفر (فرمانده + ۲ عضو)</option>
                      <option value={4}>۴ نفر (فرمانده + ۳ عضو)</option>
                      <option value={5}>۵ نفر (فرمانده + ۴ عضو)</option>
                      <option value={6}>۶ نفر (فرمانده + ۵ عضو)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">استان:</label>
                    <select
                      value={groupStep1.province}
                      onChange={(e) => setGroupStep1({ ...groupStep1, province: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    >
                      {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">شهر:</label>
                    <input
                      type="text"
                      value={groupStep1.city}
                      onChange={(e) => setGroupStep1({ ...groupStep1, city: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">مقطع:</label>
                    <select
                      value={groupStep1.education_level}
                      onChange={(e) => setGroupStep1({ ...groupStep1, education_level: e.target.value as EducationLevel })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    >
                      <option value="متوسطه اول">متوسطه اول</option>
                      <option value="متوسطه دوم">متوسطه دوم</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">جنسیت:</label>
                    <select
                      value={groupStep1.gender}
                      onChange={(e) => setGroupStep1({ ...groupStep1, gender: e.target.value as Gender })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-2.5 text-xs text-white focus:outline-none focus:border-red-600"
                    >
                      <option value="پسر">پسر</option>
                      <option value="دختر">دختر</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-700 hover:bg-red-600 text-white font-extrabold text-xs py-3 rounded-xl transition shadow-[0_0_15px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 mt-4"
                >
                  <span>مرحله بعد: ورود اعضا</span>
                  <ArrowLeft size={16} />
                </button>
              </form>
            )}

            {/* STEP 2: Leader & Members Specs */}
            {groupStep === 2 && (
              <form onSubmit={handleGroupFinalRegister} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                
                {/* Leader Section */}
                <div className="bg-red-950/30 border border-red-800/60 p-3.5 rounded-xl space-y-2.5">
                  <span className="text-xs font-black text-red-400 block border-b border-red-900/60 pb-1">
                    مشخصات فرمانده جوخه (role=leader):
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="نام فرمانده"
                      value={groupLeader.first_name}
                      onChange={(e) => setGroupLeader({ ...groupLeader, first_name: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="نام خانوادگی فرمانده"
                      value={groupLeader.last_name}
                      onChange={(e) => setGroupLeader({ ...groupLeader, last_name: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="کد ملی ۱۰ رقمی"
                      value={groupLeader.national_code}
                      onChange={(e) => setGroupLeader({ ...groupLeader, national_code: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                      required
                    />
                    <input
                      type="text"
                      maxLength={11}
                      placeholder="شماره موبایل"
                      value={groupLeader.phone}
                      onChange={(e) => setGroupLeader({ ...groupLeader, phone: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="تاریخ تولد (شمسی)"
                      value={groupLeader.birth_date}
                      onChange={(e) => setGroupLeader({ ...groupLeader, birth_date: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                      required
                    />
                    <input
                      type="password"
                      placeholder="رمز عبور ورود جوخه"
                      value={groupLeader.password}
                      onChange={(e) => setGroupLeader({ ...groupLeader, password: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      required
                    />
                  </div>
                </div>

                {/* Squad Members Section */}
                {groupMembers.map((mem, idx) => (
                  <div key={idx} className="bg-slate-900/70 border border-slate-800 p-3 rounded-xl space-y-2">
                    <span className="text-[11px] font-bold text-slate-300 block">
                      مشخصات عضو شماره {idx + 1} (role=member):
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="نام عضو"
                        value={mem.first_name}
                        onChange={(e) => {
                          const updated = [...groupMembers];
                          updated[idx].first_name = e.target.value;
                          setGroupMembers(updated);
                        }}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        required
                      />
                      <input
                        type="text"
                        placeholder="نام خانوادگی"
                        value={mem.last_name}
                        onChange={(e) => {
                          const updated = [...groupMembers];
                          updated[idx].last_name = e.target.value;
                          setGroupMembers(updated);
                        }}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="کد ملی ۱۰ رقمی"
                        value={mem.national_code}
                        onChange={(e) => {
                          const updated = [...groupMembers];
                          updated[idx].national_code = e.target.value;
                          setGroupMembers(updated);
                        }}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                        required
                      />
                      <input
                        type="text"
                        maxLength={11}
                        placeholder="شماره موبایل"
                        value={mem.phone}
                        onChange={(e) => {
                          const updated = [...groupMembers];
                          updated[idx].phone = e.target.value;
                          setGroupMembers(updated);
                        }}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white"
                        required
                      />
                    </div>
                  </div>
                ))}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setGroupStep(1)}
                    className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-2.5 rounded-xl transition"
                  >
                    بازگشت
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 bg-red-700 hover:bg-red-600 text-white font-extrabold text-xs py-2.5 rounded-xl transition shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                  >
                    تکمیل ثبت‌نام جوخه
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
