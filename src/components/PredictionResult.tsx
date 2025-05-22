
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLivestock } from "@/contexts/LivestockContext";
import { ADVICE, HEAT_STRESS_SIGNS } from "@/data/mockData";
import StressLevelBar from "./StressLevelBar";
import { AlertTriangle, ArrowRight, Download, ThermometerSun, CircleDashed, FileJson } from "lucide-react";
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

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-muted p-4 rounded-lg text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Body Temperature</h4>
            <p className="text-2xl font-bold">{prediction.Body_Temperature_C.toFixed(1)}°C</p>
          </div>
          
          <div className="bg-muted p-4 rounded-lg text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Respiration Rate</h4>
            <p className="text-2xl font-bold">{prediction.Respiration_Rate_bpm.toFixed(0)} bpm</p>
          </div>
          
          <div className="bg-muted p-4 rounded-lg text-center">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Cooling Efficacy</h4>
            <p className="text-2xl font-bold">{prediction.Cooling_Effect.toFixed(0)}%</p>
          </div>
        </div>

        {prediction.stress_level > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
            <h3 className="font-medium flex items-center text-amber-800">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
              Watch for these symptoms:
            </h3>
            <ul className="list-disc pl-6 space-y-1 text-sm text-amber-800">
              {stressSymptoms.slice(0, 4).map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-farm-green-light/20 border border-farm-green/30 rounded-lg p-4 space-y-2">
          <h3 className="font-medium flex items-center text-farm-green-dark">
            <CircleDashed className="h-5 w-5 mr-2 text-farm-green" />
            Recommended Actions:
          </h3>
          <p className="text-farm-green-dark">{advice}</p>
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
