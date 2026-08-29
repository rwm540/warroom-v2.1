import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  Users, 
  Target, 
  BookOpen, 
  Award, 
  HelpCircle, 
  Megaphone, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  FileText, 
  Send, 
  Filter, 
  ShieldAlert, 
  Download,
  Newspaper,
  Check,
  Home,
  ArrowLeft
} from 'lucide-react';
import { 
  User, 
  Group, 
  Mission, 
  MissionSubmission, 
  Training, 
  Medal, 
  UserMedal, 
  SupportTicket, 
  SupportReply, 
  Announcement, 
  News, 
  TicketType, 
  SubmissionStatus 
} from '../types';
import { formatToPersianDigits } from '../utils/jalali';

interface AdminPanelProps {
  currentUser: User;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  groups: Group[];
  missions: Mission[];
  setMissions: React.Dispatch<React.SetStateAction<Mission[]>>;
  submissions: MissionSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<MissionSubmission[]>>;
  trainings: Training[];
  setTrainings: React.Dispatch<React.SetStateAction<Training[]>>;
  medals: Medal[];
  setMedals: React.Dispatch<React.SetStateAction<Medal[]>>;
  userMedals: UserMedal[];
  setUserMedals: React.Dispatch<React.SetStateAction<UserMedal[]>>;
  tickets: SupportTicket[];
  setTickets: React.Dispatch<React.SetStateAction<SupportTicket[]>>;
  replies: SupportReply[];
  setReplies: React.Dispatch<React.SetStateAction<SupportReply[]>>;
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  news: News[];
  setNews: React.Dispatch<React.SetStateAction<News[]>>;
  triggerAlert: (msg: string) => void;
  siteSettings: any;
  setSiteSettings: (settings: any) => void;
  homeAnnouncements: any[];
  setHomeAnnouncements: React.Dispatch<React.SetStateAction<any[]>>;
  homeStats: any;
  setHomeStats: (stats: any) => void;
  faqs: any[];
  setFaqs: React.Dispatch<React.SetStateAction<any[]>>;
  onNavigate?: (tab: string) => void;
}

export default function AdminPanel({
  currentUser,
  users,
  setUsers,
  groups,
  missions,
  setMissions,
  submissions,
  setSubmissions,
  trainings,
  setTrainings,
  medals,
  setMedals,
  userMedals,
  setUserMedals,
  tickets,
  setTickets,
  replies,
  setReplies,
  announcements,
  setAnnouncements,
  news,
  setNews,
  triggerAlert,
  siteSettings,
  setSiteSettings,
  homeAnnouncements,
  setHomeAnnouncements,
  homeStats,
  setHomeStats,
  faqs,
  setFaqs,
  onNavigate
}: AdminPanelProps) {
  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'submissions' | 'users' | 'missions' | 'trainings' | 'medals' | 'tickets' | 'news' | 'site_editor'
  >('submissions');

  // LOCAL CMS FORM STATES
  const [generalTitle, setGeneralTitle] = useState(siteSettings?.heroTitle || '');
  const [generalProgress, setGeneralProgress] = useState(siteSettings?.heroProgress || '');
  const [generalCountdown, setGeneralCountdown] = useState(siteSettings?.heroCountdown || '');
  const [generalImage, setGeneralImage] = useState(siteSettings?.heroImage || '');
  const [generalBtnText, setGeneralBtnText] = useState(siteSettings?.heroButtonText || '');
  const [generalPhone, setGeneralPhone] = useState(siteSettings?.contactPhone || '');
  const [generalEmail, setGeneralEmail] = useState(siteSettings?.contactEmail || '');
  const [generalTelegram, setGeneralTelegram] = useState(siteSettings?.telegram || '');
  const [generalAddress, setGeneralAddress] = useState(siteSettings?.address || '');
  const [generalAboutText, setGeneralAboutText] = useState(siteSettings?.aboutText || '');

  // Local FAQ form state
  const [faqQ, setFaqQ] = useState('');
  const [faqA, setFaqA] = useState('');

  // Local Stats form state
  const [statMissions, setStatMissions] = useState(homeStats?.activeMissions || 0);
  const [statParticipants, setStatParticipants] = useState(homeStats?.activeParticipants || 0);
  const [statGroups, setStatGroups] = useState(homeStats?.activeGroups || 0);

  // Local Home Announcement form state
  const [annTitle, setAnnTitle] = useState('');
  const [annMsg, setAnnMsg] = useState('');
  const [annImg, setAnnImg] = useState('');

  // SUBMISSIONS GRADING STATE
  const [gradingSubId, setGradingSubId] = useState<string | null>(null);
  const [gradeStatus, setGradeStatus] = useState<SubmissionStatus>('approved');
  const [gradeScore, setGradeScore] = useState<number>(100);
  const [adminNote, setAdminNote] = useState<string>('');

  // USER SEARCH & FILTER STATE
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userProvinceFilter, setUserProvinceFilter] = useState('all');
  const [userGenderFilter, setUserGenderFilter] = useState('all');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  // MANUAL MEDAL AWARDING STATE
  const [awardPersonalCode, setAwardPersonalCode] = useState('');
  const [awardMedalId, setAwardMedalId] = useState(medals[0]?.id || '');
  const [awardNote, setAwardNote] = useState('');

  // TICKET SUPPORT SPECIALIZATION FILTER STATE
  const [ticketSpecFilter, setTicketSpecFilter] = useState<'all' | TicketType>('all');
  const [replyTicketId, setReplyTicketId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  // NEW MISSION MODAL FORM
  const [showNewMissionModal, setShowNewMissionModal] = useState(false);
  const [newMission, setNewMission] = useState({
    title: '',
    description: '',
    banner_path: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    video_url: '',
    max_score: 100,
    is_optional: false
  });

  // NEW MEDAL MODAL FORM
  const [showNewMedalModal, setShowNewMedalModal] = useState(false);
  const [newMedal, setNewMedal] = useState({
    name: '',
    description: '',
    image: '🏅',
    category: 'عملیاتی'
  });

  // SUBMIT GRADING HANDLER
  const handleGradeSubmit = (sub: MissionSubmission) => {
    const mission = missions.find(m => m.id === sub.mission_id);
    const maxScore = mission?.max_score || 100;
    const finalScore = gradeStatus === 'approved' ? Math.min(gradeScore, maxScore) : 0;

    setSubmissions(prev => prev.map(s => 
      s.id === sub.id ? {
        ...s,
        status: gradeStatus,
        awarded_score: finalScore,
        admin_note: adminNote
      } : s
    ));

    setGradingSubId(null);
    triggerAlert(`ارسال رزمنده ${sub.user_name} ارزیابی شد. وضعیت: ${gradeStatus === 'approved' ? 'تأیید' : 'رد'} | امتیاز: ${finalScore}`);
  };

  // MANUAL MEDAL AWARD SUBMIT
  const handleAwardMedalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!awardPersonalCode.trim() || !awardMedalId) return;

    const targetUser = users.find(u => u.personal_code === awardPersonalCode.trim());
    if (!targetUser) {
      triggerAlert('رزمنده‌ای با این کد اختصاصی ۹ رقمی یافت نشد.');
      return;
    }

    // Check duplicate awarding
    const exists = userMedals.some(um => um.personal_code === targetUser.personal_code && um.medal_id === awardMedalId);
    if (exists) {
      triggerAlert('این نشان قبلاً به این رزمنده اهدا گردیده است.');
      return;
    }

    const selectedMedalObj = medals.find(m => m.id === awardMedalId);

    const newUserMedal: UserMedal = {
      id: `um-${Date.now()}`,
      personal_code: targetUser.personal_code,
      medal_id: awardMedalId,
      medal_name: selectedMedalObj?.name || 'مدال شجاعت',
      note: awardNote,
      awarded_at: '۱۴۰۳/۰۲/۲۲'
    };

    setUserMedals(prev => [...prev, newUserMedal]);
    setAwardPersonalCode('');
    setAwardNote('');
    triggerAlert(`نشان "${selectedMedalObj?.name}" با موفقیت به رزمنده ${targetUser.first_name} ${targetUser.last_name} اهدا شد.`);
  };

  // ADMIN REPLY TO SUPPORT TICKET
  const handleAdminSendReply = (ticket: SupportTicket) => {
    if (!adminReplyText.trim()) return;

    const newReply: SupportReply = {
      id: `rep-${Date.now()}`,
      ticket_id: ticket.id,
      user_id: currentUser.id,
      user_name: 'پشتیبانی ستاد اتاق جنگ',
      message: adminReplyText,
      is_admin: true,
      created_at: '۱۴۰۳/۰۲/۲۲ - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };

    setReplies(prev => [...prev, newReply]);

    // Set ticket status to in_progress
    setTickets(prev => prev.map(t => 
      t.id === ticket.id ? { ...t, status: 'in_progress', admin_id: currentUser.id } : t
    ));

    setAdminReplyText('');
    setReplyTicketId(null);
    triggerAlert('پاسخ ستاد ارسال شد و وضعیت تیکت به "در حال بررسی" تغییر یافت.');
  };

  // CREATE NEW MISSION
  const handleCreateMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMission.title || !newMission.description) return;

    const missionObj: Mission = {
      id: `m-${Date.now()}`,
      title: newMission.title,
      description: newMission.description,
      banner_path: newMission.banner_path,
      video_url: newMission.video_url || undefined,
      media_type: newMission.video_url ? 'video' : 'image',
      max_score: newMission.max_score,
      is_active: true,
      is_optional: newMission.is_optional,
      created_at: '۱۴۰۳/۰۲/۲۲'
    };

    setMissions(prev => [missionObj, ...prev]);
    setShowNewMissionModal(false);
    setNewMission({
      title: '',
      description: '',
      banner_path: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      video_url: '',
      max_score: 100,
      is_optional: false
    });
    triggerAlert(`مأموریت جدید "${missionObj.title}" با موفقیت تعریف گردید.`);
  };

  // CREATE NEW MEDAL
  const handleCreateMedal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedal.name) return;

    const medalObj: Medal = {
      id: `med-${Date.now()}`,
      name: newMedal.name,
      description: newMedal.description,
      image: newMedal.image,
      category: newMedal.category,
      is_active: true
    };

    setMedals(prev => [...prev, medalObj]);
    setShowNewMedalModal(false);
    setNewMedal({ name: '', description: '', image: '🏅', category: 'عملیاتی' });
    triggerAlert(`نشان جدید "${medalObj.name}" ایجاد شد.`);
  };

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const matchesTerm = !userSearchTerm || 
      u.first_name.includes(userSearchTerm) || 
      u.last_name.includes(userSearchTerm) || 
      u.personal_code.includes(userSearchTerm) || 
      u.national_code.includes(userSearchTerm);

    const matchesProvince = userProvinceFilter === 'all' || u.province === userProvinceFilter;
    const matchesGender = userGenderFilter === 'all' || u.gender === userGenderFilter;
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;

    return matchesTerm && matchesProvince && matchesGender && matchesRole;
  });

  // Filtered Tickets by specialization
  const filteredTickets = tickets.filter(t => 
    ticketSpecFilter === 'all' || t.type === ticketSpecFilter
  );

  return (
    <div className="space-y-6 dir-rtl pb-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-[#0d1021] to-[#120712] border border-amber-800/60 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <SlidersHorizontal size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">مرکز فرماندهی و ارزیابی ادمین (اتاق جنگ)</h2>
            <p className="text-xs text-slate-400 mt-0.5">مدیریت رزمندگان، داوری مأموریت‌ها، اهدای مدال‌ها، تیکت‌های پشتیبانی و محتوا</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onNavigate && (
            <button
              onClick={() => onNavigate('Home')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white hover:border-amber-500/50 text-xs font-bold transition shadow-md group shrink-0"
            >
              <Home size={14} className="text-amber-400 group-hover:scale-110 transition" />
              <span>بازگشت به صفحه اصلی</span>
              <ArrowLeft size={14} className="text-slate-400" />
            </button>
          )}

          <div className="flex items-center gap-2 font-mono text-xs text-amber-300 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-amber-900/60">
            <span>داور فعال: {currentUser.first_name} {currentUser.last_name}</span>
          </div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="w-full overflow-x-auto no-scrollbar pb-2 border-b border-slate-800 flex items-center gap-1.5 text-xs font-bold">
        
        <button
          onClick={() => setActiveAdminTab('submissions')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap shrink-0 transition border ${
            activeAdminTab === 'submissions' 
              ? 'bg-amber-500 text-slate-950 border-amber-400 font-black' 
              : 'bg-[#080d21] text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Target size={15} />
          <span>داوری و امتیازدهی ({submissions.filter(s => s.status === 'pending').length} در انتظار)</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('users')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap shrink-0 transition border ${
            activeAdminTab === 'users' 
              ? 'bg-amber-500 text-slate-950 border-amber-400 font-black' 
              : 'bg-[#080d21] text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Users size={15} />
          <span>مدیریت کاربران ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('missions')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap shrink-0 transition border ${
            activeAdminTab === 'missions' 
              ? 'bg-amber-500 text-slate-950 border-amber-400 font-black' 
              : 'bg-[#080d21] text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Target size={15} />
          <span>تعریف مأموریت‌ها ({missions.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('medals')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap shrink-0 transition border ${
            activeAdminTab === 'medals' 
              ? 'bg-amber-500 text-slate-950 border-amber-400 font-black' 
              : 'bg-[#080d21] text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Award size={15} />
          <span>مدیریت مدال‌ها و اهدا ({medals.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('tickets')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap shrink-0 transition border ${
            activeAdminTab === 'tickets' 
              ? 'bg-amber-500 text-slate-950 border-amber-400 font-black' 
              : 'bg-[#080d21] text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <HelpCircle size={15} />
          <span>پشتیبانی و تیکت‌ها ({tickets.filter(t => t.status === 'open').length} باز)</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('trainings')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap shrink-0 transition border ${
            activeAdminTab === 'trainings' 
              ? 'bg-amber-500 text-slate-950 border-amber-400 font-black' 
              : 'bg-[#080d21] text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <BookOpen size={15} />
          <span>آموزش‌ها ({trainings.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('site_editor')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap shrink-0 transition border ${
            activeAdminTab === 'site_editor' 
              ? 'bg-amber-500 text-slate-950 border-amber-400 font-black' 
              : 'bg-[#080d21] text-slate-400 border-slate-800 hover:text-white'
          }`}
          id="btn-tab-site-editor"
        >
          <FileText size={15} />
          <span>مدیریت محتوای سایت و صفحات</span>
        </button>

      </div>

      {/* 1. SUBMISSIONS REVIEW & GRADING TAB */}
      {activeAdminTab === 'submissions' && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Target className="text-amber-400" size={18} />
            صف بازبینی و امتیازدهی به پاسخ‌های مأموریت
          </h3>

          <div className="space-y-3.5">
            {submissions.map(sub => {
              const mission = missions.find(m => m.id === sub.mission_id);
              const maxScore = mission?.max_score || 100;
              const isGradingThis = gradingSubId === sub.id;

              return (
                <div 
                  key={sub.id} 
                  className={`bg-[#070b1e] border p-3.5 sm:p-4 rounded-2xl space-y-3 transition shadow-md ${
                    sub.status === 'pending' ? 'border-amber-500/70 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'border-slate-800'
                  }`}
                >
                  <div className="flex flex-col gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-black text-xs sm:text-sm text-white tracking-wide">{sub.user_name}</span>
                      <span className="text-[11px] text-amber-400 font-mono bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">کد: {formatToPersianDigits(sub.personal_code)}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-xs text-slate-300 font-medium">مأموریت: <strong className="text-amber-200">{sub.mission_title}</strong></span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        sub.status === 'approved' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                        sub.status === 'rejected' ? 'bg-red-950 text-red-300 border-red-800' :
                        'bg-amber-950 text-amber-300 border-amber-800'
                      }`}>
                        {sub.status === 'approved' ? `تأیید شده (+${formatToPersianDigits(sub.awarded_score || 0)})` : sub.status === 'rejected' ? 'رد شده' : 'در انتظار بررسی'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>تاریخ ارسال: {sub.submitted_at}</span>
                    </div>
                  </div>

                  {/* Submission details */}
                  <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800/80 text-xs space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-300">
                      <span className="truncate max-w-[240px] sm:max-w-xs">فایل ارسالی: <strong className="text-rose-400 font-mono">{sub.file_name}</strong> <span className="text-slate-400">({sub.file_size})</span></span>
                      <button 
                        onClick={() => alert(`دانلود فایل ${sub.file_name} شبیه‌سازی شد.`)}
                        className="bg-slate-900 hover:bg-slate-800 text-cyan-300 px-3 py-1.5 rounded-lg text-[11px] font-bold border border-cyan-500/30 flex items-center justify-center gap-1.5 transition shrink-0"
                      >
                        <Download size={13} />
                        <span>دانلود / مشاهده فایل</span>
                      </button>
                    </div>

                    {sub.user_note && (
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-300">
                        <span className="text-slate-400 font-bold block mb-0.5">یادداشت رزمنده:</span>
                        <p className="leading-relaxed">«{sub.user_note}»</p>
                      </div>
                    )}
                  </div>

                  {/* Grading trigger / form */}
                  {!isGradingThis ? (
                    <button
                      onClick={() => {
                        setGradingSubId(sub.id);
                        setGradeStatus(sub.status === 'pending' ? 'approved' : sub.status);
                        setGradeScore(sub.awarded_score || maxScore);
                        setAdminNote(sub.admin_note || '');
                      }}
                      className="w-full sm:w-auto bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-bold py-2 px-4 rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <Edit3 size={14} />
                      <span>{sub.status === 'pending' ? 'ارزیابی و ثبت امتیاز' : 'ویرایش ارزیابی و بازخورد'}</span>
                    </button>
                  ) : (
                    <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/50 space-y-3">
                      <h4 className="text-xs font-black text-amber-400">فرم ثبت نمره و بازخورد هیئت داوران:</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1">وضعیت ارزیابی:</label>
                          <select
                            value={gradeStatus}
                            onChange={(e) => setGradeStatus(e.target.value as SubmissionStatus)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                          >
                            <option value="approved">تأیید شده (تخصیص امتیاز)</option>
                            <option value="rejected">رد شده (نیازمند اصلاح)</option>
                            <option value="pending">در انتظار ماندن</option>
                          </select>
                        </div>

                        {gradeStatus === 'approved' && (
                          <div>
                            <label className="block text-[11px] font-bold text-slate-300 mb-1">امتیاز اختصاصی (سقف {maxScore}):</label>
                            <input
                              type="number"
                              min={0}
                              max={maxScore}
                              value={gradeScore}
                              onChange={(e) => setGradeScore(parseInt(e.target.value, 10) || 0)}
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">بازخورد و پیام داور به رزمنده:</label>
                        <textarea
                          rows={2}
                          value={adminNote}
                          onChange={(e) => setAdminNote(e.target.value)}
                          placeholder="نکات قوت، ایرادات فنی یا پیام تشویقی..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white"
                        />
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => setGradingSubId(null)}
                          className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 rounded-xl transition"
                        >
                          انصراف
                        </button>
                        <button
                          onClick={() => handleGradeSubmit(sub)}
                          className="w-2/3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2 rounded-xl transition shadow-lg"
                        >
                          ثبت ارزیابی نهایی
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. USERS & SQUADS MANAGEMENT TAB */}
      {activeAdminTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#080d21] p-3.5 rounded-xl border border-slate-800">
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute right-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                placeholder="جستجوی نام، کد اختصاصی، کد ملی..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pr-9 pl-3 py-1.5 text-xs text-white"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <select
                value={userGenderFilter}
                onChange={(e) => setUserGenderFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 px-2 py-1.5 rounded-lg"
              >
                <option value="all">همه جنسیت‌ها</option>
                <option value="پسر">پسر</option>
                <option value="دختر">دختر</option>
              </select>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 px-2 py-1.5 rounded-lg"
              >
                <option value="all">همه نقش‌ها</option>
                <option value="leader">فرمانده</option>
                <option value="user">رزمنده انفرادی</option>
                <option value="member">عضو جوخه</option>
                <option value="admin">ادمین</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            {filteredUsers.map(u => (
              <div key={u.id} className="bg-[#080d21] border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white">{u.first_name} {u.last_name}</span>
                    <span className="bg-red-950 text-red-300 border border-red-800 text-[10px] font-mono px-2 rounded">
                      کد اختصاصی: {u.personal_code}
                    </span>
                    <span className="bg-slate-900 text-slate-400 text-[10px] px-1.5 rounded">{u.role}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    کد ملی: <span className="font-mono">{u.national_code}</span> | موبایل: <span className="font-mono">{u.phone}</span> | استان {u.province} ({u.school_name})
                  </p>
                </div>

                <div className="text-left font-mono text-[11px] text-slate-400">
                  تولد: {u.birth_date}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MISSIONS CRUD TAB */}
      {activeAdminTab === 'missions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-white">مدیریت مأموریت‌های عملیاتی</h3>
            <button
              onClick={() => setShowNewMissionModal(true)}
              className="bg-red-700 hover:bg-red-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <Plus size={16} />
              <span>ایجاد مأموریت جدید</span>
            </button>
          </div>

          {showNewMissionModal && (
            <form onSubmit={handleCreateMission} className="bg-slate-950 border border-red-900/80 p-4 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-red-400">تعریف مأموریت جدید:</h4>

              <input
                type="text"
                placeholder="عنوان مأموریت"
                value={newMission.title}
                onChange={(e) => setNewMission({ ...newMission, title: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                required
              />

              <textarea
                rows={3}
                placeholder="شرح کامل دستورالعمل مأموریت..."
                value={newMission.description}
                onChange={(e) => setNewMission({ ...newMission, description: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                required
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="سقف امتیاز (مثال: 100)"
                  value={newMission.max_score}
                  onChange={(e) => setNewMission({ ...newMission, max_score: parseInt(e.target.value, 10) || 100 })}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="لینک ویدیو یا رسانه آموزشی (اختیاری)"
                  value={newMission.video_url}
                  onChange={(e) => setNewMission({ ...newMission, video_url: e.target.value })}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewMissionModal(false)}
                  className="w-1/3 bg-slate-800 text-slate-300 text-xs font-bold py-2 rounded-lg"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-red-700 hover:bg-red-600 text-white font-bold text-xs py-2 rounded-lg transition"
                >
                  ذخیره و انتشار مأموریت
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {missions.map(m => (
              <div key={m.id} className="bg-[#080d21] border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-sm text-white">{m.title}</h4>
                    <span className="bg-amber-950 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded border border-amber-800">
                      سقف: {m.max_score}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{m.description}</p>
                </div>

                <button
                  onClick={() => {
                    setMissions(prev => prev.filter(x => x.id !== m.id));
                    triggerAlert(`مأموریت "${m.title}" حذف شد.`);
                  }}
                  className="p-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-lg border border-rose-800 transition"
                  title="حذف مأموریت"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MEDALS & MANUAL AWARDING TAB */}
      {activeAdminTab === 'medals' && (
        <div className="space-y-6">
          
          {/* Manual Award Box */}
          <div className="bg-[#080d21] border border-amber-800/80 p-5 rounded-2xl space-y-4 shadow-lg">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Award className="text-amber-400" size={20} />
              <h3 className="text-sm font-black text-white">اهدای دستی مدال به رزمنده با کد اختصاصی ۹ رقمی</h3>
            </div>

            <form onSubmit={handleAwardMedalSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">کد اختصاصی ۹ رقمی کاربر (personal_code):</label>
                  <input
                    type="text"
                    maxLength={9}
                    placeholder="مثال: 839201745"
                    value={awardPersonalCode}
                    onChange={(e) => setAwardPersonalCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">انتخاب نشان / مدال افتخار:</label>
                  <select
                    value={awardMedalId}
                    onChange={(e) => setAwardMedalId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {medals.map(m => (
                      <option key={m.id} value={m.id}>{m.image} {m.name} ({m.category})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">علت و متن تقدیرنامه اهدا:</label>
                <input
                  type="text"
                  placeholder="مثال: تقدیر ویژه ستاد جهت کسب رتبه اول در چالش سایبری..."
                  value={awardNote}
                  onChange={(e) => setAwardNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition flex items-center justify-center gap-2"
              >
                <Award size={16} />
                <span>اهدا و ثبت در پرونده رزمنده</span>
              </button>
            </form>
          </div>

          {/* Medals List & Add Medal */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400">فهرست نشان‌های تعریف‌شده در سیستم:</h3>
              <button
                onClick={() => setShowNewMedalModal(true)}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg transition"
              >
                + تعریف مدال جدید
              </button>
            </div>

            {showNewMedalModal && (
              <form onSubmit={handleCreateMedal} className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="نام نشان"
                    value={newMedal.name}
                    onChange={(e) => setNewMedal({ ...newMedal, name: e.target.value })}
                    className="bg-slate-900 border border-slate-800 p-2 text-xs text-white rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="آیکن / ایموجی نشان (مثال: 🎖️)"
                    value={newMedal.image}
                    onChange={(e) => setNewMedal({ ...newMedal, image: e.target.value })}
                    className="bg-slate-900 border border-slate-800 p-2 text-xs text-white rounded-lg"
                  />
                </div>

                <input
                  type="text"
                  placeholder="توضیحات مدال"
                  value={newMedal.description}
                  onChange={(e) => setNewMedal({ ...newMedal, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 p-2 text-xs text-white rounded-lg"
                />

                <button type="submit" className="w-full bg-amber-500 text-black font-bold text-xs py-2 rounded-lg">
                  ذخیره مدال
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {medals.map(m => (
                <div key={m.id} className="bg-[#080d21] border border-slate-800 p-3 rounded-xl flex items-center gap-3">
                  <span className="text-2xl p-2 bg-slate-950 rounded-lg border border-slate-800">{m.image}</span>
                  <div>
                    <h4 className="font-extrabold text-xs text-white">{m.name}</h4>
                    <p className="text-[11px] text-slate-400">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 5. SUPPORT TICKETS MANAGEMENT TAB */}
      {activeAdminTab === 'tickets' && (
        <div className="space-y-4">
          
          {/* Category Filter */}
          <div className="w-full overflow-x-auto no-scrollbar flex items-center gap-2 bg-[#080d21] p-3 rounded-xl border border-slate-800 text-xs font-bold whitespace-nowrap touch-pan-x">
            <span className="text-slate-400 shrink-0">فیلتر تخصصی پشتیبان:</span>
            <button
              onClick={() => setTicketSpecFilter('all')}
              className={`shrink-0 px-3 py-1.5 rounded-lg transition ${ticketSpecFilter === 'all' ? 'bg-amber-500 text-black font-black' : 'bg-slate-900 text-slate-300 hover:text-white'}`}
            >
              همه موارد
            </button>
            <button
              onClick={() => setTicketSpecFilter('technical')}
              className={`shrink-0 px-3 py-1.5 rounded-lg transition ${ticketSpecFilter === 'technical' ? 'bg-amber-500 text-black font-black' : 'bg-slate-900 text-slate-300 hover:text-white'}`}
            >
              فنی (technical)
            </button>
            <button
              onClick={() => setTicketSpecFilter('content')}
              className={`shrink-0 px-3 py-1.5 rounded-lg transition ${ticketSpecFilter === 'content' ? 'bg-amber-500 text-black font-black' : 'bg-slate-900 text-slate-300 hover:text-white'}`}
            >
              محتوا (content)
            </button>
            <button
              onClick={() => setTicketSpecFilter('judge')}
              className={`shrink-0 px-3 py-1.5 rounded-lg transition ${ticketSpecFilter === 'judge' ? 'bg-amber-500 text-black font-black' : 'bg-slate-900 text-slate-300 hover:text-white'}`}
            >
              داوری (judge)
            </button>
            <button
              onClick={() => setTicketSpecFilter('other')}
              className={`shrink-0 px-3 py-1.5 rounded-lg transition ${ticketSpecFilter === 'other' ? 'bg-amber-500 text-black font-black' : 'bg-slate-900 text-slate-300 hover:text-white'}`}
            >
              عمومی و سایر (other)
            </button>
          </div>

          <div className="space-y-3">
            {filteredTickets.map(t => (
              <div key={t.id} className="bg-[#080d21] border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <span className="font-black text-white">{t.user_name}</span>
                    <span className="text-slate-400 font-mono text-[11px] mr-2">کد: {t.personal_code}</span>
                    <span className="bg-slate-900 text-amber-400 px-2 py-0.5 rounded text-[10px] mr-2">{t.type}</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[10px]">{t.created_at}</span>
                </div>

                <p className="font-extrabold text-slate-200">{t.subject}</p>
                <p className="text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">{t.message}</p>

                {replyTicketId === t.id ? (
                  <div className="space-y-2 pt-2">
                    <textarea
                      rows={2}
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      placeholder="پاسخ کارشناس ستاد..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setReplyTicketId(null)} className="w-1/3 bg-slate-800 text-slate-300 py-1.5 rounded-lg">انصراف</button>
                      <button onClick={() => handleAdminSendReply(t)} className="w-2/3 bg-amber-500 text-black font-bold py-1.5 rounded-lg">ارسال پاسخ</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setReplyTicketId(t.id)}
                    className="bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 font-bold px-3 py-1 rounded-lg"
                  >
                    ارسال پاسخ ستاد
                  </button>
                )}
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 6. TRAININGS CRUD TAB */}
      {activeAdminTab === 'trainings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black text-white">مدیریت آموزش‌های آکادمی</h3>
          </div>

          <div className="space-y-2">
            {trainings.map(t => (
              <div key={t.id} className="bg-[#080d21] border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-black text-white">{t.title}</h4>
                  <p className="text-slate-400 mt-0.5">مخاطب: {t.target_role} | دسته‌بندی: {t.category}</p>
                </div>
                <button
                  onClick={() => {
                    setTrainings(prev => prev.filter(x => x.id !== t.id));
                    triggerAlert(`دوره "${t.title}" حذف شد.`);
                  }}
                  className="p-1.5 bg-rose-950 text-rose-300 rounded-lg border border-rose-800"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. SITE CONTENT & PAGES CMS TAB */}
      {activeAdminTab === 'site_editor' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <SlidersHorizontal className="text-amber-400 animate-pulse" size={18} />
            <h3 className="text-sm font-black text-white">پنل مدیریت محتوای داینامیک سایت و صفحات</h3>
          </div>

          {/* Grid Layout for CMS Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            
            {/* Column 1: General Settings & About Page */}
            <div className="bg-[#080d21] border border-slate-800 p-4 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <FileText className="text-cyan-400" size={16} />
                <h4 className="font-extrabold text-slate-200">تنظیمات هیرو هوم‌پیج و اطلاعات تماس</h4>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">عنوان مأموریت اصلی (هیرو):</label>
                  <input 
                    type="text" 
                    value={generalTitle} 
                    onChange={(e) => setGeneralTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">درصد پیشرفت هیرو (مثلا ۷۲٪):</label>
                    <input 
                      type="text" 
                      value={generalProgress} 
                      onChange={(e) => setGeneralProgress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">متن دکمه هیرو:</label>
                    <input 
                      type="text" 
                      value={generalBtnText} 
                      onChange={(e) => setGeneralBtnText(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">تایمر روزانه (DAYS : HRS : MINS : SECS):</label>
                    <input 
                      type="text" 
                      value={generalCountdown} 
                      onChange={(e) => setGeneralCountdown(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">تلفن پشتیبانی ستاد:</label>
                    <input 
                      type="text" 
                      value={generalPhone} 
                      onChange={(e) => setGeneralPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">آی‌دی تلگرام / پیام‌رسان‌ها:</label>
                    <input 
                      type="text" 
                      value={generalTelegram} 
                      onChange={(e) => setGeneralTelegram(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">ایمیل رسمی قرارگاه:</label>
                    <input 
                      type="text" 
                      value={generalEmail} 
                      onChange={(e) => setGeneralEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">آدرس تصویر هیرو سایت:</label>
                  <input 
                    type="text" 
                    value={generalImage} 
                    onChange={(e) => setGeneralImage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-[10px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">آدرس حضوری ستاد مرکزی:</label>
                  <input 
                    type="text" 
                    value={generalAddress} 
                    onChange={(e) => setGeneralAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">متن معرفی درباره ما (صفحه اصلی و درباره ما):</label>
                  <textarea 
                    rows={4}
                    value={generalAboutText} 
                    onChange={(e) => setGeneralAboutText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white leading-relaxed"
                  />
                </div>

                <button
                  onClick={() => {
                    setSiteSettings({
                      heroTitle: generalTitle,
                      heroProgress: generalProgress,
                      heroCountdown: generalCountdown,
                      heroImage: generalImage,
                      heroButtonText: generalBtnText,
                      contactPhone: generalPhone,
                      contactEmail: generalEmail,
                      telegram: generalTelegram,
                      address: generalAddress,
                      aboutText: generalAboutText
                    });
                    triggerAlert('تنظیمات عمومی و اطلاعات صفحات با موفقیت ذخیره و همگام‌سازی شد.');
                  }}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
                  id="btn-save-general-settings"
                >
                  <Check size={16} />
                  <span>ذخیره کلیه تغییرات و اطلاعات عمومی</span>
                </button>
              </div>
            </div>

            {/* Column 2: Stats & FAQs & Home Announcements */}
            <div className="space-y-6">
              
              {/* Stats Block */}
              <div className="bg-[#080d21] border border-slate-800 p-4 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Award className="text-amber-400" size={16} />
                  <h4 className="font-extrabold text-slate-200">آمار صفحه اصلی (Stats Strip)</h4>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">مأموریت‌ها:</label>
                    <input 
                      type="number" 
                      value={statMissions} 
                      onChange={(e) => setStatMissions(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">رزمندگان:</label>
                    <input 
                      type="number" 
                      value={statParticipants} 
                      onChange={(e) => setStatParticipants(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">جوخه‌ها:</label>
                    <input 
                      type="number" 
                      value={statGroups} 
                      onChange={(e) => setStatGroups(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setHomeStats({
                      activeMissions: statMissions,
                      activeParticipants: statParticipants,
                      activeGroups: statGroups
                    });
                    triggerAlert('آمار صفحه اصلی با موفقیت به‌روزرسانی شد.');
                  }}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2 rounded-xl transition flex items-center justify-center gap-1.5"
                >
                  <Check size={14} />
                  <span>بروزرسانی شمارنده‌های آمار</span>
                </button>
              </div>

              {/* FAQ Accordion Block */}
              <div className="bg-[#080d21] border border-slate-800 p-4 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="text-rose-400" size={16} />
                    <h4 className="font-extrabold text-slate-200">سوالات متداول (FAQ Accordion)</h4>
                  </div>
                  <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-bold">{faqs.length} سوال</span>
                </div>

                {/* FAQ Add Form */}
                <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <div className="space-y-1">
                    <input 
                      type="text" 
                      value={faqQ} 
                      onChange={(e) => setFaqQ(e.target.value)}
                      placeholder="عنوان سوال جدید را بنویسید..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <textarea 
                      rows={2}
                      value={faqA} 
                      onChange={(e) => setFaqA(e.target.value)}
                      placeholder="پاسخ کامل سوال را بنویسید..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!faqQ.trim() || !faqA.trim()) return;
                      const newFaqItem = {
                        id: `faq-${Date.now()}`,
                        question: faqQ.trim(),
                        answer: faqA.trim()
                      };
                      setFaqs(prev => [...prev, newFaqItem]);
                      setFaqQ('');
                      setFaqA('');
                      triggerAlert('سوال متداول جدید اضافه شد.');
                    }}
                    className="w-full py-1.5 text-white font-bold rounded-lg text-[11px] transition flex items-center justify-center gap-1 bg-red-900/60 hover:bg-red-800 border border-red-800"
                  >
                    <Plus size={14} />
                    <span>درج سوال جدید در لیست</span>
                  </button>
                </div>

                {/* FAQ List */}
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {faqs.map(item => (
                    <div key={item.id} className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-900 flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <p className="font-extrabold text-white text-[11px]">؟ {item.question}</p>
                        <p className="text-slate-400 text-[10px] leading-relaxed">{item.answer}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setFaqs(prev => prev.filter(x => x.id !== item.id));
                          triggerAlert('سوال متداول با موفقیت حذف گردید.');
                        }}
                        className="p-1 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg transition shrink-0"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Home Announcements block */}
              <div className="bg-[#080d21] border border-slate-800 p-4 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Megaphone className="text-emerald-400" size={16} />
                    <h4 className="font-extrabold text-slate-200">اطلاعیه‌های صفحه اصلی (Announcements)</h4>
                  </div>
                  <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-bold">{homeAnnouncements.length} اطلاعیه</span>
                </div>

                {/* Announcement Add Form */}
                <div className="space-y-2 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      value={annTitle} 
                      onChange={(e) => setAnnTitle(e.target.value)}
                      placeholder="عنوان اطلاعیه..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                    <input 
                      type="text" 
                      value={annImg} 
                      onChange={(e) => setAnnImg(e.target.value)}
                      placeholder="لینک عکس اطلاعیه..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white text-[10px]"
                    />
                  </div>
                  <textarea 
                    rows={2}
                    value={annMsg} 
                    onChange={(e) => setAnnMsg(e.target.value)}
                    placeholder="متن کامل اطلاعیه..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <button
                    onClick={() => {
                      if (!annTitle.trim() || !annMsg.trim()) return;
                      const newAnn = {
                        id: `ann-${Date.now()}`,
                        title: annTitle.trim(),
                        message: annMsg.trim(),
                        imageUrl: annImg.trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
                        createdAt: '۱۴۰۳/۰۲/۲۲',
                        isActive: true
                      };
                      setHomeAnnouncements(prev => [newAnn, ...prev]);
                      setAnnTitle('');
                      setAnnMsg('');
                      setAnnImg('');
                      triggerAlert('اطلاعیه جدید قرارگاه با موفقیت منتشر گردید.');
                    }}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[11px] transition flex items-center justify-center gap-1 border border-emerald-500"
                  >
                    <Plus size={14} />
                    <span>انتشار اطلاعیه جدید قرارگاه</span>
                  </button>
                </div>

                {/* Announcement List */}
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {homeAnnouncements.map(ann => (
                    <div key={ann.id} className="p-2 bg-slate-950/80 rounded-xl border border-slate-900 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {ann.imageUrl && (
                          <img src={ann.imageUrl} className="w-9 h-9 object-cover rounded-lg border border-slate-800" alt="" referrerPolicy="no-referrer" />
                        )}
                        <div>
                          <p className="font-extrabold text-white text-[11px]">{ann.title}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{ann.createdAt}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setHomeAnnouncements(prev => prev.filter(x => x.id !== ann.id));
                          triggerAlert('اطلاعیه قرارگاه با موفقیت حذف شد.');
                        }}
                        className="p-1 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg transition"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
