# CampusGenie User Flows

## Student asks a campus question
Dashboard → Ask Campus AI → Type/select suggested question → Retrieve approved sources → Generate answer → Show citations and uncertainty → User opens source or asks follow-up.

Fallback: if no reliable source exists, say that the information could not be verified and offer official contact/source options.

## Student discovers an event
Dashboard/Events → Search or choose category → Open event → Review date, venue, deadline, eligibility → Bookmark or register → Confirmation state.

Registration must be backed by a real event service; otherwise label the action as a demo.

## Student finds a library resource
Library → Search → Filter results → Open resource details → Check access/availability → Open authorized link or bookmark.

## Student practices an interview
Placements → Select target role/topic → Receive question → Submit response → AI feedback → Try again/save session → View progress.

## Faculty publishes material
Sign in → Verify faculty role → Select course → Upload or link approved resource → Validate metadata/access → Publish → Resource becomes searchable for authorized users.

## Administrator publishes an event
Sign in → Verify admin role → Create event → Validate fields/deadline → Preview → Publish → Event appears in discovery results.

## Navigation model
Dashboard
├── AI Assistant
├── Timetable
├── Events
├── Library
├── Campus Directory
├── Placement Preparation
├── Profile & Preferences
└── Role-specific tools
    ├── Faculty: courses/resources/announcements
    └── Admin: events/resources/announcements/aggregated analytics
