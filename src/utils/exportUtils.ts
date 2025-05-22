
import { AnimalInfo, EnvironmentalConditions, Prediction } from "../contexts/LivestockContext";

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

// Generate a more advanced report with additional metrics
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

// Add a new function to export data in JSON format for more advanced analysis tools
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
