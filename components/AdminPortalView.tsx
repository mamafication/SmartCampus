'use client';

import React from 'react';
import {
  ShieldAlert,
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
  Plus,
  Calendar,
  Bell,
} from 'lucide-react';
import { AggregatedAnalytics, Language, UserRole } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';

export function AdminPortalView({
  analytics,
  language,
  onOpenCreateEvent,
}: {
  analytics: AggregatedAnalytics;
  language: Language;
  onOpenCreateEvent: () => void;
}) {
  const t = TRANSLATIONS[language];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">{t.admin.title}</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              Operations Center
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{t.admin.subtitle}</p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateEvent}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.admin.createEvent}</span>
        </button>
      </div>

      {/* Strict Privacy Safeguard Banner (PRD FR-12) */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-start gap-3 shadow-sm border border-slate-800">
        <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold text-emerald-400">Student Privacy Shield Active:</span>{' '}
          {t.admin.privacyNotice}
        </div>
      </div>

      {/* 4 Core Operational KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>{t.admin.totalQueries}</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {analytics.totalQueriesThisWeek.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            +18.4% vs previous week
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>{t.admin.citationAccuracy}</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {analytics.groundedCitationAccuracyPercent}%
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            Grounded in 7 approved handbooks
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>{t.admin.activeStudents}</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {analytics.activeStudentsToday.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Peak concurrency: 11:30 AM
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>{t.admin.avgResponse}</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {analytics.avgResponseTimeMs} ms
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">
            Under 2.5s SLA target
          </p>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Most Frequent Inquiries Topics */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>{t.admin.topTopics}</span>
            </h3>
            <span className="text-xs text-slate-500 font-semibold">Weekly Aggregate</span>
          </div>

          <div className="space-y-3">
            {analytics.topSearchTopics.map((item, idx) => {
              const max = analytics.topSearchTopics[0].count;
              const percent = Math.round((item.count / max) * 100);
              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-800">{item.topic}</span>
                    <span className="text-slate-500">{item.count} asks</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Registrations by Category */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>{t.admin.eventEngagement}</span>
            </h3>
            <span className="text-xs text-slate-500 font-semibold">Campus Interest</span>
          </div>

          <div className="space-y-3">
            {analytics.eventRegistrationsByCategory.map((cat, idx) => {
              const max = 800;
              const percent = Math.min(100, Math.round((cat.count / max) * 100));
              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-800">{cat.category}</span>
                    <span className="text-slate-500">{cat.count} registered</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
