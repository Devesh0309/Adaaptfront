import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { cn } from './ui/utils';
import { 
  MoreHorizontal, 
  BookmarkPlus, 
  BarChart3,
  Download,
  Share,
  Maximize2
} from 'lucide-react';

export type ChartType = 'bar' | 'line' | 'pie' | 'area';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  type: ChartType;
  data?: any;
  showLegend?: boolean;
  filters?: Array<{ label: string; value: string; active?: boolean }>;
  onSave?: () => void;
  onViewAll?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  className?: string;
  children?: React.ReactNode;
}

// Mock chart components - in a real app, these would be proper chart implementations
const MockBarChart = ({ className }: { className?: string }) => (
  <div className={cn("h-64 bg-muted rounded-lg flex items-end justify-center gap-2 p-4", className)}>
    {[40, 70, 45, 85, 60, 95, 55].map((height, i) => (
      <div
        key={i}
        className="bg-chart-1 rounded-t"
        style={{ 
          height: `${height}%`, 
          width: '12%',
          backgroundColor: `var(--chart-${(i % 8) + 1})`
        }}
      />
    ))}
  </div>
);

const MockLineChart = ({ className }: { className?: string }) => (
  <div className={cn("h-64 bg-muted rounded-lg relative overflow-hidden", className)}>
    <svg className="w-full h-full" viewBox="0 0 400 200">
      <polyline
        fill="none"
        stroke="var(--chart-1)"
        strokeWidth="3"
        points="20,150 60,120 100,80 140,100 180,60 220,40 260,70 300,30 340,50 380,20"
        className="drop-shadow-sm"
      />
      <polyline
        fill="none"
        stroke="var(--chart-2)"
        strokeWidth="3"
        points="20,180 60,160 100,140 140,120 180,100 220,85 260,95 300,75 340,85 380,65"
        className="drop-shadow-sm"
      />
    </svg>
  </div>
);

const MockPieChart = ({ className }: { className?: string }) => (
  <div className={cn("h-64 bg-muted rounded-lg flex items-center justify-center", className)}>
    <svg className="w-40 h-40" viewBox="0 0 42 42">
      <circle
        cx="21"
        cy="21"
        r="15.915"
        fill="transparent"
        stroke="var(--chart-1)"
        strokeWidth="3"
        strokeDasharray="40 60"
        strokeDashoffset="25"
      />
      <circle
        cx="21"
        cy="21"
        r="15.915"
        fill="transparent"
        stroke="var(--chart-2)"
        strokeWidth="3"
        strokeDasharray="25 75"
        strokeDashoffset="-15"
      />
      <circle
        cx="21"
        cy="21"
        r="15.915"
        fill="transparent"
        stroke="var(--chart-3)"
        strokeWidth="3"
        strokeDasharray="20 80"
        strokeDashoffset="-40"
      />
    </svg>
  </div>
);

const chartComponents = {
  bar: MockBarChart,
  line: MockLineChart,
  pie: MockPieChart,
  area: MockLineChart // Using line chart as area placeholder
};

export function ChartCard({
  title,
  subtitle,
  type,
  showLegend = false,
  filters = [],
  onSave,
  onViewAll,
  onShare,
  onDownload,
  className,
  children
}: ChartCardProps) {
  const ChartComponent = chartComponents[type];

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            {subtitle && (
              <p className="text-sm text-text-secondary">{subtitle}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Filters */}
            {filters.length > 0 && (
              <div className="flex gap-1">
                {filters.map((filter, index) => (
                  <Badge
                    key={index}
                    variant={filter.active ? "default" : "outline"}
                    className="text-xs cursor-pointer hover:bg-brand-primary hover:text-white transition-colors"
                  >
                    {filter.label}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Actions menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2 focus-ring">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onShare}>
                  <Share className="w-4 h-4 mr-2" />
                  Share chart
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Full screen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        {children || <ChartComponent />}
        
        {/* Legend */}
        {showLegend && (
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border-subtle">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--chart-1)' }} />
              <span className="text-sm text-text-secondary">Current Period</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--chart-2)' }} />
              <span className="text-sm text-text-secondary">Previous Period</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--chart-3)' }} />
              <span className="text-sm text-text-secondary">Target</span>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onSave}
          className="gap-2 focus-ring"
        >
          <BookmarkPlus className="w-4 h-4" />
          Save to dashboard
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onViewAll}
          className="gap-2 focus-ring"
        >
          <BarChart3 className="w-4 h-4" />
          View all charts
        </Button>
      </CardFooter>
    </Card>
  );
}