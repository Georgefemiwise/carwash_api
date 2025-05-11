import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div className={cn(
      "card bg-base-100 shadow-md transition-all duration-200 hover:shadow-lg",
      className
    )}>
      <div className="card-body p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="card-title text-base font-medium text-muted-foreground">
              {title}
            </h3>
            <p className="text-2xl font-bold mt-2">{value}</p>
            
            {trend && (
              <div className="flex items-center mt-1">
                <span className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}>
                  {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                </span>
                <span className="text-xs text-muted-foreground ml-1">vs last period</span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className="bg-primary/10 p-3 rounded-full">
              {icon}
            </div>
          )}
        </div>
        
        {description && (
          <p className="text-xs text-muted-foreground mt-4">{description}</p>
        )}
      </div>
    </div>
  );
}