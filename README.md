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

## Run with Docker

A single image bundles the API and the Angular SPA — the API serves `/api/*` and the static frontend on the same port.

### Pull and run

```bash
# Start a Postgres if you don't have one running
docker-compose up -d

# Run the app (replace <dockerhub-user> with the published image owner)
docker run --rm -p 3000:3000 \
  -e ANTHROPIC_API_KEY=sk-... \
  -e DATABASE_URL="postgresql://postgres:postgres@host.docker.internal:5432/synthese" \
  <dockerhub-user>/synthese:latest
```

The container runs `prisma migrate deploy` on startup, then boots the API. The app is then reachable at:

- Frontend: `http://localhost:3000/`
- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/docs`

> On Linux hosts use `--add-host=host.docker.internal:host-gateway` (or point `DATABASE_URL` at the Postgres container's network address) so the container can reach the host's Postgres.

### Required environment variables

| Variable            | Required | Description                                    |
| ------------------- | -------- | ---------------------------------------------- |
| `ANTHROPIC_API_KEY` | yes      | Claude API key used by `libs/ai`.              |
| `DATABASE_URL`      | yes      | Postgres connection string for Prisma.         |
| `PORT`              | no       | API port. Defaults to `3000`.                  |
| `WEB_DIST_PATH`     | no       | Path to the SPA bundle. Preset to `/app/web`.  |

### Build the image locally

```bash
docker build -t synthese:local .
```

### CI / Docker Hub

`.github/workflows/docker-publish.yml` builds and pushes the image to Docker Hub on every push to `main` and on `v*` tags. It expects two repository secrets:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN` — a Docker Hub access token with write scope on the `synthese` repo.

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
