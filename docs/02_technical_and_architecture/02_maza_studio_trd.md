# TRD - MAZA Studio

Version: 3.0 (Unified)

---

# Architecture Principles
1. **Single Source of Truth**: Data models should not be duplicated across components. `posts` and `scheduled_posts` have specific relational meaning.
2. **One Engine Policy**: `generationWorker` and `publishWorker` are the ONLY workers allowed to pull from queues.
3. **Cross-Document Compliance**: All architecture decisions must align with `MASTER_CONSTITUTION.md`, `PRD.md`, and `AGENTS.md`. Refer to the **Domain‑Boundary Matrix** (`docs/domain_boundary_matrix.md`) for detailed domain separation rules. When documents differ, prioritize system safety and AdSense compliance.
4. **No Direct DB from UI**: UI Components MUST fetch data via the Express API (`server/routes/`). Directly initializing the Supabase client inside `.tsx` components and querying tables is strictly prohibited (prevents RLS bypass vulnerabilities and spaghetti code).
5. **UI Audit & Enforcement**:
   - **Frontend table access is forbidden**: `posts`, `scheduled_posts`, `topic_clusters`, `sites`, and related tables must never be queried or mutated directly from `/src/components` or `/src/pages`.
   - **Allowed Supabase usage in UI**: only realtime channel subscriptions and auth/session state retrieval in shared utility hooks; direct `supabase.from(...)` CRUD is banned.
   - **Refactor pattern**: Replace direct Supabase calls with backend endpoints and client-side helpers such as `fetchApi` / `fetchApiJson`.
   - **Audit markers**: search for `supabase.from(`, `supabase.auth.getUser`, `supabase.auth.getSession`, `supabase.storage.from(` in UI code. Each finding should be reviewed and refactored into an API call.
   - **Critical enforcement point**: `src/components/SeriesCommander.tsx` is the highest-priority UI file for this rule because it is the main Autopilot dashboard and currently centralizes most series/post workflow logic.
   - **Living document**: This TRD must be updated whenever frontend API coverage changes or new UI data routes are introduced.
5. **Resilience**: The system relies heavily on automated background tasks. We must employ sensible retry mechanisms (max 3-5 retries for a queue job) and handle `worker_locked` status to prevent zombie jobs.

---

# Backend Stack
- **API Server**: Node.js / Express
- **Database**: Supabase (PostgreSQL)
- **Queues/Cache**: Redis
- **Background Workers**: Node.js scripts running via `tsx` or `ts-node` polling Redis queues (`content-generation`, `content-publish`).

# Frontend Stack
- **Framework**: React / Vite
- **Data Fetching**: Custom hooks abstracting `fetch()` or `axios` calls to the local Express API.
- **Key Dashboards**: `AutopilotDashboard.tsx` -> `SeriesCommander.tsx`

---

# Frontend Data Access Rules
1. **API-only data access**: UI components and pages must never perform direct Supabase CRUD operations against application tables (`posts`, `scheduled_posts`, `sites`, `topic_clusters`, etc.). All data reads/writes must go through server API routes under `server/routes/`.
2. **Allowed Supabase usage**:
   - Realtime subscriptions using `supabase.channel(...)`
   - Authentication/session state read via `supabase.auth.getSession()` in shared auth utilities only
   - Storage operations only when uploading/downloading user files, and only via authenticated server endpoints where possible
3. **Forbidden patterns**:
   - `supabase.from('...')`
   - `supabase.auth.getUser()` inside components/pages for business logic
   - direct `supabase.storage.from(...)` CRUD in UI logic
4. **Implementation pattern**:
   - create server endpoint in `server/routes/dashboard.ts` or a dedicated route file
   - validate ownership and permissions in the endpoint using `requireAuth`
   - expose only the necessary fields and compute derived state server-side
   - consume the endpoint from frontend via `fetchApi` / `fetchApiJson`
   - wrap endpoint calls in hooks like `useSeriesData` to keep UI components thin
5. **Audit process**:
   - run grep for `supabase.from(`, `supabase.auth.getUser`, `supabase.auth.getSession`, `supabase.storage.from(` in `src/components` and `src/pages`
   - convert each finding into a server API route and corresponding frontend hook
   - mark the refactor as complete only when the frontend file no longer imports or calls Supabase table operations
6. **Critical enforcement point**:
   - `src/components/SeriesCommander.tsx` is the primary compliance gate because it controls the main Autopilot Series workflow and historically contains the most direct DB access.

---

# Publishing Architecture (Extension Integration)
1. **`tasks/next` Endpoint**: Chrome extension polls `GET /api/tasks/next` to check for `ready_to_publish` tasks that belong to the user.
2. **Locking**: The backend locks the task (`worker_locked: true`) when the extension claims it.
3. **Publishing**: Extension injects a content script into the Tistory editor, fills in `html_content`, and publishes.
4. **Callback**: Extension reports back to `POST /api/tasks/report` to update the post status to `published` (or `failed`).

This ensures our publishing process is invisible to server-side bot-detection, maintaining AdSense compliance.
