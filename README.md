# Weather App

A full-stack weather application that provides real-time weather data for any city. The application features a React frontend and a Node.js/Express backend, and is fully containerized with Docker and configured for deployment on Kubernetes and Render.

## 🌟 Features

- **City-based Weather Search**: Search for current weather conditions by entering a city name
- **Detailed Weather Information**: Displays temperature, humidity, wind speed, and weather description
- **Dynamic Weather Icons**: Visual representation of current weather conditions
- **Responsive Design**: Clean, modern UI that works on both desktop and mobile devices
- **Dark/Light Mode**: Toggle between dark and light themes for user comfort
- **Backend API**: Simple Express API that proxies requests to OpenWeatherMap

## 🚀 Live Demo

🔗 **Frontend**: [https://weather-frontend-7mo5.onrender.com](https://weather-frontend-7mo5.onrender.com)  
🔗 **Backend API**: [https://weather-backend-dde1.onrender.com](https://weather-backend-dde1.onrender.com)

> ⚠️ **Note**: First request may take 30+ seconds due to Render's cold start.

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- CORS
- node-fetch

### DevOps & Deployment
- Docker & Docker Compose
- Kubernetes
- Nginx
- GitHub Actions (CI/CD)
- Render
- SonarCloud (code quality)
- OWASP Dependency Check
- Nexus Repository

## 📋 Prerequisites

- Node.js 18+ (for local development)
- Docker & Docker Compose (for containerized deployment)
- OpenWeatherMap API key ([Get one free here](https://openweathermap.org/api))

## 🏃 Getting Started

### Option 1: Local Development (Recommended for Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lavash2310/weather-app.git
   cd weather-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   
   Create a `.env` file in the root directory:
   ```env
   API_KEY=your_openweathermap_api_key_here
   PORT=5001
   ```

4. **Run the backend server:**
   ```bash
   npm run dev
   ```
   Backend will start at `http://localhost:5001`

5. **Run the frontend (in a separate terminal):**
   ```bash
   npm run build
   npm run preview
   ```
   Frontend will start at `http://localhost:4173`

### Option 2: Docker Compose (Recommended for Production)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lavash2310/weather-app.git
   cd weather-app
   ```

2. **Create environment file:**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_KEY=your_openweathermap_api_key_here
   ```

3. **Update docker-compose.yaml:**
   
   Replace the hardcoded API key in `docker-compose.yaml`:
   ```yaml
   environment:
     - VITE_API_KEY=${VITE_API_KEY}
   ```

4. **Build and run containers:**
   ```bash
   docker-compose up --build
   ```

5. **Access the application:**
   - Frontend: [http://localhost:8080](http://localhost:8080)
   - Backend API: [http://localhost:5001](http://localhost:5001)

### Option 3: Kubernetes Deployment

1. **Setup Minikube (if using locally):**
   ```bash
   minikube start
   ```

2. **Create Kubernetes secret:**
   ```bash
   kubectl create secret generic my-app-secret \
     --from-literal=api-key="your_api_key_here" \
     --from-literal=backend-url="https://weather-backend-dde1.onrender.com"
   ```

3. **Apply Kubernetes manifests:**
   ```bash
   kubectl apply -f kubernetes/
   ```

4. **Check deployment status:**
   ```bash
   kubectl get pods,svc,ingress -n default
   ```

## 🔌 API Endpoints

The backend server provides the following endpoints:

| Method | Endpoint | Description | Example |
|:-------|:---------|:------------|:--------|
| `GET` | `/` | Welcome message and API info | - |
| `GET` | `/health` | Health check with status and uptime | - |
| `GET` | `/api/weather?q=<city>` | Get weather data for specified city | `/api/weather?q=London` |

### Example API Response:

```json
{
  "temperature": 15,
  "humidity": 72,
  "windSpeed": 20,
  "description": "partly cloudy",
  "city": "London",
  "country": "GB",
  "icon": "02d"
}
```

## 📊 Environment Variables

### Backend (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `API_KEY` | OpenWeatherMap API key | ✅ Yes | - |
| `PORT` | Backend server port | No | 5001 |
| `NODE_ENV` | Environment mode | No | development |

### Frontend (Docker build args)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_BACKEND_URL` | Backend API URL | No | http://localhost:5001 |

## 🏗️ Project Structure

```
weather-app/
├── .github/
│   └── workflows/          # CI/CD pipelines
│       ├── ci.yaml         # Continuous Integration
│       ├── cd.yaml         # Continuous Deployment
│       └── hourly_weather.yaml  # Scheduled weather reports
├── kubernetes/             # Kubernetes manifests
│   ├── deployment.yaml     # Pod deployments
│   ├── service-backend.yaml
│   ├── service-frontend.yaml
│   ├── ingress.yaml        # Traffic routing
│   ├── role.yaml           # RBAC permissions
│   ├── role-binding.yaml
│   └── service-account.yaml
├── src/                    # Frontend source code
│   ├── App.tsx            # Main React component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── index.js               # Backend Express server
├── Dockerfile.backend     # Backend container
├── Dockerfile.frontend    # Frontend container
├── docker-compose.yaml    # Multi-container orchestration
├── nginx.conf            # Nginx configuration
├── package.json          # Dependencies & scripts
└── README.md             # This file
```

## 🔄 CI/CD Pipeline

The project uses GitHub Actions for automated CI/CD:

### CI Workflow (`.github/workflows/ci.yaml`)
- ✅ Dependency installation and build
- ✅ SonarCloud static code analysis
- ✅ OWASP dependency vulnerability scanning
- ✅ NPM package publishing to Nexus

### CD Workflow (`.github/workflows/cd.yaml`)
- 🐳 Docker image build and push to Docker Hub
- ☁️ Automatic deployment to Render
- ☸️ Kubernetes deployment with image updates
- 📧 Email notifications for deployment status

### Hourly Weather Report (`.github/workflows/hourly_weather.yaml`)
- 🕐 Runs every hour via cron schedule
- 📨 Sends weather report emails for Kyiv, UA

## 🛠️ Available Scripts

```bash
npm run dev      # Start backend with nodemon (development)
npm run start    # Start backend (production)
npm run build    # Build frontend for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
npm run sonar    # Run SonarQube analysis
```

## 🐛 Troubleshooting

### Port Already in Use

If ports 5001 or 8080 are already in use:

```bash
# Stop Docker containers
docker-compose down

# Kill process on port (Linux/Mac)
lsof -ti:5001 | xargs kill -9
lsof -ti:8080 | xargs kill -9

# Kill process on port (Windows)
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

### CORS Errors

Ensure the backend URL in `src/App.tsx` matches your deployment:

```typescript
const BACKEND_URL = 'https://weather-backend-dde1.onrender.com';
```

For local development, update to:
```typescript
const BACKEND_URL = 'http://localhost:5001';
```

### Docker Build Fails

Clear Docker cache and rebuild:
```bash
docker-compose down --volumes
docker system prune -a
docker-compose up --build
```

### API Key Not Working

1. Verify your API key at [OpenWeatherMap](https://home.openweathermap.org/api_keys)
2. Wait a few hours after creating new API key (activation delay)
3. Check if API key is properly set in environment variables

## ⚠️ Known Issues

- First request to Render deployment may take 30+ seconds (cold start)
- Docker compose contains hardcoded API key (should use `.env` file)
- No automated tests implemented yet

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

### Code Style

- Use TypeScript for frontend code
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Lavash2310**

- GitHub: [@lavash2310](https://github.com/lavash2310)
- Repository: [weather-app](https://github.com/lavash2310/weather-app)

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data API
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Render](https://render.com/) for hosting

## 📧 Support

If you have any questions or need help, please open an issue on GitHub.

---

⭐ **Star this repository if you find it helpful!**
