# Product Requirements Document (PRD)
## CampusGenie — AI Campus Companion
**Version:** 1.0 | **Status:** MVP planning | **Theme:** Light

## 1. Product summary
CampusGenie unifies common campus tasks in one accessible web app: timetable overview, event discovery, library/resource search, AI doubt resolution, campus facility lookup, placement practice, and announcements. Generative AI is used to explain concepts, answer questions grounded in approved campus documents, summarize authorized materials, and generate practice questions.

## 2. Problem statement
Campus information is often scattered across portals, noticeboards, messaging groups, PDFs, and departmental pages. Students spend time finding accurate information; faculty repeat answers; administrators lack a clear aggregated view of recurring needs. CampusGenie provides a single, searchable, multilingual entry point while clearly distinguishing verified information from generated suggestions.

## 3. Goals
- Reduce time needed to find common campus information.
- Make academic support available outside office hours.
- Improve discovery of relevant events and library resources.
- Give students a practical way to rehearse placement interviews.
- Help authorized staff spot recurring operational issues using aggregated metrics.

## 4. Non-goals for MVP
- Replacing the official student information system or learning management system.
- Live GPS tracking or indoor navigation without a verified map integration.
- Automatically changing official timetables.
- Making high-stakes academic, financial, disciplinary, or placement decisions.
- Publicly exposing student chats or personal records.
- Claiming live integrations where only demo data is available.

## 5. Personas
### Student
Needs: today's schedule, reliable campus answers, study resources, events, placement practice.
Success: finds relevant information quickly and can tell which answers are sourced.

### Faculty member
Needs: share approved course materials, see class schedule, publish announcements, reduce repetitive FAQs.
Success: can update information without exposing private student data.

### Administrator
Needs: manage approved announcements/events/resources and review aggregated trends.
Success: sees operational patterns without access to private chats by default.

## 6. MVP scope and priority
### Must have
- Responsive student dashboard with clearly labeled demo data.
- AI assistant UI with server-side provider abstraction and demo fallback.
- Approved-document retrieval/citations architecture.
- Timetable view (read-only sample schedule in MVP).
- Searchable events and library resources.
- Placement practice question flow and answer feedback.
- Language preference (English/Hindi UI-ready; AI language behavior configurable).
- PRD/design docs and wireframes.
- Authentication and server-side role checks before production use.

### Should have
- Bookmarks, event registration, timetable conflict indicators.
- Faculty content/announcement tools.
- Admin dashboard with aggregate, privacy-conscious analytics.
- PDF ingestion for authorized documents and retrieval.

### Could have
- Calendar sync, push notifications, campus map integration, additional languages.
- Voice input, accessibility route preferences, LMS/SIS integration.

## 7. Functional requirements
| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| FR-01 | Role-aware dashboard | Must | Student, faculty, admin see appropriate navigation; role is verified server-side. |
| FR-02 | AI campus assistant | Must | User can ask a question, see loading/error states, and receive an answer or clearly labeled demo response. |
| FR-03 | Grounded answers | Must | Campus-specific answers use approved retrieved sources and show source title/link; no source means assistant states uncertainty. |
| FR-04 | Timetable | Must | Daily/weekly schedule renders; user can change day and see subject, time, room, faculty. |
| FR-05 | Event discovery | Must | Search/filter by category and date; event detail shows venue, deadline, and registration status. |
| FR-06 | Library search | Must | Search/filter resources; results show title, type, author, and legitimate access details. |
| FR-07 | Placement practice | Must | User selects a role/topic, receives practice questions, submits an answer, and sees constructive feedback. |
| FR-08 | Campus directory | Should | Searchable facilities list; routes are only shown when backed by verified map data. |
| FR-09 | Bookmarks | Should | User can save/unsave events and resources; persistence is per-user when backend exists. |
| FR-10 | Admin content | Should | Authorized staff can create/update events, announcements, and resource metadata. |
| FR-11 | Multilingual support | Must | User can select English/Hindi; fallback language is visible and failures are handled. |
| FR-12 | Analytics | Should | Admin sees aggregated counts; small groups and private chat contents are not exposed by default. |
| FR-13 | Responsive UI | Must | Core flows work at 360px mobile, tablet, and desktop widths. |
| FR-14 | Accessibility | Must | Keyboard operation, visible focus, labels, semantic landmarks, and sufficient contrast. |

## 8. Non-functional requirements
- Security: server-side authorization, secret management, input validation, rate limiting, secure session handling.
- Privacy: data minimization, transparent retention, user-controlled deletion where applicable.
- Reliability: graceful degradation when AI, database, or map providers are unavailable.
- Performance: aim for dashboard content to become usable within 2.5 seconds on a typical connection; measure rather than assume.
- Accessibility: target WCAG 2.2 AA.
- Maintainability: typed modules, reusable components, documented API contracts, automated tests.
- Observability: structured logs without raw sensitive prompts by default; monitor failures and latency.

## 9. Key user stories
- As a student, I want to ask where a campus office is so I can find it without searching multiple sites.
- As a student, I want a step-by-step explanation of a topic so I can understand it, not just copy an answer.
- As a student, I want to see my next class so I can plan my day.
- As a student, I want to filter events by interest and deadline.
- As a student, I want interview practice with feedback and a saved progress history.
- As faculty, I want to publish approved course material with correct access permissions.
- As an administrator, I want aggregate trends that help prioritize campus improvements without reading private chats.

## 10. AI behavior and evaluation
- Use a provider-agnostic server-side AI service.
- For campus-specific queries, retrieve from an approved knowledge base before generation.
- Cite source title and link for retrieved facts.
- Instruct the model to say when information is missing or conflicting.
- Treat retrieved documents as untrusted data, not instructions.
- Do not expose secrets, hidden prompts, private records, or unauthorized documents.
- Evaluate groundedness, citation correctness, helpfulness, language quality, refusal/fallback behavior, latency, and cost.
- Build a test set of at least 30 representative questions before a pilot; include unanswerable and conflicting-source questions.
- Demo mode must be labeled and must not imply a live model is connected.

## 11. Success metrics (initial targets; validate with pilot)
- At least 70% successful completion for five core student tasks in usability testing.
- At least 80% of evaluated campus-specific answers correctly cite an approved source.
- Fewer than 5% of test answers contain unsupported campus-specific claims.
- Track median time-to-find a resource, event discovery clicks, practice completion, and user-reported usefulness.
- Establish baselines before interpreting adoption or satisfaction targets.

## 12. Risks and mitigations
- Hallucinated campus details → RAG, citations, explicit uncertainty, human-approved sources.
- Stale timetable/events → show last-updated timestamps and data ownership.
- Privacy leakage → role checks, tenant scoping, minimal logs, access tests.
- API cost/availability → rate limits, usage budgets, caching where safe, demo fallback.
- Poor adoption → usability testing with students/faculty and feedback collection.
- Inaccessible map data → directory fallback; never fabricate routes.

## 13. Roadmap
1. Discovery and PRD validation.
2. Design system, wireframes, prototype.
3. Frontend MVP with seeded demo data.
4. Authentication, database, authorization.
5. AI endpoint and grounded retrieval.
6. Testing, accessibility review, pilot.
7. Calendar/maps integrations and production rollout.

## 14. Release criteria
- All Must-have requirements pass documented tests.
- No critical/high security issues remain open.
- Demo/live states are clearly labeled.
- Privacy notice and data-retention rules are documented.
- Core pages work on mobile and keyboard.
- Setup, environment, migration, and deployment instructions are verified.
