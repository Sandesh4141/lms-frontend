
import React from 'react';

interface ProgressCardProps {
  title: string;
  progress: number;
  total: number;
  color?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ title, progress, total, color = 'bg-primary', icon: Icon }) => {
  // Calculate percentage
  const percentage = Math.round((progress / total) * 100);
  
  return (
    <div className="glass-card rounded-xl p-6 hover-lift card-transition">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
      </div>
      
      <div className="flex justify-between items-center mb-2">
        <span className="text-xl font-semibold">{progress}/{total}</span>
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressCard;
