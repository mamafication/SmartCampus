# CampusGenie Technical Architecture

## Recommended stack
- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, Lucide React.
- UI primitives: shadcn/ui where suitable.
- API: Node.js + Express (or framework already used by the repository).
- Data: PostgreSQL + Prisma/Drizzle, or Supabase.
- Auth: managed auth or secure server sessions.
- AI: provider-agnostic service called only from the server.
- Retrieval: document parsing, chunking, embeddings, vector store, metadata/permission filters.
- Testing: Vitest, React Testing Library, API integration tests, Playwright for critical end-to-end flows.

## Logical architecture
```text
Browser UI
  ├── Auth/session client
  ├── Feature pages/components
  └── Typed API client
          │ HTTPS
          ▼
Backend API
  ├── Authentication + role authorization
  ├── Timetable / Events / Library / Placement services
  ├── AI orchestration service
  │     ├── Permission-filtered retrieval
  │     ├── LLM provider adapter
  │     └── Citation/grounding formatter
  ├── Validation, rate limits, audit events
  └── Database access layer
          │
          ├── PostgreSQL
          ├── Approved document/object storage
          └── Optional vector index / map / calendar integrations
```

## AI request sequence
1. Authenticate user and verify role.
2. Validate request length, language, and rate limits.
3. Classify whether campus-specific retrieval is needed.
4. Retrieve only documents the user is authorized to access.
5. Send retrieved excerpts to the model as untrusted reference data.
6. Instruct the model to answer only from evidence for campus-specific facts and to state uncertainty.
7. Return answer plus source metadata; validate citation IDs against retrieved results.
8. Store only necessary history under documented retention controls.
9. Log latency/error codes without storing sensitive prompts by default.

## Suggested API routes
- `GET /api/me`
- `GET /api/timetable?date=YYYY-MM-DD`
- `GET /api/events?q=&category=&from=`
- `GET /api/events/:id`
- `POST /api/events/:id/bookmark`
- `GET /api/resources?q=&type=&subject=`
- `GET /api/locations?q=&category=`
- `POST /api/ai/chat`
- `GET /api/ai/conversations`
- `POST /api/placement/sessions`
- `POST /api/placement/sessions/:id/answers`
- `GET /api/admin/analytics` (admin-only, aggregated)
- `POST /api/admin/events` (admin-only)

## Environment and secrets
Use `.env.example` as a template. Never ship real API keys to the browser. Validate required environment variables at server startup. If an AI key is absent, use a clearly labeled demo adapter.

## Operational safeguards
- Server-side role checks on every protected endpoint.
- Tenant/campus scope in every query.
- Rate limits and usage budgets on AI routes.
- Upload file type/size checks and malware scanning where supported.
- Prompt injection defenses for retrieved documents.
- Backups and retention/deletion policy before production.
