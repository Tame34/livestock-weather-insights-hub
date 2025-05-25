
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLivestock } from "@/contexts/LivestockContext";
import { CloudSunRain, AlertTriangle, Thermometer, Droplets } from "lucide-react";

const WeatherForecast = () => {
  const { weatherData, environmentalConditions } = useLivestock();

  // Mock forecast data - in a real app, this would come from a weather API
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
        </CardTitle>
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
