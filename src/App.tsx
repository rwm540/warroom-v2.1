import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, ShieldAlert } from 'lucide-react';

// Types
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
  News 
} from './types';

// Mock Data
import { 
  initialUsers, 
  initialGroups, 
  initialMissions, 
  initialSubmissions, 
  initialTrainings, 
  initialMedals, 
  initialUserMedals, 
  initialSupportTickets, 
  initialSupportReplies, 
  initialAnnouncements, 
  initialNews 
} from './data';

// Views
import HomeView from './components/HomeView';
import Navbar from './components/Navbar';
import BottomNavigation from './components/home/BottomNavigation';
import AuthView from './components/AuthView';
import DashboardView from './components/DashboardView';
import JourneyView from './components/JourneyView';
import MissionsView from './components/MissionsView';
import TrainingsView from './components/TrainingsView';
import SupportView from './components/SupportView';
import ProfileView from './components/ProfileView';
import AdminPanel from './components/AdminPanel';
import SquadManagementModal from './components/SquadManagementModal';

export default function App() {
  // Global Data State
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('warroom_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem('warroom_groups');
    return saved ? JSON.parse(saved) : initialGroups;
  });

  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem('warroom_missions');
    return saved ? JSON.parse(saved) : initialMissions;
  });

  const [submissions, setSubmissions] = useState<MissionSubmission[]>(() => {
    const saved = localStorage.getItem('warroom_submissions');
    return saved ? JSON.parse(saved) : initialSubmissions;
  });

  const [trainings, setTrainings] = useState<Training[]>(() => {
    const saved = localStorage.getItem('warroom_trainings');
    return saved ? JSON.parse(saved) : initialTrainings;
  });

  const [medals, setMedals] = useState<Medal[]>(() => {
    const saved = localStorage.getItem('warroom_medals');
    return saved ? JSON.parse(saved) : initialMedals;
  });

  const [userMedals, setUserMedals] = useState<UserMedal[]>(() => {
    const saved = localStorage.getItem('warroom_user_medals');
    return saved ? JSON.parse(saved) : initialUserMedals;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('warroom_tickets');
    return saved ? JSON.parse(saved) : initialSupportTickets;
  });

  const [replies, setReplies] = useState<SupportReply[]>(() => {
    const saved = localStorage.getItem('warroom_replies');
    return saved ? JSON.parse(saved) : initialSupportReplies;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [news, setNews] = useState<News[]>(initialNews);

  // Current Logged-in User
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedId = localStorage.getItem('warroom_current_user_id');
    if (savedId) {
      const found = users.find(u => u.id === savedId);
      if (found) return found;
    }
    // Default to guest mode so user experiences the new landing page first
    return null;
  });

  // UI Navigation State
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [showAuthScreen, setShowAuthScreen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register_individual' | 'register_group'>('login');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [showSquadModal, setShowSquadModal] = useState<boolean>(false);
  const [alertNotification, setAlertNotification] = useState<string | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('warroom_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('warroom_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('warroom_missions', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('warroom_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    localStorage.setItem('warroom_trainings', JSON.stringify(trainings));
  }, [trainings]);

  useEffect(() => {
    localStorage.setItem('warroom_medals', JSON.stringify(medals));
  }, [medals]);

  useEffect(() => {
    localStorage.setItem('warroom_user_medals', JSON.stringify(userMedals));
  }, [userMedals]);

  useEffect(() => {
    localStorage.setItem('warroom_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('warroom_replies', JSON.stringify(replies));
  }, [replies]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('warroom_current_user_id', currentUser.id);
    } else {
      localStorage.removeItem('warroom_current_user_id');
    }
  }, [currentUser]);

  // System notification alert trigger
  const triggerAlert = (msg: string) => {
    setAlertNotification(msg);
    setTimeout(() => {
      setAlertNotification(null);
    }, 4500);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminMode(false);
    setActiveTab('Home');
    setShowAuthScreen(false);
    triggerAlert('خروج از سامانه اتاق جنگ با موفقیت انجام شد.');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setShowAuthScreen(false);
    if (user.role === 'admin') {
      setIsAdminMode(true);
      setActiveTab('Dashboard');
    } else {
      setIsAdminMode(false);
      setActiveTab('Journey'); // Immediately show the Stage Selection / Journey Map screen after registration/login
    }
    triggerAlert(`خوش آمدید رزمنده ${user.first_name} ${user.last_name}`);
  };

  const handleOpenAuth = (mode: 'login' | 'register_individual' | 'register_group') => {
    setAuthMode(mode);
    setShowAuthScreen(true);
  };

  return (
    <div className="bg-[#030611] text-slate-100 min-h-screen relative font-sans dir-rtl">
      
      {/* Background Cyber Radar Grid Accent */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(220,38,38,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      {/* Global Toast Alert Notification */}
      <AnimatePresence>
        {alertNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 left-4 right-4 md:left-6 md:right-auto z-50 p-[1px] rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 shadow-[0_0_25px_rgba(220,38,38,0.5)] max-w-sm"
          >
            <div className="p-4 rounded-[15px] bg-[#050818]/95 flex items-start gap-3 border border-red-500/30">
              <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-red-950 text-red-400 border border-red-800">
                <Bell size={16} className="animate-bounce" />
              </span>
              <div className="space-y-0.5 text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-red-400 font-mono">پیام سیستم اتاق جنگ</span>
                <p className="text-xs text-slate-100 font-semibold leading-relaxed">
                  {alertNotification}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showAuthScreen ? (
          /* Authentication / Registration Page */
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AuthView 
              users={users}
              setUsers={setUsers}
              groups={groups}
              setGroups={setGroups}
              onLoginSuccess={handleLoginSuccess}
              triggerAlert={triggerAlert}
              onBackToHome={() => setShowAuthScreen(false)}
              initialAuthMode={authMode}
            />
          </motion.div>
        ) : activeTab === 'Home' ? (
          /* Primary Mobile-First Home Landing View */
          <motion.div
            key="homeView"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HomeView 
              currentUser={currentUser}
              groups={groups}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onOpenAuth={handleOpenAuth}
              onLogout={handleLogout}
              onOpenSquadModal={() => setShowSquadModal(true)}
              triggerAlert={triggerAlert}
            />
          </motion.div>
        ) : (
          /* Main Platform View for other tabs */
          <motion.div
            key="platform"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen flex flex-col relative z-10"
          >
            {/* Top Navigation Bar */}
            <Navbar 
              currentUser={currentUser}
              currentTab={activeTab}
              setCurrentTab={setActiveTab}
              onLogout={handleLogout}
              onOpenSquadModal={() => setShowSquadModal(true)}
              isAdminView={isAdminMode}
              setIsAdminView={setIsAdminMode}
            />

            {/* Main Content Body */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 pt-5 pb-24 md:pb-8">
              
              {isAdminMode ? (
                <AdminPanel 
                  currentUser={currentUser!}
                  users={users}
                  setUsers={setUsers}
                  groups={groups}
                  missions={missions}
                  setMissions={setMissions}
                  submissions={submissions}
                  setSubmissions={setSubmissions}
                  trainings={trainings}
                  setTrainings={setTrainings}
                  medals={medals}
                  setMedals={setMedals}
                  userMedals={userMedals}
                  setUserMedals={setUserMedals}
                  tickets={tickets}
                  setTickets={setTickets}
                  replies={replies}
                  setReplies={setReplies}
                  announcements={announcements}
                  setAnnouncements={setAnnouncements}
                  news={news}
                  setNews={setNews}
                  triggerAlert={triggerAlert}
                />
              ) : (
                <>
                  {activeTab === 'Journey' && (
                    <JourneyView 
                      currentUser={currentUser}
                      onEnterDashboard={(stageId) => {
                        setActiveTab('Dashboard');
                      }}
                      triggerAlert={triggerAlert}
                    />
                  )}

                  {activeTab === 'Dashboard' && (
                    <DashboardView 
                      currentUser={currentUser!}
                      users={users}
                      groups={groups}
                      missions={missions}
                      submissions={submissions}
                      announcements={announcements}
                      news={news}
                      onNavigate={(tab) => setActiveTab(tab)}
                      onOpenSquadModal={() => setShowSquadModal(true)}
                    />
                  )}

                  {activeTab === 'Missions' && (
                    <MissionsView 
                      currentUser={currentUser!}
                      missions={missions}
                      submissions={submissions}
                      setSubmissions={setSubmissions}
                      triggerAlert={triggerAlert}
                    />
                  )}

                  {activeTab === 'Trainings' && (
                    <TrainingsView 
                      currentUser={currentUser!}
                      trainings={trainings}
                    />
                  )}

                  {activeTab === 'Support' && (
                    <SupportView 
                      currentUser={currentUser!}
                      tickets={tickets}
                      setTickets={setTickets}
                      replies={replies}
                      setReplies={setReplies}
                      triggerAlert={triggerAlert}
                    />
                  )}

                  {activeTab === 'Profile' && (
                    <ProfileView 
                      currentUser={currentUser!}
                      groups={groups}
                      medals={medals}
                      userMedals={userMedals}
                    />
                  )}
                </>
              )}

            </main>

            {/* Squad Management Modal for Commanders */}
            {showSquadModal && currentUser && (
              <SquadManagementModal 
                currentUser={currentUser}
                users={users}
                setUsers={setUsers}
                groups={groups}
                setGroups={setGroups}
                onClose={() => setShowSquadModal(false)}
                triggerAlert={triggerAlert}
              />
            )}

            {/* Android Mobile Bottom Navigation for User Views */}
            {!isAdminMode && (
              <BottomNavigation 
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  if (tab === 'WarRoom') {
                    setActiveTab('Dashboard');
                  } else {
                    setActiveTab(tab);
                  }
                }}
                currentUser={currentUser}
                onOpenSquadModal={() => setShowSquadModal(true)}
                onLogout={handleLogout}
                isAdminMode={isAdminMode}
                setIsAdminMode={setIsAdminMode}
                unreadTicketsCount={tickets.filter(t => t.status === 'open').length}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
