
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useLivestock } from "@/contexts/LivestockContext";
import { Thermometer, Droplets, Wind, Sun } from "lucide-react";

const EnvironmentalConditionsForm = () => {
  const { environmentalConditions, setEnvironmentalConditions } = useLivestock();
  
  const handleTemperatureChange = (value: number[]) => {
    setEnvironmentalConditions(prev => ({ ...prev, temperature: value[0] }));
  };
  
  const handleHumidityChange = (value: number[]) => {
    setEnvironmentalConditions(prev => ({ ...prev, humidity: value[0] }));
  };
  
  const handleWindSpeedChange = (value: number[]) => {
    setEnvironmentalConditions(prev => ({ ...prev, wind_speed: value[0] }));
  };
  
  const handleSolarRadiationChange = (value: number[]) => {
    setEnvironmentalConditions(prev => ({ ...prev, solar_radiation: value[0] }));
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium flex items-center">
        <Thermometer className="mr-2 h-5 w-5 text-farm-green" />
        Environmental Conditions
      </h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between mb-2">
            <Label htmlFor="temperature">Temperature (°C)</Label>
            <span className="text-sm font-medium">{environmentalConditions.temperature}°C</span>
          </div>
          <Slider
            id="temperature"
            min={-10}
            max={50}
            step={0.5}
            value={[environmentalConditions.temperature]}
            onValueChange={handleTemperatureChange}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>-10°C</span>
            <span>50°C</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between mb-2">
            <Label htmlFor="humidity" className="flex items-center">
              <Droplets className="mr-1 h-4 w-4" />
              Humidity (%)
            </Label>
            <span className="text-sm font-medium">{environmentalConditions.humidity}%</span>
          </div>
          <Slider
            id="humidity"
            min={0}
            max={100}
            step={1}
            value={[environmentalConditions.humidity]}
            onValueChange={handleHumidityChange}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between mb-2">
            <Label htmlFor="wind-speed" className="flex items-center">
              <Wind className="mr-1 h-4 w-4" />
              Wind Speed (m/s)
            </Label>
            <span className="text-sm font-medium">{environmentalConditions.wind_speed} m/s</span>
          </div>
          <Slider
            id="wind-speed"
            min={0}
            max={25}
            step={0.1}
            value={[environmentalConditions.wind_speed]}
            onValueChange={handleWindSpeedChange}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0 m/s</span>
            <span>25 m/s</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between mb-2">
            <Label htmlFor="solar-radiation" className="flex items-center">
              <Sun className="mr-1 h-4 w-4" />
              Solar Radiation (W/m²)
            </Label>
            <span className="text-sm font-medium">{environmentalConditions.solar_radiation} W/m²</span>
          </div>
          <Slider
            id="solar-radiation"
            min={0}
            max={1200}
            step={10}
            value={[environmentalConditions.solar_radiation]}
            onValueChange={handleSolarRadiationChange}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0 W/m²</span>
            <span>1200 W/m²</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalConditionsForm;
