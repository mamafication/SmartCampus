'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Calendar,
  Filter,
  Bookmark,
  CheckCircle,
  X,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CampusEvent, Language, UserRole } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';
import { EventCardItem } from './Cards';

export function EventsView({
  events,
  setEvents,
  language,
  role,
}: {
  events: CampusEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CampusEvent[]>>;
  language: Language;
  role: UserRole;
}) {
  const t = TRANSLATIONS[language];
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [registeredNotice, setRegisteredNotice] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New event form state (for admin)
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CampusEvent['category']>('Technical');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const categories = [
    'All',
    'Technical',
    'Career & Placements',
    'Workshops',
    'Cultural',
    'Sports',
    'Guest Lecture',
  ];

  const handleToggleBookmark = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isBookmarked: !e.isBookmarked } : e))
    );
  };

  const handleRegister = (event: CampusEvent) => {
    if (event.isRegistered) return;
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id
          ? { ...e, isRegistered: true, registeredCount: e.registeredCount + 1 }
          : e
      )
    );
    setRegisteredNotice(`Successfully registered for "${event.title}"! A confirmation has been added to your profile.`);
    setTimeout(() => setRegisteredNotice(null), 4000);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newVenue.trim()) return;

    const newEvt: CampusEvent = {
      id: `evt-${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim() || 'Campus event organized by university society.',
      category: newCategory,
      date: newDate || 'Nov 28, 2026',
      time: newTime || '10:00 AM - 01:00 PM',
      venue: newVenue.trim(),
      deadline: newDeadline || 'Nov 25, 2026',
      eligibility: 'All students & faculty',
      status: 'Open',
      registeredCount: 1,
      maxCapacity: 250,
      isBookmarked: false,
      isRegistered: false,
      organizer: 'Office of Campus Administration',
    };

    setEvents((prev) => [newEvt, ...prev]);
    setIsAddModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewVenue('');
    setNewDescription('');
    setRegisteredNotice(`Event "${newEvt.title}" published to campus feed.`);
    setTimeout(() => setRegisteredNotice(null), 4000);
  };

  const filteredEvents = events.filter((e) => {
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase());
    const matchesSaved = !showSavedOnly || e.isBookmarked;
    return matchesCategory && matchesSearch && matchesSaved;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {registeredNotice && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-emerald-800 text-sm flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{registeredNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setRegisteredNotice(null)}
            className="text-emerald-600 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t.events.title}</h2>
          <p className="text-xs text-slate-500 mt-1">{t.events.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              showSavedOnly
                ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-amber-500' : ''}`} />
            <span>{t.events.saved} ({events.filter((e) => e.isBookmarked).length})</span>
          </button>

          {role === 'admin' && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{t.admin.createEvent}</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.events.searchPlaceholder}
            className="w-full bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 outline-none transition-all shadow-2xs"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <p className="text-sm font-semibold text-slate-800">No events found matching your criteria</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your category filter or keyword search.</p>
          {(search || selectedCategory !== 'All' || showSavedOnly) && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
                setShowSavedOnly(false);
              }}
              className="mt-4 px-4 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((evt) => (
            <EventCardItem
              key={evt.id}
              event={evt}
              onToggleBookmark={handleToggleBookmark}
              onRegister={handleRegister}
            />
          ))}
        </div>
      )}

      {/* Admin Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Publish New Campus Event</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. National Robotics & IoT Showcase 2026"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CampusEvent['category'])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Career & Placements">Career & Placements</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Guest Lecture">Guest Lecture</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="e.g. Nov 28, 2026"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Venue *</label>
                  <input
                    type="text"
                    required
                    value={newVenue}
                    onChange={(e) => setNewVenue(e.target.value)}
                    placeholder="e.g. Auditorium 2, Convention Center"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Registration Deadline</label>
                  <input
                    type="text"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    placeholder="e.g. Nov 24, 2026"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Brief Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detail event prerequisites, key speakers, team sizes, and prizes..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
