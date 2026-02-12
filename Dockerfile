FROM node:18-alpine AS base
WORKDIR /app
# Install tzdata for timezone support
RUN apk add --no-cache tzdata
COPY package*.json ./

FROM base AS development
RUN npm ci
COPY . .
CMD ["npm","run","dev"]

FROM base AS builder
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["npm","run","start"]