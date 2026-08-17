import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, ShieldAlert, X } from 'lucide-react';

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
import PortalSelectorView from './components/PortalSelectorView';
import AuthView from './components/AuthView';
import DashboardView from './components/DashboardView';
import JourneyView from './components/JourneyView';
import MissionsView from './components/MissionsView';
import TrainingsView from './components/TrainingsView';
import SupportView from './components/SupportView';
import ContactView from './components/ContactView';
import AboutView from './components/AboutView';
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

  const handleTabChange = (tab: string) => {
    setShowPortalSelector(false);
    setShowAuthScreen(false);

    if (tab === 'PortalSelector' || tab === 'GameSelection') {
      setIsAdminMode(false);
      setShowPortalSelector(true);
      return;
    }

    if (tab === 'Admin') {
      if (currentUser?.role === 'admin') {
        setIsAdminMode(true);
        setActiveTab('Admin');
      } else {
        setIsAdminMode(false);
        setActiveTab('Home');
      }
      return;
    }

    setIsAdminMode(false);
    setActiveTab(tab);
  };
  const [showPortalSelector, setShowPortalSelector] = useState<boolean>(false);
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
    setShowPortalSelector(false);
    setShowAuthScreen(false);
    triggerAlert('خروج از سامانه اتاق جنگ با موفقیت انجام شد.');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setShowPortalSelector(false);
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
    setShowPortalSelector(true);
  };

  return (
    <div className="bg-[#030611] text-slate-100 min-h-screen relative font-sans dir-rtl">
      
      {/* Background Cyber Radar Grid Accent */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(220,38,38,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />

      {/* Global Toast Alert Notification (Swipeable right on Touch/Mobile + Close X Button) */}
      <AnimatePresence>
        {alertNotification && (
          <motion.div
            key="global-alert-toast"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, x: 280, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.05, right: 0.8 }}
            onDragEnd={(_e, info) => {
              // Swipe right gesture detection
              if (info.offset.x > 50 || info.velocity.x > 150) {
                setAlertNotification(null);
              }
            }}
            className="fixed top-4 left-3 right-3 sm:left-auto sm:right-6 z-50 p-[1px] rounded-2xl bg-gradient-to-r from-red-600 via-amber-500 to-rose-600 shadow-[0_0_30px_rgba(220,38,38,0.6)] sm:max-w-md cursor-grab active:cursor-grabbing touch-pan-y"
          >
            <div className="p-3.5 sm:p-4 rounded-[15px] bg-[#050818]/95 flex items-start justify-between gap-3 border border-red-500/40 dir-rtl select-none">
              <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-red-950 text-red-400 border border-red-800 shadow-inner">
                  <Bell size={16} className="animate-bounce" />
                </span>
                <div className="space-y-0.5 text-right min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-red-400 font-mono">پیام سیستم اتاق جنگ</span>
                    <span className="text-[9px] text-amber-400/80 font-mono hidden sm:inline-block">← بکشید به راست</span>
                  </div>
                  <p className="text-xs text-slate-100 font-semibold leading-relaxed break-words">
                    {alertNotification}
                  </p>
                </div>
              </div>

              {/* Close Button ('X') for Web & Desktop */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAlertNotification(null);
                }}
                className="p-1 rounded-lg bg-slate-900/90 text-slate-400 hover:text-white hover:bg-red-950/80 border border-slate-800 hover:border-red-500/50 transition shrink-0"
                title="بستن هشدار"
                aria-label="بستن هشدار"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {showPortalSelector ? (
          /* Preliminary Portal Selector / Choice Menu Screen */
          <motion.div
            key="portal-selector"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
          >
            <PortalSelectorView 
              onSelectWarRoom={() => {
                setShowPortalSelector(false);
                if (currentUser) {
                  setActiveTab('Journey');
                } else {
                  setShowAuthScreen(true);
                }
              }}
              onBackToHome={() => setShowPortalSelector(false)}
            />
          </motion.div>
        ) : showAuthScreen ? (
          /* Authentication / Registration Page for War Room */
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
              onBackToHome={() => {
                setShowAuthScreen(false);
                setShowPortalSelector(true);
              }}
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
              setActiveTab={handleTabChange}
              onOpenAuth={handleOpenAuth}
              onLogout={handleLogout}
              onOpenSquadModal={() => setShowSquadModal(true)}
              triggerAlert={triggerAlert}
            />
          </motion.div>
        ) : activeTab === 'Support' ? (
          /* Standalone Support & Ticket Center Page */
          <motion.div
            key="supportPage"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="min-h-screen bg-[#05091a] text-slate-100 py-6 px-3 sm:px-6 dir-rtl"
          >
            <SupportView 
              currentUser={currentUser}
              tickets={tickets}
              setTickets={setTickets}
              replies={replies}
              setReplies={setReplies}
              onNavigate={(tab) => handleTabChange(tab)}
              triggerAlert={triggerAlert}
            />
          </motion.div>
        ) : activeTab === 'Contact' ? (
          /* Standalone Animated Contact Us Page (Public & Independent) */
          <motion.div
            key="contactPage"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="min-h-screen bg-[#05091a] text-slate-100 py-6 px-3 sm:px-6 dir-rtl"
          >
            <ContactView 
              onNavigate={(tab) => handleTabChange(tab)}
              triggerAlert={triggerAlert}
            />
          </motion.div>
        ) : activeTab === 'About' ? (
          /* Standalone Animated About Us Page */
          <motion.div
            key="aboutPage"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="min-h-screen bg-[#05091a] text-slate-100 py-6 px-3 sm:px-6 dir-rtl"
          >
            <AboutView 
              onNavigate={(tab) => handleTabChange(tab)}
            />
          </motion.div>
        ) : (
          /* Main Platform View for other logged-in tabs */
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
              setCurrentTab={handleTabChange}
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
                      onEnterDashboard={(target) => {
                        if (target === 'Missions' || target === 'Trainings' || target === 'Profile') {
                          setActiveTab(target);
                        } else {
                          setActiveTab('Dashboard');
                        }
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Android Mobile Bottom Navigation for ALL Panels & Views (including Admin Panel) */}
      {!showAuthScreen && !showPortalSelector && (
        <BottomNavigation 
          activeTab={isAdminMode ? 'Admin' : activeTab}
          setActiveTab={(tab) => {
            if (tab === 'WarRoom') {
              setIsAdminMode(false);
              handleTabChange('PortalSelector');
            } else if (tab === 'Admin') {
              if (currentUser?.role === 'admin') {
                setIsAdminMode(true);
                setActiveTab('Admin');
              }
            } else {
              setIsAdminMode(false);
              handleTabChange(tab);
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

    </div>
  );
}
