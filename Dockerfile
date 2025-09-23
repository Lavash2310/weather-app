FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json tsconfig.json vite.config.ts ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:stable-alpine AS production

WORKDIR /usr/share/nginx/html

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/weather-app.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]