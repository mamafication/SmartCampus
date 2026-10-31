'use client';

import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Plus,
  Filter,
  Bookmark,
  ExternalLink,
  CheckCircle,
  X,
  FileText,
} from 'lucide-react';
import { LibraryResource, Language, UserRole } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';
import { ResourceCardItem } from './Cards';

export function LibraryView({
  resources,
  setResources,
  language,
  role,
}: {
  resources: LibraryResource[];
  setResources: React.Dispatch<React.SetStateAction<LibraryResource[]>>;
  language: Language;
  role: UserRole;
}) {
  const t = TRANSLATIONS[language];
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // New resource modal state
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newType, setNewType] = useState<LibraryResource['resourceType']>('Lecture Notes');
  const [newSubject, setNewSubject] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const types = [
    'All',
    'Textbook',
    'Lecture Notes',
    'Exam Solutions',
    'Research Paper',
    'Lab Manual',
  ];

  const handleToggleBookmark = (id: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isBookmarked: !r.isBookmarked } : r))
    );
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const added: LibraryResource = {
      id: `res-${Date.now()}`,
      title: newTitle.trim(),
      author: newAuthor.trim() || 'Department Faculty',
      resourceType: newType,
      subject: newSubject.trim() || 'Computer Science',
      department: 'Computer Science & Engineering',
      description: newDesc.trim() || 'Official academic learning material approved for semester courses.',
      location: newLocation.trim() || 'Digital Repository',
      accessUrl: newUrl.trim() || 'https://campus.edu/portal/resources/file.pdf',
      availability: 'Digital PDF',
      visibility: 'All Students',
      isBookmarked: false,
      lastUpdated: 'Today',
    };

    setResources((prev) => [added, ...prev]);
    setIsAddModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewAuthor('');
    setNewSubject('');
    setNewLocation('');
    setNewUrl('');
    setNewDesc('');
    setNotice(`"${added.title}" has been published to the student catalog.`);
    setTimeout(() => setNotice(null), 4000);
  };

  const filteredResources = resources.filter((r) => {
    const matchesType = selectedType === 'All' || r.resourceType === selectedType;
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.author.toLowerCase().includes(search.toLowerCase()) ||
      r.subject.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchesSaved = !showSavedOnly || r.isBookmarked;
    return matchesType && matchesSearch && matchesSaved;
  });

  return (
    <div className="space-y-6">
      {notice && (
        <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-emerald-800 text-sm flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
          <button type="button" onClick={() => setNotice(null)} className="text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t.library.title}</h2>
          <p className="text-xs text-slate-500 mt-1">{t.library.subtitle}</p>
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
            <span>{t.library.saved} ({resources.filter((r) => r.isBookmarked).length})</span>
          </button>

          {(role === 'faculty' || role === 'admin') && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Upload / Link Material</span>
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
            placeholder={t.library.searchPlaceholder}
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
          {types.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                selectedType === type
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <p className="text-sm font-semibold text-slate-800">No resources matched your search query</p>
          <p className="text-xs text-slate-400 mt-1">Try searching for keywords like &quot;Algorithms&quot;, &quot;Normalization&quot;, or &quot;Database&quot;.</p>
          {(search || selectedType !== 'All' || showSavedOnly) && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setSelectedType('All');
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
          {filteredResources.map((res) => (
            <ResourceCardItem
              key={res.id}
              resource={res}
              onToggleBookmark={handleToggleBookmark}
            />
          ))}
        </div>
      )}

      {/* Upload/Link Resource Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Upload or Link Course Material</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddResource} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. CS305 Unit 4: ACID Properties and B-Tree Indexing"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Author / Faculty</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Dr. Priya Varma"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Resource Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as LibraryResource['resourceType'])}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none"
                  >
                    <option value="Lecture Notes">Lecture Notes</option>
                    <option value="Textbook">Textbook</option>
                    <option value="Exam Solutions">Exam Solutions</option>
                    <option value="Lab Manual">Lab Manual</option>
                    <option value="Research Paper">Research Paper</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="e.g. Database Systems"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Shelf or Repository</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Digital PDF Repository"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Access URL</label>
                <input
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://campus.edu/portal/cs305-notes.pdf"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Syllabus Scope</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Summarize key chapters, topics, or lab tasks covered..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none"
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
                  Publish Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
