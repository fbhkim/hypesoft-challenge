
FROM node:18-alpine AS base
WORKDIR /app

FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM base AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./node_modules/@next/react-dev-overlay/
COPY --from=builder --chown=nextjs:nodejs /app/.next/server ./server
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./public/_next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server"]