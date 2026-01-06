import React, { useState, useEffect } from 'react';
import { Cloud, Search, Thermometer, Wind, Droplets, Sun, Moon } from 'lucide-react';

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  description: string;
  city: string;
  icon: string;
}

const BACKEND_URL = 'https://weather-backend-dde1.onrender.com';

const App: React.FC = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(isDarkMode);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');

    try {
      console.log('Backend URL:', BACKEND_URL);

      const response = await fetch(
  `${BACKEND_URL}/api/weather?q=${encodeURIComponent(city)}`
);


      
      if (!response.ok) {
        throw new Error('City not found');
      }

      const data = await response.json();
      
      setWeather({
        temperature: data.temperature,
        humidity: data.humidity,
        windSpeed: data.windSpeed,
        description: data.description,
        city: data.city,
        icon: data.icon
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Cloud className={isDark ? 'text-blue-400' : 'text-blue-500'} />
              Weather App
            </h1>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isDark ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name..."
                className={`w-full p-4 pr-12 rounded-lg border ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700 focus:border-blue-500' 
                    : 'bg-white border-gray-200 focus:border-blue-500'
                } outline-none transition-colors`}
              />
              <button
                type="submit"
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full ${
                  isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          {weather && !loading && (
            <div className={`rounded-lg p-6 ${
              isDark ? 'bg-gray-800' : 'bg-white shadow-lg'
            }`}>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">{weather.city}</h2>
                <div className="flex items-center justify-center mb-2">
                  <img 
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt={weather.description}
                    className="w-16 h-16"
                  />
                </div>
                <p className="text-lg text-gray-500 dark:text-gray-400 capitalize">{weather.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center justify-center p-4 rounded-lg bg-blue-50 dark:bg-gray-700">
                  <Thermometer className="text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Temperature</p>
                    <p className="text-xl font-bold">{weather.temperature}°C</p>
                  </div>
                </div>

                <div className="flex items-center justify-center p-4 rounded-lg bg-green-50 dark:bg-gray-700">
                  <Droplets className="text-green-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
                    <p className="text-xl font-bold">{weather.humidity}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-center p-4 rounded-lg bg-purple-50 dark:bg-gray-700">
                  <Wind className="text-purple-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Wind Speed</p>
                    <p className="text-xl font-bold">{weather.windSpeed} km/h</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;