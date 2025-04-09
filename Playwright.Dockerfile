# SPDX-FileCopyrightText: 2025 Double Open Oy
#
# SPDX-License-Identifier: MIT

FROM node:22.14.0

WORKDIR /workspace

RUN npm i -g turbo

COPY package.json ./package.json
COPY apps/api/package.json ./apps/api/package.json
COPY apps/clearance_ui/package.json ./apps/clearance_ui/package.json
COPY packages/database/package.json ./packages/database/package.json
COPY packages/s3-helpers/package.json ./packages/s3-helpers/package.json
COPY packages/spdx-validation/package.json ./packages/spdx-validation/package.json
COPY packages/validation-helpers/package.json ./packages/validation-helpers/package.json
COPY package-lock.json ./package-lock.json

RUN npm ci

COPY . .

RUN npm run db:generate

RUN npm run build:api

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build:cui

# Install browsers for UI tests
WORKDIR /workspace/apps/clearance_ui
RUN npm run install-browsers