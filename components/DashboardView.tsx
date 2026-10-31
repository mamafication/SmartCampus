'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Bell,
  Send,
  CheckCircle,
  ExternalLink,
  Bookmark,
  Users,
} from 'lucide-react';
import {
  UserProfile,
  TimetableEntry,
  CampusEvent,
  Announcement,
  Language,
} from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';
import { ScheduleCard, EventCardItem, AnnouncementItem } from './Cards';

export function DashboardView({
  user,
  timetable,
  events,
  announcements,
  savedResourceCount,
  language,
  onNavigate,
  onAskAi,
  onToggleBookmarkEvent,
  onRegisterEvent,
}: {
  user: UserProfile;
  timetable: TimetableEntry[];
  events: CampusEvent[];
  announcements: Announcement[];
  savedResourceCount: number;
  language: Language;
  onNavigate: (tab: string) => void;
  onAskAi: (prompt: string) => void;
  onToggleBookmarkEvent: (id: string) => void;
  onRegisterEvent: (evt: CampusEvent) => void;
}) {
  const t = TRANSLATIONS[language];
  const [quickAiQuery, setQuickAiQuery] = useState('');

  // Find next class today (Monday in mock context)
  const todayClasses = timetable.filter((t) => t.weekday === 'Monday' && t.type !== 'break');
  const nextClass = todayClasses[1] || todayClasses[0];

  const handleQuickAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAiQuery.trim()) return;
    onAskAi(quickAiQuery.trim());
  };

  return (
    <div className="space-y-6">
      {/* Hero Greeting Section */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 mb-3 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t.dashboard.academicWeek}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {t.dashboard.greeting}, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="mt-1.5 text-xs md:text-sm text-indigo-200/90 leading-relaxed">
            {user.role === 'student'
              ? `You have ${todayClasses.length} sessions scheduled today. Your next lecture is in ${nextClass?.room}.`
              : user.role === 'faculty'
              ? `Welcome back, Professor. You have 2 lecture sections and 1 lab scheduled today.`
              : `Campus operations running smoothly. 4,280 student queries resolved this week.`}
          </p>

          {/* Quick AI Search bar inside hero */}
          <form
            onSubmit={handleQuickAsk}
            className="mt-6 flex items-center gap-2 bg-white/95 rounded-2xl p-1.5 shadow-lg max-w-2xl border border-white/20"
          >
            <div className="pl-3 text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={quickAiQuery}
              onChange={(e) => setQuickAiQuery(e.target.value)}
              placeholder={t.dashboard.askAiPlaceholder}
              className="flex-1 bg-transparent border-none text-slate-900 placeholder-slate-400 text-xs md:text-sm px-2 py-2 outline-none font-medium"
            />
            <button
              type="submit"
              disabled={!quickAiQuery.trim()}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs shrink-0"
            >
              <span>{t.dashboard.askAiBtn}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('timetable')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>{t.dashboard.quickStats.classesToday}</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{todayClasses.length}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span>Next: {nextClass?.startTime || 'None'}</span>
          </p>
        </div>

        <div
          onClick={() => onNavigate('events')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>{t.dashboard.quickStats.upcomingEvents}</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{events.length}</p>
          <p className="text-[11px] text-indigo-600 font-semibold mt-1">
            {events.filter((e) => e.isRegistered).length} Registered
          </p>
        </div>

        <div
          onClick={() => onNavigate('library')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>{t.dashboard.quickStats.savedResources}</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{savedResourceCount}</p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Verified Library Catalog</p>
        </div>

        <div
          onClick={() => onNavigate('placements')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>{t.dashboard.quickStats.placementPrep}</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">8.5 / 10</p>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">Tier-1 Interview Ready</p>
        </div>
      </div>

      {/* Main 2-column layout: Left (Next Class & Events) | Right (Announcements & Campus Tools) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Next Upcoming Class Card */}
          {nextClass && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="font-bold text-sm text-slate-900">{t.dashboard.nextClassTitle}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('timetable')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <span>Full Schedule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-indigo-50/60 rounded-xl p-4 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-600 text-white">
                      {nextClass.courseCode}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{nextClass.instructor}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">{nextClass.courseName}</h4>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {nextClass.startTime} – {nextClass.endTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {nextClass.room} ({nextClass.building})
                    </span>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="inline-block text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-indigo-700 shadow-2xs">
                    Starts at {nextClass.startTime}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming Campus Events */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                {t.dashboard.upcomingEventsTitle}
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('events')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>{t.dashboard.viewAllEvents}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {events.slice(0, 2).map((event) => (
                <EventCardItem
                  key={event.id}
                  event={event}
                  onToggleBookmark={onToggleBookmarkEvent}
                  onRegister={onRegisterEvent}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Notices & Directory Shortcuts */}
        <div className="lg:col-span-5 space-y-6">
          {/* Announcements Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  {t.dashboard.announcementsTitle}
                </h3>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-600">
                {announcements.length} Active
              </span>
            </div>

            <div className="space-y-3">
              {announcements.map((ann) => (
                <AnnouncementItem key={ann.id} announcement={ann} />
              ))}
            </div>
          </div>

          {/* Quick Support & Emergency Card */}
          <div className="bg-slate-900 rounded-2xl p-5 text-white space-y-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400">Campus Helpline</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                24/7 Service
              </span>
            </div>
            <h4 className="font-bold text-sm">Need Immediate Health or Security Support?</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dhanvantari Health Center and Campus Security desks are on standby. Call emergency Ext 911 or +91 11 2670 1100.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('directory')}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Open Campus Directory & Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
