import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { cn } from './ui/utils';
import { 
  Send, 
  MessageSquare, 
  ChevronRight,
  Clock,
  Sparkles,
  RotateCcw
} from 'lucide-react';

interface ChatMessage {
  id: string;
  question: string;
  timestamp: Date;
  type: 'user' | 'ai';
}

interface FollowUpSuggestion {
  id: string;
  text: string;
  category: 'drill-down' | 'compare' | 'explain' | 'action';
}

interface RightChatColumnProps {
  expanded?: boolean;
  onToggleExpanded?: () => void;
  onAskQuestion?: (question: string) => void;
  className?: string;
}

export function RightChatColumn({ 
  expanded = true, 
  onToggleExpanded,
  onAskQuestion,
  className 
}: RightChatColumnProps) {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: '1',
      question: 'Show me sales trends for Q4',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      type: 'user'
    },
    {
      id: '2', 
      question: 'Compare Q4 performance with Q3',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      type: 'user'
    },
    {
      id: '3',
      question: 'What caused the revenue spike in November?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      type: 'user'
    }
  ]);

  const followUpSuggestions: FollowUpSuggestion[] = [
    {
      id: '1',
      text: 'Break down by product category',
      category: 'drill-down'
    },
    {
      id: '2',
      text: 'Compare with industry benchmarks',
      category: 'compare'
    },
    {
      id: '3',
      text: 'Analyze seasonal patterns',
      category: 'explain'
    },
    {
      id: '4',
      text: 'Create action plan for Q1',
      category: 'action'
    }
  ];

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentQuestion.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        question: currentQuestion,
        timestamp: new Date(),
        type: 'user'
      };
      
      setChatHistory(prev => [...prev, newMessage]);
      onAskQuestion?.(currentQuestion);
      setCurrentQuestion('');
    }
  };

  const handleFollowUpClick = (suggestion: FollowUpSuggestion) => {
    setCurrentQuestion(suggestion.text);
    handleSubmitQuestion(new Event('submit') as any);
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getCategoryColor = (category: FollowUpSuggestion['category']) => {
    switch (category) {
      case 'drill-down':
        return 'bg-chart-1 text-white';
      case 'compare':
        return 'bg-chart-2 text-white';
      case 'explain':
        return 'bg-chart-3 text-white';
      case 'action':
        return 'bg-chart-4 text-white';
      default:
        return 'bg-muted text-text-primary';
    }
  };

  if (!expanded) {
    return (
      <div className={cn("w-12 border-l border-border-subtle bg-surface flex flex-col", className)}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleExpanded}
          className="p-3 focus-ring"
          title="Expand chat"
        >
          <MessageSquare className="w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("w-80 border-l border-border-subtle bg-surface flex flex-col", className)}>
      {/* Header */}
      <div className="h-16 border-b border-border-subtle flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-text-primary" />
          <h3 className="font-medium text-text-primary">Ask AI</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleExpanded}
          className="p-2 focus-ring"
          title="Collapse chat"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Ask Input */}
        <div className="p-4 border-b border-border-subtle">
          <form onSubmit={handleSubmitQuestion} className="space-y-3">
            <div className="relative">
              <Input
                type="text"
                placeholder="Ask a follow-up question..."
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                className="pr-10 focus-ring"
              />
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 p-2 focus-ring"
                disabled={!currentQuestion.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <Sparkles className="w-3 h-3" />
              <span>AI will analyze your data</span>
            </div>
          </form>
        </div>

        {/* Follow-up Suggestions */}
        <div className="p-4 border-b border-border-subtle">
          <h4 className="text-sm font-medium text-text-primary mb-3">
            Suggested follow-ups
          </h4>
          <div className="space-y-2">
            {followUpSuggestions.map((suggestion) => (
              <Button
                key={suggestion.id}
                variant="outline"
                size="sm"
                className="w-full justify-start text-left h-auto p-3 focus-ring"
                onClick={() => handleFollowUpClick(suggestion)}
              >
                <div className="flex items-center gap-2 w-full">
                  <div className={cn("w-2 h-2 rounded-full flex-shrink-0", getCategoryColor(suggestion.category))} />
                  <span className="text-sm flex-1">{suggestion.text}</span>
                  <Send className="w-3 h-3 text-text-secondary" />
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-text-primary">
                Recent questions
              </h4>
              <Button variant="ghost" size="sm" className="p-1 focus-ring" title="Clear history">
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
            <ScrollArea className="h-full">
              <div className="space-y-3">
                {chatHistory.slice().reverse().map((message) => (
                  <Card 
                    key={message.id}
                    className="cursor-pointer hover:shadow-sm transition-shadow"
                    onClick={() => setCurrentQuestion(message.question)}
                  >
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <p className="text-sm text-text-primary line-clamp-2">
                          {message.question}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <Clock className="w-3 h-3" />
                          <span>{formatRelativeTime(message.timestamp)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-subtle">
          <div className="text-xs text-text-secondary text-center">
            <p>Press Enter to send</p>
            <p className="mt-1">Conversations are saved for 30 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}