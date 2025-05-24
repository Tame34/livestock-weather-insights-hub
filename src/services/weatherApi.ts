
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
  const apiKey = localStorage.getItem('weatherstack_api_key');
  
  if (!apiKey) {
    toast.error("Please configure your WeatherStack API key first");
    return null;
  }

  // Check cache first
  const cacheKey = location.toLowerCase().trim();
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("Using cached weather data for:", location);
    return cached.data;
  }

  try {
    console.log("Fetching fresh weather data for:", location);
    const response = await fetch(
      `http://api.weatherstack.com/current?access_key=${apiKey}&query=${encodeURIComponent(location)}`
    );
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.info || "Failed to fetch weather data");
    }

    if (!data.current || !data.location) {
      throw new Error("Invalid weather data received");
    }
    
    const weatherData: WeatherData = {
      temperature: data.current.temperature,
      humidity: data.current.humidity,
      wind_speed: data.current.wind_speed || 0,
      weather_descriptions: data.current.weather_descriptions || ["Unknown"],
      weather_icons: data.current.weather_icons || [],
      location: {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country
      },
      uv_index: data.current.uv_index || 0,
      cloudcover: data.current.cloudcover || 0
    };

    // Cache the result
    weatherCache.set(cacheKey, {
      data: weatherData,
      timestamp: Date.now()
    });

    return weatherData;
    
  } catch (error) {
    console.error("Error fetching weather data:", error);
    toast.error("Failed to fetch weather data. Please check your API key and try again.");
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
