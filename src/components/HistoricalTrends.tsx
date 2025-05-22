
import { useLivestock } from "@/contexts/LivestockContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, History } from "lucide-react";

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
        name: `#${index + 1} (${time})`,
        temperature: item.prediction.Body_Temperature_C,
        respiration: item.prediction.Respiration_Rate_bpm,
        cooling: item.prediction.Cooling_Effect,
        environmentTemp: item.conditions.temperature,
        humidity: item.conditions.humidity,
        stressLevel: item.prediction.stress_level,
      };
    });

  const config = {
    temperature: {
      label: "Body Temperature (°C)",
      theme: {
        light: "#ef4444", // Red
        dark: "#ef4444",
      },
    },
    respiration: {
      label: "Respiration Rate (bpm)",
      theme: {
        light: "#3b82f6", // Blue
        dark: "#3b82f6",
      },
    },
    cooling: {
      label: "Cooling Effect (%)",
      theme: {
        light: "#10b981", // Green
        dark: "#10b981",
      },
    },
    environmentTemp: {
      label: "Environment Temp (°C)",
      theme: {
        light: "#f97316", // Orange
        dark: "#f97316",
      },
    },
  };

  return (
    <Card className="w-full mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl flex items-center">
          <History className="mr-2 h-6 w-6 text-farm-green" /> Historical Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer config={config}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <ChartTooltip>
                <ChartTooltipContent />
              </ChartTooltip>
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="temperature"
                name="Body Temperature"
                stroke="var(--color-temperature)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="respiration"
                name="Respiration Rate"
                stroke="var(--color-respiration)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="cooling"
                name="Cooling Effect"
                stroke="var(--color-cooling)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="environmentTemp"
                name="Environment Temp"
                stroke="var(--color-environmentTemp)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
        
        {predictionHistory.length > 0 && (
          <div className="mt-4 bg-muted/30 p-4 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <strong>Analysis:</strong> The chart displays trends in body temperature, respiration rate, 
              cooling effect, and environmental temperature over time. Track these metrics to identify patterns 
              and correlations that may help predict heat stress conditions before they become critical.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoricalTrends;
