# CampusGenie Wireframe Specifications

## Global shell
Desktop:
```text
┌────────────────┬────────────────────────────────────────────────────┐
│ CampusGenie    │ Search campus...            Notifications  Profile │
│                ├────────────────────────────────────────────────────┤
│ Dashboard      │ Page title + description                           │
│ AI Assistant   │                                                    │
│ Timetable      │ Main page content                                  │
│ Events         │                                                    │
│ Library        │                                                    │
│ Campus Map     │                                                    │
│ Placements     │                                                    │
│ Settings       │                                                    │
└────────────────┴────────────────────────────────────────────────────┘
```

## Dashboard
```text
┌─────────────────────────────────────────────────────────────────────┐
│ Good morning, Student                          Today • Academic week │
├───────────────────────────────┬─────────────────────────────────────┤
│ Ask Campus AI                 │ Next class                          │
│ [Ask a campus question...] [↑]│ Data Structures • 10:00 • Room B204│
├────────────┬────────────┬─────┴──────────┬──────────────────────────┤
│ Timetable  │ Events     │ Library        │ Placement practice       │
├────────────┴────────────┴────────────────┴──────────────────────────┤
│ Upcoming events                    │ Announcements                  │
│ Event card / Event card            │ Notice list                    │
└─────────────────────────────────────────────────────────────────────┘
```

## AI Assistant
```text
┌─────────────────────────────────────────────────────────────────────┐
│ AI Campus Assistant       Language: English ▾    New conversation   │
├─────────────────────────────────────────────────────────────────────┤
│ Suggested: “Where is the library?” “Explain normalization.”          │
│                                                                     │
│ User question                                                       │
│ Assistant response with steps, caveat if needed, and source cards   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ [Ask a question...                                  ] [Send]         │
│ Answers may be AI-generated. Verify important information.           │
└─────────────────────────────────────────────────────────────────────┘
```

## Timetable
```text
┌─────────────────────────────────────────────────────────────────────┐
│ Timetable                          [Day] [Week] [Filter]             │
│ Mon Tue Wed Thu Fri                                                   │
├─────────────────────────────────────────────────────────────────────┤
│ 09:00  ── Mathematics       Room A101                                 │
│ 10:00  ── Data Structures   Room B204                                 │
│ 11:00  ── Break                                                        │
│ 12:00  ── Database Systems  Lab 2                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Events and library
- Search and filters at top.
- Results in responsive cards/list.
- Cards show metadata, not just decorative imagery.
- Detail view includes date/availability/access link and clear action.
- Empty state preserves search and offers a clear reset.

## Campus directory
- Search field and category chips.
- List of verified buildings/facilities.
- Map area only when actual map/location data is configured.
- Without integration, show directory and location descriptions instead of fake navigation.

## Placement preparation
- Select role, skill area, and difficulty.
- Practice question panel with answer editor.
- Feedback panel: strengths, improvement areas, example answer.
- Progress history and disclaimer that AI feedback is advisory.

## Faculty and admin
- Faculty: schedule, course resources, announcements.
- Admin: events/resources/announcements management and aggregate analytics.
- Destructive actions require confirmation; access is enforced by backend roles.

## Mobile layout
- Single-column cards.
- Sidebar becomes drawer or bottom navigation.
- Chat composer remains reachable and does not cover content.
- Timetable can switch to agenda list.
- Filters open in a sheet; no horizontal page overflow.
