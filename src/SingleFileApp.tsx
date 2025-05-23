
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SPECIES, BREEDS, AGE_GROUPS, SEVERITY_LABELS, ADVICE, HEAT_STRESS_SIGNS, mockPredictions } from "@/data/mockData";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Beef, BarChart, History, Search, Wind, Droplets, Sun, 
  Thermometer, ThermometerSun, CircleDashed, Download, 
  FileJson, Clock, ArrowRight, AlertTriangle, LineChart as LineChartIcon, BarChart2 
} from "lucide-react";

// UI Components from src/components/ui/
const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

const labelVariants = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70";

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants, className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

const Separator = React.forwardRef(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

// Type Definitions
export interface EnvironmentalConditions {
  temperature: number;
  humidity: number;
  wind_speed: number;
  solar_radiation: number;
  location?: string;
}

export interface AnimalInfo {
  species: string;
  breed: string;
  age: string;
}

export interface Prediction {
  Body_Temperature_C: number;
  Respiration_Rate_bpm: number;
  Cooling_Effect: number;
  stress_level: number;
  severity: string;
}

interface LivestockContextType {
  environmentalConditions: EnvironmentalConditions;
  setEnvironmentalConditions: React.Dispatch<React.SetStateAction<EnvironmentalConditions>>;
  animalInfo: AnimalInfo;
  setAnimalInfo: React.Dispatch<React.SetStateAction<AnimalInfo>>;
  prediction: Prediction | null;
  setPrediction: React.Dispatch<React.SetStateAction<Prediction | null>>;
  weatherData: any;
  setWeatherData: React.Dispatch<React.SetStateAction<any>>;
  predictionHistory: Array<{
    timestamp: Date;
    animalInfo: AnimalInfo;
    conditions: EnvironmentalConditions;
    prediction: Prediction;
  }>;
  addToPredictionHistory: (prediction: Prediction) => void;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// Context Definition
const LivestockContext = createContext<LivestockContextType | undefined>(undefined);

export const LivestockProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [environmentalConditions, setEnvironmentalConditions] = useState<EnvironmentalConditions>({
    temperature: 25,
    humidity: 60,
    wind_speed: 2,
    solar_radiation: 500,
    location: '',
  });
  const [animalInfo, setAnimalInfo] = useState<AnimalInfo>({
    species: 'cattle',
    breed: '',
    age: '',
  });
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [predictionHistory, setPredictionHistory] = useState<Array<{
    timestamp: Date;
    animalInfo: AnimalInfo;
    conditions: EnvironmentalConditions;
    prediction: Prediction;
  }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addToPredictionHistory = (newPrediction: Prediction) => {
    setPredictionHistory(prev => [
      {
        timestamp: new Date(),
        animalInfo: {...animalInfo},
        conditions: {...environmentalConditions},
        prediction: newPrediction
      },
      ...prev
    ]);
  };

  return (
    <LivestockContext.Provider value={{
      environmentalConditions,
      setEnvironmentalConditions,
      animalInfo,
      setAnimalInfo,
      prediction,
      setPrediction,
      weatherData,
      setWeatherData,
      predictionHistory,
      addToPredictionHistory,
      isLoading,
      setIsLoading,
    }}>
      {children}
    </LivestockContext.Provider>
  );
};

export const useLivestock = () => {
  const context = useContext(LivestockContext);
  if (context === undefined) {
    throw new Error("useLivestock must be used within a LivestockProvider");
  }
  return context;
};

// Weather API Service
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

// Export Utilities
interface PredictionRecord {
  timestamp: Date;
  animalInfo: AnimalInfo;
  conditions: EnvironmentalConditions;
  prediction: Prediction;
}

// Calculate THI (Temperature-Humidity Index)
const calculateTHI = (temperature: number, humidity: number) => {
  // THI = (1.8 × T + 32) - (0.55 - 0.0055 × RH) × [(1.8 × T + 32) - 58]
  const tempF = 1.8 * temperature + 32;
  const thi = tempF - (0.55 - 0.0055 * humidity) * (tempF - 58);
  return Math.round(thi * 10) / 10;
};

// Calculate HLI (Heat Load Index)
const calculateHLI = (temperature: number, humidity: number, windSpeed: number) => {
  // Simplified version of HLI
  const hli = 8.62 + (0.38 * humidity) + (1.55 * temperature) - (0.5 * windSpeed) + Math.exp(2.4 - windSpeed);
  return Math.round(hli * 10) / 10;
};

// Export to CSV function
export const exportToCSV = (data: PredictionRecord[]): void => {
  if (data.length === 0) {
    console.error("No data to export");
    return;
  }
  
  // Define the CSV headers with additional metrics
  const headers = [
    'Timestamp',
    'Species',
    'Breed',
    'Age Group',
    'Location',
    'Temperature (°C)',
    'Humidity (%)',
    'Wind Speed (m/s)',
    'Solar Radiation (W/m²)',
    'THI (Temperature-Humidity Index)',
    'HLI (Heat Load Index)',
    'Predicted Body Temperature (°C)',
    'Respiration Rate (bpm)',
    'Cooling Effect (%)',
    'Stress Level',
    'Severity',
    'Est. Feed Intake Reduction (%)',
    'Est. Production Impact (%)',
    'Est. Recovery Time (hrs)'
  ];
  
  // Convert data to CSV rows with calculated metrics
  const csvRows = data.map(record => {
    const { timestamp, animalInfo, conditions, prediction } = record;
    
    // Calculate additional metrics
    const thi = calculateTHI(conditions.temperature, conditions.humidity);
    const hli = calculateHLI(conditions.temperature, conditions.humidity, conditions.wind_speed);
    
    // Estimate production impacts based on stress level
    const feedIntakeReduction = [0, 5, 15, 35][prediction.stress_level] || 0;
    const productionImpact = [0, 10, 25, 40][prediction.stress_level] || 0;
    
    // Base recovery hours by species and stress level
    const recoveryTimeMap: {[key: string]: number[]} = {
      'cattle': [0, 3, 6, 12],
      'goat': [0, 2, 5, 10],
      'sheep': [0, 2, 5, 10]
    };
    
    const recoveryTime = recoveryTimeMap[animalInfo.species]?.[prediction.stress_level] || 
                         recoveryTimeMap.cattle[prediction.stress_level];
    
    return [
      new Date(timestamp).toLocaleString(),
      animalInfo.species,
      animalInfo.breed,
      animalInfo.age,
      conditions.location || 'N/A',
      conditions.temperature,
      conditions.humidity,
      conditions.wind_speed,
      conditions.solar_radiation,
      thi.toFixed(1),
      hli.toFixed(1),
      prediction.Body_Temperature_C.toFixed(1),
      prediction.Respiration_Rate_bpm.toFixed(1),
      prediction.Cooling_Effect.toFixed(1),
      prediction.stress_level,
      prediction.severity,
      feedIntakeReduction,
      productionImpact,
      recoveryTime
    ].join(',');
  });
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...csvRows
  ].join('\n');
  
  // Create a blob and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Set current date in filename
  const currentDate = new Date().toISOString().split('T')[0];
  const filename = `livestock_heat_stress_analysis_${currentDate}.csv`;
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
};

// Export to JSON function
export const exportToJSON = (data: PredictionRecord[]): void => {
  if (data.length === 0) {
    console.error("No data to export");
    return;
  }
  
  // Prepare the enriched data with calculated fields
  const enrichedData = data.map(record => {
    const { timestamp, animalInfo, conditions, prediction } = record;
    
    // Calculate additional metrics
    const thi = calculateTHI(conditions.temperature, conditions.humidity);
    const hli = calculateHLI(conditions.temperature, conditions.humidity, conditions.wind_speed);
    
    return {
      timestamp: new Date(timestamp).toISOString(),
      animalInfo,
      conditions,
      prediction,
      calculated_metrics: {
        thi,
        hli,
        feed_intake_reduction: [0, 5, 15, 35][prediction.stress_level] || 0,
        production_impact: [0, 10, 25, 40][prediction.stress_level] || 0,
        recovery_time_hours: [0, 3, 6, 12][prediction.stress_level] || 0
      }
    };
  });
  
  // Create a blob and download the file
  const jsonContent = JSON.stringify(enrichedData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const currentDate = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `livestock_heat_stress_data_${currentDate}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
};

// Component: StressLevelBar
interface StressLevelBarProps {
  stressLevel: number;
  showLabels?: boolean;
  className?: string;
}

const StressLevelBar = ({ stressLevel, showLabels = true, className = "" }: StressLevelBarProps) => {
  const levels = SEVERITY_LABELS;
  const levelColors = ["bg-stress-normal", "bg-stress-mild", "bg-stress-moderate", "bg-stress-severe"];
  
  // Calculate the percentage filled
  const fillPercentage = ((stressLevel + 1) / levels.length) * 100;
  
  return (
    <div className={`w-full ${className}`}>
      <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${levelColors[stressLevel]} transition-all duration-500 ease-out`}
          style={{ width: `${fillPercentage}%` }}
        />
      </div>
      
      {showLabels && (
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          {levels.map((level, index) => (
            <div 
              key={index} 
              className={`${index === stressLevel ? 'font-bold text-gray-800' : ''}`}
            >
              {level}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Component: AnimalSelector
const AnimalSelector = () => {
  const { animalInfo, setAnimalInfo } = useLivestock();
  
  // Set default values for breed and age when species changes
  React.useEffect(() => {
    if (animalInfo.species && (!animalInfo.breed || !animalInfo.age)) {
      const speciesBreeds = BREEDS[animalInfo.species as keyof typeof BREEDS] || [];
      const speciesAges = AGE_GROUPS[animalInfo.species as keyof typeof AGE_GROUPS] || [];
      
      setAnimalInfo(prev => ({
        ...prev,
        breed: prev.breed || (speciesBreeds.length > 0 ? speciesBreeds[0] : ''),
        age: prev.age || (speciesAges.length > 0 ? speciesAges[0] : '')
      }));
    }
  }, [animalInfo.species, setAnimalInfo]);
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="species">Animal Type</Label>
        <Select
          value={animalInfo.species}
          onValueChange={(value) => setAnimalInfo({ ...animalInfo, species: value, breed: '', age: '' })}
        >
          <SelectTrigger id="species" className="capitalize">
            <SelectValue placeholder="Select animal type" />
          </SelectTrigger>
          <SelectContent>
            {SPECIES.map((species) => (
              <SelectItem key={species} value={species} className="capitalize">
                {species}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="breed">Breed</Label>
        <Select
          value={animalInfo.breed}
          onValueChange={(value) => setAnimalInfo({ ...animalInfo, breed: value })}
          disabled={!animalInfo.species}
        >
          <SelectTrigger id="breed">
            <SelectValue placeholder="Select breed" />
          </SelectTrigger>
          <SelectContent>
            {(animalInfo.species && BREEDS[animalInfo.species as keyof typeof BREEDS] || []).map((breed) => (
              <SelectItem key={breed} value={breed}>
                {breed}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="age">Age Group</Label>
        <Select
          value={animalInfo.age}
          onValueChange={(value) => setAnimalInfo({ ...animalInfo, age: value })}
          disabled={!animalInfo.species}
        >
          <SelectTrigger id="age">
            <SelectValue placeholder="Select age group" />
          </SelectTrigger>
          <SelectContent>
            {(animalInfo.species && AGE_GROUPS[animalInfo.species as keyof typeof AGE_GROUPS] || []).map((age) => (
              <SelectItem key={age} value={age}>
                {age}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

// Component: EnvironmentalConditionsForm
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

// Component: WeatherCard
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

// Component: PredictionResult
const PredictionResult = () => {
  const { prediction, animalInfo, environmentalConditions, predictionHistory } = useLivestock();

  if (!prediction) {
    return null;
  }

  const advice = ADVICE[animalInfo.species as keyof typeof ADVICE]?.[prediction.stress_level as keyof (typeof ADVICE)[keyof typeof ADVICE]] || 
    "No specific advice available for this animal and stress level.";

  const stressSymptoms = HEAT_STRESS_SIGNS[animalInfo.species as keyof typeof HEAT_STRESS_SIGNS] || [];

  const handleExportCSV = () => {
    if (predictionHistory.length > 0) {
      exportToCSV(predictionHistory);
    }
  };

  const handleExportJSON = () => {
    if (predictionHistory.length > 0) {
      exportToJSON(predictionHistory);
    }
  };

  return (
    <Card className="w-full mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl flex items-center">
          <ThermometerSun className="mr-2 h-6 w-6 text-farm-green" /> 
          Heat Stress Prediction
        </CardTitle>
        <CardDescription>
          Results for {animalInfo.species} - {animalInfo.breed} ({animalInfo.age})
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Heat Stress Level</h3>
          <StressLevelBar stressLevel={prediction.stress_level} />
          <p className="text-center mt-2 font-medium text-lg">
            {prediction.severity} Stress Level
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-muted p-4 rounded-lg text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Body Temperature</h4>
            <p className="text-2xl font-bold">{prediction.Body_Temperature_C.toFixed(1)}°C</p>
          </div>
          
          <div className="bg-muted p-4 rounded-lg text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Respiration Rate</h4>
            <p className="text-2xl font-bold">{prediction.Respiration_Rate_bpm.toFixed(0)} bpm</p>
          </div>
          
          <div className="bg-muted p-4 rounded-lg text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Cooling Efficacy</h4>
            <p className="text-2xl font-bold">{prediction.Cooling_Effect.toFixed(0)}%</p>
          </div>
        </div>

        {prediction.stress_level > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
            <h3 className="font-medium flex items-center text-amber-800">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              Watch for these symptoms:
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-sm text-amber-800">
              {stressSymptoms.slice(0, 4).map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-farm-green-light/20 border border-farm-green/30 rounded-lg p-4 space-y-2">
          <h3 className="font-medium flex items-center text-farm-green-dark">
            <CircleDashed className="h-5 w-5 mr-2 text-farm-green" />
            Recommended Actions:
          </h3>
          <p className="text-farm-green-dark">{advice}</p>
        </div>

        {predictionHistory.length > 0 && (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportJSON}>
                  <FileJson className="h-4 w-4 mr-2" />
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Component: PredictionHistory
const PredictionHistory = () => {
  const { predictionHistory } = useLivestock();
  
  const handleExportCSV = () => {
    if (predictionHistory.length > 0) {
      exportToCSV(predictionHistory);
    }
  };
  
  if (predictionHistory.length === 0) {
    return null;
  }
  
  return (
    <Card className="w-full mt-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl flex items-center">
              <Clock className="mr-2 h-5 w-5 text-farm-green" />
              Prediction History
            </CardTitle>
            <CardDescription>
              Recent heat stress predictions for your livestock
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="flex items-center">
            <Download className="h-4 w-4 mr-1" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Animal</TableHead>
                <TableHead>Temp (°C)</TableHead>
                <TableHead>Humidity</TableHead>
                <TableHead>Stress Level</TableHead>
                <TableHead>Body Temp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {predictionHistory.slice(0, 5).map((record, index) => {
                const stressLevelColors = [
                  "text-stress-normal", 
                  "text-stress-mild", 
                  "text-stress-moderate", 
                  "text-stress-severe"
                ];
                
                return (
                  <TableRow key={index}>
                    <TableCell>
                      {new Date(record.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell className="capitalize">{record.animalInfo.species}</TableCell>
                    <TableCell>{record.conditions.temperature}°C</TableCell>
                    <TableCell>{record.conditions.humidity}%</TableCell>
                    <TableCell className={`font-medium ${stressLevelColors[record.prediction.stress_level]}`}>
                      {SEVERITY_LABELS[record.prediction.stress_level]}
                    </TableCell>
                    <TableCell>{record.prediction.Body_Temperature_C.toFixed(1)}°C</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

// Component: HistoricalTrends
const HistoricalTrends = () => {
  const { predictionHistory } = useLivestock();

  // Early return if no history
  if (!predictionHistory || predictionHistory.length < 2) {
    return null;
  }

  // Process data for chart
  const chartData = predictionHistory
    .slice(0, 10)
    .reverse()
    .map((item, index) => {
      const time = new Date(item.timestamp).toLocaleTimeString();
      return {
        name: `#${index + 1} (${time})`,
        temperature: item.prediction.Body_Temperature_C,
        respiration: item.prediction.Respiration_Rate_bpm,
        cooling: item.prediction.Cooling_Effect,
        environmentTemp: item.conditions.temperature,
        humidity: item.conditions.humidity,
        stressLevel: item.prediction.stress_level,
      };
    });

  const config = {
    temperature: {
      label: "Body Temperature (°C)",
      theme: {
        light: "#ef4444", // Red
        dark: "#ef4444",
      },
    },
    respiration: {
      label: "Respiration Rate (bpm)",
      theme: {
        light: "#3b82f6", // Blue
        dark: "#3b82f6",
      },
    },
    cooling: {
      label: "Cooling Effect (%)",
      theme: {
        light: "#10b981", // Green
        dark: "#10b981",
      },
    },
    environmentTemp: {
      label: "Environment Temp (°C)",
      theme: {
        light: "#f97316", // Orange
        dark: "#f97316",
      },
    },
  };

  return (
    <Card className="w-full mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl flex items-center">
          <History className="mr-2 h-6 w-6 text-farm-green" /> Historical Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer config={config}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <RechartsTooltip content={<ChartTooltipContent />} />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="temperature"
                name="Body Temperature"
                stroke="var(--color-temperature)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="respiration"
                name="Respiration Rate"
                stroke="var(--color-respiration)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="cooling"
                name="Cooling Effect"
                stroke="var(--color-cooling)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="environmentTemp"
                name="Environment Temp"
                stroke="var(--color-environmentTemp)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
        
        {predictionHistory.length > 0 && (
          <div className="mt-4 bg-muted/30 p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <strong>Analysis:</strong> The chart displays trends in body temperature, respiration rate, 
              cooling effect, and environmental temperature over time. Track these metrics to identify patterns 
              and correlations that may help predict heat stress conditions before they become critical.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Component: AdvancedAnalysis
const AdvancedAnalysis = () => {
  const { animalInfo, environmentalConditions, prediction } = useLivestock();
  
  if (!prediction) {
    return null;
  }
  
  // Calculate indices
  const thi = calculateTHI(environmentalConditions.temperature, environmentalConditions.humidity);
  const thiInterpretation = interpretTHI(thi);
  
  const hli = calculateHLI(
    environmentalConditions.temperature, 
    environmentalConditions.humidity, 
    environmentalConditions.wind_speed
  );
  const hliInterpretation = interpretHLI(hli, animalInfo.species);
  
  // Calculate production impacts
  const recoveryTime = estimateRecoveryTime(prediction.stress_level, animalInfo.species);
  const feedIntakeReduction = estimateFeedIntakeReduction(prediction.stress_level);
  const milkProduction = estimateMilkProduction(prediction.stress_level);
  
  return (
    <Card className="w-full mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl flex items-center">
          <CircleDashed className="mr-2 h-6 w-6 text-farm-green" /> Advanced Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="indices">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="indices" className="text-sm">
              <BarChart2 className="h-4 w-4 mr-2" />
              Heat Stress Indices
            </TabsTrigger>
            <TabsTrigger value="impact" className="text-sm">
              <LineChartIcon className="h-4 w-4 mr-2" />
              Production Impact
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="indices" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">Temperature-Humidity Index (THI)</h3>
                <p className="text-3xl font-bold mb-2">{thi.toFixed(1)}</p>
                <StressLevelBar stressLevel={thiInterpretation.level} />
                <p className="mt-2 text-sm">{thiInterpretation.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  THI combines temperature and humidity to indicate potential heat stress conditions.
                </p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">Heat Load Index (HLI)</h3>
                <p className="text-3xl font-bold mb-2">{hli.toFixed(1)}</p>
                <StressLevelBar stressLevel={hliInterpretation.level} />
                <p className="mt-2 text-sm">{hliInterpretation.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  HLI accounts for temperature, humidity, and wind speed to assess heat load on animals.
                </p>
              </div>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg border">
              <h4 className="font-medium flex items-center mb-1">
                <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                Interpretation
              </h4>
              <p className="text-sm text-muted-foreground">
                These indices provide different perspectives on heat stress. THI is widely used for cattle while
                HLI accounts for additional factors like wind speed. Both indicate
                {prediction.stress_level > 1 ? " significant" : " minimal"} risk under current conditions.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="impact" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg text-center">
                <h3 className="text-sm font-medium mb-2">Estimated Recovery Time</h3>
                <p className="text-3xl font-bold mb-1">{recoveryTime}</p>
                <p className="text-sm">hours</p>
              </div>
              
              <div className="p-4 border rounded-lg text-center">
                <h3 className="text-sm font-medium mb-2">Feed Intake Reduction</h3>
                <p className="text-3xl font-bold mb-1">-{feedIntakeReduction}%</p>
                <p className="text-sm">compared to normal</p>
              </div>
              
              <div className="p-4 border rounded-lg text-center">
                <h3 className="text-sm font-medium mb-2">
                  {animalInfo.species === "cattle" ? "Milk Production" : "Production"} Impact
                </h3>
                <p className="text-3xl font-bold mb-1">-{milkProduction}%</p>
                <p className="text-sm">potential loss</p>
              </div>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg border">
              <h4 className="font-medium flex items-center mb-1">
                <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                Economic Considerations
              </h4>
              <p className="text-sm text-muted-foreground">
                At stress level {prediction.stress_level} ({SEVERITY_LABELS[prediction.stress_level]}), 
                you may experience reduced productivity for approximately {recoveryTime} hours. 
                Consider the economic impact of {feedIntakeReduction}% reduced feed intake and 
                {milkProduction > 0 ? ` ${milkProduction}% reduced production. ` : " production losses. "}
                Implementing cooling strategies may be economically beneficial.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper functions for AdvancedAnalysis
// Interpret THI value
const interpretTHI = (thi: number) => {
  if (thi < 68) return { level: 0, description: "Comfort zone - No stress" };
  if (thi < 72) return { level: 1, description: "Mild stress threshold" };
  if (thi < 80) return { level: 2, description: "Moderate heat stress" };
  return { level: 3, description: "Severe heat stress" };
};

// Interpret HLI value
const interpretHLI = (hli: number, species: string) => {
  const thresholds = {
    'cattle': { mild: 70, moderate: 77, severe: 86 },
    'goat': { mild: 75, moderate: 82, severe: 90 },
    'sheep': { mild: 72, moderate: 79, severe: 88 }
  };
  
  const threshold = thresholds[species as keyof typeof thresholds] || thresholds.cattle;
  
  if (hli < threshold.mild) return { level: 0, description: "Thermoneutral conditions" };
  if (hli < threshold.moderate) return { level: 1, description: "Mild heat load" };
  if (hli < threshold.severe) return { level: 2, description: "Moderate heat load" };
  return { level: 3, description: "Severe heat load" };
};

// Calculate recovery time based on stress level
const estimateRecoveryTime = (stressLevel: number, species: string) => {
  const baseHours = {
    'cattle': [0, 3, 6, 12],
    'goat': [0, 2, 5, 10],
    'sheep': [0, 2, 5, 10]
  };
  
  return baseHours[species as keyof typeof baseHours]?.[stressLevel] || baseHours.cattle[stressLevel];
};

// Calculate feed intake reduction
const estimateFeedIntakeReduction = (stressLevel: number) => {
  const reductions = [0, 5, 15, 35]; // % reduction by stress level
  return reductions[stressLevel] || 0;
};

// Calculate milk production impact (for dairy animals)
const estimateMilkProduction = (stressLevel: number) => {
  const reductions = [0, 10, 25, 40]; // % reduction by stress level
  return reductions[stressLevel] || 0;
};

// 404 Not Found page
const NotFound = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

// Main App component that assembles everything
const LivestockApp = () => {
  const { 
    animalInfo, 
    environmentalConditions, 
    prediction, 
    setPrediction,
    addToPredictionHistory,
    isLoading, 
    setIsLoading 
  } = useLivestock();

  const handlePredict = () => {
    // Validate input values
    if (!animalInfo.species || !animalInfo.breed || !animalInfo.age) {
      toast.error("Please select animal type, breed and age group");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        // In a real app, this would be an API call to the backend
        const result = mockPredictions(
          animalInfo.species,
          animalInfo.breed,
          animalInfo.age,
          environmentalConditions
        );
        
        // Set prediction result
        setPrediction(result);
        
        // Add to history
        addToPredictionHistory(result);
        
        toast.success("Prediction completed successfully!");
      } catch (error) {
        console.error("Error generating prediction:", error);
        toast.error("Error generating prediction. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 text-farm-green-dark flex items-center justify-center">
          <Beef className="h-10 w-10 mr-3 text-farm-green" />
          Livestock Weather Insights Hub
        </h1>
        <p className="text-xl text-gray-600">
          Predict and prevent heat stress in your livestock with weather-based analytics
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <WeatherCard />

          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl flex items-center">
                <Beef className="mr-2 h-6 w-6 text-farm-green" /> Animal Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimalSelector />
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl flex items-center">
                <BarChart className="mr-2 h-6 w-6 text-farm-green" /> Heat Stress Predictor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnvironmentalConditionsForm />
              
              <div className="mt-8 flex justify-center">
                <Button 
                  onClick={handlePredict}
                  disabled={isLoading}
                  className="w-full md:w-auto bg-farm-green hover:bg-farm-green-dark"
                  size="lg"
                >
                  {isLoading ? "Calculating..." : "Predict Heat Stress"}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {prediction && <PredictionResult />}
          
          {prediction && <AdvancedAnalysis />}
          
          <HistoricalTrends />
          
          <PredictionHistory />
        </div>
      </div>
    </div>
  );
};

// Entry point component
const Index = () => {
  return (
    <LivestockProvider>
      <LivestockApp />
    </LivestockProvider>
  );
};

// Main App component with routing
const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <LivestockProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LivestockProvider>
    </QueryClientProvider>
  );
};

// Render the app
createRoot(document.getElementById("root")!).render(<App />);

export default App;
