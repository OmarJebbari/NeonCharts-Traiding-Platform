
import React, { useEffect, useState, useMemo } from 'react';
import CalendarToolbar, { TimeTab, ImpactFilter } from './CalendarToolbar';
import EventRow from './EventRow';
import { CategoryFilter, DaySection } from '../types';
import { Calendar as CalendarIcon, Search } from 'lucide-react';

// Updated to Jan 5, 2026 (Monday) to show the new Revenue data
const SIMULATED_TODAY = new Date(2026, 0, 5); 

// Helper to get ranges
const getRangeForTab = (tab: TimeTab): { start: Date, end: Date } => {
  const start = new Date(SIMULATED_TODAY);
  start.setHours(0,0,0,0);
  const end = new Date(start);
  
  switch(tab) {
      case 'Today':
          break;
      case 'Tomorrow':
          start.setDate(start.getDate() + 1);
          end.setDate(end.getDate() + 1);
          break;
      case 'This Week':
          end.setDate(end.getDate() + 6);
          break;
      case 'Next Week':
          start.setDate(start.getDate() + 7);
          end.setDate(end.getDate() + 7); 
          end.setDate(end.getDate() + 6);
          break;
      default:
          return { start: SIMULATED_TODAY, end: new Date(SIMULATED_TODAY) };
  }
  return { start, end };
};

const CalendarView: React.FC = () => {
  // Default to Earnings to show the new requested data
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('Earnings');
  
  // Set default to Custom tab to allow a custom range covering Dec 2025 and Jan 2026
  const [activeTimeTab, setActiveTimeTab] = useState<TimeTab>('Custom');
  const [activeImpact, setActiveImpact] = useState<ImpactFilter>('All');
  
  // Initial range covers December 1, 2025 to January 31, 2026
  const [dateRange, setDateRange] = useState<{start: Date, end: Date}>(() => ({
      start: new Date(2025, 11, 1),
      end: new Date(2026, 0, 31)
  }));
  
  const [searchQuery, setSearchQuery] = useState('');

  // Data now comes from the backend (MySQL) instead of constants.ts
  const [dbSections, setDbSections] = useState<DaySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch DaySection[] from backend -> backend reads MySQL
    const run = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const res = await fetch('/api/calendar');
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const json = await res.json();
        setDbSections(json);
      } catch (err: any) {
        setLoadError(err?.message || String(err));
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const handleSelectTimeTab = (tab: TimeTab) => {
      setActiveTimeTab(tab);
      if (tab !== 'Custom') {
          setDateRange(getRangeForTab(tab));
      }
      if (searchQuery) setSearchQuery('');
  };

  const handleCustomDateRange = (start: Date, end: Date) => {
      setDateRange({ start, end });
      setActiveTimeTab('Custom');
      if (searchQuery) setSearchQuery('');
  };

  const parseMockDate = (dateStr: string): Date => {
    const parts = dateStr.split(' '); 
    const monthStr = parts[1];
    const dayStr = parts[2];
    
    const months: {[key: string]: number} = {
      'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
      'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
    };
    
    // Check if mock data is using 2025 or 2026 logic (Mock data constants updated to Jan 5, assume 2026 for Jan)
    // Simple heuristic: If Jan, use 2026, else 2025.
    const year = months[monthStr] === 0 ? 2026 : 2025;

    return new Date(year, months[monthStr], parseInt(dayStr));
  };

  const formatLabel = () => {
    if (searchQuery) return "Search Results";

    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const startStr = new Intl.DateTimeFormat('en-US', opts).format(dateRange.start);
    const endStr = new Intl.DateTimeFormat('en-US', {...opts, year: 'numeric'}).format(dateRange.end);
    
    if (dateRange.start.getTime() === dateRange.end.getTime()) {
        return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(dateRange.start);
    }
    return `${startStr} — ${endStr}`;
  };

  const handleNavigate = (dir: 'prev' | 'next') => {
      const diffTime = Math.abs(dateRange.end.getTime() - dateRange.start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      const shiftDays = diffDays === 0 ? 1 : diffDays + 1; 
      const shift = dir === 'next' ? shiftDays : -shiftDays;

      const newStart = new Date(dateRange.start);
      newStart.setDate(newStart.getDate() + shift);
      
      const newEnd = new Date(dateRange.end);
      newEnd.setDate(newEnd.getDate() + shift);

      setDateRange({ start: newStart, end: newEnd });
      setActiveTimeTab('Custom');
      if (searchQuery) setSearchQuery('');
  };

  const filteredSections = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();

    // 1. Determine base sections (Date Filter vs All Data)
    let candidateSections = dbSections;
    
    // Only apply date filtering if NO search query is present
    if (!lowerQuery) {
        candidateSections = dbSections.filter(section => {
            const sectionDate = parseMockDate(section.date);
            if (isNaN(sectionDate.getTime())) return false;
            
            sectionDate.setHours(0,0,0,0);
            
            const s = new Date(dateRange.start); s.setHours(0,0,0,0);
            const e = new Date(dateRange.end); e.setHours(0,0,0,0);

            return sectionDate.getTime() >= s.getTime() && sectionDate.getTime() <= e.getTime();
        });
    }

    // 2. Filter events within sections
    return candidateSections
      .map(section => ({
        ...section,
        events: section.events.filter(e => {
            // Category Filter
            const matchesCategory = e.category === selectedCategory;
            
            // Impact Filter (Economic only usually, but let's keep logic generic)
            let matchesImpact = true;
            if (selectedCategory === 'Economic') {
                if (activeImpact === 'High') matchesImpact = e.volatility === 3;
                else if (activeImpact === 'Medium') matchesImpact = e.volatility === 2;
                else if (activeImpact === 'Low') matchesImpact = e.volatility === 1;
            }

            // Text Search Filter (Matches Title, Country, Code, Ticker)
            const matchesSearch = !lowerQuery || 
                                  e.title.toLowerCase().includes(lowerQuery) || 
                                  e.country.toLowerCase().includes(lowerQuery) ||
                                  (e.ticker && e.ticker.toLowerCase().includes(lowerQuery)) ||
                                  e.countryCode.toLowerCase().includes(lowerQuery);

            return matchesCategory && matchesImpact && matchesSearch;
        })
      }))
      .filter(section => section.events.length > 0);

  }, [dbSections, dateRange, selectedCategory, activeImpact, searchQuery]);

  return (
    <div className="pb-20">
        <CalendarToolbar 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory}
          activeTimeTab={activeTimeTab}
          onSelectTimeTab={handleSelectTimeTab}
          currentLabel={formatLabel()}
          startDate={dateRange.start}
          endDate={dateRange.end}
          onNavigate={handleNavigate}
          onDateRangeChange={handleCustomDateRange}
          activeImpact={activeImpact}
          onSelectImpact={setActiveImpact}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="mt-2 border border-tv-border rounded-lg overflow-hidden bg-[#1e222d] shadow-2xl">
            {/* Conditional Headers based on Category */}
            {selectedCategory === 'Earnings' || selectedCategory === 'Revenue' || selectedCategory === 'Dividends' ? (
                 <div className="grid grid-cols-[80px_1fr_100px_100px_100px_120px] py-3 px-4 text-[11px] font-bold text-[#787b86] uppercase tracking-wider border-b border-tv-border bg-[#131722] sticky top-0 z-20">
                    <div>Time</div> 
                    <div>Company</div>
                    <div className="text-right">
                        {selectedCategory === 'Revenue' ? 'Est. Rev' : 
                         selectedCategory === 'Dividends' ? 'Ex-Date' : 'Est. EPS'}
                    </div>
                    <div className="text-right">
                        {selectedCategory === 'Revenue' ? 'Act. Rev' : 
                         selectedCategory === 'Dividends' ? 'Amount' : 'Act. EPS'}
                    </div>
                    <div className="text-right">
                        {selectedCategory === 'Dividends' ? 'Yield' : 'Surprise'}
                    </div>
                    <div className="text-right">
                        {selectedCategory === 'Dividends' ? 'Pay Date' : 'Mkt Cap'}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-[80px_160px_60px_1fr_100px_100px_100px] py-3 px-4 text-[11px] font-bold text-[#787b86] uppercase tracking-wider border-b border-tv-border bg-[#131722] sticky top-0 z-20">
                    <div>Time</div>
                    <div>Country</div>
                    <div className="text-center">Imp.</div>
                    <div>Event</div>
                    <div className="text-right">Actual</div>
                    <div className="text-right">Forecast</div>
                    <div className="text-right">Prior</div>
                </div>
            )}

            <div className="flex flex-col min-h-[300px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-[#787b86]">
                        <p className="text-lg font-medium">Loading events from MySQL…</p>
                        <p className="text-sm text-center max-w-md mt-2">Backend endpoint: <span className="font-mono">/api/calendar</span></p>
                    </div>
                ) : loadError ? (
                    <div className="flex flex-col items-center justify-center py-20 text-[#787b86]">
                        <p className="text-lg font-medium">Cannot load data from backend</p>
                        <p className="text-sm text-center max-w-md mt-2">{loadError}</p>
                        <p className="text-sm text-center max-w-md mt-2">Make sure the backend is running and MySQL is connected.</p>
                    </div>
                ) : filteredSections.length > 0 ? (
                    filteredSections.map((daySection) => (
                        <div key={daySection.date} className="flex flex-col">
                            <div className="bg-[#1e222d] py-2 px-4 border-b border-tv-border flex items-center gap-3 sticky top-[40px] z-10 shadow-sm border-t border-t-[#2a2e39]/50">
                                <div className="w-1.5 h-1.5 bg-tv-blue rounded-full shadow-[0_0_8px_rgba(41,98,255,0.8)]"></div>
                                <h3 className="text-sm font-bold text-[#d1d4dc]">{daySection.date}</h3>
                            </div>
                            <div className="bg-tv-bg">
                                {daySection.events.map(event => (
                                    <EventRow key={event.id} event={event} />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-[#787b86]">
                        <div className="mb-4 p-4 rounded-full bg-[#2a2e39]">
                            {searchQuery ? <Search size={32} className="opacity-50" /> : <CalendarIcon size={32} className="opacity-50" />}
                        </div>
                        <p className="text-lg font-medium">No events found</p>
                        <p className="text-sm text-center max-w-md mt-2">
                            {searchQuery 
                                ? `No results found for "${searchQuery}". Try searching for a different country or event.` 
                                : `There are no ${selectedCategory.toLowerCase()} events scheduled for ${formatLabel()}.`
                            }
                        </p>
                        <div className="flex gap-2 mt-6">
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="px-4 py-2 bg-[#2a2e39] text-white rounded hover:bg-[#363a45] transition-colors text-sm font-medium"
                                >
                                    Clear Search
                                </button>
                            )}
                            {selectedCategory === 'Economic' && (
                                <button 
                                    onClick={() => setActiveImpact('All')}
                                    className="px-4 py-2 bg-[#2a2e39] text-white rounded hover:bg-[#363a45] transition-colors text-sm font-medium"
                                >
                                    Clear Impact Filter
                                </button>
                            )}
                            {!searchQuery && (
                                <button 
                                    onClick={() => handleSelectTimeTab('This Week')}
                                    className="px-4 py-2 bg-tv-blue text-white rounded hover:bg-blue-600 transition-colors text-sm font-medium"
                                >
                                    Reset to This Week
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default CalendarView;
