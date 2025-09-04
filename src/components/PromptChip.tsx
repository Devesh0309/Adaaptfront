import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from './ui/utils';
import { 
  TrendingUp, 
  BarChart3, 
  Stethoscope, 
  LineChart, 
  HelpCircle, 
  AlertTriangle,
  Info
} from 'lucide-react';

export type PromptIntent = 'trend' | 'compare' | 'diagnose' | 'forecast' | 'explain' | 'risk';

interface PromptChipProps {
  intent: PromptIntent;
  title: string;  
  subtitle?: string;
  onClick?: () => void;
  hasTooltip?: boolean;
  tooltipContent?: string;
  className?: string;
}

const intentConfig = {
  trend: {
    icon: TrendingUp,
    gradient: 'from-blue-600 to-blue-500',
    label: 'Trend Analysis',
    color: 'var(--chart-1)'
  },
  compare: {
    icon: BarChart3,
    gradient: 'from-green-600 to-green-500',
    label: 'Comparison',
    color: 'var(--chart-2)'
  },
  diagnose: {
    icon: Stethoscope,
    gradient: 'from-yellow-600 to-yellow-500',
    label: 'Diagnostic',
    color: 'var(--chart-3)'
  },
  forecast: {
    icon: LineChart,
    gradient: 'from-red-600 to-red-500',
    label: 'Forecasting',
    color: 'var(--chart-4)'
  },
  explain: {
    icon: HelpCircle,
    gradient: 'from-purple-600 to-purple-500',
    label: 'Explanation',
    color: 'var(--chart-5)'
  },
  risk: {
    icon: AlertTriangle,
    gradient: 'from-red-600 to-red-500',
    label: 'Risk Analysis',
    color: 'var(--danger)'
  }
};

export function PromptChip({ 
  intent, 
  title, 
  subtitle, 
  onClick, 
  hasTooltip = false,
  tooltipContent,
  className 
}: PromptChipProps) {
  const config = intentConfig[intent];
  const Icon = config.icon;

  const chipContent = (
    <Button
      variant="outline"
      className={cn(
        "h-auto p-6 text-left justify-start gap-4 glass-effect transition-smooth group",
        "hover:shadow-md hover:bg-opacity-10",
        className
      )}
      style={{
        borderColor: 'var(--glass-border)',
        backgroundColor: 'var(--glass-fill)'
      }}
      onClick={onClick}
    >
      <div 
        className="p-3 rounded-xl flex-shrink-0 text-white shadow-sm"
        style={{
          background: `linear-gradient(135deg, ${config.color}, ${config.color}80)`,
        }}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div 
          className="font-medium truncate group-hover:text-opacity-90"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </div>
        {subtitle && (
          <div 
            className="leading-relaxed line-clamp-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {hasTooltip && (
        <Info 
          className="w-4 h-4 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" 
          style={{ color: 'var(--text-secondary)' }}
        />
      )}
    </Button>
  );

  if (hasTooltip && tooltipContent) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {chipContent}
          </TooltipTrigger>
          <TooltipContent className="glass-effect rounded-xl shadow-xl max-w-xs">
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return chipContent;
}

interface PromptChipGroupProps {
  title: string;
  chips: Array<{
    intent: PromptIntent;
    title: string;
    subtitle?: string;
    hasTooltip?: boolean;
    tooltipContent?: string;
  }>;
  onChipClick?: (chipTitle: string) => void;
  className?: string;
}

export function PromptChipGroup({ 
  title, 
  chips, 
  onChipClick, 
  className 
}: PromptChipGroupProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-3">
        <h3 
          className="font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </h3>
        <Badge 
          variant="outline" 
          className="text-xs glass-effect"
          style={{
            borderColor: 'var(--glass-border)'
          }}
        >
          {chips.length} {chips.length === 1 ? 'option' : 'options'}
        </Badge>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {chips.map((chip, index) => (
          <PromptChip
            key={index}
            intent={chip.intent}
            title={chip.title}
            subtitle={chip.subtitle}
            hasTooltip={chip.hasTooltip}
            tooltipContent={chip.tooltipContent}
            onClick={() => onChipClick?.(chip.title)}
          />
        ))}
      </div>
    </div>
  );
}

// Default prompt suggestions
export const defaultPromptChips = [
  {
    intent: 'trend' as PromptIntent,
    title: 'Sales performance this quarter',
    subtitle: 'Analyze revenue trends and growth patterns across all channels',
    hasTooltip: true,
    tooltipContent: 'Compares current quarter performance against historical data with predictive insights'
  },
  {
    intent: 'compare' as PromptIntent,
    title: 'Product line comparison',
    subtitle: 'Compare performance across different product categories and segments',
    hasTooltip: true,
    tooltipContent: 'Side-by-side analysis of key metrics by product line with competitive benchmarking'
  },
  {
    intent: 'diagnose' as PromptIntent,
    title: 'Conversion rate drop investigation',
    subtitle: 'Identify factors affecting conversion rates and customer journey',
    hasTooltip: true,
    tooltipContent: 'Root cause analysis for declining conversion metrics with actionable recommendations'
  },
  {
    intent: 'forecast' as PromptIntent,
    title: 'Next quarter revenue projection',
    subtitle: 'Predict revenue based on current trends and market conditions',
    hasTooltip: true,
    tooltipContent: 'Uses machine learning models with historical data and current trends for accurate forecasting'
  },
  {
    intent: 'explain' as PromptIntent,
    title: 'Customer churn patterns',
    subtitle: 'Understand why customers are leaving and retention opportunities',
    hasTooltip: true,
    tooltipContent: 'Analyzes customer behavior patterns leading to churn with retention strategy insights'
  },
  {
    intent: 'risk' as PromptIntent,
    title: 'Pipeline risk assessment',
    subtitle: 'Identify at-risk deals in the sales pipeline and mitigation strategies',
    hasTooltip: true,
    tooltipContent: 'AI-powered evaluation of deal probability with early warning indicators'
  }
];