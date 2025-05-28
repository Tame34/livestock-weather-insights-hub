
export interface LivestockIssue {
  problem: string;
  behavior: string[];
  remedy: string[];
  severity: 'low' | 'moderate' | 'high' | 'critical';
  timeToResolve: string;
}

export interface AnimalPerformanceData {
  eating_habits: {
    daily_intake_kg: number;
    feeding_frequency: number;
    preferred_feed_type: string[];
    water_consumption_liters: number;
    grazing_hours: number;
  };
  reproduction: {
    gestation_period_days: number;
    breeding_age_months: number;
    conception_rate_percent: number;
    offspring_per_birth: number;
    calving_interval_months: number;
  };
  mortality: {
    infant_mortality_percent: number;
    adult_mortality_percent: number;
    common_causes: string[];
    seasonal_risks: string[];
  };
  physical: {
    average_weight_kg: number;
    daily_weight_gain_kg: number;
    milk_production_liters: number;
    meat_quality_score: number;
    fat_percentage: number;
  };
  health: {
    drug_responsiveness_score: number;
    vaccination_schedule: string[];
    common_diseases: string[];
    stress_indicators: string[];
  };
}

export const LIVESTOCK_PERFORMANCE_DATA = {
  cattle: {
    'Muturu': {
      eating_habits: {
        daily_intake_kg: 12,
        feeding_frequency: 3,
        preferred_feed_type: ['grass', 'hay', 'grains'],
        water_consumption_liters: 35,
        grazing_hours: 8
      },
      reproduction: {
        gestation_period_days: 283,
        breeding_age_months: 15,
        conception_rate_percent: 85,
        offspring_per_birth: 1,
        calving_interval_months: 13
      },
      mortality: {
        infant_mortality_percent: 8,
        adult_mortality_percent: 3,
        common_causes: ['disease', 'malnutrition', 'predation'],
        seasonal_risks: ['drought', 'floods', 'cold stress']
      },
      physical: {
        average_weight_kg: 280,
        daily_weight_gain_kg: 0.6,
        milk_production_liters: 8,
        meat_quality_score: 8.5,
        fat_percentage: 15
      },
      health: {
        drug_responsiveness_score: 9,
        vaccination_schedule: ['FMD', 'Anthrax', 'Blackleg'],
        common_diseases: ['Trypanosomiasis', 'Tick-borne diseases'],
        stress_indicators: ['reduced appetite', 'isolation', 'panting']
      }
    },
    'White Fulani': {
      eating_habits: {
        daily_intake_kg: 15,
        feeding_frequency: 3,
        preferred_feed_type: ['grass', 'browse', 'supplements'],
        water_consumption_liters: 45,
        grazing_hours: 9
      },
      reproduction: {
        gestation_period_days: 285,
        breeding_age_months: 18,
        conception_rate_percent: 80,
        offspring_per_birth: 1,
        calving_interval_months: 14
      },
      mortality: {
        infant_mortality_percent: 12,
        adult_mortality_percent: 5,
        common_causes: ['disease', 'malnutrition', 'heat stress'],
        seasonal_risks: ['drought', 'heat waves', 'disease outbreaks']
      },
      physical: {
        average_weight_kg: 350,
        daily_weight_gain_kg: 0.8,
        milk_production_liters: 12,
        meat_quality_score: 7.8,
        fat_percentage: 12
      },
      health: {
        drug_responsiveness_score: 7,
        vaccination_schedule: ['FMD', 'Anthrax', 'CBPP'],
        common_diseases: ['Heat stress', 'Respiratory infections'],
        stress_indicators: ['excessive drooling', 'rapid breathing', 'seeking shade']
      }
    }
  },
  goat: {
    'Sahel': {
      eating_habits: {
        daily_intake_kg: 3,
        feeding_frequency: 4,
        preferred_feed_type: ['browse', 'shrubs', 'dry grass'],
        water_consumption_liters: 8,
        grazing_hours: 7
      },
      reproduction: {
        gestation_period_days: 150,
        breeding_age_months: 8,
        conception_rate_percent: 90,
        offspring_per_birth: 2,
        calving_interval_months: 8
      },
      mortality: {
        infant_mortality_percent: 15,
        adult_mortality_percent: 8,
        common_causes: ['disease', 'predation', 'malnutrition'],
        seasonal_risks: ['drought', 'extreme heat', 'cold nights']
      },
      physical: {
        average_weight_kg: 35,
        daily_weight_gain_kg: 0.12,
        milk_production_liters: 1.5,
        meat_quality_score: 8.2,
        fat_percentage: 8
      },
      health: {
        drug_responsiveness_score: 8,
        vaccination_schedule: ['PPR', 'Anthrax', 'Enterotoxemia'],
        common_diseases: ['PPR', 'Pneumonia', 'Internal parasites'],
        stress_indicators: ['reduced browsing', 'huddling', 'bleating']
      }
    },
    'West African Dwarf': {
      eating_habits: {
        daily_intake_kg: 2.5,
        feeding_frequency: 5,
        preferred_feed_type: ['leaves', 'fruits', 'kitchen scraps'],
        water_consumption_liters: 6,
        grazing_hours: 6
      },
      reproduction: {
        gestation_period_days: 148,
        breeding_age_months: 7,
        conception_rate_percent: 95,
        offspring_per_birth: 2.5,
        calving_interval_months: 7
      },
      mortality: {
        infant_mortality_percent: 20,
        adult_mortality_percent: 10,
        common_causes: ['disease', 'poor management', 'accidents'],
        seasonal_risks: ['wet season diseases', 'nutritional stress']
      },
      physical: {
        average_weight_kg: 22,
        daily_weight_gain_kg: 0.08,
        milk_production_liters: 0.8,
        meat_quality_score: 9.0,
        fat_percentage: 6
      },
      health: {
        drug_responsiveness_score: 9,
        vaccination_schedule: ['PPR', 'Enterotoxemia', 'Tetanus'],
        common_diseases: ['Worm infestation', 'Skin diseases'],
        stress_indicators: ['loss of appetite', 'diarrhea', 'weakness']
      }
    }
  },
  sheep: {
    'Yankasa': {
      eating_habits: {
        daily_intake_kg: 4,
        feeding_frequency: 3,
        preferred_feed_type: ['grass', 'legumes', 'crop residues'],
        water_consumption_liters: 12,
        grazing_hours: 8
      },
      reproduction: {
        gestation_period_days: 145,
        breeding_age_months: 9,
        conception_rate_percent: 85,
        offspring_per_birth: 1.8,
        calving_interval_months: 9
      },
      mortality: {
        infant_mortality_percent: 18,
        adult_mortality_percent: 7,
        common_causes: ['disease', 'predation', 'poor nutrition'],
        seasonal_risks: ['cold stress', 'parasites', 'feed shortage']
      },
      physical: {
        average_weight_kg: 40,
        daily_weight_gain_kg: 0.15,
        milk_production_liters: 1.2,
        meat_quality_score: 8.5,
        fat_percentage: 10
      },
      health: {
        drug_responsiveness_score: 8,
        vaccination_schedule: ['PPR', 'Enterotoxemia', 'Foot rot'],
        common_diseases: ['PPR', 'Internal parasites', 'Foot problems'],
        stress_indicators: ['isolation', 'reduced grazing', 'labored breathing']
      }
    },
    'Uda': {
      eating_habits: {
        daily_intake_kg: 5,
        feeding_frequency: 3,
        preferred_feed_type: ['grass', 'hay', 'concentrates'],
        water_consumption_liters: 15,
        grazing_hours: 7
      },
      reproduction: {
        gestation_period_days: 147,
        breeding_age_months: 10,
        conception_rate_percent: 80,
        offspring_per_birth: 1.5,
        calving_interval_months: 10
      },
      mortality: {
        infant_mortality_percent: 22,
        adult_mortality_percent: 9,
        common_causes: ['disease', 'management issues', 'genetic factors'],
        seasonal_risks: ['heat stress', 'disease outbreaks', 'feed scarcity']
      },
      physical: {
        average_weight_kg: 55,
        daily_weight_gain_kg: 0.18,
        milk_production_liters: 1.8,
        meat_quality_score: 8.8,
        fat_percentage: 12
      },
      health: {
        drug_responsiveness_score: 7,
        vaccination_schedule: ['PPR', 'Anthrax', 'Enterotoxemia'],
        common_diseases: ['Respiratory infections', 'Digestive disorders'],
        stress_indicators: ['panting', 'loss of condition', 'reduced mobility']
      }
    }
  }
};

export const LIVESTOCK_ISSUES: Record<string, LivestockIssue[]> = {
  feeding: [
    {
      problem: "Poor Feed Quality",
      behavior: ["Reduced feed intake", "Weight loss", "Poor body condition", "Decreased milk production"],
      remedy: [
        "Test feed quality regularly",
        "Store feed in dry, clean conditions", 
        "Supplement with quality concentrates",
        "Provide mineral supplements",
        "Rotate pastures to maintain grass quality"
      ],
      severity: "moderate",
      timeToResolve: "2-4 weeks"
    },
    {
      problem: "Overfeeding",
      behavior: ["Obesity", "Reduced mobility", "Breeding problems", "Metabolic disorders"],
      remedy: [
        "Calculate proper feed portions",
        "Implement controlled feeding schedule",
        "Increase exercise through grazing",
        "Monitor body condition scores",
        "Reduce concentrate feeds gradually"
      ],
      severity: "moderate",
      timeToResolve: "6-8 weeks"
    },
    {
      problem: "Water Scarcity",
      behavior: ["Decreased feed intake", "Dehydration signs", "Reduced milk production", "Stress behavior"],
      remedy: [
        "Ensure 24/7 access to clean water",
        "Install multiple water points",
        "Check water quality regularly",
        "Provide shade near water sources",
        "Monitor daily water consumption"
      ],
      severity: "high",
      timeToResolve: "Immediate"
    }
  ],
  reproduction: [
    {
      problem: "Low Conception Rates",
      behavior: ["Failed breeding attempts", "Irregular estrus cycles", "Poor body condition", "Stress signs"],
      remedy: [
        "Improve nutrition before breeding",
        "Ensure proper body condition (score 3-4)",
        "Use proven breeding males",
        "Time breeding with estrus cycles",
        "Reduce stress factors",
        "Consult veterinarian for breeding soundness"
      ],
      severity: "high",
      timeToResolve: "3-6 months"
    },
    {
      problem: "High Calf/Kid/Lamb Mortality",
      behavior: ["Newborn deaths", "Weak offspring", "Birth complications", "Poor maternal care"],
      remedy: [
        "Ensure adequate prenatal nutrition",
        "Provide clean birthing environment",
        "Monitor births closely",
        "Ensure colostrum intake within 6 hours",
        "Vaccinate breeding females",
        "Implement biosecurity measures"
      ],
      severity: "critical",
      timeToResolve: "Ongoing prevention"
    }
  ],
  health: [
    {
      problem: "Disease Outbreaks",
      behavior: ["Sudden deaths", "Fever", "Loss of appetite", "Unusual behavior", "Respiratory distress"],
      remedy: [
        "Implement vaccination programs",
        "Quarantine new animals",
        "Maintain biosecurity protocols",
        "Provide adequate nutrition",
        "Ensure clean water supply",
        "Regular veterinary check-ups"
      ],
      severity: "critical",
      timeToResolve: "2-4 weeks with treatment"
    },
    {
      problem: "Parasite Infestation",
      behavior: ["Weight loss", "Poor coat condition", "Anemia", "Reduced productivity", "Weakness"],
      remedy: [
        "Regular deworming schedule",
        "Rotate pastures",
        "Monitor fecal egg counts",
        "Improve drainage in housing",
        "Provide adequate nutrition",
        "Use targeted treatments"
      ],
      severity: "moderate",
      timeToResolve: "4-6 weeks"
    }
  ]
};

export const generateMockTrendData = (species: string, breed: string) => {
  const baseData = LIVESTOCK_PERFORMANCE_DATA[species as keyof typeof LIVESTOCK_PERFORMANCE_DATA]?.[breed];
  if (!baseData) return [];

  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Add realistic variations
    const tempVariation = (Math.random() - 0.5) * 2;
    const stressVariation = Math.random() * 0.3;
    
    data.push({
      date: date.toLocaleDateString(),
      milk_production: Number((baseData.physical.milk_production_liters * (0.8 + Math.random() * 0.4)).toFixed(1)),
      weight_gain: Number((baseData.physical.daily_weight_gain_kg * (0.7 + Math.random() * 0.6)).toFixed(2)),
      feed_intake: Number((baseData.eating_habits.daily_intake_kg * (0.85 + Math.random() * 0.3)).toFixed(1)),
      water_consumption: Number((baseData.eating_habits.water_consumption_liters * (0.9 + Math.random() * 0.2)).toFixed(1)),
      body_temperature: Number((38.5 + tempVariation).toFixed(1)),
      stress_level: Number((stressVariation).toFixed(2)),
      mortality_rate: Number((baseData.mortality.adult_mortality_percent * (0.5 + Math.random())).toFixed(1)),
      conception_rate: Number((baseData.reproduction.conception_rate_percent * (0.9 + Math.random() * 0.2)).toFixed(1))
    });
  }
  
  return data;
};
