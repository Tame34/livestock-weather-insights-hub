
import { useLivestock } from "@/contexts/LivestockContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LIVESTOCK_PERFORMANCE_DATA, LIVESTOCK_ISSUES, LivestockIssue } from "@/data/livestockManagementData";
import { Heart, Utensils, Baby, AlertTriangle, Activity, Droplets } from "lucide-react";

const LivestockManagement = () => {
  const { animalInfo } = useLivestock();
  
  if (!animalInfo.species || !animalInfo.breed) {
    return null;
  }

  const animalData = LIVESTOCK_PERFORMANCE_DATA[animalInfo.species as keyof typeof LIVESTOCK_PERFORMANCE_DATA]?.[animalInfo.breed];
  
  if (!animalData) {
    return null;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const IssueCard = ({ title, issues, icon: Icon }: { title: string, issues: LivestockIssue[], icon: any }) => (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Icon className="mr-2 h-5 w-5 text-farm-green" />
          {title} Issues & Solutions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {issues.map((issue, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{issue.problem}</h4>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getSeverityColor(issue.severity)} text-xs`}>
                    {issue.severity.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-gray-500">{issue.timeToResolve}</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-sm text-gray-700 mb-2">⚠️ Warning Signs:</h5>
                  <ul className="text-sm space-y-1">
                    {issue.behavior.map((behavior, i) => (
                      <li key={i} className="text-gray-600">• {behavior}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-sm text-gray-700 mb-2">✅ Farmer Actions:</h5>
                  <ul className="text-sm space-y-1">
                    {issue.remedy.map((remedy, i) => (
                      <li key={i} className="text-gray-600">• {remedy}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 mt-6">
      {/* Performance Metrics Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <Activity className="mr-2 h-6 w-6 text-farm-green" />
            {animalInfo.breed} {animalInfo.species} - Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Eating Habits */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Utensils className="mr-2 h-4 w-4" />
                Feeding Requirements
              </h3>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Daily Intake</TableCell>
                    <TableCell>{animalData.eating_habits.daily_intake_kg} kg</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Water Needed</TableCell>
                    <TableCell>{animalData.eating_habits.water_consumption_liters} L</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Feeding Times</TableCell>
                    <TableCell>{animalData.eating_habits.feeding_frequency}x daily</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Grazing Hours</TableCell>
                    <TableCell>{animalData.eating_habits.grazing_hours} hrs</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Reproduction */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Baby className="mr-2 h-4 w-4" />
                Reproduction Data
              </h3>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Breeding Age</TableCell>
                    <TableCell>{animalData.reproduction.breeding_age_months} months</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Gestation</TableCell>
                    <TableCell>{animalData.reproduction.gestation_period_days} days</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Conception Rate</TableCell>
                    <TableCell>{animalData.reproduction.conception_rate_percent}%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Offspring/Birth</TableCell>
                    <TableCell>{animalData.reproduction.offspring_per_birth}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Physical Performance */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Heart className="mr-2 h-4 w-4" />
                Physical Performance
              </h3>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Average Weight</TableCell>
                    <TableCell>{animalData.physical.average_weight_kg} kg</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Daily Gain</TableCell>
                    <TableCell>{animalData.physical.daily_weight_gain_kg} kg</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Milk Production</TableCell>
                    <TableCell>{animalData.physical.milk_production_liters} L/day</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Meat Quality</TableCell>
                    <TableCell>{animalData.physical.meat_quality_score}/10</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Health & Mortality */}
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Health Indicators</h3>
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-sm"><strong>Drug Responsiveness:</strong> {animalData.health.drug_responsiveness_score}/10</p>
                <p className="text-sm mt-2"><strong>Common Diseases:</strong> {animalData.health.common_diseases.join(', ')}</p>
                <p className="text-sm mt-2"><strong>Stress Signs:</strong> {animalData.health.stress_indicators.join(', ')}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Mortality Risks</h3>
              <div className="bg-muted/30 p-3 rounded-lg">
                <p className="text-sm"><strong>Infant Mortality:</strong> {animalData.mortality.infant_mortality_percent}%</p>
                <p className="text-sm mt-2"><strong>Adult Mortality:</strong> {animalData.mortality.adult_mortality_percent}%</p>
                <p className="text-sm mt-2"><strong>Main Causes:</strong> {animalData.mortality.common_causes.join(', ')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problem-Behavior-Remedy Cards */}
      <IssueCard title="Feeding & Nutrition" issues={LIVESTOCK_ISSUES.feeding} icon={Utensils} />
      <IssueCard title="Reproduction" issues={LIVESTOCK_ISSUES.reproduction} icon={Baby} />
      <IssueCard title="Health & Disease" issues={LIVESTOCK_ISSUES.health} icon={AlertTriangle} />

      {/* Farmer Action Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <Droplets className="mr-2 h-6 w-6 text-farm-green" />
            Quick Action Guide for Farmers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">Daily Monitoring</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Check feed and water availability</li>
                <li>• Observe animal behavior</li>
                <li>• Monitor body condition</li>
                <li>• Record any unusual signs</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Weekly Tasks</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Weight monitoring</li>
                <li>• Health assessments</li>
                <li>• Pasture rotation</li>
                <li>• Equipment maintenance</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-2">Monthly Planning</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Vaccination schedules</li>
                <li>• Breeding programs</li>
                <li>• Feed quality testing</li>
                <li>• Financial review</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LivestockManagement;
