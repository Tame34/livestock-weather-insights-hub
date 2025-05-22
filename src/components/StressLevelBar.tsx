
import { SEVERITY_LABELS } from "../data/mockData";

interface StressLevelBarProps {
  stressLevel: number;
  showLabels?: boolean;
  className?: string;
}

const StressLevelBar = ({ stressLevel, showLabels = true, className = "" }: StressLevelBarProps) => {
  const levels = SEVERITY_LABELS;
  const levelColors = ["bg-stress-normal", "bg-stress-mild", "bg-stress-moderate", "bg-stress-severe"];
  
  // Calculate the percentage filled
  const fillPercentage = ((stressLevel + 1) / levels.length) * 100;
  
  return (
    <div className={`w-full ${className}`}>
      <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${levelColors[stressLevel]} transition-all duration-500 ease-out`}
          style={{ width: `${fillPercentage}%` }}
        />
      </div>
      
      {showLabels && (
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          {levels.map((level, index) => (
            <div 
              key={index} 
              className={`${index === stressLevel ? 'font-bold text-gray-800' : ''}`}
            >
              {level}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StressLevelBar;
