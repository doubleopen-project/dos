# SPDX-FileCopyrightText: 2024 Double Open Oy
# 
# SPDX-License-Identifier: MIT

FROM node:24.13.1 AS base

FROM base AS builder
WORKDIR /app

RUN npm i -g turbo

COPY . .

RUN turbo prune clearance_ui --docker

FROM base AS installer
WORKDIR /app

COPY --from=builder /app/out/json/ .
RUN npm install

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL $NEXT_PUBLIC_API_URL

COPY --from=builder /app/out/full/ .
RUN npm exec turbo build --filter=clearance_ui...

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/clearance_ui/.next/standalone ./
COPY --from=installer --chown=nextjs:nodejs /app/apps/clearance_ui/.next/static ./apps/clearance_ui/.next/static
COPY --from=installer --chown=nextjs:nodejs /app/apps/clearance_ui/public ./apps/clearance_ui/public

# server.js is created by `next build` from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "apps/clearance_ui/server.js"]
