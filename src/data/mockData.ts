
// Mock data for development purposes

export const SPECIES = ['cattle', 'goat', 'sheep'];

export const BREEDS = {
  'cattle': [
    'Holstein',
    'Jersey',
    'Angus',
    'Hereford',
    'Charolais',
    'Brahman',
    'Simmental'
  ],
  'goat': [
    'Boer',
    'Alpine',
    'Saanen',
    'Nubian',
    'Pygmy',
    'LaMancha',
    'Kiko'
  ],
  'sheep': [
    'Merino',
    'Suffolk',
    'Dorper',
    'Border Leicester',
    'Corriedale',
    'Romney',
    'Texel'
  ]
};

export const AGE_GROUPS = {
  'cattle': ['Calf (0-6 months)', 'Young (6-24 months)', 'Adult (2-10 years)', 'Senior (>10 years)'],
  'goat': ['Kid (0-6 months)', 'Young (6-12 months)', 'Adult (1-7 years)', 'Senior (>7 years)'],
  'sheep': ['Lamb (0-6 months)', 'Young (6-12 months)', 'Adult (1-6 years)', 'Senior (>6 years)']
};

export const SEVERITY_LABELS = ["Normal", "Mild", "Moderate", "Severe"];

export const ADVICE = {
  'cattle': {
    0: "No immediate action needed. Ensure cattle have access to shade and clean water.",
    1: "Monitor cattle closely. Provide additional water sources and ensure shade is accessible. Consider adding electrolytes to water.",
    2: "Reduce handling and movement of cattle. Ensure barns have good airflow and consider using fans. Provide cooling water sprays if available. Feed during cooler parts of the day.",
    3: "Take immediate action! Use misting systems and fans. Move sensitive animals (pregnant, high-producing) to air-conditioned areas if possible. Consider wetting the ground. Provide cold water. Contact veterinarian if animals show severe distress signs."
  },
  'goat': {
    0: "No immediate action needed. Ensure goats have shade and fresh water.",
    1: "Monitor goats for signs of discomfort. Provide extra water access and ensure adequate shade.",
    2: "Reduce handling. Ensure good airflow in housing. Consider providing cooling mats. Feed during cooler hours.",
    3: "Immediate intervention required! Use fans and misting systems. Move to cooler areas. Provide cold water. Watch for excessive panting and lethargy. Contact veterinarian if distress continues."
  },
  'sheep': {
    0: "No immediate action needed. Ensure access to shade and water. Monitor heavily fleeced animals.",
    1: "Provide extra shade options. Ensure multiple water sources. Consider shearing if wool is heavy.",
    2: "Reduce handling. Move to well-ventilated areas. Provide cool surfaces to rest on. Consider wetting the ground in pens.",
    3: "Critical situation! Move sheep to cooler areas immediately. Apply cooling measures (fans, misting). Shear if wool is heavy. Monitor closely for heat stroke. Contact veterinarian if displaying serious symptoms."
  }
};

// Signs of heat stress by species
export const HEAT_STRESS_SIGNS = {
  'cattle': [
    "Increased respiration rate (>60 breaths per minute)",
    "Open-mouth breathing/panting",
    "Excessive drooling",
    "Reduced feed intake",
    "Decreased milk production",
    "Lethargy or weakness",
    "Crowding in shaded areas"
  ],
  'goat': [
    "Rapid breathing (>40 breaths per minute)",
    "Reduced activity",
    "Decreased feed intake",
    "Increased water consumption",
    "Seeking shade or cool surfaces",
    "Reduced milk production in dairy goats",
    "Isolation from the herd"
  ],
  'sheep': [
    "Rapid breathing/panting",
    "Extended neck posture",
    "Decreased rumination",
    "Crowding into shade",
    "Reduced movement",
    "Increased water intake",
    "Wool-biting or discomfort"
  ]
};

// Mock calculation functions (would be replaced by actual model predictions)
export function calculateStressLevel(env: { temperature: number, humidity: number, solar_radiation: number, wind_speed: number }): number {
  const stressIndex = env.temperature * 0.5 + env.humidity * 0.3 + env.solar_radiation * 0.15 - env.wind_speed * 2;
  
  if (stressIndex < 50) return 0;
  if (stressIndex < 65) return 1;
  if (stressIndex < 80) return 2;
  return 3;
}

export function mockPredictions(species: string, breed: string, age: string, env: { temperature: number, humidity: number, solar_radiation: number, wind_speed: number }) {
  // Animal-specific base temperatures
  const baseTemps = {
    'cattle': 38.5,
    'goat': 39.0,
    'sheep': 39.3
  };
  
  const baseTemp = baseTemps[species as keyof typeof baseTemps];
  const stressLevel = calculateStressLevel(env);
  
  // Simulate temperature increase based on stress level
  const tempIncrease = stressLevel * 0.5;
  
  // Simulate respiration rate changes
  const baseRespRate = {
    'cattle': 30,
    'goat': 25,
    'sheep': 20
  }[species as keyof typeof baseTemps];
  
  const respRateIncrease = stressLevel * 15;
  
  // Cooling effect decreases with stress level
  const coolingEffect = Math.max(0, 100 - (stressLevel * 25));
  
  return {
    Body_Temperature_C: baseTemp + tempIncrease,
    Respiration_Rate_bpm: baseRespRate + respRateIncrease,
    Cooling_Effect: coolingEffect,
    stress_level: stressLevel,
    severity: SEVERITY_LABELS[stressLevel]
  };
}
