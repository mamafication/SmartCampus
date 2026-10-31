# CampusGenie Data Model (Initial)

## Core tables
- `users`: id, name, email, role (`student|faculty|admin`), preferred_language, created_at.
- `courses`: id, code, title, department, term.
- `enrollments`: user_id, course_id, term.
- `timetable_entries`: id, course_id, faculty_user_id, weekday, start_time, end_time, room, term, updated_at.
- `events`: id, title, description, category, starts_at, ends_at, venue, registration_url, deadline, status, created_by.
- `event_bookmarks`: user_id, event_id, created_at.
- `event_registrations`: user_id, event_id, status, registered_at.
- `resources`: id, title, author, resource_type, subject, description, access_url, visibility, uploaded_by, updated_at.
- `resource_bookmarks`: user_id, resource_id, created_at.
- `campus_locations`: id, name, category, building, floor, description, verified_map_ref, accessibility_notes.
- `conversations`: id, user_id, title, created_at, deleted_at.
- `messages`: id, conversation_id, role, content, created_at, model_mode.
- `message_sources`: message_id, resource_id, excerpt_ref.
- `placement_sessions`: id, user_id, target_role, topic, difficulty, created_at.
- `placement_answers`: id, session_id, question, answer, feedback, created_at.
- `announcements`: id, title, body, audience, published_at, expires_at, created_by.
- `audit_events`: id, actor_user_id, action, resource_type, resource_id, created_at.

## Relationship notes
- Users can enroll in many courses through `enrollments`.
- Courses have many timetable entries.
- Users can bookmark many events/resources.
- A conversation has many messages; messages may cite many resources.
- Placement sessions contain multiple answers.
- Events and announcements track the authorized creator.
- Enforce foreign keys, unique constraints, indexes on search/filter fields, and campus/tenant scoping.

## Privacy notes
- Keep private conversations private to their owner unless a documented, consented support workflow exists.
- Do not use chat content for admin analytics by default.
- Define retention/deletion policy and handle deleted user data consistently.
- Apply access control to resources before retrieval, not after the model responds.
