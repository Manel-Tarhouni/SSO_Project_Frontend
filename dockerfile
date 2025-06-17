# Development Stage (optional)
FROM node:22-alpine AS development
WORKDIR /app

COPY pnpm-lock.yaml ./
COPY package.json ./
RUN npm install -g pnpm && pnpm install

COPY . .

EXPOSE 3000
CMD ["pnpm", "dev"]

# Builder Stage
FROM node:22-alpine AS builder
WORKDIR /app

COPY pnpm-lock.yaml ./
COPY package.json ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# Production Stage
FROM node:22-alpine AS production
WORKDIR /app

# Optional: reduce image size by pruning dev deps
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENV NODE_ENV=production

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]
