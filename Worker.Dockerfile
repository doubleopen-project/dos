# SPDX-FileCopyrightText: 2024 Double Open Oy
# 
# SPDX-License-Identifier: MIT

# Base image
FROM node:20.10.0

# ScanCode

# Install required dependencies
RUN apt-get update && \
    apt-get install -y python3-venv python3-pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a virtual environment for Python
RUN python3 -m venv /venv

# Activate the virtual environment and install required Python packages
RUN /venv/bin/pip install scancode-toolkit==32.1.0

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

# Ensure scancode is accessible from the PATH
ENV PATH="/venv/bin:${PATH}"

CMD cd apps/scanner_worker && npm run start
