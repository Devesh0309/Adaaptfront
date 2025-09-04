// src/App.js

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { Dashboard } from './components/screens/Dashboard';
import { DiscoverScreen } from './components/screens/DiscoverScreen';
import AuthScreen from './components/screens/LoginScreen'; // UPDATED: Changed import
import { QuickStartScreen } from './components/screens/QuickStartScreen';
import { DatasetSelectScreen } from './components/screens/DatasetSelectScreen';
import HomeAskAIScreen from './components/screens/HomeAskAIScreen';
import { ResultsStoryboardScreen } from './components/screens/ResultsStoryboardScreen';
import { ResultsAnalysisScreen } from './components/screens/ResultsAnalysisScreen';
import { ShareExportModal } from './components/modals/ShareExportModal';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import apiClient from './api/apiClient';

// Onboarding Flow Types & Interfaces
type OnboardingStep = 'auth' | 'quickstart' | 'dataset-select' | 'home-ask-ai' | 'results-storyboard' | 'complete';
type Screen = 'dashboard' | 'discover' | 'insights' | 'data-sources' | 'alerts' | 'data-management' | 'settings' | 'results-analysis';

interface PrototypeVariables {
  current_dataset: string;
  query_text: string;
  selected_user: string;
  is_admin: boolean;
}

// Helper Components
const CleanLoader = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/50"></div>
    <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 min-w-[256px] shadow-xl">
      <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-gray-700 font-medium">{message}</p>
    </div>
  </div>
);

const ScreenTransition = ({ children, isVisible, direction = 'right' }: { children: React.ReactNode; isVisible: boolean; direction?: 'left' | 'right' | 'up' | 'down'; }) => {
  const getTransform = () => {
    switch (direction) {
      case 'left': return 'translateX(-20px)';
      case 'right': return 'translateX(20px)';
      case 'up': return 'translateY(-20px)';
      case 'down': return 'translateY(20px)';
      default: return 'translateX(20px)';
    }
  };
  return (
    <div className={`transition-all duration-300 ease-out ${isVisible ? 'opacity-100 transform-none' : 'opacity-0'}`} style={{ transform: isVisible ? 'none' : getTransform() }}>
      {children}
    </div>
  );
};


export default function App() {
  // State hooks
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('auth');
  const [previousStep, setPreviousStep] = useState<OnboardingStep>('auth');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right'>('right');
  const [prototypeVars, setPrototypeVars] = useState<PrototypeVariables>({ current_dataset: '', query_text: '', selected_user: '', is_admin: true });
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [inviteToken, setInviteToken] = useState<string | null>(null);

  // Check authentication on app load
  useEffect(() => {
    checkAuthenticationStatus();
  }, []);

  const checkAuthenticationStatus = () => {
    const token = localStorage.getItem('accessToken');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    const hasCompletedSetup = localStorage.getItem('hasCompletedSetup');

    if (token && tokenExpiry && new Date().getTime() < parseInt(tokenExpiry)) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
      
      if (hasCompletedSetup === 'true') {
        setIsFirstLogin(false);
        setOnboardingStep('complete');
      } else {
        setIsFirstLogin(true);
        // We don't know the role yet, so we'll wait for login to decide the first step
        // But if they refresh on quickstart, we need to handle it. For now, this is okay.
        setOnboardingStep('quickstart'); 
      }
    }
    
    setIsInitialLoading(false);
  };

  // Setup toast listener and check for invite token
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('invite');
    if (token) setInviteToken(token);

    const handleToastEvent = (event: any) => {
      const { type, message } = event.detail;
      if (type === 'success') toast.success(message);
      else if (type === 'error') toast.error(message);
      else toast.info(message);
    };

    window.addEventListener('show-toast', handleToastEvent);
    return () => window.removeEventListener('show-toast', handleToastEvent);
  }, []);

  const transitionToStep = (newStep: OnboardingStep, direction: 'left' | 'right' = 'right', message = 'Loading...') => {
    setIsLoading(true);
    setLoadingMessage(message);
    setTransitionDirection(direction);
    
    setTimeout(() => {
      setPreviousStep(onboardingStep);
      setOnboardingStep(newStep);
      setIsLoading(false);
    }, 600);
  };

  // UPDATED: New handleLogin function with role-based routing
  const handleLogin = async () => {
    setIsLoading(true);
    setLoadingMessage('Verifying your account...');

    const token = localStorage.getItem('accessToken');
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        toast.error("Authentication error. Token not found.");
        setIsLoading(false);
        return;
    }

    try {
        const { data: userData } = await apiClient.get('/auth/me');
        const isSuperuser = userData.is_superuser;

        setPrototypeVars(prev => ({ ...prev, is_admin: isSuperuser }));
        setIsAuthenticated(true);
        

        if (isSuperuser && isFirstLogin) {
            transitionToStep('quickstart', 'right', 'Setting up your workspace...');
        } else if (!isSuperuser && isFirstLogin) {
            localStorage.setItem('hasCompletedSetup', 'true');
            transitionToStep('home-ask-ai', 'right', 'Preparing your workspace...');
        } else {
            localStorage.setItem('hasCompletedSetup', 'true');
            transitionToStep('complete', 'right', 'Loading your dashboard...');
        }
    } catch (error) {
        console.error("Failed to fetch user data after login:", error);
        toast.error('Could not retrieve your profile. Please log in again.');
        handleLogout();
    }
  };

  const handleLogout = () => {
    setIsLoading(true);
    setLoadingMessage('Signing you out...');
    
    setTimeout(async () => {
      try {
        await apiClient.post('/auth/logout');
      } catch (error) {
        console.log('Logout API call failed:', error);
      }
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpiry');
      localStorage.removeItem('hasCompletedSetup');
      delete apiClient.defaults.headers.common['Authorization'];
      
      setIsAuthenticated(false);
      setOnboardingStep('auth');
      setIsFirstLogin(true);
      setPrototypeVars({ current_dataset: '', query_text: '', selected_user: '', is_admin: true });
      setCurrentScreen('dashboard');
      setIsLoading(false);
      toast.success("You've been signed out successfully.");
    }, 800);
  };

  const handleSetupFinished = (data: any) => {
    console.log('Quick Start setup complete:', data);
    localStorage.setItem('hasCompletedSetup', 'true');
    setIsFirstLogin(false);
    transitionToStep('home-ask-ai', 'right', 'Setting up Ask AI...')
  };
  
  // ... other handler functions remain the same
  const handleDatasetSelectComplete = (dataset: string, user?: string) => {
    setPrototypeVars(prev => ({ ...prev, current_dataset: dataset, selected_user: user || prev.selected_user }));
    transitionToStep('home-ask-ai', 'right', 'Setting up Ask AI...');
  };

  const handleDatasetSelectSkip = () => {
    setPrototypeVars(prev => ({ ...prev, current_dataset: prev.current_dataset || 'Sales — Sample' }));
    transitionToStep('home-ask-ai', 'right', 'Preparing workspace...');
  };

  const handleAskAIQuery = (query: string) => {
    setPrototypeVars(prev => ({ ...prev, query_text: query }));
    
    if (query.trim()) {
      setIsLoading(true);
      setLoadingMessage('Analyzing your query...');
      
      setTimeout(() => {
        setCurrentScreen('results-analysis');
        setIsLoading(false);
        toast.success('Analysis complete!');
      }, 1500);
    } else {
      toast.error('Pick a suggested prompt or type a question.');
    }
  };

  const handleBackToHome = () => {
    transitionToStep('home-ask-ai', 'left', 'Returning to Ask AI...');
  };

  const handleCompleteOnboarding = () => {
    transitionToStep('complete', 'right', 'Finalizing setup...');
    setIsFirstLogin(false);
    
  };

  const screenMap: Record<string, Screen> = {
    'ask-ai': 'dashboard',
    'discover': 'discover',
    'insights': 'insights',
    'data-sources': 'data-sources',
    'alerts': 'alerts',
    'data-management': 'data-management',
    'settings': 'settings'
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard': return <Dashboard />;
      case 'discover': return <DiscoverScreen />;
      case 'results-analysis':
        return (
          <ResultsAnalysisScreen
            query={prototypeVars.query_text}
            currentDataset={prototypeVars.current_dataset}
            teamScope={"Sales"}
            onBack={() => {
              setCurrentScreen('dashboard');
              setOnboardingStep('home-ask-ai');
            }}
          />
        );
      default: return <Dashboard />;
    }
  };

  const handleNavItemClick = (navItem: string) => {
    const screen = screenMap[navItem] || 'dashboard';
    setCurrentScreen(screen);
    toast.success(`Mapsd to ${navItem.replace('-', ' ')}`);
  };

  if (isInitialLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <CleanLoader message="Checking authentication..." />
      </div>
    );
  }

  // --- RENDER LOGIC ---
  if (!isAuthenticated || onboardingStep !== 'complete') {
    const renderOnboardingStep = () => {
      const stepIndex = ['auth', 'quickstart', 'dataset-select', 'home-ask-ai'].indexOf(onboardingStep);
      const previousIndex = ['auth', 'quickstart', 'dataset-select', 'home-ask-ai'].indexOf(previousStep);
      const direction = stepIndex > previousIndex ? 'right' : 'left';
  
      switch (onboardingStep) {
        case 'auth':
          return (
            <ScreenTransition isVisible={!isLoading} direction={direction}>
              <AuthScreen onLogin={handleLogin} inviteToken={inviteToken} />
            </ScreenTransition>
          );
        case 'quickstart':
          return (
            <ScreenTransition isVisible={!isLoading} direction={direction}>
              <QuickStartScreen 
                onSetupComplete={handleSetupFinished}
                onLogout={handleLogout}
              />
            </ScreenTransition>
          );
        case 'dataset-select':
          return (
            <ScreenTransition isVisible={!isLoading} direction={direction}>
              <DatasetSelectScreen 
                preselectedDataset={prototypeVars.current_dataset}
                onComplete={handleDatasetSelectComplete}
                onSkip={handleDatasetSelectSkip}
              />
            </ScreenTransition>
          );
        case 'home-ask-ai': // ✅ final step
          return (
            <ScreenTransition isVisible={!isLoading} direction={direction}>
              <HomeAskAIScreen onLogout={handleLogout} />
            </ScreenTransition>
          );
        default:
          return (
            <ScreenTransition isVisible={!isLoading} direction="right">
              <AuthScreen onLogin={handleLogin} inviteToken={inviteToken} />
            </ScreenTransition>
          );
      }
    };
  
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="relative z-10">
          {renderOnboardingStep()}
        </div>
        {isLoading && <CleanLoader message={loadingMessage} />}
        <Toaster position="top-right" />
      </div>
    );
  }
  
  // ✅ After onboarding complete, just keep them on home-ask-ai (no DashboardLayout)
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="relative z-10">
        <ScreenTransition isVisible={!isLoading} direction="right">
          <HomeAskAIScreen onLogout={handleLogout} />
        </ScreenTransition>
      </div>
  
      {isLoading && <CleanLoader message={loadingMessage} />}
      <Toaster position="top-right" />
    </div>
  );
}