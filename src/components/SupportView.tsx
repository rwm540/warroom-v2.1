import React, { useState } from 'react';
import { 
  HelpCircle, 
  Plus, 
  MessageSquare, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ShieldAlert, 
  Tag, 
  User as UserIcon, 
  Lock 
} from 'lucide-react';
import { User, SupportTicket, SupportReply, TicketType, TicketStatus } from '../types';
import { formatToPersianDigits } from '../utils/jalali';

interface SupportViewProps {
  currentUser: User;
  tickets: SupportTicket[];
  setTickets: React.Dispatch<React.SetStateAction<SupportTicket[]>>;
  replies: SupportReply[];
  setReplies: React.Dispatch<React.SetStateAction<SupportReply[]>>;
  triggerAlert: (msg: string) => void;
}

export default function SupportView({
  currentUser,
  tickets,
  setTickets,
  replies,
  setReplies,
  triggerAlert
}: SupportViewProps) {
  // Filter tickets for current user
  const userTickets = tickets.filter(t => t.user_id === currentUser.id);

  const [selectedTicketId, setSelectedTicketId] = useState<string>(userTickets[0]?.id || '');
  const selectedTicket = userTickets.find(t => t.id === selectedTicketId) || userTickets[0];

  // Ticket creation modal / toggle
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [newSubject, setNewSubject] = useState<string>('');
  const [newType, setNewType] = useState<TicketType>('technical');
  const [newMessage, setNewMessage] = useState<string>('');

  // Reply message text
  const [replyText, setReplyText] = useState<string>('');

  const getCategoryLabel = (type: TicketType) => {
    switch (type) {
      case 'technical':
        return 'پشتیبانی فنی و سامانه';
      case 'content':
        return 'محتوا و آموزه‌ها';
      case 'judge':
        return 'داوری و امتیازدهی';
      case 'other':
      default:
        return 'عمومی و سایر موارد';
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">در انتظار پاسخ</span>;
      case 'in_progress':
        return <span className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">پاسخ داده‌شده / در حال بررسی</span>;
      case 'closed':
        return <span className="bg-slate-900 text-slate-400 border border-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">بسته شده</span>;
    }
  };

  // Create new ticket submit
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;

    const newTicket: SupportTicket = {
      id: `tick-${Date.now()}`,
      user_id: currentUser.id,
      user_name: `${currentUser.first_name} ${currentUser.last_name}`,
      personal_code: currentUser.personal_code,
      subject: newSubject,
      message: newMessage,
      type: newType,
      status: 'open',
      created_at: '۱۴۰۳/۰۲/۲۲ - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      updated_at: '۱۴۰۳/۰۲/۲۲ - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };

    setTickets(prev => [newTicket, ...prev]);
    setSelectedTicketId(newTicket.id);
    setNewSubject('');
    setNewMessage('');
    setShowNewModal(false);
    triggerAlert('تیکت جدید با موفقیت ارسال شد.');
  };

  // Send reply handler
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newReply: SupportReply = {
      id: `rep-${Date.now()}`,
      ticket_id: selectedTicket.id,
      user_id: currentUser.id,
      user_name: `${currentUser.first_name} ${currentUser.last_name}`,
      message: replyText,
      is_admin: false,
      created_at: '۱۴۰۳/۰۲/۲۲ - ' + new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };

    setReplies(prev => [...prev, newReply]);

    // Update ticket status to 'open' on user reply
    setTickets(prev => prev.map(t => 
      t.id === selectedTicket.id ? { ...t, status: 'open' } : t
    ));

    setReplyText('');
    triggerAlert('پاسخ شما ارسال شد و تیکت به حالت باز تغییر یافت.');
  };

  const currentReplies = replies.filter(r => r.ticket_id === selectedTicket?.id);

  return (
    <div className="space-y-6 dir-rtl pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
            <HelpCircle className="text-red-500" size={24} />
            سامانه پشتیبانی و پاسخگویی به سوالات
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ارسال تیکت به کارشناسان و داوران ستاد اتاق جنگ (فنی، محتوایی، داوری، عمومی)
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="bg-red-700 hover:bg-red-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition shadow-[0_0_15px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          <span>ثبت تیکت پشتیبانی جدید</span>
        </button>
      </div>

      {/* Main Grid: Ticket List (Right) + Conversation Thread (Left) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Ticket List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">تیکت‌های شما:</h3>

          <div className="space-y-2.5">
            {userTickets.map(t => {
              const isSelected = t.id === selectedTicket?.id;

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-red-950/70 border-red-600/80 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                      : 'bg-[#080d21] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                      {getCategoryLabel(t.type)}
                    </span>
                    {getStatusBadge(t.status)}
                  </div>

                  <h4 className="font-extrabold text-xs text-white line-clamp-1 mb-1">{t.subject}</h4>
                  <p className="text-[10px] text-slate-500 font-mono">{t.created_at}</p>
                </div>
              );
            })}

            {userTickets.length === 0 && (
              <div className="bg-[#080d21] border border-slate-800 rounded-xl p-6 text-center text-slate-500 text-xs">
                هنوز تیکتی ثبت نکرده‌اید.
              </div>
            )}
          </div>
        </div>

        {/* Conversation Thread (8 cols) */}
        {selectedTicket ? (
          <div className="lg:col-span-8 bg-[#080d21] border border-slate-800 rounded-2xl p-5 md:p-6 space-y-6 shadow-lg">
            
            {/* Ticket Subject Header */}
            <div className="border-b border-slate-800 pb-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="bg-slate-900 text-slate-300 text-[10px] font-bold px-2.5 py-0.5 rounded border border-slate-800">
                  دسته: {getCategoryLabel(selectedTicket.type)}
                </span>
                {getStatusBadge(selectedTicket.status)}
              </div>

              <h3 className="text-base md:text-lg font-black text-white">{selectedTicket.subject}</h3>
              <p className="text-[11px] text-slate-400 font-mono">شناسه تیکت: #{selectedTicket.id}</p>
            </div>

            {/* Chat Thread */}
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
              
              {/* Initial Message from User */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-red-400">
                  <span>{selectedTicket.user_name} (رزمنده)</span>
                  <span className="text-[10px] text-slate-500 font-mono">{selectedTicket.created_at}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">{selectedTicket.message}</p>
              </div>

              {/* Follow-up Replies */}
              {currentReplies.map(r => (
                <div
                  key={r.id}
                  className={`p-4 rounded-2xl space-y-2 border ${
                    r.is_admin 
                      ? 'bg-amber-950/20 border-amber-800/60 mr-4' 
                      : 'bg-slate-950 border-slate-800 ml-4'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className={r.is_admin ? 'text-amber-400' : 'text-red-400'}>
                      {r.user_name} {r.is_admin && '(پشتیبان ستاد)'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{r.created_at}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">{r.message}</p>
                </div>
              ))}

            </div>

            {/* Reply Input Form */}
            {selectedTicket.status !== 'closed' ? (
              <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-800 space-y-3">
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="پاسخ یا سوال تکمیلی خود را بنویسید..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-600"
                  required
                />

                <button
                  type="submit"
                  className="bg-red-700 hover:bg-red-600 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition shadow-[0_0_15px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2"
                >
                  <Send size={15} />
                  <span>ارسال پاسخ و بازکردن تیکت</span>
                </button>
              </form>
            ) : (
              <div className="bg-slate-950 p-3 rounded-xl text-center text-xs text-slate-500 font-bold border border-slate-800">
                این تیکت توسط کارشناسان بسته شده است.
              </div>
            )}

          </div>
        ) : (
          <div className="lg:col-span-8 bg-[#080d21] border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
            تیکتی انتخاب نشده است.
          </div>
        )}

      </div>

      {/* New Ticket Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#080c1d] border border-red-900/80 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white">ثبت تیکت پشتیبانی جدید</h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-500 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">موضوع تیکت:</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="عنوان مشخص موضوع"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">دسته تیکت:</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as TicketType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-600"
                >
                  <option value="technical">پشتیبانی فنی و سامانه (technical)</option>
                  <option value="content">محتوا و آموزه‌ها (content)</option>
                  <option value="judge">داوری و ارزیابی مأموریت‌ها (judge)</option>
                  <option value="other">عمومی و سایر موارد (other)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">متن پیام اولیه:</label>
                <textarea
                  rows={4}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="شرح کامل مشکل یا سوال..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-600"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2.5 rounded-xl transition"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="w-2/3 bg-red-700 hover:bg-red-600 text-white font-extrabold text-xs py-2.5 rounded-xl transition shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                >
                  ارسال نهایی تیکت
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
