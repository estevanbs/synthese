# Synthese: AI-Powered Knowledge Base

A personal knowledge base that captures unstructured notes and turns them into organized, cumulative summaries — per topic, in the language you wrote them.

---

## How it works

1. **Write** — Dump free-form thoughts into the text area. No formatting needed.
2. **Save** — Click "Save notes" (or Ctrl+Enter). Claude reads your input, identifies the topics mentioned, and generates a cumulative summary for each one.
3. **Browse** — Topics appear in the sidebar. Click one to read its latest summary.
4. **Repeat** — Each new save updates the summary: older content is condensed, new content gets full detail.

Notes are always written in the language you use. Write in Portuguese, get Portuguese notes.

---

## Tech stack

**Frontend:** Angular 21, TypeScript 5.9, Playwright (E2E)

**Backend:** NestJS 11, TypeScript 5.9, Prisma 7 (PostgreSQL)

**AI:** Anthropic Claude via `@anthropic-ai/sdk`

**Tooling:** Nx 22 monorepo, pnpm, Jest 30, ESLint 9, Docker Compose

---

## Getting started

### Prerequisites

- Node.js 20+
- pnpm
- Docker (for PostgreSQL)
- An Anthropic API key

### Setup

```bash
# Install dependencies
pnpm install

# Start PostgreSQL
docker-compose up -d

# Run database migrations
pnpm prisma migrate dev

# Set your API key
export ANTHROPIC_API_KEY=sk-...

# Start API (port 3000) and web (port 4200) in separate terminals
pnpm nx serve api
pnpm nx serve web
```

Swagger docs are available at `http://localhost:3000/docs`.

---

## Project structure

```
synthese/
├── apps/
│   ├── api/          # NestJS REST API
│   ├── api-e2e/      # API integration tests (axios + live server)
│   ├── web/          # Angular SPA
│   └── web-e2e/      # Playwright browser tests
└── libs/
    ├── domain/       # Interfaces, entities, DI tokens — no framework deps
    ├── database/     # Prisma repositories + generated client
    └── ai/           # Claude AI processor implementation
```

The dependency flow is strict: `apps/` → `libs/database` | `libs/ai` → `libs/domain`. Nothing in `libs/domain` imports from outer layers.

---

## Development commands

```bash
# Unit tests
pnpm nx test api
pnpm nx test ai

# Single test file
pnpm nx test api --testFile=src/synthesize/synthesize.service.spec.ts

# E2E tests (requires running API + Postgres + ANTHROPIC_API_KEY for synthesize tests)
pnpm nx e2e api-e2e

# Lint / type-check / format
pnpm nx lint api
pnpm nx typecheck api
pnpm nx format:write

# Build
pnpm nx build api
pnpm nx build web
```

---

## License

MIT
