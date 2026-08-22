import React, { useState } from 'react';
import { Award, Trophy, Users, User as UserIcon, Medal as MedalIcon, Star, Sparkles, Flame, Search } from 'lucide-react';
import { User, Group, Medal, UserMedal } from '../types';
import { formatToPersianDigits } from '../utils/jalali';

interface RewardsLeaderboardViewProps {
  users: User[];
  groups: Group[];
  medals: Medal[];
  userMedals: UserMedal[];
  triggerAlert: (msg: string) => void;
}

export default function RewardsLeaderboardView({
  users,
  groups,
  medals,
  userMedals,
  triggerAlert
}: RewardsLeaderboardViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'leaderboard' | 'rewards'>('leaderboard');
  const [leaderboardType, setLeaderboardType] = useState<'individual' | 'group'>('individual');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock top warriors ranking
  const topWarriors = [
    { rank: 1, name: 'امیرحسین فرماندهی کل', squad: 'جوخه صاعقه', score: 9850, medals: 14, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
    { rank: 2, name: 'زهرا موسوی', squad: 'جوخه طوفان', score: 9200, medals: 12, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
    { rank: 3, name: 'علی رادمنش', squad: 'جوخه الفجر', score: 8750, medals: 10, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
    { rank: 4, name: 'فاطمه زهرا کریمی', squad: 'جوخه نصر', score: 8100, medals: 9, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
    { rank: 5, name: 'محمد مهدی‌زاده', squad: 'جوخه صاعقه', score: 7600, medals: 8, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80' },
  ];

  const topSquads = [
    { rank: 1, name: 'جوخه صاعقه', leader: 'امیرحسین فرماندهی', members: 5, score: 38400 },
    { rank: 2, name: 'جوخه طوفان', leader: 'زهرا موسوی', members: 4, score: 34100 },
    { rank: 3, name: 'جوخه الفجر', leader: 'علی رادمنش', members: 6, score: 31200 },
    { rank: 4, name: 'جوخه نصر', leader: 'فاطمه کریمی', members: 5, score: 28900 },
  ];

  return (
    <div className="space-y-6 dir-rtl pb-28 max-w-4xl mx-auto px-3 sm:px-6 pt-4">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0d1538] via-[#080d21] to-[#050814] border border-amber-500/30 p-6 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-right">
            <span className="bg-amber-950/80 text-amber-300 font-mono text-[10px] font-bold px-2.5 py-1 rounded-md border border-amber-600/40">
              HALL OF FAME & REWARDS
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">تالار افتخارات، رده‌بندی و جوایز</h1>
            <p className="text-xs text-slate-300 max-w-lg">
              رقابت تنگاتنگ رزمندگان و جوخه‌های عملیاتی در کسب امتیازات نهایی و مدال‌های طلا و نقره قرارگاه
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Trophy size={32} />
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-2 bg-[#080d21] p-1.5 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveSubTab('leaderboard')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 ${
            activeSubTab === 'leaderboard' 
              ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy size={16} />
          <span>جدول رده‌بندی برترین‌ها</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rewards')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 ${
            activeSubTab === 'rewards' 
              ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award size={16} />
          <span>ویترین مدال‌ها و جوایز</span>
        </button>
      </div>

      {/* Content for Leaderboard */}
      {activeSubTab === 'leaderboard' && (
        <div className="space-y-4">
          
          {/* Individual vs Group Toggle & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#080d21] p-3.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
              <button
                onClick={() => setLeaderboardType('individual')}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                  leaderboardType === 'individual' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400'
                }`}
              >
                رزمندگان انفرادی
              </button>
              <button
                onClick={() => setLeaderboardType('group')}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                  leaderboardType === 'group' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400'
                }`}
              >
                جوخه‌های عملیاتی
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="جستجوی رزمنده یا جوخه..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Leaderboard List */}
          {leaderboardType === 'individual' ? (
            <div className="space-y-2.5">
              {topWarriors.map((warrior, idx) => (
                <div 
                  key={idx}
                  className="bg-[#080d21] border border-slate-800 hover:border-slate-700 p-4 rounded-2xl flex items-center justify-between transition shadow-md"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs font-mono ${
                      idx === 0 ? 'bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.6)]' :
                      idx === 1 ? 'bg-slate-300 text-slate-950' :
                      idx === 2 ? 'bg-amber-700 text-white' :
                      'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}>
                      {formatToPersianDigits(warrior.rank)}
                    </div>
                    
                    <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-700">
                      <img src={warrior.avatar} alt={warrior.name} className="w-full h-full object-cover" />
                    </div>

                    <div>
                      <h4 className="font-black text-sm text-white">{warrior.name}</h4>
                      <p className="text-[11px] text-cyan-400">{warrior.squad}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-left">
                    <div>
                      <span className="text-[10px] text-slate-500 block">امتیاز کل</span>
                      <span className="font-mono font-black text-amber-400 text-sm">{formatToPersianDigits(warrior.score)}</span>
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-[10px] text-slate-500 block">نشان‌ها</span>
                      <span className="font-mono font-bold text-cyan-300 text-xs">{formatToPersianDigits(warrior.medals)} مدال</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {topSquads.map((squad, idx) => (
                <div 
                  key={idx}
                  className="bg-[#080d21] border border-slate-800 hover:border-slate-700 p-4 rounded-2xl flex items-center justify-between transition shadow-md"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs font-mono ${
                      idx === 0 ? 'bg-amber-500 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.6)]' :
                      idx === 1 ? 'bg-slate-300 text-slate-950' :
                      'bg-amber-700 text-white'
                    }`}>
                      {formatToPersianDigits(squad.rank)}
                    </div>

                    <div className="p-2.5 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/60">
                      <Users size={20} />
                    </div>

                    <div>
                      <h4 className="font-black text-sm text-white">{squad.name}</h4>
                      <p className="text-[11px] text-slate-400">سرگروه: {squad.leader} ({formatToPersianDigits(squad.members)} رزمنده)</p>
                    </div>
                  </div>

                  <div className="text-left">
                    <span className="text-[10px] text-slate-500 block">امتیاز کل جوخه</span>
                    <span className="font-mono font-black text-amber-400 text-base">{formatToPersianDigits(squad.score)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* Content for Rewards */}
      {activeSubTab === 'rewards' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {medals.map((medal) => (
              <div 
                key={medal.id}
                className="bg-[#080d21] border border-amber-500/30 p-5 rounded-2xl space-y-3 relative overflow-hidden shadow-lg group hover:border-amber-400 transition"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition" />
                
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)] font-black text-xl">
                    <Award size={24} />
                  </div>
                  <span className="bg-amber-950/80 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded border border-amber-700/50">
                    نشان رسمی اتاق جنگ
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-black text-sm text-white">{medal.name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{medal.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>وضعیت اعطا: فعال</span>
                  <button 
                    onClick={() => triggerAlert(`اطلاعات نشان ${medal.name}: جهت کسب این نشان مأموریت‌های مربوطه را با موفقیت به اتمام برسانید.`)}
                    className="text-amber-400 hover:underline font-bold"
                  >
                    شرایط کسب نشان ←
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
