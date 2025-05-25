
import { LivestockProvider, useLivestock } from "@/contexts/LivestockContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import AnimalSelector from "@/components/AnimalSelector";
import EnvironmentalConditionsForm from "@/components/EnvironmentalConditionsForm";
import WeatherCard from "@/components/WeatherCard";
import PredictionResult from "@/components/PredictionResult";
import PredictionHistory from "@/components/PredictionHistory";
import HistoricalTrends from "@/components/HistoricalTrends";
import AdvancedAnalysis from "@/components/AdvancedAnalysis";
import { callFlaskModel } from "@/data/mockData";
import { Beef, BarChart } from "lucide-react";

const LivestockApp = () => {
  const { 
    animalInfo, 
    environmentalConditions, 
    prediction, 
    setPrediction,
    addToPredictionHistory,
    isLoading, 
    setIsLoading 
  } = useLivestock();

  const handlePredict = async () => {
    console.log("Starting prediction with:", { animalInfo, environmentalConditions });
    
    // Validate input values
    if (!animalInfo.species || !animalInfo.breed || !animalInfo.age) {
      toast.error("Please select animal type, breed and age group");
      return;
    }

    setIsLoading(true);
    
    try {
      // Use TypeScript prediction logic
      const result = await callFlaskModel(
        animalInfo.species,
        animalInfo.breed,
        animalInfo.age,
        environmentalConditions
      );
      
      console.log("Prediction result:", result);
      
      // Set prediction result
      setPrediction(result);
      
      // Add to history
      addToPredictionHistory(result);
      
      toast.success("Prediction completed successfully!");
    } catch (error) {
      console.error("Error generating prediction:", error);
      toast.error("Error generating prediction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 text-farm-green-dark flex items-center justify-center">
          <Beef className="h-10 w-10 mr-3 text-farm-green" />
          Livestock Weather Insights Hub
        </h1>
        <p className="text-xl text-gray-600">
          Predict and prevent heat stress in your livestock with weather-based analytics
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <WeatherCard />

          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl flex items-center">
                <Beef className="mr-2 h-6 w-6 text-farm-green" /> Animal Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimalSelector />
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl flex items-center">
                <BarChart className="mr-2 h-6 w-6 text-farm-green" /> Heat Stress Predictor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnvironmentalConditionsForm />
              
              <div className="mt-8 flex justify-center">
                <Button 
                  onClick={handlePredict}
                  disabled={isLoading}
                  className="w-full md:w-auto bg-farm-green hover:bg-farm-green-dark"
                  size="lg"
                >
                  {isLoading ? "Calculating..." : "Predict Heat Stress"}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {prediction && <PredictionResult />}
          
          {prediction && <AdvancedAnalysis />}
          
          <HistoricalTrends />
          
          <PredictionHistory />
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <LivestockProvider>
      <LivestockApp />
    </LivestockProvider>
  );
};

export default Index;
