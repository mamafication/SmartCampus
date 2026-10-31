'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Send,
  Plus,
  Users,
  Clock,
  CheckCircle,
  FileText,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { UserProfile, TimetableEntry, Language, Announcement } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';

export function FacultyPortalView({
  user,
  timetable,
  announcements,
  setAnnouncements,
  language,
}: {
  user: UserProfile;
  timetable: TimetableEntry[];
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  language: Language;
}) {
  const t = TRANSLATIONS[language];
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeBody, setNoticeBody] = useState('');
  const [noticeAudience, setNoticeAudience] = useState<'Students' | 'All Campus'>('Students');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filter timetable for faculty (e.g. Dr. Priya Varma)
  const facultyClasses = timetable.filter(
    (t) => t.instructor.includes('Dr. Priya') || t.instructor.includes('Varma')
  );

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeBody.trim()) return;

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: noticeTitle.trim(),
      body: noticeBody.trim(),
      audience: noticeAudience,
      category: 'Academic',
      publishedAt: 'Just now',
      authorName: user.name,
      authorRole: 'Associate Professor, CSE',
      isPinned: false,
    };

    setAnnouncements((prev) => [newAnn, ...prev]);
    setNoticeTitle('');
    setNoticeBody('');
    setSuccessMsg('Announcement successfully published to enrolled students.');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t.faculty.title}</h2>
            <p className="text-xs text-slate-500">{t.faculty.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-3.5 py-1.5 rounded-xl text-xs font-semibold">
          <Users className="w-4 h-4" />
          <span>Department of Computer Science & Engineering</span>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-emerald-800 text-sm flex items-center gap-2 shadow-xs">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Faculty Teaching Schedule */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-bold text-slate-900 text-sm">
                {t.faculty.activeCourses} ({facultyClasses.length} Sessions)
              </h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                Fall 2026
              </span>
            </div>

            <div className="space-y-3">
              {facultyClasses.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:border-indigo-300 transition-colors flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-600 text-white">
                        {item.courseCode}
                      </span>
                      <span className="text-xs text-slate-600 font-semibold">
                        {item.weekday} • {item.startTime} - {item.endTime}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{item.courseName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.room} ({item.building})
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 capitalize">
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Student FAQ & Inquiries Insight */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>Automated FAQ Offloading</span>
              </h3>
              <span className="text-xs text-emerald-600 font-semibold">82% FAQs Handled by AI</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              CampusGenie automatically grounds student questions in your published course syllabus and slide materials, saving approximately 4.5 office hours per week on repetitive logistics inquiries.
            </p>
            <div className="space-y-2 pt-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <span className="text-slate-700">&quot;What are the requirements for DBMS Lab 2?&quot;</span>
                <span className="text-slate-400">Answered from syllabus</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <span className="text-slate-700">&quot;How are grades weighted for Mid-terms?&quot;</span>
                <span className="text-slate-400">Answered from handbook</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Publish Announcement Form */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-2.5">
              <h3 className="font-bold text-slate-900 text-sm">
                {t.faculty.publishAnnouncement}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Send official broadcast to students enrolled in your courses.
              </p>
            </div>

            <form onSubmit={handlePostNotice} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. CS305 Project Milestone 2 Deadline Extended"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
                <select
                  value={noticeAudience}
                  onChange={(e) => setNoticeAudience(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none"
                >
                  <option value="Students">Enrolled Course Students Only</option>
                  <option value="All Campus">Entire Campus Community</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notice Content *</label>
                <textarea
                  rows={4}
                  required
                  value={noticeBody}
                  onChange={(e) => setNoticeBody(e.target.value)}
                  placeholder="Clearly explain deliverables, submission portal links, and lab rubrics..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Announcement</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
