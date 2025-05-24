
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Settings, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const ApiConfig = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('weatherstack_api_key') || '');
  const [showKey, setShowKey] = useState(false);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }
    localStorage.setItem('weatherstack_api_key', apiKey.trim());
    toast.success("API key saved successfully!");
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Settings className="mr-2 h-5 w-5 text-farm-green" />
          WeatherStack API Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Label htmlFor="api-key">WeatherStack API Key</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                placeholder="Enter your WeatherStack API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Button onClick={handleSaveApiKey} className="bg-farm-green hover:bg-farm-green-dark">
              Save
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Get your free API key from{" "}
            <a href="https://weatherstack.com" target="_blank" rel="noopener noreferrer" className="text-farm-green hover:underline">
              weatherstack.com
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiConfig;
