import React, { useState } from 'react';

interface ResultsStoryboardScreenProps {
  query: string;
  dataset: string;
  onBackToHome: () => void;
  onComplete: () => void;
}

export function ResultsStoryboardScreen({ query, dataset, onBackToHome, onComplete }: ResultsStoryboardScreenProps) {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'ai', message: string}>>([]);

  // Simplified data
  const monthlyData = [54110, 59240];
  const followUpSuggestions = [
    'Compare by region',
    'Add margin %', 
    'Forecast next month',
    'See returns rate',
    'Top 5 by revenue',
    'Share as PDF'
  ];

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    setChatHistory(prev => [...prev, { type: 'user', message: chatInput.trim() }]);
    setTimeout(() => {
      setChatHistory(prev => [...prev, { 
        type: 'ai', 
        message: `I can help you explore "${chatInput.trim()}" further.`
      }]);
    }, 1000);
    setChatInput('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setChatInput(suggestion);
  };

  return (
    <div className="min-h-screen p-8">
      
      {/* Apple-style minimal header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={onBackToHome}
              className="button-clean-secondary text-sm px-4 py-2 h-auto"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-h2">{query}</h1>
              <p className="text-meta text-muted">{dataset || 'Sales'} • Last refresh: Today 9:41 AM</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="chip-clean text-xs text-green-600 bg-green-50 border-green-200">
              +9.5% MoM
            </div>
            <button className="button-clean-secondary text-sm px-4 py-2 h-auto">Export</button>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Main content - 8 columns */}
        <div className="col-span-8 space-y-6">
          
          {/* Key insight chart - Apple style */}
          <div className="card-glass p-8">
            <div className="mb-6">
              <h2 className="text-h2 mb-1">Monthly Transaction Growth</h2>
              <p className="text-body text-muted">Comparing this month vs last month performance</p>
            </div>
            
            {/* Clean, spacious chart */}
            <div className="mb-8">
              <div className="h-64 flex items-end justify-center gap-16 py-8">
                {/* Last Month */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div 
                      className="w-20 bg-gray-300 rounded-t-xl transition-all duration-700"
                      style={{ height: `${(monthlyData[0] / Math.max(...monthlyData)) * 160}px` }}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-meta text-muted mb-1">Last Month</div>
                    <div className="text-h4">{monthlyData[0].toLocaleString()}</div>
                  </div>
                </div>
                
                {/* This Month */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div 
                      className="w-20 bg-brand-accent rounded-t-xl transition-all duration-700"
                      style={{ height: `${(monthlyData[1] / Math.max(...monthlyData)) * 160}px` }}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-meta text-muted mb-1">This Month</div>
                    <div className="text-h4">{monthlyData[1].toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button className="button-clean-primary">
                View detailed breakdown
              </button>
            </div>
          </div>

          {/* Key insights - Apple style */}
          <div className="card-glass p-8">
            <h3 className="text-h2 mb-6">Key Insights</h3>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <p className="text-body leading-relaxed">
                    <strong>9.5% month-over-month growth</strong> driven by improved weekend performance and successful promotional campaigns.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 text-sm">i</span>
                </div>
                <div>
                  <p className="text-body leading-relaxed">
                    Mobile transactions increased <strong>34% compared to last month</strong>, indicating strong mobile adoption.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-yellow-600 text-sm">!</span>
                </div>
                <div>
                  <p className="text-body leading-relaxed">
                    Average order value decreased <strong>2.1% despite volume growth</strong> - opportunity for upselling strategies.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary - Apple style */}
          <div className="card-glass p-8">
            <h3 className="text-h2 mb-4">Summary</h3>
            <p className="text-body leading-relaxed">
              Overall performance shows strong positive momentum with transactions up 9.5% month-over-month. 
              The growth is primarily driven by increased weekend activity and successful promotional campaigns. 
              Mobile engagement is particularly strong, suggesting our mobile optimization efforts are paying off.
            </p>
          </div>
        </div>

        {/* Chat sidebar - 4 columns */}
        <div className="col-span-4">
          <div className="sticky top-8">
            <div className="card-glass p-6 h-[500px] flex flex-col">
              
              <h3 className="text-h3 mb-6">Ask follow-up questions</h3>
              
              {/* Clean input */}
              <div className="mb-6">
                <div className="glass-panel p-3 rounded-xl">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                    placeholder="Ask a follow-up…"
                    className="w-full bg-transparent border-none outline-none text-body"
                  />
                </div>
              </div>

              {/* Suggestions */}
              <div className="mb-6">
                <h4 className="text-label text-muted mb-3">SUGGESTIONS</h4>
                <div className="grid grid-cols-1 gap-2">
                  {followUpSuggestions.slice(0, 3).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="chip-clean h-9 text-sm justify-start px-4 text-left"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat history */}
              <div className="flex-1">
                <h4 className="text-label text-muted mb-3">HISTORY</h4>
                {chatHistory.length === 0 ? (
                  <div className="glass-panel p-4 text-center text-meta text-muted">
                    Your questions will appear here
                  </div>
                ) : (
                  <div className="space-y-3 overflow-y-auto">
                    {chatHistory.map((message, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-lg text-meta ${
                          message.type === 'user' 
                            ? 'glass-panel bg-blue-50/50' 
                            : 'glass-panel'
                        }`}
                      >
                        {message.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}