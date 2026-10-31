'use client';

import React, { useState } from 'react';
import { Clock, Calendar, Filter, MapPin, User, AlertCircle } from 'lucide-react';
import { TimetableEntry, Language } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';
import { ScheduleCard } from './Cards';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

export function TimetableView({
  timetable,
  language,
}: {
  timetable: TimetableEntry[];
  language: Language;
}) {
  const t = TRANSLATIONS[language];
  const [selectedDay, setSelectedDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday'>('Monday');
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [filterType, setFilterType] = useState<'all' | 'lecture' | 'lab' | 'tutorial'>('all');

  const filteredEntries = timetable.filter((item) => {
    const matchesDay = viewMode === 'day' ? item.weekday === selectedDay : true;
    const matchesType = filterType === 'all' ? true : item.type === filterType;
    return matchesDay && matchesType;
  });

  // Calculate day stats
  const dayItems = timetable.filter((i) => i.weekday === selectedDay && i.type !== 'break');
  const lecturesCount = dayItems.filter((i) => i.type === 'lecture').length;
  const labsCount = dayItems.filter((i) => i.type === 'lab').length;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t.timetable.title}</h2>
          <p className="text-xs text-slate-500 mt-1">{t.timetable.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'day'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.timetable.dayView}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'week'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.timetable.weekView}
            </button>
          </div>

          {/* Filter Type */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilterType('lecture')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterType === 'lecture' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Lectures
            </button>
            <button
              type="button"
              onClick={() => setFilterType('lab')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterType === 'lab' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Labs
            </button>
          </div>
        </div>
      </div>

      {/* Day Selector (for Day View) */}
      {viewMode === 'day' && (
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-2">
            {DAYS.map((day) => {
              const count = timetable.filter((i) => i.weekday === day && i.type !== 'break').length;
              const isActive = selectedDay === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span>{day}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                      isActive ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 hidden sm:block">
            {lecturesCount} Lectures • {labsCount} Labs scheduled
          </div>
        </div>
      )}

      {/* Timetable Content */}
      {viewMode === 'day' ? (
        <div className="space-y-3">
          {filteredEntries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
              <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-medium">{t.timetable.noClassesOnDay}</p>
            </div>
          ) : (
            filteredEntries.map((entry, idx) => (
              <ScheduleCard
                key={entry.id}
                entry={entry}
                isCurrent={selectedDay === 'Monday' && idx === 1}
              />
            ))
          )}
        </div>
      ) : (
        /* Week View Grid */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {DAYS.map((day) => {
            const dayEntries = timetable.filter(
              (i) => i.weekday === day && (filterType === 'all' || i.type === filterType)
            );
            return (
              <div
                key={day}
                className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <span className="font-bold text-sm text-slate-900">{day}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                    {dayEntries.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1">
                  {dayEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs hover:border-indigo-300 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold mb-1">
                        <span>{entry.startTime}</span>
                        <span className="uppercase text-[10px] px-1.5 rounded bg-white border text-indigo-700">
                          {entry.courseCode}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-900 line-clamp-1">{entry.courseName}</p>
                      <p className="text-[11px] text-slate-500 mt-1 truncate">
                        {entry.room} • {entry.instructor}
                      </p>
                    </div>
                  ))}
                  {dayEntries.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-6">No scheduled classes</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
