
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Star, ArrowUpDown } from 'lucide-react';
import { MarketItem } from '../types';

type MarketCategory = 'Favorites' | 'Stocks' | 'Crypto' | 'Currencies' | 'Indices' | 'Futures' | 'Bonds';

interface MarketsViewProps {
  onSymbolClick: (item: MarketItem) => void;
}

// --- MOCK DATA ---
const INITIAL_STOCKS_DATA: MarketItem[] = [
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: '188.85', change: '+2.35', changeP: '+1.26%', vol: '148.24M', cap: '4.598T', sector: 'Technology', rating: 'Strong Buy' },
  { symbol: 'TSLA', name: 'Tesla, Inc.', price: '438.07', change: '-11.65', changeP: '-2.59%', vol: '85.535M', cap: '1.457T', sector: 'Consumer Durables', rating: 'Buy' },
  { symbol: 'AAPL', name: 'Apple Inc.', price: '228.10', change: '+0.50', changeP: '+0.22%', vol: '45.10M', cap: '3.42T', sector: 'Technology', rating: 'Neutral' },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.', price: '226.50', change: '-4.32', changeP: '-1.87%', vol: '51.456M', cap: '2.421T', sector: 'Retail Trade', rating: 'Buy' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: '417.00', change: '+1.20', changeP: '+0.29%', vol: '22.10M', cap: '3.10T', sector: 'Technology', rating: 'Strong Buy' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: '175.50', change: '-1.50', changeP: '-0.85%', vol: '28.50M', cap: '2.15T', sector: 'Technology', rating: 'Buy' },
  { symbol: 'META', name: 'Meta Platforms', price: '580.20', change: '+5.40', changeP: '+0.94%', vol: '15.20M', cap: '1.45T', sector: 'Technology', rating: 'Strong Buy' },
  { symbol: 'PLTR', name: 'Palantir Tech', price: '167.86', change: '-9.89', changeP: '-5.56%', vol: '60.634M', cap: '400.08B', sector: 'Technology', rating: 'Sell' },
  { symbol: 'AMD', name: 'Adv. Micro Devices', price: '145.20', change: '+3.10', changeP: '+2.18%', vol: '65.40M', cap: '235.10B', sector: 'Technology', rating: 'Buy' },
  { symbol: 'INTC', name: 'Intel Corporation', price: '39.38', change: '+2.48', changeP: '+6.72%', vol: '95.396M', cap: '187.84B', sector: 'Technology', rating: 'Neutral' },
];

const INITIAL_CRYPTO_DATA: MarketItem[] = [
  { symbol: 'BTCUSD', name: 'Bitcoin', price: '98,540.00', change: '+1240.00', changeP: '+1.27%', vol: '45.2K', cap: '1.95T', sector: 'Crypto', rating: 'Strong Buy' },
  { symbol: 'ETHUSD', name: 'Ethereum', price: '3,890.50', change: '-45.20', changeP: '-1.15%', vol: '210.5K', cap: '468.2B', sector: 'Crypto', rating: 'Buy' },
  { symbol: 'SOLUSD', name: 'Solana', price: '245.10', change: '+8.50', changeP: '+3.59%', vol: '1.2M', cap: '115.4B', sector: 'Crypto', rating: 'Strong Buy' },
  { symbol: 'XRPUSD', name: 'Ripple', price: '2.45', change: '+0.15', changeP: '+6.52%', vol: '550M', cap: '135.2B', sector: 'Crypto', rating: 'Buy' },
  { symbol: 'DOGEUSD', name: 'Dogecoin', price: '0.42', change: '-0.01', changeP: '-2.33%', vol: '890M', cap: '61.5B', sector: 'Crypto', rating: 'Neutral' },
];

const INITIAL_FOREX_DATA: MarketItem[] = [
  { symbol: 'EURUSD', name: 'Euro / U.S. Dollar', price: '1.0540', change: '-0.0020', changeP: '-0.19%', vol: '120M', cap: '12.45T', sector: 'Major', rating: 'Sell' },
  { symbol: 'USDJPY', name: 'U.S. Dollar / Yen', price: '152.40', change: '+0.80', changeP: '+0.53%', vol: '500M', cap: '6.38T', sector: 'Major', rating: 'Strong Buy' },
  { symbol: 'GBPUSD', name: 'British Pound / USD', price: '1.2650', change: '-0.0015', changeP: '-0.12%', vol: '390M', cap: '4.67T', sector: 'Major', rating: 'Sell' },
  { symbol: 'AUDUSD', name: 'Australian Dollar', price: '0.6450', change: '+0.0030', changeP: '+0.47%', vol: '268M', cap: '1.56T', sector: 'Major', rating: 'Neutral' },
];

const INITIAL_INDICES_DATA: MarketItem[] = [
  { symbol: '^GSPC', name: 'S&P 500', price: '6,945.43', change: '+0.61', changeP: '+0.01%', vol: '1.983B', cap: '46.20T', sector: 'Index', rating: 'Buy' },
  { symbol: '^DJI', name: 'Dow Jones Industrial Average', price: '49,162.68', change: '-299.40', changeP: '-0.61%', vol: '334.604M', cap: '13.10T', sector: 'Index', rating: 'Neutral' },
  { symbol: '^IXIC', name: 'NASDAQ Composite', price: '23,661.35', change: '+114.18', changeP: '+0.48%', vol: '5.402B', cap: '26.80T', sector: 'Index', rating: 'Strong Buy' },
  { symbol: '^NYA', name: 'NYSE Composite Index', price: '22,393.92', change: '-176.90', changeP: '-0.78%', vol: '3.82B', cap: '28.50T', sector: 'Index', rating: 'Sell' },
  { symbol: '^XAX', name: 'NYSE American Composite', price: '6,980.00', change: '-24.25', changeP: '-0.35%', vol: '245M', cap: '1.20T', sector: 'Index', rating: 'Neutral' },
  { symbol: '^BUK100P', name: 'Cboe UK 100', price: '1,007.83', change: '-8.57', changeP: '-0.84%', vol: '125M', cap: '2.10T', sector: 'Index', rating: 'Sell' },
  { symbol: '^RUT', name: 'Russell 2000 Index', price: '2,573.05', change: '-9.85', changeP: '-0.38%', vol: '1.2B', cap: '2.90T', sector: 'Index', rating: 'Sell' },
  { symbol: '^VIX', name: 'CBOE Volatility Index', price: '15.00', change: '+0.25', changeP: '+1.69%', vol: '—', cap: '—', sector: 'Index', rating: 'Strong Buy' },
  { symbol: '^FTSE', name: 'FTSE 100', price: '10,048.21', change: '-74.52', changeP: '-0.74%', vol: '850M', cap: '2.30T', sector: 'Index', rating: 'Sell' },
  { symbol: '^GDAXI', name: 'DAX Performance Index', price: '25,122.26', change: '+230.06', changeP: '+0.92%', vol: '75M', cap: '1.65T', sector: 'Index', rating: 'Buy' },
  { symbol: '^FCHI', name: 'CAC 40', price: '8,233.92', change: '-3.51', changeP: '-0.04%', vol: '55M', cap: '2.60T', sector: 'Index', rating: 'Neutral' },
  { symbol: '^STOXX50E', name: 'EURO STOXX 50', price: '5,923.57', change: '-8.22', changeP: '-0.14%', vol: '42M', cap: '4.20T', sector: 'Index', rating: 'Neutral' },
];

const INITIAL_FUTURES_DATA: MarketItem[] = [
  { symbol: 'GC=F', name: 'Gold Feb 26', price: '4,466.10', change: '-30.00', changeP: '-0.67%', vol: '188,838', cap: '323,348', sector: 'Metals', rating: 'Sell' },
  { symbol: 'CL=F', name: 'Crude Oil Feb 26', price: '56.09', change: '-1.04', changeP: '-1.82%', vol: '337,757', cap: '284,508', sector: 'Energy', rating: 'Strong Sell' },
  { symbol: 'NG=F', name: 'Natural Gas Feb 26', price: '3.5340', change: '+0.1840', changeP: '+5.49%', vol: '136,052', cap: '160,980', sector: 'Energy', rating: 'Strong Buy' },
  { symbol: 'ES=F', name: 'E-Mini S&P 500 Mar 26', price: '6,985.50', change: '-2.25', changeP: '-0.03%', vol: '889,556', cap: '1.941M', sector: 'Indices', rating: 'Neutral' },
  { symbol: 'YM=F', name: 'Mini Dow Jones Indus.', price: '49,414.00', change: '-307.00', changeP: '-0.62%', vol: '82,955', cap: '65,901', sector: 'Indices', rating: 'Sell' },
  { symbol: 'NQ=F', name: 'Nasdaq 100 Mar 26', price: '25,911.50', change: '+89.50', changeP: '+0.35%', vol: '388,686', cap: '273,663', sector: 'Indices', rating: 'Buy' },
  { symbol: 'RTY=F', name: 'E-mini Russell 2000', price: '2,591.00', change: '-5.50', changeP: '-0.21%', vol: '119,523', cap: '394,144', sector: 'Indices', rating: 'Neutral' },
  { symbol: 'ZB=F', name: 'U.S. Treasury Bond', price: '115.91', change: '+0.75', changeP: '+0.65%', vol: '485,452', cap: '1.869M', sector: 'Rates', rating: 'Strong Buy' },
  { symbol: 'ZN=F', name: '10-Year T-Note', price: '112.58', change: '+0.25', changeP: '+0.22%', vol: '1.707M', cap: '5.531M', sector: 'Rates', rating: 'Buy' },
  { symbol: 'ZF=F', name: '5-Year T-Note', price: '109.35', change: '+0.11', changeP: '+0.10%', vol: '1.133M', cap: '6.735M', sector: 'Rates', rating: 'Buy' },
  { symbol: 'ZT=F', name: '2-Year T-Note', price: '104.38', change: '+0.01', changeP: '+0.01%', vol: '673,963', cap: '4.567M', sector: 'Rates', rating: 'Neutral' },
  { symbol: 'MGC=F', name: 'Micro Gold Futures', price: '4,464.60', change: '-31.50', changeP: '-0.70%', vol: '473,226', cap: '57,859', sector: 'Metals', rating: 'Sell' },
];

const INITIAL_BONDS_DATA: MarketItem[] = [
  { symbol: 'ZN=F', name: '10-Year T-Note Futures', price: '112.57813', change: '+0.25000', changeP: '+0.22%', vol: '1.707M', cap: '5.531M', sector: 'Futures', rating: 'Buy' },
  { symbol: 'ZB=F', name: 'U.S. Treasury Bond Futures', price: '115.91', change: '+0.75', changeP: '+0.65%', vol: '485.45K', cap: '1.869M', sector: 'Futures', rating: 'Strong Buy' },
  { symbol: 'ZF=F', name: '5-Year T-Note Futures', price: '109.35', change: '+0.11', changeP: '+0.10%', vol: '1.133M', cap: '6.735M', sector: 'Futures', rating: 'Buy' },
  { symbol: 'ZT=F', name: '2-Year T-Note Futures', price: '104.38', change: '+0.01', changeP: '+0.01%', vol: '673.96K', cap: '4.567M', sector: 'Futures', rating: 'Neutral' },
  { symbol: '^IRX', name: '13 WEEK TREASURY BILL', price: '3.5150', change: '-0.0050', changeP: '-0.14%', vol: '2.133M', cap: '40.567M', sector: 'Yield', rating: 'Neutral' },
  { symbol: '^FVX', name: 'Treasury Yield 5 Years', price: '3.6940', change: '-0.0260', changeP: '-0.70%', vol: '5.133M', cap: '1.67M', sector: 'Yield', rating: 'Sell' },
  { symbol: '^TNX', name: 'CBOE Interest Rate 10 Year', price: '4.1380', change: '-0.0410', changeP: '-0.98%', vol: '8.13K', cap: '2.7M', sector: 'Yield', rating: 'Strong Sell' },
  { symbol: '^TYX', name: 'Treasury Yield 30 Years', price: '4.8150', change: '-0.0510', changeP: '-1.05%', vol: '455k', cap: '356K', sector: 'Yield', rating: 'Strong Sell' },
  { symbol: '2YY=F', name: '2-Year Yield Futures', price: '3.4190', change: '-0.0110', changeP: '-0.32%', vol: '89.4K', cap: '245.8K', sector: 'Futures', rating: 'Sell' },
  { symbol: 'TLT', name: 'iShares 20+ Year Treasury', price: '98.45', change: '+1.20', changeP: '+1.23%', vol: '32.5M', cap: '56.2B', sector: 'ETF', rating: 'Buy' },
];

const MarketSidebarItem: React.FC<{ 
  label: string; 
  isActive: boolean; 
  onClick: () => void 
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive 
        ? 'bg-[#2a2e39] text-tv-blue' 
        : 'text-tv-text hover:bg-[#2a2e39] hover:text-white'
    }`}
  >
    {label}
  </button>
);

const parseMarketValue = (val: string) => {
  if (!val || val === '—') return -Infinity;
  const clean = val.replace(/,/g, '').replace('%', '').replace('+', '');
  let multiplier = 1;
  if (clean.endsWith('T')) multiplier = 1e12;
  else if (clean.endsWith('B')) multiplier = 1e9;
  else if (clean.endsWith('M')) multiplier = 1e6;
  else if (clean.endsWith('K')) multiplier = 1e3;
  
  return parseFloat(clean) * multiplier;
};

const MarketsView: React.FC<MarketsViewProps> = ({ onSymbolClick }) => {
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('Stocks');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof MarketItem, direction: 'asc' | 'desc' } | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['NVDA', 'BTCUSD', '^GSPC']));

  // State for data to allow updates
  const [stocks, setStocks] = useState(INITIAL_STOCKS_DATA);
  const [crypto, setCrypto] = useState(INITIAL_CRYPTO_DATA);
  const [forex, setForex] = useState(INITIAL_FOREX_DATA);
  const [indices, setIndices] = useState(INITIAL_INDICES_DATA);
  const [futures, setFutures] = useState(INITIAL_FUTURES_DATA);
  const [bonds, setBonds] = useState(INITIAL_BONDS_DATA);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Determine which data to show
  const getData = () => {
    const allData = [...stocks, ...crypto, ...forex, ...indices, ...futures, ...bonds];
    if (activeCategory === 'Favorites') {
        return allData.filter(item => favorites.has(item.symbol));
    }
    switch (activeCategory) {
      case 'Stocks': return stocks;
      case 'Crypto': return crypto;
      case 'Currencies': return forex;
      case 'Indices': return indices;
      case 'Futures': return futures;
      case 'Bonds': return bonds;
      default: return [];
    }
  };

  // Simulation Effect
  useEffect(() => {
    const updateData = (items: MarketItem[], multiplier = 0.0005) => {
        return items.map(item => {
            const currentPrice = parseFloat(item.price.replace(/,/g, ''));
            const volatility = currentPrice * multiplier;
            const change = (Math.random() - 0.5) * volatility;
            const newPrice = currentPrice + change;
            
            const currentChange = parseFloat(item.change);
            const newChangeVal = currentChange + change;
            const newChangeP = (newChangeVal / (newPrice - newChangeVal)) * 100;

            const formatPrice = (val: number) => {
                if (item.symbol.includes('USD') && !item.symbol.includes('BTC') && !item.symbol.includes('ETH')) return val.toFixed(4); 
                if (val > 1000) return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                if (item.symbol.includes('^') || item.symbol.includes('=')) return val.toFixed(4); // Higher precision for yields/futures
                return val.toFixed(2);
            };

            return {
                ...item,
                price: formatPrice(newPrice),
                change: (newChangeVal > 0 ? '+' : '') + newChangeVal.toFixed(4),
                changeP: (newChangeP > 0 ? '+' : '') + newChangeP.toFixed(2) + '%'
            };
        });
    };

    const interval = setInterval(() => {
        if (activeCategory === 'Stocks' || activeCategory === 'Favorites') setStocks(prev => updateData(prev));
        if (activeCategory === 'Crypto' || activeCategory === 'Favorites') setCrypto(prev => updateData(prev, 0.001));
        if (activeCategory === 'Currencies' || activeCategory === 'Favorites') setForex(prev => updateData(prev, 0.0001));
        if (activeCategory === 'Indices' || activeCategory === 'Favorites') setIndices(prev => updateData(prev, 0.0002));
        if (activeCategory === 'Futures' || activeCategory === 'Favorites') setFutures(prev => updateData(prev, 0.0003));
        if (activeCategory === 'Bonds' || activeCategory === 'Favorites') setBonds(prev => updateData(prev, 0.0002));
    }, 2000);

    return () => clearInterval(interval);
  }, [activeCategory]);

  const processedData = useMemo(() => {
    const lowerQuery = debouncedSearchQuery.toLowerCase();
    let filtered = getData().filter(item => 
      item.symbol.toLowerCase().includes(lowerQuery) || 
      item.name.toLowerCase().includes(lowerQuery) ||
      (item.sector && item.sector.toLowerCase().includes(lowerQuery))
    );

    if (sortConfig) {
        filtered.sort((a, b) => {
            const valA = sortConfig.key === 'name' || sortConfig.key === 'symbol' || sortConfig.key === 'sector' || sortConfig.key === 'rating'
                ? a[sortConfig.key] || ''
                : parseMarketValue(a[sortConfig.key] as string);
            
            const valB = sortConfig.key === 'name' || sortConfig.key === 'symbol' || sortConfig.key === 'sector' || sortConfig.key === 'rating'
                ? b[sortConfig.key] || ''
                : parseMarketValue(b[sortConfig.key] as string);

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }
    return filtered;
  }, [activeCategory, stocks, crypto, forex, indices, futures, bonds, debouncedSearchQuery, sortConfig, favorites]);

  const handleSort = (key: keyof MarketItem) => {
    setSortConfig(current => ({
        key,
        direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleFavorite = (e: React.MouseEvent, symbol: string) => {
      e.stopPropagation();
      setFavorites(prev => {
          const next = new Set(prev);
          if (next.has(symbol)) next.delete(symbol);
          else next.add(symbol);
          return next;
      });
  }

  const RenderSortArrow = ({ colKey }: { colKey: keyof MarketItem }) => {
    if (sortConfig?.key !== colKey) return <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-50 transition-opacity" />;
    return <ArrowUpDown size={12} className={`transition-transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />;
  };

  const handleTrade = (e: React.MouseEvent, type: 'buy' | 'sell', symbol: string) => {
      e.stopPropagation();
      alert(`${type.toUpperCase()} order initiated for ${symbol}`);
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-60px)] gap-6 py-6 animate-in fade-in duration-300">
      
      {/* SIDEBAR NAVIGATION */}
      <div className="w-full md:w-56 flex-shrink-0 flex flex-col gap-1 pr-4 md:border-r border-tv-border">
        <div className="mb-4 px-2">
           <h2 className="text-xl font-bold text-white tracking-tight">Markets</h2>
        </div>
        
        <MarketSidebarItem label="Favorites" isActive={activeCategory === 'Favorites'} onClick={() => setActiveCategory('Favorites')} />
        <div className="my-2 border-t border-tv-border/50 mx-2"></div>
        <MarketSidebarItem label="Indices" isActive={activeCategory === 'Indices'} onClick={() => setActiveCategory('Indices')} />
        <MarketSidebarItem label="Futures" isActive={activeCategory === 'Futures'} onClick={() => setActiveCategory('Futures')} />
        <MarketSidebarItem label="Bonds" isActive={activeCategory === 'Bonds'} onClick={() => setActiveCategory('Bonds')} />
        <MarketSidebarItem label="Currencies" isActive={activeCategory === 'Currencies'} onClick={() => setActiveCategory('Currencies')} />
        <MarketSidebarItem label="Stocks" isActive={activeCategory === 'Stocks'} onClick={() => setActiveCategory('Stocks')} />
        <MarketSidebarItem label="Crypto" isActive={activeCategory === 'Crypto'} onClick={() => setActiveCategory('Crypto')} />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-white tracking-tight">{activeCategory}</h1>
            
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tv-muted" />
                <input 
                    type="text" 
                    placeholder={`Search Symbol, Name, Sector...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#1e222d] border border-tv-border text-tv-text text-sm rounded-full pl-9 pr-4 py-1.5 focus:outline-none focus:border-tv-blue w-64 transition-all"
                />
            </div>
        </div>

        {/* Data Table */}
        <div className="border border-tv-border rounded-lg overflow-x-auto bg-[#1e222d] shadow-sm pb-12 md:pb-0">
          {processedData.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-tv-border text-xs text-tv-muted uppercase font-medium">
                  <th className="py-3 px-4 font-normal w-10"></th>
                  {[
                      { label: 'Symbol', key: 'symbol', align: 'left' },
                      { label: 'Name', key: 'name', align: 'left' },
                      { label: 'Price', key: 'price', align: 'right' },
                      { label: 'Change %', key: 'changeP', align: 'right' },
                      { label: 'Volume', key: 'vol', align: 'right' },
                      { label: activeCategory === 'Futures' || activeCategory === 'Bonds' ? 'Open Int.' : 'Market Cap', key: 'cap', align: 'right' },
                      { label: 'Sector', key: 'sector', align: 'right' },
                      { label: 'Rating', key: 'rating', align: 'right' },
                      { label: 'Action', key: 'action', align: 'center' },
                  ].map((col) => {
                      if (col.key === 'action') {
                        return <th key={col.key} className="py-3 px-4 font-normal text-center">Trade</th>
                      }
                      return (
                      <th 
                        key={col.key} 
                        className={`py-3 px-4 font-normal cursor-pointer hover:bg-[#2a2e39] hover:text-white transition-colors group select-none ${col.key === 'symbol' ? 'sticky left-0 bg-[#1e222d] z-10' : ''}`}
                        onClick={() => handleSort(col.key as keyof MarketItem)}
                        style={{ textAlign: col.align as any }}
                      >
                          <div className={`flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'}`}>
                              {col.label}
                              <RenderSortArrow colKey={col.key as keyof MarketItem} />
                          </div>
                      </th>
                  )})}
                </tr>
              </thead>
              <tbody className="text-sm">
                {processedData.map((item, idx) => (
                  <tr 
                    key={item.symbol} 
                    onClick={() => onSymbolClick(item)}
                    className="border-b border-tv-border hover:bg-[#2a2e39] transition-colors group cursor-pointer"
                  >
                    <td className="py-3 pl-4 pr-0">
                        <button 
                            onClick={(e) => toggleFavorite(e, item.symbol)}
                            className={`${favorites.has(item.symbol) ? 'text-tv-blue' : 'text-tv-muted hover:text-tv-blue'} transition-colors`}
                        >
                            <Star size={14} fill={favorites.has(item.symbol) ? "currentColor" : "none"} />
                        </button>
                    </td>
                    <td className="py-3 px-4 font-bold text-tv-blue sticky left-0 bg-[#1e222d] group-hover:bg-[#2a2e39] z-10 transition-colors">
                        {item.symbol}
                    </td>
                    <td className="py-3 px-4 text-tv-text max-w-[200px] truncate">
                        <span className="font-medium text-white/90">{item.name}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-tv-text font-medium transition-colors duration-300">{item.price}</td>
                    <td className={`py-3 px-4 text-right transition-colors duration-300 ${item.changeP.startsWith('+') ? 'text-tv-green' : 'text-tv-red'}`}>
                        {item.changeP}
                    </td>
                    <td className="py-3 px-4 text-right text-tv-text">{item.vol}</td>
                    <td className="py-3 px-4 text-right text-tv-text">{item.cap}</td>
                    <td className="py-3 px-4 text-right">
                         <span className="px-2 py-1 rounded bg-[#2a2e39] text-xs text-tv-muted border border-tv-border">
                            {item.sector || '—'}
                         </span>
                    </td>
                    <td className={`py-3 px-4 text-right font-medium text-xs`}>
                        <span className={`
                            ${item.rating?.includes('Buy') ? 'text-tv-blue' : ''}
                            ${item.rating?.includes('Sell') ? 'text-tv-red' : ''}
                            ${item.rating?.includes('Neutral') ? 'text-tv-muted' : ''}
                        `}>
                            {item.rating?.toUpperCase() || '—'}
                        </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={(e) => handleTrade(e, 'buy', item.symbol)}
                                className="bg-tv-blue/20 hover:bg-tv-blue text-tv-blue hover:text-white text-[10px] font-bold px-2 py-1 rounded transition-colors uppercase"
                            >
                                Buy
                            </button>
                            <button 
                                onClick={(e) => handleTrade(e, 'sell', item.symbol)}
                                className="bg-tv-red/20 hover:bg-tv-red text-tv-red hover:text-white text-[10px] font-bold px-2 py-1 rounded transition-colors uppercase"
                            >
                                Sell
                            </button>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-10 text-center text-tv-muted">
                No data available matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketsView;
