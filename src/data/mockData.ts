
export const SPECIES = ['cattle', 'goat', 'sheep'];

export const BREEDS = {
  cattle: [
    'Muturu',
    'Red Bororo', 
    'Sokoto Gudali',
    'White Fulani'
  ],
  goat: [
    'Sahel',
    'Sokoto Red',
    'West African Dwarf'
  ],
  sheep: [
    'Balami',
    'Uda',
    'Yankasa'
  ]
};

export const AGE_GROUPS = {
  cattle: ['adult', 'calf', 'yearling'],
  goat: ['adult', 'kid', 'yearling'],
  sheep: ['adult', 'lamb', 'yearling']
};

export const SEVERITY_LABELS = ["Normal", "Mild", "Moderate", "Severe"];

export const ADVICE = {
  cattle: {
    0: "Cattle are comfortable. Ensure adequate water and shade access.",
    1: "Monitor cattle closely. Provide extra water and ensure good ventilation.",
    2: "Reduce cattle handling activities. Increase shade and consider cooling systems.",
    3: "Emergency action needed! Implement immediate cooling measures for cattle."
  },
  goat: {
    0: "Goats are comfortable. Maintain regular care routines.",
    1: "Watch goats for early heat stress signs. Increase water availability.",
    2: "Reduce goat activity during hot hours. Ensure adequate shelter.",
    3: "Critical heat stress risk for goats! Immediate cooling intervention required."
  },
  sheep: {
    0: "Sheep are in optimal conditions. Continue normal management.",
    1: "Monitor sheep behavior. Provide additional water sources.",
    2: "Limit sheep movement. Ensure proper ventilation and shade.",
    3: "Severe heat stress risk for sheep! Take immediate protective action."
  }
};

export const HEAT_STRESS_SIGNS = {
  cattle: [
    "Increased breathing rate and panting",
    "Excessive drooling and salivation",
    "Seeking shade and reduced activity",
    "Decreased feed intake and rumination",
    "Standing with legs spread wide",
    "Increased water consumption and restlessness"
  ],
  goat: [
    "Rapid shallow breathing and panting",
    "Open-mouth breathing with tongue out",
    "Lethargy and reduced movement",
    "Decreased appetite and browsing",
    "Seeking cool areas and shade",
    "Increased water drinking and agitation"
  ],
  sheep: [
    "Heavy panting and breathing difficulty",
    "Wool appears damp from sweating",
    "Clustering in available shade areas",
    "Reduced grazing and feed activity",
    "Increased water consumption",
    "Restlessness and discomfort signs"
  ]
};

// Breed-specific heat tolerance characteristics
interface BreedCharacteristic {
  heatTolerance: number;
  baseTemp: number;
  baseResp: number;
}

interface BreedCharacteristics {
  [breed: string]: BreedCharacteristic;
}

interface AnimalBreedCharacteristics {
  cattle: BreedCharacteristics;
  goat: BreedCharacteristics;
  sheep: BreedCharacteristics;
}

const BREED_CHARACTERISTICS: AnimalBreedCharacteristics = {
  cattle: {
    'Muturu': { heatTolerance: 0.9, baseTemp: 38.3, baseResp: 28 }, // High heat tolerance, adapted to tropical climate
    'Red Bororo': { heatTolerance: 0.8, baseTemp: 38.5, baseResp: 30 }, // Good heat tolerance
    'Sokoto Gudali': { heatTolerance: 0.7, baseTemp: 38.6, baseResp: 32 }, // Moderate heat tolerance
    'White Fulani': { heatTolerance: 0.75, baseTemp: 38.4, baseResp: 29 } // Good heat tolerance
  },
  goat: {
    'Sahel': { heatTolerance: 0.95, baseTemp: 38.8, baseResp: 22 }, // Excellent heat tolerance, desert adapted
    'Sokoto Red': { heatTolerance: 0.85, baseTemp: 39.0, baseResp: 25 }, // Very good heat tolerance
    'West African Dwarf': { heatTolerance: 0.8, baseTemp: 39.2, baseResp: 27 } // Good heat tolerance
  },
  sheep: {
    'Balami': { heatTolerance: 0.7, baseTemp: 39.1, baseResp: 26 }, // Moderate heat tolerance
    'Uda': { heatTolerance: 0.75, baseTemp: 39.0, baseResp: 25 }, // Good heat tolerance
    'Yankasa': { heatTolerance: 0.8, baseTemp: 38.9, baseResp: 24 } // Good heat tolerance
  }
};

// Age-specific vulnerability factors
interface AgeFactor {
  vulnerability: number;
  tempModifier: number;
  respModifier: number;
}

interface AgeFactors {
  [age: string]: AgeFactor;
}

interface AnimalAgeFactors {
  cattle: AgeFactors;
  goat: AgeFactors;
  sheep: AgeFactors;
}

const AGE_FACTORS: AnimalAgeFactors = {
  cattle: {
    'adult': { vulnerability: 1.0, tempModifier: 0, respModifier: 0 },
    'calf': { vulnerability: 1.3, tempModifier: 0.2, respModifier: 5 }, // More vulnerable
    'yearling': { vulnerability: 1.15, tempModifier: 0.1, respModifier: 3 } // Slightly more vulnerable
  },
  goat: {
    'adult': { vulnerability: 1.0, tempModifier: 0, respModifier: 0 },
    'kid': { vulnerability: 1.4, tempModifier: 0.3, respModifier: 8 }, // Much more vulnerable
    'yearling': { vulnerability: 1.2, tempModifier: 0.15, respModifier: 4 } // More vulnerable
  },
  sheep: {
    'adult': { vulnerability: 1.0, tempModifier: 0, respModifier: 0 },
    'lamb': { vulnerability: 1.35, tempModifier: 0.25, respModifier: 6 }, // More vulnerable
    'yearling': { vulnerability: 1.18, tempModifier: 0.12, respModifier: 3 } // Slightly more vulnerable
  }
};

// Mock prediction function with realistic breed and age variations
export const callFlaskModel = async (
  species: string,
  breed: string,
  age: string,
  environmentalConditions: any
) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const { temperature, humidity, wind_speed, solar_radiation } = environmentalConditions;
  
  // Get breed-specific characteristics
  const breedData = BREED_CHARACTERISTICS[species as keyof AnimalBreedCharacteristics]?.[breed] || 
    { heatTolerance: 0.7, baseTemp: 38.5, baseResp: 30 };
  
  // Get age-specific factors
  const ageData = AGE_FACTORS[species as keyof AnimalAgeFactors]?.[age] || 
    { vulnerability: 1.0, tempModifier: 0, respModifier: 0 };
  
  // Calculate environmental stress factors
  let tempStress = Math.max(0, (temperature - 25) * 0.15);
  let humidityStress = Math.max(0, (humidity - 50) * 0.08);
  let solarStress = Math.max(0, (solar_radiation - 400) * 0.0008);
  let windReduction = Math.max(0, (wind_speed - 1) * 0.5);
  
  // Apply breed heat tolerance (higher tolerance = lower stress impact)
  const breedStressReduction = (1 - breedData.heatTolerance) * 0.5;
  const totalEnvironmentalStress = (tempStress + humidityStress + solarStress - windReduction) * (1 + breedStressReduction);
  
  // Apply age vulnerability
  const totalStress = totalEnvironmentalStress * ageData.vulnerability;
  
  // Calculate physiological responses
  const bodyTemperature = breedData.baseTemp + ageData.tempModifier + (totalStress * 0.8);
  const respirationRate = breedData.baseResp + ageData.respModifier + (totalStress * 4);
  
  // Determine stress level with breed and age considerations
  let stressLevel = 0;
  const stressThreshold = breedData.heatTolerance; // More tolerant breeds have higher thresholds
  
  if (totalStress > (3.0 - stressThreshold)) stressLevel = 3;
  else if (totalStress > (2.0 - stressThreshold * 0.5)) stressLevel = 2;
  else if (totalStress > (1.0 - stressThreshold * 0.3)) stressLevel = 1;
  
  // Add some realistic variation while keeping it deterministic for the same inputs
  const variation = (breed.length + age.length + species.length) % 10 * 0.01;
  
  const severity = SEVERITY_LABELS[stressLevel];
  
  return {
    Body_Temperature_C: Number((bodyTemperature + variation).toFixed(2)),
    Respiration_Rate_bpm: Number((respirationRate + variation * 5).toFixed(0)),
    stress_level: stressLevel,
    severity: severity
  };
};
