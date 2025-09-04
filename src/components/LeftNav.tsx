import React from 'react';
import { AdaaptLogo } from './AdaabtLogo';

interface LeftNavProps {
  activeItem?: string;
  isAdmin?: boolean;
  onNavItemClick?: (navItem: string) => void;
}

export function LeftNav({ activeItem = 'ask-ai', isAdmin = false, onNavItemClick }: LeftNavProps) {
  const navItems = [
    {
      id: 'ask-ai',
      label: 'Ask AI',
      icon: '🤖',
      description: 'Chat with AI',
      category: 'main'
    },
    {
      id: 'discover',
      label: 'Discover',
      icon: '🔍',
      description: 'Explore insights',
      category: 'main'
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: '💡',
      description: 'Saved analyses',
      category: 'main'
    },
    {
      id: 'data-sources',
      label: 'Data Sources',
      icon: '📊',
      description: 'Manage data',
      category: 'main'
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: '🔔',
      description: 'Notifications',
      category: 'main'
    }
  ];

  const bottomItems = [
    {
      id: 'data-management',
      label: 'Data Management',
      icon: '🛡️',
      description: 'Privacy settings'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      description: 'Preferences'
    }
  ];

  const renderNavItem = (item: any, isActive: boolean = false) => (
    <div
      key={item.id}
      className={`group relative flex items-center gap-3 p-3 rounded-sharp cursor-pointer transition-smooth ${
        isActive 
          ? 'card-glass shadow-md' 
          : 'hover:glass-dialog hover:shadow-sm'
      }`}
      style={{
        color: isActive ? 'var(--text-on-glass)' : 'rgba(255, 255, 255, 0.8)',
        fontWeight: isActive ? '600' : '500'
      }}
      onClick={() => onNavItemClick?.(item.id)}
    >
      {/* Icon */}
      <div className={`flex items-center justify-center w-8 h-8 rounded-md transition-smooth ${
        isActive 
          ? 'shadow-sm' 
          : 'group-hover:bg-white/10'
      }`}
      style={{
        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
      }}>
        <span className="text-lg">{item.icon}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm leading-tight">
          {item.label}
        </div>
        <div 
          className="text-xs mt-0.5 opacity-75"
          style={{ color: 'rgba(255, 255, 255, 0.6)' }}
        >
          {item.description}
        </div>
      </div>

      {/* Active indicator */}
      {isActive && (
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 rounded-full"
          style={{ backgroundColor: 'var(--brand-primary)' }}
        />
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-6">
        <div 
          className="flex items-center gap-3 p-4 rounded-sharp-lg"
          style={{
            background: 'var(--glass-fill-dialog)',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
        >
          <AdaaptLogo size="md" />
          <div>
            <h1 
              className="font-semibold text-lg leading-tight"
              style={{ color: 'var(--text-on-glass)' }}
            >
              adaapt
            </h1>
            <p 
              className="text-xs opacity-75"
              style={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              AI Analytics Platform
            </p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="mb-6">
        <div 
          className="p-4 rounded-sharp-lg"
          style={{
            background: 'var(--glass-fill-dialog)',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold shadow-md text-sm"
              style={{ background: 'var(--gradient-primary)' }}
            >
              JD
            </div>
            <div className="flex-1 min-w-0">
              <div 
                className="font-semibold text-sm leading-tight"
                style={{ color: 'var(--text-on-glass)' }}
              >
                John Doe
              </div>
              <div 
                className="text-xs opacity-75 truncate"
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Data Analyst
              </div>
            </div>
            <button className="opacity-50 hover:opacity-100 transition-smooth p-1 rounded-md">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1">
        <div className="space-y-1">
          <div 
            className="text-xs font-medium uppercase tracking-wider px-3 pb-2"
            style={{ color: 'rgba(255, 255, 255, 0.5)' }}
          >
            Main
          </div>
          {navItems.map(item => renderNavItem(item, item.id === activeItem))}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 space-y-1">
          <div 
            className="text-xs font-medium uppercase tracking-wider px-3 pb-2"
            style={{ color: 'rgba(255, 255, 255, 0.5)' }}
          >
            Quick Actions
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button 
              className="p-3 rounded-sharp text-center transition-smooth border hover:shadow-md"
              style={{
                background: 'var(--glass-fill-dialog)',
                borderColor: 'var(--glass-border)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
            >
              <div className="text-lg mb-1">📈</div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-on-glass)' }}>
                New Chart
              </div>
            </button>
            <button 
              className="p-3 rounded-sharp text-center transition-smooth border hover:shadow-md"
              style={{
                background: 'var(--glass-fill-dialog)',
                borderColor: 'var(--glass-border)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
            >
              <div className="text-lg mb-1">📤</div>
              <div className="text-xs font-medium" style={{ color: 'var(--text-on-glass)' }}>
                Export
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="space-y-1 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        {bottomItems.map(item => renderNavItem(item, item.id === activeItem))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="text-center">
          <div 
            className="text-xs opacity-60"
            style={{ color: 'rgba(255, 255, 255, 0.5)' }}
          >
            © 2024 adaapt
          </div>
          <div 
            className="text-xs opacity-60 mt-1"
            style={{ color: 'rgba(255, 255, 255, 0.5)' }}
          >
            v2.1.0
          </div>
        </div>
      </div>
    </div>
  );
}