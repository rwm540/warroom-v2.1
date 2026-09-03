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
  ArrowLeft,
  Headphones,
  MessageSquare,
  CheckCircle,
  RefreshCw,
  AlertTriangle,
  Bell,
  Radio,
  Volume2,
  Zap,
  ExternalLink,
  ShieldCheck,
  Sparkles
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
  TicketStatus,
  SubmissionStatus,
  AppNotification,
  NotificationType,
  NotificationTarget
} from '../types';
import { formatToPersianDigits } from '../utils/jalali';
import { playNotificationSound } from '../utils/audioAlert';

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
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
  onBroadcastNotification?: (notif: AppNotification) => void;
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
  notifications = [],
  setNotifications,
  onBroadcastNotification,
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
    'overview' | 'submissions' | 'users' | 'missions' | 'trainings' | 'medals' | 'tickets' | 'news' | 'site_editor' | 'notifications'
  >('submissions');

  // LOCAL NOTIFICATION FORM STATES
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifType, setNotifType] = useState<NotificationType>('urgent');
  const [notifTarget, setNotifTarget] = useState<NotificationTarget>('all');
  const [notifTargetUserId, setNotifTargetUserId] = useState('');
  const [notifTargetGroupId, setNotifTargetGroupId] = useState('');
  const [notifActionTab, setNotifActionTab] = useState<string>('Missions');
  const [notifActionLabel, setNotifActionLabel] = useState<string>('مشاهده مأموریت');
  const [notifSenderName, setNotifSenderName] = useState<string>('ستاد کل فرماندهی اتاق جنگ');
  const [previewTestSent, setPreviewTestSent] = useState(false);

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

  // TICKET SUPPORT FILTER & REPLY STATE
  const [ticketSpecFilter, setTicketSpecFilter] = useState<'all' | TicketType>('all');
  const [ticketStatusFilter, setTicketStatusFilter] = useState<'all' | TicketStatus>('all');
  const [ticketSearchTerm, setTicketSearchTerm] = useState('');
  const [replyTicketId, setReplyTicketId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [adminReplyMarkStatus, setAdminReplyMarkStatus] = useState<'answered' | 'in_progress'>('answered');

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
  const handleAdminSendReply = (ticket: SupportTicket, overrideStatus?: 'answered' | 'in_progress') => {
    if (!adminReplyText.trim()) return;

    const timeStr = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    const dateStr = '۱۴۰۳/۰۴/۱۸ - ' + timeStr;

    const newReply: SupportReply = {
      id: `rep-${Date.now()}`,
      ticket_id: ticket.id,
      user_id: currentUser.id,
      user_name: 'پشتیبانی ستاد اتاق جنگ',
      message: adminReplyText.trim(),
      is_admin: true,
      created_at: dateStr
    };

    setReplies(prev => [...prev, newReply]);

    const targetStatus = overrideStatus || adminReplyMarkStatus;

    // Update ticket status and timestamp
    setTickets(prev => prev.map(t => 
      t.id === ticket.id ? { 
        ...t, 
        status: targetStatus, 
        admin_id: currentUser.id,
        updated_at: dateStr 
      } : t
    ));

    setAdminReplyText('');
    setReplyTicketId(null);
    triggerAlert(`پاسخ ستاد ثبت شد و وضعیت تیکت به "${targetStatus === 'answered' ? 'پاسخ داده شده' : 'در حال بررسی'}" تغییر یافت.`);
  };

  // ADMIN DIRECT STATUS CHANGE
  const handleAdminChangeTicketStatus = (ticketId: string, newStatus: TicketStatus) => {
    const timeStr = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    const dateStr = '۱۴۰۳/۰۴/۱۸ - ' + timeStr;

    setTickets(prev => prev.map(t => 
      t.id === ticketId ? { 
        ...t, 
        status: newStatus,
        admin_id: currentUser.id,
        updated_at: dateStr 
      } : t
    ));

    const statusLabels: Record<TicketStatus, string> = {
      open: 'در انتظار بررسی',
      in_progress: 'در حال بررسی',
      answered: 'پاسخ داده شده',
      closed: 'بسته شده / حل شده'
    };

    triggerAlert(`وضعیت تیکت به "${statusLabels[newStatus]}" تغییر یافت.`);
  };

  // ADMIN DELETE TICKET
  const handleAdminDeleteTicket = (ticketId: string) => {
    if (window.confirm('آیا از حذف این تیکت اطمینان دارید؟')) {
      setTickets(prev => prev.filter(t => t.id !== ticketId));
      setReplies(prev => prev.filter(r => r.ticket_id !== ticketId));
      triggerAlert('تیکت با موفقیت حذف گردید.');
    }
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

  // BROADCAST NOTIFICATION HANDLER
  const handleBroadcastNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) {
      triggerAlert('لطفاً عنوان و متن پیام نوتیفیکیشن را وارد نمایید.');
      return;
    }

    let targetPersonalCode = '';
    if (notifTarget === 'specific_user' && notifTargetUserId) {
      const u = users.find(x => x.id === notifTargetUserId || x.personal_code === notifTargetUserId);
      if (u) {
        targetPersonalCode = u.personal_code;
      }
    }

    const newNotification: AppNotification = {
      id: `notif-${Date.now()}`,
      title: notifTitle.trim(),
      message: notifMessage.trim(),
      type: notifType,
      target: notifTarget,
      target_user_id: notifTarget === 'specific_user' ? (notifTargetUserId || undefined) : undefined,
      target_personal_code: targetPersonalCode || undefined,
      target_group_id: notifTarget === 'specific_squad' ? notifTargetGroupId : undefined,
      action_tab: notifActionTab || undefined,
      action_label: notifActionLabel.trim() || undefined,
      sender_name: notifSenderName.trim() || 'ستاد کل فرماندهی اتاق جنگ',
      is_read_by: [],
      created_at: 'هم‌اکنون',
      timestamp: Date.now()
    };

    // Update notifications list
    setNotifications(prev => [newNotification, ...prev]);

    // Play synthesized sound
    playNotificationSound(notifType);

    // Call real-time broadcast callback
    if (onBroadcastNotification) {
      onBroadcastNotification(newNotification);
    }

    // Trigger cross-tab sync
    try {
      localStorage.setItem('warroom_last_live_notification', JSON.stringify({
        notif: newNotification,
        time: Date.now()
      }));
      window.dispatchEvent(new CustomEvent('warroom_live_broadcast', { detail: newNotification }));
    } catch (err) {}

    // Reset fields
    setNotifTitle('');
    setNotifMessage('');
    setPreviewTestSent(true);
    setTimeout(() => setPreviewTestSent(false), 4000);

    triggerAlert('🚀 نوتیفیکیشن زنده با موفقیت ارسال شد و در صفحه تمام کاربران واجد شرایط به نمایش درآمد.');
  };

  const applyPreset = (title: string, message: string, type: NotificationType, tab: string, label: string, target: NotificationTarget = 'all') => {
    setNotifTitle(title);
    setNotifMessage(message);
    setNotifType(type);
    setNotifActionTab(tab);
    setNotifActionLabel(label);
    setNotifTarget(target);
    triggerAlert('قالب پیش‌فرض پیام بارگذاری گردید.');
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

  // Filtered Tickets by specialization, status and search query
  const filteredTickets = tickets.filter(t => {
    const matchesSpec = ticketSpecFilter === 'all' || t.type === ticketSpecFilter;
    const matchesStatus = ticketStatusFilter === 'all' || t.status === ticketStatusFilter;
    const matchesSearch = !ticketSearchTerm.trim() || 
      t.user_name.toLowerCase().includes(ticketSearchTerm.toLowerCase()) ||
      t.personal_code.includes(ticketSearchTerm.trim()) ||
      t.subject.toLowerCase().includes(ticketSearchTerm.toLowerCase()) ||
      t.message.toLowerCase().includes(ticketSearchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(ticketSearchTerm.toLowerCase());
    return matchesSpec && matchesStatus && matchesSearch;
  });

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

        <button
          onClick={() => setActiveAdminTab('notifications')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl whitespace-nowrap shrink-0 transition border relative ${
            activeAdminTab === 'notifications' 
              ? 'bg-gradient-to-r from-red-600 via-amber-500 to-rose-600 text-slate-950 border-amber-400 font-black shadow-[0_0_20px_rgba(245,158,11,0.5)]' 
              : 'bg-[#080d21] text-amber-300 border-amber-500/40 hover:border-amber-400 hover:text-white'
          }`}
          id="btn-tab-notifications"
        >
          <Bell size={15} className="animate-bounce text-red-400" />
          <span>ارسال نوتیفیکیشن زنده (Push & Alert)</span>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
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
          
          {/* Real-time Status Metric Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <div 
              onClick={() => setTicketStatusFilter('all')}
              className={`p-3 rounded-xl border text-center cursor-pointer transition ${
                ticketStatusFilter === 'all' 
                  ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]' 
                  : 'bg-[#080d21] border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] text-slate-400 block font-bold">کل تیکت‌ها</span>
              <span className="text-base font-black text-white font-mono mt-0.5 block">{formatToPersianDigits(tickets.length)}</span>
            </div>

            <div 
              onClick={() => setTicketStatusFilter('open')}
              className={`p-3 rounded-xl border text-center cursor-pointer transition ${
                ticketStatusFilter === 'open' 
                  ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]' 
                  : 'bg-[#080d21] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span className="text-[10px] text-amber-300 font-bold">در انتظار بررسی</span>
              </div>
              <span className="text-base font-black text-amber-400 font-mono mt-0.5 block">
                {formatToPersianDigits(tickets.filter(t => t.status === 'open').length)}
              </span>
            </div>

            <div 
              onClick={() => setTicketStatusFilter('in_progress')}
              className={`p-3 rounded-xl border text-center cursor-pointer transition ${
                ticketStatusFilter === 'in_progress' 
                  ? 'bg-blue-500/20 border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.2)]' 
                  : 'bg-[#080d21] border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] text-blue-300 block font-bold">در حال بررسی</span>
              <span className="text-base font-black text-blue-400 font-mono mt-0.5 block">
                {formatToPersianDigits(tickets.filter(t => t.status === 'in_progress').length)}
              </span>
            </div>

            <div 
              onClick={() => setTicketStatusFilter('answered')}
              className={`p-3 rounded-xl border text-center cursor-pointer transition ${
                ticketStatusFilter === 'answered' 
                  ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]' 
                  : 'bg-[#080d21] border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] text-emerald-300 block font-bold">پاسخ داده شده</span>
              <span className="text-base font-black text-emerald-400 font-mono mt-0.5 block">
                {formatToPersianDigits(tickets.filter(t => t.status === 'answered').length)}
              </span>
            </div>

            <div 
              onClick={() => setTicketStatusFilter('closed')}
              className={`p-3 rounded-xl border text-center cursor-pointer transition col-span-2 sm:col-span-1 ${
                ticketStatusFilter === 'closed' 
                  ? 'bg-slate-800 border-slate-600' 
                  : 'bg-[#080d21] border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] text-slate-400 block font-bold">بسته شده</span>
              <span className="text-base font-black text-slate-400 font-mono mt-0.5 block">
                {formatToPersianDigits(tickets.filter(t => t.status === 'closed').length)}
              </span>
            </div>
          </div>

          {/* Search and Category Filters */}
          <div className="bg-[#080d21] p-3.5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative flex-1 w-full">
                <Search size={14} className="absolute right-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={ticketSearchTerm}
                  onChange={(e) => setTicketSearchTerm(e.target.value)}
                  placeholder="جستجوی تیکت بر اساس نام رزمنده، کد اختصاصی، موضوع، شماره تیکت..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pr-8 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto text-[11px] font-bold">
                <button
                  onClick={() => setTicketStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${ticketStatusFilter === 'all' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
                >
                  همه وضعیت‌ها
                </button>
                <button
                  onClick={() => setTicketStatusFilter('open')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${ticketStatusFilter === 'open' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-900 text-amber-300/70 hover:text-amber-300'}`}
                >
                  در انتظار
                </button>
                <button
                  onClick={() => setTicketStatusFilter('in_progress')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${ticketStatusFilter === 'in_progress' ? 'bg-blue-500 text-slate-950 font-black' : 'bg-slate-900 text-blue-300/70 hover:text-blue-300'}`}
                >
                  در حال بررسی
                </button>
                <button
                  onClick={() => setTicketStatusFilter('answered')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${ticketStatusFilter === 'answered' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-900 text-emerald-300/70 hover:text-emerald-300'}`}
                >
                  پاسخ داده شده
                </button>
                <button
                  onClick={() => setTicketStatusFilter('closed')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition ${ticketStatusFilter === 'closed' ? 'bg-slate-700 text-white font-black' : 'bg-slate-900 text-slate-500 hover:text-slate-300'}`}
                >
                  بسته شده
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="w-full overflow-x-auto no-scrollbar flex items-center gap-2 pt-2 border-t border-slate-800/80 text-xs font-bold whitespace-nowrap touch-pan-x">
              <span className="text-slate-400 shrink-0 text-[11px]">فیلتر حوزه تخصصی:</span>
              <button
                onClick={() => setTicketSpecFilter('all')}
                className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] transition ${ticketSpecFilter === 'all' ? 'bg-amber-500 text-black font-black' : 'bg-slate-900 text-slate-300 hover:text-white'}`}
              >
                همه حوزه‌ها
              </button>
              <button
                onClick={() => setTicketSpecFilter('technical')}
                className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] transition ${ticketSpecFilter === 'technical' ? 'bg-cyan-500 text-black font-black' : 'bg-slate-900 text-cyan-300/70 hover:text-cyan-300'}`}
              >
                فنی و سامانه (technical)
              </button>
              <button
                onClick={() => setTicketSpecFilter('judge')}
                className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] transition ${ticketSpecFilter === 'judge' ? 'bg-amber-500 text-black font-black' : 'bg-slate-900 text-amber-300/70 hover:text-amber-300'}`}
              >
                داوری و امتیاز (judge)
              </button>
              <button
                onClick={() => setTicketSpecFilter('content')}
                className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] transition ${ticketSpecFilter === 'content' ? 'bg-purple-500 text-black font-black' : 'bg-slate-900 text-purple-300/70 hover:text-purple-300'}`}
              >
                محتوا و آموزش (content)
              </button>
              <button
                onClick={() => setTicketSpecFilter('other')}
                className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] transition ${ticketSpecFilter === 'other' ? 'bg-slate-600 text-white font-black' : 'bg-slate-900 text-slate-400 hover:text-white'}`}
              >
                تغییر جوخه و عمومی (other)
              </button>
            </div>
          </div>

          {/* Tickets Cards List */}
          <div className="space-y-3.5">
            {filteredTickets.map(t => {
              const ticketReplies = replies.filter(r => r.ticket_id === t.id);

              return (
                <div key={t.id} className="bg-[#080d21] border border-slate-800 p-4 rounded-2xl space-y-3.5 text-xs shadow-lg">
                  
                  {/* Top Bar: User Info + Status + Quick Status Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-amber-400">#{t.id}</span>
                      <span className="font-black text-white text-sm">{t.user_name}</span>
                      <span className="text-slate-400 font-mono text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        کد: {formatToPersianDigits(t.personal_code)}
                      </span>
                      <span className="bg-slate-950 text-cyan-400 border border-cyan-800/50 px-2 py-0.5 rounded text-[10px] font-bold">
                        {t.type === 'technical' ? 'پشتیبانی فنی' :
                         t.type === 'judge' ? 'داوری و امتیاز' :
                         t.type === 'content' ? 'محتوا و آموزش' : 'عمومی / جوخه'}
                      </span>
                      {t.priority === 'urgent' && (
                        <span className="bg-rose-950 text-rose-300 border border-rose-600/50 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                          <AlertTriangle size={10} /> فوری
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Current Status Badge */}
                      {t.status === 'open' ? (
                        <span className="bg-amber-950 text-amber-300 border border-amber-500/60 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                          <span>در انتظار بررسی</span>
                        </span>
                      ) : t.status === 'in_progress' ? (
                        <span className="bg-blue-950 text-blue-300 border border-blue-500/60 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                          <RefreshCw size={11} className="animate-spin text-blue-400" />
                          <span>در حال بررسی مدیر</span>
                        </span>
                      ) : t.status === 'answered' ? (
                        <span className="bg-emerald-950 text-emerald-300 border border-emerald-400/80 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle size={11} className="text-emerald-400" />
                          <span>پاسخ داده شده</span>
                        </span>
                      ) : (
                        <span className="bg-slate-900 text-slate-400 border border-slate-700 text-[10px] font-medium px-2.5 py-1 rounded-full">
                          بسته شده
                        </span>
                      )}

                      <span className="text-slate-500 font-mono text-[10px]">{t.created_at}</span>
                    </div>
                  </div>

                  {/* Subject & Original Message */}
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-sm text-slate-100">{t.subject}</h4>
                    <p className="text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed whitespace-pre-wrap">
                      {t.message}
                    </p>
                    {t.attachment_url && (
                      <a 
                        href={t.attachment_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-1 text-[11px] text-cyan-400 underline hover:text-cyan-300 pt-1"
                      >
                        مشاهده فایل/لینک ضمیمه کاربر
                      </a>
                    )}
                  </div>

                  {/* Conversation Thread History */}
                  {ticketReplies.length > 0 && (
                    <div className="space-y-2 bg-[#050816] p-3 rounded-xl border border-slate-800/80">
                      <span className="text-[11px] font-bold text-slate-400 block mb-1">تاریخچه گفتگو و پاسخ‌ها:</span>
                      {ticketReplies.map(rep => (
                        <div 
                          key={rep.id} 
                          className={`p-2.5 rounded-xl text-xs space-y-1 ${
                            rep.is_admin 
                              ? 'bg-amber-950/40 border border-amber-500/40 text-amber-200 mr-2' 
                              : 'bg-slate-900/90 border border-slate-800 text-slate-200 ml-2'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] border-b border-slate-800/50 pb-1">
                            <span className={rep.is_admin ? 'text-amber-300 font-black' : 'text-cyan-300 font-bold'}>
                              {rep.is_admin ? '🛡️ پاسخ داور / ستاد مدیریت' : `👤 ${rep.user_name} (رزمنده)`}
                            </span>
                            <span className="text-slate-500 font-mono">{rep.created_at}</span>
                          </div>
                          <p className="leading-relaxed whitespace-pre-wrap">{rep.message}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick Action Status Toggles */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-slate-400 font-bold">تغییر وضعیت سریع:</span>
                      <button
                        onClick={() => handleAdminChangeTicketStatus(t.id, 'in_progress')}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition border ${
                          t.status === 'in_progress' 
                            ? 'bg-blue-500 text-slate-950 border-blue-400' 
                            : 'bg-slate-900 text-blue-300 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        در حال بررسی
                      </button>
                      <button
                        onClick={() => handleAdminChangeTicketStatus(t.id, 'answered')}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition border ${
                          t.status === 'answered' 
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400' 
                            : 'bg-slate-900 text-emerald-300 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        پاسخ داده شده
                      </button>
                      <button
                        onClick={() => handleAdminChangeTicketStatus(t.id, 'closed')}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition border ${
                          t.status === 'closed' 
                            ? 'bg-slate-700 text-white border-slate-600' 
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        بستن تیکت
                      </button>
                      <button
                        onClick={() => handleAdminChangeTicketStatus(t.id, 'open')}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition border ${
                          t.status === 'open' 
                            ? 'bg-amber-500 text-slate-950 border-amber-400' 
                            : 'bg-slate-900 text-amber-300 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        بازگشایی (در صف)
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAdminDeleteTicket(t.id)}
                        className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-950/40 transition"
                        title="حذف تیکت"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Reply Box */}
                  {replyTicketId === t.id ? (
                    <div className="space-y-3 pt-2 bg-slate-950/80 p-3.5 rounded-xl border border-amber-500/40">
                      
                      {/* Predefined Quick Answer Templates */}
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block mb-1">پاسخ‌های آماده / پیش‌فرض:</span>
                        <div className="flex flex-wrap gap-1.5 text-[10px]">
                          <button
                            type="button"
                            onClick={() => setAdminReplyText('سلام رزمنده گرامی. موضوع بررسی شد و مشکل فنی سامانه رفع گردید. لطفاً مجدداً اقدام فرمایید.')}
                            className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded-md border border-slate-800 transition"
                          >
                            ✓ مشکل بررسی و رفع شد
                          </button>
                          <button
                            type="button"
                            onClick={() => setAdminReplyText('سلام، درخواست شما برای بررسی مجدد امتیاز مأموریت به داور ارشد ارجاع داده شد و نتیجه در همین تیکت اعلام خواهد شد.')}
                            className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded-md border border-slate-800 transition"
                          >
                            ✓ ارجاع به سرداور مأموریت
                          </button>
                          <button
                            type="button"
                            onClick={() => setAdminReplyText('اطلاعات جوخه و عضویت شما در سامانه بروزرسانی گردید. می‌توانید در داشبورد خود وضعیت را مشاهده فرمایید.')}
                            className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded-md border border-slate-800 transition"
                          >
                            ✓ بروزرسانی اطلاعات جوخه
                          </button>
                          <button
                            type="button"
                            onClick={() => setAdminReplyText('لطفاً مشخصات دقیق‌تر، اسکرین‌شات از خطا یا شماره مأموریت را در پاسخ همین پیام ارسال نمایید.')}
                            className="bg-slate-900 hover:bg-slate-800 text-slate-300 px-2 py-1 rounded-md border border-slate-800 transition"
                          >
                            ✓ درخواست اطلاعات تکمیلی
                          </button>
                        </div>
                      </div>

                      <textarea
                        rows={3}
                        value={adminReplyText}
                        onChange={(e) => setAdminReplyText(e.target.value)}
                        placeholder="متن پاسخ رسمی کارشناس یا داور ستاد اتاق جنگ..."
                        className="w-full bg-[#040716] border border-slate-700 focus:border-amber-400 rounded-xl p-2.5 text-xs text-white outline-none transition placeholder-slate-500 leading-relaxed"
                      />

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-2 text-[11px] text-slate-300">
                          <span>وضعیت تیکت پس از ارسال:</span>
                          <select
                            value={adminReplyMarkStatus}
                            onChange={(e) => setAdminReplyMarkStatus(e.target.value as 'answered' | 'in_progress')}
                            className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-amber-300 font-bold outline-none"
                          >
                            <option value="answered">پاسخ داده شده (answered)</option>
                            <option value="in_progress">در حال بررسی (in_progress)</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button 
                            type="button"
                            onClick={() => setReplyTicketId(null)} 
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
                          >
                            انصراف
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleAdminSendReply(t)} 
                            className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                          >
                            <Send size={13} />
                            <span>ثبت و ارسال پاسخ</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => {
                          setReplyTicketId(t.id);
                          setAdminReplyText('');
                        }}
                        className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/60 text-amber-300 font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition text-xs cursor-pointer shadow-sm"
                      >
                        <MessageSquare size={14} />
                        <span>ارسال پاسخ یا تغییر وضعیت</span>
                      </button>
                    </div>
                  )}

                </div>
              );
            })}

            {filteredTickets.length === 0 && (
              <div className="p-8 text-center bg-[#080d21] rounded-2xl border border-dashed border-slate-800 space-y-2">
                <HelpCircle size={32} className="mx-auto text-slate-600" />
                <p className="text-xs font-bold text-slate-300">هیچ تیکتی با مشخصات فیلترشده یافت نشد.</p>
              </div>
            )}
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

      {/* 9. REAL-TIME PUSH NOTIFICATIONS & BROADCAST STUDIO */}
      {activeAdminTab === 'notifications' && (
        <div className="space-y-6">
          
          {/* Studio Header Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-950/70 via-slate-900 to-amber-950/60 border border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-inner shrink-0">
                <Bell size={24} className="animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-black text-white">مرکز فرماندهی پخش پیام و نوتیفیکیشن زنده (Push Alert)</h3>
                  <span className="bg-emerald-950 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    سیستم پخش برخط فعال
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  ارسال مستقیم پیام‌ها و اخطارهای تاکتیکی به کاربران آنلاین و ثبت دائم در مرکز اعلانات داشبورد
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playNotificationSound(notifType);
                  triggerAlert('صدای هشدار تاکتیکی آزمایش شد.');
                }}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                title="تست صدای آلارم"
              >
                <Volume2 size={15} />
                <span>تست صدای هشدار</span>
              </button>
            </div>
          </div>

          {/* Quick Tactical Presets */}
          <div className="p-4 rounded-2xl bg-[#080d21] border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                <Sparkles size={14} />
                قالب‌های آماده و دستورالعمل‌های سریع عملیاتی (تک‌کلیک برای پر کردن فرم):
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => applyPreset(
                  'دستور آماده‌باش عملیاتی: آغاز مأموریت ۳ دفاع هوایی',
                  'رزمندگان غیور اتاق جنگ، سناریوی جدید مقابله با جنگ الکترونیک و پدافند سایبری فعال گردید. پاسخ‌ها را سریعاً ارسال نمایید.',
                  'urgent',
                  'Missions',
                  'مشاهده سناریوی مأموریت',
                  'all'
                )}
                className="p-2.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 hover:border-rose-500 text-rose-200 rounded-xl text-right transition space-y-1 group"
              >
                <div className="flex items-center justify-between text-[11px] font-black text-rose-300">
                  <span>🚨 مأموریت فوری</span>
                  <Radio size={12} className="group-hover:animate-ping" />
                </div>
                <p className="text-[10px] text-rose-200/70 line-clamp-1">اعلام آماده‌باش عملیات دفاع هوایی</p>
              </button>

              <button
                type="button"
                onClick={() => applyPreset(
                  'ارزیابی و امتیازدهی مرحله جدید انجام شد',
                  'پاسخ‌های ثبت‌شده توسط هیئت داوران ستاد بررسی و نمره‌گذاری شد. جهت مشاهده رتبه و امتیازات خود به جدول جوایز مراجعه کنید.',
                  'score',
                  'Rewards',
                  'مشاهده رتبه‌بندی و جوایز',
                  'all'
                )}
                className="p-2.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/60 hover:border-emerald-500 text-emerald-200 rounded-xl text-right transition space-y-1 group"
              >
                <div className="flex items-center justify-between text-[11px] font-black text-emerald-300">
                  <span>⚡ ثبت نمرات و نتایج</span>
                  <Zap size={12} />
                </div>
                <p className="text-[10px] text-emerald-200/70 line-clamp-1">اعلام ثبت امتیازات و ارزیابی داوران</p>
              </button>

              <button
                type="button"
                onClick={() => applyPreset(
                  'اهدای نشان و مدال شجاعت به رزمندگان ممتاز',
                  'ستاد کل فرماندهی نشان‌های ویژه شجاعت و نخبه کوانتوم را به برترین‌های مسابقه اهدا نمود.',
                  'medal',
                  'Dashboard',
                  'مشاهده نشان‌ها در کارنامه',
                  'all'
                )}
                className="p-2.5 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/60 hover:border-amber-500 text-amber-200 rounded-xl text-right transition space-y-1 group"
              >
                <div className="flex items-center justify-between text-[11px] font-black text-amber-300">
                  <span>🎖️ اهدای نشان افتخار</span>
                  <Award size={12} />
                </div>
                <p className="text-[10px] text-amber-200/70 line-clamp-1">اطلاع‌رسانی مدال‌های کسب شده</p>
              </button>

              <button
                type="button"
                onClick={() => applyPreset(
                  'جلسه برخط هماهنگی و تقسیم کار فرماندهان جوخه',
                  'فرماندهان محترم موظفند لیست اعضای جوخه و وضعیت پاسخ‌دهی را پیش از اتمام مهلت بررسی فرمایند.',
                  'squad',
                  'Journey',
                  'ورود به نقشه مراحل',
                  'leaders'
                )}
                className="p-2.5 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800/60 hover:border-indigo-500 text-indigo-200 rounded-xl text-right transition space-y-1 group"
              >
                <div className="flex items-center justify-between text-[11px] font-black text-indigo-300">
                  <span>🛡️ ویژه فرماندهان</span>
                  <Users size={12} />
                </div>
                <p className="text-[10px] text-indigo-200/70 line-clamp-1">دستور به سرگروه‌ها و فرماندهان</p>
              </button>
            </div>
          </div>

          {/* Broadcast Form & Live Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form Column (7 cols) */}
            <div className="lg:col-span-7 bg-[#080d21] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Send className="text-amber-400" size={16} />
                  تنظیم و ارسال نوتیفیکیشن زنده
                </h4>
                <span className="text-[11px] text-slate-400">تمام ورودی‌ها دارای اعتبارسنجی بلادرنگ هستند</span>
              </div>

              <form onSubmit={handleBroadcastNotification} className="space-y-4">
                
                {/* Notification Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    عنوان پیام یا اخطار عملیاتی <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: دستور آماده‌باش عملیاتی شماره ۳"
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none transition"
                  />
                </div>

                {/* Message Body */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    متن پیام و توضیحات تکمیلی <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="متن کامل پیام که بلافاصله روی صفحه کاربر به نمایش درمی‌آید..."
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none transition leading-relaxed resize-none"
                  />
                </div>

                {/* Type & Urgency Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">نوع و ماهیت پیام</label>
                    <select
                      value={notifType}
                      onChange={(e) => setNotifType(e.target.value as NotificationType)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-amber-500"
                    >
                      <option value="urgent">🚨 فوری و آماده‌باش</option>
                      <option value="mission">🎯 مأموریت جدید</option>
                      <option value="score">⚡ امتیاز و ارزیابی</option>
                      <option value="medal">🎖️ نشان و مدال افتخار</option>
                      <option value="squad">🛡️ اطلاعیه جوخه</option>
                      <option value="announcement">📢 پیام عمومی ستاد</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">جامعه هدف (مخاطبان)</label>
                    <select
                      value={notifTarget}
                      onChange={(e) => setNotifTarget(e.target.value as NotificationTarget)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-amber-500"
                    >
                      <option value="all">🌐 همه رزمندگان سامانه</option>
                      <option value="leaders">⭐ فقط فرماندهان جوخه‌ها</option>
                      <option value="girls">👩 فقط دانش‌آموزان دختر</option>
                      <option value="boys">👦 فقط دانش‌آموزان پسر</option>
                      <option value="specific_user">👤 رزمنده خاص (با کد ۹ رقمی)</option>
                      <option value="specific_squad">🛡️ جوخه خاص</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">ارجاع به بخش (اقدام مستقیم)</label>
                    <select
                      value={notifActionTab}
                      onChange={(e) => {
                        setNotifActionTab(e.target.value);
                        if (e.target.value === 'Missions') setNotifActionLabel('مشاهده مأموریت‌ها');
                        else if (e.target.value === 'Journey') setNotifActionLabel('ورود به نقشه مراحل');
                        else if (e.target.value === 'Rewards') setNotifActionLabel('مشاهده جدول امتیازات');
                        else if (e.target.value === 'Vitrin') setNotifActionLabel('ویترین آثار');
                        else if (e.target.value === 'Support') setNotifActionLabel('بخش تیکت و پشتیبانی');
                        else if (e.target.value === 'Dashboard') setNotifActionLabel('داشبورد شخصی');
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-amber-500"
                    >
                      <option value="">بدون دکمه ارجاع</option>
                      <option value="Missions">مأموریت‌ها (Missions)</option>
                      <option value="Journey">نقشه مراحل (Journey)</option>
                      <option value="Rewards">جوایز و امتیازات (Rewards)</option>
                      <option value="Vitrin">ویترین آثار دانش‌آموزی (Vitrin)</option>
                      <option value="Support">تیکت‌ها و پشتیبانی (Support)</option>
                      <option value="Dashboard">داشبورد و کارنامه (Dashboard)</option>
                    </select>
                  </div>
                </div>

                {/* Specific User / Squad Selector if chosen */}
                {notifTarget === 'specific_user' && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                    <label className="block text-[11px] font-bold text-amber-300">انتخاب کاربر گیرنده پیام:</label>
                    <select
                      value={notifTargetUserId}
                      onChange={(e) => setNotifTargetUserId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="">-- انتخاب کاربر از بین {users.length} کاربر ثبت‌نامی --</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.first_name} {u.last_name} (کد: {u.personal_code}) - {u.role === 'leader' ? 'فرمانده' : 'عضو'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {notifTarget === 'specific_squad' && (
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                    <label className="block text-[11px] font-bold text-amber-300">انتخاب جوخه هدف:</label>
                    <select
                      value={notifTargetGroupId}
                      onChange={(e) => setNotifTargetGroupId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value="">-- انتخاب جوخه --</option>
                      {groups.map(g => (
                        <option key={g.id} value={g.id}>
                          جوخه {g.name} (کد: {g.registration_code})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Additional Settings: Action button label & Sender Signature */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {notifActionTab && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">عنوان دکمه اقدام</label>
                      <input
                        type="text"
                        placeholder="مثال: مشاهده مأموریت"
                        value={notifActionLabel}
                        onChange={(e) => setNotifActionLabel(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">امضای فرستنده پیام</label>
                    <input
                      type="text"
                      placeholder="ستاد کل فرماندهی اتاق جنگ"
                      value={notifSenderName}
                      onChange={(e) => setNotifSenderName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-red-600 via-amber-500 to-rose-600 hover:opacity-95 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-[0_0_25px_rgba(245,158,11,0.4)] transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Radio size={17} className="animate-pulse" />
                    <span>ارسال بلادرنگ نوتیفیکیشن به کاربران آنلاین</span>
                  </button>
                </div>

                {previewTestSent && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
                    <CheckCircle2 size={16} />
                    <span>نوتیفیکیشن هم‌اکنون با موفقیت ارسال شد و در صفحه تست نیز پاپ‌آپ گردید!</span>
                  </div>
                )}

              </form>
            </div>

            {/* Live Preview & Stats Column (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Live Preview Box */}
              <div className="bg-[#080d21] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <Sparkles size={14} />
                    پیش‌نمایش زنده در صفحه کاربر (Live UI Preview)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">طرح پاپ‌آپ شناور</span>
                </div>

                <div className="p-3 bg-slate-950/90 rounded-2xl border border-cyan-500/30 space-y-2 relative overflow-hidden shadow-xl">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                      <span className="font-black text-white font-mono">
                        {notifType === 'urgent' && '🚨 اخطار فوری'}
                        {notifType === 'mission' && '🎯 مأموریت جدید'}
                        {notifType === 'score' && '⚡ امتیاز و ارزیابی'}
                        {notifType === 'medal' && '🎖️ نشان و مدال'}
                        {notifType === 'squad' && '🛡️ اطلاعیه جوخه'}
                        {notifType === 'announcement' && '📢 پیام ستاد'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">هم‌اکنون</span>
                  </div>

                  <div>
                    <h5 className="text-xs font-black text-white">
                      {notifTitle || 'عنوان نوتیفیکیشن در این قسمت قرار می‌گیرد'}
                    </h5>
                    <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {notifMessage || 'متن کامل پیام و اخطار عملیاتی ارسالی توسط ادمین در این کادر شناور روی گوشی یا دسکتاپ رزمنده نشان داده می‌شود...'}
                    </p>
                  </div>

                  <div className="pt-1 flex items-center justify-between border-t border-slate-800/60">
                    <span className="text-[10px] text-slate-400 font-bold">
                      از: {notifSenderName || 'ستاد کل فرماندهی'}
                    </span>
                    {notifActionTab && (
                      <span className="text-[10px] bg-cyan-500 text-slate-950 font-black px-2 py-0.5 rounded-lg flex items-center gap-1">
                        <span>{notifActionLabel || 'مشاهده'}</span>
                        <ExternalLink size={10} />
                      </span>
                    )}
                  </div>

                  <div className="h-0.5 bg-gradient-to-r from-red-500 via-amber-400 to-cyan-400 absolute bottom-0 inset-x-0" />
                </div>

                <p className="text-[11px] text-slate-400 text-center">
                  کاربر با کلیک روی پیام به بخش مربوطه هدایت شده یا پیام در زنگوله اعلان‌ها ذخیره می‌گردد.
                </p>
              </div>

              {/* Sent Notifications History */}
              <div className="bg-[#080d21] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-black text-white flex items-center gap-1.5">
                    <Clock size={14} className="text-amber-400" />
                    تاریخچه پیام‌های ارسالی ({formatToPersianDigits(notifications.length)})
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">هنوز هیچ نوتیفیکیشنی ارسال نشده است.</p>
                  ) : (
                    notifications.map(notif => (
                      <div key={notif.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 hover:border-slate-700 transition space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-amber-300 font-mono">
                              {notif.type}
                            </span>
                            <h6 className="text-xs font-bold text-white truncate">{notif.title}</h6>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setNotifications(prev => prev.filter(x => x.id !== notif.id));
                              triggerAlert('پیام از تاریخچه حذف گردید.');
                            }}
                            className="text-slate-500 hover:text-rose-400 p-1 transition"
                            title="حذف پیام"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{notif.message}</p>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                          <span>مخاطب: {notif.target}</span>
                          <span>{notif.created_at}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

