
import React from 'react';
import { ArrowRight, Clock, ExternalLink, TrendingUp } from 'lucide-react';

const NEWS_ARTICLES = [
  {
    id: 1,
    title: "S&P 500 hits fresh record as tech rally broadens",
    source: "Bloomberg",
    time: "45m ago",
    image: "https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 2,
    title: "Bitcoin surges past $64k amid ETF inflows",
    source: "CoinDesk",
    time: "2h ago",
    image: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 3,
    title: "Oil prices stabilize as OPEC+ debates production cuts",
    source: "Reuters",
    time: "3h ago",
    image: "https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 4,
    title: "Apple unveils new AI features for iPhone",
    source: "The Verge",
    time: "5h ago",
    image: "https://images.unsplash.com/photo-1621768216002-5ac171876625?auto=format&fit=crop&q=80&w=600"
  }
];

interface HomeViewProps {
  onNavigate: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col animate-in fade-in duration-500 min-h-screen relative font-sans bg-tv-bg">
      
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex flex-col overflow-hidden">
          {/* Background Video */}
          <div className="absolute inset-0 z-0">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-60"
                poster="https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=2072&auto=format&fit=crop"
              >
                 {/* Financial Market Data Animation */}
                 <source src="https://videos.pexels.com/video-files/3209211/3209211-hd_1920_1080_25fps.mp4" type="video/mp4" />
                 Your browser does not support the video tag.
              </video>
              
              {/* Gradient Overlays for readability and style */}
              <div className="absolute inset-0 bg-gradient-to-t from-tv-bg via-tv-bg/40 to-black/60"></div>
              <div className="absolute inset-0 bg-black/40"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 flex-1">
            {/* Main Heading */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter mb-8 leading-none drop-shadow-2xl">
              Look first / <br />
              Then leap.
            </h1>
            
            {/* Subheading */}
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl font-normal leading-relaxed drop-shadow-lg text-shadow-sm">
              The world's fastest charting platform and social network for traders and investors.
            </p>
            
            {/* CTA Button */}
            <div className="flex flex-col items-center">
                <button 
                    onClick={onNavigate}
                    className="bg-white text-black hover:bg-gray-100 text-xl font-bold px-10 py-5 rounded-full transition-all transform hover:scale-105 shadow-[0_0_50px_rgba(255,255,255,0.3)] flex items-center gap-2"
                >
                    Get started for free
                    <ArrowRight size={24} />
                </button>
                <p className="text-gray-300 text-sm mt-6 font-medium tracking-wide drop-shadow">$0 forever, no credit card needed</p>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-10 text-white/70">
             <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2 backdrop-blur-sm">
                 <div className="w-1 h-2 bg-white rounded-full"></div>
             </div>
          </div>
      </section>

      {/* Market News Section */}
      <section className="bg-tv-bg py-16 px-4 md:px-8 border-t border-tv-border z-10 relative">
          <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-end mb-8">
                  <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">Market Pulse</h2>
                      <p className="text-tv-muted text-lg">Essential stories moving the markets today.</p>
                  </div>
                  <button 
                    onClick={onNavigate}
                    className="hidden md:flex items-center gap-2 text-tv-blue font-semibold hover:text-blue-400 transition-colors"
                  >
                      View all news <ArrowRight size={18} />
                  </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {NEWS_ARTICLES.map((news) => (
                      <div key={news.id} className="group cursor-pointer bg-[#1e222d] rounded-xl overflow-hidden border border-tv-border hover:border-tv-muted/50 transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col h-full">
                          <div className="aspect-[3/2] overflow-hidden relative">
                              <img 
                                src={news.image} 
                                alt={news.title}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                                  <TrendingUp size={10} className="text-tv-blue" />
                                  Trending
                              </div>
                          </div>
                          
                          <div className="p-5 flex flex-col flex-1">
                              <div className="flex items-center gap-2 mb-3 text-xs font-medium text-tv-muted">
                                  <span className="text-tv-blue bg-tv-blue/10 px-2 py-0.5 rounded">{news.source}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1"><Clock size={12} /> {news.time}</span>
                              </div>
                              
                              <h3 className="text-lg font-bold text-white leading-snug mb-3 group-hover:text-tv-blue transition-colors">
                                  {news.title}
                              </h3>
                              
                              <div className="mt-auto pt-4 flex justify-between items-center border-t border-[#2a2e39]">
                                  <span className="text-xs text-tv-muted group-hover:text-white transition-colors">Read full story</span>
                                  <ExternalLink size={14} className="text-tv-muted group-hover:text-white transition-colors" />
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
              
              <div className="mt-8 text-center md:hidden">
                  <button 
                    onClick={onNavigate}
                    className="inline-flex items-center gap-2 text-tv-blue font-semibold hover:text-blue-400 transition-colors"
                  >
                      View all news <ArrowRight size={18} />
                  </button>
              </div>
          </div>
      </section>

    </div>
  );
};
