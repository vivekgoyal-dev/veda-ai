# VedaAI — AI Assessment Creator

Full-stack hiring assignment for VedaAI. A teacher-facing tool that lets you describe an assignment in a structured form and generates a printable question paper using AI, with real-time progress over WebSocket.

**Stack:** Next.js 16 (App Router, React 19, Tailwind v4) on the frontend; Node + Express + TypeScript with MongoDB, Redis, BullMQ, and Socket.IO on the backend; Google Gemini for question generation.

---

## Demo flow

1. Open the Assignments dashboard. If empty, you see the 0-state with a single "Create Your First Assignment" call to action.
2. Click **Create Assignment**. Fill in title, subject, class, due date, question types (with per-type counts + marks), optional reference material, and additional instructions.
3. Submit. The frontend opens the output page and subscribes to that assignment over Socket.IO. A backend worker picks up the BullMQ job, calls Gemini, parses + validates the structured JSON, and stores it.
4. As the worker progresses you see a live progress bar; when the paper is ready it renders in a printable exam-paper layout with difficulty badges and an answer key.
5. **Download as PDF** opens a print dialog scoped to the question paper. **Regenerate** re-queues the job.

---

## Architecture

```
┌────────────────────┐        REST          ┌────────────────────┐
│  Next.js frontend  │  ───────────────────▶│  Express API       │
│  (Zustand store,   │ ◀──── WebSocket ─────│  (Socket.IO)       │
│   socket.io-client)│                       │                    │
└────────────────────┘                       │   ▲       │        │
                                             │   │       ▼        │
                                             │  Mongo   BullMQ ───┼─▶ Redis
                                             │           │        │
                                             │           ▼        │
                                             │   Generation       │
                                             │   Worker           │
                                             │   (Gemini)         │
                                             └────────────────────┘
```

- **POST `/api/assignments`** — validates, persists, enqueues a `generate` job.
- **BullMQ worker** — pulls job, builds a structured prompt, calls Gemini, validates the JSON shape, stores `paper` on the document, emits a Socket.IO event to subscribers.
- **WebSocket** — clients call `socket.emit("subscribe", id)` and receive `assignment:update` events.
- **LLM output is never rendered raw** — it is parsed, shape-checked, and mapped into a typed `GeneratedPaper`.

## Key design choices

- **Pixel-led layout, not pixel-traced.** The Figma file isn't shared to my Figma plan, so I worked from the screenshots: rebuilt the sidebar / topbar / forms / cards / output paper in Tailwind v4 with CSS variables for the design tokens (accent orange, surface, border, difficulty colors) in `frontend/app/globals.css`.
- **Background generation, not request/response.** Gemini calls can take 15–40s; doing them in the request would block the API and starve other users. BullMQ + Redis gives retries, observability and concurrency control.
- **Real-time updates.** Socket.IO rooms scoped to `assignment:{id}` so multiple tabs/devices see the same progress without polling.
- **Structured prompting.** `services/prompt.service.ts` converts the form into a deterministic, JSON-only prompt with a strict schema. The Gemini service strips code fences, defensively extracts the JSON, and validates required fields before persisting.
- **Optional file upload.** Text-like files are read in the browser and sent as `uploadedMaterial`. Binary files are referenced by name only — a server-side parser could be added later without changing the LLM contract.
- **Zustand** for client state — the assignments list and per-record patches stay in one store and survive route changes.

## Repo layout

```
vedaai-assignment/
├── backend/
│   ├── src/
│   │   ├── config/      env, mongo, redis
│   │   ├── models/      Assignment mongoose model
│   │   ├── routes/      REST endpoints
│   │   ├── services/    Gemini + prompt building
│   │   ├── queues/      BullMQ queue definition
│   │   ├── workers/     Generation worker
│   │   ├── sockets/     Socket.IO setup + emit helpers
│   │   └── index.ts
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── assignments/             dashboard
│   │   ├── assignments/new/         create form
│   │   └── assignments/[id]/        output page
│   ├── components/                  Sidebar, Topbar, AssignmentCard, QuestionPaper, ...
│   ├── lib/                         api, socket, types, pdf
│   └── store/                       Zustand assignment store
├── docker-compose.yml               local Mongo + Redis
└── README.md
```

---

## Running locally

### Prerequisites

- Node.js 20+
- Either Docker (for local Mongo + Redis) **or** cloud Mongo Atlas + Upstash / Redis Cloud connection strings
- A Google AI Studio API key — https://aistudio.google.com/app/apikey

### 1. Clone + install

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Start Mongo + Redis

If you have Docker:

```bash
docker compose up -d
```

Otherwise, point the backend at your hosted Mongo and Redis URLs in `.env`.

### 3. Backend

```bash
cd backend
cp .env.example .env
# set GEMINI_API_KEY=... and adjust MONGODB_URI / REDIS_URL if needed
npm run dev
```

The dev script runs the API and the BullMQ worker in the same process. In production deploy them separately (`npm run start` + `npm run worker:prod`).

### 4. Frontend

```bash
cd frontend
cp .env.local.example .env.local
# set NEXT_PUBLIC_API_BASE=http://localhost:4000
npm run dev
```

Open http://localhost:3000.

---

## Deployment

### Backend → Railway

1. Create a new Railway project, add the **MongoDB** and **Redis** plugins. Railway will inject `MONGO_URL` / `REDIS_URL` — set:
   - `MONGODB_URI` ← copy from the MongoDB plugin
   - `REDIS_URL`   ← copy from the Redis plugin
   - `GEMINI_API_KEY` ← from AI Studio
   - `CORS_ORIGIN` ← your Vercel URL
2. Deploy from the `backend/` directory (Railway auto-detects Node, uses `npm run build` + `npm start`).
3. Optionally split the worker into a separate Railway service running `npm run worker:prod`. For demo traffic the in-process worker is fine.

### Frontend → Vercel

1. Import the `frontend/` directory.
2. Set `NEXT_PUBLIC_API_BASE=https://<your-railway-backend-url>`.
3. Deploy. Vercel handles Next.js 16 + Turbopack natively.

---

## Validation rules

- Title, due date, at least one question type (handled by `zod` on the backend and by `validate()` on the frontend).
- Per row: type, label, count ≥ 1, marks ≥ 1.
- No duplicate question types in the same form.
- All numeric fields are constrained on both client (counter min/max) and server (zod `min/max`).

## What I'd add next

- Streaming token-by-token preview in the output page using Gemini's stream API.
- Server-side parsing for PDF/Image uploads (currently text-like files only — binaries are referenced by name).
- Per-question regeneration ("rewrite this one question") instead of regenerating the whole paper.
- Auth + per-teacher data isolation.

---

## Tech checklist (from the brief)

- [x] Next.js + TypeScript frontend
- [x] Pixel-perfect-style replication of the provided Figma screens (sidebar, topbar, dashboard 0/filled state, create assignment, output)
- [x] Form validation (no empty/negative values, no duplicates)
- [x] Zustand state management
- [x] WebSocket client (`socket.io-client`)
- [x] Node + Express + TypeScript backend
- [x] MongoDB persistence (`mongoose`)
- [x] Redis (`ioredis`)
- [x] BullMQ background jobs with retries
- [x] WebSocket server (`socket.io`) with per-assignment rooms
- [x] LLM (Gemini) with structured JSON prompt + parsing — never renders raw response
- [x] Output page: student info block, sections with titles + instructions, difficulty badges, marks, answer key
- [x] PDF export (print-formatted, not raw HTML)
- [x] Regenerate action
- [x] Mobile-responsive layout
- [x] Deployable to Vercel + Railway
