'use client';

import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Clock,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Compass,
  Building,
  HeartHandshake,
  CheckCircle,
  X,
} from 'lucide-react';
import { CampusLocation, Language } from '@/lib/types';
import { TRANSLATIONS } from '@/lib/translations';

export function DirectoryView({
  locations,
  language,
}: {
  locations: CampusLocation[];
  language: Language;
}) {
  const t = TRANSLATIONS[language];
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(locations[0]);

  const categories = ['All', 'Library', 'Administrative', 'Academic', 'Health', 'Cafeteria'];

  const filtered = locations.filter((loc) => {
    const matchesCategory = selectedCategory === 'All' || loc.category === selectedCategory;
    const matchesSearch =
      loc.name.toLowerCase().includes(search.toLowerCase()) ||
      loc.building.toLowerCase().includes(search.toLowerCase()) ||
      loc.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t.directory.title}</h2>
          <p className="text-xs text-slate-500 mt-1">{t.directory.subtitle}</p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-xl border border-emerald-200 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified University Data</span>
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
            placeholder={t.directory.searchPlaceholder}
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

      {/* Main Grid: Interactive Map representation + Directory List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Directory Cards List */}
        <div className="lg:col-span-7 space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500">
              <Building className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-800">No campus offices match your search</p>
              <p className="text-xs text-slate-400 mt-1">Try searching by building name, room, or service.</p>
            </div>
          ) : (
            filtered.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id;
              return (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-200 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-700 uppercase">
                          {loc.category}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {loc.building} • {loc.floor}
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-900 text-sm leading-snug">{loc.name}</h3>
                    </div>
                    <span className="text-xs font-bold text-indigo-700 bg-white border border-indigo-200 px-2 py-0.5 rounded">
                      {loc.roomNumber}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">{loc.description}</p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{loc.operatingHours.split('|')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{loc.contactPerson.split('(')[0]}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Selected Facility Deep Detail & Schematic Campus Map */}
        <div className="lg:col-span-5">
          {selectedLocation ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs sticky top-20 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {selectedLocation.category} Hub
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2 leading-tight">
                  {selectedLocation.name}
                </h3>
                <p className="text-xs text-indigo-600 font-medium mt-0.5">
                  {selectedLocation.building} • {selectedLocation.floor} ({selectedLocation.roomNumber})
                </p>
              </div>

              {/* Schematic Map Visualizer */}
              <div className="bg-slate-900 rounded-xl p-4 text-white relative overflow-hidden h-48 border border-slate-800 flex flex-col justify-between">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="flex items-center justify-between text-xs text-slate-400 relative z-10">
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-indigo-400 animate-spin-slow" />
                    <span>Campus Schematic Coordinates</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono text-[10px]">
                    Grid ({selectedLocation.coordinates?.x}, {selectedLocation.coordinates?.y})
                  </span>
                </div>

                {/* Map Pin Marker */}
                <div className="relative z-10 flex flex-col items-center justify-center my-auto">
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-8 h-8 rounded-full bg-indigo-500/40 animate-ping" />
                    <div className="w-6 h-6 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center shadow-lg">
                      <MapPin className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-white mt-1.5 bg-slate-800/80 px-2 py-0.5 rounded">
                    {selectedLocation.name.split('&')[0]}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-1.5 relative z-10 flex items-center justify-between">
                  <span>Verified physical ground location</span>
                  <span className="text-indigo-400">Step-free corridor</span>
                </div>
              </div>

              {/* Location Operational Meta */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">Operational Hours:</span>
                    <p className="text-slate-600 mt-0.5">{selectedLocation.operatingHours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <User className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">Contact Official:</span>
                    <p className="text-slate-600 mt-0.5">{selectedLocation.contactPerson}</p>
                    <div className="flex items-center gap-3 mt-1 text-indigo-600 font-medium">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {selectedLocation.contactEmail}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {selectedLocation.phone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200 text-amber-900">
                  <HeartHandshake className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Accessibility & Navigational Notes:</span>
                    <p className="text-xs mt-0.5 leading-relaxed">
                      {selectedLocation.accessibilityNotes}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400">
              Select an office or facility from the list to view floor details and navigation notes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
