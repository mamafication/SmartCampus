'use client';

import React, { useState } from 'react';
import {
  MOCK_USERS,
  MOCK_TIMETABLE,
  MOCK_EVENTS,
  MOCK_RESOURCES,
  MOCK_LOCATIONS,
  MOCK_ANNOUNCEMENTS,
  MOCK_ANALYTICS,
} from '@/lib/mockData';
import { UserRole, Language, CampusEvent } from '@/lib/types';
import { AppShell } from '@/components/AppShell';
import { DashboardView } from '@/components/DashboardView';
import { AiAssistantView } from '@/components/AiAssistantView';
import { TimetableView } from '@/components/TimetableView';
import { EventsView } from '@/components/EventsView';
import { LibraryView } from '@/components/LibraryView';
import { DirectoryView } from '@/components/DirectoryView';
import { PlacementPrepView } from '@/components/PlacementPrepView';
import { FacultyPortalView } from '@/components/FacultyPortalView';
import { AdminPortalView } from '@/components/AdminPortalView';

export default function HomePage() {
  const [role, setRole] = useState<UserRole>('student');
  const [language, setLanguage] = useState<Language>('en');
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [aiPrompt, setAiPrompt] = useState<string>('');

  // Interactive app state
  const [timetable] = useState(MOCK_TIMETABLE);
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [resources, setResources] = useState(MOCK_RESOURCES);
  const [locations] = useState(MOCK_LOCATIONS);
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);

  const currentUser = MOCK_USERS[role];

  const handleAskAi = (prompt: string) => {
    setAiPrompt(prompt);
    setCurrentTab('ai');
  };

  const handleToggleBookmarkEvent = (id: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isBookmarked: !e.isBookmarked } : e))
    );
  };

  const handleRegisterEvent = (event: CampusEvent) => {
    if (event.isRegistered) return;
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id
          ? { ...e, isRegistered: true, registeredCount: e.registeredCount + 1 }
          : e
      )
    );
  };

  const savedResourceCount = resources.filter((r) => r.isBookmarked).length;

  return (
    <AppShell
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      user={currentUser}
      setUserRole={setRole}
      language={language}
      setLanguage={setLanguage}
      announcements={announcements}
    >
      {currentTab === 'dashboard' && (
        <DashboardView
          user={currentUser}
          timetable={timetable}
          events={events}
          announcements={announcements}
          savedResourceCount={savedResourceCount}
          language={language}
          onNavigate={setCurrentTab}
          onAskAi={handleAskAi}
          onToggleBookmarkEvent={handleToggleBookmarkEvent}
          onRegisterEvent={handleRegisterEvent}
        />
      )}

      {currentTab === 'ai' && (
        <AiAssistantView
          language={language}
          role={role}
          initialPrompt={aiPrompt}
        />
      )}

      {currentTab === 'timetable' && (
        <TimetableView
          timetable={timetable}
          language={language}
        />
      )}

      {currentTab === 'events' && (
        <EventsView
          events={events}
          setEvents={setEvents}
          language={language}
          role={role}
        />
      )}

      {currentTab === 'library' && (
        <LibraryView
          resources={resources}
          setResources={setResources}
          language={language}
          role={role}
        />
      )}

      {currentTab === 'directory' && (
        <DirectoryView
          locations={locations}
          language={language}
        />
      )}

      {currentTab === 'placements' && (
        <PlacementPrepView language={language} />
      )}

      {currentTab === 'faculty' && (
        <FacultyPortalView
          user={currentUser}
          timetable={timetable}
          announcements={announcements}
          setAnnouncements={setAnnouncements}
          language={language}
        />
      )}

      {currentTab === 'admin' && (
        <AdminPortalView
          analytics={MOCK_ANALYTICS}
          language={language}
          onOpenCreateEvent={() => {
            setCurrentTab('events');
          }}
        />
      )}
    </AppShell>
  );
}
