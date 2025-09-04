import React from 'react';

// --- TYPE DEFINITIONS ---
interface IconProps {
  path: string;
  className?: string;
}

interface Insight {
  id: number;
  category: string;
  title: string;
  description: string;
  generatedDate: string;
  url: string;
}

interface InsightsScreenProps {
  onBack: () => void;
}

// --- MOCK DATA ---
// To demonstrate how the UI scales with multiple items.
const DUMMY_INSIGHTS: Insight[] = [
  {
    id: 1,
    category: 'Supply Chain',
    title: 'Supply Chain Operations',
    description: 'An in-depth analysis of Q3 supply chain performance, identifying key bottlenecks and optimization opportunities.',
    generatedDate: 'September 1, 2025',
    url: 'https://text-state-48884904.figma.site/',
  },
  {
    id: 2,
    category: 'Marketing',
    title: 'Customer Acquisition Trends',
    description: 'Report on the effectiveness of recent marketing campaigns and emerging trends in customer acquisition channels.',
    generatedDate: 'August 28, 2025',
    url: '#', // Placeholder URL
  },
  {
    id: 3,
    category: 'Financial',
    title: 'Quarterly Expense Report',
    description: 'A detailed breakdown of departmental spending for the previous quarter, with variance analysis against budget.',
    generatedDate: 'August 25, 2025',
    url: '#', // Placeholder URL
  },
];


// --- HELPER COMPONENTS ---

const Icon: React.FC<IconProps> = ({ path, className = 'w-6 h-6' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const CATEGORY_ICONS: { [key: string]: string } = {
  'Supply Chain': 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 003.375-3.375h1.5a1.125 1.125 0 011.125 1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375m15.75 0v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125 1.125v-1.5c0-.621.504-1.125 1.125-1.125h1.5a3.375 3.375 0 003.375 3.375V18.75m-15.75 0h9',
  'Marketing': 'M10.5 6a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM21 21l-5.197-5.197',
  'Financial': 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0h.75A.75.75 0 015.25 6v.75m0 0v-.75A.75.75 0 014.5 6h-.75m16.5 0v.75a.75.75 0 01-.75.75h-.75m0 0v-.75a.75.75 0 01.75-.75h.75m0 0h.75a.75.75 0 01.75.75v.75m0 0v-.75a.75.75 0 01-.75-.75h-.75M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  'Default': 'M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 18V7.125c0-.621.504-1.125 1.125-1.125h3.375M3 15h2.25M3 12h2.25M3 9h2.25M3 6h2.25',
};


// --- REUSABLE CARD COMPONENT ---

const InsightCard: React.FC<{ insight: Insight }> = ({ insight }) => {
  const handleViewInsight = () => {
    window.open(insight.url, '_blank', 'noopener,noreferrer');
  };

  const iconPath = CATEGORY_ICONS[insight.category] || CATEGORY_ICONS['Default'];

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-blue-100 text-blue-700 p-3 rounded-full">
            <Icon path={iconPath} className="w-6 h-6" />
          </div>
          <div>
            <span className="text-sm font-semibold text-blue-600">{insight.category}</span>
            <h3 className="text-xl font-bold text-slate-800">{insight.title}</h3>
          </div>
        </div>
        <p className="text-slate-600 mb-5 text-base leading-relaxed">
          {insight.description}
        </p>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-sm text-slate-500">
            Generated on: <span className="font-medium">{insight.generatedDate}</span>
          </p>
          <button
            onClick={handleViewInsight}
            className="bg-blue-600 text-white font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors whitespace-nowrap"
          >
            <Icon path="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" className="w-5 h-5" />
            View Report
          </button>
        </div>
      </div>
    </div>
  );
};


// --- MAIN SCREEN COMPONENT ---

const InsightsScreen: React.FC<InsightsScreenProps> = ({ onBack }) => {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 font-sans overflow-y-auto">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4">
                <button
                onClick={onBack}
                className="p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors mr-3"
                aria-label="Go back"
                >
                <Icon path="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-3">
                    <Icon path="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.355a7.5 7.5 0 01-7.5 0" className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-bold text-slate-800">Insights</h1>
                </div>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-7xl mx-auto">
            {/* Grid for Insight Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {DUMMY_INSIGHTS.map((insight) => (
                    <InsightCard key={insight.id} insight={insight} />
                ))}
            </div>
        </div>
      </main>
    </div>
  );
};

export default InsightsScreen;