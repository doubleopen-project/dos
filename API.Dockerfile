# SPDX-FileCopyrightText: 2024 HH Partners
# 
# SPDX-License-Identifier: MIT

# Base image
FROM node:20.10.0

WORKDIR /app/dos

COPY . .

RUN npm ci

RUN npm run build:api

CMD cd apps/api && npm run start
