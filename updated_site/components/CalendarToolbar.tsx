
import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { CategoryFilter } from '../types';
import { CATEGORIES } from '../constants';
import { DatePicker } from './DatePicker';

export type TimeTab = 'Today' | 'Tomorrow' | 'This Week' | 'Next Week' | 'Custom';
export type ImpactFilter = 'All' | 'High' | 'Medium' | 'Low';

interface CalendarToolbarProps {
  selectedCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  // Time/View Props
  activeTimeTab: TimeTab;
  onSelectTimeTab: (tab: TimeTab) => void;
  currentLabel: string;
  startDate: Date;
  endDate: Date;
  onNavigate: (dir: 'prev' | 'next') => void;
  onDateRangeChange: (start: Date, end: Date) => void;
  // Filter Props
  activeImpact: ImpactFilter;
  onSelectImpact: (impact: ImpactFilter) => void;
  // Search Props
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const CalendarToolbar: React.FC<CalendarToolbarProps> = ({ 
  selectedCategory, 
  onSelectCategory,
  activeTimeTab,
  currentLabel,
  startDate,
  endDate,
  onNavigate,
  onDateRangeChange,
  searchQuery,
  onSearchChange
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-4 py-4 bg-tv-bg">
      
      {/* Date Controls Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 relative">
            
            <div className="flex items-center gap-1 ml-1 relative" ref={datePickerRef}>
                <button 
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    title="Select Date Range"
                    className={`p-1.5 rounded transition-colors ${showDatePicker || activeTimeTab === 'Custom' ? 'text-white bg-[#2a2e39]' : 'text-tv-muted hover:text-tv-text hover:bg-[#2a2e39]'}`}
                >
                     <CalendarIcon size={18} />
                </button>
                
                {showDatePicker && (
                    <DatePicker 
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(s, e) => {
                            onDateRangeChange(s, e);
                        }}
                        onClose={() => setShowDatePicker(false)}
                    />
                )}

                 <button 
                    onClick={() => onNavigate('prev')}
                    title="Previous"
                    className="p-1.5 text-tv-muted hover:text-tv-text hover:bg-[#2a2e39] rounded transition-colors"
                 >
                     <ChevronLeft size={18} />
                </button>
                 <button 
                    onClick={() => onNavigate('next')}
                    title="Next"
                    className="p-1.5 text-tv-muted hover:text-tv-text hover:bg-[#2a2e39] rounded transition-colors"
                 >
                     <ChevronRight size={18} />
                </button>
            </div>
            
            <h2 className="text-xl font-bold text-white ml-2 tracking-tight transition-all duration-200 min-w-[200px]">
                {currentLabel}
            </h2>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tv-muted" />
            <input 
                type="text" 
                placeholder="Search events or countries..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-[#1e222d] border border-tv-border text-white text-sm rounded-full pl-9 pr-8 py-2 focus:outline-none focus:border-tv-blue transition-colors placeholder-tv-muted"
            />
            {searchQuery && (
                <button 
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-tv-muted hover:text-white"
                >
                    <X size={14} />
                </button>
            )}
        </div>
      </div>

      {/* Categories Row */}
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                        selectedCategory === cat 
                        ? 'bg-tv-text text-tv-bg font-bold' 
                        : 'text-tv-muted hover:bg-[#2a2e39] hover:text-tv-text'
                    }`}
                >
                    {cat}
                </button>
            ))}
          </div>
      </div>
    </div>
  );
};

export default CalendarToolbar;
