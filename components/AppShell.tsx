'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  LayoutDashboard,
  Bot,
  Calendar,
  PartyPopper,
  BookOpen,
  MapPin,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Globe,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  Check,
} from 'lucide-react';
import { UserProfile, Language, UserRole, Announcement } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';

interface AppShellProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: UserProfile;
  setUserRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  announcements: Announcement[];
  children: React.ReactNode;
}

export function AppShell({
  currentTab,
  setCurrentTab,
  user,
  setUserRole,
  language,
  setLanguage,
  announcements,
  children,
}: AppShellProps) {
  const t = TRANSLATIONS[language];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'ai', label: t.nav.assistant, icon: Bot, highlight: true },
    { id: 'timetable', label: t.nav.timetable, icon: Calendar },
    { id: 'events', label: t.nav.events, icon: PartyPopper },
    { id: 'library', label: t.nav.library, icon: BookOpen },
    { id: 'directory', label: t.nav.directory, icon: MapPin },
    { id: 'placements', label: t.nav.placements, icon: Briefcase },
  ];

  if (user.role === 'faculty') {
    navItems.push({ id: 'faculty', label: t.nav.facultyPortal, icon: GraduationCap });
  }

  if (user.role === 'admin') {
    navItems.push({ id: 'admin', label: t.nav.adminPortal, icon: ShieldCheck });
  }

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    const q = globalSearch.toLowerCase();
    if (q.includes('schedule') || q.includes('class') || q.includes('timetable') || q.includes('lecture')) {
      setCurrentTab('timetable');
    } else if (q.includes('event') || q.includes('hackathon') || q.includes('fest')) {
      setCurrentTab('events');
    } else if (q.includes('book') || q.includes('library') || q.includes('paper') || q.includes('slide')) {
      setCurrentTab('library');
    } else if (q.includes('room') || q.includes('building') || q.includes('office') || q.includes('health') || q.includes('doctor')) {
      setCurrentTab('directory');
    } else if (q.includes('placement') || q.includes('interview') || q.includes('job') || q.includes('salary')) {
      setCurrentTab('placements');
    } else {
      setCurrentTab('ai');
    }
    setGlobalSearch('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 shadow-2xs">
        {/* Left: Mobile Toggle & Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-none">
                CampusGenie
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                {t.appSubtitle}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="hidden md:block flex-1 max-w-md mx-6">
          <form onSubmit={handleGlobalSearch} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder={t.topbar.searchPlaceholder}
              className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none transition-all"
            />
          </form>
        </div>

        {/* Right: Actions, Language, Notifications, Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Demo Data Badge */}
          <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            <span>{t.topbar.demoDataBadge}</span>
          </span>

          {/* Language Toggle (EN / HI) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-md font-bold text-[11px] transition-colors ${
                language === 'en'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded-md font-bold text-[11px] transition-colors ${
                language === 'hi'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Announcements"
            >
              <Bell className="w-4 h-4" />
              {announcements.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 p-3 shadow-xl z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2 px-1">
                  <span className="text-xs font-bold text-slate-900">{t.topbar.notifications}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {announcements.length} New
                  </span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {announcements.map((ann) => (
                    <div
                      key={ann.id}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs hover:bg-indigo-50/50 transition-colors"
                    >
                      <p className="font-semibold text-slate-900 leading-snug">{ann.title}</p>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{ann.body}</p>
                      <span className="text-[10px] text-indigo-600 font-semibold block mt-1">
                        {ann.publishedAt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher Dropdown (Student / Faculty / Admin) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-xs font-semibold text-slate-800 transition-all shadow-2xs"
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                {user.role[0].toUpperCase()}
              </div>
              <span className="hidden sm:inline">
                {user.role === 'student'
                  ? t.topbar.student
                  : user.role === 'faculty'
                  ? t.topbar.faculty
                  : t.topbar.admin}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 p-2 shadow-xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {t.topbar.switchRole}
                </div>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setUserRole('student');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      user.role === 'student'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{t.topbar.student}</span>
                    {user.role === 'student' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserRole('faculty');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      user.role === 'faculty'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{t.topbar.faculty}</span>
                    {user.role === 'faculty' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserRole('admin');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      user.role === 'admin'
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{t.topbar.admin}</span>
                    {user.role === 'admin' && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex w-full max-w-[1440px] mx-auto">
        {/* Desktop Left Sidebar (248px) */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 bg-white p-4 shrink-0 justify-between">
          <div className="space-y-1.5">
            <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* User Profile Mini Footer */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
              {user.name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-xs text-slate-900 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 font-medium capitalize truncate">
                {user.role} • {user.rollOrEmpId}
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs lg:hidden flex">
            <div className="bg-white w-72 h-full p-4 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-slate-900">CampusGenie</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setCurrentTab(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                  {user.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs text-slate-900 truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}

        {/* Center Main Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
