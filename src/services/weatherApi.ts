
import { toast } from "sonner";

export interface WeatherData {
  temperature: number;
  humidity: number;
  wind_speed: number;
  weather_descriptions: string[];
  weather_icons: string[];
  location: {
    name: string;
    region: string;
    country: string;
  };
  uv_index: number;
  cloudcover: number;
}

// Cache to prevent repeated requests for the same location
const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export const fetchWeatherByLocation = async (location: string): Promise<WeatherData | null> => {
  // Check cache first
  const cacheKey = location.toLowerCase().trim();
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("Using cached weather data for:", location);
    return cached.data;
  }

  try {
    console.log("Fetching fresh weather data for:", location);
    
    // Check if backend is running
    const response = await fetch('http://localhost:5000/get_weather', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ location }),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    const weatherData: WeatherData = {
      temperature: data.temperature,
      humidity: data.humidity,
      wind_speed: data.wind_speed || 0,
      weather_descriptions: data.weather_descriptions || ["Unknown"],
      weather_icons: data.weather_icons || [],
      location: {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country
      },
      uv_index: data.uv_index || 0,
      cloudcover: data.cloudcover || 0
    };

    // Cache the result
    weatherCache.set(cacheKey, {
      data: weatherData,
      timestamp: Date.now()
    });

    return weatherData;
    
  } catch (error) {
    console.error("Error fetching weather data:", error);
    
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
        toast.error("Cannot connect to weather service. Please ensure the Flask backend is running on http://localhost:5000");
      } else if (error.name === 'TimeoutError') {
        toast.error("Weather request timed out. Please try again.");
      } else {
        toast.error(`Weather API error: ${error.message}`);
      }
    } else {
      toast.error("Failed to fetch weather data. Please try again.");
    }
    
    return null;
  }
};

// Function to estimate solar radiation based on cloud cover, UV index and time of day
export const estimateSolarRadiation = (uvIndex: number, cloudCover: number): number => {
  const maxRadiation = 1200;
  const cloudFactor = 1 - (cloudCover / 100) * 0.8;
  const uvFactor = uvIndex / 10;
  
  const hour = new Date().getHours();
  const timeOfDayFactor = 1 - Math.abs(hour - 12) / 12;
  
  return Math.round(maxRadiation * cloudFactor * uvFactor * timeOfDayFactor);
};

// Function to convert from weather API to our format
export const convertWeatherToConditions = (weatherData: WeatherData) => {
  const solarRadiation = estimateSolarRadiation(weatherData.uv_index, weatherData.cloudcover);
  
  return {
    temperature: weatherData.temperature,
    humidity: weatherData.humidity,
    wind_speed: weatherData.wind_speed,
    solar_radiation: solarRadiation,
    location: weatherData.location.name
  };
};
