
import React, { useState } from 'react';
import { Star, User, ExternalLink, Award, Check } from 'lucide-react';

interface Broker {
  id: string;
  name: string;
  badge?: string;
  assets: string;
  rating: number;
  ratingLabel: string;
  reviews: string;
  accounts: string;
  logoChar: string;
  logoBg: string;
  cardBg: string; // Tailwind classes for background
  isFeatured?: boolean;
  hasOpenAccount?: boolean;
  features?: string[];
  openAccountUrl?: string;
  learnMoreUrl?: string;
}

const BROKERS: Broker[] = [
  {
    id: 'capital',
    name: 'Capital.com',
    badge: 'PLATINUM',
    assets: 'Forex, CFDs',
    rating: 4.8,
    ratingLabel: 'Excellent',
    reviews: '28.2K',
    accounts: '265K',
    logoChar: 'C',
    logoBg: 'bg-black text-white',
    cardBg: 'bg-gradient-to-r from-[#10002b] to-[#3c096c]', // Deep purple gradient
    isFeatured: true,
    hasOpenAccount: true,
    openAccountUrl: 'https://capital.com/en-int',
    learnMoreUrl: 'https://capital.com/en-int/about-us'
  },
  {
    id: 'gate',
    name: 'Gate',
    badge: 'PLATINUM',
    assets: 'Crypto',
    rating: 4.9,
    ratingLabel: 'Excellent',
    reviews: '2.7K',
    accounts: '6.1K',
    logoChar: 'G',
    logoBg: 'bg-[#2962ff] text-white',
    cardBg: 'bg-black border border-tv-border', // Black with border
    isFeatured: false,
    hasOpenAccount: true,
    openAccountUrl: 'https://www.gate.com/',
    learnMoreUrl: 'https://www.gate.com/help'
  },
  {
    id: 'ibkr',
    name: 'Interactive Brokers',
    badge: 'GOLD',
    assets: 'Stocks, Options, Futures',
    rating: 4.6,
    ratingLabel: 'Great',
    reviews: '15.4K',
    accounts: '2.1M',
    logoChar: 'IB',
    logoBg: 'bg-[#b91c1c] text-white',
    cardBg: 'bg-[#1e222d] border border-tv-border',
    isFeatured: false,
    hasOpenAccount: true,
    openAccountUrl: 'https://www.interactivebrokers.com/',
    learnMoreUrl: 'https://www.interactivebrokers.com/en/trading/margin-rates.php'
  }
];

const FILTER_TABS = ['All brokers'];

const BrokersView: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All brokers');

  return (
    <div className="flex flex-col py-12 px-4 animate-in fade-in duration-300 min-h-screen">
      
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center mb-16 text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">
          Made to trade
        </h1>
        <p className="text-xl text-tv-muted font-medium">
          Get trading with verified brokers today.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-2 justify-center">
            {FILTER_TABS.map(tab => (
                <button 
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                        activeFilter === tab 
                        ? 'bg-white text-black' 
                        : 'bg-[#1e222d] text-tv-text hover:bg-[#2a2e39] hover:text-white'
                    }`}
                >
                    {tab}
                </button>
            ))}
          </div>
      </div>

      {/* Broker List */}
      <div className="max-w-4xl mx-auto w-full space-y-6">
          {BROKERS.map(broker => (
              <div 
                key={broker.id} 
                className={`rounded-2xl p-6 md:p-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-300 ${broker.cardBg}`}
              >
                  {/* Featured Tag */}
                  {broker.isFeatured && (
                      <div className="absolute top-4 right-4 bg-white text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider z-10">
                          Featured
                      </div>
                  )}

                  <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                      {/* Left Side: Info */}
                      <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-3">
                              <h2 className="text-2xl font-bold text-white">{broker.name}</h2>
                              {broker.badge && (
                                  <span className="bg-tv-blue text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                                      {broker.badge}
                                  </span>
                              )}
                          </div>
                          
                          <div className="text-xs font-medium text-white/60">
                              Tradable assets: <span className="text-white">{broker.assets}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-6 text-sm">
                              <div className="flex flex-col">
                                  <div className="flex items-center gap-1 font-bold text-white text-lg">
                                      {broker.rating}
                                      <div className="flex">
                                          {[1,2,3,4,5].map(i => (
                                              <Star key={i} size={12} className={i <= Math.round(broker.rating) ? "fill-white text-white" : "text-white/30"} />
                                          ))}
                                      </div>
                                  </div>
                                  <span className="text-xs text-white/60">{broker.ratingLabel}</span>
                              </div>
                              
                              <div className="w-px h-8 bg-white/10"></div>

                              <div className="flex flex-col">
                                  <div className="flex items-center gap-1 font-bold text-white text-lg">
                                      <Check size={16} className="bg-white/20 rounded-full p-0.5" />
                                      {broker.reviews}
                                  </div>
                                  <span className="text-xs text-white/60">Reviews</span>
                              </div>

                              <div className="w-px h-8 bg-white/10"></div>

                              <div className="flex flex-col">
                                  <div className="flex items-center gap-1 font-bold text-white text-lg">
                                      <User size={16} className="bg-white/20 rounded-full p-0.5" />
                                      {broker.accounts}
                                  </div>
                                  <span className="text-xs text-white/60">Accounts</span>
                              </div>
                          </div>

                          <div className="flex flex-wrap gap-3 pt-4">
                              {broker.hasOpenAccount && (
                                  <a 
                                    href={broker.openAccountUrl || '#'} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-white text-black hover:bg-gray-100 font-bold py-2.5 px-6 rounded-md transition-colors text-sm flex items-center gap-2"
                                  >
                                      Open account <ExternalLink size={14} />
                                  </a>
                              )}
                              <a 
                                href={broker.learnMoreUrl || '#'}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-transparent border border-white/30 text-white hover:bg-white/10 font-bold py-2.5 px-6 rounded-md transition-colors text-sm"
                              >
                                  Learn more
                              </a>
                          </div>
                      </div>

                      {/* Right Side: Logo Graphic */}
                      <div className="flex items-center justify-center md:justify-end">
                          <div className="relative w-32 h-32">
                              {/* Stacked Cards Effect */}
                              <div className={`absolute inset-0 rounded-3xl opacity-20 transform translate-x-4 translate-y-2 scale-95 ${broker.logoBg}`}></div>
                              <div className={`absolute inset-0 rounded-3xl opacity-40 transform translate-x-2 translate-y-1 scale-95 ${broker.logoBg}`}></div>
                              <div className={`absolute inset-0 rounded-3xl shadow-xl flex items-center justify-center ${broker.logoBg}`}>
                                  <span className="text-5xl font-bold tracking-tighter">{broker.logoChar}</span>
                              </div>
                              {/* Award Icon if top rated */}
                              {broker.rating >= 4.8 && (
                                <div className="absolute -top-2 -right-2 bg-yellow-400 text-black p-1.5 rounded-full shadow-lg">
                                    <Award size={20} />
                                </div>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          ))}
      </div>

    </div>
  );
};

export default BrokersView;
