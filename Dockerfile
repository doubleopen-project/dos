# SPDX-FileCopyrightText: 2023 HH Partners
# 
# SPDX-License-Identifier: MIT

# Base image
FROM node:18.15.0

# ScanCode

RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa --yes
RUN apt install -y python3-pip
RUN pip3 install scancode-toolkit==32.0.4

# DOS

WORKDIR /app/dos

COPY package.json ./package.json
COPY apps/scanner_worker/package.json ./apps/scanner_worker/package.json
COPY packages/common-helpers/package.json ./packages/common-helpers/package.json
COPY packages/s3-helpers/package.json ./packages/s3-helpers/package.json

COPY package-lock.json ./package-lock.json

RUN npm ci

COPY . .

RUN npm run build:scanner_worker

CMD cd apps/scanner_worker && npm run start