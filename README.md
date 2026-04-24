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

**Backend:** NestJS 11, TypeScript 5.9, Prisma 7 (SQLite via better-sqlite3)

**AI:** Anthropic Claude via `@anthropic-ai/sdk`

**Tooling:** Nx 22 monorepo, pnpm, Jest 30, ESLint 9

---

## Getting started

### Prerequisites

- Node.js 20+
- pnpm
- An Anthropic API key

### Setup

```bash
# Install dependencies
pnpm install

# Create the SQLite database and run migrations
export DATABASE_URL="file:./dev.db"
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

A single image bundles the API, the Angular SPA, and a SQLite database — the API serves `/api/*` and the static frontend on the same port. The database lives in `/app/data` inside the container; mount a host volume there to keep your notes between runs.

### Pull and run

```bash
docker run --rm -p 3000:3000 \
  -e ANTHROPIC_API_KEY=sk-... \
  -v synthese-data:/app/data \
  estevanbs/synthese:latest
```

The container runs `prisma migrate deploy` on startup, creating the SQLite file inside the volume on first boot, then launches the API. The app is reachable at:

- Frontend: `http://localhost:3000/`
- API: `http://localhost:3000/api`
- Swagger: `http://localhost:3000/docs`

To use a host directory instead of a named volume:

```bash
docker run --rm -p 3000:3000 \
  -e ANTHROPIC_API_KEY=sk-... \
  -v "$(pwd)/synthese-data:/app/data" \
  estevanbs/synthese:latest
```

### Required environment variables

| Variable            | Required | Description                                                                  |
| ------------------- | -------- | ---------------------------------------------------------------------------- |
| `ANTHROPIC_API_KEY` | yes      | Claude API key used by `libs/ai`.                                            |
| `DATABASE_URL`      | no       | Prisma URL. Defaults to `file:/app/data/synthese.db` inside the container.   |
| `PORT`              | no       | API port. Defaults to `3000`.                                                |
| `WEB_DIST_PATH`     | no       | Path to the SPA bundle. Preset to `/app/web`.                                |

### Build the image locally

```bash
docker build -t synthese:local .
```

### CI / Docker Hub

`.github/workflows/docker-publish.yml` builds and pushes `estevanbs/synthese` to Docker Hub whenever a GitHub release is published. The image is tagged with the release's semver (`1.2.3`, `1.2`, `1`) and `latest` for non-prerelease versions. It expects one repository secret:

- `DOCKERHUB_TOKEN` — a Docker Hub access token with write scope on the `estevanbs/synthese` repo.

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

# E2E tests (requires running API + DATABASE_URL + ANTHROPIC_API_KEY for synthesize tests)
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
