
// Data for development purposes - using Flask model only

export const SPECIES = ['cattle', 'goat', 'sheep'];

// Updated breeds from your Flask model
export const BREEDS = {
  'cattle': [
    'Red Bororo',
    'Muturu', 
    'Sokoto Gudali',
    'White Fulani'
  ],
  'goat': [
    'West African Dwarf',
    'Sahel',
    'Sokoto Red'
  ],
  'sheep': [
    'Yankasa',
    'Uda',
    'Dorper',
    'Balami'
  ]
};

// Updated age groups from your Flask model
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

// Function to call your Flask API
export async function callFlaskModel(species: string, breed: string, age: string, env: { temperature: number, humidity: number, solar_radiation: number, wind_speed: number }) {
  // Replace 'http://localhost:5000' with your actual Flask server URL
  const API_URL = 'http://localhost:5000/predict';
  
  try {
    const formData = new FormData();
    formData.append('species', species);
    formData.append('breed', breed);
    formData.append('age', age);
    formData.append('temperature', env.temperature.toString());
    formData.append('humidity', env.humidity.toString());
    formData.append('wind_speed', env.wind_speed.toString());
    formData.append('solar_radiation', env.solar_radiation.toString());

    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to get prediction from Flask model');
    }

    // Parse the response - assuming your Flask model returns JSON
    const result = await response.json();
    
    // Map your Flask model response to the expected format
    return {
      Body_Temperature_C: result.Body_Temperature_C,
      Respiration_Rate_bpm: result.Respiration_Rate_bpm,
      stress_level: result.stress_level,
      severity: result.severity
    };
    
  } catch (error) {
    console.error('Flask API error:', error);
    throw error; // Re-throw the error so it can be handled by the calling component
  }
}
