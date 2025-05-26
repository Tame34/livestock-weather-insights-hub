
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLivestock } from "@/contexts/LivestockContext";
import { CloudSunRain, AlertTriangle, Thermometer, Droplets, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchWeatherByLocation } from "@/services/weatherApi";
import { toast } from "sonner";

const WeatherForecast = () => {
  const { weatherData, environmentalConditions, setWeatherData, setEnvironmentalConditions } = useLivestock();
  const [locationData, setLocationData] = useState<any>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Auto-detect location on component mount
  useEffect(() => {
    detectUserLocation();
  }, []);

  const detectUserLocation = async () => {
    setIsDetectingLocation(true);
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      setIsDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use coordinates to get weather data
          const locationString = `${latitude},${longitude}`;
          const data = await fetchWeatherByLocation(locationString);
          
          if (data) {
            setLocationData({
              latitude,
              longitude,
              accuracy: position.coords.accuracy
            });
            setWeatherData(data);
            // Convert weather data to environmental conditions
            const solarRadiation = estimateSolarRadiation(data.uv_index, data.cloudcover);
            setEnvironmentalConditions({
              temperature: data.temperature,
              humidity: data.humidity,
              wind_speed: data.wind_speed,
              solar_radiation: solarRadiation,
              location: data.location.name
            });
            toast.success(`Weather data loaded for your current location: ${data.location.name}`);
          }
        } catch (error) {
          console.error("Error fetching weather for location:", error);
          toast.error("Could not fetch weather data for your location");
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        let errorMessage = "Could not detect your location. ";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please allow location access and refresh the page.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += "An unknown error occurred.";
        }
        
        toast.error(errorMessage);
        setIsDetectingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Function to estimate solar radiation based on cloud cover, UV index and time of day
  const estimateSolarRadiation = (uvIndex: number, cloudCover: number): number => {
    const maxRadiation = 1200;
    const cloudFactor = 1 - (cloudCover / 100) * 0.8;
    const uvFactor = uvIndex / 10;
    
    const hour = new Date().getHours();
    const timeOfDayFactor = 1 - Math.abs(hour - 12) / 12;
    
    return Math.round(maxRadiation * cloudFactor * uvFactor * timeOfDayFactor);
  };

  // Generate forecast data based on current weather
  const generateForecastData = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dayBefore = new Date(today);
    dayBefore.setDate(dayBefore.getDate() - 2);

    return [
      {
        date: dayBefore.toLocaleDateString(),
        label: "2 Days Ago",
        temperature: environmentalConditions.temperature - 3 + Math.random() * 2,
        humidity: environmentalConditions.humidity - 10 + Math.random() * 5,
        condition: "Partly Cloudy"
      },
      {
        date: yesterday.toLocaleDateString(),
        label: "Yesterday",
        temperature: environmentalConditions.temperature - 1 + Math.random() * 2,
        humidity: environmentalConditions.humidity - 5 + Math.random() * 5,
        condition: "Sunny"
      },
      {
        date: today.toLocaleDateString(),
        label: "Today",
        temperature: environmentalConditions.temperature,
        humidity: environmentalConditions.humidity,
        condition: weatherData?.weather_descriptions?.[0] || "Current"
      }
    ];
  };

  const forecastData = generateForecastData();
  const avgTemp = forecastData.reduce((sum, day) => sum + day.temperature, 0) / forecastData.length;
  const avgHumidity = forecastData.reduce((sum, day) => sum + day.humidity, 0) / forecastData.length;

  // Generate livestock impact warning
  const getLivestockImpact = () => {
    if (avgTemp > 30 && avgHumidity > 70) {
      return {
        level: "high",
        message: "High risk of heat stress. Implement immediate cooling measures.",
        color: "bg-red-50 border-red-200 text-red-800"
      };
    } else if (avgTemp > 27 && avgHumidity > 60) {
      return {
        level: "moderate",
        message: "Moderate heat stress risk. Increase monitoring and water availability.",
        color: "bg-yellow-50 border-yellow-200 text-yellow-800"
      };
    } else {
      return {
        level: "low",
        message: "Low heat stress risk. Maintain normal care routines.",
        color: "bg-green-50 border-green-200 text-green-800"
      };
    }
  };

  const impact = getLivestockImpact();

  return (
    <Card className="w-full mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl flex items-center">
          <CloudSunRain className="mr-2 h-6 w-6 text-farm-green" />
          Weather Forecast & Livestock Impact
          {locationData && (
            <div className="ml-auto flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              Live Location
            </div>
          )}
        </CardTitle>
        {isDetectingLocation && (
          <p className="text-sm text-muted-foreground">Detecting your location...</p>
        )}
        {weatherData && (
          <p className="text-sm text-muted-foreground">
            Current location: {weatherData.location.name}, {weatherData.location.region}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          {forecastData.map((day, index) => (
            <Card key={index} className={`${index === 2 ? 'ring-2 ring-farm-green' : ''}`}>
              <CardContent className="p-4 text-center">
                <h4 className="font-medium text-sm text-muted-foreground">{day.label}</h4>
                <p className="text-xs text-muted-foreground mb-2">{day.date}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center">
                    <Thermometer className="h-4 w-4 mr-1 text-red-500" />
                    <span className="font-bold">{day.temperature.toFixed(1)}°C</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <Droplets className="h-4 w-4 mr-1 text-blue-500" />
                    <span>{day.humidity.toFixed(0)}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{day.condition}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className={`p-4 rounded-lg border ${impact.color}`}>
          <h3 className="font-medium flex items-center mb-2">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Livestock Impact Assessment
          </h3>
          <p className="mb-3">{impact.message}</p>
          
          <div className="bg-white/50 p-3 rounded border">
            <h4 className="font-medium mb-2">Farmer Caution:</h4>
            <ul className="text-sm space-y-1">
              <li>• Monitor animals closely during peak heat hours (10 AM - 4 PM)</li>
              <li>• Ensure constant access to clean, cool water</li>
              <li>• Provide adequate shade and ventilation</li>
              <li>• Consider adjusting feeding schedules to cooler times</li>
              <li>• Watch for early signs of heat stress in vulnerable animals</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
