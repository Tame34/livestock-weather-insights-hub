
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLivestock } from "@/contexts/LivestockContext";
import { convertWeatherToConditions, fetchWeatherByLocation } from "@/services/weatherApi";
import { useState } from "react";
import { toast } from "sonner";
import { Search, Wind, Droplets, Sun, Thermometer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const WeatherCard = () => {
  const { weatherData, setWeatherData, setEnvironmentalConditions } = useLivestock();
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchWeather = async () => {
    if (!location.trim()) {
      toast.error("Please enter a location");
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchWeatherByLocation(location);
      if (data) {
        setWeatherData(data);
        // Convert weather data to environmental conditions
        setEnvironmentalConditions(convertWeatherToConditions(data));
        toast.success(`Weather data loaded for ${data.location.name}`);
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
      toast.error("Error fetching weather data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl flex items-center">
          <Thermometer className="mr-2 h-6 w-6 text-farm-green" /> Current Weather
        </CardTitle>
        <CardDescription>
          Enter location to fetch current weather conditions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter location (e.g. New York, London)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={fetchWeather}
            disabled={isLoading}
            className="bg-farm-green hover:bg-farm-green-dark"
          >
            {isLoading ? "Loading..." : <Search className="h-4 w-4 mr-1" />}
            {isLoading ? "" : "Fetch"}
          </Button>
        </div>

        {weatherData ? (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-medium">
                  {weatherData.location.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {weatherData.location.region}, {weatherData.location.country}
                </p>
              </div>
              <div className="flex items-center">
                {weatherData.weather_icons && weatherData.weather_icons[0] && (
                  <img
                    src={weatherData.weather_icons[0]}
                    alt={weatherData.weather_descriptions[0]}
                    className="h-12 w-12 mr-2"
                  />
                )}
                <span className="text-2xl font-bold">
                  {weatherData.temperature}°C
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-muted p-3 rounded-lg flex flex-col items-center">
                <div className="flex items-center text-farm-green mb-1">
                  <Droplets className="h-4 w-4 mr-1" />
                  <span>Humidity</span>
                </div>
                <span className="text-lg font-medium">{weatherData.humidity}%</span>
              </div>
              <div className="bg-muted p-3 rounded-lg flex flex-col items-center">
                <div className="flex items-center text-farm-green mb-1">
                  <Wind className="h-4 w-4 mr-1" />
                  <span>Wind</span>
                </div>
                <span className="text-lg font-medium">{weatherData.wind_speed} m/s</span>
              </div>
              <div className="bg-muted p-3 rounded-lg flex flex-col items-center">
                <div className="flex items-center text-farm-green mb-1">
                  <Sun className="h-4 w-4 mr-1" />
                  <span>UV Index</span>
                </div>
                <span className="text-lg font-medium">{weatherData.uv_index}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>Enter a location to fetch weather data</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
