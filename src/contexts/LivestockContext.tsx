import React, { createContext, useState, useContext, ReactNode } from 'react';

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
