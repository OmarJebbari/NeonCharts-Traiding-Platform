import React, { useMemo, useState } from 'react';
import Header from './components/Header';
import Ticker from './components/Ticker';
import { HomeView } from './components/HomeView';
import CalendarView from './components/CalendarView';
import MarketsView from './components/MarketsView';
import SymbolDetailView from './components/SymbolDetailView';
import CommunityView from './components/CommunityView';
import BrokersView from './components/BrokersView';
import { GetStartedModal } from './components/GetStartedModal';
import { MarketItem } from './types';
import { useAuth } from './contexts/AuthContext';

type View = 'home' | 'products' | 'markets' | 'symbol-detail' | 'community' | 'brokers' | 'login';

const App: React.FC = () => {
  const { user, loading, logout } = useAuth();

  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedSymbol, setSelectedSymbol] = useState<MarketItem | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    window.clearTimeout((showToast as any)._t);
    (showToast as any)._t = window.setTimeout(() => setToast(null), 3200);
  };

  const openLogin = () => {
    setSelectedSymbol(null);
    setCurrentView('login');
    setShowAuthModal(true);
  };

  const handleNavigate = (view: Exclude<View, 'symbol-detail' | 'login'>) => {
    setCurrentView(view);
    setSelectedSymbol(null);
  };

  const handleSymbolClick = (item: MarketItem) => {
    if (loading) {
      showToast('Checking session…');
      return;
    }

    if (!user) {
      showToast('Please sign in to access Symbol Detail.');
      openLogin();
      return;
    }

    if (user.plan !== 'premium') {
      showToast('Premium required to access Symbol Detail.');
      setCurrentView('home');
      setSelectedSymbol(null);
      return;
    }

    setSelectedSymbol(item);
    setCurrentView('symbol-detail');
  };

  const handleBackToMarkets = () => {
    setCurrentView('markets');
    setSelectedSymbol(null);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setCurrentView('home');
    setSelectedSymbol(null);
    showToast('Signed in. Redirected to Home.');
  };

  const handleLogout = async () => {
    await logout();
    setCurrentView('home');
    setSelectedSymbol(null);
    showToast('Logged out. Redirected to Home.');
  };

  const headerView = useMemo(() => {
    // Keep header tabs stable even when user is on symbol-detail/login
    if (currentView === 'symbol-detail') return 'markets';
    if (currentView === 'login') return 'home';
    return currentView;
  }, [currentView]);

  return (
    <div className="min-h-screen bg-tv-bg text-tv-text font-sans selection:bg-tv-blue selection:text-white">
      {showAuthModal && (
        <GetStartedModal onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />
      )}

      {toast ? (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200]">
          <div className="px-4 py-2 rounded-full bg-tv-panel border border-tv-border text-sm text-tv-text shadow-lg">
            {toast}
          </div>
        </div>
      ) : null}

      <div className="sticky top-0 z-50">
        <Header
          currentView={headerView as any}
          onNavigate={handleNavigate}
          onGetStarted={openLogin}
          user={user}
          onLogout={handleLogout}
        />
        <Ticker />
      </div>

      <main className="mx-auto w-full">
        {currentView === 'home' && <HomeView onNavigate={() => handleNavigate('community')} />}
        <div className={currentView === 'home' ? '' : 'max-w-[1400px] mx-auto px-4'}>
          {currentView === 'products' && <CalendarView />}
          {currentView === 'markets' && <MarketsView onSymbolClick={handleSymbolClick} />}
          {currentView === 'community' && <CommunityView />}
          {currentView === 'brokers' && <BrokersView />}
          {currentView === 'symbol-detail' && selectedSymbol && <SymbolDetailView item={selectedSymbol} onBack={handleBackToMarkets} />}
        </div>
      </main>
    </div>
  );
};

export default App;
