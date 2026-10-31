import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CampusGenie — AI Campus Companion',
  description: 'Unified AI campus companion for schedules, grounded AI answers, events, library resources, placements, and role-based campus tools.',
  openGraph: {
    title: 'CampusGenie — AI Campus Companion',
    description: 'Unified AI campus companion for schedules, grounded AI answers, events, library resources, placements, and role-based campus tools.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CampusGenie — AI Campus Companion',
    description: 'Unified AI campus companion for schedules, grounded AI answers, events, library resources, placements, and role-based campus tools.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
