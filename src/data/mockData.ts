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

// Mock prediction function - this calculates values based on environmental conditions
export const callFlaskModel = async (
  species: string,
  breed: string,
  age: string,
  environmentalConditions: any
) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const { temperature, humidity, wind_speed, solar_radiation } = environmentalConditions;
  
  // Base values for different species
  const baseValues = {
    cattle: { bodyTemp: 38.5, respiration: 30 },
    goat: { bodyTemp: 39.0, respiration: 25 },
    sheep: { bodyTemp: 39.2, respiration: 28 }
  };
  
  const base = baseValues[species as keyof typeof baseValues] || baseValues.cattle;
  
  // Calculate stress based on environmental factors
  let tempStress = Math.max(0, (temperature - 25) * 0.15);
  let humidityStress = Math.max(0, (humidity - 50) * 0.08);
  let solarStress = Math.max(0, (solar_radiation - 400) * 0.0008);
  let windReduction = Math.max(0, (wind_speed - 1) * 0.5);
  
  // Age and breed modifiers
  const ageModifier = age === 'adult' ? 1.0 : age === 'yearling' ? 1.1 : 1.15;
  const breedModifier = Math.random() * 0.3 + 0.85; // Breed variation
  
  // Calculate final values
  const totalStress = (tempStress + humidityStress + solarStress - windReduction) * ageModifier * breedModifier;
  
  const bodyTemperature = base.bodyTemp + totalStress;
  const respirationRate = base.respiration + (totalStress * 3.5);
  
  // Determine stress level
  let stressLevel = 0;
  if (totalStress > 2.5) stressLevel = 3;
  else if (totalStress > 1.5) stressLevel = 2;
  else if (totalStress > 0.8) stressLevel = 1;
  
  const severity = SEVERITY_LABELS[stressLevel];
  
  return {
    Body_Temperature_C: Number(bodyTemperature.toFixed(2)),
    Respiration_Rate_bpm: Number(respirationRate.toFixed(0)),
    stress_level: stressLevel,
    severity: severity
  };
};
