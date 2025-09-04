import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from './ui/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  Pin,
  MoreHorizontal,
  Minus
} from 'lucide-react';

export type DeltaDirection = 'up' | 'down' | 'neutral';
export type Timeframe = 'WoW' | 'MoM' | 'YoY' | 'QoQ';

interface KPICardProps {
  title: string;
  value: string | number;
  delta?: {
    value: number;
    direction: DeltaDirection;
    timeframe: Timeframe;
  };
  format?: 'currency' | 'percentage' | 'number';
  subtitle?: string;
  isPinned?: boolean;
  onPin?: () => void;
  onClick?: () => void;
  className?: string;
  size?: 'default' | 'compact';
}

export function KPICard({
  title,
  value,
  delta,
  format = 'number',
  subtitle,
  isPinned = false,
  onPin,
  onClick,
  className,
  size = 'default'
}: KPICardProps) {
  const formatValue = (val: string | number) => {
    const numValue = typeof val === 'string' ? parseFloat(val.replace(/[,$%]/g, '')) : val;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(numValue);
      case 'percentage':
        return `${numValue}%`;
      default:
        return new Intl.NumberFormat('en-US').format(numValue);
    }
  };

  const getDeltaColor = (direction: DeltaDirection) => {
    switch (direction) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-danger';
      default:
        return 'text-text-secondary';
    }
  };

  const getDeltaIcon = (direction: DeltaDirection) => {
    switch (direction) {
      case 'up':
        return TrendingUp;
      case 'down':
        return TrendingDown;
      default:
        return Minus;
    }
  };

  const cardContent = (
    <Card 
      className={cn(
        "relative transition-all duration-200 hover:shadow-md cursor-pointer group",
        "hover:border-brand-primary",
        size === 'compact' && "p-4",
        className
      )}
      onClick={onClick}
    >
      {size === 'default' && (
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
              {subtitle && (
                <p className="text-xs text-text-secondary">{subtitle}</p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onPin?.();
              }}
              className={cn(
                "p-1 opacity-0 group-hover:opacity-100 transition-opacity focus-ring",
                isPinned && "opacity-100"
              )}
            >
              <Pin 
                className={cn(
                  "w-4 h-4",
                  isPinned ? "text-brand-primary fill-current" : "text-text-secondary"
                )} 
              />
            </Button>
          </div>
        </CardHeader>
      )}

      <CardContent className={size === 'compact' ? "p-0" : "pt-0"}>
        {size === 'compact' && (
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xs font-medium text-text-secondary">{title}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onPin?.();
              }}
              className={cn(
                "p-1 opacity-0 group-hover:opacity-100 transition-opacity focus-ring",
                isPinned && "opacity-100"
              )}
            >
              <Pin 
                className={cn(
                  "w-3 h-3",
                  isPinned ? "text-brand-primary fill-current" : "text-text-secondary"
                )} 
              />
            </Button>
          </div>
        )}
        
        <div className="space-y-1">
          <div className={cn(
            "font-semibold text-text-primary",
            size === 'compact' ? "text-lg" : "text-2xl"
          )}>
            {formatValue(value)}
          </div>
          
          {delta && (
            <div className="flex items-center gap-1">
              {(() => {
                const Icon = getDeltaIcon(delta.direction);
                return (
                  <Icon 
                    className={cn(
                      "w-3 h-3",
                      getDeltaColor(delta.direction)
                    )} 
                  />
                );
              })()}
              <span 
                className={cn(
                  "text-xs font-medium",
                  getDeltaColor(delta.direction)
                )}
              >
                {Math.abs(delta.value)}%
              </span>
              <span className="text-xs text-text-secondary">
                {delta.timeframe}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return cardContent;
}

interface KPIGridProps {
  kpis: Array<{
    id: string;
    title: string;
    value: string | number;
    delta?: {
      value: number;
      direction: DeltaDirection;
      timeframe: Timeframe;
    };
    format?: 'currency' | 'percentage' | 'number';
    subtitle?: string;
    isPinned?: boolean;
  }>;
  onKPIClick?: (kpiId: string) => void;
  onKPIPin?: (kpiId: string) => void;
  className?: string;
  columns?: number;
}

export function KPIGrid({ 
  kpis, 
  onKPIClick, 
  onKPIPin, 
  className,
  columns = 3 
}: KPIGridProps) {
  return (
    <div 
      className={cn(
        "grid gap-4",
        columns === 2 && "grid-cols-1 md:grid-cols-2",
        columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {kpis.map((kpi) => (
        <KPICard
          key={kpi.id}
          title={kpi.title}
          value={kpi.value}
          delta={kpi.delta}
          format={kpi.format}
          subtitle={kpi.subtitle}
          isPinned={kpi.isPinned}
          onClick={() => onKPIClick?.(kpi.id)}
          onPin={() => onKPIPin?.(kpi.id)}
        />
      ))}
    </div>
  );
}