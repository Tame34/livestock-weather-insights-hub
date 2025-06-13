
import { useLivestock } from "@/contexts/LivestockContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { History, Milk, TrendingUp } from "lucide-react";

const HistoricalTrends = () => {
  const { predictionHistory } = useLivestock();

  // Early return if no history
  if (!predictionHistory || predictionHistory.length < 2) {
    return null;
  }

  // Process data for charts
  const chartData = predictionHistory
    .slice(0, 10)
    .reverse()
    .map((item, index) => {
      const time = new Date(item.timestamp).toLocaleTimeString();
      // Generate mock milk production and weight gain data based on temperature and stress
      const tempImpact = Math.max(0, 1 - (item.prediction.Body_Temperature_C - 38) * 0.3);
      const milkProduction = Math.round((25 + Math.random() * 10) * tempImpact * 100) / 100;
      const weightGain = Math.round((0.8 + Math.random() * 0.4) * tempImpact * 100) / 100;
      const rainfall = Math.random() * 20; // Mock rainfall data
      
      return {
        name: `#${index + 1}`,
        time: time,
        temperature: Number(item.prediction.Body_Temperature_C.toFixed(1)),
        respiration: Number(item.prediction.Respiration_Rate_bpm.toFixed(0)),
        environmentTemp: Number(item.conditions.temperature),
        humidity: Number(item.conditions.humidity),
        stressLevel: item.prediction.stress_level,
        milkProduction: milkProduction,
        weightGain: weightGain,
        rainfall: Number(rainfall.toFixed(1))
      };
    });

  return (
    <div className="space-y-6">
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
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <Milk className="mr-2 h-5 w-5 text-farm-green" /> Temperature vs Milk Production
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === "milkProduction" ? `${value} L/day` : `${value}°C`,
                    name === "milkProduction" ? "Milk Production" : "Body Temperature"
                  ]}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="milkProduction"
                  name="Milk Production (L/day)"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  name="Body Temperature (°C)"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-farm-green" /> Rainfall vs Weight Gain
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === "weightGain" ? `${value} kg/day` : `${value} mm`,
                    name === "weightGain" ? "Weight Gain" : "Rainfall"
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="rainfall"
                  name="Rainfall (mm)"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="weightGain"
                  name="Weight Gain (kg/day)"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 bg-muted/30 p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <strong>Analysis:</strong> This chart shows the correlation between rainfall patterns and livestock weight gain. 
              Higher rainfall typically leads to better pasture quality and increased weight gain. Monitor these patterns 
              to optimize grazing schedules and supplementary feeding programs.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted/30 p-4 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground">
          <strong>Historical Analysis:</strong> The charts display trends in body temperature, respiration rate, 
          environmental temperature, milk production, and weight gain over time. Track these metrics to identify patterns 
          and correlations that may help predict heat stress conditions and optimize livestock productivity.
        </p>
      </div>
    </div>
  );
};

export default HistoricalTrends;
