import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Bot, Send, X, Sparkles, TrendingUp, Users, DollarSign, Search, Download, Filter, Newspaper, RefreshCw, Bookmark, ExternalLink, Star, Calendar, Target, Award, Zap, TrendingDown, Minus, ArrowLeft } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as TabsPrimitive from "@radix-ui/react-tabs";

// --- UTILITY FUNCTIONS ---
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- UI COMPONENT: Button ---
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

function Button({ className, variant, size, asChild = false, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

// --- UI COMPONENT: Input ---
function Input({ className, type, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

// --- UI COMPONENT: Badge ---
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

// --- UI COMPONENT: Card (MODIFIED) ---
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-md", className)} {...props} />
));
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className)} {...props} />
));
const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h4 ref={ref} className={cn("leading-none", className)} {...props} />
));
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-6 [&:last-child]:pb-6", className)} {...props} />
));

// --- UI COMPONENT: Select ---
const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectTrigger = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger ref={ref} className={cn("border-input data-[placeholder]:text-muted-foreground flex w-full items-center justify-between gap-2 rounded-md border bg-input-background px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] h-9", className)} {...props}>
    {children}
    <SelectPrimitive.Icon asChild><Users className="h-4 w-4 opacity-50" /></SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
const SelectContent = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Content>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content ref={ref} className={cn("relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className)} position={position} {...props}>
      <SelectPrimitive.Viewport className={cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]")}>
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
const SelectItem = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Item>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item ref={ref} className={cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)} {...props}>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));

// --- UI COMPONENT: Avatar ---
const Avatar = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Root>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Root ref={ref} className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)} {...props} />
));
const AvatarImage = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Image>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Image ref={ref} className={cn("aspect-square h-full w-full", className)} {...props} />
));
const AvatarFallback = React.forwardRef<React.ElementRef<typeof AvatarPrimitive.Fallback>, React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>>(({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback ref={ref} className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className)} {...props} />
));

// --- UI COMPONENT: Tabs ---
const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(({ className, ...props }, ref) => (
  <TabsPrimitive.List ref={ref} className={cn("bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-xl p-[3px] flex", className)} {...props} />
));
const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger ref={ref} className={cn("data-[state=active]:bg-card dark:data-[state=active]:text-foreground text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-xl border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap", className)} {...props} />
));
const TabsContent = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content ref={ref} className={cn("flex-1 outline-none", className)} {...props} />
));

// --- FEATURE COMPONENT: ImageWithFallback ---
const ERROR_IMG_SRC = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false);
  const handleError = () => setDidError(true);
  const { src, alt, style, className, ...rest } = props;

  return didError ? (
    <div className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`} style={style}>
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
  );
}

// --- FEATURE COMPONENT: DiscoverHeader ---
function DiscoverHeader({ onBack }: { onBack: () => void; }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-border/50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="mb-1 text-2xl font-bold">Discover – Industry & Competition Insights</h1>
            <p className="text-muted-foreground">Stay ahead with real-time market intelligence and competitor analysis</p>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search industry news, competitors, trends…" className="pl-10 bg-white/70 backdrop-blur-sm" />
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2"><Filter className="w-4 h-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">Filters:</span></div>
            <Select defaultValue="all-industries"><SelectTrigger className="w-40 bg-white/70 backdrop-blur-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all-industries">All Industries</SelectItem></SelectContent></Select>
            <Select defaultValue="all-competitors"><SelectTrigger className="w-40 bg-white/70 backdrop-blur-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all-competitors">All Competitors</SelectItem></SelectContent></Select>
            <Select defaultValue="week"><SelectTrigger className="w-32 bg-white/70 backdrop-blur-sm"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="week">This Week</SelectItem></SelectContent></Select>
            <Button variant="outline" className="bg-white/70 backdrop-blur-sm"><Download className="w-4 h-4 mr-2" />Export PDF</Button>
          </div>
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">Technology</Badge>
          <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">Amazon</Badge>
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">This Week</Badge>
        </div>
      </div>
    </div>
  );
}

// --- FEATURE COMPONENT: NewsCard ---
interface NewsCardProps { headline: string; source: string; date: string; summary: string; category: "Retail" | "Logistics" | "Tech" | "Policy" | "Fintech"; imageUrl?: string; url?: string; trending?: boolean; }
const categoryColors: Record<NewsCardProps['category'], string> = { Retail: "bg-purple-50 text-purple-700 border-purple-200", Logistics: "bg-green-50 text-green-700 border-green-200", Tech: "bg-blue-50 text-blue-700 border-blue-200", Policy: "bg-gray-50 text-gray-700 border-gray-200", Fintech: "bg-yellow-50 text-yellow-700 border-yellow-200" };
function NewsCard({ headline, source, date, summary, category, imageUrl, trending = false }: NewsCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  return (
    <motion.div onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}>
      <Card className="bg-white/70 backdrop-blur-sm border-border/50 hover:bg-white/80 transition-all duration-300 cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2"><Badge className={categoryColors[category]}>{category}</Badge>{trending && (<Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200"><TrendingUp className="w-3 h-3 mr-1" />Trending</Badge>)}</div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); setIsBookmarked(!isBookmarked); }}><Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-blue-500 text-blue-500" : "text-gray-400"}`} /></Button>
          </div>
          <div className="space-y-3">
            <h3 className="line-clamp-2 leading-tight">{headline}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground"><span>{source}</span><div className="flex items-center gap-1"><Calendar className="w-3 h-3" /><span>{date}</span></div></div>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{summary}</p>
            <motion.div initial={false} animate={{ height: isHovered ? "auto" : 0, opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              {imageUrl && (<div className="mt-3 rounded-lg overflow-hidden"><ImageWithFallback src={imageUrl} alt={headline} className="w-full h-32 object-cover" /></div>)}
              <div className="mt-3 flex justify-end"><Button variant="outline" size="sm" className="gap-2"><ExternalLink className="w-3 h-3" />Read More</Button></div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- FEATURE COMPONENT: CompetitorCard ---
interface CompetitorCardProps { competitorName: string; logo?: string; milestone: string; description: string; kpis: { metric: string; value: string; trend: "up" | "down" | "neutral"; icon: "revenue" | "speed" | "market"; }[]; impactScore: "high" | "medium" | "low"; date: string; }
const impactColors: Record<CompetitorCardProps['impactScore'], string> = { high: "bg-red-50 text-red-700 border-red-200", medium: "bg-orange-50 text-orange-700 border-orange-200", low: "bg-green-50 text-green-700 border-green-200" };
const trendIcons = { up: TrendingUp, down: TrendingDown, neutral: Minus };
const trendColors = { up: "text-green-600", down: "text-red-600", neutral: "text-gray-500" };
const kpiIcons = { revenue: DollarSign, speed: Zap, market: Award };
function CompetitorCard({ competitorName, logo, milestone, description, kpis, impactScore, date }: CompetitorCardProps) {
  return (
    <motion.div className="relative">
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-transparent"></div>
      <div className="absolute left-4 top-6 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm z-10"></div>
      <Card className="ml-12 bg-white/70 backdrop-blur-sm border-border/50 hover:bg-white/80 transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8"><AvatarImage src={logo} alt={competitorName} /><AvatarFallback>{competitorName.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
              <div><h4>{competitorName}</h4><p className="text-sm text-muted-foreground">{date}</p></div>
            </div>
            <Badge className={impactColors[impactScore]}>{impactScore.charAt(0).toUpperCase() + impactScore.slice(1)} Impact</Badge>
          </div>
          <div className="mb-4">
            <h4 className="mb-2">{milestone}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Key Metrics:</p>
            <div className="grid gap-2">
              {kpis.map((kpi, index) => {
                const TrendIcon = trendIcons[kpi.trend];
                const KpiIcon = kpiIcons[kpi.icon];
                return (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50/70 rounded-lg">
                    <div className="flex items-center gap-2"><KpiIcon className="w-4 h-4 text-muted-foreground" /><span className="text-sm">{kpi.metric}</span></div>
                    <div className="flex items-center gap-1"><span className="text-sm font-medium">{kpi.value}</span><TrendIcon className={`w-4 h-4 ${trendColors[kpi.trend]}`} /></div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// --- FEATURE COMPONENT: ContentFeeds ---
const newsData = [{ headline: "Amazon Unveils Revolutionary AI-Powered Warehouse Automation", source: "TechCrunch", date: "Sep 1, 2025", summary: "Amazon announces breakthrough in robotic fulfillment technology that could reduce processing times by 50% and reshape industry logistics standards.", category: "Tech" as const, imageUrl: "https://images.unsplash.com/photo-1581092918484-8313ada2183a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG5ld3MlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1NjcxMTc2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", trending: true }, { headline: "New Federal Regulations Target Big Tech Data Collection Practices", source: "Wall Street Journal", date: "Aug 31, 2025", summary: "Proposed legislation could require major platforms to obtain explicit consent for all data collection, potentially affecting personalization algorithms.", category: "Policy" as const, imageUrl: "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHhkYXRhJTIwYW5hbHl0aWNzJTIwY2hhcnRzfGVufDF8fHx8MTc1NjY2MjY2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" }];
const competitorData = [{ competitorName: "Amazon", logo: "https://logo.clearbit.com/amazon.com", milestone: "AI Warehouse Automation Launch", description: "Deployed advanced robotic systems across 15 fulfillment centers, reducing order processing time by 45% and operational costs by 30%.", kpis: [{ metric: "Revenue Growth", value: "+18%", trend: "up" as const, icon: "revenue" as const }, { metric: "Delivery Speed", value: "24h avg", trend: "up" as const, icon: "speed" as const }], impactScore: "high" as const, date: "2 days ago" }, { competitorName: "Walmart", logo: "https://logo.clearbit.com/walmart.com", milestone: "Q3 Earnings Beat Expectations", description: "Reported 28% e-commerce growth and expanded same-day delivery to 75% of US population, strengthening omnichannel strategy.", kpis: [{ metric: "Revenue Growth", value: "+12%", trend: "up" as const, icon: "revenue" as const }, { metric: "Market Share", value: "25%", trend: "neutral" as const, icon: "market" as const }], impactScore: "medium" as const, date: "3 days ago" }];

function ContentFeeds() {
  const [visibleNews, setVisibleNews] = useState(newsData.slice(0, 3));
  const [visibleCompetitors, setVisibleCompetitors] = useState(competitorData.slice(0, 3));
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Card className="bg-white/70 backdrop-blur-sm border-border/50"><CardHeader className="pb-4"><div className="flex items-center justify-between"><CardTitle className="flex items-center gap-2"><Newspaper className="w-5 h-5 text-blue-500" />Industry News Feed</CardTitle><Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">{visibleNews.length} articles</Badge></div></CardHeader></Card>
          <div className="space-y-4">{visibleNews.map((news, index) => (<motion.div key={index}><NewsCard {...news} /></motion.div>))}</div>
        </div>
        <div className="space-y-4">
          <Card className="bg-white/70 backdrop-blur-sm border-border/50"><CardHeader className="pb-4"><div className="flex items-center justify-between"><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-orange-500" />Competitor Progress</CardTitle><Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">{visibleCompetitors.length} updates</Badge></div></CardHeader></Card>
          <div className="space-y-6">{visibleCompetitors.map((competitor, index) => (<motion.div key={index}><CompetitorCard {...competitor} /></motion.div>))}</div>
        </div>
      </div>
    </div>
  );
}

// --- FEATURE COMPONENT: HighlightSection (FIXED with 5 cards) ---
const highlights = [
    { headline: "Amazon Announces Revolutionary AI-Powered Supply Chain Management", insight: "Could reduce delivery times by 40% and set new industry standards for logistics automation.", imageUrl: "https://images.unsplash.com/photo-1581092918484-8313ada2183a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG5ld3MlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc1NjcxMTc2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Technology", priority: 1, source: "TechCrunch" },
    { headline: "Walmart Reports 25% Increase in E-commerce Growth", insight: "Strong digital transformation results could pressure traditional retailers to accelerate online strategies.", imageUrl: "https://images.unsplash.com/photo-1608908272009-5834650fb600?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBtZWV0aW5nfGVufDF8fHx8MTc1NjcxMjEzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Retail", priority: 2, source: "Reuters" },
    { headline: "New Federal Regulations Target Big Tech Data Practices", insight: "Potential compliance costs could reach $2B annually across major platforms, reshaping data strategies.", imageUrl: "https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHhkYXRhJTIwYW5hbHl0aWNzJTIwY2hhcnRzfGVufDF8fHx8MTc1NjY2MjY2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Policy", priority: 3, source: "Wall Street Journal" },
    { headline: "Shopify Partners with Major Banks for Embedded Finance", insight: "Direct lending and payment solutions could disrupt traditional e-commerce financing models.", imageUrl: "https://images.unsplash.com/photo-1593510987760-2d895bc8109d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFydHVwJTIwZnVuZGluZ3xlbnwxfHx8fDE3NTY3ODYxNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Fintech", priority: 4, source: "Bloomberg" },
    { headline: "Supply Chain Disruptions Create New Opportunities", insight: "Regional fulfillment centers becoming critical competitive advantage in post-pandemic landscape.", imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2dpc3RpY3MlMjB3YXJlaG91c2V8ZW58MXx8fHwxNzU2Nzg2MTYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", category: "Logistics", priority: 5, source: "Forbes" }
];
function HighlightCard({ highlight, index }: { highlight: typeof highlights[0]; index: number }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
      <Card className="bg-white/80 backdrop-blur-sm border-border/50 hover:bg-white/90 transition-all duration-300 overflow-hidden group cursor-pointer">
        <div className="relative"><ImageWithFallback src={highlight.imageUrl} alt={highlight.headline} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" /><div className="absolute top-4 left-4"><Badge className="bg-white/90 backdrop-blur-sm text-gray-800">{highlight.category}</Badge></div>
          <div className="absolute top-4 right-4 flex gap-2"><div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1"><Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /><span className="text-xs font-medium">#{highlight.priority}</span></div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm hover:bg-white" onClick={(e) => { e.stopPropagation(); setIsBookmarked(!isBookmarked); }}><Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-blue-500 text-blue-500" : "text-gray-600"}`} /></Button>
          </div>
        </div>
        <CardContent className="p-4"><div className="space-y-3"><h3 className="line-clamp-2 leading-tight">{highlight.headline}</h3><p className="text-sm text-muted-foreground leading-relaxed">{highlight.insight}</p><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{highlight.source}</span><Button variant="outline" size="sm" className="gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><ExternalLink className="w-3 h-3" />Read Full Story</Button></div></div></CardContent>
      </Card>
    </motion.div>
  );
}
function HighlightSection() {
  return (
    <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-6"><h2>Top 5 Headlines of the Week</h2><p className="text-muted-foreground">Critical industry developments you need to know</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">{highlights.map((highlight, index) => (<HighlightCard key={index} highlight={highlight} index={index} />))}</div>
      </div>
    </div>
  );
}

// --- FEATURE COMPONENT: VisualizationSection (FIXED with 3 tabs) ---
const marketShareData = [ { month: "Jan", Amazon: 35, Walmart: 28, Target: 15, Shopify: 12, Others: 10 }, { month: "Feb", Amazon: 36, Walmart: 27, Target: 15, Shopify: 13, Others: 9 }, { month: "Mar", Amazon: 34, Walmart: 29, Target: 16, Shopify: 13, Others: 8 }, { month: "Apr", Amazon: 37, Walmart: 28, Target: 14, Shopify: 14, Others: 7 }, { month: "May", Amazon: 38, Walmart: 26, Target: 15, Shopify: 15, Others: 6 }, { month: "Jun", Amazon: 39, Walmart: 25, Target: 15, Shopify: 16, Others: 5 }, ];
const fundingData = [ { company: "Amazon", funding: 12.5 }, { company: "Walmart", funding: 8.2 }, { company: "Shopify", funding: 15.8 }, { company: "Target", funding: 5.4 }, { company: "eBay", funding: 3.2 }, { company: "Etsy", funding: 2.1 }, ];
const sentimentData = [ { name: "Positive", value: 45, color: "#10B981 " }, { name: "Neutral", value: 35, color: "#6B7280" }, { name: "Negative", value: 20, color: "#EF4444" }, ];
const COLORS = ["#3B82F6", "#F59E0B", "#10B981", "#8B5CF6", "#EF4444"];

function VisualizationSection() {
    const [selectedIndustry, setSelectedIndustry] = useState("ecommerce");
    return (
        <div className="bg-white py-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-6"><h2>Market Intelligence Dashboard</h2><p className="text-muted-foreground">Real-time analytics</p></div>
                <Tabs defaultValue="market-share" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3"><TabsTrigger value="market-share"><Target className="w-4 h-4 mr-2" />Market Share</TabsTrigger><TabsTrigger value="funding"><DollarSign className="w-4 h-4 mr-2" />Funding Trends</TabsTrigger><TabsTrigger value="sentiment"><TrendingUp className="w-4 h-4 mr-2" />Sentiment Analysis</TabsTrigger></TabsList>
                    <TabsContent value="market-share">
                        <Card className="bg-white/70 backdrop-blur-sm border-border/50"><CardHeader><CardTitle>Market Share Trends - Last 6 Months</CardTitle></CardHeader>
                            <CardContent><div className="h-80"><ResponsiveContainer width="100%" height="100%"><LineChart data={marketShareData}><CartesianGrid /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="Amazon" stroke="#3B82F6" /><Line type="monotone" dataKey="Walmart" stroke="#F59E0B" /><Line type="monotone" dataKey="Target" stroke="#10B981" /><Line type="monotone" dataKey="Shopify" stroke="#8B5CF6" /><Line type="monotone" dataKey="Others" stroke="#6B7280" strokeDasharray="5 5" /></LineChart></ResponsiveContainer></div></CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="funding">
                        <Card className="bg-white/70 backdrop-blur-sm border-border/50"><CardHeader><CardTitle>Funding Raised by Competitors (Billions USD)</CardTitle></CardHeader>
                            <CardContent><div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={fundingData}><CartesianGrid /><XAxis dataKey="company" /><YAxis /><Tooltip /><Bar dataKey="funding" radius={[4, 4, 0, 0]}>{fundingData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Bar></BarChart></ResponsiveContainer></div></CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="sentiment">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <Card className="bg-white/70 backdrop-blur-sm border-border/50"><CardHeader><CardTitle>News Sentiment Analysis</CardTitle></CardHeader>
                                <CardContent><div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={sentimentData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">{sentimentData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></CardContent>
                            </Card>
                            <Card className="bg-white/70 backdrop-blur-sm border-border/50"><CardHeader><CardTitle>Key Insights</CardTitle></CardHeader>
                                <CardContent className="space-y-4"><div className="p-3 bg-green-50 rounded-lg border border-green-200"><h4 className="text-green-800 mb-1">Positive Trend</h4><p className="text-sm text-green-700">Amazon's AI initiatives receiving strong market response (+12% sentiment)</p></div><div className="p-3 bg-orange-50 rounded-lg border border-orange-200"><h4 className="text-orange-800 mb-1">Watch Area</h4><p className="text-sm text-orange-700">Walmart facing supply chain criticism (-8% sentiment this week)</p></div><div className="p-3 bg-blue-50 rounded-lg border border-blue-200"><h4 className="text-blue-800 mb-1">Opportunity</h4><p className="text-sm text-blue-700">Shopify's fintech moves generating investor interest (+15% mentions)</p></div></CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

// --- MAIN DISCOVER PAGE COMPONENT ---
export default function DesignDiscoverPage({ onBack }: { onBack: () => void; }) {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    {
      id: "1",
      text: "Hi! I'm your industry intelligence assistant. Ask me about recent news, competitor moves, or market trends.",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = "";
      
      if (text.toLowerCase().includes("walmart")) {
        aiResponse = "📊 **Walmart This Week:**\n\n• Q3 earnings beat expectations with 25% e-commerce growth\n• Announced partnership with Adobe for enhanced customer experience\n• Expanding drone delivery to 5 new markets\n• Stock up 3.2% following announcements\n\n**Impact Assessment:** Medium-High. These moves strengthen Walmart's digital transformation and could pressure competitors to accelerate similar initiatives.";
      } else if (text.toLowerCase().includes("compare") && text.toLowerCase().includes("amazon") && text.toLowerCase().includes("shopify")) {
        aiResponse = "🔍 **Amazon vs Shopify - Recent Strategic Moves:**\n\n**Amazon:**\n• AI-powered supply chain management system launch\n• Prime Video ad-tier introduction\n• Alexa integration with more smart home devices\n\n**Shopify:**\n• Embedded finance partnerships with major banks\n• New fulfillment network expansion\n• Enhanced B2B commerce platform\n\n**Analysis:** Amazon focuses on AI/automation while Shopify emphasizes financial services integration. Both targeting different market segments effectively.";
      } else if (text.toLowerCase().includes("impact") && text.toLowerCase().includes("regulation")) {
        aiResponse = "⚖️ **AI Regulation Impact Analysis:**\n\n**Potential Effects:**\n• Compliance costs: $2-5B annually for major tech platforms\n• Data processing restrictions may slow AI development\n• Increased transparency requirements for algorithmic decisions\n\n**Market Response:**\n• Tech stocks down 2-4% on announcement\n• Increased investment in compliance infrastructure\n• Opportunity for RegTech startups\n\n**Strategic Implications:** Companies should start compliance preparation now to avoid future penalties.";
      } else {
        aiResponse = "I can help you analyze industry news, compare competitor strategies, and assess market impacts. Try asking about specific companies like Walmart, Amazon, or Shopify, or ask me to compare recent announcements between competitors.";
      }

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: "ai",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestedQuery = (query: string) => {
    handleSendMessage(query);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in");
        }
      });
    }, { threshold: 0.1 });
    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 overflow-y-auto">
      <style>{`
        .animate-fade-in { animation: fadeInUp 0.8s ease-out forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .backdrop-blur-sm { backdrop-filter: blur(8px); }
        .backdrop-blur-md { backdrop-filter: blur(12px); }
        html { scroll-behavior: smooth; }
      `}</style>
      
      <DiscoverHeader onBack={onBack} />

      <main className="relative">
        <HighlightSection />
        <ContentFeeds />
        <VisualizationSection />

        <footer className="bg-gray-50/80 border-t border-border/50 py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-muted-foreground">Real-time industry intelligence and competitive insights</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground"><span>Last updated: 2 minutes ago</span><div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span>Live data feed</span></div></div>
            </div>
          </div>
        </footer>
      </main>

       {/* AI Assistant */}
       <>
          <AnimatePresence>
              {isAssistantOpen && (
                  <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="fixed bottom-24 right-6 w-80 h-96 z-50"
                  >
                      <Card className="h-full bg-white/95 backdrop-blur-md border-border/50 shadow-xl">
                          <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                  <CardTitle className="flex items-center gap-2">
                                      <Bot className="w-5 h-5 text-blue-500" />
                                      AI Assistant
                                  </CardTitle>
                                  <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setIsAssistantOpen(false)}
                                      className="h-8 w-8 p-0"
                                  >
                                      <X className="w-4 h-4" />
                                  </Button>
                              </div>
                          </CardHeader>
                          
                          <CardContent className="flex flex-col h-[calc(100%-80px)] p-4 pt-0">
                              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                                  {messages.map((message) => (
                                      <div
                                          key={message.id}
                                          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                                      >
                                          <div
                                              className={`max-w-[85%] p-3 rounded-lg ${
                                                  message.sender === "user"
                                                      ? "bg-blue-500 text-white"
                                                      : "bg-gray-100 text-gray-800"
                                              }`}
                                          >
                                              <p className="text-sm whitespace-pre-line">{message.text}</p>
                                          </div>
                                      </div>
                                  ))}
                                  
                                  {isTyping && (
                                      <div className="flex justify-start">
                                          <div className="bg-gray-100 p-3 rounded-lg">
                                              <div className="flex space-x-1">
                                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                              </div>
                                          </div>
                                      </div>
                                  )}
                              </div>

                              {messages.length === 1 && (
                                  <div className="mb-3">
                                      <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
                                      <div className="space-y-1">
                                          {[{icon: <TrendingUp className="w-4 h-4" />, text: "Walmart announcements", query: "Show me what Walmart announced this week"}, {icon: <Users className="w-4 h-4" />, text: "Competitor comparison", query: "Compare Amazon vs Shopify recent moves"}, {icon: <DollarSign className="w-4 h-4" />, text: "Market impact", query: "What's the potential impact of new AI regulations?"}].map((query, index) => (
                                              <Button
                                                  key={index}
                                                  variant="outline"
                                                  size="sm"
                                                  className="w-full justify-start h-auto p-2 text-xs"
                                                  onClick={() => handleSuggestedQuery(query.query)}
                                              >
                                                  {query.icon}
                                                  <span className="ml-2">{query.text}</span>
                                              </Button>
                                          ))}
                                      </div>
                                  </div>
                              )}

                              <div className="flex gap-2">
                                  <Input
                                      value={inputValue}
                                      onChange={(e) => setInputValue(e.target.value)}
                                      placeholder="Ask me about industry news or competitors…"
                                      className="flex-1 text-sm"
                                      onKeyPress={(e) => {
                                          if (e.key === "Enter") {
                                              handleSendMessage(inputValue);
                                          }
                                      }}
                                  />
                                  <Button
                                      size="sm"
                                      onClick={() => handleSendMessage(inputValue)}
                                      disabled={!inputValue.trim() || isTyping}
                                  >
                                      <Send className="w-4 h-4" />
                                  </Button>
                              </div>
                          </CardContent>
                      </Card>
                  </motion.div>
              )}
          </AnimatePresence>

          <motion.div
              className="fixed bottom-6 right-6 z-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
          >
              <Button
                  onClick={() => setIsAssistantOpen(!isAssistantOpen)}
                  className="h-14 w-14 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
              >
                  {isAssistantOpen ? (
                      <X className="w-6 h-6 text-white" />
                  ) : (
                      <div className="relative">
                          <Bot className="w-6 h-6 text-white" />
                          <Sparkles className="w-3 h-3 text-white absolute -top-1 -right-1 animate-pulse" />
                      </div>
                  )}
              </Button>
          </motion.div>
        </>
    </div>
  );
}