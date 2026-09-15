# ---- Build stage ----
FROM node:22-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY index.ts ./
COPY engine ./engine
COPY graph ./graph
COPY models ./models
COPY routes ./routes
COPY services ./services
COPY types ./types
COPY util ./util

RUN npx tsc

# ---- Runtime stage ----
FROM node:22-slim

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

ENV PORT=3001
EXPOSE 3001

CMD ["node", "dist/index.js"]