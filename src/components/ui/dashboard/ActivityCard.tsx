import React from "react";

interface ActivityItem {
  icon?: React.ElementType;
  title: string;
  time: string;
  description: string;
}

interface ActivityCardProps {
  items: ActivityItem[];
}

const ActivityCard: React.FC<ActivityCardProps> = ({ items }) => {
  return (
    <div className="glass-card rounded-xl p-6 hover-lift card-transition">
      <h3 className="text-lg font-medium mb-4">Recent Activity</h3>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
          >
            {item.icon && (
              <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className="font-medium truncate">{item.title}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                  {item.time}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-center text-muted-foreground py-4">
          No recent activity
        </p>
      )}
    </div>
  );
};

export default ActivityCard;
