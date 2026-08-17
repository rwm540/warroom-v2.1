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
  Lock,
  Eye,
  EyeOff,
  Copy,
  UserCheck,
  UserPlus,
  Shield,
  Award
} from 'lucide-react';
import { User, Group, RoleType, EducationLevel, Gender } from '../types';
import { 
  validateNationalCode, 
  validatePhoneNumber, 
  validateJalaliDate, 
  generatePersonalCode, 
  generateRegistrationCode,
  normalizeToEnglishDigits,
  formatToPersianDigits 
} from '../utils/jalali';

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
  const [groupFlowMode, setGroupFlowMode] = useState<'create_squad' | 'join_by_code'>('create_squad');
  
  // Login State
  const [loginTerm, setLoginTerm] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
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
    password: '',
    invite_code: ''
  });
  const [showIndPassword, setShowIndPassword] = useState(false);
  const [indError, setIndError] = useState<string | null>(null);

  // Group Creation State
  const [createSquadForm, setCreateSquadForm] = useState({
    name: 'جوخه صاعقه ۱',
    members_count: 4,
    province: 'تهران',
    city: 'تهران',
    education_level: 'متوسطه دوم' as EducationLevel,
    gender: 'پسر' as Gender,
    // Leader details
    leader_first_name: '',
    leader_last_name: '',
    leader_national_code: '',
    leader_phone: '',
    leader_birth_date: '1386/03/20',
    leader_school_name: '',
    leader_grade: 'یازدهم',
    leader_password: ''
  });
  const [showLeaderPassword, setShowLeaderPassword] = useState(false);
  const [squadError, setSquadError] = useState<string | null>(null);

  // Join by Invite Code state
  const [joinForm, setJoinForm] = useState({
    invite_code: '',
    first_name: '',
    last_name: '',
    national_code: '',
    phone: '',
    birth_date: '1386/08/10',
    school_name: '',
    grade: 'یازدهم',
    password: ''
  });
  const [joinError, setJoinError] = useState<string | null>(null);

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

  // Login Submit Handler (normalizes inputs)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const term = normalizeToEnglishDigits(loginTerm);
    const user = users.find(u => 
      (normalizeToEnglishDigits(u.phone) === term || 
       normalizeToEnglishDigits(u.national_code) === term || 
       normalizeToEnglishDigits(u.personal_code) === term) && 
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

    const nationalCode = normalizeToEnglishDigits(indForm.national_code);
    const phone = normalizeToEnglishDigits(indForm.phone);
    const birthDate = normalizeToEnglishDigits(indForm.birth_date);
    const inviteCode = normalizeToEnglishDigits(indForm.invite_code).toUpperCase();

    if (!indForm.first_name.trim() || !indForm.last_name.trim()) {
      setIndError('لطفاً نام و نام خانوادگی را وارد کنید.');
      return;
    }

    if (!validateNationalCode(nationalCode)) {
      setIndError('کد ملی ۱۰ رقمی وارد شده معتبر نیست.');
      return;
    }

    if (users.some(u => normalizeToEnglishDigits(u.national_code) === nationalCode)) {
      setIndError('این کد ملی قبلاً در سامانه ثبت شده است.');
      return;
    }

    if (!validatePhoneNumber(phone)) {
      setIndError('شماره موبایل ۱۱ رقمی معتبر نیست (مثال: 09121234567).');
      return;
    }

    if (users.some(u => normalizeToEnglishDigits(u.phone) === phone)) {
      setIndError('این شماره موبایل قبلاً در سامانه ثبت شده است.');
      return;
    }

    if (!validateJalaliDate(birthDate)) {
      setIndError('تاریخ تولد شمسی معتبر نیست (فرمت: 1386/05/15).');
      return;
    }

    if (!indForm.password || indForm.password.length < 3) {
      setIndError('رمز عبور باید حداقل ۳ کاراکتر باشد.');
      return;
    }

    let joinedGroupId: string | undefined = undefined;
    if (inviteCode) {
      const targetGroup = groups.find(g => normalizeToEnglishDigits(g.registration_code).toUpperCase() === inviteCode);
      if (!targetGroup) {
        setIndError('کد دعوت جوخه وارد شده در سامانه یافت نشد.');
        return;
      }
      joinedGroupId = targetGroup.id;
    }

    const personalCode = generatePersonalCode();
    const newUser: User = {
      id: `u-${Date.now()}`,
      first_name: indForm.first_name.trim(),
      last_name: indForm.last_name.trim(),
      national_code: nationalCode,
      phone: phone,
      province: indForm.province,
      city: indForm.city.trim(),
      school_name: indForm.school_name.trim() || 'دبیرستان شهید فهمیده',
      education_level: indForm.education_level,
      grade: indForm.grade,
      gender: indForm.gender,
      birth_date: birthDate,
      password: indForm.password,
      role: joinedGroupId ? 'member' : 'user',
      personal_code: personalCode,
      group_id: joinedGroupId,
      avatar_url: indForm.gender === 'دختر' 
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };

    setUsers(prev => [...prev, newUser]);
    triggerAlert(`ثبت‌نام انفرادی با موفقیت انجام شد! کد اختصاصی شما: ${personalCode}`);
    onLoginSuccess(newUser);
  };

  // Create Squad Handler
  const handleCreateSquad = (e: React.FormEvent) => {
    e.preventDefault();
    setSquadError(null);

    const nationalCode = normalizeToEnglishDigits(createSquadForm.leader_national_code);
    const phone = normalizeToEnglishDigits(createSquadForm.leader_phone);
    const birthDate = normalizeToEnglishDigits(createSquadForm.leader_birth_date);

    if (!createSquadForm.name.trim()) {
      setSquadError('لطفاً نام جوخه را وارد کنید.');
      return;
    }

    if (!createSquadForm.leader_first_name.trim() || !createSquadForm.leader_last_name.trim()) {
      setSquadError('نام و نام خانوادگی فرمانده جوخه الزامی است.');
      return;
    }

    if (!validateNationalCode(nationalCode)) {
      setSquadError('کد ملی ۱۰ رقمی فرمانده معتبر نیست.');
      return;
    }

    if (users.some(u => normalizeToEnglishDigits(u.national_code) === nationalCode)) {
      setSquadError('این کد ملی قبلاً در سامانه ثبت شده است.');
      return;
    }

    if (!validatePhoneNumber(phone)) {
      setSquadError('شماره موبایل فرمانده معتبر نیست.');
      return;
    }

    if (!validateJalaliDate(birthDate)) {
      setSquadError('تاریخ تولد فرمانده معتبر نیست.');
      return;
    }

    if (!createSquadForm.leader_password || createSquadForm.leader_password.length < 3) {
      setSquadError('رمز عبور فرمانده باید حداقل ۳ کاراکتر باشد.');
      return;
    }

    const groupId = `g-${Date.now()}`;
    const regCode = generateRegistrationCode();

    const newGroup: Group = {
      id: groupId,
      leader_id: '',
      name: createSquadForm.name.trim(),
      members_count: createSquadForm.members_count,
      education_level: createSquadForm.education_level,
      gender: createSquadForm.gender,
      province: createSquadForm.province,
      city: createSquadForm.city.trim(),
      registration_code: regCode,
      created_at: '۱۴۰۳/۰۴/۲۰'
    };

    const leaderUser: User = {
      id: `u-lead-${Date.now()}`,
      first_name: createSquadForm.leader_first_name.trim(),
      last_name: createSquadForm.leader_last_name.trim(),
      national_code: nationalCode,
      phone: phone,
      password: createSquadForm.leader_password,
      role: 'leader',
      education_level: createSquadForm.education_level,
      grade: createSquadForm.leader_grade,
      gender: createSquadForm.gender,
      province: createSquadForm.province,
      city: createSquadForm.city.trim(),
      birth_date: birthDate,
      school_name: createSquadForm.leader_school_name.trim() || 'دبیرستان ' + createSquadForm.name,
      personal_code: generatePersonalCode(),
      group_id: groupId,
      avatar_url: createSquadForm.gender === 'دختر'
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };

    newGroup.leader_id = leaderUser.id;

    setGroups(prev => [...prev, newGroup]);
    setUsers(prev => [...prev, leaderUser]);

    triggerAlert(`جوخه "${newGroup.name}" با موفقیت ایجاد شد! کد دعوت جوخه شما: ${regCode}`);
    onLoginSuccess(leaderUser);
  };

  // Join Squad by Invite Code Handler
  const handleJoinSquadByCode = (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError(null);

    const inviteCode = normalizeToEnglishDigits(joinForm.invite_code).toUpperCase();
    const nationalCode = normalizeToEnglishDigits(joinForm.national_code);
    const phone = normalizeToEnglishDigits(joinForm.phone);
    const birthDate = normalizeToEnglishDigits(joinForm.birth_date);

    if (!inviteCode) {
      setJoinError('لطفاً کد دعوت جوخه را وارد کنید.');
      return;
    }

    const targetGroup = groups.find(g => normalizeToEnglishDigits(g.registration_code).toUpperCase() === inviteCode);
    if (!targetGroup) {
      setJoinError('کد دعوت جوخه معتبر نیست یا چنین جوخه‌ای یافت نشد.');
      return;
    }

    // Check capacity
    const currentMembersCount = users.filter(u => u.group_id === targetGroup.id).length;
    if (currentMembersCount >= targetGroup.members_count) {
      setJoinError(`ظرفیت جوخه ${targetGroup.name} (${targetGroup.members_count} نفر) تکمیل شده است.`);
      return;
    }

    if (!joinForm.first_name.trim() || !joinForm.last_name.trim()) {
      setJoinError('لطفاً نام و نام خانوادگی را وارد کنید.');
      return;
    }

    if (!validateNationalCode(nationalCode)) {
      setJoinError('کد ملی ۱۰ رقمی معتبر نیست.');
      return;
    }

    if (users.some(u => normalizeToEnglishDigits(u.national_code) === nationalCode)) {
      setJoinError('این کد ملی قبلاً در سامانه ثبت شده است.');
      return;
    }

    if (!validatePhoneNumber(phone)) {
      setJoinError('شماره موبایل معتبر نیست.');
      return;
    }

    if (!joinForm.password || joinForm.password.length < 3) {
      setJoinError('رمز عبور باید حداقل ۳ کاراکتر باشد.');
      return;
    }

    const personalCode = generatePersonalCode();
    const newMember: User = {
      id: `u-mem-${Date.now()}`,
      first_name: joinForm.first_name.trim(),
      last_name: joinForm.last_name.trim(),
      national_code: nationalCode,
      phone: phone,
      password: joinForm.password,
      role: 'member',
      education_level: targetGroup.education_level,
      grade: joinForm.grade,
      gender: targetGroup.gender,
      province: targetGroup.province,
      city: targetGroup.city,
      birth_date: birthDate,
      school_name: joinForm.school_name.trim() || 'دبیرستان ' + targetGroup.name,
      personal_code: personalCode,
      group_id: targetGroup.id,
      avatar_url: targetGroup.gender === 'دختر'
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };

    setUsers(prev => [...prev, newMember]);
    triggerAlert(`شما با موفقیت به جوخه "${targetGroup.name}" ملحق شدید!`);
    onLoginSuccess(newMember);
  };

  return (
    <div className="min-h-screen py-8 px-4 flex flex-col items-center justify-center relative z-10 dir-rtl font-sans">
      
      {/* Background Atmosphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-950/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/2 translate-x-1/2 w-80 h-80 bg-rose-950/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-xl cyber-card-3d rounded-3xl p-6 md:p-8 relative overflow-hidden my-auto border border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.9)]">
        
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-rose-600 p-[1.5px] shadow-[0_0_25px_rgba(34,211,238,0.4)] mb-1">
            <div className="w-full h-full bg-[#070b1e] rounded-[15px] flex items-center justify-center text-cyan-400">
              <ShieldAlert size={34} className="animate-pulse" />
            </div>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">ستاد ورودی پلتفرم اتاق جنگ</h2>
          <p className="text-xs text-cyan-300/80 font-medium">سامانه ملی مسابقات، آموزش و ارزیابی استراتژیک دانش‌آموزی</p>
        </div>

        {/* Main Tab Toggle: 1. Login | 2. Individual Register | 3. Squad & Invite Code */}
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
            onClick={() => setAuthMode('register_group')}
            className={`py-2.5 rounded-xl transition-all ${
              authMode === 'register_group' 
                ? 'bg-cyan-400 text-slate-950 font-black shadow-[0_0_15px_rgba(34,211,238,0.5)]' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-cyan-950/30'
            }`}
          >
            جوخه و کد دعوت
          </button>
        </div>

        {/* Quick Demo Login Switcher for evaluator convenience */}
        {authMode === 'login' && (
          <div className="mb-5 bg-slate-900/80 border border-slate-800/80 rounded-xl p-3">
            <p className="text-[11px] text-slate-400 font-bold mb-2 text-center">ورود سریع آزمایشی بدون نیاز به تایپ:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => quickLogin('admin')}
                className="bg-amber-950/60 hover:bg-amber-900/80 border border-amber-800/60 text-amber-300 text-[11px] font-bold py-1.5 px-2 rounded-lg transition"
              >
                ادمین کل ستاد
              </button>
              <button
                onClick={() => quickLogin('leader')}
                className="bg-red-950/80 hover:bg-red-900/80 border border-red-800/60 text-red-300 text-[11px] font-bold py-1.5 px-2 rounded-lg transition"
              >
                فرمانده جوخه
              </button>
              <button
                onClick={() => quickLogin('user')}
                className="bg-cyan-950/70 hover:bg-cyan-900/70 border border-cyan-800/60 text-cyan-300 text-[11px] font-bold py-1.5 px-2 rounded-lg transition"
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
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                شماره موبایل / کد ملی / کد ۹ رقمی (اعداد فارسی یا انگلیسی):
              </label>
              <div className="relative">
                <Phone size={16} className="absolute right-3.5 top-3.5 text-cyan-500/70" />
                <input
                  type="text"
                  value={loginTerm}
                  onChange={(e) => setLoginTerm(e.target.value)}
                  placeholder="مثال: 09121111111 یا 839201745"
                  className="w-full bg-[#05091a] border border-cyan-500/30 rounded-xl pr-10 pl-3 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.25)] transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">رمز عبور اختصاصی:</label>
              <div className="relative">
                <Lock size={16} className="absolute right-3.5 top-3.5 text-cyan-500/70" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="رمز عبور خود را وارد کنید"
                  className="w-full bg-[#05091a] border border-cyan-500/30 rounded-xl pr-10 pl-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.25)] transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute left-3.5 top-3.5 text-slate-400 hover:text-white"
                >
                  {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
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
          <form onSubmit={handleIndRegister} className="space-y-3.5 max-h-[62vh] overflow-y-auto pr-1">
            {indError && (
              <div className="bg-red-950/80 border border-red-800 text-red-300 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertTriangle size={16} className="flex-shrink-0 text-red-400" />
                <span>{indError}</span>
              </div>
            )}

            {/* Gender Selection Pill with Live Avatar Preview */}
            <div className="bg-[#05091a] p-3 rounded-2xl border border-cyan-500/25 space-y-2">
              <label className="block text-xs font-bold text-slate-300">جنسیت رزمنده و تم بصری:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIndForm({ ...indForm, gender: 'پسر' })}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-black transition ${
                    indForm.gender === 'پسر'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <UserIcon size={16} />
                  <span>پسر (تم سایبری آبی/طلایی)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIndForm({ ...indForm, gender: 'دختر' })}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-black transition ${
                    indForm.gender === 'دختر'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <Sparkles size={16} />
                  <span>دختر (تم یاقوتی/بنفش)</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">نام:</label>
                <input
                  type="text"
                  value={indForm.first_name}
                  onChange={(e) => setIndForm({ ...indForm, first_name: e.target.value })}
                  placeholder="مثال: علی"
                  className="w-full bg-[#05091a] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
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
                  className="w-full bg-[#05091a] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">کد ملی ۱۰ رقمی (فارسی/انگلیسی):</label>
                <input
                  type="text"
                  maxLength={10}
                  value={indForm.national_code}
                  onChange={(e) => setIndForm({ ...indForm, national_code: e.target.value })}
                  placeholder="۰۰۱۲۳۴۵۶۷۸"
                  className="w-full bg-[#05091a] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">شماره موبایل (فارسی/انگلیسی):</label>
                <input
                  type="text"
                  maxLength={11}
                  value={indForm.phone}
                  onChange={(e) => setIndForm({ ...indForm, phone: e.target.value })}
                  placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                  className="w-full bg-[#05091a] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
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
                  className="w-full bg-[#05091a] border border-cyan-500/30 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
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
                  className="w-full bg-[#05091a] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">مقطع:</label>
                <select
                  value={indForm.education_level}
                  onChange={(e) => setIndForm({ ...indForm, education_level: e.target.value as EducationLevel })}
                  className="w-full bg-[#05091a] border border-cyan-500/30 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
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
                  className="w-full bg-[#05091a] border border-cyan-500/30 rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">تاریخ تولد شمسی:</label>
                <input
                  type="text"
                  value={indForm.birth_date}
                  onChange={(e) => setIndForm({ ...indForm, birth_date: e.target.value })}
                  placeholder="1386/05/15"
                  className="w-full bg-[#05091a] border border-cyan-500/30 rounded-xl px-2 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">نام مدرسه / دبیرستان:</label>
              <input
                type="text"
                value={indForm.school_name}
                onChange={(e) => setIndForm({ ...indForm, school_name: e.target.value })}
                placeholder="دبیرستان شهید رجایی"
                className="w-full bg-[#05091a] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">کد دعوت جوخه (اختیاری):</label>
                <input
                  type="text"
                  value={indForm.invite_code}
                  onChange={(e) => setIndForm({ ...indForm, invite_code: e.target.value })}
                  placeholder="مثال: WRS-8492"
                  className="w-full bg-[#05091a] border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-amber-300 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">رمز عبور اختصاصی:</label>
                <div className="relative">
                  <input
                    type={showIndPassword ? 'text' : 'password'}
                    value={indForm.password}
                    onChange={(e) => setIndForm({ ...indForm, password: e.target.value })}
                    placeholder="رمز عبور"
                    className="w-full bg-[#05091a] border border-cyan-500/30 rounded-xl pr-3 pl-8 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowIndPassword(!showIndPassword)}
                    className="absolute left-2.5 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showIndPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:opacity-95 mt-2"
            >
              تکمیل ثبت‌نام و صدور کد اختصاصی ۹ رقمی
            </button>
          </form>
        )}

        {/* 3. SQUAD INVITE CODE MODEL */}
        {authMode === 'register_group' && (
          <div className="space-y-4 max-h-[62vh] overflow-y-auto pr-1">
            
            {/* Squad Flow Selector: Create Squad (Leader) VS Join by Invite Code */}
            <div className="grid grid-cols-2 gap-2 bg-[#05091a] p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setGroupFlowMode('create_squad')}
                className={`py-2 rounded-lg transition ${
                  groupFlowMode === 'create_squad'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ایجاد جوخه (سرگروه)
              </button>
              <button
                type="button"
                onClick={() => setGroupFlowMode('join_by_code')}
                className={`py-2 rounded-lg transition ${
                  groupFlowMode === 'join_by_code'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                عضویت با کد دعوت
              </button>
            </div>

            {/* FLOW A: CREATE SQUAD */}
            {groupFlowMode === 'create_squad' && (
              <form onSubmit={handleCreateSquad} className="space-y-3">
                {squadError && (
                  <div className="bg-red-950/80 border border-red-800 text-red-300 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <AlertTriangle size={16} className="flex-shrink-0 text-red-400" />
                    <span>{squadError}</span>
                  </div>
                )}

                <div className="bg-[#05091a] p-3 rounded-2xl border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-black">
                    <Users size={16} />
                    <span>مشخصات جوخه</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">نام جوخه:</label>
                      <input
                        type="text"
                        value={createSquadForm.name}
                        onChange={(e) => setCreateSquadForm({ ...createSquadForm, name: e.target.value })}
                        placeholder="مثال: جوخه صاعقه ۱"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">ظرفیت جوخه (۲ تا ۶ نفر):</label>
                      <select
                        value={createSquadForm.members_count}
                        onChange={(e) => setCreateSquadForm({ ...createSquadForm, members_count: parseInt(e.target.value, 10) })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value={2}>۲ نفر</option>
                        <option value={3}>۳ نفر</option>
                        <option value={4}>۴ نفر</option>
                        <option value={5}>۵ نفر</option>
                        <option value={6}>۶ نفر</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">استان:</label>
                      <select
                        value={createSquadForm.province}
                        onChange={(e) => setCreateSquadForm({ ...createSquadForm, province: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white"
                      >
                        {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">مقطع:</label>
                      <select
                        value={createSquadForm.education_level}
                        onChange={(e) => setCreateSquadForm({ ...createSquadForm, education_level: e.target.value as EducationLevel })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white"
                      >
                        <option value="متوسطه اول">متوسطه اول</option>
                        <option value="متوسطه دوم">متوسطه دوم</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-300 mb-1">جنسیت:</label>
                      <select
                        value={createSquadForm.gender}
                        onChange={(e) => setCreateSquadForm({ ...createSquadForm, gender: e.target.value as Gender })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-white"
                      >
                        <option value="پسر">پسر</option>
                        <option value="دختر">دختر</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Leader Info */}
                <div className="bg-[#05091a] p-3 rounded-2xl border border-cyan-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-black">
                    <UserCheck size={16} />
                    <span>مشخصات سرگروه / فرمانده</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="نام سرگروه"
                      value={createSquadForm.leader_first_name}
                      onChange={(e) => setCreateSquadForm({ ...createSquadForm, leader_first_name: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="نام خانوادگی سرگروه"
                      value={createSquadForm.leader_last_name}
                      onChange={(e) => setCreateSquadForm({ ...createSquadForm, leader_last_name: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="کد ملی ۱۰ رقمی سرگروه"
                      value={createSquadForm.leader_national_code}
                      onChange={(e) => setCreateSquadForm({ ...createSquadForm, leader_national_code: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-mono text-white"
                      required
                    />
                    <input
                      type="text"
                      maxLength={11}
                      placeholder="شماره موبایل سرگروه"
                      value={createSquadForm.leader_phone}
                      onChange={(e) => setCreateSquadForm({ ...createSquadForm, leader_phone: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-mono text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="تاریخ تولد (1386/03/20)"
                      value={createSquadForm.leader_birth_date}
                      onChange={(e) => setCreateSquadForm({ ...createSquadForm, leader_birth_date: e.target.value })}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-mono text-white"
                      required
                    />
                    <div className="relative">
                      <input
                        type={showLeaderPassword ? 'text' : 'password'}
                        placeholder="رمز عبور اختصاصی"
                        value={createSquadForm.leader_password}
                        onChange={(e) => setCreateSquadForm({ ...createSquadForm, leader_password: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-2.5 pl-7 py-1.5 text-xs text-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLeaderPassword(!showLeaderPassword)}
                        className="absolute left-2 top-2 text-slate-400 hover:text-white"
                      >
                        {showLeaderPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-amber-300/90 leading-relaxed bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/20">
                  پس از ثبت، یک «کد دعوت اختصاصی» برای جوخه شما صادر می‌شود که می‌توانید آن را در اختیار اعضای دیگر قرار دهید تا به جوخه شما بپیوندند.
                </p>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-lg transition"
                >
                  ثبت جوخه و دریافت کد دعوت
                </button>
              </form>
            )}

            {/* FLOW B: JOIN BY INVITE CODE */}
            {groupFlowMode === 'join_by_code' && (
              <form onSubmit={handleJoinSquadByCode} className="space-y-3">
                {joinError && (
                  <div className="bg-red-950/80 border border-red-800 text-red-300 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                    <AlertTriangle size={16} className="flex-shrink-0 text-red-400" />
                    <span>{joinError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-amber-300 mb-1">کد دعوت جوخه (دریافت شده از سرگروه):</label>
                  <input
                    type="text"
                    placeholder="مثال: WRS-8492"
                    value={joinForm.invite_code}
                    onChange={(e) => setJoinForm({ ...joinForm, invite_code: e.target.value })}
                    className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-2.5 text-xs text-amber-300 font-mono tracking-wider focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="نام عضو"
                    value={joinForm.first_name}
                    onChange={(e) => setJoinForm({ ...joinForm, first_name: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="نام خانوادگی عضو"
                    value={joinForm.last_name}
                    onChange={(e) => setJoinForm({ ...joinForm, last_name: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="کد ملی ۱۰ رقمی"
                    value={joinForm.national_code}
                    onChange={(e) => setJoinForm({ ...joinForm, national_code: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-mono text-white"
                    required
                  />
                  <input
                    type="text"
                    maxLength={11}
                    placeholder="شماره موبایل"
                    value={joinForm.phone}
                    onChange={(e) => setJoinForm({ ...joinForm, phone: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-mono text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="پایه تحصیلی (مثال: یازدهم)"
                    value={joinForm.grade}
                    onChange={(e) => setJoinForm({ ...joinForm, grade: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
                    required
                  />
                  <input
                    type="password"
                    placeholder="رمز عبور اختصاصی شما"
                    value={joinForm.password}
                    onChange={(e) => setJoinForm({ ...joinForm, password: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black text-xs shadow-lg transition hover:opacity-95"
                >
                  عضویت در جوخه و ورود به اتاق جنگ
                </button>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
