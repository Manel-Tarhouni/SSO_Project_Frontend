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

RUN npm install -g pnpm

# Optional: reduce image size by pruning dev deps
# Copy only standalone server and required assets
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

ENV NODE_ENV=production

EXPOSE 3000

#CMD ["pnpm", "start"]
#CMD ["node_modules/.bin/next", "start"]

CMD ["node", "server.js"]
