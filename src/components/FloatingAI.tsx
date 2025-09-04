import React, { useState } from 'react';
import { Sparkles, Send, X } from 'lucide-react';

interface FloatingAIProps {
  queryText: string;
  onQueryTextChange: (text: string) => void;
  onQuerySubmit: (query: string) => void;
}

export function FloatingAI({ queryText, onQueryTextChange, onQuerySubmit }: FloatingAIProps) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState('');

  const handleFABClick = () => {
    setIsOverlayOpen(true);
    setLocalQuery(queryText);
  };

  const handleClose = () => {
    setIsOverlayOpen(false);
    setLocalQuery('');
  };

  const handleSubmit = () => {
    if (localQuery.trim()) {
      onQueryTextChange(localQuery);
      onQuerySubmit(localQuery);
      setIsOverlayOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <>
      {/* Floating AI FAB */}
      <div className="floating-ai-fab">
        <div className="glass-capsule" onClick={handleFABClick}>
          <Sparkles size={24} color="rgba(52,48,190,0.8)" />
        </div>
      </div>

      {/* Ask Overlay */}
      {isOverlayOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-1090"
            onClick={handleClose}
          />
          
          {/* Overlay Panel */}
          <div className="ask-overlay">
            <div className="panel-solid p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-h2">Ask AI</h3>
                <button 
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X size={16} color="var(--text-muted)" />
                </button>
              </div>

              {/* Glass Capsule Input */}
              <div className="glass-capsule p-3 mb-4">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about your data..."
                    className="flex-1 bg-transparent border-none outline-none text-body placeholder:text-muted"
                    autoFocus
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!localQuery.trim()}
                    className="w-8 h-8 rounded-lg bg-brand-accent text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:bg-brand-hover"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <p className="text-meta text-muted">Quick actions:</p>
                <div className="space-y-1">
                  {[
                    'Compare by region',
                    'Add margin %',
                    'Forecast next month',
                    'See returns rate',
                    'Top 5 by revenue'
                  ].map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setLocalQuery(action);
                        onQueryTextChange(action);
                        onQuerySubmit(action);
                        setIsOverlayOpen(false);
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-gray-50 text-body transition-colors"
                    >
                      {action} →
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}