# Use scancode image as base
FROM docker.io/etsija/scancode

# Then add the node image
FROM node:18.15.0

# Copy the current directory contents into the container at /app
COPY . /app
# Set the working directory to /app
WORKDIR /app

RUN npm install
RUN npm run build:worker

CMD cd apps/scanner_agent && npm run start:worker
