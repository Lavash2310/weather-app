import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.VITE_API_KEY;

if (!API_KEY) {
  console.error('Error: VITE_API_KEY is not set!');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

app.get('/api/weather', async (req, res) => {
  const { q } = req.query;

  if (!q) return res.status(400).json({ message: 'City is required' });

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      const errData = await response.json();
      return res.status(response.status).json({ message: errData.message || 'City not found' });
    }

    const data = await response.json();

    res.json({
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      description: data.weather[0].description,
      city: data.name,
      icon: data.weather[0].icon
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
