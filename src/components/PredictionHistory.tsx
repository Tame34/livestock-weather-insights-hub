
import { useLivestock } from "@/contexts/LivestockContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportToCSV } from "@/utils/exportUtils";
import { SEVERITY_LABELS } from "@/data/mockData";

const PredictionHistory = () => {
  const { predictionHistory } = useLivestock();
  
  const handleExportCSV = () => {
    if (predictionHistory.length > 0) {
      exportToCSV(predictionHistory);
    }
  };
  
  if (predictionHistory.length === 0) {
    return null;
  }
  
  return (
    <Card className="w-full mt-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl flex items-center">
              <Clock className="mr-2 h-5 w-5 text-farm-green" />
              Prediction History
            </CardTitle>
            <CardDescription>
              Recent heat stress predictions for your livestock
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="flex items-center">
            <Download className="h-4 w-4 mr-1" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Animal</TableHead>
                <TableHead>Temp (°C)</TableHead>
                <TableHead>Humidity</TableHead>
                <TableHead>Stress Level</TableHead>
                <TableHead>Body Temp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {predictionHistory.slice(0, 5).map((record, index) => {
                const stressLevelColors = [
                  "text-stress-normal", 
                  "text-stress-mild", 
                  "text-stress-moderate", 
                  "text-stress-severe"
                ];
                
                return (
                  <TableRow key={index}>
                    <TableCell>
                      {new Date(record.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell className="capitalize">{record.animalInfo.species}</TableCell>
                    <TableCell>{record.conditions.temperature}°C</TableCell>
                    <TableCell>{record.conditions.humidity}%</TableCell>
                    <TableCell className={`font-medium ${stressLevelColors[record.prediction.stress_level]}`}>
                      {SEVERITY_LABELS[record.prediction.stress_level]}
                    </TableCell>
                    <TableCell>{record.prediction.Body_Temperature_C.toFixed(1)}°C</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionHistory;
