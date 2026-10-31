# CampusGenie Design System
## Design principles
Clarity first, calm visual hierarchy, accessible contrast, consistent patterns, mobile-first behavior, and clear separation between verified campus facts and AI-generated assistance.

## Light theme tokens
```css
:root {
  --color-bg: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-surface-muted: #F1F5F9;
  --color-primary: #4F46E5;
  --color-primary-hover: #4338CA;
  --color-primary-soft: #EEF2FF;
  --color-accent: #0284C7;
  --color-success: #15803D;
  --color-warning: #B45309;
  --color-danger: #B91C1C;
  --color-text: #0F172A;
  --color-text-muted: #64748B;
  --color-border: #E2E8F0;
  --radius-card: 16px;
  --radius-control: 10px;
  --shadow-card: 0 2px 10px rgb(15 23 42 / 0.04);
}
```

## Typography
- Font: Inter, system sans-serif fallback.
- Page title: 28–32px desktop / 24px mobile, semibold.
- Section title: 18–20px, semibold.
- Body: 14–16px.
- Helper text: 12–14px; do not use low-contrast gray.
- Line height: 1.45–1.65 for body text.

## Spacing
Use a 4px base scale: 4, 8, 12, 16, 24, 32, 40, 48.
Main desktop content max width: 1440px. Sidebar: 248px expanded / 72px collapsed.
Cards: 16–24px padding. Form controls: minimum 44px touch target where practical.

## Components
- AppShell: sidebar, topbar, main content, mobile navigation.
- Button: primary, secondary, outline, ghost, destructive; disabled and loading states.
- SearchInput: leading search icon, clear action, accessible label.
- StatCard: label, value, trend only when data supports it.
- EventCard: date, category, title, venue, deadline, bookmark.
- ScheduleItem: time, subject, room, faculty, status.
- ResourceCard: title, author, type, availability/access link.
- ChatMessage: role, timestamp, content, source citations, feedback controls.
- SourceCitation: title, type, last updated, link.
- EmptyState: concise message and a relevant next action.
- Toast/Alert: success, warning, error.
- Skeleton: match final component dimensions.

## Layout rules
- Desktop: left sidebar + topbar + content grid.
- Tablet: collapsible sidebar.
- Mobile: compact topbar and bottom navigation or drawer; avoid horizontal overflow.
- Use 12-column grid on desktop; cards stack on small screens.
- Keep AI chat content at readable line length (roughly 65–80 characters).

## Accessibility
- Aim for WCAG 2.2 AA.
- Never communicate status by color alone.
- Provide visible keyboard focus and skip-to-content link.
- All icon-only buttons need accessible names.
- Inputs require labels and useful validation messages.
- Respect reduced-motion preferences.
- Ensure chart summaries are available in text.

## AI-specific states
1. Idle with suggested prompts.
2. Sending/loading with cancel or retry when supported.
3. Answer with citations.
4. Partial/uncertain answer with clear caveat.
5. No approved source found.
6. Provider unavailable/demo mode.
7. Error with retry and non-AI fallback.
