export type UserRole = 'student' | 'faculty' | 'admin';
export type Language = 'en' | 'hi';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rollOrEmpId: string;
  department: string;
  semester?: string;
  preferredLanguage: Language;
  avatarUrl?: string;
}

export interface TimetableEntry {
  id: string;
  courseCode: string;
  courseName: string;
  room: string;
  building: string;
  instructor: string;
  weekday: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:15"
  type: 'lecture' | 'lab' | 'tutorial' | 'break';
  hasConflict?: boolean;
  notes?: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  category: 'Technical' | 'Cultural' | 'Sports' | 'Career & Placements' | 'Workshops' | 'Guest Lecture';
  date: string;
  time: string;
  venue: string;
  deadline: string;
  eligibility: string;
  registrationUrl?: string;
  status: 'Open' | 'Closing Soon' | 'Completed';
  registeredCount: number;
  maxCapacity: number;
  isBookmarked?: boolean;
  isRegistered?: boolean;
  organizer: string;
}

export interface LibraryResource {
  id: string;
  title: string;
  author: string;
  resourceType: 'Textbook' | 'Research Paper' | 'Lecture Notes' | 'Exam Solutions' | 'Lab Manual';
  subject: string;
  department: string;
  description: string;
  location: string; // e.g. "Floor 2, Shelf CS-14"
  accessUrl: string;
  availability: 'Available (Physical)' | 'Digital PDF' | 'Reserved' | 'In Circulation';
  copiesAvailable?: number;
  visibility: 'All Students' | 'Department Only' | 'Faculty Only';
  isBookmarked?: boolean;
  lastUpdated: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  category: 'Academic' | 'Administrative' | 'Library' | 'Sports' | 'Health' | 'Cafeteria' | 'Hostel';
  building: string;
  floor: string;
  roomNumber: string;
  description: string;
  operatingHours: string;
  contactPerson: string;
  contactEmail: string;
  phone: string;
  accessibilityNotes: string;
  coordinates?: { x: number; y: number };
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: 'All Campus' | 'Students' | 'Faculty';
  category: 'Academic' | 'Urgent' | 'Event' | 'Maintenance';
  publishedAt: string;
  authorName: string;
  authorRole: string;
  isPinned?: boolean;
}

export interface SourceCitation {
  id: string;
  title: string;
  category: string;
  section: string;
  url: string;
  updatedAt: string;
  confidence: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  citations?: SourceCitation[];
  uncertaintyFlag?: boolean;
  isDemo?: boolean;
}

export interface PlacementSession {
  id: string;
  targetRole: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question: string;
  sampleTips?: string[];
  userAnswer?: string;
  feedback?: {
    strengths: string[];
    improvements: string[];
    modelAnswer: string;
    score: number; // 1-10
  };
  submittedAt?: string;
}

export interface AggregatedAnalytics {
  totalQueriesThisWeek: number;
  avgResponseTimeMs: number;
  groundedCitationAccuracyPercent: number;
  activeStudentsToday: number;
  topSearchTopics: { topic: string; count: number }[];
  eventRegistrationsByCategory: { category: string; count: number }[];
  placementSessionsCompleted: number;
  avgPlacementScore: number;
}
