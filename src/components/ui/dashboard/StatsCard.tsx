import React from "react";
import { LucideIcon } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: number; 
  description?: string;
  className?: string;
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  description,
  className = "",
}) => {
  const trendColor =
    (trend ?? 0) > 0
      ? "text-green-500"
      : (trend ?? 0) < 0
      ? "text-red-500"
      : "text-muted-foreground";
  const trendIcon = (trend ?? 0) > 0 ? "↑" : (trend ?? 0) < 0 ? "↓" : "";

  return (
    <div
      className={`glass-card rounded-xl p-6 hover-lift card-transition ${className}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-semibold">{value}</p>
            {trend !== undefined && (
              <span className={`text-sm ${trendColor} flex items-center`}>
                {trendIcon} {Math.abs(trend)}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {Icon && (
          <div className="rounded-full bg-primary/10 p-2">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
