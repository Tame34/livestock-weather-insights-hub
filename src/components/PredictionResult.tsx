
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLivestock } from "@/contexts/LivestockContext";
import { ADVICE, HEAT_STRESS_SIGNS } from "@/data/mockData";
import StressLevelBar from "./StressLevelBar";
import { AlertTriangle, ArrowRight, Download, ThermometerSun, CircleDashed, FileJson, Droplets, Wheat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportToCSV, exportToJSON } from "@/utils/exportUtils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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

  // Enhanced recommendations based on stress level
  const getRecommendations = (stressLevel: number, species: string) => {
    const baseRecommendations = {
      0: [
        "Continue regular monitoring schedules",
        "Maintain adequate water supply",
        "Ensure proper ventilation in shelters",
        "Monitor feed intake regularly"
      ],
      1: [
        "Increase water availability by 20-30%",
        "Provide additional shade structures",
        "Reduce handling and movement activities",
        "Monitor animals every 2-3 hours"
      ],
      2: [
        "Implement cooling systems (fans, misters)",
        "Move animals to cooler areas",
        "Increase water access points",
        "Reduce feed during hottest hours"
      ],
      3: [
        "Emergency cooling measures required",
        "Immediate veterinary intervention",
        "Continuous monitoring and care",
        "Isolate severely affected animals"
      ]
    };
    return baseRecommendations[stressLevel as keyof typeof baseRecommendations] || baseRecommendations[0];
  };

  // Feed recommendations based on stress level
  const getFeedRecommendations = (stressLevel: number, species: string) => {
    const feedAdvice = {
      0: "Maintain normal feeding schedule with high-quality forage",
      1: "Reduce concentrate feeds during peak heat hours",
      2: "Feed during cooler morning and evening hours",
      3: "Provide easily digestible feeds with electrolyte supplements"
    };
    return feedAdvice[stressLevel as keyof typeof feedAdvice] || feedAdvice[0];
  };

  // Water management recommendations
  const getWaterRecommendations = (stressLevel: number, species: string) => {
    const waterAdvice = {
      0: `Provide ${species === 'cattle' ? '30-50' : '2-4'} liters per day`,
      1: `Increase to ${species === 'cattle' ? '50-70' : '4-6'} liters per day`,
      2: `Provide ${species === 'cattle' ? '70-100' : '6-8'} liters per day`,
      3: `Unlimited access required - ${species === 'cattle' ? '100+' : '8+'} liters per day`
    };
    return waterAdvice[stressLevel as keyof typeof waterAdvice] || waterAdvice[0];
  };

  const recommendations = getRecommendations(prediction.stress_level, animalInfo.species);
  const feedRecommendation = getFeedRecommendations(prediction.stress_level, animalInfo.species);
  const waterRecommendation = getWaterRecommendations(prediction.stress_level, animalInfo.species);

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

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-muted p-4 rounded-lg text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Body Temperature</h4>
            <p className="text-2xl font-bold">{prediction.Body_Temperature_C.toFixed(1)}°C</p>
          </div>
          
          <div className="bg-muted p-4 rounded-lg text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Respiration Rate</h4>
            <p className="text-2xl font-bold">{prediction.Respiration_Rate_bpm.toFixed(0)} bpm</p>
          </div>
        </div>

        {prediction.stress_level > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-medium flex items-center text-amber-800 mb-3">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              Watch for these symptoms:
            </h3>
            <div className="grid md:grid-cols-2 gap-2">
              {stressSymptoms.map((symptom, index) => (
                <div key={index} className="bg-white/50 p-2 rounded text-sm text-amber-800">
                  {symptom}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-blue-800">
                <Droplets className="h-5 w-5 mr-2" />
                Water Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800">{waterRecommendation}</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center text-green-800">
                <Wheat className="h-5 w-5 mr-2" />
                Feed Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-800">{feedRecommendation}</p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-farm-green-light/20 border border-farm-green/30 rounded-lg p-4">
          <h3 className="font-medium flex items-center text-farm-green-dark mb-3">
            <CircleDashed className="h-5 w-5 mr-2 text-farm-green" />
            Recommended Actions:
          </h3>
          <div className="grid md:grid-cols-2 gap-2">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="bg-white/50 p-2 rounded text-sm text-farm-green-dark">
                • {recommendation}
              </div>
            ))}
          </div>
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

export default PredictionResult;
