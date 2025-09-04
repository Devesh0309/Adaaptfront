import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { AdaaptLogo } from '../AdaabtLogo';

interface LandingScreenProps {
  queryText: string;
  onQueryTextChange: (text: string) => void;
  onQuerySubmit: (query: string) => void;
  onUploadClick: () => void;
  onGetStarted: () => void;
}

export function LandingScreen({ 
  queryText, 
  onQueryTextChange, 
  onQuerySubmit, 
  onUploadClick,
  onGetStarted 
}: LandingScreenProps) {
  const suggestedPrompts = [
    'Show me Q4 sales trends',
    'Compare revenue by region',
    'What are top performing products?',
    'Identify seasonal patterns',
    'Forecast next quarter',
    'Show margin analysis'
  ];

  const handlePromptClick = (prompt: string) => {
    onQueryTextChange(prompt);
    // Focus the ask bar after setting text
    const input = document.querySelector('.askbar-input') as HTMLInputElement;
    if (input) {
      input.focus();
    }
  };

  const handleAskSubmit = () => {
    if (queryText.trim()) {
      onQuerySubmit(queryText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAskSubmit();
    }
  };

  return (
    <div className="root-background min-h-screen">
      {/* Clean Navigation */}
      <nav className="w-full border-b border-gray-200/50 bg-white/95 backdrop-blur-sm">
        <div className="container-grid">
          <div className="flex items-center justify-between h-16">
            <AdaaptLogo className="logo-md" />
            <div className="flex items-center gap-6">
              <button 
                onClick={onGetStarted}
                className="button-primary px-6"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container-grid py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left - Hero Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-display">
                Get AI-powered role-based insights, curated for you!
              </h1>
              <p className="text-body text-muted max-w-lg">
                Transform your data into actionable insights with AI that understands your role, 
                department, and business context. No more generic dashboards.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onGetStarted}
                className="button-primary px-8"
              >
                Start with sample data
              </button>
              <button 
                onClick={onUploadClick}
                className="button-outline px-8"
              >
                Upload a file — try without sign-up
              </button>
            </div>
          </div>

          {/* Right - Ask Demo Module */}
          <div className="space-y-8">
            
            {/* Ask Bar - Glass Capsule */}
            <div className="space-y-4">
              <div className="glass-capsule p-4">
                <div className="flex items-center gap-4">
                  <Search size={20} className="text-muted flex-shrink-0" />
                  
                  <input
                    type="text"
                    value={queryText}
                    onChange={(e) => onQueryTextChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about the sample data..."
                    className="askbar-input flex-1"
                  />
                  
                  <div className="flex items-center gap-3">
                    <div className="askbar-divider" />
                    <div className="chip-clean px-3 py-1 text-meta">
                      Dataset: Sales — Sample
                    </div>
                    <button
                      onClick={handleAskSubmit}
                      disabled={!queryText.trim()}
                      className="askbar-arrow"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested Prompts Grid */}
            <div className="space-y-4">
              <p className="text-meta text-muted">Try asking:</p>
              <div className="grid grid-cols-2 gap-3">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="prompt-tile-clean text-left"
                  >
                    <span className="text-body">{prompt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Link */}
            <div className="text-right">
              <button 
                onClick={onUploadClick}
                className="text-body text-muted hover:text-brand-accent transition-colors"
              >
                Upload a file — try without sign-up →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container-grid py-20 border-t border-gray-200/50">
        <div className="text-center mb-16">
          <h2 className="text-h2 mb-4">Why teams choose adaapt</h2>
          <p className="text-body text-muted max-w-2xl mx-auto">
            Purpose-built for modern data teams who need insights, not just charts.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Role-based insights',
              description: 'AI understands your department and responsibilities to surface relevant insights.',
              icon: '🎯'
            },
            {
              title: 'Natural language queries',
              description: 'Ask questions in plain English. No SQL or complex filters required.',
              icon: '💬'
            },
            {
              title: 'Collaborative analytics',
              description: 'Share insights across teams with context that makes sense to everyone.',
              icon: '🤝'
            }
          ].map((feature, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-accent/10 flex items-center justify-center text-3xl border border-brand-accent/20">
                {feature.icon}
              </div>
              <h3 className="text-h2">{feature.title}</h3>
              <p className="text-body text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}