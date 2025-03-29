import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number; // optional: percentage up/down
  description?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
}: StatsCardProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <div className="rounded-full bg-muted p-2">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <div className="text-xs text-muted-foreground">{description}</div>
          )}
        </div>

        {typeof trend === "number" && (
          <div
            className={`text-sm font-medium ${
              trend > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}
