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
RUN pip3 install scancode-toolkit

# DOS

WORKDIR /app/dos
COPY . .

RUN npm install
RUN npm run build:worker

CMD cd apps/scanner_agent && npm run start:worker