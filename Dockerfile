FROM node:18-bookworm AS build
WORKDIR /app

COPY package*.json tsconfig.json vite.config.ts ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-bookworm AS production
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./ \
    /app/package-lock.json ./

RUN npm ci --omit=dev

EXPOSE 4173

CMD ["npx", "vite", "preview", "--port", "4173", "--host"]