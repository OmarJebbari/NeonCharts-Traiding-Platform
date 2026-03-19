
import React from 'react';

const TICKER_ITEMS = [
    { symbol: 'BTC', price: '64,230', change: '+1.95%', isUp: true },
    { symbol: 'ETH', price: '3,450.2', change: '+2.53%', isUp: true },
    { symbol: 'SPX', price: '4,783.45', change: '+0.49%', isUp: true },
    { symbol: 'NDAQ', price: '15,123.5', change: '-0.3%', isUp: false },
    { symbol: 'DOW', price: '37,689.0', change: '-0.15%', isUp: false },
    { symbol: 'EURUSD', price: '1.0950', change: '+0.05%', isUp: true },
    { symbol: 'GOLD', price: '2,045.3', change: '+0.12%', isUp: true },
    { symbol: 'OIL', price: '73.40', change: '-1.20%', isUp: false },
    { symbol: 'TSLA', price: '248.50', change: '-2.50%', isUp: false },
    { symbol: 'NVDA', price: '495.20', change: '+1.80%', isUp: true },
    { symbol: 'AAPL', price: '192.50', change: '+0.30%', isUp: true },
    { symbol: 'SOL', price: '145.20', change: '+4.20%', isUp: true },
];

const Ticker: React.FC = () => {
    // 4 sets to ensure smooth loop and coverage of large screens without gaps
    const displayItems = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

    return (
        <div className="bg-[#0b0e14] border-b border-tv-border/50 h-11 overflow-hidden flex items-center relative z-40 shadow-md">
            {/* Gradient Masks for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0b0e14] to-transparent z-20 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0b0e14] to-transparent z-20 pointer-events-none"></div>

            <div className="animate-ticker flex items-center whitespace-nowrap will-change-transform">
                {displayItems.map((item, i) => (
                    <div key={i} className="inline-flex items-center gap-3 px-6 h-full group cursor-pointer transition-colors hover:bg-[#161a25]">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs tracking-wide group-hover:text-tv-blue transition-colors">{item.symbol}</span>
                            <span className="text-[#d1d4dc] text-xs font-mono">{item.price}</span>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded-[4px] text-[10px] font-bold min-w-[50px] text-center transition-all duration-200 ${
                            item.isUp 
                                ? 'bg-[#089981]/15 text-[#089981] group-hover:bg-[#089981] group-hover:text-white' 
                                : 'bg-[#f23645]/15 text-[#f23645] group-hover:bg-[#f23645] group-hover:text-white'
                        }`}>
                            {item.change}
                        </span>
                        {/* Vertical Separator */}
                        <div className="h-4 w-px bg-tv-border/30 ml-2 group-last:hidden"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Ticker;
