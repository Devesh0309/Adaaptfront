import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ResultsAnalysisScreenProps {
  query: string;
  currentDataset: string;
  teamScope: string;
  onBack: () => void;
}

export function ResultsAnalysisScreen({ 
  query, 
  currentDataset, 
  teamScope, 
  onBack 
}: ResultsAnalysisScreenProps) {
  const [followUpQuery, setFollowUpQuery] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [forecastExpanded, setForecastExpanded] = useState(false);

  // Seed Data (EXACT values from specs)
  const LastVsThis = { last: 54110, this: 59240 };
  
  const Daily = [1620,1775,1910,1860,2025,2105,1950,2010,1930,2060,2140,2080,1995,2210,2155,2050,2190,2260,2295,2240,2180,2310,2375,2430,2390,2465,2520,2480,2540,2595];
  
  const TopCustomers = [
    {name:"Orion Retail", value:182500},
    {name:"Northstar LLC", value:173200},
    {name:"Quantum Foods", value:165800},
    {name:"BluePeak Inc.", value:159300},
    {name:"Citrus Labs", value:153900}
  ];
  
  const RevenueByCategory = [
    {name:"Electronics", value:32, fill:"#3430BE"},
    {name:"Home & Kitchen", value:21, fill:"#6A66FF"},
    {name:"Apparel", value:18, fill:"#8B5CF6"},
    {name:"Beauty", value:12, fill:"#A855F7"},
    {name:"Sports", value:9, fill:"#C084FC"},
    {name:"Other", value:8, fill:"#DDD6FE"}
  ];
  
  const ComparativeTable = [
    ["Alpha Headphones","11,240","$562k","+4.2%","+9.8%","+15.3%"],
    ["Nova Smartwatch","8,910","$498k","+2.8%","+7.1%","+11.9%"],
    ["Aero Blender","7,360","$341k","-1.1%","+3.4%","+6.2%"],
    ["Polar Kettle","6,820","$312k","+0.7%","+2.6%","+5.1%"],
    ["Vega Sneakers","6,410","$289k","+3.0%","+4.8%","+8.7%"]
  ];

  // Transform data for charts
  const barData = [
    { name: 'Last month', value: LastVsThis.last },
    { name: 'This month', value: LastVsThis.this }
  ];

  const lineData = Daily.map((value, index) => ({
    day: index + 1,
    transactions: value
  }));

  // Quick actions for sidebar
  const quickActions = [
    'Compare by region',
    'Add margin %',
    'Forecast next month',
    'See returns rate',
    'Top 5 by revenue',
    'Share as PDF'
  ];

  const handleQuickAction = (action: string) => {
    setFollowUpQuery(action);
  };

  const handleFollowUpSubmit = () => {
    if (followUpQuery.trim()) {
      const event = new CustomEvent('show-toast', { 
        detail: { type: 'info', message: `Follow-up: ${followUpQuery}` } 
      });
      window.dispatchEvent(event);
      setFollowUpQuery('');
    }
  };

  const handleExport = (format: string) => {
    const event = new CustomEvent('show-toast', { 
      detail: { type: 'success', message: `Exporting as ${format}...` } 
    });
    window.dispatchEvent(event);
    setShowExportMenu(false);
  };

  const handleSaveToDashboard = () => {
    const event = new CustomEvent('show-toast', { 
      detail: { type: 'success', message: 'Saved to dashboard!' } 
    });
    window.dispatchEvent(event);
  };

  const handleCreateTicket = () => {
    const event = new CustomEvent('show-toast', { 
      detail: { type: 'info', message: 'Creating ticket...' } 
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="root-background min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-6 pt-8 pb-10">
        
        {/* Header */}
        <div className="orchids-card mb-6 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <h2 className="text-h2 mb-1">{query || "How does the number of transactions this month compare to last month?"}</h2>
              <div className="text-small text-muted">
                Scope {currentDataset || "Sales_Transactions"} · {teamScope} · Last refresh Today · Version v1.0 · Diff +2.4%
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={onBack}
                className="orchids-button-outline"
              >
                ← Back
              </button>
              <button className="orchids-button-outline">Share</button>
              <div className="relative">
                <button 
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="orchids-button-outline"
                >
                  Export ▾
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                    <button onClick={() => handleExport('PDF')} className="block w-full text-left px-4 py-2 text-small hover:bg-gray-50">PDF</button>
                    <button onClick={() => handleExport('PPT')} className="block w-full text-left px-4 py-2 text-small hover:bg-gray-50">PPT</button>
                    <button onClick={() => handleExport('XLSX')} className="block w-full text-left px-4 py-2 text-small hover:bg-gray-50">XLSX</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="w-full h-px bg-gray-200"></div>
        </div>

        {/* Main Layout - 12 Column Grid */}
        <div className="grid grid-cols-12 gap-6 lg:grid-cols-12 md:grid-cols-1">
          
          {/* Left Content - 8 Columns */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card A - Bar Chart */}
              <div className="orchids-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-h3">Transactions: This vs Last Month</h3>
                </div>
                <div className="results-chart-container">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E7EAF3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 13, fill: '#1F2937' }}
                      axisLine={{ stroke: '#9AA3B2', strokeWidth: 1 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 13, fill: '#1F2937' }}
                      axisLine={{ stroke: '#9AA3B2', strokeWidth: 1 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#3430BE" 
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
                </div>
                <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
                  <button 
                    onClick={handleSaveToDashboard}
                    className="text-small text-muted hover:text-body transition-colors"
                  >
                    Save to dashboard
                  </button>
                  <span className="text-small text-muted">·</span>
                  <button className="text-small text-muted hover:text-body transition-colors">
                    View details →
                  </button>
                </div>
              </div>

              {/* Card B - Line Chart */}
              <div className="orchids-card">
                <h3 className="text-h3 mb-4">Daily Transactions (last 30 days)</h3>
                <div className="results-chart-container">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E7EAF3" />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fontSize: 13, fill: '#1F2937' }}
                      axisLine={{ stroke: '#9AA3B2', strokeWidth: 1 }}
                    />
                    <YAxis 
                      tick={{ fontSize: 13, fill: '#1F2937' }}
                      axisLine={{ stroke: '#9AA3B2', strokeWidth: 1 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="transactions" 
                      stroke="#3430BE" 
                      strokeWidth={2.5}
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      dot={{ r: 3, fill: "#3430BE" }}
                      fill="url(#areaGradient)"
                    />
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3430BE" stopOpacity={0.12}/>
                        <stop offset="95%" stopColor="#3430BE" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card C - Horizontal Bar */}
              <div className="orchids-card">
                <h3 className="text-h3 mb-4">Top 5 customers by sales ($)</h3>
                <div className="space-y-3">
                  {TopCustomers.map((customer, index) => (
                    <div key={customer.name} className="flex items-center justify-between">
                      <span className="text-body font-medium flex-1">{customer.name}</span>
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${(customer.value / TopCustomers[0].value) * 100}%` }}
                          />
                        </div>
                        <span className="text-small font-medium w-12 text-right">
                          ${Math.round(customer.value / 1000)}k
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card D - Donut Chart */}
              <div className="orchids-card">
                <h3 className="text-h3 mb-4">Revenue by category (%)</h3>
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="results-chart-container">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={RevenueByCategory}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {RevenueByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px',
                            fontSize: '14px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="flex-1 pl-4">
                    <div className="text-center mb-2">
                      <span className="text-h3 font-bold">100%</span>
                    </div>
                    <div className="space-y-1">
                      {RevenueByCategory.map(item => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: item.fill }}
                          ></div>
                          <span className="text-small">{item.name}</span>
                          <span className="text-small font-medium ml-auto">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Storyboard Sections */}
            
            {/* 1) Summary */}
            <div className="orchids-card">
              <h3 className="text-h3 mb-3">Summary</h3>
              <p className="text-body">
                Transactions rose 9.5% MoM (59.2k vs 54.1k). Electronics leads category mix (32%). 
                North shows the strongest YoY growth.
              </p>
            </div>

            {/* 2) Key insights */}
            <div className="orchids-card">
              <h3 className="text-h3 mb-3">Key insights</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-lg">✅</span>
                  <span className="text-body">North region leads YoY growth (+12.6%)</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">🔍</span>
                  <span className="text-body">Top 5 customers contribute ~27% of revenue</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-lg">📈</span>
                  <span className="text-body">9 local highs in the past 30 days</span>
                </div>
              </div>
            </div>

            {/* 3) Comparative analysis */}
            <div className="orchids-card">
              <h3 className="text-h3 mb-3">Comparative analysis</h3>
              <div className="overflow-x-auto">
                <table className="w-full results-comparison-table">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-3 px-4 text-small font-medium text-strong">Item</th>
                      <th className="text-left py-3 px-4 text-small font-medium text-strong">Units</th>
                      <th className="text-left py-3 px-4 text-small font-medium text-strong">Revenue</th>
                      <th className="text-right py-3 px-4 text-small font-medium text-strong">WoW</th>
                      <th className="text-right py-3 px-4 text-small font-medium text-strong">MoM</th>
                      <th className="text-right py-3 px-4 text-small font-medium text-strong">YoY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ComparativeTable.map((row, index) => (
                      <tr key={index} style={{ height: '44px' }} className="border-b border-gray-100">
                        <td className="py-2 px-4 text-body">{row[0]}</td>
                        <td className="py-2 px-4 text-body">{row[1]}</td>
                        <td className="py-2 px-4 text-body">{row[2]}</td>
                        <td className="py-2 px-4 text-body text-right">{row[3]}</td>
                        <td className="py-2 px-4 text-body text-right">{row[4]}</td>
                        <td className="py-2 px-4 text-body text-right">{row[5]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4) Forecast */}
            <div className="orchids-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-h3">Forecast (Holt–Winters)</h3>
                <button 
                  onClick={() => setForecastExpanded(!forecastExpanded)}
                  className="text-small text-muted hover:text-body transition-colors"
                >
                  {forecastExpanded ? 'Collapse' : 'Expand'}
                </button>
              </div>
              {forecastExpanded && (
                <div>
                  <p className="text-body mb-3">
                    Projected next month ≈ 61.5k ± 2.4k (95% CI). Assumes stable promo cadence and seasonality.
                  </p>
                  <div className="h-16 bg-gray-50 rounded-lg flex items-center justify-center">
                    <span className="text-small text-muted">Sparkline visualization would go here</span>
                  </div>
                </div>
              )}
            </div>

            {/* 5) Actionable recommendations */}
            <div className="orchids-card">
              <h3 className="text-h3 mb-3">Actionable recommendations</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" />
                  <div className="flex-1">
                    <div className="text-body">Increase Electronics inventory by 8–10% before promo weeks</div>
                    <div className="text-small text-muted">Owner: Ops (7d)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" />
                  <div className="flex-1">
                    <div className="text-body">Target Orion Retail & Northstar with 2% upsell bundles</div>
                    <div className="text-small text-muted">Owner: Sales (14d)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1" />
                  <div className="flex-1">
                    <div className="text-body">Shift 5% media to regions &gt;10% YoY</div>
                    <div className="text-small text-muted">Owner: Marketing (7d)</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={handleCreateTicket}
                  className="orchids-button-outline"
                >
                  Create ticket
                </button>
              </div>
            </div>

            {/* 6) Risks & alerts */}
            <div className="orchids-card">
              <h3 className="text-h3 mb-3">Risks & alerts</h3>
              <div className="space-y-3">
                <div className="results-risk-alert warning flex gap-3 p-3">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <div className="text-body font-medium">COD at 8% with higher return risk</div>
                    <div className="text-small text-muted">Monitor RMA trends closely</div>
                  </div>
                </div>
                <div className="results-risk-alert warning flex gap-3 p-3">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <div className="text-body font-medium">Aero Blender shows weekly dip</div>
                    <div className="text-small text-muted">Check supply latency and inventory levels</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - 4 Columns (Sticky) */}
          <div className="col-span-12 lg:col-span-4">
            <div className="sticky top-8 lg:sticky lg:top-8 md:relative md:top-auto">
              <div className="orchids-card">
                <h3 className="text-h3 mb-4">Ask a follow-up…</h3>
                
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ask a follow-up…"
                      value={followUpQuery}
                      onChange={(e) => setFollowUpQuery(e.target.value)}
                      className="orchids-input-text flex-1"
                      style={{ height: '44px', borderRadius: '10px' }}
                      onKeyPress={(e) => e.key === 'Enter' && handleFollowUpSubmit()}
                    />
                    <button 
                      onClick={handleFollowUpSubmit}
                      disabled={!followUpQuery.trim()}
                      className="orchids-button-primary disabled:opacity-50"
                      style={{ minWidth: '80px' }}
                    >
                      Send
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {quickActions.map(action => (
                    <button
                      key={action}
                      onClick={() => handleQuickAction(action)}
                      className="w-full text-left p-2 text-body hover:bg-gray-50 rounded transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
                
                <p className="text-small text-muted">History appears after first exchange.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}