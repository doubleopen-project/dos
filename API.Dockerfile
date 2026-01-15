# SPDX-FileCopyrightText: 2024 Double Open Oy
# 
# SPDX-License-Identifier: MIT

# Base image
FROM node:24.13.0

WORKDIR /app/dos

# Use the major version installed locally in the project. When updating the local version, update
# this as well.
RUN npm install -g turbo@2

COPY package.json ./package.json
COPY apps/api/package.json ./apps/api/package.json
COPY packages/database/package.json ./packages/database/package.json
COPY packages/s3-helpers/package.json ./packages/s3-helpers/package.json
COPY packages/validation-helpers/package.json ./packages/validation-helpers/package.json
COPY package-lock.json ./package-lock.json

RUN npm ci

COPY . .

RUN npm run db:generate

RUN npm run build:api

ENTRYPOINT [ "turbo" ]

CMD [ "run", "start", "--filter=api", "--no-cache", "--no-daemon" ]
