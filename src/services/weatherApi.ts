
import { toast } from "sonner";

const API_KEY = "YOUR_WEATHERSTACK_API_KEY"; // Replace with actual API key in production

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

export const fetchWeatherByLocation = async (location: string): Promise<WeatherData | null> => {
  try {
    // For development purposes, we'll use mock data
    // In production, uncomment the fetch call below and use your API key
    
    /*
    const response = await fetch(
      `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${encodeURIComponent(location)}`
    );
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.info || "Failed to fetch weather data");
    }
    
    return {
      temperature: data.current.temperature,
      humidity: data.current.humidity,
      wind_speed: data.current.wind_speed,
      weather_descriptions: data.current.weather_descriptions,
      weather_icons: data.current.weather_icons,
      location: {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country
      },
      uv_index: data.current.uv_index,
      cloudcover: data.current.cloudcover
    };
    */
    
    // Mock data for development
    return mockWeatherData(location);
    
  } catch (error) {
    console.error("Error fetching weather data:", error);
    toast.error("Failed to fetch weather data. Please try again.");
    return null;
  }
};

// Mock weather data for development testing
function mockWeatherData(location: string): WeatherData {
  // Create somewhat realistic mock data
  const isHot = Math.random() > 0.5;
  
  return {
    temperature: isHot ? 25 + Math.random() * 10 : 15 + Math.random() * 10,
    humidity: 40 + Math.random() * 50,
    wind_speed: 1 + Math.random() * 9,
    weather_descriptions: [isHot ? "Sunny" : "Partly cloudy"],
    weather_icons: [isHot ? "https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png" : "https://assets.weatherstack.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png"],
    location: {
      name: location,
      region: "Mock Region",
      country: "Mock Country"
    },
    uv_index: isHot ? 6 + Math.floor(Math.random() * 4) : 2 + Math.floor(Math.random() * 3),
    cloudcover: isHot ? Math.floor(Math.random() * 30) : 30 + Math.floor(Math.random() * 50)
  };
}

// Function to estimate solar radiation based on cloud cover, UV index and time of day
export const estimateSolarRadiation = (uvIndex: number, cloudCover: number): number => {
  // Basic formula: Higher UV index and lower cloud cover = higher solar radiation
  // Max solar radiation around 1200 W/m² for clear sky and high UV
  
  const maxRadiation = 1200;
  const cloudFactor = 1 - (cloudCover / 100) * 0.8; // Cloud cover reduces by up to 80%
  const uvFactor = uvIndex / 10; // UV index 10+ is maximum
  
  // Get time of day factor (simplified - assumes max at noon)
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
