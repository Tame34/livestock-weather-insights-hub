
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Upload, X, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";

interface DetectionResult {
  bodyPart: string;
  confidence: number;
  disease: string;
  severity: 'mild' | 'moderate' | 'severe';
  recommendations: string[];
}

const DiseaseDetection = () => {
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bodyParts = [
    { value: 'eyes', label: 'Eyes' },
    { value: 'skin', label: 'Skin' },
    { value: 'hooves', label: 'Hooves' }
  ];

  // Mock disease database for demonstration
  const mockDiseases = {
    eyes: [
      { name: 'Pink Eye (Conjunctivitis)', severity: 'mild' as const },
      { name: 'Corneal Ulcer', severity: 'severe' as const },
      { name: 'Cataracts', severity: 'moderate' as const }
    ],
    skin: [
      { name: 'Ringworm', severity: 'mild' as const },
      { name: 'Mange', severity: 'moderate' as const },
      { name: 'Lumpy Skin Disease', severity: 'severe' as const }
    ],
    hooves: [
      { name: 'Foot Rot', severity: 'moderate' as const },
      { name: 'Digital Dermatitis', severity: 'severe' as const },
      { name: 'White Line Disease', severity: 'mild' as const }
    ]
  };

  const getRecommendations = (disease: string, severity: string) => {
    const recommendations = {
      'Pink Eye (Conjunctivitis)': [
        'Isolate affected animal',
        'Apply antibiotic eye ointment',
        'Keep area clean and dry',
        'Consult veterinarian if no improvement in 3-5 days'
      ],
      'Ringworm': [
        'Isolate affected animal',
        'Apply antifungal treatment',
        'Disinfect equipment and housing',
        'Monitor other animals for signs'
      ],
      'Foot Rot': [
        'Trim affected hooves',
        'Apply topical antibiotic',
        'Keep animal in dry environment',
        'Daily foot inspection recommended'
      ]
    };
    
    return recommendations[disease as keyof typeof recommendations] || [
      'Consult with veterinarian immediately',
      'Isolate affected animal',
      'Monitor symptoms closely',
      'Follow prescribed treatment plan'
    ];
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("Image size should be less than 10MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedBodyPart || !uploadedImage) {
      toast.error("Please select body part and upload an image");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call to ML model
    setTimeout(() => {
      const diseases = mockDiseases[selectedBodyPart as keyof typeof mockDiseases];
      const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
      const confidence = Math.random() * (0.95 - 0.65) + 0.65; // Random confidence between 65-95%
      
      const mockResult: DetectionResult = {
        bodyPart: selectedBodyPart,
        confidence: confidence,
        disease: randomDisease.name,
        severity: randomDisease.severity,
        recommendations: getRecommendations(randomDisease.name, randomDisease.severity)
      };
      
      setResult(mockResult);
      setIsAnalyzing(false);
      toast.success("Image analysis completed!");
    }, 3000);
  };

  const clearImage = () => {
    setUploadedImage(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'severe': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'mild': return <CheckCircle2 className="h-4 w-4" />;
      case 'moderate': return <Clock className="h-4 w-4" />;
      case 'severe': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl flex items-center">
          <Camera className="mr-2 h-6 w-6 text-farm-green" />
          Disease Detection (CNN)
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload images to detect diseases in animal eyes, skin, and hooves
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Body Part Selection */}
        <div className="space-y-2">
          <Label htmlFor="bodyPart">Select Body Part</Label>
          <Select value={selectedBodyPart} onValueChange={setSelectedBodyPart}>
            <SelectTrigger id="bodyPart">
              <SelectValue placeholder="Choose body part to analyze" />
            </SelectTrigger>
            <SelectContent>
              {bodyParts.map((part) => (
                <SelectItem key={part.value} value={part.value}>
                  {part.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Upload Image</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            {uploadedImage ? (
              <div className="relative">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded animal" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={clearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="mb-2"
                  >
                    Choose Image
                  </Button>
                  <p className="text-sm text-gray-500">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Analyze Button */}
        <Button 
          onClick={analyzeImage}
          disabled={!selectedBodyPart || !uploadedImage || isAnalyzing}
          className="w-full bg-farm-green hover:bg-farm-green-dark"
        >
          {isAnalyzing ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Image...
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              Analyze for Disease
            </>
          )}
        </Button>

        {/* Results */}
        {result && (
          <div className="mt-6 space-y-4">
            <div className={`p-4 rounded-lg border ${getSeverityColor(result.severity)}`}>
              <div className="flex items-center mb-2">
                {getSeverityIcon(result.severity)}
                <h3 className="ml-2 font-semibold">Detection Result</h3>
              </div>
              
              <div className="space-y-2">
                <p><span className="font-medium">Disease:</span> {result.disease}</p>
                <p><span className="font-medium">Confidence:</span> {(result.confidence * 100).toFixed(1)}%</p>
                <p><span className="font-medium">Severity:</span> {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)}</p>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-blue-600" />
                Recommended Actions
              </h4>
              <ul className="space-y-2">
                {result.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-farm-green rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-sm">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> This is an AI-assisted diagnosis tool. Always consult with a qualified veterinarian for proper treatment and confirmation.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiseaseDetection;
