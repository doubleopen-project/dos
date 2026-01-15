# SPDX-FileCopyrightText: 2025 Double Open Oy
#
# SPDX-License-Identifier: MIT

FROM node:24.13.0

# Install dependencies for API and Clearance UI
WORKDIR /workspace

COPY package.json ./package.json
COPY apps/api/package.json ./apps/api/package.json
COPY apps/clearance_ui/package.json ./apps/clearance_ui/package.json
COPY packages/database/package.json ./packages/database/package.json
COPY packages/s3-helpers/package.json ./packages/s3-helpers/package.json
COPY packages/spdx-validation/package.json ./packages/spdx-validation/package.json
COPY packages/validation-helpers/package.json ./packages/validation-helpers/package.json
COPY package-lock.json ./package-lock.json

RUN npm ci

# Install browsers for UI tests
WORKDIR /workspace/apps/clearance_ui
RUN npx playwright install --with-deps

WORKDIR /workspace

COPY . .

# Build API
RUN npm run db:generate

RUN npm run build:api

# Build Clearance UI
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build:cui

CMD [ "npm", "run", "test:e2e" ]
