# SPDX-FileCopyrightText: 2024 HH Partners
# 
# SPDX-License-Identifier: MIT

# Base image
FROM node:20.10.0

WORKDIR /app/dos

COPY package.json ./package.json
COPY apps/api/package.json ./apps/api/package.json
COPY packages/database/package.json ./packages/database/package.json
COPY packages/s3-helpers/package.json ./packages/s3-helpers/package.json
COPY packages/validation-helpers/package.json ./packages/validation-helpers/package.json
COPY package-lock.json ./package-lock.json

RUN npm ci

COPY . .

RUN npm run build:api

CMD cd apps/api && npm run start