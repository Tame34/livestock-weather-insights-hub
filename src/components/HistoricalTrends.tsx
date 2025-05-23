
import { useLivestock } from "@/contexts/LivestockContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { History } from "lucide-react";

const HistoricalTrends = () => {
  const { predictionHistory } = useLivestock();

  // Early return if no history
  if (!predictionHistory || predictionHistory.length < 2) {
    return null;
  }

  // Process data for chart
  const chartData = predictionHistory
    .slice(0, 10)
    .reverse()
    .map((item, index) => {
      const time = new Date(item.timestamp).toLocaleTimeString();
      return {
        name: `#${index + 1}`,
        time: time,
        temperature: Number(item.prediction.Body_Temperature_C.toFixed(1)),
        respiration: Number(item.prediction.Respiration_Rate_bpm.toFixed(0)),
        environmentTemp: Number(item.conditions.temperature),
        humidity: Number(item.conditions.humidity),
        stressLevel: item.prediction.stress_level,
      };
    });

  return (
    <Card className="w-full mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl flex items-center">
          <History className="mr-2 h-6 w-6 text-farm-green" /> Historical Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={60}
                fontSize={12}
              />
              <YAxis fontSize={12} />
              <Tooltip 
                formatter={(value, name) => [value, name]}
                labelFormatter={(label) => {
                  const item = chartData.find(d => d.name === label);
                  return item ? `${label} at ${item.time}` : label;
                }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="temperature"
                name="Body Temperature (°C)"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="respiration"
                name="Respiration Rate (bpm)"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="environmentTemp"
                name="Environment Temp (°C)"
                stroke="#f97316"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 bg-muted/30 p-4 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            <strong>Analysis:</strong> The chart displays trends in body temperature, respiration rate, 
            and environmental temperature over time. Track these metrics to identify patterns 
            and correlations that may help predict heat stress conditions before they become critical.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalTrends;
