# syntax=docker/dockerfile:1.7

# ---- Builder: install workspace deps, generate Prisma client, build API + Web ----
FROM node:24.15.0-alpine AS builder

WORKDIR /workspace

# better-sqlite3 ships native bindings; alpine needs a toolchain to compile them.
RUN corepack enable \
 && corepack prepare pnpm@9.8.0 --activate \
 && apk add --no-cache python3 make g++

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY libs/ai/package.json ./libs/ai/
COPY libs/database/package.json ./libs/database/
COPY libs/domain/package.json ./libs/domain/

RUN pnpm install --frozen-lockfile

COPY . .

RUN DATABASE_URL=file:/tmp/build.db pnpm prisma generate \
 && pnpm nx build api \
 && pnpm nx build web --configuration=production


# ---- Runtime: only production deps + built artifacts ----
FROM node:24.15.0-alpine AS runtime

WORKDIR /app

RUN corepack enable \
 && corepack prepare pnpm@9.8.0 --activate \
 && apk add --no-cache python3 make g++

ENV NODE_ENV=production \
    PORT=3000 \
    WEB_DIST_PATH=/app/web \
    DATABASE_URL=file:/app/data/synthese.db \
    LLM_PROVIDER=claude \
    OLLAMA_MODEL=llama3 \
    OLLAMA_HOST=http://host.docker.internal:11434 \
    PATH=/app/node_modules/.bin:$PATH

COPY --from=builder /workspace/package.json /workspace/pnpm-lock.yaml /workspace/pnpm-workspace.yaml ./
COPY --from=builder /workspace/apps/api/package.json ./apps/api/
COPY --from=builder /workspace/libs/ai/package.json ./libs/ai/
COPY --from=builder /workspace/libs/database/package.json ./libs/database/
COPY --from=builder /workspace/libs/domain/package.json ./libs/domain/

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /workspace/apps/api/dist ./apps/api/dist
COPY --from=builder /workspace/dist/apps/web/browser ./web
COPY --from=builder /workspace/libs/database/prisma ./libs/database/prisma
COPY --from=builder /workspace/prisma.config.ts ./

RUN mkdir -p /app/data
VOLUME /app/data

EXPOSE 3000

CMD ["sh", "-c", "prisma migrate deploy && node apps/api/dist/main.js"]
