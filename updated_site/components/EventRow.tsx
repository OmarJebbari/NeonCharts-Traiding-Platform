
import React, { useState } from 'react';
import { EconomicEvent } from '../types';
import { ChevronDown, Sparkles, Sun, Moon, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { analyzeEconomicEvent } from '../services/geminiService';

interface EventRowProps {
  event: EconomicEvent;
}

const VolatilityIndicator: React.FC<{ level: 1 | 2 | 3 }> = ({ level }) => {
  // Enhanced color palette with better contrast
  const activeColor = level === 3 ? 'bg-[#f23645] shadow-[0_0_8px_rgba(242,54,69,0.4)]' : level === 2 ? 'bg-[#f59e0b] shadow-[0_0_6px_rgba(245,158,11,0.3)]' : 'bg-[#2962ff] shadow-[0_0_6px_rgba(41,98,255,0.3)]';
  // Lighter inactive color for better visibility against dark background
  const inactiveColor = 'bg-[#434651]';

  return (
    <div className="flex gap-[4px] items-end h-3.5" title={`Volatility: ${level}/3`}>
      <div className={`w-1.5 rounded-[1px] h-1.5 transition-all duration-300 ${level >= 1 ? activeColor : inactiveColor}`}></div>
      <div className={`w-1.5 rounded-[1px] h-2.5 transition-all duration-300 ${level >= 2 ? activeColor : inactiveColor}`}></div>
      <div className={`w-1.5 rounded-[1px] h-3.5 transition-all duration-300 ${level >= 3 ? activeColor : inactiveColor}`}></div>
    </div>
  );
};

const EventRow: React.FC<EventRowProps> = ({ event }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (analysis) {
        setIsExpanded(!isExpanded);
        return;
    }

    setIsExpanded(true);
    setIsLoading(true);
    const result = await analyzeEconomicEvent(event);
    setAnalysis(result);
    setIsLoading(false);
  };

  const isCompanyEvent = event.category === 'Earnings' || event.category === 'Revenue' || event.category === 'Dividends';

  // --- Logic for Values ---
  const actualVal = parseFloat(event.actual?.replace(/[^0-9.-]/g, '') || '0');
  const forecastVal = parseFloat(event.forecast?.replace(/[^0-9.-]/g, '') || '0');
  
  const hasActual = event.actual && event.actual !== '—';
  const hasForecast = event.forecast && event.forecast !== '—';

  // Determine color for actual value based on forecast
  const isPositive = hasActual && hasForecast && actualVal > forecastVal;
  const isNegative = hasActual && hasForecast && actualVal < forecastVal;
  
  // Use precise TradingView hex colors
  const valueColor = isPositive ? 'text-[#089981]' : isNegative ? 'text-[#f23645]' : 'text-[#d1d4dc]';

  // For Surprise: + is green, - is red
  const surpriseVal = parseFloat(event.surprise?.replace('%', '') || '0');
  const isSurprisePositive = surpriseVal > 0;
  const isSurpriseNegative = surpriseVal < 0;

  if (isCompanyEvent) {
      return (
        <div className="border-b border-tv-border last:border-0 bg-tv-bg">
            <div 
                onClick={() => setIsExpanded(!isExpanded)}
                className={`group grid grid-cols-[80px_1fr_100px_100px_100px_120px] items-center py-3.5 px-4 hover:bg-[#2a2e39] cursor-pointer transition-colors duration-200 text-sm border-l-[3px] ${isExpanded ? 'border-l-tv-blue bg-[#2a2e39]' : 'border-l-transparent'}`}
            >
                {/* Time Column with Icon */}
                <div className="flex items-center gap-2.5 text-[#787b86] font-mono text-xs">
                    {event.period === 'pre' && <Sun size={15} className="text-[#f59e0b]" />}
                    {event.period === 'post' && <Moon size={15} className="text-[#2962ff]" />}
                    {!event.period && event.time === '—' && <span className="w-[15px]"></span>}
                    <span className="group-hover:text-[#d1d4dc] transition-colors">{event.time}</span>
                </div>

                {/* Company Column */}
                <div className="flex items-center gap-3 overflow-hidden pr-4">
                    <div className="w-9 h-9 rounded-lg bg-[#1e222d] border border-[#2a2e39] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm group-hover:border-[#787b86]/50 transition-colors">
                        {event.logo ? (
                           <span className="font-bold">{event.logo}</span>
                        ) : (
                           <span className="font-bold">{event.title[0]}</span>
                        )}
                    </div>
                    <div className="flex flex-col min-w-0 justify-center">
                        <span className="text-[#d1d4dc] font-bold truncate tracking-tight text-[13px] group-hover:text-white transition-colors">{event.title}</span>
                        {event.ticker && (
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[10px] bg-[#2a2e39] text-[#2962ff] px-1.5 rounded-sm font-mono font-bold tracking-wide group-hover:bg-[#1e222d] transition-colors">{event.ticker}</span>
                            </div>
                        )}
                    </div>
                     <button 
                        onClick={handleAnalyze}
                        className="opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-tv-blue/10 hover:text-tv-blue text-[#787b86] rounded-full ml-auto transform translate-x-2 group-hover:translate-x-0"
                        title="Analyze with Gemini"
                    >
                        <Sparkles size={16} />
                    </button>
                </div>

                {/* Estimate / Ex-Date */}
                <div className="text-right text-[#787b86] font-mono tabular-nums text-xs font-medium">
                    {event.category === 'Dividends' ? (event.exDividendDate || '—') : (event.forecast || '—')}
                </div>

                {/* Actual / Amount */}
                <div className={`text-right font-bold font-mono tabular-nums text-sm ${valueColor} transition-colors`}>
                    {event.category === 'Dividends' ? (event.dividendAmount || '—') : (event.actual || '—')}
                </div>

                {/* Surprise / Yield */}
                <div className="flex justify-end">
                    {event.category === 'Dividends' ? (
                        <span className="text-[#2962ff] font-mono text-xs font-bold bg-[#2962ff]/10 px-2 py-1 rounded-md">{event.dividendYield || '—'}</span>
                    ) : event.surprise && event.surprise !== '—' ? (
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold font-mono tabular-nums border ${
                            isSurprisePositive ? 'text-[#089981] bg-[#089981]/10 border-[#089981]/20' : 
                            isSurpriseNegative ? 'text-[#f23645] bg-[#f23645]/10 border-[#f23645]/20' : 
                            'text-[#787b86] border-transparent'
                        }`}>
                            {isSurprisePositive && <TrendingUp size={10} />}
                            {isSurpriseNegative && <TrendingDown size={10} />}
                            {event.surprise}
                        </div>
                    ) : (
                        <span className="text-[#787b86]/50 font-mono text-xs">—</span>
                    )}
                </div>

                {/* Market Cap / Pay Date */}
                <div className="text-right text-[#787b86] font-mono text-xs tabular-nums font-medium">
                    {event.category === 'Dividends' ? (event.paymentDate || '—') : (event.marketCap || '—')}
                </div>
            </div>

            {/* Expansion Panel */}
            {isExpanded && (
                <div className="bg-[#181b24] px-6 py-6 border-t border-[#2a2e39] animate-in fade-in slide-in-from-top-1 duration-200 shadow-inner">
                   <div className="grid grid-cols-[280px_1fr] gap-8">
                       <div className="space-y-3">
                           <div className="h-32 bg-[#1e222d] rounded-lg border border-[#2a2e39] flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 flex items-end justify-between px-3 pb-3 gap-1.5 opacity-80">
                                    <div className="w-full bg-[#2962ff]/20 h-[40%] rounded-t-sm border-t border-[#2962ff]/30"></div>
                                    <div className="w-full bg-[#2962ff]/40 h-[60%] rounded-t-sm border-t border-[#2962ff]/50"></div>
                                    <div className="w-full bg-[#2962ff]/30 h-[30%] rounded-t-sm border-t border-[#2962ff]/40"></div>
                                    <div className="w-full bg-[#2962ff]/60 h-[80%] rounded-t-sm border-t border-[#2962ff]/70"></div>
                                    <div className="w-full bg-[#2962ff]/50 h-[50%] rounded-t-sm border-t border-[#2962ff]/60"></div>
                                </div>
                                <span className="text-xs text-[#787b86] z-10 font-mono bg-[#131722]/90 px-2 py-1 rounded backdrop-blur border border-[#2a2e39]">Quarterly Performance</span>
                           </div>
                           <div className="flex justify-between text-xs text-[#787b86] font-mono px-1">
                               <span>Q1</span>
                               <span>Q2</span>
                               <span>Q3</span>
                               <span>Q4</span>
                           </div>
                       </div>
                       
                       <div className="space-y-3">
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                  <div className="p-1.5 bg-gradient-to-br from-[#2962ff] to-[#7c3aed] rounded-md shadow-lg shadow-blue-900/20">
                                    <Sparkles size={14} className="text-white" />
                                  </div>
                                  <h4 className="text-sm font-bold text-white tracking-tight">AI Insight</h4>
                              </div>
                              <span className="text-[10px] text-[#787b86] uppercase font-bold tracking-wider opacity-70">Powered by Gemini</span>
                          </div>
                          
                          <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg p-5 min-h-[100px] shadow-sm relative">
                              {isLoading ? (
                                  <div className="space-y-3">
                                      <div className="h-2 bg-[#2a2e39] rounded animate-pulse w-full"></div>
                                      <div className="h-2 bg-[#2a2e39] rounded animate-pulse w-[92%]"></div>
                                      <div className="h-2 bg-[#2a2e39] rounded animate-pulse w-[75%]"></div>
                                  </div>
                              ) : (
                                  <p className="text-sm text-[#d1d4dc] leading-relaxed font-normal">
                                      {analysis || "Click the sparkles icon on the row to generate a real-time analysis of this event using Google Gemini."}
                                  </p>
                              )}
                          </div>
                       </div>
                   </div>
                </div>
            )}
        </div>
      );
  }

  // DEFAULT LAYOUT (Economic)
  return (
    <div className="border-b border-tv-border last:border-0 bg-tv-bg">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`group grid grid-cols-[80px_160px_60px_1fr_100px_100px_100px] items-center py-3.5 px-4 hover:bg-[#2a2e39] cursor-pointer transition-colors duration-200 text-sm border-l-[3px] ${isExpanded ? 'border-l-tv-blue bg-[#2a2e39]' : 'border-l-transparent'}`}
      >
        <div className="text-[#787b86] font-mono text-xs font-medium group-hover:text-[#d1d4dc] transition-colors">{event.time}</div>
        
        <div className="flex items-center gap-3">
          <div className="relative shadow-sm rounded-[2px] overflow-hidden">
              <img 
                src={`https://flagcdn.com/w40/${event.countryCode.toLowerCase()}.png`} 
                alt={event.country}
                className="w-5 h-3.5 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
          </div>
          <span className="text-[#d1d4dc] font-bold text-xs truncate group-hover:text-white transition-colors">{event.country}</span>
        </div>

        <div className="flex justify-center">
             <VolatilityIndicator level={event.volatility} />
        </div>

        <div className="flex items-center gap-2 pr-4 min-w-0">
            <span className="text-[#d1d4dc] font-medium truncate group-hover:text-tv-blue transition-colors text-[13px]" title={event.title}>{event.title}</span>
            <button 
                onClick={handleAnalyze}
                className="opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-tv-blue/10 hover:text-tv-blue text-[#787b86] rounded ml-auto flex-shrink-0"
                title="Analyze with Gemini"
            >
                <Sparkles size={14} />
            </button>
        </div>

        <div className={`font-bold font-mono tabular-nums text-right ${valueColor} transition-colors`}>
            {event.actual}
        </div>
        <div className="text-right text-[#d1d4dc] font-mono tabular-nums text-xs font-medium opacity-90">{event.forecast}</div>
        <div className={`text-right font-mono tabular-nums text-xs text-[#787b86] font-medium`}>
            {event.prior}
        </div>
      </div>

      {isExpanded && (
        <div className="bg-[#181b24] px-6 py-6 border-t border-[#2a2e39] animate-in fade-in slide-in-from-top-1 duration-200 shadow-inner">
           <div className="grid grid-cols-[280px_1fr] gap-8">
               <div className="space-y-3">
                   <div className="h-32 bg-[#1e222d] rounded-lg border border-[#2a2e39] flex items-center justify-center relative overflow-hidden group">
                        {/* Fake Historical Graph */}
                        <svg className="w-full h-full p-4" viewBox="0 0 100 40" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="historyGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#2962ff" stopOpacity="0.2"/>
                                    <stop offset="100%" stopColor="#2962ff" stopOpacity="0"/>
                                </linearGradient>
                            </defs>
                            <path d="M0,20 Q10,15 20,25 T40,20 T60,30 T80,15 T100,20 V 40 H 0 Z" fill="url(#historyGradient)" />
                            <path d="M0,20 Q10,15 20,25 T40,20 T60,30 T80,15 T100,20" fill="none" stroke="#2962ff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                            <circle cx="20" cy="25" r="2" fill="#2962ff" stroke="#1e222d" strokeWidth="1" />
                            <circle cx="60" cy="30" r="2" fill="#2962ff" stroke="#1e222d" strokeWidth="1" />
                            <circle cx="100" cy="20" r="2" fill="#2962ff" stroke="#1e222d" strokeWidth="1" />
                        </svg>
                        <span className="text-xs text-[#787b86] z-10 font-mono bg-[#131722]/90 px-2 py-1 rounded backdrop-blur absolute top-2 right-2 border border-[#2a2e39]">History</span>
                   </div>
               </div>

               <div className="space-y-3">
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-gradient-to-br from-[#2962ff] to-[#7c3aed] rounded-md shadow-lg shadow-blue-900/20">
                            <Sparkles size={14} className="text-white" />
                          </div>
                          <h4 className="text-sm font-bold text-white tracking-tight">AI Insight</h4>
                      </div>
                      <span className="text-[10px] text-[#787b86] uppercase font-bold tracking-wider opacity-70">Powered by Gemini</span>
                  </div>
                  
                  <div className="bg-[#1e222d] border border-[#2a2e39] rounded-lg p-5 min-h-[100px] shadow-sm relative">
                      {isLoading ? (
                          <div className="space-y-3">
                              <div className="h-2 bg-[#2a2e39] rounded animate-pulse w-full"></div>
                              <div className="h-2 bg-[#2a2e39] rounded animate-pulse w-[92%]"></div>
                              <div className="h-2 bg-[#2a2e39] rounded animate-pulse w-[75%]"></div>
                          </div>
                      ) : (
                          <p className="text-sm text-[#d1d4dc] leading-relaxed font-normal">
                              {analysis || "Click the sparkles icon on the row to generate a real-time analysis of this event."}
                          </p>
                      )}
                  </div>
               </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default EventRow;
