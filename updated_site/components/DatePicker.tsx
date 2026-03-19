
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerProps {
  startDate: Date;
  endDate: Date;
  onChange: (start: Date, end: Date) => void;
  onClose: () => void;
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export const DatePicker: React.FC<DatePickerProps> = ({ startDate, endDate, onChange, onClose }) => {
  // Initialize view state based on startDate (handles Jan 2026, Nov 2025, etc.)
  const [viewDate, setViewDate] = useState(() => new Date(startDate));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => {
    const day = new Date(y, m, 1).getDay();
    return day === 0 ? 6 : day - 1; // Adjust for Monday start (0=Mon, 6=Sun)
  };

  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getFirstDayOfMonth(year, month);
  
  // Generate calendar grid
  const calendarDays = [];
  for (let i = 0; i < startDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const isSelected = (day: number) => {
    const d = new Date(year, month, day);
    const s = new Date(startDate); s.setHours(0,0,0,0);
    const e = new Date(endDate); e.setHours(0,0,0,0);
    const curr = new Date(d); curr.setHours(0,0,0,0);
    return curr.getTime() >= s.getTime() && curr.getTime() <= e.getTime();
  };

  const isRangeStart = (day: number) => {
    const d = new Date(year, month, day);
    const s = new Date(startDate); s.setHours(0,0,0,0);
    return d.getTime() === s.getTime();
  };

  const isRangeEnd = (day: number) => {
    const d = new Date(year, month, day);
    const e = new Date(endDate); e.setHours(0,0,0,0);
    return d.getTime() === e.getTime();
  };

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(year, month, day);
    
    if (startDate.getTime() === endDate.getTime()) {
        // Range is currently a single day (or reset). Set the end date.
        // Ensure end is after start
        if (clickedDate < startDate) {
            onChange(clickedDate, startDate);
        } else {
            onChange(startDate, clickedDate);
        }
    } else {
        // Range exists, reset to new start date
        onChange(clickedDate, clickedDate);
    }
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="absolute top-full left-0 mt-2 bg-[#1e222d] border border-[#2a2e39] rounded-lg shadow-xl p-4 z-50 w-[280px] animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between mb-4">
        <button 
            onClick={handlePrevMonth}
            className="p-1 hover:bg-[#2a2e39] rounded text-tv-muted hover:text-white transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="font-semibold text-white select-none">{MONTH_NAMES[month]} {year}</span>
        <button 
            onClick={handleNextMonth}
            className="p-1 hover:bg-[#2a2e39] rounded text-tv-muted hover:text-white transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs text-tv-muted font-medium py-1 select-none">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {calendarDays.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />;
          
          const selected = isSelected(day);
          const start = isRangeStart(day);
          const end = isRangeEnd(day);
          
          let bgClass = '';
          if (start || end) bgClass = 'bg-white text-black font-bold';
          else if (selected) bgClass = 'bg-[#2a2e39] text-white';
          else bgClass = 'text-tv-text hover:bg-[#2a2e39]';

          return (
            <button
              key={day}
              onClick={() => handleDayClick(day)}
              className={`
                h-8 w-full text-sm rounded-sm flex items-center justify-center transition-colors
                ${bgClass}
                ${start ? 'rounded-l-md' : ''}
                ${end ? 'rounded-r-md' : ''}
                ${!start && !end && selected ? 'rounded-none' : ''}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 flex justify-between pt-3 border-t border-[#2a2e39]">
          <span className="text-xs text-tv-muted">
              {new Date(startDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})} - {new Date(endDate).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
          </span>
          <button onClick={onClose} className="text-xs text-tv-blue font-medium hover:text-blue-400">
              Done
          </button>
      </div>
    </div>
  );
};
