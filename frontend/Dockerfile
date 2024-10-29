# Dependencies stage
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json .
# inject production env to prevent dev dependencies install
ENV NODE_ENV production
RUN npm install

# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Run stage
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/package.json ./
CMD ["npm", "run", "start"]