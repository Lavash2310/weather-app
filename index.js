import express, { json } from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

app.use(cors({
  origin: [
    'https://weather-frontend-7mo5.onrender.com',
    'http://localhost:5173',
    'http://localhost:3000'
  ]
}));

app.use(json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'Weather API is running!',
    version: '1.0.0',
    endpoints: {
      weather: '/api/weather?q=cityname',
      health: '/health'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/weather', async (req, res) => {
  try {
    const { q } = req.query;
    
    console.log(`Weather request for: ${q}`);
    
    if (!q) {
      return res.status(400).json({ 
        error: 'City parameter is required',
        usage: '/api/weather?q=London' 
      });
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error('API_KEY not found in environment variables');
      return res.status(500).json({ error: 'API key not configured' });
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${apiKey}&units=metric`;
    
    console.log('Fetching from OpenWeather API...');
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.log(`OpenWeather API error: ${response.status}`);
      if (response.status === 404) {
        return res.status(404).json({ error: 'City not found' });
      }
      return res.status(response.status).json({ error: 'Weather service unavailable' });
    }

    const data = await response.json();
    
    const weatherData = {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6),
      description: data.weather[0].description,
      city: data.name,
      country: data.sys.country,
      icon: data.weather[0].icon
    };
    
    console.log(`Successfully fetched weather for ${weatherData.city}`);
    
    res.json(weatherData);
    
  } catch (error) {
    console.error('Weather API error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    method: req.method,
    path: req.path,
    availableEndpoints: {
      root: 'GET /',
      weather: 'GET /api/weather?q=cityname',
      health: 'GET /health'
    }
  });
});

app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    error: 'Internal server error'
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌤️  Weather API server running on port ${PORT}`);
  console.log(`🔑 API Key configured: ${process.env.API_KEY ? 'Yes' : 'No'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});