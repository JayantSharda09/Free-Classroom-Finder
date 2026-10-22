import React, { useState } from 'react';
import { useApp, AppTab } from '../../context/AppContext';
import { LoginModal } from '../auth/LoginModal';
import {
  GraduationCap,
  Search,
  History,
  Info,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, activeTab, setActiveTab, logout, setCurrentUser, resetToDemoData } = useApp();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navItems: { id: AppTab; label: string; icon: React.ReactNode; requiresAdmin?: boolean }[] = [
    { id: 'home', label: 'Home', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'find', label: 'Find Classroom', icon: <Search className="w-4 h-4" /> },
    { id: 'history', label: 'My Searches', icon: <History className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
    {
      id: 'admin-dashboard',
      label: 'Admin Panel',
      icon: <LayoutDashboard className="w-4 h-4" />,
      requiresAdmin: true,
    },
  ];

  const handleTabClick = (tab: AppTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const toggleRoleQuick = () => {
    if (currentUser?.role === 'admin') {
      setCurrentUser({
        id: 'u1',
        name: 'Alex Rivera',
        email: 'student@college.edu',
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      });
      setActiveTab('find');
    } else {
      setCurrentUser({
        id: 'u2',
        name: 'Dr. Sarah Jenkins',
        email: 'admin@college.edu',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      });
      setActiveTab('admin-dashboard');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div
              onClick={() => handleTabClick('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-teal-400" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
                  Free Classroom <span className="text-teal-400">Finder</span>
                </span>
                <span className="text-[10px] text-slate-400 block -mt-1 font-medium tracking-wide uppercase">
                  Campus Timetable Engine
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                // If item requires admin and user is not admin, hide or show only when logged in as admin
                if (item.requiresAdmin && currentUser?.role !== 'admin') return null;

                const isActive = activeTab === item.id || (item.id === 'admin-dashboard' && activeTab.startsWith('admin-'));

                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Controls & Role Switcher */}
            <div className="hidden md:flex items-center gap-3">
              {/* Quick Role Switcher Pill */}
              <button
                onClick={toggleRoleQuick}
                title="Toggle between Student and Administrator demo view"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:border-teal-500/50 hover:bg-slate-800 transition-all shadow-inner"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Role:</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] uppercase tracking-wider ${
                    currentUser?.role === 'admin'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  }`}
                >
                  {currentUser?.role === 'admin' ? 'Admin' : 'Student'}
                </span>
              </button>

              {/* Reset Data Button */}
              <button
                onClick={resetToDemoData}
                title="Reset database to initial demo state"
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Auth / Profile dropdown */}
              {currentUser ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-colors"
                  >
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-teal-500/40"
                    />
                    <span className="text-xs font-medium text-slate-200 pr-1 max-w-[100px] truncate">
                      {currentUser.name}
                    </span>
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div
                      onMouseLeave={() => setIsProfileMenuOpen(false)}
                      className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 glass-panel animate-in fade-in slide-in-from-top-2 duration-150"
                    >
                      <div className="p-3 border-b border-slate-800 mb-1">
                        <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                        <div className="mt-2 flex items-center gap-1.5">
                          {currentUser.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/30">
                              <ShieldCheck className="w-3 h-3" /> Admin Account
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-teal-500/20 text-teal-400 rounded-md border border-teal-500/30">
                              <GraduationCap className="w-3 h-3" /> Student Account
                            </span>
                          )}
                        </div>
                      </div>

                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => {
                            handleTabClick('admin-dashboard');
                            setIsProfileMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:text-white hover:bg-slate-800 rounded-xl flex items-center gap-2 font-medium"
                        >
                          <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                          <span>Administrator Dashboard</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl flex items-center gap-2 font-medium transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-semibold text-xs rounded-xl shadow-md transition-all"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleRoleQuick}
                className="px-2.5 py-1 rounded-full bg-slate-800 text-[10px] font-bold text-teal-400 uppercase border border-slate-700"
              >
                {currentUser?.role === 'admin' ? 'Admin' : 'Student'}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-900/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
            <div className="space-y-1">
              {navItems.map((item) => {
                if (item.requiresAdmin && currentUser?.role !== 'admin') return null;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              {currentUser ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt=""
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{currentUser.role} Account</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm rounded-xl"
                >
                  Sign In to Campus Account
                </button>
              )}

              <button
                onClick={resetToDemoData}
                className="w-full py-2.5 bg-slate-800 text-slate-400 hover:text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Demo Data
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};
