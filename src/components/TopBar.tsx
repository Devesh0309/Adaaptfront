import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { AdaaptLogo } from './AdaabtLogo';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Menu, 
  Command,
  Settings,
  LogOut,
  User,
  Moon,
  Sun,
  Keyboard
} from 'lucide-react';
import { cn } from './ui/utils';

interface TopBarProps {
  onMenuToggle?: () => void;
  currentScope?: string;
  isAdmin?: boolean;
  onScopeChange?: (scope: string) => void;
  darkMode?: boolean;
  onThemeToggle?: () => void;
}

export function TopBar({ 
  onMenuToggle, 
  currentScope = "Sales", 
  isAdmin = false,
  onScopeChange,
  darkMode = false,
  onThemeToggle
}: TopBarProps) {
  const [searchValue, setSearchValue] = useState('');
  const [notificationCount] = useState(3);

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle global search
    console.log('Global search:', searchValue);
  };

  const ScopePill = () => {
    if (isAdmin) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                "h-8 px-3 gap-2 transition-smooth glass-effect rounded-lg shadow-sm",
                "hover:bg-opacity-10 hover:shadow-md"
              )}
            >
              <span className="font-medium">{currentScope}</span>
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 glass-effect rounded-xl shadow-xl">
            <DropdownMenuItem onClick={() => onScopeChange?.('Sales')}>
              Sales
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onScopeChange?.('Marketing')}>
              Marketing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onScopeChange?.('Finance')}>
              Finance
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onScopeChange?.('Operations')}>
              Operations
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Badge 
          variant="outline" 
          className="h-8 px-3 font-medium glass-effect"
          style={{
            color: 'var(--text-primary)',
            borderColor: 'var(--glass-border)'
          }}
        >
          {currentScope}
        </Badge>
        <Button 
          variant="link" 
          size="sm" 
          className="h-auto p-0 text-sm transition-smooth"
          style={{
            color: 'var(--brand-primary)'
          }}
        >
          Request access
        </Button>
      </div>
    );
  };

  return (
    <header 
      className="h-16 border-b glass-effect flex items-center justify-between px-6 gap-6 shadow-sm sticky top-0 z-50"
      style={{
        borderColor: 'var(--glass-border)'
      }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuToggle}
          className="p-2 transition-smooth hover:bg-opacity-10"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="gap-3 transition-smooth hover:bg-opacity-10 px-3 py-2"
            >
              <AdaaptLogo size="sm" />
              <span className="font-medium">adaapt</span>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 glass-effect rounded-xl shadow-xl">
            <DropdownMenuItem>
              Personal Workspace
            </DropdownMenuItem>
            <DropdownMenuItem>
              Team Analytics
            </DropdownMenuItem>
            <DropdownMenuItem>
              Enterprise Dashboard
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Create new workspace...
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Center Section - Global Search */}
      <div className="flex-1 max-w-md">
        <form onSubmit={handleGlobalSearch} className="relative">
          <Search 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4" 
            style={{ color: 'var(--text-secondary)' }}
          />
          <Input
            type="text"
            placeholder="Global search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-12 pr-16 h-10 transition-smooth glass-effect rounded-lg"
            style={{
              borderColor: 'var(--glass-border)',
              backgroundColor: 'var(--glass-fill)'
            }}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            <kbd 
              className="px-2 py-1 text-xs font-mono rounded border text-xs"
              style={{
                backgroundColor: 'var(--glass-fill)',
                borderColor: 'var(--glass-border)',
                color: 'var(--text-secondary)'
              }}
            >
              <Command className="w-3 h-3 inline mr-1" />
              K
            </kbd>
          </div>
        </form>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <ScopePill />

        <Button
          variant="ghost"
          size="sm"
          className="relative p-2 transition-smooth hover:bg-opacity-10"
          aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount})` : ''}`}
        >
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {notificationCount}
            </Badge>
          )}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-1 transition-smooth hover:bg-opacity-10">
              <Avatar className="w-8 h-8">
                <AvatarImage src="" alt="User avatar" />
                <AvatarFallback 
                  className="text-sm font-medium text-white"
                  style={{ backgroundColor: 'var(--brand-primary)' }}
                >
                  JD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 glass-effect rounded-xl shadow-xl">
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-3" />
              Profile & Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onThemeToggle}>
              {darkMode ? (
                <Sun className="w-4 h-4 mr-3" />
              ) : (
                <Moon className="w-4 h-4 mr-3" />
              )}
              {darkMode ? 'Light mode' : 'Dark mode'}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Keyboard className="w-4 h-4 mr-3" />
              Keyboard shortcuts
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <LogOut className="w-4 h-4 mr-3" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Brand logo for emphasis */}
        <div className="ml-2">
          <AdaaptLogo size="sm" />
        </div>
      </div>
    </header>
  );
}