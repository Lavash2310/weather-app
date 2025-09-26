# Weather App

**Коротко**

Weather App — простий проєкт для отримання поточної погоди через OpenWeatherMap, що складається з фронтенду (React + Vite), бекенду (Node/Express), Docker-контейнерів, Kubernetes-манифестів і CI/CD (GitHub Actions). Мета — навчальний функціональний застосунок з автоматичними збірками і деплоєм.

---

## Функціонал

- Отримання поточної погоди за містом через OpenWeatherMap API
- Відображення температури, відчуттєвої температури, вологості, вітру, тиску та видимості
- Автоматичне щогодинне надсилання пошти зі звітом про погоду (GitHub Actions + Nodemailer)
- CI: збірка образів Docker та пуш в Docker Hub
- Деплой: Render (frontend/backend) і/або Kubernetes

---

## Стек технологій

- **Frontend:** React, Vite, TypeScript (за потреби), CSS/Tailwind (за бажанням)
- **Backend:** Node.js, Express
- **CI/CD:** GitHub Actions (workflow-y для build, docker, deploy, scheduled)
- **Контейнери:** Docker, Docker Hub
- **Ойнфраструктура:** Render; Kubernetes (manifests у `kubernetes/`)
- **Пошта:** Nodemailer (Gmail App Password)
- **API погоди:** OpenWeatherMap

---

## Структура репозиторію

```
/ (root)
├─ .github/workflows/ # CI/CD workflows (CD, scheduled jobs і т.д.)
├─ .scannerwork/ # (сканування/аналіз)
├─ dist/ # збірка для production (згенерований артефакт)
├─ kubernetes/ # manifests для deployment/service/ingress
├─ src/ # основний код (TypeScript/JS для фронтенду/сервера)
├─ Dockerfile.backend
├─ Dockerfile.frontend
├─ docker-compose.yaml
├─ index.html
├─ index.js # невеликий сервер
├─ nginx.conf
├─ package.json
├─ package-lock.json
├─ postcss.config.js
├─ tailwind.config.js
├─ tsconfig*.json
├─ vite.config.ts
└─ README.md
```

---

## Підготовка (локально)

1. Клонувати репозиторій:

```bash
git clone https://github.com/Lavash2310/weather-app.git
cd weather-app
```

2. Створити `.env` або встановити секрети (для локальної роботи):

```
cp .env.example .env
```

Відреагуйте .env

```
OPENWEATHER_API_KEY=ваш_openweather_api_key
VITE_BACKEND_URL=http://localhost:5000
SMTP_USERNAME=your@gmail.com
SMTP_PASSWORD=ваш_app_password
MAIL_TO=recipient@example.com
```

3. Запустити бекенд:

```bash
npm ci
npm node index.js
```

**Бекенд слухає порт 5000 за замовчуванням**

4. Запустити фронтенд:

```bash
npm ci
npm run dev
```

**Фротенд слухає порт 5173 за замовчуванням**

Відкрийте http://localhost:5173

## Docker

- Побудова образів локально:

```bash
docker build -f Dockerfile.backend -t youruser/weather-backend:latest .
docker build -f Dockerfile.frontend -t youruser/weather-frontend:latest .
```

- Пуш у Docker Hub:

```bash
docker push youruser/weather-backend:latest
docker push youruser/weather-frontend:latest
```

- Пуш у Docker Hub:

```bash
docker-compose up --build
```

---

## Kubernetes

- Маніфести лежать у `kubernetes/`. Переконайтесь, що імена контейнерів у `Deployment` відповідають іменам, які ви оновлюєте через `kubectl set image`.
- Для застосування:

```bash
kubectl apply -f kubernetes/
```

- Створення секретів для деплою:

```bash
kubectl create secret generic my-app-secret \
  --from-literal=api-key="${{ secrets.OPENWEATHER_API_KEY }}" \
  --from-literal=backend-url="https://weather-backend-xxxx.xxxxxxxx.com" \
  -n default --dry-run=client -o yaml | kubectl apply -f -
```

- Якщо використовуєте `KUBECONFIG` як secret у GitHub Actions — workflow повинен його писати в `$HOME/.kube/config` перед викликами `kubectl`.

---

## CI/CD (коротко)

- **Workflow `CI`** — збірка, тестування, артефакти.
- **Workflow `CD`** — (приклад) `Build_Backend` і `Build_Frontend` збирають Docker-образи і пушать у Docker Hub; `Kubernetes_Deploy` оновлює деплоймент через `kubectl set image`.
- **Scheduled workflow** — щогодинний скрипт, що викликає OpenWeatherMap і надсилає листи (приклад `Hourly Weather`).

---

## Secrets (потрібно додати в GitHub repository → Settings → Secrets)

- `WEATHER_API_KEY` або `OPENWEATHER_API_KEY` — ключ OpenWeatherMap
- `SMTP_USERNAME` — логін для SMTP (наприклад Gmail)
- `SMTP_PASSWORD` — пароль (рекомендовано App Password для Gmail)
- `MAIL_TO` — куди надсилати повідомлення
- `DOCKER_PASSWORD` — пароль Docker Hub для CI
- `KUBECONFIG` — вміст kubeconfig для деплою (якщо використовуєте self-hosted runner)
- `RENDER_API_KEY`, `RENDER_BACKEND_SERVICE_ID`, `RENDER_FRONTEND_SERVICE_ID` — якщо деплоїте на Render

---

## Поради та потенційні проблеми

- Не виводьте в логи ключ OpenWeatherMap
- Nodemailer: використовуйте `createTransport(...)`, і в CI перевіряйте `transporter.verify()` для швидкої діагностики SMTP.
- GitHub Actions: cron працює в UTC — перетворюйте час, якщо потрібен локальний розклад.
- Переконайтесь, що назви контейнерів у Deployment збігаються із викликами `kubectl set image`.

---

## Contributing

PR вітаються. Перед PR переконайтесь, що:

- Локальні тести проходять
- Додали опис зміни в PR

---

## Спробувати проєкт (Quick Start)

- Клонування:

```bash
git clone https://github.com/Lavash2310/weather-app.git
cd weather-app
```

- Створення .env:

```bash
cp .env.example .env
```

- Запуск бекенду:

```bash
cd backend
npm ci
npm run dev
```

- Запуск фронтенду:

```bash
cd frontend
npm ci
npm run dev
```

- Через Docker Compose:

```bash
docker-compose up --build
```

- Використання Docker Hub образів:

```bash
docker run -p 3000:3000 jouk2310/weather-backend:latest
docker run -p 5173:5173 jouk2310/weather-frontend:latest
```

- Scheduled workflow / GitHub Actions::

```bash
gh workflow run hourly-weather.yaml
```

---

## License

<!-- Workflow (показує останній статус конкретного workflow файлу) -->

[![CD Workflow Status](https://img.shields.io/github/actions/workflow/status/Lavash2310/weather-app/CD.yml?branch=main&style=flat-square)](https://github.com/Lavash2310/weather-app/actions)
[![Hourly Workflow Status](https://img.shields.io/github/actions/workflow/status/Lavash2310/weather-app/hourly-weather.yml?branch=main&style=flat-square)](https://github.com/Lavash2310/weather-app/actions)

<!-- Docker pulls (frontend/backend) -->

[![Docker Pulls Frontend](https://img.shields.io/docker/pulls/jouk2310/weather-frontend?style=flat-square)](https://hub.docker.com/r/jouk2310/weather-frontend)
[![Docker Pulls Backend](https://img.shields.io/docker/pulls/jouk2310/weather-backend?style=flat-square)](https://hub.docker.com/r/jouk2310/weather-backend)

<!-- Node.js version -->

[![Node.js Version](https://img.shields.io/badge/node-18-brightgreen?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)

<!-- License -->

[![License](https://img.shields.io/github/license/Lavash2310/weather-app?style=flat-square)](./LICENSE)

<!-- Repo stats -->

[![Stars](https://img.shields.io/github/stars/Lavash2310/weather-app?style=flat-square)](https://github.com/Lavash2310/weather-app/stargazers)
[![Forks](https://img.shields.io/github/forks/Lavash2310/weather-app?style=flat-square)](https://github.com/Lavash2310/weather-app/network/members)

<!-- Last commit / latest release -->

[![Last Commit](https://img.shields.io/github/last-commit/Lavash2310/weather-app?style=flat-square)](https://github.com/Lavash2310/weather-app/commits)
[![Release](https://img.shields.io/github/v/release/Lavash2310/weather-app?style=flat-square)](https://github.com/Lavash2310/weather-app/releases)

---

## Контакти

Якщо потрібно — відкрийте issue або напишіть мені у профілі репозиторія.

---
