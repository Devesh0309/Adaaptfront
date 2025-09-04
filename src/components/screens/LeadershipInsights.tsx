import React, { useState } from 'react';
import * as SelectPrimitive from "@radix-ui/react-select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { ChevronDown, ChevronUp, Users, DollarSign, Cpu, TrendingUp, Megaphone, Download, FileText, Calendar, MessageSquare, Send, Minimize2, BarChart3, AlertCircle, CheckCircle, Clock, MapPin, Eye, MousePointer, TrendingDown, CheckIcon } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva, type VariantProps } from "class-variance-authority";

// --- UTILS & HELPERS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- UI COMPONENTS ---

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
        {...props}
      />
    )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
      />
    )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
      <h3
        ref={ref}
        className={cn("text-lg font-semibold leading-none tracking-tight", className)}
        {...props}
      />
    )
);
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
    )
);
CardContent.displayName = "CardContent";

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
const Badge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div className={cn(badgeVariants({ variant }), className)} ref={ref} {...props} />
    );
  }
);
Badge.displayName = "Badge";

const Progress = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: number }>(
  ({ className, value, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className)}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  )
);
Progress.displayName = "Progress";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, type, ...props }, ref) => {
      return (
        <input
          type={type}
          className={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}
          ref={ref}
          {...props}
        />
      )
    }
  );
Input.displayName = "Input";

// --- DASHBOARD COMPONENTS ---

const HRInsights = () => {
  const attritionData = [ { month: 'Jan', rate: 8.5 }, { month: 'Feb', rate: 9.2 }, { month: 'Mar', rate: 10.1 }, { month: 'Apr', rate: 11.3 }, { month: 'May', rate: 12.0 }, { month: 'Jun', rate: 12.8 } ];
  const hiringPipelineData = [ { role: 'Engineering', pipeline: 45, hired: 12 }, { role: 'Sales', pipeline: 32, hired: 8 }, { role: 'Marketing', pipeline: 18, hired: 5 }, { role: 'Support', pipeline: 25, hired: 7 }, { role: 'HR', pipeline: 12, hired: 3 } ];
  const engagementData = [ { category: 'Satisfied', value: 68, color: '#10B981' }, { category: 'Neutral', value: 22, color: '#F59E0B' }, { category: 'Dissatisfied', value: 10, color: '#EF4444' } ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card><CardHeader><CardTitle className="text-base">Attrition Rate Trend</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={200}><LineChart data={attritionData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip formatter={(value) => [`${value}%`, 'Attrition Rate']} /><Line type="monotone" dataKey="rate" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }} /></LineChart></ResponsiveContainer><p className="text-sm text-gray-600 mt-2">Trending upward - requires attention</p></CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">Hiring Pipeline by Role</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={200}><BarChart data={hiringPipelineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="role" /><YAxis /><Tooltip /><Bar dataKey="pipeline" fill="#94A3B8" name="In Pipeline" /><Bar dataKey="hired" fill="#10B981" name="Hired" /></BarChart></ResponsiveContainer></CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">Employee Engagement</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={150}><PieChart><Pie data={engagementData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">{engagementData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip formatter={(value) => `${value}%`} /></PieChart></ResponsiveContainer><div className="mt-4 p-3 bg-blue-50 rounded-lg"><p className="text-sm"><strong>Overall Score: 7.2/10</strong><br /><span className="text-gray-600">Above industry average of 6.8</span></p></div></CardContent></Card>
    </div>
  );
};

const FinanceInsights = () => {
    const revenueExpenseData = [{ month: 'Jan', revenue: 2.1, expense: 1.6 },{ month: 'Feb', revenue: 2.3, expense: 1.7 },{ month: 'Mar', revenue: 2.4, expense: 1.8 },{ month: 'Apr', revenue: 2.6, expense: 1.9 },{ month: 'May', revenue: 2.7, expense: 1.9 },{ month: 'Jun', revenue: 2.8, expense: 2.0 }];
    const profitMarginData = [{ quarter: 'Q1 2024', margin: 22.5 },{ quarter: 'Q2 2024', margin: 24.1 },{ quarter: 'Q3 2024', margin: 25.8 },{ quarter: 'Q4 2024', margin: 28.6 }];
    const costBreakdownData = [{ department: 'Engineering', cost: 35, color: '#3B82F6' },{ department: 'Sales', cost: 28, color: '#10B981' },{ department: 'Marketing', cost: 18, color: '#F59E0B' },{ department: 'Operations', cost: 12, color: '#8B5CF6' },{ department: 'HR', cost: 7, color: '#EF4444' }];
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card><CardHeader><CardTitle className="text-base">Revenue vs Expense Trend</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={200}><LineChart data={revenueExpenseData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip formatter={(value) => [`$${value}B`, '']} /><Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Revenue" /><Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={3} name="Expense" /></LineChart></ResponsiveContainer></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">Profit Margin Trend</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={200}><AreaChart data={profitMarginData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="quarter" /><YAxis /><Tooltip formatter={(value) => [`${value}%`, 'Profit Margin']} /><Area type="monotone" dataKey="margin" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} strokeWidth={2} /></AreaChart></ResponsiveContainer></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">Cost Distribution by Department</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={150}><PieChart><Pie data={costBreakdownData} cx="50%" cy="50%" outerRadius={60} dataKey="cost">{costBreakdownData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip formatter={(value) => `${value}%`} /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
    );
};

const TechInsights = () => {
  const uptimeData = [ { day: 'Mon', uptime: 99.98 }, { day: 'Tue', uptime: 99.95 }, { day: 'Wed', uptime: 99.99 }, { day: 'Thu', uptime: 99.97 }, { day: 'Fri', uptime: 99.96 }, { day: 'Sat', uptime: 99.99 }, { day: 'Sun', uptime: 99.98 } ];
  const incidentData = [ { month: 'Jan', bugs: 45, incidents: 8 }, { month: 'Feb', bugs: 38, incidents: 6 }, { month: 'Mar', bugs: 42, incidents: 9 }, { month: 'Apr', bugs: 35, incidents: 5 }, { month: 'May', bugs: 29, incidents: 4 }, { month: 'Jun', bugs: 31, incidents: 3 } ];
  const infrastructureCostData = [ { service: 'Compute', current: 45, previous: 42 }, { service: 'Storage', current: 28, previous: 30 }, { service: 'Network', current: 15, previous: 16 }, { service: 'Database', current: 35, previous: 33 }, { service: 'Monitoring', current: 8, previous: 7 } ];
  const recentIncidents = [ { id: 1, title: 'Database Connection Timeout', severity: 'medium', status: 'resolved', time: '2 hours ago' }, { id: 2, title: 'API Rate Limit Exceeded', severity: 'low', status: 'resolved', time: '1 day ago' }, { id: 3, title: 'Load Balancer Failover', severity: 'high', status: 'resolved', time: '3 days ago' } ];
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return <Badge variant="destructive" className="text-xs">High</Badge>;
      case 'medium': return <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">Medium</Badge>;
      default: return <Badge variant="outline" className="text-xs">Low</Badge>;
    }
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card><CardHeader><CardTitle className="text-base">System Uptime (7 Days)</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={200}><LineChart data={uptimeData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis domain={[99.9, 100]} /><Tooltip formatter={(value) => [`${value}%`, 'Uptime']} /><Line type="monotone" dataKey="uptime" stroke="#10B981" strokeWidth={3} /></LineChart></ResponsiveContainer></CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">Bug & Incident Trends</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={200}><BarChart data={incidentData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="bugs" fill="#94A3B8" name="Bugs" /><Bar dataKey="incidents" fill="#EF4444" name="Incidents" /></BarChart></ResponsiveContainer><div className="mt-4 space-y-2"><h4 className="text-sm font-medium text-gray-700">Recent Incidents</h4>{recentIncidents.map((incident) => (<div key={incident.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"><div className="flex items-center gap-2"><CheckCircle className="h-3 w-3 text-green-500" /><span>{incident.title}</span></div><div className="flex items-center gap-2">{getSeverityBadge(incident.severity)}<span className="text-gray-500">{incident.time}</span></div></div>))}</div></CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">Infrastructure Cost Utilization</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={200}><BarChart data={infrastructureCostData} layout="horizontal"><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" /><YAxis dataKey="service" type="category" width={60} /><Tooltip formatter={(value) => [`$${value}K`, '']} /><Bar dataKey="previous" fill="#E5E7EB" name="Previous Month" /><Bar dataKey="current" fill="#3B82F6" name="Current Month" /></BarChart></ResponsiveContainer></CardContent></Card>
    </div>
  );
};

const SalesInsights = () => {
    const pipelineFunnelData = [ { stage: 'Leads', count: 2400, value: 120 }, { stage: 'Qualified', count: 960, value: 240 }, { stage: 'Proposal', count: 480, value: 320 }, { stage: 'Negotiation', count: 240, value: 180 }, { stage: 'Closed', count: 120, value: 85 } ];
    const winLossData = [ { month: 'Jan', won: 15, lost: 8 }, { month: 'Feb', won: 18, lost: 6 }, { month: 'Mar', won: 22, lost: 9 }, { month: 'Apr', won: 19, lost: 7 }, { month: 'May', won: 25, lost: 5 }, { month: 'Jun', won: 28, lost: 8 } ];
    const regionalData = [ { region: 'North America', revenue: 45, growth: 12, color: '#3B82F6' }, { region: 'Europe', revenue: 28, growth: 8, color: '#10B981' }, { region: 'Asia Pacific', revenue: 18, growth: 25, color: '#F59E0B' }, { region: 'Latin America', revenue: 6, growth: 15, color: '#8B5CF6' }, { region: 'Middle East', revenue: 3, growth: 30, color: '#EF4444' } ];
    const topDeals = [ { company: 'TechCorp Inc.', value: '$2.5M', stage: 'Negotiation', probability: 85 }, { company: 'Global Systems', value: '$1.8M', stage: 'Proposal', probability: 65 }, { company: 'Innovation Labs', value: '$3.2M', stage: 'Qualified', probability: 45 }, { company: 'Future Enterprises', value: '$1.2M', stage: 'Negotiation', probability: 90 }, ];
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card><CardHeader><CardTitle className="text-base">Sales Pipeline Funnel</CardTitle></CardHeader><CardContent><div className="space-y-4">{pipelineFunnelData.map((stage) => (<div key={stage.stage}><div className="flex justify-between"><span className="text-sm font-medium">{stage.stage}</span><span className="text-sm font-semibold">{stage.count}</span></div><Progress value={(stage.count / pipelineFunnelData[0].count) * 100} className="h-2" /></div>))}</div></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">Win/Loss Ratio Trends</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={200}><BarChart data={winLossData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="won" fill="#10B981" name="Won" /><Bar dataKey="lost" fill="#EF4444" name="Lost" /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">Regional Sales Performance</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={150}><PieChart><Pie data={regionalData} cx="50%" cy="50%" outerRadius={60} dataKey="revenue">{regionalData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip formatter={(value) => `${value}%`} /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
    );
};

const MarketingInsights = () => {
    const campaignPerformanceData = [ { campaign: 'Q2 Product Launch', leads: 1250, conversions: 89, roi: 4.2 }, { campaign: 'Brand Awareness', leads: 890, conversions: 45, roi: 2.8 }, { campaign: 'Retargeting', leads: 640, conversions: 128, roi: 5.6 }, { campaign: 'Email Marketing', leads: 1100, conversions: 165, roi: 6.2 }, { campaign: 'Social Media', leads: 750, conversions: 52, roi: 3.1 } ];
    const acquisitionCostData = [ { month: 'Jan', cost: 185 }, { month: 'Feb', cost: 192 }, { month: 'Mar', cost: 178 }, { month: 'Apr', cost: 165 }, { month: 'May', cost: 158 }, { month: 'Jun', cost: 142 } ];
    const channelPerformance = [ { channel: 'Organic Search', percentage: 35, color: '#10B981' }, { channel: 'Paid Search', percentage: 22, color: '#3B82F6' }, { channel: 'Social Media', percentage: 18, color: '#F59E0B' }, { channel: 'Email', percentage: 15, color: '#8B5CF6' }, { channel: 'Direct', percentage: 10, color: '#EF4444' } ];
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card><CardHeader><CardTitle className="text-base">Campaign Performance</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={200}><BarChart data={campaignPerformanceData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="campaign" angle={-45} textAnchor="end" height={80} fontSize={10} /><YAxis /><Tooltip formatter={(value, name) => [name === 'roi' ? `${value}x` : value, name]} /><Bar dataKey="conversions" fill="#10B981" name="Conversions" /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">Customer Acquisition Cost</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={200}><AreaChart data={acquisitionCostData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip formatter={(value) => [`$${value}`, 'CAC']} /><Area type="monotone" dataKey="cost" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} /></AreaChart></ResponsiveContainer></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">Lead Sources</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={200}><PieChart><Pie data={channelPerformance} cx="50%" cy="50%" outerRadius={80} dataKey="percentage" label>{channelPerformance.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip formatter={(value) => `${value}%`} /></PieChart></ResponsiveContainer></CardContent></Card>
        </div>
    );
};


const InsightSections = () => {
    const [expandedSections, setExpandedSections] = useState<string[]>(['hr']);
    const insightSections = [
        { id: 'hr', title: 'HR Insights', icon: <Users className="h-5 w-5" />, component: <HRInsights /> },
        { id: 'finance', title: 'Finance Insights', icon: <DollarSign className="h-5 w-5" />, component: <FinanceInsights /> },
        { id: 'tech', title: 'Tech Insights', icon: <Cpu className="h-5 w-5" />, component: <TechInsights /> },
        { id: 'sales', title: 'Sales Insights', icon: <TrendingUp className="h-5 w-5" />, component: <SalesInsights /> },
        { id: 'marketing', title: 'Marketing Insights', icon: <Megaphone className="h-5 w-5" />, component: <MarketingInsights /> },
    ];
    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Detailed Insights</h2>
            {insightSections.map((section) => {
                const isExpanded = expandedSections.includes(section.id);
                return (
                    <Card key={section.id} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="cursor-pointer hover:bg-gray-50" onClick={() => toggleSection(section.id)}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">{section.icon}<CardTitle className="text-lg">{section.title}</CardTitle></div>
                                {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
                            </div>
                        </CardHeader>
                        {isExpanded && <CardContent className="pt-0"><div className="border-t border-gray-100 pt-6">{section.component}</div></CardContent>}
                    </Card>
                );
            })}
        </div>
    );
};

const LeadershipBoard = () => {
    const leadershipData = [
        { id: 'hr', title: 'HR', icon: <Users className="h-6 w-6" />, kpi: '12%', insight: 'Slightly above industry average', status: 'warning', trend: 'Attrition Rate' },
        { id: 'finance', title: 'Finance', icon: <DollarSign className="h-6 w-6" />, kpi: '$2.8B', insight: '+8% QoQ', status: 'healthy', trend: 'Revenue' },
        { id: 'tech', title: 'Tech', icon: <Cpu className="h-6 w-6" />, kpi: '99.97%', insight: 'Stable', status: 'healthy', trend: 'System Uptime' },
        { id: 'sales', title: 'Sales', icon: <TrendingUp className="h-6 w-6" />, kpi: '$620M', insight: '+15% growth', status: 'healthy', trend: 'Pipeline' },
        { id: 'marketing', title: 'Marketing', icon: <Megaphone className="h-6 w-6" />, kpi: '7.4%', insight: 'Improved by 0.5%', status: 'healthy', trend: 'Lead Conversion' },
    ];
    const getStatusDot = (status: string) => ({ healthy: 'bg-green-400', warning: 'bg-orange-400', critical: 'bg-red-400' }[status] || 'bg-gray-400');
    const getStatusColor = (status: string) => {
        switch (status) {
          case 'healthy': return 'bg-green-100 text-green-800 border-green-200';
          case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200';
          case 'critical': return 'bg-red-100 text-red-800 border-red-200';
          default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {leadershipData.map((dept) => (
                <Card key={dept.id} className="bg-white/70 backdrop-blur-md border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3"><div className="p-2 bg-gray-100 rounded-lg">{dept.icon}</div><h3 className="font-semibold text-gray-900">{dept.title}</h3></div>
                            <div className={`w-3 h-3 rounded-full ${getStatusDot(dept.status)}`} />
                        </div>
                        <div className="space-y-3">
                            <div><p className="text-sm text-gray-600 mb-1">{dept.trend}</p><p className="text-2xl font-bold text-gray-900">{dept.kpi}</p></div>
                            <p className="text-sm text-gray-700 leading-relaxed">{dept.insight}</p>
                            <Badge variant="outline" className={`text-xs ${getStatusColor(dept.status)}`}>
                                {dept.status === 'healthy' ? 'Healthy' : dept.status === 'warning' ? 'Attention' : 'Critical'}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

const AIAssistant = () => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Array<{type: 'user' | 'ai', content: string}>>([]);
    const [isTyping, setIsTyping] = useState(false);
    const quickActions = [ { label: 'Summarize HR insights', icon: <BarChart3 className="h-3 w-3" /> }, { label: 'Compare Q2 vs Q1 performance', icon: <TrendingUp className="h-3 w-3" /> }, { label: 'Export executive summary', icon: <Download className="h-3 w-3" /> } ];
    const sampleResponses = [ "Based on the current data, HR shows an attrition rate of 12%, which is slightly above industry average. Consider implementing retention strategies.", "Q2 performance shows strong growth across all departments. Revenue is up 8% QoQ and pipeline has grown 15%.", "Executive summary has been generated. Key highlights: Strong financial performance, stable tech systems, growing sales pipeline, and effective marketing campaigns." ];

    const handleSend = (message?: string) => {
        const messageToSend = message || input;
        if (!messageToSend.trim()) return;
        setMessages(prev => [...prev, { type: 'user', content: messageToSend }]);
        setInput('');
        setIsTyping(true);
        setTimeout(() => {
          const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
          setMessages(prev => [...prev, { type: 'ai', content: randomResponse }]);
          setIsTyping(false);
        }, 1500);
    };

    if (isMinimized) {
        return <div className="fixed bottom-4 right-4 z-50"><Button onClick={() => setIsMinimized(false)} className="rounded-full w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"><MessageSquare className="h-5 w-5" /></Button></div>;
    }

    return (
        <div className="fixed bottom-4 right-4 w-96 z-50">
            <Card className="bg-white shadow-xl border-0 max-h-96">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-blue-600" /><CardTitle className="text-base">AI Assistant</CardTitle></div>
                        <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)} className="h-8 w-8 p-0"><Minimize2 className="h-4 w-4" /></Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-0">
                    <div className="max-h-40 overflow-y-auto mb-4 space-y-2">
                        {messages.length === 0 && <div className="text-center text-gray-500 text-sm py-4">Start a conversation...</div>}
                        {messages.map((message, index) => (
                            <div key={index} className={`p-2 rounded-lg text-sm ${message.type === 'user' ? 'bg-blue-100 text-blue-900 ml-4' : 'bg-gray-100 text-gray-900 mr-4'}`}>{message.content}</div>
                        ))}
                        {isTyping && <div className="bg-gray-100 text-gray-900 mr-4 p-2 rounded-lg text-sm"><div className="flex items-center gap-1"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div></div></div>}
                    </div>
                    <div className="mb-3 flex flex-wrap gap-2">
                        {quickActions.map((action, index) => (
                            <Button key={index} variant="outline" size="sm" onClick={() => handleSend(action.label)} className="text-xs h-7 bg-gray-50 hover:bg-gray-100">{action.icon}<span className="ml-1">{action.label}</span></Button>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question..." onKeyPress={(e) => e.key === 'Enter' && handleSend()} />
                        <Button onClick={() => handleSend()} size="sm" disabled={!input.trim() || isTyping} className="px-3"><Send className="h-4 w-4" /></Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// --- MAIN EXPORTED COMPONENT ---
export const LeadershipInsights = () => {
  const [dateFilter, setDateFilter] = useState('monthly');

  return (
    <div className="overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Leadership Insights Dashboard</h1>
            <p className="text-gray-600">Real-time visibility into organizational performance</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px] bg-white/80 backdrop-blur-sm">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm"><FileText className="h-4 w-4 mr-2" />PDF</Button>
              <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm"><Download className="h-4 w-4 mr-2" />Excel</Button>
            </div>
          </div>
        </div>
        <LeadershipBoard />
      </div>
      <InsightSections />
      <AIAssistant />
    </div>
  );
};

export default LeadershipInsights;