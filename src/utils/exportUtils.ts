
import { AnimalInfo, EnvironmentalConditions, Prediction } from "../contexts/LivestockContext";

interface PredictionRecord {
  timestamp: Date;
  animalInfo: AnimalInfo;
  conditions: EnvironmentalConditions;
  prediction: Prediction;
}

export const exportToCSV = (data: PredictionRecord[]): void => {
  if (data.length === 0) {
    console.error("No data to export");
    return;
  }
  
  // Define the CSV headers
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
    'Predicted Body Temperature (°C)',
    'Respiration Rate (bpm)',
    'Cooling Effect',
    'Stress Level',
    'Severity'
  ];
  
  // Convert data to CSV rows
  const csvRows = data.map(record => {
    const { timestamp, animalInfo, conditions, prediction } = record;
    
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
      prediction.Body_Temperature_C.toFixed(1),
      prediction.Respiration_Rate_bpm.toFixed(1),
      prediction.Cooling_Effect.toFixed(1),
      prediction.stress_level,
      prediction.severity
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
  
  link.setAttribute('href', url);
  link.setAttribute('download', `livestock_predictions_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
