
import { useLivestock } from "@/contexts/LivestockContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from "recharts";
import { History, Milk, TrendingUp, Utensils, Heart } from "lucide-react";
import { generateMockTrendData } from "@/data/livestockManagementData";

const HistoricalTrends = () => {
  const { predictionHistory, animalInfo } = useLivestock();

  // Generate mock trend data based on selected animal
  const trendData = generateMockTrendData(animalInfo.species, animalInfo.breed);

  // Process prediction history for charts
  const chartData = predictionHistory
    .slice(0, 10)
    .reverse()
    .map((item, index) => {
      const time = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`${label} - ${data.time || data.date}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}${entry.name.includes('Temperature') ? '°C' : 
                entry.name.includes('Rate') ? ' bpm' : 
                entry.name.includes('Production') ? ' L' : 
                entry.name.includes('Gain') ? ' kg' : 
                entry.name.includes('Intake') ? ' kg' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!animalInfo.species || !animalInfo.breed) {
    return (
      <Card className="w-full mt-6">
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Please select an animal type and breed to view historical trends.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Heat Stress Trends - Only show if we have prediction history */}
      {predictionHistory && predictionHistory.length >= 2 && (
        <Card className="w-full mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center">
              <History className="mr-2 h-5 w-5 text-farm-green" />
              Heat Stress Monitoring Trends
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Recent predictions showing body temperature, respiration, and environmental conditions
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={12}
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis fontSize={12} tick={{ fill: '#6b7280' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    name="Body Temperature"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#ef4444' }}
                    activeDot={{ r: 6, fill: '#ef4444' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="respiration"
                    name="Respiration Rate"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#3b82f6' }}
                    activeDot={{ r: 6, fill: '#3b82f6' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="environmentTemp"
                    name="Environment Temp"
                    stroke="#f97316"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3, fill: '#f97316' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Trends - 30 days */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <Milk className="mr-2 h-5 w-5 text-farm-green" />
            Production Performance - Last 30 Days
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Daily milk production and weight gain trends for {animalInfo.breed} {animalInfo.species}
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis fontSize={12} tick={{ fill: '#6b7280' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="milk_production"
                  name="Milk Production"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.4}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="weight_gain"
                  name="Weight Gain"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <strong>Farmer Insight:</strong> Monitor production trends to identify optimal feeding and management practices. 
              Consistent milk production and steady weight gain indicate healthy livestock.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Feed and Water Consumption */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <Utensils className="mr-2 h-5 w-5 text-farm-green" />
            Feed & Water Consumption Patterns
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Daily consumption patterns to optimize feeding schedules
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis fontSize={12} tick={{ fill: '#6b7280' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="feed_intake" 
                  name="Feed Intake" 
                  fill="#f59e0b" 
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="water_consumption" 
                  name="Water Consumption" 
                  fill="#06b6d4" 
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Management Tip:</strong> Consistent feed intake indicates good health. Sudden drops may signal illness or poor feed quality. 
              Ensure water consumption is 3-4 times feed intake for optimal health.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Health Metrics */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <Heart className="mr-2 h-5 w-5 text-farm-green" />
            Health & Stress Indicators
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Body temperature and stress level monitoring over time
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  fontSize={10}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis fontSize={12} tick={{ fill: '#6b7280' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="body_temperature"
                  name="Body Temperature"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#ef4444' }}
                />
                <Line
                  type="monotone"
                  dataKey="stress_level"
                  name="Stress Level"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#f59e0b' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 bg-orange-50 p-4 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-800">
              <strong>Health Alert:</strong> Normal body temperature should be 38.0-39.5°C. Temperatures above 40°C indicate fever or heat stress. 
              Monitor stress levels and take immediate action when they exceed normal ranges.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-farm-green/10 to-blue-50 p-6 rounded-lg border">
        <h3 className="font-semibold text-lg mb-3 text-gray-800">Data-Driven Farming Insights</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Key Performance Indicators:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Consistent milk production = Healthy animals</li>
              <li>• Steady weight gain = Proper nutrition</li>
              <li>• Normal body temperature = Good health</li>
              <li>• Regular feed intake = Content livestock</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Action Items for Farmers:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Monitor trends daily for early problem detection</li>
              <li>• Adjust feeding based on consumption patterns</li>
              <li>• Investigate sudden changes immediately</li>
              <li>• Use data to optimize breeding and management</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoricalTrends;
