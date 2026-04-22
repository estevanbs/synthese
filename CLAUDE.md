# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
pnpm install

# Start infrastructure (Postgres required for API)
docker-compose up -d

# Run database migrations
pnpm prisma migrate dev --name <migration-name>

# Regenerate Prisma client after schema changes
pnpm prisma generate

# Start development servers
pnpm nx serve api        # NestJS API on :3000, Swagger at :3000/docs
pnpm nx serve web        # Angular frontend

# Unit tests
pnpm nx test api         # run all unit tests for the API
pnpm nx test ai          # run tests for the AI lib

# Run a single test file
pnpm nx test api --testFile=src/synthesize/synthesize.service.spec.ts

# E2E tests (requires running API + Postgres)
pnpm nx e2e api-e2e

# Lint / type-check / format
pnpm nx lint api
pnpm nx typecheck api
pnpm nx format:write

# Build
pnpm nx build api
pnpm nx build web
```

## Architecture

Clean architecture Nx monorepo. Dependency direction is strict — outer layers depend on inner, never the reverse:

```
┌─────────────────────────────────┐
│  apps/api   (application layer) │  NestJS controllers, services, DTOs
│  apps/web   (presentation)      │  Angular SPA
├─────────────────────────────────┤
│  libs/ai        (infrastructure)│  Claude AI implementation
│  libs/database  (infrastructure)│  Prisma repository implementations
├─────────────────────────────────┤
│  libs/domain    (domain layer)  │  interfaces, entities, DI tokens — no framework imports
└─────────────────────────────────┘
```

### libs/domain
The innermost layer. Contains only TypeScript interfaces and constants — no `@nestjs/*` imports, no Prisma, no Anthropic SDK.
- **Entities**: `Topic`, `Note`, `RawText`
- **Repository interfaces**: `TopicRepository`, `NoteRepository`, `RawTextRepository`
- **Application interfaces**: `AiProcessor`, `AiProcessResult`
- **DI tokens**: `TOPIC_REPOSITORY`, `NOTE_REPOSITORY`, `RAW_TEXT_REPOSITORY`, `AI_PROCESSOR`

All new contracts (interfaces, tokens) go here first and are exported from `src/index.ts`.

### libs/database
Infrastructure — Prisma implementations of domain repository interfaces.
- `PrismaService` wraps `PrismaClient` with lifecycle hooks
- Each repository implements its domain interface: `PrismaTopicRepository implements TopicRepository`
- `DatabaseModule` is `@Global()`, registers and exports all repository tokens — feature modules do **not** need to import it explicitly
- Prisma schema: `libs/database/prisma/schema.prisma`; generated client: `libs/database/src/generated/prisma-client/` (committed)

### libs/ai
Infrastructure — Claude AI implementation of `AiProcessor`.
- `ClaudeAiProcessorService` calls the Anthropic SDK; requires `ANTHROPIC_API_KEY` env var
- `AiModule` is `@Global()`, registers and exports `AI_PROCESSOR`

### apps/api
Application layer (NestJS). Strict layering within this app:

**Controllers** handle only HTTP concerns: parsing input, calling a service, returning the response. They never inject repository tokens directly.

**Services** contain orchestration and business logic. They inject domain interfaces via tokens (`@Inject(TOPIC_REPOSITORY)`). HTTP exception classes (`NotFoundException`, etc.) may be thrown from services.

**DTOs** live in `<feature>/dto/`. Request DTOs use `class-validator` + `@ApiProperty`. Response types are plain interfaces in a dedicated dto file (not exported from service files).

**Modules** declare their own service as a provider. The globally registered `DatabaseModule` and `AiModule` supply repository/AI tokens — no need to import them in feature modules.

### apps/web
Angular 21 SPA. Services in `app/services/` call the API via `HttpClient`.

## Code Style

- Functions: 4–20 lines. Split if longer.
- Files: under 500 lines. Split by responsibility.
- One thing per function, one responsibility per module (SRP).
- Names: specific and unique. Avoid `data`, `handler`, `Manager`. Prefer names that return <5 grep hits in the codebase.
- Types: explicit. No `any`, no untyped functions.
- No code duplication. Extract shared logic into a function or module.
- Early returns over nested ifs. Max 2 levels of indentation.
- Exception messages must include the offending value and expected shape.
- Inject dependencies through constructor/parameter, not global import. Wrap third-party libs behind a thin interface owned by this project.

## Comments

- Write WHY, not WHAT. Skip `// increment counter` above `i++`.
- Docstrings on public functions: intent + one usage example.
- Reference issue numbers / commit SHAs when a line exists because of a specific bug or upstream constraint.

## Rules

### Adding a new domain entity + CRUD
1. Add the entity interface to `libs/domain/src/lib/interfaces/<entity>.interface.ts`
2. Add the repository interface to `libs/domain/src/lib/interfaces/<entity>.repository.ts`
3. Add a DI token to `libs/domain/src/lib/interfaces/repository.tokens.ts`
4. Export all three from `libs/domain/src/index.ts`
5. Add the Prisma model to `libs/database/prisma/schema.prisma`, run `pnpm prisma migrate dev`
6. Implement the repository in `libs/database/src/lib/repositories/prisma-<entity>.repository.ts`
7. Register in `DatabaseModule` (providers + exports)
8. Create `apps/api/src/<feature>/<feature>.service.ts`, `<feature>.controller.ts`, `<feature>.module.ts`
9. Import the feature module in `AppModule`

### Import convention
- **Source files** (non-spec): local imports **must** use the `.js` extension — `import { Foo } from './foo.js'`
- **Spec files**: no `.js` extension needed (Jest handles resolution)
- **Library imports** use the `@synthese/<lib>` alias — never relative paths across libs

### Testing
- Every new function gets a test. Bug fixes get a regression test.
- Unit tests mock domain interfaces via DI tokens, not concrete classes. Use named fake classes, not inline stubs.
- Tests must be F.I.R.S.T: fast, independent, repeatable, self-validating, timely.
- E2E tests in `apps/api-e2e/` run against a live API; Postgres must be running.
- The `POST /api/synthesize` e2e test requires `ANTHROPIC_API_KEY`.

### Logging
- Structured JSON when logging for debugging / observability.
- Plain text only for user-facing CLI output.
