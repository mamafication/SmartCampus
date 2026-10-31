'use client';

import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  AlertCircle,
  BookOpen,
  Award,
  ExternalLink,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';
import { TimetableEntry, CampusEvent, LibraryResource, Announcement } from '@/lib/types';

export function ScheduleCard({
  entry,
  isCurrent = false,
}: {
  entry: TimetableEntry;
  isCurrent?: boolean;
}) {
  const typeColors = {
    lecture: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    lab: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    tutorial: 'bg-amber-50 text-amber-700 border-amber-200',
    break: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <div
      className={`p-4 rounded-xl border transition-all duration-200 ${
        isCurrent
          ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-200 shadow-sm'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium border uppercase tracking-wider ${
              typeColors[entry.type]
            }`}
          >
            {entry.type}
          </span>
          <span className="text-xs font-semibold text-slate-500">{entry.courseCode}</span>
          {isCurrent && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-indigo-600 text-white font-medium animate-pulse">
              Current Session
            </span>
          )}
        </div>
        <div className="flex items-center text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
          <Clock className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
          {entry.startTime} – {entry.endTime}
        </div>
      </div>

      <h4 className="mt-2 text-base font-semibold text-slate-900 leading-snug">
        {entry.courseName}
      </h4>

      <div className="mt-3 flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-600">
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            {entry.room}, <span className="text-slate-500">{entry.building}</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{entry.instructor}</span>
        </div>
      </div>
    </div>
  );
}

export function EventCardItem({
  event,
  onToggleBookmark,
  onRegister,
}: {
  event: CampusEvent;
  onToggleBookmark: (id: string) => void;
  onRegister: (event: CampusEvent) => void;
}) {
  const categoryColors: Record<string, string> = {
    Technical: 'bg-blue-50 text-blue-700 border-blue-200',
    Cultural: 'bg-purple-50 text-purple-700 border-purple-200',
    Sports: 'bg-green-50 text-green-700 border-green-200',
    'Career & Placements': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Workshops: 'bg-amber-50 text-amber-700 border-amber-200',
    'Guest Lecture': 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
              categoryColors[event.category] || 'bg-slate-100 text-slate-700'
            }`}
          >
            {event.category}
          </span>
          <button
            type="button"
            onClick={() => onToggleBookmark(event.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              event.isBookmarked
                ? 'bg-amber-50 text-amber-600 border-amber-200'
                : 'text-slate-400 hover:text-slate-600 border-transparent hover:border-slate-200'
            }`}
            aria-label={event.isBookmarked ? 'Remove bookmark' : 'Bookmark event'}
          >
            <Bookmark className={`w-4 h-4 ${event.isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>
        </div>

        <h3 className="font-semibold text-slate-900 text-base leading-snug">{event.title}</h3>
        <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        <div className="mt-4 space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-800">{event.date}</span>
            <span className="text-slate-400">•</span>
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Deadline: {event.deadline}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          <span className="font-semibold text-slate-800">{event.registeredCount}</span>
          /{event.maxCapacity} registered
        </div>
        <button
          type="button"
          onClick={() => onRegister(event)}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            event.isRegistered
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
          }`}
        >
          {event.isRegistered ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Registered
            </>
          ) : (
            'Register'
          )}
        </button>
      </div>
    </div>
  );
}

export function ResourceCardItem({
  resource,
  onToggleBookmark,
}: {
  resource: LibraryResource;
  onToggleBookmark: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-700 border border-slate-200">
            {resource.resourceType}
          </span>
          <button
            type="button"
            onClick={() => onToggleBookmark(resource.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              resource.isBookmarked
                ? 'bg-amber-50 text-amber-600 border-amber-200'
                : 'text-slate-400 hover:text-slate-600 border-transparent hover:border-slate-200'
            }`}
            aria-label={resource.isBookmarked ? 'Remove bookmark' : 'Bookmark resource'}
          >
            <Bookmark className={`w-4 h-4 ${resource.isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>
        </div>

        <h3 className="font-semibold text-slate-900 text-sm leading-snug">{resource.title}</h3>
        <p className="mt-1 text-xs text-indigo-700 font-medium">{resource.author}</p>
        <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {resource.description}
        </p>

        <div className="mt-3.5 space-y-1 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-700">Subject:</span>
            <span>{resource.subject}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-medium text-slate-700">Shelf / Access:</span>
            <span className="truncate">{resource.location}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-md ${
            resource.availability.includes('Available')
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-blue-50 text-blue-700'
          }`}
        >
          {resource.availability}
        </span>
        <a
          href={resource.accessUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          <span>Access Link</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

export function AnnouncementItem({ announcement }: { announcement: Announcement }) {
  const categoryColors = {
    Academic: 'bg-blue-50 text-blue-700 border-blue-200',
    Urgent: 'bg-rose-50 text-rose-700 border-rose-200',
    Event: 'bg-amber-50 text-amber-700 border-amber-200',
    Maintenance: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        announcement.isPinned
          ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-100'
          : 'bg-white border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-0.5 rounded-md font-medium border ${
              categoryColors[announcement.category]
            }`}
          >
            {announcement.category}
          </span>
          {announcement.isPinned && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-200 text-amber-800 font-semibold">
              Pinned Notice
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400">{announcement.publishedAt}</span>
      </div>
      <h4 className="font-semibold text-slate-900 text-sm leading-snug">{announcement.title}</h4>
      <p className="mt-1 text-xs text-slate-600 leading-relaxed">{announcement.body}</p>
      <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-500 font-medium">
        <span>By {announcement.authorName}</span>
        <span>•</span>
        <span>{announcement.authorRole}</span>
      </div>
    </div>
  );
}
