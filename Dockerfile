# syntax=docker/dockerfile:1.7

# ---- Builder: install workspace deps, generate Prisma client, build API + Web ----
FROM node:24.15.0-alpine AS builder

WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@9.8.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY libs/ai/package.json ./libs/ai/
COPY libs/database/package.json ./libs/database/
COPY libs/domain/package.json ./libs/domain/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate \
 && pnpm nx build api \
 && pnpm nx build web --configuration=production


# ---- Runtime: only production deps + built artifacts ----
FROM node:24.15.0-alpine AS runtime

WORKDIR /app

RUN corepack enable \
 && corepack prepare pnpm@9.8.0 --activate \
 && apk add --no-cache openssl \
 && npm install -g prisma@7.4.2

ENV NODE_ENV=production \
    PORT=3000 \
    WEB_DIST_PATH=/app/web

COPY --from=builder /workspace/package.json /workspace/pnpm-lock.yaml /workspace/pnpm-workspace.yaml ./
COPY --from=builder /workspace/apps/api/package.json ./apps/api/
COPY --from=builder /workspace/libs/ai/package.json ./libs/ai/
COPY --from=builder /workspace/libs/database/package.json ./libs/database/
COPY --from=builder /workspace/libs/domain/package.json ./libs/domain/

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /workspace/apps/api/dist ./apps/api/dist
COPY --from=builder /workspace/dist/apps/web/browser ./web
COPY --from=builder /workspace/libs/database/prisma ./libs/database/prisma

EXPOSE 3000

CMD ["sh", "-c", "prisma migrate deploy --schema=./libs/database/prisma/schema.prisma && node apps/api/dist/main.js"]
