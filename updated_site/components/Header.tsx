import React from 'react';
import { Search, User, LogOut, Crown, Globe } from 'lucide-react';
import { AuthUser } from '../contexts/AuthContext';
import NeonChartsLogo from '../assets/NeonCharts_logo_160x40.svg';

interface HeaderProps {
  currentView: 'home' | 'products' | 'markets' | 'community' | 'brokers';
  onNavigate: (view: 'home' | 'products' | 'markets' | 'community' | 'brokers') => void;
  onGetStarted: () => void;
  user: AuthUser | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onGetStarted, user, onLogout }) => {
  return (
    <header className="bg-tv-bg border-b border-tv-border px-4 py-3">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Logo + Nav */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 select-none"
            aria-label="NeonCharts Home"
          >
            <img src={NeonChartsLogo} alt="NeonCharts" className="h-14 w-auto" />
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {([
              ['home', 'Home'],
              ['products', 'Products'],
              ['markets', 'Markets'],
              ['community', 'Community'],
              ['brokers', 'Brokers'],
            ] as const).map(([key, label]) => {
              const active = currentView === key;
              return (
                <button
                  key={key}
                  onClick={() => onNavigate(key)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active ? 'bg-tv-panel text-white' : 'text-tv-muted hover:text-white hover:bg-tv-hover'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center bg-tv-panel border border-tv-border rounded-md px-3 h-9">
            <Search size={16} className="text-tv-muted" />
            <input
              placeholder="Search"
              className="bg-transparent outline-none text-sm pl-2 w-56 text-tv-text placeholder:text-tv-muted"
            />
          </div>

          {/* Language (always visible) */}
          <button
            type="button"
            className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-md bg-tv-panel border border-tv-border hover:bg-tv-hover text-sm font-medium text-tv-text"
            aria-label="Language"
          >
            <Globe size={16} className="text-tv-muted" />
            <span className="text-tv-text">EN</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 bg-tv-panel border border-tv-border rounded-full px-3 h-9">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="avatar" className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-tv-hover flex items-center justify-center">
                    <User size={14} />
                  </div>
                )}
                <div className="text-xs text-tv-text">
                  <div className="leading-3 font-semibold">{user.username || user.fullName || user.email}</div>
                  <div className="leading-3 text-[11px] text-tv-muted flex items-center gap-1">
                    {user.plan === 'premium' ? (
                      <>
                        <Crown size={12} /> Premium
                      </>
                    ) : (
                      'Free'
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="h-9 px-3 rounded-md bg-tv-panel border border-tv-border hover:bg-tv-hover text-sm font-semibold flex items-center gap-2"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* User icon (opens login) */}
              <button
                type="button"
                onClick={onGetStarted}
                className="h-9 w-9 rounded-md bg-tv-panel border border-tv-border hover:bg-tv-hover flex items-center justify-center"
                aria-label="Sign in"
              >
                <User size={18} className="text-tv-text" />
              </button>

              {/* Existing Get started */}
              <button
                onClick={onGetStarted}
                className="h-9 px-4 rounded-md bg-tv-blue hover:brightness-110 text-white text-sm font-semibold"
              >
                Get started
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden mt-3 flex items-center gap-1 overflow-x-auto">
        {([
          ['home', 'Home'],
          ['products', 'Products'],
          ['markets', 'Markets'],
          ['community', 'Community'],
          ['brokers', 'Brokers'],
        ] as const).map(([key, label]) => {
          const active = currentView === key;
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                active ? 'bg-tv-panel text-white' : 'text-tv-muted hover:text-white hover:bg-tv-hover'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </header>
  );
};

export default Header;
