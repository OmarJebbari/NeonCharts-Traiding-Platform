
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MarketItem } from '../types';
import { ArrowLeft, TrendingUp, TrendingDown, Clock, BarChart3, List, Search, ArrowUpDown, ZoomIn, ZoomOut, Layers, Eye, EyeOff, X, RefreshCcw, CandlestickChart, LineChart, Activity, Pencil, Trash2, Newspaper, FileText, Check, AlertCircle, Ruler, Sparkles, Settings, Magnet, Spline, Camera, Square, ChevronDown, History, MoreHorizontal, Crosshair, ExternalLink } from 'lucide-react';
import { analyzeMarketSymbol, MarketAnalysisResult } from '../services/geminiService';

interface SymbolDetailViewProps {
  item: MarketItem;
  onBack: () => void;
}

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  vol: number;
}

type IndicatorSource = 'close' | 'open' | 'high' | 'low';

interface Indicator {
    id: string;
    name: string;
    type: 'SMA' | 'EMA' | 'RSI' | 'MACD';
    period?: number;
    color: string;
    lineWidth: number;
    source: IndicatorSource;
    enabled: boolean;
    pane: 'overlay' | 'bottom';
}

type ChartType = 'candles' | 'heikin_ashi' | 'line' | 'area';
type BottomTab = 'history' | 'news' | 'about' | 'time_sales';
type OrderSide = 'buy' | 'sell';
type ToolType = 'cursor' | 'line' | 'fib' | 'measure' | 'rect';

interface TradeExecution {
    id: number;
    price: number;
    time: number; // index in history for simplicity in this mock
    side: OrderSide;
    size: number;
}

interface TimeSaleItem {
    id: number;
    time: number;
    price: number;
    size: number;
    side: OrderSide;
}

interface DrawingRect {
    start: {x:number, y:number, price:number};
    end: {x:number, y:number, price:number};
}

const TIMEFRAMES = ['1D', '5D', '1M', '3M', '6M', 'YTD', '1Y', '5Y', 'ALL'];

const MOCK_NEWS_ITEMS = [
  {
    id: 1,
    source: "Bloomberg",
    time: "45m ago",
    title: "Institutional Investors Increase Stake Ahead of Earnings",
    summary: "Recent 13F filings reveal a significant accumulation pattern by major hedge funds, suggesting confidence in the upcoming quarterly report.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTDZcZ0zq8nAEPrepZF-rkcJqPhvQ2E_cXzw&s",
    sentiment: "Bullish"
  },
  {
    id: 2,
    source: "Reuters",
    time: "2h ago",
    title: "Sector Analysis: Tech Valuations Reach Critical Levels",
    summary: "As P/E ratios expand across the technology sector, analysts warn of potential short-term volatility while maintaining long-term growth targets.",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=200",
    sentiment: "Neutral"
  },
  {
    id: 3,
    source: "CNBC",
    time: "4h ago",
    title: "Supply Chain Updates: Manufacturing Output Exceeds Expectations",
    summary: "New data from suppliers indicates that production bottlenecks have eased significantly, paving the way for improved gross margins.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=200",
    sentiment: "Bullish"
  },
  {
    id: 4,
    source: "WSJ",
    time: "6h ago",
    title: "Market Close: Volatility Spikes Amidst Rate Uncertainty",
    summary: "Broader market indices finished mixed today as traders digested the latest comments from Federal Reserve officials regarding interest rate paths.",
    image: "https://images.moneycontrol.com/static-mcnews/2026/01/20260103025400_sensex_nifty_stock-stocks_stock.jpg?impolicy=website&width=770&height=431",
    sentiment: "Bearish"
  },
  {
    id: 5,
    source: "Seeking Alpha",
    time: "12h ago",
    title: "Technical Outlook: Key Support Levels to Watch",
    summary: "Chart patterns suggest a consolidation phase is nearing completion, with a breakout above the 50-day moving average looking imminent.",
    image: "https://media.istockphoto.com/id/1363023131/photo/neuron-network-deep-learning-with-financial-data-quantitative-trading.jpg?s=612x612&w=0&k=20&c=Iaf19sXgiJ9bg2IKVGqq2WLUnynnmH29CvMuACLI7bk=",
    sentiment: "Bullish"
  }
];

const calculateIndicator = (data: CandleData[], type: 'SMA' | 'EMA' | 'RSI' | 'MACD', period: number, source: IndicatorSource = 'close') => {
    const values = new Array(data.length).fill(null);
    if (data.length < period) return values;

    const getVal = (d: CandleData) => d[source];

    if (type === 'SMA') {
        for (let i = period - 1; i < data.length; i++) {
            let sum = 0;
            for (let j = 0; j < period; j++) sum += getVal(data[i - j]);
            values[i] = sum / period;
        }
    } else if (type === 'EMA') {
        const k = 2 / (period + 1);
        let sum = 0;
        for (let j = 0; j < period; j++) sum += getVal(data[period - 1 - j]);
        values[period - 1] = sum / period;
        
        for (let i = period; i < data.length; i++) {
            const prev = values[i - 1];
            if (prev !== null) {
                values[i] = (getVal(data[i]) * k) + (prev * (1 - k));
            }
        }
    } else if (type === 'RSI') {
        let avgGain = 0;
        let avgLoss = 0;

        // Initial Average
        for (let i = 1; i <= period; i++) {
            const change = getVal(data[i]) - getVal(data[i - 1]);
            if (change > 0) avgGain += change;
            else avgLoss += Math.abs(change);
        }
        avgGain /= period;
        avgLoss /= period;

        for (let i = period + 1; i < data.length; i++) {
            const change = getVal(data[i]) - getVal(data[i - 1]);
            let gain = change > 0 ? change : 0;
            let loss = change < 0 ? Math.abs(change) : 0;

            avgGain = (avgGain * (period - 1) + gain) / period;
            avgLoss = (avgLoss * (period - 1) + loss) / period;

            if (avgLoss === 0) values[i] = 100;
            else {
                const rs = avgGain / avgLoss;
                values[i] = 100 - (100 / (1 + rs));
            }
        }
    }
    return values;
}

// MACD Special Calculation
const calculateMACD = (data: CandleData[], source: IndicatorSource = 'close') => {
    const fastPeriod = 12;
    const slowPeriod = 26;
    const signalPeriod = 9;

    const fastEMA = calculateIndicator(data, 'EMA', fastPeriod, source);
    const slowEMA = calculateIndicator(data, 'EMA', slowPeriod, source);
    
    const macdLine = new Array(data.length).fill(null);
    const histogram = new Array(data.length).fill(null);
    const signalLine = new Array(data.length).fill(null);

    const validStart = slowPeriod - 1;
    for (let i = validStart; i < data.length; i++) {
        macdLine[i] = fastEMA[i] - slowEMA[i];
    }

    const k = 2 / (signalPeriod + 1);
    let sum = 0;
    let signalStartIdx = validStart + signalPeriod - 1;
    
    if (signalStartIdx < data.length) {
         for (let j = 0; j < signalPeriod; j++) {
            sum += macdLine[validStart + j];
         }
         signalLine[signalStartIdx] = sum / signalPeriod;
         
         for (let i = signalStartIdx + 1; i < data.length; i++) {
             signalLine[i] = (macdLine[i] * k) + (signalLine[i - 1] * (1 - k));
         }
    }

    for (let i = 0; i < data.length; i++) {
        if (macdLine[i] !== null && signalLine[i] !== null) {
            histogram[i] = macdLine[i] - signalLine[i];
        }
    }

    return { macdLine, signalLine, histogram };
};

// Convert standard candles to Heikin Ashi
const calculateHeikinAshi = (data: CandleData[]): CandleData[] => {
    const haData: CandleData[] = [];
    if (data.length === 0) return haData;

    // First candle is same
    haData.push(data[0]);

    for (let i = 1; i < data.length; i++) {
        const curr = data[i];
        const prevHA = haData[i-1];
        
        const haClose = (curr.open + curr.high + curr.low + curr.close) / 4;
        const haOpen = (prevHA.open + prevHA.close) / 2;
        const haHigh = Math.max(curr.high, haOpen, haClose);
        const haLow = Math.min(curr.low, haOpen, haClose);

        haData.push({
            time: curr.time,
            open: haOpen,
            high: haHigh,
            low: haLow,
            close: haClose,
            vol: curr.vol
        });
    }
    return haData;
};


const SymbolDetailView: React.FC<SymbolDetailViewProps> = ({ item, onBack }) => {
  // --- STATE ---
  const [history, setHistory] = useState<CandleData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number>(parseFloat(item.price.replace(/,/g, '')));
  const [change, setChange] = useState<number>(parseFloat(item.change));
  const [changeP, setChangeP] = useState<number>(parseFloat(item.changeP.replace('%', '')));
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  
  // Tabs & Panels
  const [activeTab, setActiveTab] = useState<BottomTab>('history');
  
  // Table State
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  
  // Chart Interaction State
  const [hoverData, setHoverData] = useState<CandleData & { x: number, y: number, change: number, changeP: number, indicators?: {name: string, color: string, value: number}[] } | null>(null);
  const [viewWindow, setViewWindow] = useState<{start: number, end: number} | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragStartWindow, setDragStartWindow] = useState<{start: number, end: number} | null>(null);
  
  // Chart Config State
  const [chartType, setChartType] = useState<ChartType>('candles');
  const [activeTool, setActiveTool] = useState<ToolType>('cursor');
  const [isMagnetMode, setIsMagnetMode] = useState(false);
  const [showVolume, setShowVolume] = useState(true);

  // Drawings State
  const [drawings, setDrawings] = useState<number[]>([]); // Horizontal lines
  const [fibs, setFibs] = useState<{start: {x:number, y:number, price:number}, end: {x:number, y:number, price:number}}[]>([]);
  const [rects, setRects] = useState<DrawingRect[]>([]);
  
  // Interaction Temporary State
  const [interactionStart, setInteractionStart] = useState<{x: number, y: number, price: number, index: number} | null>(null);
  const [interactionEnd, setInteractionEnd] = useState<{x: number, y: number, price: number, index: number} | null>(null);

  // Trades
  const [trades, setTrades] = useState<TradeExecution[]>([]);
  const [timeSales, setTimeSales] = useState<TimeSaleItem[]>([]);

  // News Analysis State
  const [newsAnalysis, setNewsAnalysis] = useState<MarketAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Indicators State
  const [indicators, setIndicators] = useState<Indicator[]>([
      { id: 'sma20', name: 'SMA 20', type: 'SMA', period: 20, color: '#f59e0b', lineWidth: 1.5, source: 'close', enabled: false, pane: 'overlay' },
      { id: 'ema50', name: 'EMA 50', type: 'EMA', period: 50, color: '#3b82f6', lineWidth: 1.5, source: 'close', enabled: false, pane: 'overlay' },
      { id: 'rsi14', name: 'RSI 14', type: 'RSI', period: 14, color: '#8b5cf6', lineWidth: 1.5, source: 'close', enabled: false, pane: 'bottom' },
      { id: 'macd', name: 'MACD', type: 'MACD', color: '#2962ff', lineWidth: 1.5, source: 'close', enabled: false, pane: 'bottom' },
  ]);
  const [showIndicatorMenu, setShowIndicatorMenu] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<string | null>(null); // ID of indicator being edited

  // Trading Modal State
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [orderSide, setOrderSide] = useState<OrderSide>('buy');
  const [orderQty, setOrderQty] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [limitPrice, setLimitPrice] = useState<number>(0);

  // Order Book State
  const [isOrderBookOpen, setIsOrderBookOpen] = useState(true);
  const [depthChartHover, setDepthChartHover] = useState<{ x: number, y: number, price: number, volume: number } | null>(null);

  const chartRef = useRef<HTMLDivElement>(null);

  // --- ORDER BOOK DATA GENERATION ---
  const orderBookData = useMemo(() => {
      const levels = 12;
      const asks = [];
      const bids = [];
      let cumAsk = 0;
      let cumBid = 0;
      
      // Generate levels
      for(let i=1; i<=levels; i++) {
           const price = currentPrice - (i * 0.05);
           const size = Math.floor(Math.random() * 200) + 50;
           cumBid += size;
           bids.push({ price, size, total: cumBid });
      }
      for(let i=1; i<=levels; i++) {
           const price = currentPrice + (i * 0.05);
           const size = Math.floor(Math.random() * 200) + 50;
           cumAsk += size;
           asks.push({ price, size, total: cumAsk });
      }
      
      // Sort for list display
      asks.sort((a, b) => b.price - a.price);
      bids.sort((a, b) => b.price - a.price);

      const maxVol = Math.max(cumAsk, cumBid);
      const lowestAsk = asks[asks.length-1].price;
      const highestBid = bids[0].price;
      const spread = lowestAsk - highestBid;
      const spreadP = (spread / lowestAsk) * 100;

      // Imbalance Calculation
      const totalAskVol = asks.reduce((a, b) => a + b.size, 0);
      const totalBidVol = bids.reduce((a, b) => a + b.size, 0);
      const imbalance = (totalBidVol / (totalBidVol + totalAskVol)) * 100;
      
      return { asks, bids, maxVol, spread, spreadP, cumAsk, cumBid, imbalance };
  }, [currentPrice]);

  // --- DATA GENERATION ---
  const generateHistory = (basePrice: number, timeframe: string): CandleData[] => {
    const now = Date.now();
    let points = 200; 
    let interval = 60000 * 5; 
    let volatility = 0.002;

    if (timeframe === '5D') { interval = 60000 * 60; volatility = 0.008; }
    if (timeframe === '1M') { interval = 60000 * 60 * 4; volatility = 0.015; }
    if (timeframe === '1Y') { interval = 60000 * 60 * 24; volatility = 0.05; }
    if (timeframe === 'ALL') { points = 500; volatility = 0.2; }

    const data: CandleData[] = [];
    let currentBase = basePrice * (1 - (volatility * points * 0.2)); 

    for (let i = 0; i < points; i++) {
        const time = now - (points - 1 - i) * interval;
        const trend = (Math.random() - 0.48) * volatility * currentBase; 
        
        const open = i === 0 ? currentBase : data[i-1].close;
        const close = open + trend + (Math.random() - 0.5) * (volatility * currentBase * 0.5);
        const high = Math.max(open, close) + Math.random() * (volatility * currentBase * 0.2);
        const low = Math.min(open, close) - Math.random() * (volatility * currentBase * 0.2);
        
        data.push({
            time, open, high, low, close,
            vol: Math.random() * 1000 + 500
        });
        currentBase = close;
    }
    return data;
  };

  useEffect(() => {
    const basePrice = parseFloat(item.price.replace(/,/g, ''));
    setHistory(generateHistory(basePrice, selectedTimeframe));
    setViewWindow(null); 
    setDrawings([]); 
    setFibs([]);
    setRects([]);
    setTrades([]);
    setTimeSales([]); // Reset sales on symbol/TF change
    setInteractionStart(null);
    setInteractionEnd(null);
    setActiveTool('cursor');
    setNewsAnalysis(null);
  }, [item, selectedTimeframe]);

  useEffect(() => {
    if (selectedTimeframe !== '1D') return;
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const volatility = prev * 0.0005; 
        const newPrice = prev + (Math.random() - 0.5) * volatility * 2;
        
        setHistory(prevHistory => {
            if (prevHistory.length === 0) return prevHistory;
            const lastCandle = prevHistory[prevHistory.length - 1];
            const updatedCandle = {
                ...lastCandle,
                close: newPrice,
                high: Math.max(lastCandle.high, newPrice),
                low: Math.min(lastCandle.low, newPrice),
                vol: lastCandle.vol + Math.random() * 10
            };
            return [...prevHistory.slice(0, -1), updatedCandle];
        });

        // Add to Time & Sales
        const tradeSide: OrderSide = Math.random() > 0.5 ? 'buy' : 'sell';
        const tradeSize = Math.floor(Math.random() * 100) + 1;
        setTimeSales(prevSales => {
             const newTrade = {
                id: Date.now(),
                time: Date.now(),
                price: newPrice,
                size: tradeSize,
                side: tradeSide
            };
            return [newTrade, ...prevSales].slice(0, 50);
        });

        const openPrice = parseFloat(item.price.replace(/,/g, ''));
        const newChange = newPrice - openPrice;
        setChange(newChange);
        setChangeP((newChange / openPrice) * 100);
        return newPrice;
      });
    }, 1000); 
    return () => clearInterval(interval);
  }, [item, selectedTimeframe]);

  // --- CHART CALCULATIONS ---
  const activeData = useMemo(() => {
      // If Heikin Ashi, transform the data
      if (chartType === 'heikin_ashi') {
          return calculateHeikinAshi(history);
      }
      return history;
  }, [history, chartType]);

  const visibleIndices = useMemo(() => {
      if (!viewWindow) return { start: 0, end: activeData.length - 1 };
      return { 
          start: Math.max(0, Math.floor(viewWindow.start)), 
          end: Math.min(activeData.length - 1, Math.ceil(viewWindow.end)) 
      };
  }, [activeData.length, viewWindow]);

  const visibleData = useMemo(() => {
      return activeData.slice(visibleIndices.start, visibleIndices.end + 1);
  }, [activeData, visibleIndices]);

  const indicatorValues = useMemo(() => {
      const results: Record<string, any[]> = {};
      indicators.forEach(ind => {
          if (ind.enabled) {
              if (ind.type === 'MACD') {
                  results[ind.id] = [calculateMACD(activeData, ind.source)]; 
              } else {
                  results[ind.id] = calculateIndicator(activeData, ind.type, ind.period || 14, ind.source);
              }
          }
      });
      return results;
  }, [activeData, indicators]);

  const bottomIndicators = indicators.filter(i => i.enabled && i.pane === 'bottom');
  const hasBottomPane = bottomIndicators.length > 0;
  const activeBottomIndicator = bottomIndicators[0];
  
  const mainChartHeight = hasBottomPane ? 70 : 100;
  const bottomPaneHeight = hasBottomPane ? 30 : 0;

  const { minPrice, maxPrice, maxVol } = useMemo(() => {
      if (visibleData.length === 0) return { minPrice: 0, maxPrice: 100, maxVol: 100 };
      const lows = visibleData.map(d => d.low);
      const highs = visibleData.map(d => d.high);
      return {
          minPrice: Math.min(...lows),
          maxPrice: Math.max(...highs),
          maxVol: Math.max(...visibleData.map(d => d.vol)) || 1
      };
  }, [visibleData]);

  const priceRange = maxPrice - minPrice || 1;

  // Coordinate Helper
  const getY = (price: number) => {
      const padding = priceRange * 0.15;
      const paddedMin = minPrice - padding;
      const paddedMax = maxPrice + padding;
      const range = paddedMax - paddedMin;
      return mainChartHeight - ((price - paddedMin) / range) * mainChartHeight;
  };

  const getPriceFromY = (yPercent: number) => {
      if (yPercent > mainChartHeight) return null;
      const padding = priceRange * 0.15;
      const paddedMin = minPrice - padding;
      const paddedMax = maxPrice + padding;
      const range = paddedMax - paddedMin;
      return paddedMin + (range * (mainChartHeight - yPercent) / mainChartHeight);
  };
  
  const getBottomPaneY = (val: number, min: number, max: number) => {
      const range = max - min || 1;
      const normalized = (val - min) / range;
      return 100 - (normalized * bottomPaneHeight);
  };
  
  const getRSIY = (val: number) => getBottomPaneY(val, 0, 100);

  const yAxisTicks = useMemo(() => {
      const steps = 6;
      const ticks = [];
      const padding = priceRange * 0.15;
      const paddedMin = minPrice - padding;
      const paddedMax = maxPrice + padding;
      const range = paddedMax - paddedMin;
      const stepSize = range / steps;
      
      for(let i=1; i<steps; i++) {
          ticks.push(paddedMin + (stepSize * i));
      }
      return ticks;
  }, [minPrice, maxPrice, priceRange]);

  const xAxisTicks = useMemo(() => {
      if(visibleData.length < 2) return [];
      const steps = 6;
      const ticks = [];
      const stepSize = Math.floor(visibleData.length / steps);
      
      for(let i=0; i<steps; i++) {
          const idx = i * stepSize;
          if(visibleData[idx]) ticks.push({ x: (idx / visibleData.length) * 100, label: new Date(visibleData[idx].time) });
      }
      return ticks;
  }, [visibleData]);

  // --- HANDLERS ---
  const handleAnalyzeNews = async () => {
      setIsAnalyzing(true);
      const result = await analyzeMarketSymbol(item.symbol, item.sector);
      setNewsAnalysis(result);
      setIsAnalyzing(false);
  }

  const handleZoom = (direction: 'in' | 'out') => {
      const currentStart = viewWindow ? viewWindow.start : 0;
      const currentEnd = viewWindow ? viewWindow.end : activeData.length - 1;
      const range = currentEnd - currentStart;
      const delta = range * 0.2;

      if (direction === 'in') {
          if (range < 10) return;
          setViewWindow({ start: currentStart + delta / 2, end: currentEnd - delta / 2 });
      } else {
          let newStart = currentStart - delta / 2;
          let newEnd = currentEnd + delta / 2;
          if (newStart < 0) newStart = 0;
          if (newEnd > activeData.length - 1) newEnd = activeData.length - 1;
          
          if (newStart <= 0 && newEnd >= activeData.length - 1) setViewWindow(null);
          else setViewWindow({ start: newStart, end: newEnd });
      }
  };

  const handleWheel = (e: React.WheelEvent) => {
      if (e.deltaY < 0) handleZoom('in'); else handleZoom('out');
  };

  const handleMouseDown = (e: React.MouseEvent) => {
      if (!chartRef.current) return;
      const rect = chartRef.current.getBoundingClientRect();
      const width = rect.width;
      const x = e.clientX - rect.left;
      const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
      
      const visibleCount = visibleData.length;
      const indexInVisible = Math.floor((x / width) * visibleCount);
      const fullIndex = visibleIndices.start + indexInVisible;
      
      let price = getPriceFromY(yPercent) || 0;
      
      // Magnet Mode Logic
      if (isMagnetMode && fullIndex >= 0 && fullIndex < activeData.length) {
          const candle = activeData[fullIndex];
          if (Math.abs(price - candle.high) < Math.abs(price - candle.low)) {
              price = candle.high;
          } else {
              price = candle.low;
          }
      }

      if (activeTool === 'line') {
         setDrawings(prev => [...prev, price]);
         setActiveTool('cursor'); 
         return;
      }

      if (activeTool === 'measure' || activeTool === 'fib' || activeTool === 'rect') {
          setInteractionStart({ x, y: yPercent, price, index: fullIndex });
          setInteractionEnd({ x, y: yPercent, price, index: fullIndex });
          return;
      }

      if (!viewWindow) return;
      setIsDragging(true);
      setDragStartX(e.clientX);
      setDragStartWindow(viewWindow);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (!chartRef.current || activeData.length === 0) return;
      const rect = chartRef.current.getBoundingClientRect();
      const width = rect.width;
      const x = e.clientX - rect.left;
      const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

      const visibleCount = visibleData.length;
      const indexInVisible = Math.floor((x / width) * visibleCount);
      const fullIndex = visibleIndices.start + indexInVisible;
      
      let price = getPriceFromY(yPercent) || 0;

      if (isMagnetMode && fullIndex >= 0 && fullIndex < activeData.length) {
          const candle = activeData[fullIndex];
          if (Math.abs(price - candle.high) < Math.abs(price - candle.low)) {
              price = candle.high;
          } else {
              price = candle.low;
          }
      }

      if ((activeTool === 'measure' || activeTool === 'fib' || activeTool === 'rect') && interactionStart) {
          setInteractionEnd({ x, y: yPercent, price, index: fullIndex });
          return;
      }

      if (isDragging && dragStartX !== null && dragStartWindow) {
          const deltaPixels = dragStartX - e.clientX;
          const deltaIndices = (deltaPixels / width) * (dragStartWindow.end - dragStartWindow.start);
          let newStart = dragStartWindow.start + deltaIndices;
          let newEnd = dragStartWindow.end + deltaIndices;
          if (newStart < 0) { newStart = 0; newEnd = dragStartWindow.end - dragStartWindow.start; }
          if (newEnd > activeData.length - 1) { newEnd = activeData.length - 1; newStart = newEnd - (dragStartWindow.end - dragStartWindow.start); }
          setViewWindow({ start: newStart, end: newEnd });
          return; 
      }

      if (indexInVisible >= 0 && indexInVisible < visibleCount) {
          const point = visibleData[indexInVisible];
          const prevPoint = indexInVisible > 0 ? visibleData[indexInVisible - 1] : (visibleIndices.start > 0 ? activeData[visibleIndices.start - 1] : point);
          
          const change = point.close - prevPoint.close;
          const changeP = (change / prevPoint.close) * 100;

          const centerX = (indexInVisible * (100 / visibleCount)) + (100 / visibleCount / 2);
          
          const pointIndicators = indicators
              .filter(i => i.enabled && i.pane === 'overlay')
              .map(i => ({ name: i.name, color: i.color, value: indicatorValues[i.id][fullIndex] || 0 }));

          setHoverData({
              ...point,
              x: centerX,
              y: getY(point.close),
              change,
              changeP,
              indicators: pointIndicators
          });
      }
  };

  const handleMouseUp = () => {
      // Commit Drawings
      if (activeTool === 'fib' && interactionStart && interactionEnd) {
          setFibs(prev => [...prev, {
              start: {x: interactionStart.x, y: interactionStart.y, price: interactionStart.price}, 
              end: {x: interactionEnd.x, y: interactionEnd.y, price: interactionEnd.price}
          }]);
          setActiveTool('cursor');
          setInteractionStart(null);
          setInteractionEnd(null);
      }
      if (activeTool === 'rect' && interactionStart && interactionEnd) {
          setRects(prev => [...prev, {
              start: {x: interactionStart.x, y: interactionStart.y, price: interactionStart.price}, 
              end: {x: interactionEnd.x, y: interactionEnd.y, price: interactionEnd.price}
          }]);
          setActiveTool('cursor');
          setInteractionStart(null);
          setInteractionEnd(null);
      }

      setIsDragging(false);
      setDragStartX(null);
      setDragStartWindow(null);
  };

  const handleMouseLeave = () => {
      setIsDragging(false);
      setHoverData(null);
  };

  const toggleIndicator = (id: string) => {
      setIndicators(prev => {
          const target = prev.find(i => i.id === id);
          if (target && target.pane === 'bottom' && !target.enabled) {
              return prev.map(i => {
                  if (i.id === id) return { ...i, enabled: true };
                  if (i.pane === 'bottom') return { ...i, enabled: false };
                  return i;
              });
          }
          return prev.map(ind => ind.id === id ? { ...ind, enabled: !ind.enabled } : ind);
      });
  };

  const updateIndicatorConfig = (id: string, updates: Partial<Indicator>) => {
      setIndicators(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  }
  
  const toggleTool = (tool: ToolType) => {
      if (activeTool === tool) {
          setActiveTool('cursor');
          setInteractionStart(null);
          setInteractionEnd(null);
      } else {
          setActiveTool(tool);
          setInteractionStart(null);
          setInteractionEnd(null);
      }
  }

  const openTradeModal = (side: OrderSide, price?: number) => {
      setOrderSide(side);
      setOrderQty(1);
      setLimitPrice(price || currentPrice);
      setOrderSuccess(false);
      setTradeModalOpen(true);
  };

  const placeOrder = () => {
      setTimeout(() => {
          setOrderSuccess(true);
          const lastIdx = visibleIndices.end;
          // Add to trade execution history markers
          setTrades(prev => [...prev, {
              id: Date.now(),
              price: limitPrice,
              time: lastIdx, 
              side: orderSide,
              size: orderQty
          }]);

          // Update Time & Sales with user trade
          setTimeSales(prevSales => [{
              id: Date.now(),
              time: Date.now(),
              price: limitPrice,
              size: orderQty,
              side: orderSide
          }, ...prevSales].slice(0, 50));

          setTimeout(() => {
              setTradeModalOpen(false);
              setOrderSuccess(false);
          }, 1500);
      }, 500);
  };

  // --- RENDER HELPERS ---
  const renderChartPath = () => {
      const points = visibleData.map((d, i) => {
          const widthPercent = 100 / visibleData.length;
          const x = (i * widthPercent) + (widthPercent / 2);
          const y = getY(d.close);
          return `${x},${y}`;
      }).join(' ');

      if (chartType === 'line') {
          return <polyline points={points} fill="none" stroke="#2962ff" strokeWidth="2" vectorEffect="non-scaling-stroke" />;
      }
      if (chartType === 'area') {
         return (
             <>
                <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2962ff" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#2962ff" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <polygon points={`${points} ${mainChartHeight},${mainChartHeight} 0,${mainChartHeight}`} fill="url(#areaGradient)" />
                <polyline points={points} fill="none" stroke="#2962ff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
             </>
         )
      }
      return null;
  };

  const renderMeasurementOverlay = () => {
      if (!interactionStart || !interactionEnd) return null;
      const isNegative = interactionEnd.price < interactionStart.price;
      const change = interactionEnd.price - interactionStart.price;
      const changeP = (change / interactionStart.price) * 100;
      const bars = Math.abs(interactionEnd.index - interactionStart.index);
      
      const minX = Math.min(interactionStart.x, interactionEnd.x);
      const maxX = Math.max(interactionStart.x, interactionEnd.x);
      const minY = Math.min(interactionStart.y, interactionEnd.y);
      const maxY = Math.max(interactionStart.y, interactionEnd.y);

      const fillColor = isNegative ? 'rgba(242, 54, 69, 0.2)' : 'rgba(8, 153, 129, 0.2)';
      const strokeColor = isNegative ? '#f23645' : '#089981';

      return (
          <g>
              <rect x={minX} y={minY} width={maxX - minX} height={maxY - minY} fill={fillColor} stroke={strokeColor} strokeWidth="1" strokeDasharray="4,4" />
              <circle cx={interactionStart.x} cy={interactionStart.y} r="3" fill={strokeColor} />
              <circle cx={interactionEnd.x} cy={interactionEnd.y} r="3" fill={strokeColor} />
              <foreignObject x={maxX} y={minY} width="120" height="60">
                  <div className={`text-[10px] p-2 rounded shadow-xl border border-tv-border bg-[#1e222d] text-white flex flex-col gap-0.5 whitespace-nowrap z-50`}>
                      <span className={isNegative ? 'text-tv-red' : 'text-tv-green'}>{change.toFixed(2)} ({changeP.toFixed(2)}%)</span>
                      <span className="text-tv-muted">{bars} bars</span>
                  </div>
              </foreignObject>
          </g>
      );
  }

  const tableData = useMemo(() => {
      let data = [...history];
      if (filterQuery) {
          const lower = filterQuery.toLowerCase();
          data = data.filter(d => new Date(d.time).toLocaleString().toLowerCase().includes(lower));
      }
      if (sortConfig) {
          data.sort((a, b) => {
              let valA: number = 0, valB: number = 0;
              switch(sortConfig.key) {
                  case 'time': valA = a.time; valB = b.time; break;
                  case 'open': valA = a.open; valB = b.open; break;
                  case 'close': valA = a.close; valB = b.close; break;
                  case 'vol': valA = a.vol; valB = b.vol; break;
                  case 'change': valA = a.close - a.open; valB = b.close - b.open; break;
              }
              return (valA < valB ? -1 : 1) * (sortConfig.direction === 'asc' ? 1 : -1);
          });
      } else {
          data.sort((a, b) => b.time - a.time);
      }
      return data;
  }, [history, filterQuery, sortConfig]);

  const handleSort = (key: string) => {
      setSortConfig(prev => ({ key, direction: prev?.key === key && prev.direction === 'desc' ? 'asc' : 'desc' }));
  };

  const isPositive = change >= 0;
  const colorClass = isPositive ? 'text-tv-green' : 'text-tv-red';

  const { bottomMin, bottomMax } = useMemo(() => {
     if (!activeBottomIndicator || activeBottomIndicator.type !== 'MACD') return { bottomMin: 0, bottomMax: 100 };
     const macdData = indicatorValues[activeBottomIndicator.id][0];
     const visibleHist = macdData.histogram.slice(visibleIndices.start, visibleIndices.end + 1);
     const visibleMacd = macdData.macdLine.slice(visibleIndices.start, visibleIndices.end + 1);
     const visibleSig = macdData.signalLine.slice(visibleIndices.start, visibleIndices.end + 1);
     const allValues = [...visibleHist, ...visibleMacd, ...visibleSig].filter(v => v !== null);
     const min = Math.min(...allValues);
     const max = Math.max(...allValues);
     const range = max - min;
     return { bottomMin: min - range*0.1, bottomMax: max + range*0.1 };
  }, [visibleIndices, indicatorValues, activeBottomIndicator]);

  // Depth Chart Data Prep & Render
  const renderDepthChart = () => {
      // Need cumulative volumes sorted by price
      // Asks: Low Price -> High Price
      const depthAsks = [...orderBookData.asks].sort((a, b) => a.price - b.price);
      // Bids: High Price -> Low Price
      const depthBids = [...orderBookData.bids].sort((a, b) => b.price - a.price);

      const minP = depthBids[depthBids.length-1].price;
      const maxP = depthAsks[depthAsks.length-1].price;
      const maxVol = Math.max(depthAsks[depthAsks.length-1].total, depthBids[depthBids.length-1].total);
      
      const width = 100;
      const height = 40;
      const priceRange = maxP - minP;

      const getX = (p: number) => ((p - minP) / priceRange) * width;
      const getY = (v: number) => height - ((v / maxVol) * height);

      // Bids Path (Green) - from left to center
      let bidsPath = `M 0 ${height}`;
      depthBids.forEach(b => {
          bidsPath += ` L ${getX(b.price)} ${getY(b.total)}`;
      });
      bidsPath += ` L ${getX(depthBids[0].price)} ${height} Z`;

      // Asks Path (Red) - from center to right
      let asksPath = `M ${getX(depthAsks[0].price)} ${height}`;
      depthAsks.forEach(a => {
          asksPath += ` L ${getX(a.price)} ${getY(a.total)}`;
      });
      asksPath += ` L ${width} ${height} Z`;

      const handleChartMove = (e: React.MouseEvent) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const p = minP + ((x / rect.width) * priceRange);
          // Find closest bid or ask
          const closestBid = depthBids.reduce((prev, curr) => Math.abs(curr.price - p) < Math.abs(prev.price - p) ? curr : prev);
          const closestAsk = depthAsks.reduce((prev, curr) => Math.abs(curr.price - p) < Math.abs(prev.price - p) ? curr : prev);
          const closest = Math.abs(closestBid.price - p) < Math.abs(closestAsk.price - p) ? closestBid : closestAsk;
          
          setDepthChartHover({ x, y: 0, price: closest.price, volume: closest.total });
      };

      return (
          <div className="h-28 bg-[#131722] relative group overflow-hidden border-t border-tv-border/20" onMouseMove={handleChartMove} onMouseLeave={() => setDepthChartHover(null)}>
              <div className="absolute top-1 left-2 z-10 flex gap-2">
                  <div className="text-[10px] text-tv-muted font-bold uppercase tracking-wider">Depth</div>
                  {depthChartHover && (
                      <div className="text-[10px] text-white font-mono bg-[#2a2e39]/80 backdrop-blur px-1.5 rounded animate-in fade-in flex gap-2 border border-tv-border/50">
                          <span>P: <span className={depthChartHover.price >= currentPrice ? 'text-tv-red' : 'text-tv-green'}>{depthChartHover.price.toFixed(2)}</span></span>
                          <span>V: {depthChartHover.volume}</span>
                      </div>
                  )}
              </div>
              <div className="relative w-full h-full">
                  <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
                      <path d={bidsPath} fill="url(#depthBidGradient)" stroke="#089981" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                      <path d={asksPath} fill="url(#depthAskGradient)" stroke="#f23645" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                      
                      <defs>
                        <linearGradient id="depthBidGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#089981" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#089981" stopOpacity="0.1" />
                        </linearGradient>
                        <linearGradient id="depthAskGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#f23645" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#f23645" stopOpacity="0.1" />
                        </linearGradient>
                      </defs>

                      {/* Current Price Line */}
                      <line x1={getX(currentPrice)} y1="0" x2={getX(currentPrice)} y2={height} stroke="white" strokeWidth="1" strokeDasharray="3,3" vectorEffect="non-scaling-stroke" opacity="0.3" />

                      {depthChartHover && (
                          <>
                            <line x1={depthChartHover.x / chartRef.current?.getBoundingClientRect().width! * 100} y1="0" x2={depthChartHover.x / chartRef.current?.getBoundingClientRect().width! * 100} y2={height} stroke="white" strokeWidth="0.5" strokeDasharray="2,2" vectorEffect="non-scaling-stroke" />
                            <circle cx={depthChartHover.x / chartRef.current?.getBoundingClientRect().width! * 100} cy={getY(depthChartHover.volume)} r="2" fill="white" />
                          </>
                      )}
                  </svg>
              </div>
          </div>
      );
  };

  return (
    <div className="flex flex-col gap-6 py-6 animate-in fade-in duration-300 select-none relative">
      {/* ... (Modal code same as before) ... */}
      {tradeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-[#1e222d] border border-tv-border rounded-lg shadow-2xl w-[320px] overflow-hidden">
                  <div className="flex justify-between items-center p-4 border-b border-tv-border bg-[#1e222d]">
                      <h3 className="font-bold text-white flex items-center gap-2">
                          {orderSide === 'buy' ? <span className="text-tv-blue">BUY</span> : <span className="text-tv-red">SELL</span>}
                          {item.symbol}
                      </h3>
                      <button onClick={() => setTradeModalOpen(false)} className="text-tv-muted hover:text-white"><X size={18}/></button>
                  </div>
                  {orderSuccess ? (
                      <div className="p-8 flex flex-col items-center justify-center text-center gap-4 animate-in zoom-in duration-200">
                          <div className="w-12 h-12 rounded-full bg-tv-green/20 text-tv-green flex items-center justify-center">
                              <Check size={24} strokeWidth={3} />
                          </div>
                          <div className="space-y-1">
                              <h4 className="text-white font-bold text-lg">Order Filled</h4>
                              <p className="text-tv-muted text-sm">Executed at {limitPrice.toFixed(2)}</p>
                          </div>
                      </div>
                  ) : (
                      <div className="p-4 flex flex-col gap-4">
                          <div className="flex flex-col gap-1">
                              <label className="text-xs text-tv-muted uppercase font-medium">Quantity</label>
                              <div className="flex items-center gap-2 bg-[#131722] border border-tv-border rounded px-3 py-2">
                                  <input 
                                    type="number" 
                                    value={orderQty} 
                                    onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 0))}
                                    className="bg-transparent text-white w-full outline-none font-mono"
                                  />
                                  <span className="text-xs text-tv-muted">Units</span>
                              </div>
                          </div>
                          <div className="flex flex-col gap-1">
                              <label className="text-xs text-tv-muted uppercase font-medium">Price</label>
                              <div className="bg-[#131722] border border-tv-border rounded px-3 py-2 flex items-center">
                                  <input 
                                    type="number"
                                    value={limitPrice}
                                    onChange={(e) => setLimitPrice(parseFloat(e.target.value))}
                                    className="bg-transparent text-white w-full outline-none font-mono"
                                  />
                              </div>
                          </div>
                          <div className="flex justify-between items-center text-xs mt-1">
                              <span className="text-tv-muted">Total Value</span>
                              <span className="text-white font-mono">{(limitPrice * orderQty).toLocaleString('en-US', {style:'currency', currency:'USD'})}</span>
                          </div>
                          <button 
                            onClick={placeOrder}
                            className={`w-full py-3 rounded font-bold text-white transition-all active:scale-[0.98] mt-2 ${orderSide === 'buy' ? 'bg-tv-blue hover:bg-blue-600' : 'bg-tv-red hover:bg-red-600'}`}
                          >
                              {orderSide === 'buy' ? 'BUY' : 'SELL'}
                          </button>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* Header / Nav */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-[#2a2e39] rounded-full text-tv-muted hover:text-white transition-colors">
                <ArrowLeft size={24} />
            </button>
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                    {item.symbol}
                    <span className="text-xs font-semibold text-tv-muted bg-[#2a2e39] px-2 py-1 rounded border border-tv-border">{item.sector || 'MARKET'}</span>
                    <span className={`text-sm px-2 py-0.5 rounded ${item.rating?.includes('Buy') ? 'bg-tv-blue/10 text-tv-blue' : 'bg-tv-text/10 text-tv-text'}`}>{item.rating}</span>
                </h1>
                <p className="text-tv-text text-sm">{item.name}</p>
            </div>
          </div>
          <div className="flex overflow-x-auto bg-[#1e222d] rounded-md p-1 border border-tv-border no-scrollbar">
             {TIMEFRAMES.map(tf => (
                 <button 
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-3 py-1 text-xs font-bold rounded transition-colors whitespace-nowrap ${selectedTimeframe === tf ? 'bg-[#2a2e39] text-tv-blue' : 'text-tv-muted hover:text-tv-text'}`}
                 >
                     {tf}
                 </button>
             ))}
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-6">
          <div className="flex flex-col gap-6">
              {/* Chart Section */}
              <div className="bg-[#1e222d] border border-tv-border rounded-lg p-1 flex flex-col h-[600px] relative group overflow-hidden">
                  
                  {/* Toolbar */}
                  <div className="flex items-center justify-between p-2 border-b border-tv-border/50 bg-[#1e222d] z-20">
                      <div className="flex items-center gap-2">
                          <div className="relative">
                            <button onClick={() => setShowTypeMenu(!showTypeMenu)} className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-tv-text hover:bg-[#2a2e39] rounded transition-colors">
                                {chartType === 'candles' || chartType === 'heikin_ashi' ? <CandlestickChart size={14} /> : chartType === 'line' ? <LineChart size={14} /> : <Activity size={14} />}
                            </button>
                            {showTypeMenu && (
                                <div className="absolute top-full left-0 mt-1 w-32 bg-[#1e222d] border border-tv-border rounded-md shadow-xl z-30 p-1">
                                    <button onClick={() => { setChartType('candles'); setShowTypeMenu(false); }} className="w-full text-left px-3 py-2 text-xs hover:bg-[#2a2e39] rounded flex items-center gap-2"><CandlestickChart size={14} /> Candles</button>
                                    <button onClick={() => { setChartType('heikin_ashi'); setShowTypeMenu(false); }} className="w-full text-left px-3 py-2 text-xs hover:bg-[#2a2e39] rounded flex items-center gap-2"><CandlestickChart size={14} /> Heikin Ashi</button>
                                    <button onClick={() => { setChartType('line'); setShowTypeMenu(false); }} className="w-full text-left px-3 py-2 text-xs hover:bg-[#2a2e39] rounded flex items-center gap-2"><LineChart size={14} /> Line</button>
                                    <button onClick={() => { setChartType('area'); setShowTypeMenu(false); }} className="w-full text-left px-3 py-2 text-xs hover:bg-[#2a2e39] rounded flex items-center gap-2"><Activity size={14} /> Area</button>
                                </div>
                            )}
                          </div>
                          <div className="w-px h-4 bg-tv-border mx-1"></div>
                          
                          {/* Indicators with Settings */}
                          <div className="relative">
                            <button onClick={() => { setShowIndicatorMenu(!showIndicatorMenu); setEditingIndicator(null); }} className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-tv-text hover:bg-[#2a2e39] rounded transition-colors">
                                <Layers size={14} /> Indicators
                            </button>
                            {showIndicatorMenu && (
                                <div className="absolute top-full left-0 mt-1 w-64 bg-[#1e222d] border border-tv-border rounded-md shadow-xl z-30 p-1">
                                    {editingIndicator ? (
                                        <div className="p-2 space-y-2">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-bold text-white">Configure {indicators.find(i=>i.id===editingIndicator)?.name}</span>
                                                <button onClick={()=>setEditingIndicator(null)}><X size={12} className="text-tv-muted hover:text-white" /></button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="text-xs">
                                                    <label className="block text-tv-muted mb-1">Period</label>
                                                    <input type="number" 
                                                        value={indicators.find(i=>i.id===editingIndicator)?.period || 14} 
                                                        onChange={(e)=>updateIndicatorConfig(editingIndicator, {period: parseInt(e.target.value)})}
                                                        className="w-full bg-[#131722] border border-tv-border rounded px-2 py-1 text-white"
                                                    />
                                                </div>
                                                <div className="text-xs">
                                                    <label className="block text-tv-muted mb-1">Source</label>
                                                    <select 
                                                        value={indicators.find(i=>i.id===editingIndicator)?.source || 'close'}
                                                        onChange={(e)=>updateIndicatorConfig(editingIndicator, {source: e.target.value as IndicatorSource})}
                                                        className="w-full bg-[#131722] border border-tv-border rounded px-2 py-1 text-white"
                                                    >
                                                        <option value="close">Close</option>
                                                        <option value="open">Open</option>
                                                        <option value="high">High</option>
                                                        <option value="low">Low</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="text-xs">
                                                <label className="block text-tv-muted mb-1">Line Width</label>
                                                <input type="range" min="1" max="5" step="0.5"
                                                    value={indicators.find(i=>i.id===editingIndicator)?.lineWidth || 1.5}
                                                    onChange={(e)=>updateIndicatorConfig(editingIndicator, {lineWidth: parseFloat(e.target.value)})}
                                                    className="w-full accent-tv-blue"
                                                />
                                            </div>
                                            <div className="text-xs">
                                                <label className="block text-tv-muted mb-1">Color</label>
                                                <div className="flex gap-2">
                                                    {['#f59e0b', '#3b82f6', '#8b5cf6', '#2962ff', '#f23645', '#089981', '#d1d4dc'].map(c => (
                                                        <button 
                                                            key={c} 
                                                            onClick={()=>updateIndicatorConfig(editingIndicator, {color: c})}
                                                            className={`w-4 h-4 rounded-full border ${indicators.find(i=>i.id===editingIndicator)?.color===c ? 'border-white' : 'border-transparent'}`}
                                                            style={{background: c}}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        indicators.map(ind => (
                                            <div key={ind.id} className="flex items-center justify-between px-3 py-2 text-xs hover:bg-[#2a2e39] rounded group">
                                                <button onClick={() => toggleIndicator(ind.id)} className="flex items-center gap-2 flex-1 text-left">
                                                    <span className="w-2 h-2 rounded-full" style={{ background: ind.color }} /> {ind.name}
                                                </button>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => setEditingIndicator(ind.id)} className="text-tv-muted hover:text-white p-1"><Settings size={12} /></button>
                                                    <button onClick={() => toggleIndicator(ind.id)}>
                                                        {ind.enabled ? <Eye size={12} className="text-tv-blue" /> : <EyeOff size={12} className="text-tv-muted" />}
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                          </div>
                          
                          <div className="w-px h-4 bg-tv-border mx-1"></div>

                          {/* Tools */}
                          <div className="flex items-center gap-1">
                              <button onClick={() => toggleTool('line')} className={`p-1.5 rounded transition-colors ${activeTool === 'line' ? 'bg-tv-blue text-white' : 'text-tv-muted hover:text-white hover:bg-[#2a2e39]'}`} title="Draw Horizontal Line">
                                <Pencil size={14} />
                              </button>
                              <button onClick={() => toggleTool('fib')} className={`p-1.5 rounded transition-colors ${activeTool === 'fib' ? 'bg-tv-blue text-white' : 'text-tv-muted hover:text-white hover:bg-[#2a2e39]'}`} title="Fibonacci Retracement">
                                <Spline size={14} />
                              </button>
                              <button onClick={() => toggleTool('rect')} className={`p-1.5 rounded transition-colors ${activeTool === 'rect' ? 'bg-tv-blue text-white' : 'text-tv-muted hover:text-white hover:bg-[#2a2e39]'}`} title="Draw Rectangle">
                                <Square size={14} />
                              </button>
                              <button onClick={() => toggleTool('measure')} className={`p-1.5 rounded transition-colors ${activeTool === 'measure' ? 'bg-tv-blue text-white' : 'text-tv-muted hover:text-white hover:bg-[#2a2e39]'}`} title="Measure / Ruler">
                                  <Ruler size={14} />
                              </button>
                              <div className="w-px h-4 bg-tv-border mx-1"></div>
                              <button onClick={() => setIsMagnetMode(!isMagnetMode)} className={`p-1.5 rounded transition-colors ${isMagnetMode ? 'bg-tv-blue text-white' : 'text-tv-muted hover:text-white hover:bg-[#2a2e39]'}`} title="Magnet Mode">
                                  <Magnet size={14} />
                              </button>
                              <button onClick={() => setShowVolume(!showVolume)} className={`p-1.5 rounded transition-colors ${showVolume ? 'bg-tv-blue text-white' : 'text-tv-muted hover:text-white hover:bg-[#2a2e39]'}`} title="Toggle Volume">
                                  <BarChart3 size={14} />
                              </button>
                              <button className="p-1.5 text-tv-muted hover:text-white hover:bg-[#2a2e39] rounded transition-colors" title="Snapshot Chart"><Camera size={14} /></button>

                              {(drawings.length > 0 || fibs.length > 0 || rects.length > 0) && (
                                <button onClick={() => { setDrawings([]); setFibs([]); setRects([]); }} className="p-1.5 text-tv-muted hover:text-red-500 hover:bg-[#2a2e39] rounded" title="Clear All Drawings">
                                    <Trash2 size={14} />
                                </button>
                              )}
                          </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                          <button onClick={() => handleZoom('out')} className="p-1 text-tv-muted hover:text-white hover:bg-[#2a2e39] rounded"><ZoomOut size={16} /></button>
                          <button onClick={() => handleZoom('in')} className="p-1 text-tv-muted hover:text-white hover:bg-[#2a2e39] rounded"><ZoomIn size={16} /></button>
                          <button onClick={() => setViewWindow(null)} className="p-1 text-tv-muted hover:text-white hover:bg-[#2a2e39] rounded" title="Reset Zoom"><RefreshCcw size={14} /></button>
                      </div>
                  </div>

                  {/* Chart Info Overlay (Enhanced Legend) */}
                  <div className="absolute top-14 left-4 z-10 pointer-events-none select-none">
                      <div className="flex flex-col gap-1 pointer-events-auto">
                        <div className="flex flex-wrap items-baseline gap-4 bg-[#1e222d]/90 backdrop-blur-sm p-3 rounded-lg border border-transparent hover:border-tv-border transition-colors shadow-lg">
                            {!hoverData && (
                                <div className="flex items-baseline gap-4">
                                    <span className={`text-3xl font-bold tracking-tight ${colorClass}`}>{currentPrice.toFixed(2)}</span>
                                    <div className="flex flex-col">
                                        <span className={`text-sm font-medium ${colorClass} flex items-center gap-1`}>
                                            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                            {change > 0 ? '+' : ''}{change.toFixed(2)} ({change > 0 ? '+' : ''}{changeP.toFixed(2)}%)
                                        </span>
                                    </div>
                                </div>
                            )}
                            {hoverData && (
                                <>
                                    <div className="flex gap-4 text-xs font-mono">
                                        <div><span className="text-tv-muted">O</span> <span className={hoverData.open > hoverData.close ? 'text-tv-red' : 'text-tv-green'}>{hoverData.open.toFixed(2)}</span></div>
                                        <div><span className="text-tv-muted">H</span> <span className={hoverData.high > hoverData.close ? 'text-tv-red' : 'text-tv-green'}>{hoverData.high.toFixed(2)}</span></div>
                                        <div><span className="text-tv-muted">L</span> <span className={hoverData.low > hoverData.close ? 'text-tv-red' : 'text-tv-green'}>{hoverData.low.toFixed(2)}</span></div>
                                        <div><span className="text-tv-muted">C</span> <span className={hoverData.close > hoverData.open ? 'text-tv-green' : 'text-tv-red'}>{hoverData.close.toFixed(2)}</span></div>
                                        <div className={`${hoverData.change >= 0 ? 'text-tv-green' : 'text-tv-red'}`}>
                                            {hoverData.change > 0 ? '+' : ''}{hoverData.change.toFixed(2)} ({hoverData.changeP.toFixed(2)}%)
                                        </div>
                                    </div>
                                    <div className="text-xs text-tv-muted font-mono border-l border-tv-border pl-4">
                                        Vol <span className="text-white">{Math.floor(hoverData.vol).toLocaleString()}</span>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="flex flex-col gap-1 px-1 mt-1">
                            {indicators.filter(i => i.enabled).map(ind => {
                                const displayVal = hoverData?.indicators?.find(hi => hi.color === ind.color)?.value 
                                    || (indicatorValues[ind.id].length > 0 ? indicatorValues[ind.id][indicatorValues[ind.id].length-1] : 0);
                                return (
                                    <div key={ind.id} className="text-[10px] font-mono flex items-center gap-2 bg-[#1e222d]/80 px-2 py-0.5 rounded w-fit">
                                        <span style={{ color: ind.color }}>{ind.name} ({ind.period || ''})</span>
                                        {ind.type === 'MACD' ? <span className="text-white text-[9px] opacity-80">(MACD)</span> : <span className="text-white">{displayVal ? displayVal.toFixed(2) : '—'}</span>}
                                    </div>
                                )
                            })}
                        </div>
                      </div>
                  </div>

                  {/* Chart Container */}
                  <div className="flex flex-1 relative mt-2 overflow-hidden">
                      <div 
                        ref={chartRef}
                        className={`flex-1 relative h-full overflow-hidden ${activeTool !== 'cursor' ? 'cursor-cell' : isDragging ? 'cursor-grabbing' : 'cursor-crosshair'}`}
                        onWheel={handleWheel}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                      >
                          {/* Watermark */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.03]">
                              <span className="text-[150px] font-black text-white whitespace-nowrap">{item.symbol}</span>
                          </div>

                          <svg className="w-full h-full relative z-10" preserveAspectRatio="none" viewBox="0 0 100 100">
                              <g className="opacity-10 stroke-tv-text" strokeWidth="0.5" strokeDasharray="2,2">
                                  {yAxisTicks.map(t => <line key={t} x1="0" y1={getY(t)} x2="100" y2={getY(t)} />)}
                                  {xAxisTicks.map((t, i) => <line key={i} x1={t.x} y1="0" x2={t.x} y2={hasBottomPane ? mainChartHeight : 100} />)}
                              </g>
                              {hasBottomPane && <line x1="0" y1={mainChartHeight} x2="100" y2={mainChartHeight} stroke="#2a2e39" strokeWidth="2" />}
                              
                              {showVolume && (
                                <g className="opacity-30">
                                    {visibleData.map((d, i) => {
                                        const chartBottom = hasBottomPane ? mainChartHeight : 100;
                                        const barHeight = (d.vol / maxVol) * 15; 
                                        const widthPercent = 100 / visibleData.length;
                                        const x = i * widthPercent;
                                        const isUp = d.close >= d.open;
                                        return <rect key={`vol-${i}`} x={x + (widthPercent * 0.1)} y={chartBottom - barHeight} width={widthPercent * 0.8} height={barHeight} fill={isUp ? '#089981' : '#f23645'} />
                                    })}
                                </g>
                              )}

                              <g>
                                  {(chartType === 'candles' || chartType === 'heikin_ashi') ? (
                                      visibleData.map((d, i) => {
                                          const isUp = d.close >= d.open;
                                          const color = isUp ? '#089981' : '#f23645';
                                          const widthPercent = 100 / visibleData.length;
                                          const xCenter = (i * widthPercent) + (widthPercent / 2);
                                          const xBody = (i * widthPercent) + (widthPercent * 0.15);
                                          const bodyWidth = widthPercent * 0.7;
                                          const yOpen = getY(d.open);
                                          const yClose = getY(d.close);
                                          const yHigh = getY(d.high);
                                          const yLow = getY(d.low);
                                          const bodyTop = Math.min(yOpen, yClose);
                                          const bodyHeight = Math.max(0.3, Math.abs(yOpen - yClose)); 

                                          return (
                                              <g key={`candle-${i}`}>
                                                  <line x1={xCenter} y1={yHigh} x2={xCenter} y2={yLow} stroke={color} strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
                                                  <rect x={xBody} y={bodyTop} width={bodyWidth} height={bodyHeight} fill={color} />
                                              </g>
                                          )
                                      })
                                  ) : renderChartPath()}
                              </g>

                              {indicators.map(ind => {
                                  if (!ind.enabled || ind.pane !== 'overlay') return null;
                                  const fullValues = indicatorValues[ind.id];
                                  const visibleIndValues = fullValues.slice(visibleIndices.start, visibleIndices.end + 1);
                                  const pathD = visibleIndValues.map((val, i) => {
                                      if (val === null) return null;
                                      const widthPercent = 100 / visibleData.length;
                                      const xCenter = (i * widthPercent) + (widthPercent / 2);
                                      return `${i === 0 ? 'M' : 'L'} ${xCenter} ${getY(val)}`;
                                  }).filter(Boolean).join(' ');
                                  return <path key={ind.id} d={pathD} fill="none" stroke={ind.color} strokeWidth={ind.lineWidth} vectorEffect="non-scaling-stroke" className="opacity-80" />;
                              })}

                              {hasBottomPane && activeBottomIndicator && (
                                  <g>
                                      {activeBottomIndicator.type === 'RSI' && (() => {
                                            const fullValues = indicatorValues[activeBottomIndicator.id];
                                            const visibleIndValues = fullValues.slice(visibleIndices.start, visibleIndices.end + 1);
                                            const pathD = visibleIndValues.map((val, i) => {
                                                if (val === null) return null;
                                                const widthPercent = 100 / visibleData.length;
                                                const xCenter = (i * widthPercent) + (widthPercent / 2);
                                                return `${i === 0 ? 'M' : 'L'} ${xCenter} ${getRSIY(val)}`;
                                            }).filter(Boolean).join(' ');
                                            return (
                                                <g>
                                                    <rect x="0" y={getRSIY(70)} width="100" height={getRSIY(30) - getRSIY(70)} fill={activeBottomIndicator.color} fillOpacity="0.1" />
                                                    <line x1="0" y1={getRSIY(70)} x2="100" y2={getRSIY(70)} stroke={activeBottomIndicator.color} strokeWidth="0.5" strokeDasharray="4,4" opacity="0.5" />
                                                    <line x1="0" y1={getRSIY(30)} x2="100" y2={getRSIY(30)} stroke={activeBottomIndicator.color} strokeWidth="0.5" strokeDasharray="4,4" opacity="0.5" />
                                                    <path d={pathD} fill="none" stroke={activeBottomIndicator.color} strokeWidth={activeBottomIndicator.lineWidth} vectorEffect="non-scaling-stroke" />
                                                </g>
                                            )
                                      })()}
                                      {activeBottomIndicator.type === 'MACD' && (() => {
                                            const macdData = indicatorValues[activeBottomIndicator.id][0];
                                            if (!macdData) return null;
                                            const { macdLine, signalLine, histogram } = macdData;
                                            const getMY = (v: number) => getBottomPaneY(v, bottomMin, bottomMax);
                                            const histBars = histogram.slice(visibleIndices.start, visibleIndices.end + 1).map((val: number, i: number) => {
                                                if (val === null) return null;
                                                const widthPercent = 100 / visibleData.length;
                                                const x = (i * widthPercent) + (widthPercent * 0.1);
                                                const w = widthPercent * 0.8;
                                                const zeroY = getMY(0);
                                                const valY = getMY(val);
                                                const h = Math.abs(zeroY - valY);
                                                const y = val >= 0 ? valY : zeroY;
                                                const color = val >= 0 ? '#089981' : '#f23645';
                                                return <rect key={i} x={x} y={y} width={w} height={h} fill={color} opacity="0.5" />
                                            });
                                            const drawLine = (dataArr: number[], color: string, w: number = 1.5) => {
                                                const vals = dataArr.slice(visibleIndices.start, visibleIndices.end + 1);
                                                const d = vals.map((val, i) => {
                                                    if (val === null) return null;
                                                    const widthPercent = 100 / visibleData.length;
                                                    const xCenter = (i * widthPercent) + (widthPercent / 2);
                                                    return `${i === 0 ? 'M' : 'L'} ${xCenter} ${getMY(val)}`;
                                                }).filter(Boolean).join(' ');
                                                return <path d={d} fill="none" stroke={color} strokeWidth={w} vectorEffect="non-scaling-stroke" />
                                            };
                                            return (
                                                <g>
                                                    <line x1="0" y1={getMY(0)} x2="100" y2={getMY(0)} stroke="#787b86" strokeWidth="0.5" />
                                                    {histBars}
                                                    {drawLine(macdLine, '#2962ff', activeBottomIndicator.lineWidth)}
                                                    {drawLine(signalLine, '#f59e0b', activeBottomIndicator.lineWidth)}
                                                </g>
                                            )
                                      })()}
                                  </g>
                              )}
                              
                              {/* Drawings Overlays */}
                              {drawings.map((price, i) => (
                                  <line key={`draw-${i}`} x1="0" y1={getY(price)} x2="100" y2={getY(price)} stroke="#2962ff" strokeWidth="1" strokeDasharray="6,6" vectorEffect="non-scaling-stroke" />
                              ))}

                              {/* Rectangles */}
                              {rects.map((r, i) => {
                                  const minX = Math.min(r.start.x, r.end.x);
                                  const minY = Math.min(getY(r.start.price), getY(r.end.price));
                                  const w = Math.abs(r.end.x - r.start.x);
                                  const h = Math.abs(getY(r.end.price) - getY(r.start.price));
                                  return <rect key={`rect-${i}`} x={minX} y={minY} width={w} height={h} fill="#2962ff" fillOpacity="0.1" stroke="#2962ff" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                              })}
                              
                              {activeTool === 'rect' && interactionStart && interactionEnd && (
                                  <rect 
                                    x={Math.min(interactionStart.x, interactionEnd.x)} 
                                    y={Math.min(interactionStart.y, interactionEnd.y)} 
                                    width={Math.abs(interactionEnd.x - interactionStart.x)} 
                                    height={Math.abs(interactionEnd.y - interactionStart.y)} 
                                    fill="#2962ff" fillOpacity="0.1" stroke="#2962ff" strokeWidth="1" vectorEffect="non-scaling-stroke" 
                                  />
                              )}

                              {fibs.map((fib, i) => {
                                  const yStart = getY(fib.start.price);
                                  const yEnd = getY(fib.end.price);
                                  const diff = yEnd - yStart;
                                  const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
                                  return (
                                    <g key={`fib-${i}`}>
                                        <line x1={fib.start.x} y1={yStart} x2={fib.end.x} y2={yEnd} stroke="#787b86" strokeWidth="1" strokeDasharray="4,4" />
                                        {levels.map(lvl => {
                                            const y = yStart + (diff * lvl);
                                            return <line key={lvl} x1="0" y1={y} x2="100" y2={y} stroke={lvl===0||lvl===1 ? '#787b86' : '#2962ff'} strokeWidth="1" opacity="0.6" vectorEffect="non-scaling-stroke" />
                                        })}
                                    </g>
                                  )
                              })}
                              
                              {activeTool === 'fib' && interactionStart && interactionEnd && (
                                  <g>
                                      <line x1={interactionStart.x} y1={interactionStart.y} x2={interactionEnd.x} y2={interactionEnd.y} stroke="#white" strokeWidth="1" strokeDasharray="4,4" />
                                      {[0, 0.236, 0.382, 0.5, 0.618, 0.786, 1].map(lvl => {
                                          const y = interactionStart.y + ((interactionEnd.y - interactionStart.y) * lvl);
                                          return <line key={lvl} x1="0" y1={y} x2="100" y2={y} stroke="#2962ff" strokeWidth="1" opacity="0.6" vectorEffect="non-scaling-stroke" />
                                      })}
                                  </g>
                              )}

                              {/* Trades Markers */}
                              {trades.map((trade) => {
                                  const visibleIndex = trade.time - visibleIndices.start;
                                  if (visibleIndex < 0 || visibleIndex >= visibleData.length) return null;
                                  
                                  const widthPercent = 100 / visibleData.length;
                                  const x = (visibleIndex * widthPercent) + (widthPercent / 2);
                                  const y = getY(trade.price);
                                  
                                  return (
                                      <g key={trade.id}>
                                          <polygon 
                                            points={trade.side === 'buy' ? `${x},${y+2} ${x-1.5},${y+5} ${x+1.5},${y+5}` : `${x},${y-2} ${x-1.5},${y-5} ${x+1.5},${y-5}`} 
                                            fill={trade.side === 'buy' ? '#2962ff' : '#f23645'} 
                                          />
                                      </g>
                                  )
                              })}

                              {activeTool === 'measure' && renderMeasurementOverlay()}

                              <line x1="0" y1={getY(currentPrice)} x2="100" y2={getY(currentPrice)} stroke={isPositive ? '#089981' : '#f23645'} strokeWidth="1" strokeDasharray="4,4" vectorEffect="non-scaling-stroke" opacity="0.8" />

                              {/* Crosshair */}
                              {hoverData && !isDragging && activeTool === 'cursor' && (
                                  <g>
                                      <line x1={hoverData.x} y1="0" x2={hoverData.x} y2="100" stroke="#787b86" strokeWidth="1" strokeDasharray="6,6" vectorEffect="non-scaling-stroke" opacity="0.8" />
                                      <line x1="0" y1={hoverData.y} x2="100" y2={hoverData.y} stroke="#787b86" strokeWidth="1" strokeDasharray="6,6" vectorEffect="non-scaling-stroke" opacity="0.8" />
                                      {hoverData.indicators?.map((hi, i) => (
                                          <circle key={i} cx={hoverData.x} cy={getY(hi.value)} r="3" fill={hi.color} stroke="#1e222d" strokeWidth="1" />
                                      ))}
                                  </g>
                              )}
                          </svg>

                          {/* Floating Interactive Tooltip */}
                          {hoverData && !isDragging && activeTool === 'cursor' && (
                              <div 
                                  className="absolute z-50 bg-[#1e222d]/95 backdrop-blur-md border border-tv-border shadow-2xl rounded-md p-3 pointer-events-none text-xs animate-in fade-in zoom-in-95 duration-75 flex flex-col gap-2 min-w-[180px]"
                                  style={{
                                      left: hoverData.x > 50 ? 'auto' : `calc(${hoverData.x}% + 20px)`,
                                      right: hoverData.x > 50 ? `calc(${100 - hoverData.x}% + 20px)` : 'auto',
                                      top: `${hoverData.y}%`,
                                      transform: 'translateY(-50%)'
                                  }}
                              >
                                  <div className="flex justify-between items-center border-b border-tv-border/50 pb-2">
                                      <span className="font-bold text-white">{new Date(hoverData.time).toLocaleDateString()}</span>
                                      <span className="text-tv-muted font-mono">{new Date(hoverData.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                  </div>
                                  
                                  <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-[11px]">
                                      <span className="text-tv-muted">Open</span><span className="font-mono text-tv-text">{hoverData.open.toFixed(2)}</span>
                                      <span className="text-tv-muted">High</span><span className="font-mono text-tv-text">{hoverData.high.toFixed(2)}</span>
                                      <span className="text-tv-muted">Low</span><span className="font-mono text-tv-text">{hoverData.low.toFixed(2)}</span>
                                      <span className="text-tv-muted">Close</span><span className={`font-mono font-bold ${hoverData.close >= hoverData.open ? 'text-tv-green' : 'text-tv-red'}`}>{hoverData.close.toFixed(2)}</span>
                                      <span className="text-tv-muted">Change</span>
                                      <span className={`font-mono ${hoverData.change >= 0 ? 'text-tv-green' : 'text-tv-red'}`}>
                                          {hoverData.change > 0 ? '+' : ''}{hoverData.change.toFixed(2)} ({hoverData.changeP.toFixed(2)}%)
                                      </span>
                                      <span className="text-tv-muted">Volume</span><span className="font-mono text-tv-text">{Math.floor(hoverData.vol).toLocaleString()}</span>
                                  </div>

                                  {hoverData.indicators && hoverData.indicators.length > 0 && (
                                      <div className="border-t border-tv-border/50 pt-2 grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-[11px]">
                                          {hoverData.indicators.map((ind, i) => (
                                              <React.Fragment key={i}>
                                                  <span className="flex items-center gap-1.5 text-tv-muted">
                                                      <span className="w-1.5 h-1.5 rounded-full" style={{background: ind.color}}></span>
                                                      {ind.name}
                                                  </span>
                                                  <span className="font-mono text-white">{ind.value.toFixed(2)}</span>
                                              </React.Fragment>
                                          ))}
                                      </div>
                                  )}
                              </div>
                          )}

                          {/* Axis Labels */}
                          {hoverData && !isDragging && activeTool === 'cursor' && (
                              <>
                                <div className={`absolute right-0 translate-x-0 px-1.5 py-0.5 text-xs font-bold text-white rounded-l-sm z-20 pointer-events-none bg-tv-panel border border-tv-border`} style={{ top: `calc(${hoverData.y}% - 10px)` }}>
                                    {hoverData.close.toFixed(2)}
                                </div>
                                <div className="absolute bottom-0 -translate-x-1/2 px-1.5 py-0.5 text-xs font-bold text-white bg-tv-panel rounded-t-sm z-20 pointer-events-none border border-tv-border border-b-0" style={{ left: `${hoverData.x}%` }}>
                                    {new Date(hoverData.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </div>
                              </>
                          )}
                          {!hoverData && (
                            <div className={`absolute right-0 px-1.5 py-0.5 text-xs font-bold text-white rounded-l-sm z-10 pointer-events-none ${isPositive ? 'bg-tv-green' : 'bg-tv-red'}`} style={{ top: `calc(${getY(currentPrice)}% - 10px)` }}>
                                {currentPrice.toFixed(2)}
                            </div>
                          )}
                      </div>

                      <div className="w-12 h-full border-l border-tv-border bg-[#131722] flex flex-col justify-between py-2 overflow-hidden relative select-none">
                          {yAxisTicks.map((tick, i) => (
                              <div key={i} className="absolute right-1 text-[10px] text-tv-muted transform -translate-y-1/2" style={{ top: `${getY(tick)}%` }}>{tick.toFixed(2)}</div>
                          ))}
                          {hasBottomPane && activeBottomIndicator && activeBottomIndicator.type === 'RSI' && (
                              <>
                                <div className="absolute right-1 text-[9px] text-tv-muted" style={{ top: `${getRSIY(70)}%`, transform: 'translateY(-50%)' }}>70</div>
                                <div className="absolute right-1 text-[9px] text-tv-muted" style={{ top: `${getRSIY(30)}%`, transform: 'translateY(-50%)' }}>30</div>
                              </>
                          )}
                          {hasBottomPane && activeBottomIndicator && activeBottomIndicator.type === 'MACD' && (
                              <div className="absolute right-1 text-[9px] text-tv-muted" style={{ top: `${getBottomPaneY(0, bottomMin, bottomMax)}%`, transform: 'translateY(-50%)' }}>0.00</div>
                          )}
                      </div>
                  </div>
                  
                  <div className="h-6 w-full flex border-t border-tv-border bg-[#131722] relative overflow-hidden select-none pr-12">
                      {xAxisTicks.map((tick, i) => (
                          <div key={i} className="absolute top-1 text-[10px] text-tv-muted transform -translate-x-1/2 whitespace-nowrap" style={{ left: `${tick.x}%` }}>
                              {tick.label.toLocaleDateString([], { month: 'short', day: 'numeric' })} {tick.label.getHours()}:{String(tick.label.getMinutes()).padStart(2,'0')}
                          </div>
                      ))}
                      <div className="absolute right-14 top-1 text-[9px] text-tv-muted font-mono bg-[#2a2e39] px-1 rounded">
                          00:34 until close
                      </div>
                  </div>
              </div>

              {/* Bottom Panel (Tabs) */}
              <div className="bg-[#1e222d] border border-tv-border rounded-lg flex flex-col overflow-hidden min-h-[400px]">
                <div className="flex items-center border-b border-tv-border bg-[#2a2e39]/50">
                    <button onClick={() => setActiveTab('history')} className={`px-4 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'history' ? 'border-tv-blue text-white bg-[#1e222d]' : 'border-transparent text-tv-muted hover:text-white hover:bg-[#2a2e39]'}`}>
                        <List size={16} /> Historical Data
                    </button>
                    <button onClick={() => setActiveTab('time_sales')} className={`px-4 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'time_sales' ? 'border-tv-blue text-white bg-[#1e222d]' : 'border-transparent text-tv-muted hover:text-white hover:bg-[#2a2e39]'}`}>
                        <History size={16} /> Time & Sales
                    </button>
                    <button onClick={() => setActiveTab('news')} className={`px-4 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'news' ? 'border-tv-blue text-white bg-[#1e222d]' : 'border-transparent text-tv-muted hover:text-white hover:bg-[#2a2e39]'}`}>
                        <Newspaper size={16} /> News & Analysis
                    </button>
                    <button onClick={() => setActiveTab('about')} className={`px-4 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'about' ? 'border-tv-blue text-white bg-[#1e222d]' : 'border-transparent text-tv-muted hover:text-white hover:bg-[#2a2e39]'}`}>
                        <FileText size={16} /> About
                    </button>
                </div>
                <div className="flex-1 overflow-hidden">
                    {activeTab === 'history' && (
                        <div className="flex flex-col h-full">
                            <div className="p-3 border-b border-tv-border flex justify-end">
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-tv-muted" />
                                    <input type="text" placeholder="Filter by date..." value={filterQuery} onChange={(e) => setFilterQuery(e.target.value)} className="bg-[#2a2e39] text-tv-text text-xs rounded-full pl-8 pr-3 py-1.5 focus:outline-none border border-transparent focus:border-tv-blue w-full sm:w-48 transition-all" />
                                </div>
                            </div>
                            <div className="overflow-auto flex-1 custom-scrollbar">
                                <table className="w-full text-sm text-right border-collapse">
                                    <thead className="bg-[#2a2e39] text-tv-muted text-xs uppercase font-medium sticky top-0 z-10">
                                        <tr>
                                            {[
                                                { id: 'time', label: 'Date' },
                                                { id: 'open', label: 'Open' },
                                                { id: 'high', label: 'High' },
                                                { id: 'low', label: 'Low' },
                                                { id: 'close', label: 'Close' },
                                                { id: 'change', label: 'Change' },
                                                { id: 'vol', label: 'Volume' },
                                            ].map(col => (
                                                <th key={col.id} onClick={() => handleSort(col.id)} className={`py-3 px-4 cursor-pointer hover:bg-[#363a45] hover:text-white transition-colors select-none text-right ${col.id === 'time' ? 'text-left' : ''}`}>
                                                    <div className={`flex items-center gap-1 ${col.id === 'time' ? 'justify-start' : 'justify-end'}`}>
                                                        {col.label}
                                                        {sortConfig?.key === col.id && <ArrowUpDown size={12} className={sortConfig.direction === 'asc' ? 'rotate-180' : ''} />}
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-tv-border">
                                        {tableData.map((row, i) => {
                                            const change = row.close - row.open;
                                            const isUp = change >= 0;
                                            return (
                                                <tr key={i} className="hover:bg-[#2a2e39]/50 transition-colors">
                                                    <td className="py-2.5 px-4 text-left text-tv-text font-mono text-xs whitespace-nowrap">
                                                        {new Date(row.time).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </td>
                                                    <td className="py-2.5 px-4 text-tv-text">{row.open.toFixed(2)}</td>
                                                    <td className="py-2.5 px-4 text-tv-text">{row.high.toFixed(2)}</td>
                                                    <td className="py-2.5 px-4 text-tv-text">{row.low.toFixed(2)}</td>
                                                    <td className="py-2.5 px-4 font-medium text-white">{row.close.toFixed(2)}</td>
                                                    <td className={`py-2.5 px-4 ${isUp ? 'text-tv-green' : 'text-tv-red'}`}>{change > 0 ? '+' : ''}{change.toFixed(2)}</td>
                                                    <td className="py-2.5 px-4 text-tv-text">{Math.floor(row.vol).toLocaleString()}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {activeTab === 'time_sales' && (
                        <div className="flex flex-col h-full animate-in fade-in">
                            <div className="p-3 border-b border-tv-border flex justify-between items-center">
                                <span className="text-xs font-bold text-tv-green uppercase flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    Real-time Feed
                                </span>
                                <div className="text-xs text-tv-muted font-mono">
                                    {timeSales.length} Trades
                                </div>
                            </div>
                            <div className="overflow-auto flex-1 custom-scrollbar">
                                <table className="w-full text-sm text-right border-collapse">
                                    <thead className="bg-[#2a2e39] text-tv-muted text-xs uppercase font-medium sticky top-0 z-10">
                                        <tr>
                                            <th className="py-2 px-4 text-left">Time</th>
                                            <th className="py-2 px-4 text-right">Price</th>
                                            <th className="py-2 px-4 text-right">Size</th>
                                            <th className="py-2 px-4 text-right">Side</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-tv-border">
                                        {timeSales.map((trade) => (
                                            <tr key={trade.id} className="hover:bg-[#2a2e39]/50 transition-colors">
                                                <td className="py-2 px-4 text-left text-tv-muted font-mono text-xs whitespace-nowrap">
                                                    {new Date(trade.time).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </td>
                                                <td className={`py-2 px-4 font-mono font-medium ${trade.side === 'buy' ? 'text-tv-green' : 'text-tv-red'}`}>
                                                    {trade.price.toFixed(2)}
                                                </td>
                                                <td className="py-2 px-4 text-white text-xs">
                                                    {trade.size}
                                                </td>
                                                <td className={`py-2 px-4 text-xs font-bold uppercase ${trade.side === 'buy' ? 'text-tv-green' : 'text-tv-red'}`}>
                                                    {trade.side}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {activeTab === 'news' && (
                        <div className="flex flex-col h-full">
                            <div className="p-4 border-b border-tv-border bg-gradient-to-b from-tv-blue/10 to-transparent">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-tv-blue/10 rounded-full"><Sparkles className="text-tv-blue" size={20} /></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-sm font-bold text-white">AI Market Sentiment</h4>
                                            <button onClick={handleAnalyzeNews} disabled={isAnalyzing} className="text-xs bg-tv-blue hover:bg-blue-600 text-white px-3 py-1.5 rounded transition-colors disabled:opacity-50">
                                                {isAnalyzing ? 'Analyzing...' : 'Generate Analysis'}
                                            </button>
                                        </div>
                                        {newsAnalysis ? (
                                            <div className="space-y-3 animate-in fade-in">
                                                <p className="text-sm text-tv-text leading-relaxed">{newsAnalysis.text}</p>
                                                {newsAnalysis.sources.length > 0 && (
                                                    <div className="border-t border-tv-border/50 pt-2">
                                                        <span className="text-[10px] text-tv-muted font-bold uppercase mb-2 block">Citations</span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {newsAnalysis.sources.map((src, i) => (
                                                                <a key={i} href={src.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] bg-[#2a2e39] hover:bg-[#363a45] text-tv-blue px-2 py-1 rounded transition-colors truncate max-w-[200px]" title={src.title}>
                                                                    <ExternalLink size={10} /> {src.title}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-tv-muted italic">Click generate to analyze current market conditions for {item.symbol} using real-time search data.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 overflow-auto flex-1 custom-scrollbar space-y-4">
                                <h3 className="text-xs font-bold text-tv-muted uppercase tracking-wider mb-2 sticky top-0 bg-[#1e222d] py-2 z-10">Latest News</h3>
                                {MOCK_NEWS_ITEMS.map(news => (
                                    <div key={news.id} className="flex gap-4 group cursor-pointer hover:bg-[#2a2e39]/50 p-3 rounded-xl transition-all border border-transparent hover:border-tv-border">
                                        <div className="w-24 h-16 bg-[#2a2e39] rounded-lg flex-shrink-0 overflow-hidden relative">
                                            <img src={news.image} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="text-[10px] font-bold text-tv-blue uppercase bg-tv-blue/10 px-1.5 py-0.5 rounded border border-tv-blue/10">{news.source}</span>
                                                <span className="text-[10px] text-tv-muted flex items-center gap-1"><Clock size={10} /> {news.time}</span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                                    news.sentiment === 'Bullish' ? 'text-tv-green bg-tv-green/10' : 
                                                    news.sentiment === 'Bearish' ? 'text-tv-red bg-tv-red/10' : 'text-tv-text bg-tv-text/10'
                                                }`}>
                                                    {news.sentiment}
                                                </span>
                                            </div>
                                            <h4 className="text-sm font-bold text-white mb-1 group-hover:text-tv-blue transition-colors leading-tight truncate">{news.title}</h4>
                                            <p className="text-xs text-tv-muted line-clamp-2 leading-relaxed">{news.summary}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'about' && (
                        <div className="p-6 overflow-auto h-full custom-scrollbar">
                            <h3 className="text-xl font-bold text-white mb-4">About {item.name}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <p className="text-sm text-tv-text leading-relaxed">{item.name} ({item.symbol}) is a leading entity in the {item.sector} sector.</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[#2a2e39]/50 p-3 rounded"><span className="text-xs text-tv-muted block mb-1">Sector</span><span className="text-sm font-medium text-white">{item.sector}</span></div>
                                        <div className="bg-[#2a2e39]/50 p-3 rounded"><span className="text-xs text-tv-muted block mb-1">Industry</span><span className="text-sm font-medium text-white">General</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
              </div>
          </div>
          <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => openTradeModal('buy')} className="bg-tv-blue hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-md transition-all flex flex-col items-center justify-center gap-1 shadow-lg active:scale-[0.98]">
                      <span className="text-xs font-normal opacity-80">BUY</span><span className="text-lg">{(currentPrice * 1.0005).toFixed(2)}</span>
                  </button>
                  <button onClick={() => openTradeModal('sell')} className="bg-tv-red hover:bg-red-600 text-white font-bold py-3 px-4 rounded-md transition-all flex flex-col items-center justify-center gap-1 shadow-lg active:scale-[0.98]">
                      <span className="text-xs font-normal opacity-80">SELL</span><span className="text-lg">{(currentPrice * 0.9995).toFixed(2)}</span>
                  </button>
              </div>
              <div className={`bg-[#1e222d] border border-tv-border rounded-lg flex flex-col overflow-hidden transition-all duration-300 ${isOrderBookOpen ? 'flex-1' : 'h-auto'}`}>
                  <div 
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-[#2a2e39]/30 transition-colors"
                      onClick={() => setIsOrderBookOpen(!isOrderBookOpen)}
                  >
                      <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                          <Clock size={16} className="text-tv-blue" /> 
                          Order Book
                      </h3>
                      <div className="flex items-center gap-3">
                           <MoreHorizontal size={16} className="text-tv-muted hover:text-white" />
                           <ChevronDown size={16} className={`text-tv-muted transition-transform duration-300 ${isOrderBookOpen ? 'rotate-180' : ''}`} />
                      </div>
                  </div>
                  
                  {isOrderBookOpen && (
                      <div className="flex flex-col h-full">
                          <div className="px-4 pb-2 border-b border-tv-border/30 mb-2">
                              <div className="flex h-1.5 w-full bg-[#2a2e39] rounded-full overflow-hidden">
                                  <div className="bg-tv-green transition-all duration-500" style={{ width: `${orderBookData.imbalance}%` }} />
                                  <div className="bg-tv-red transition-all duration-500 flex-1" />
                              </div>
                              <div className="flex justify-between text-[10px] text-tv-muted mt-1 font-mono font-medium">
                                  <span className="text-tv-green">{orderBookData.imbalance.toFixed(0)}% Bids</span>
                                  <span className="text-tv-red">{(100-orderBookData.imbalance).toFixed(0)}% Asks</span>
                              </div>
                          </div>

                          <div className="grid grid-cols-[1fr_1fr_1fr] px-4 pb-2 text-[10px] text-tv-muted uppercase font-bold">
                              <div className="text-left">Price</div>
                              <div className="text-right">Size</div>
                              <div className="text-right">Total</div>
                          </div>

                          <div className="space-y-0.5 text-sm flex-1 overflow-y-auto pr-1 custom-scrollbar px-4 pt-0">
                              {orderBookData.asks.map((ask, i) => (
                                <div 
                                    key={`ask-${i}`} 
                                    className="grid grid-cols-[1fr_1fr_1fr] items-center relative group cursor-pointer hover:bg-[#2a2e39] p-1 rounded-sm animate-in fade-in duration-300"
                                    onClick={() => openTradeModal('buy', ask.price)}
                                >
                                    <span className="text-tv-red font-mono text-xs z-10 text-left">{ask.price.toFixed(2)}</span>
                                    <span className="text-white text-xs opacity-90 z-10 text-right">{ask.size}</span>
                                    <span className="text-tv-muted text-xs z-10 text-right">{ask.total}</span>
                                    <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-tv-red/20 to-transparent transition-all duration-300" style={{ width: `${(ask.total/orderBookData.maxVol)*100}%`}}></div>
                                </div>
                              ))}
                              
                              <div className="py-2 my-1 border-y border-tv-border/50 bg-[#2a2e39]/30 px-2 rounded flex justify-between items-center group">
                                  <div className="flex flex-col">
                                      <span className={`text-lg font-bold ${colorClass} animate-in zoom-in duration-100 font-mono`}>{currentPrice.toFixed(2)}</span>
                                      <span className={`text-[10px] ${isPositive ? 'text-tv-green' : 'text-tv-red'} flex items-center gap-1 font-mono`}>
                                          {Math.abs(change).toFixed(2)} {change > 0 ? '↑' : '↓'}
                                      </span>
                                  </div>
                                  <div className="text-right">
                                      <span className="text-[9px] text-tv-muted uppercase block tracking-wider">Spread</span>
                                      <span className="text-xs text-white font-mono">{orderBookData.spread.toFixed(2)} <span className="text-tv-muted text-[10px]">({orderBookData.spreadP.toFixed(2)}%)</span></span>
                                  </div>
                              </div>

                              {orderBookData.bids.map((bid, i) => (
                                <div 
                                    key={`bid-${i}`} 
                                    className="grid grid-cols-[1fr_1fr_1fr] items-center relative group cursor-pointer hover:bg-[#2a2e39] p-1 rounded-sm animate-in fade-in duration-300"
                                    onClick={() => openTradeModal('sell', bid.price)}
                                >
                                    <span className="text-tv-green font-mono text-xs z-10 text-left">{bid.price.toFixed(2)}</span>
                                    <span className="text-white text-xs opacity-90 z-10 text-right">{bid.size}</span>
                                    <span className="text-tv-muted text-xs z-10 text-right">{bid.total}</span>
                                    <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-tv-green/20 to-transparent transition-all duration-300" style={{ width: `${(bid.total/orderBookData.maxVol)*100}%`}}></div>
                                </div>
                              ))}
                          </div>
                          {renderDepthChart()}
                      </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};

export default SymbolDetailView;
