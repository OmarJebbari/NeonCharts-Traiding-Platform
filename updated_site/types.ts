
export interface EconomicEvent {
  id: string;
  time: string;
  country: string;
  countryCode: string; // ISO 2-letter code for flags
  title: string;
  ticker?: string;
  volatility: 1 | 2 | 3; // 1=Low, 2=Moderate, 3=High
  actual?: string;
  forecast?: string;
  prior?: string;
  revenue?: string;
  surprise?: string;
  category: 'Economic' | 'Earnings' | 'Revenue' | 'Dividends';
  currency?: string;
  unit?: string;
  marketCap?: string; // New field for Earnings
  period?: 'pre' | 'post'; // New field for Earnings time icon (Sun/Moon)
  logo?: string; // Optional logo text/url placeholder
  // Dividend specific fields
  dividendAmount?: string;
  exDividendDate?: string;
  paymentDate?: string;
  dividendYield?: string;
}

export interface DaySection {
  date: string; // e.g., "Monday, January 5"
  events: EconomicEvent[];
}

export type ViewMode = 'all' | 'day';
export type CategoryFilter = 'Economic' | 'Earnings' | 'Revenue' | 'Dividends';

export interface MarketItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changeP: string;
  vol: string;
  cap?: string;
  sector?: string; 
  rating?: string; 
}
