import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { cn } from '../ui/utils';
import { 
  Search, 
  Sparkles, 
  TrendingUp,
  Users,
  DollarSign,
  Target,
  ArrowRight,
  Zap
} from 'lucide-react';

interface DashboardProps {
  className?: string;
}

export function Dashboard({ className }: DashboardProps) {
  const [askQuery, setAskQuery] = useState('');

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (askQuery.trim()) {
      console.log('Ask AI:', askQuery);
      // Navigate to results view
    }
  };

  const handlePromptClick = (prompt: string) => {
    setAskQuery(prompt);
    // Auto-submit
    setTimeout(() => handleAskSubmit(new Event('submit') as any), 100);
  };

  // Apple-style clean overview data
  const overviewData = [
    {
      title: 'Revenue Growth',
      value: '$2.4M',
      subtitle: 'This quarter',
      change: '+15%',
      trend: 'up',
      color: 'green'
    },
    {
      title: 'Active Projects',
      value: '127',
      subtitle: 'In progress',
      change: '+8',
      trend: 'up',
      color: 'blue'
    },
    {
      title: 'Team Performance',
      value: '94%',
      subtitle: 'Efficiency score',
      change: '+2%',
      trend: 'up',
      color: 'purple'
    }
  ];

  // Clean suggested prompts - shorter and more focused
  const suggestedPrompts = [
    "Show quarterly performance",
    "Compare team efficiency",
    "Revenue by category",
    "Top performing projects"
  ];

  return (
    <div className={cn("space-y-8 p-8", className)}>
      
      {/* Apple-style header */}
      <div className="mb-10">
        <h1 className="text-h1 mb-2">Overview</h1>
        <p className="text-body text-muted">Welcome back, Bella! Your progress is really good. Keep it up</p>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left section - 8 columns */}
        <div className="col-span-8 space-y-6">
          
          {/* Featured Analytics Card */}
          <div className="card-glass p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-h3 mb-1">Product Analytics</h3>
                <p className="text-meta text-muted">Middle/Pro</p>
              </div>
              <button className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            {/* Large metric display */}
            <div className="mb-6">
              <div className="text-5xl font-bold mb-2">9.6 <span className="text-2xl font-medium text-muted">AVERAGE SCORE</span></div>
              <p className="text-meta text-muted">Better than 85% of students</p>
            </div>
            
            {/* Progress indicator */}
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted">In Progress</div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-yellow-400 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <div className="text-sm font-medium">75%</div>
            </div>
          </div>

          {/* Featured Courses Table */}
          <div className="card-glass p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-h3">Featured Courses</h3>
              <button className="text-brand-accent text-sm">View all →</button>
            </div>
            
            {/* Table header */}
            <div className="grid grid-cols-6 gap-4 pb-4 border-b border-border-subtle text-meta text-muted uppercase tracking-wide text-xs">
              <div className="col-span-2">Course name</div>
              <div>Start</div>
              <div>Rate</div>
              <div>Type</div>
              <div>Save</div>
            </div>
            
            {/* Table rows */}
            <div className="space-y-4 mt-4">
              {[
                { name: 'Basics of Mobile UX', instructor: 'Bruno Scott', start: 'Feb 12', rating: 4.8, type: 'UI DESIGN' },
                { name: 'Digital Design System', instructor: 'Bruno Scott', start: 'Feb 14', rating: 4.6, type: 'UI DESIGN' },
                { name: 'Basics of Mobile UX', instructor: 'Bruno Scott', start: 'Feb 16', rating: 4.5, type: 'UI DESIGN' },
                { name: 'Basics of Mobile UX', instructor: 'Bruno Scott', start: 'Feb 18', rating: 4.8, type: 'UI DESIGN' }
              ].map((course, index) => (
                <div key={index} className="grid grid-cols-6 gap-4 py-3 items-center">
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-sm"></div>
                    </div>
                    <div>
                      <div className="text-body font-medium">{course.name}</div>
                      <div className="text-meta text-muted text-sm">{course.instructor}</div>
                    </div>
                  </div>
                  <div className="text-meta">{course.start}</div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="text-meta">{course.rating}</span>
                  </div>
                  <div className="chip-clean text-xs h-6 text-blue-600 bg-blue-50 border-blue-200">{course.type}</div>
                  <div>
                    <button className="p-2">
                      <div className="w-4 h-4 border border-gray-400 rounded"></div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right section - 4 columns */}
        <div className="col-span-4 space-y-6">
          
          {/* Profile card */}
          <div className="card-glass p-6 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-12 h-12 bg-orange-400 rounded-full"></div>
            </div>
            <h3 className="text-h4 mb-1">Irfan Ahsan</h3>
            <p className="text-meta text-muted">Middle UX/UI Designer</p>
          </div>

          {/* Reminders */}
          <div className="card-glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-h4">Reminders</h3>
              <button className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-white text-sm">📅</div>
                <div className="flex-1">
                  <div className="text-meta font-medium">Workshop</div>
                  <div className="text-xs text-muted">Today 2:00 PM</div>
                </div>
                <button className="text-gray-400">⋯</button>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-400 rounded-lg flex items-center justify-center text-white text-sm">📝</div>
                <div className="flex-1">
                  <div className="text-meta font-medium">Homework</div>
                  <div className="text-xs text-muted">Today 2:00 PM</div>
                </div>
                <button className="text-gray-400">⋯</button>
              </div>
            </div>
          </div>

          {/* Upgrade card */}
          <div className="card-glass p-6 bg-gradient-to-br from-yellow-100 to-green-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              <div className="w-4 h-4 bg-green-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-300 rounded-full"></div>
            </div>
            <div className="mb-4">
              <h3 className="text-h4 mb-1">Upgrade to Premium</h3>
            </div>
            <button className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}