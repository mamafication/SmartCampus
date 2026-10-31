# CampusGenie Test Plan

## Unit tests
- Search/filter helpers and form validation.
- Role-to-navigation mapping.
- Timetable grouping and conflict detection.
- Citation rendering and invalid citation rejection.
- AI fallback and provider error handling.
- Date/time formatting and language preference.

## Integration tests
- Authenticated API routes enforce role and ownership.
- Events and resources return correct filtered results.
- Bookmark creation/removal is idempotent.
- AI endpoint applies retrieval permissions and rate limits.
- Missing AI provider key triggers clearly labeled demo behavior.
- Admin analytics contain aggregated data only.

## End-to-end scenarios
1. Student signs in and sees their dashboard.
2. Student changes timetable day and sees correct entries.
3. Student searches and bookmarks an event.
4. Student searches a library resource and opens its authorized link.
5. Student asks an AI question and sees citations or an uncertainty fallback.
6. Student completes a placement practice session.
7. Non-admin cannot access admin pages or endpoints.
8. Mobile user completes core tasks at 360px viewport.
9. Keyboard-only user navigates main flows.
10. AI/database outage shows helpful recovery states.

## AI evaluation cases
- Answerable campus question with one approved source.
- Question with multiple supporting sources.
- Unanswerable campus question.
- Conflicting or stale sources.
- Prompt injection inside a retrieved document.
- User requests another user's private data.
- English question requesting Hindi response.
- Academic question outside the campus knowledge base.
- Oversized/empty input.
- Provider timeout or rate limit.

## Release checklist
- [ ] Environment validation and secret scanning pass.
- [ ] Migrations and seed process are documented.
- [ ] Role authorization is tested server-side.
- [ ] No broken navigation or dead primary actions.
- [ ] Loading, empty, error, and success states exist.
- [ ] Responsive and accessibility checks pass.
- [ ] Demo data is labeled.
- [ ] Privacy/retention documentation is available.
- [ ] AI answer quality and citations are evaluated.
