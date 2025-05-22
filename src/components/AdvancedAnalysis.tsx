
import { useLivestock } from "@/contexts/LivestockContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleDashed, AlertTriangle, LineChart, BarChart2 } from "lucide-react";
import StressLevelBar from "./StressLevelBar";
import { SEVERITY_LABELS } from "@/data/mockData";

// Calculate THI (Temperature-Humidity Index)
const calculateTHI = (temperature: number, humidity: number) => {
  // THI = (1.8 × T + 32) - (0.55 - 0.0055 × RH) × [(1.8 × T + 32) - 58]
  // where T = temperature (°C), RH = relative humidity (%)
  const tempF = 1.8 * temperature + 32;
  const thi = tempF - (0.55 - 0.0055 * humidity) * (tempF - 58);
  return Math.round(thi * 10) / 10;
};

// Calculate HLI (Heat Load Index)
const calculateHLI = (temperature: number, humidity: number, windSpeed: number) => {
  // Simplified version of HLI = 8.62 + (0.38 × RH) + (1.55 × Tbg) - (0.5 × WS) + e^(2.4 - WS)
  // where RH = relative humidity (%), Tbg = black globe temperature (°C), WS = wind speed (m/s)
  // Using air temperature as approximation for black globe temperature
  const hli = 8.62 + (0.38 * humidity) + (1.55 * temperature) - (0.5 * windSpeed) + Math.exp(2.4 - windSpeed);
  return Math.round(hli * 10) / 10;
};

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
              <LineChart className="h-4 w-4 mr-2" />
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

export default AdvancedAnalysis;
