
import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Eye, TrendingUp, Activity, Filter, Search, Share2, MoreHorizontal, ExternalLink, X, Clock, User, MapPin, Calendar as CalendarIcon, Users, Star as StarIcon } from 'lucide-react';

interface TradeIdea {
  id: number;
  author: string;
  authorAvatar?: string;
  date: string;
  title: string;
  description: string;
  takeaways?: string[];
  fullContent: string;
  asset: string;
  category: 'Crypto' | 'Forex' | 'Stocks' | 'Indices' | 'Futures';
  comments: number;
  likes: number;
  views: string;
  timeframe: string;
  type: 'Long' | 'Short' | 'Neutral';
  chartColor: string;
  imageUrl: string;
  tags: string[];
}

const MOCK_IDEAS: TradeIdea[] = [
  {
    id: 1,
    author: "Liquidity_Hunter_Inst",
    date: "Jan 8",
    title: "BTCUSD: Institutional Liquidity Sweep & H4 Market Structure Shift",
    asset: "BTCUSD",
    type: "Long",
    timeframe: "4H",
    likes: 2150,
    comments: 142,
    category: "Crypto",
    chartColor: "#f59e0b",
    tags: ["#SMC", "#ICT", "#LiquiditySweep", "#BTC"],
    takeaways: [
      "Sell-Side Liquidity (SSL) swept at $92,500, mitigating the Daily Bullish Order Block.",
      "Clear Change of Character (CHoCH) observed on the H4 timeframe with high volume displacement.",
      "Upcoming CPI data expected to weaken DXY, providing macro confluence for a run to Buy-Side Liquidity."
    ],
    description: "Bitcoin has successfully raided the internal range liquidity pool, tapping into a high-probability demand zone.",
    views: "62K",
    imageUrl: "https://uk.advfn.com/newspaper/wp-uploads/2025/08/btcbull-640x359.jpg",
    fullContent: "Bitcoin has executed a classic textbook liquidity raid, a maneuver often orchestrated to accumulate positions at wholesale prices. We observed price aggressively trade down to sweep the Sell-Side Liquidity (SSL) resting below the $92,500 swing low. To the untrained eye, this looked like a breakdown, but institutional tracking tools confirm this was a calculated manipulation to mitigate the unmitigated Daily Bullish Order Block (OB) formed in early December. The reaction from this zone was immediate and violent, creating a forceful displacement to the upside that broke the nearest structural high, confirming a Change of Character (CHoCH) on the 4-hour chart. This shift in market structure is the first signal that the local correction has terminated.\n\nCurrently, price is retracing into a Discount array, specifically targeting the 4H Fair Value Gap (FVG) between $94,800 and $95,500. This imbalance aligns perfectly with the 0.618-0.79 Optimal Trade Entry (OTE) fib levels drawn from the recent impulse leg. Smart money is likely accumulating positions here, using the local consolidation as inducement for early shorts before the real move begins. We are looking for price to respect the mean threshold of this gap; a wick below is acceptable, but a candle body close below would be concerning.\n\n**Order Flow & Volume Analysis:**\nAnalyzing the footprint charts, we can see significant absorption of selling pressure in the $93,000 region. Large 'Whale' buy limit orders were resting just below the liquidity pool, absorbing the panic selling from retail traders. As we rallied, the Cumulative Volume Delta (CVD) turned sharply positive, indicating aggressive market buying. This divergence between price making a lower low and CVD making a higher low was the 'smoking gun' for the reversal.\n\n**Multi-Timeframe Alignment:**\nThe Daily chart remains unequivocally bullish, with price respecting the 50-day EMA. The H4 timeframe has now realigned with this Daily bias via the recent CHoCH. Dropping down to the 15m timeframe, we are waiting for a micro-structure shift within the $95k OTE zone to refine our entry trigger. This fractal alignment reduces risk and increases the probability of a sustained expansion.\n\n**Fundamental & Macro Context:**\nFrom a macro perspective, the upcoming CPI print is the catalyst to watch. The bond market is pricing in a cooling of inflation, which would weigh heavily on the Dollar Index (DXY). Since BTC/USD is inversely correlated to DXY, a drop in the dollar would act as rocket fuel for crypto assets. My primary target is the Buy-Side Liquidity (BSL) resting above the $100,000 psychological level, where a mass of stop-losses resides.\n\n**Invalidation Point:**\nThe trade thesis is invalidated upon a Daily candle close below the 0.618 Fibonacci retracement level of the macro range, specifically at $88,000. Closing below this level would violate the Bullish Order Block and suggest that the market is seeking deeper liquidity pools, potentially around $82,000."
  },
  {
    id: 2,
    author: "Cable_Strategist",
    date: "Jan 8",
    title: "GBP/USD: Premium Pricing into Bearish Breaker Block",
    asset: "GBPUSD",
    type: "Short",
    timeframe: "1D",
    likes: 840,
    comments: 65,
    category: "Forex",
    chartColor: "#f23645",
    tags: ["#Forex", "#ICT", "#OrderBlock", "#NFP"],
    takeaways: [
      "Daily Market Structure remains bearish following the Break of Structure (BOS) at 1.2500.",
      "Price is retracing into a Premium, specifically a Bearish Breaker Block confluent with the 0.71 Fib.",
      "NFP payroll data expected to outperform, driving USD demand and forcing Cable lower."
    ],
    description: "The Cable pair is offering a high-probability short setup as it retraces into a premium supply zone ahead of key US labor data.",
    views: "18K",
    imageUrl: "https://www.tradingnews.com/Warehouse/content/pics/pic_40041_a_4bf0cbd6-fb56-437b-8274-5aa56bd669fe.jpg?1=1",
    fullContent: "The GBP/USD pair continues to adhere to a strictly bearish market structure on the daily timeframe. Following the significant Break of Structure (BOS) below the 1.2500 key psychological level, the current rally should be viewed solely as a retracement to reprice the asset into a Premium. We are currently testing a H4 Bearish Breaker Block—a failed demand zone that has flipped to supply—which sits precisely at the 0.71 Fibonacci retracement level. This creates a high-probability 'Short from Premium' scenario.\n\nThis zone is heavily defended by institutional sell orders. Note the large bearish Volume Imbalance left during the previous leg down; price has now filled this inefficiency, balancing the auction. We are seeing rejection wicks on the H4 timeframe, signaling that buyers are exhausted and smart money is distributing positions to retail longs who are chasing momentum. The 1.2750 institutional level is acting as a ceiling, capping any upside deviations.\n\n**Order Flow & Institutional Sponsorship:**\nLooking at the Commitment of Traders (COT) data, commercial hedgers have increased their net short positions on the British Pound over the last three weeks. Simultaneously, open interest has risen during this retracement rally, suggesting that smart money is building a short position rather than covering longs. This is a classic 'distribution' signature before the next leg down.\n\n**Multi-Timeframe Analysis:**\nThe Weekly timeframe shows a clear lower-high formation, keeping the macro trend bearish. The Daily chart is in a corrective pullback phase. The 1-hour chart is beginning to show weakness, failing to make new highs despite repeated attempts. We are waiting for a H1 displacement below the 1.2700 swing low to confirm that the Daily lower high is locked in.\n\n**Macro Catalyst: NFP Data:**\nThe divergence between the Bank of England (BoE) and the Federal Reserve is widening. While the UK economy stagnates, US labor data remains robust. The upcoming NFP report is the catalyst. A strong print will validate the Fed's 'higher for longer' narrative, likely causing a sharp expansion lower in GBP/USD to target the weekly Sell-Side Liquidity pool at 1.2300.\n\n**Invalidation Point:**\nThis bearish thesis is invalidated if we see a Weekly candle close above the 1.2850 level. Such a move would reclaim the Daily Breaker Block and suggest a potential trend reversal or a deeper retracement into higher timeframe supply zones. Until then, any rally is a selling opportunity."
  },
  {
    id: 3,
    author: "Quant_Eq",
    date: "Jan 8",
    title: "TSLA: Filling the Weekly FVG Before Earnings Volatility",
    asset: "TSLA",
    type: "Neutral",
    timeframe: "1W",
    likes: 1100,
    comments: 98,
    category: "Stocks",
    chartColor: "#8b5cf6",
    tags: ["#Stocks", "#GapFill", "#Earnings", "#Wyckoff"],
    takeaways: [
      "Price action is currently balancing a Weekly Bisecting Fair Value Gap (FVG).",
      "Accumulation Schematic (Wyckoff) potentially forming on the H1 timeframe.",
      "Earnings implied volatility suggests a liquidity sweep of $210 before trend resumption."
    ],
    description: "Tesla is compressing within a weekly inefficiency, awaiting a catalyst to dictate the next quarterly trend.",
    views: "34K",
    imageUrl: "https://dr46azxe5rdcu.cloudfront.net/wp-content/uploads/2025/06/05161907/tesla-852x485.jpeg",
    fullContent: "Tesla is currently trading within a large Weekly Fair Value Gap (FVG) created during the Q4 rally. Institutional algorithms often seek to 'balance' these inefficiencies before committing to a new trend. We are seeing price respect the consequent encroachment (50% level) of this gap, which indicates that buyers are stepping in to defend the valuation. However, the lack of energetic displacement to the upside suggests we are still in a consolidation phase, likely awaiting the quarterly earnings call to provide direction.\n\nOn the lower timeframes (H1), a potential Wyckoff Accumulation schematic is developing. We have seen a Selling Climax (SC) and an Automatic Rally (AR), but we are yet to see a definitive Spring phase to sweep the local lows. SMC traders should be wary of 'Engineered Liquidity'—clean equal lows (EQL) resting at $210. It is highly probable that market makers will flush these lows to gather stop-losses, generating the liquidity needed to fill large institutional buy orders before the stock can mark up.\n\n**Order Flow & Dark Pools:**\nDark Pool prints have been spotted clustering around the $215 level, suggesting hidden accumulation. However, the volume profile shows a thinning of liquidity below $210. If the 'Spring' occurs, it could be sharp and fast, dipping into the $200-$205 demand zone to grab liquidity before reversing. This 'Shakeout' pattern is typical of high-beta stocks like Tesla prior to major news events.\n\n**Multi-Timeframe Analysis:**\nThe Monthly chart remains in a secular uptrend, but the Weekly is compressing. The Daily chart is chopping between the 50-day and 200-day moving averages, a sign of indecision. Traders should avoid trading the 'chop' in the middle of the range and instead wait for price to interact with the extremes: the $210 liquidity pool below or the $265 buy-side liquidity above.\n\n**Fundamental Catalyst:**\nFundamentally, the options market is pricing in significant volatility for the upcoming earnings call. The implied move is +/- 8%. If the guidance on margins improves, we could see a post-earnings expansion targeting the buy-side liquidity at $265. Conversely, a loss of the $200 Daily Order Block would invalidate the bullish thesis and target lower gaps.\n\n**Invalidation Point:**\nA Daily close below the psychological $200 level would invalidate the accumulation thesis and signal a potential redistribution phase targeting the $180 gap fill. Bulls need to hold $200 to maintain the structural integrity of the uptrend."
  },
  {
    id: 4,
    author: "Futures_Algo_Desk",
    date: "Jan 8",
    title: "NQ1!: Sell-Side Liquidity Target at 19,500 - Distribution Complete",
    asset: "NQ1!",
    type: "Short",
    timeframe: "1H",
    likes: 560,
    comments: 45,
    category: "Indices",
    chartColor: "#f23645",
    tags: ["#Nasdaq", "#Futures", "#SMC", "#ICT"],
    takeaways: [
      "Distribution phase completed with a failed swing high (SMT Divergence with ES).",
      "Clean Equal Lows (EQL) at 19,500 acting as a magnet for price.",
      "Rising bond yields providing fundamental pressure on growth valuations."
    ],
    description: "Nasdaq futures have completed a distribution profile and are now seeking lower liquidity pools.",
    views: "15K",
    imageUrl: "https://images.unsplash.com/photo-1624996379697-f01d168b1a52?auto=format&fit=crop&q=80&w=800",
    fullContent: "The Nasdaq 100 (NQ) futures contract is showing clear signs of institutional distribution. We recently formed a Swing High that failed to take out the previous high, while the S&P 500 (ES) did make a new high. This SMT Divergence is a classic bearish signal in ICT concepts, indicating underlying weakness in the tech sector compared to the broader market. Following this divergence, price broke structure to the downside with energetic displacement, leaving a bearish Fair Value Gap (FVG) overhead that has yet to be reclaimed.\n\nCurrently, price is consolidating in a tight range, building a pool of liquidity in the form of clean Equal Lows (EQL) around the 19,500 level. In the SMC framework, these lows are a magnet. The algorithm will likely seek to reprice to this level to pair institutional short interests with the stop orders of retail longs resting below support. Any rally into the 20,100 supply zone should be viewed as a shorting opportunity to sell into strength.\n\n**Order Flow & Tape Reading:**\nOn the DOM (Depth of Market), we are seeing aggressive selling absorption at the bid. Every time price attempts to rally, passive sellers reload the offer at 20,050. Furthermore, Delta Divergence is present on the hourly chart: price made a brief push higher earlier today, but Delta was negative, indicating that the move was driven by short covering rather than new aggressive buying.\n\n**Multi-Timeframe Analysis:**\nThe Weekly timeframe printed a potential bearish engulfing candle last week (pending close). The Daily chart has lost its 20-day moving average dynamic support. The 1-hour chart has established a lower-high, lower-low sequence. All timeframes are aligning bearishly, suggesting that the path of least resistance is lower.\n\n**Macro Backdrop:**\nThe macro backdrop supports this bearish thesis. The 10-year Treasury yield is pushing back towards resistance. As yields rise, the discounted cash flow valuations of high-growth tech stocks compress, providing the fundamental catalyst for a repricing event. We are targeting the 19,500 sell-side liquidity, followed by the daily FVG at 19,200 as the primary objectives for this swing trade.\n\n**Invalidation Point:**\nA 4-hour candle close above the recent swing high at 20,250 would invalidate the immediate bearish structure. This would suggest that the SMT Divergence was a false signal and that the market intends to attack the All-Time Highs (ATH) liquidity pool instead."
  },
  {
    id: 5,
    author: "Gold_Standard",
    date: "Jan 8",
    title: "Gold: Compression within Symmetrical Triangle",
    asset: "GC1!",
    type: "Neutral",
    timeframe: "1D",
    likes: 120,
    comments: 12,
    category: "Futures",
    chartColor: "#f59e0b",
    tags: ["#Gold", "#Consolidation"],
    takeaways: [],
    description: "Gold is compressing within a symmetrical triangle pattern near all-time highs.",
    views: "8.2K",
    imageUrl: "https://s3.tradingview.com/news/image/tradingview:48d2760ce094b-7d340541df8e5738afff8cf38927e206-resized.webp",
    fullContent: "Gold is compressing within a symmetrical triangle pattern near all-time highs. We are awaiting a high-volume breakout to confirm the next directional leg. Volatility has been contracting for the last 5 days, forming a textbook coil. A daily close above 2150 or below 2080 will likely dictate the next major trend. Traders should watch for volume spikes on the lower timeframes to confirm the breakout direction."
  },
  {
    id: 6,
    author: "Altcoin_Macro",
    date: "Jan 8",
    title: "ETH/BTC: Reclaiming the 0.04 Support Level",
    asset: "ETHUSD",
    type: "Long",
    timeframe: "1W",
    likes: 410,
    comments: 32,
    category: "Crypto",
    chartColor: "#2962ff",
    tags: ["#Ethereum", "#Altseason"],
    takeaways: [],
    description: "Ethereum is showing relative strength against Bitcoin as it reclaims the 0.04 ratio.",
    views: "12K",
    imageUrl: "https://cryptonary.s3.eu-west-2.amazonaws.com/wp-content/uploads/2024/10/ETH-BTC-featured.webp",
    fullContent: "Ethereum is showing relative strength against Bitcoin as it attempts to reclaim the critical 0.04 ratio support. A weekly close above this level could signal the start of capital rotation into altcoins. The ETH/BTC valuation has been in a downtrend for over a year, but recent institutional inflows into Ethereum ETFs suggest a potential reversal. We are looking for a break of the weekly downtrend line to confirm a 'risk-on' environment for the broader altcoin market."
  },
  {
    id: 7,
    author: "Fx_Sniper_PRO",
    date: "Jan 9",
    title: "EURUSD: H4 Supply Zone Rejection & Bearish Flag Formation",
    asset: "EURUSD",
    type: "Short",
    timeframe: "4H",
    likes: 342,
    comments: 18,
    category: "Forex",
    chartColor: "#f23645",
    tags: ["#Forex", "#PriceAction", "#Bearish"],
    takeaways: [],
    description: "Euro showing clear rejection at 1.0950 supply, forming a potential bear flag pattern.",
    views: "10.5K",
    imageUrl: "https://www.blackwellglobal.com/wp-content/uploads/2019/08/Everything-about-EUR-USD-Blackwell-Global-Professional-Trading-Regulated-Broker-2-1200x420.jpg",
    fullContent: "The Euro is encountering significant resistance at the 1.0950 supply zone. On the 4-hour chart, we can clearly see a rejection wick followed by a bearish engulfing candle. Price is now consolidating in a tight range, forming what appears to be a bearish flag pattern. A break below the 1.0900 support level would confirm the pattern and likely lead to a test of the 1.0850 lows. The RSI is also showing bearish divergence, adding further weight to the short thesis."
  },
  {
    id: 8,
    author: "Index_Master",
    date: "Jan 9",
    title: "S&P 500: Testing Key Support at 4750 - Bounce Incoming?",
    asset: "SPX",
    type: "Long",
    timeframe: "1D",
    likes: 512,
    comments: 44,
    category: "Indices",
    chartColor: "#089981",
    tags: ["#SPX", "#Support", "#Bounce"],
    takeaways: ["Volume profile suggests accumulation at these levels."],
    description: "SPX is testing a critical daily support level. Volume divergence suggests a bounce is likely.",
    views: "14.2K",
    imageUrl: "https://www.financialafrik.com/wp-content/uploads/2025/08/IMG_1310.png",
    fullContent: "The S&P 500 (SPX) is currently testing a crucial support zone around 4750. This level corresponds to the 50-day moving average and previous resistance-turned-support. Despite the recent selling pressure, the volume profile shows signs of accumulation at these levels, with large block trades appearing on the bid side. Momentum indicators are in oversold territory, suggesting that the selling is overextended. We expect a relief bounce targeting 4820 in the coming sessions."
  },
  {
    id: 9,
    author: "Solana_Bull",
    date: "Jan 9",
    title: "SOL: Bullish Pennant Breakout Targeting $160",
    asset: "SOLUSD",
    type: "Long",
    timeframe: "1H",
    likes: 890,
    comments: 112,
    category: "Crypto",
    chartColor: "#8b5cf6",
    tags: ["#Solana", "#Breakout", "#Crypto"],
    takeaways: [],
    description: "Solana is consolidating tight above the 20 EMA, preparing for a high-volume breakout leg.",
    views: "22K",
    imageUrl: "https://i0.wp.com/disruptafrica.com/wp-content/uploads/2025/07/Solana-Price-Prediction-Will-SOL-Hit-500-as-Bullish-Momentum-Returns-to-the-Market-while-JetBolt-Soars-1.png?fit=2560%2C1435&ssl=1",
    fullContent: "Solana (SOL) is forming a classic bullish pennant pattern on the hourly timeframe, consolidating just above the 20-period Exponential Moving Average (EMA). This consolidation follows a strong impulse move, typically indicating a continuation of the trend. We are watching for a high-volume breakout above the $145 resistance level. If confirmed, the measured move target for this pattern is approximately $160. Traders should keep stops tight below the recent swing low at $138."
  },
  {
    id: 10,
    author: "Chip_Trader",
    date: "Jan 9",
    title: "NVDA: Earnings Run-Up - Institutional Accumulation",
    asset: "NVDA",
    type: "Long",
    timeframe: "1D",
    likes: 675,
    comments: 56,
    category: "Stocks",
    chartColor: "#089981",
    tags: ["#NVDA", "#AI", "#Earnings"],
    takeaways: [],
    description: "Order flow analysis shows heavy buying pressure and call option sweeps ahead of the report.",
    views: "19K",
    imageUrl: "https://cdn.wccftech.com/wp-content/uploads/2025/06/NVIDIA-1.jpeg",
    fullContent: "NVIDIA (NVDA) is showing strong signs of institutional accumulation ahead of its upcoming earnings report. Analysis of the options market reveals significant call buying activity (sweeps) for strikes 10-15% out of the money, suggesting that smart money is positioning for a beat and raise. The stock is holding firmly above its 20-day moving average, a bullish sign. We anticipate a run-up into the event as FOMO kicks in for retail traders."
  },
  {
    id: 11,
    author: "Oil_Baron",
    date: "Jan 9",
    title: "WTI Crude: Reclaiming the $75 Pivot Point",
    asset: "CL1!",
    type: "Neutral",
    timeframe: "4H",
    likes: 156,
    comments: 9,
    category: "Futures",
    chartColor: "#f59e0b",
    tags: ["#Oil", "#Energy", "#Pivot"],
    takeaways: [],
    description: "Oil markets are reacting to geopolitical tensions, reclaiming a key structural pivot level.",
    views: "7.8K",
    imageUrl: "https://economymiddleeast.com/wp-content/uploads/2024/05/Oil-prices-3-1200x800.jpeg",
    fullContent: "WTI Crude Oil has managed to reclaim the $75 pivot point amidst rising geopolitical tensions in the Middle East. This level has acted as both support and resistance in recent weeks, making it a critical line in the sand. Price is currently consolidating above this level. A sustained hold above $75 could open the door for a move towards $78 and potentially $80. However, a failure to hold would likely see price retest the range lows at $72."
  },
  {
    id: 12,
    author: "Yen_Wizard",
    date: "Jan 9",
    title: "GBP/JPY: Classic Dragon Pattern on 1H",
    asset: "GBPJPY",
    type: "Long",
    timeframe: "1H",
    likes: 245,
    comments: 21,
    category: "Forex",
    chartColor: "#2962ff",
    tags: ["#GBPJPY", "#Patterns", "#Bullish"],
    takeaways: ["Dragon head confirmed at 188.50."],
    description: "A textbook Dragon pattern is emerging on the GBP/JPY hourly chart. We have seen the formation of the 'Head' at 188.50, followed by the two 'Legs' and the 'Hump'. Price has now broken above the trendline connecting the Head and the Hump, signaling a potential bullish reversal. The target for this pattern corresponds to the tail of the dragon, which sits around 190.00. Stop loss should be placed below the second leg low.",
    views: "8.9K",
    imageUrl: "https://www.ironfx.com/wp-content/uploads/2025/05/GBP-JPY-pair-currency-money-forex.jpg",
    fullContent: "A textbook Dragon pattern is emerging on the GBP/JPY hourly chart. We have seen the formation of the 'Head' at 188.50, followed by the two 'Legs' and the 'Hump'. Price has now broken above the trendline connecting the Head and the Hump, signaling a potential bullish reversal. The target for this pattern corresponds to the tail of the dragon, which sits around 190.00. Stop loss should be placed below the second leg low."
  },
  {
    id: 13,
    author: "Tech_Bear",
    date: "Jan 9",
    title: "Apple: Double Top Formation at All-Time Highs",
    asset: "AAPL",
    type: "Short",
    timeframe: "1D",
    likes: 412,
    comments: 38,
    category: "Stocks",
    chartColor: "#f23645",
    tags: ["#AAPL", "#DoubleTop", "#Reversal"],
    takeaways: [],
    description: "Price action suggests exhaustion at the highs with bearish RSI divergence on the daily.",
    views: "13.5K",
    imageUrl: "https://fortune.com/img-assets/wp-content/uploads/2015/12/gettyimages-477483948.jpg?format=webp&w=1440&q=100",
    fullContent: "Apple (AAPL) is showing signs of exhaustion as it tests all-time highs. The daily chart reveals a potential Double Top formation, a classic bearish reversal pattern. Furthermore, the RSI is printing a lower high while price makes a higher high—a clear bearish divergence signal. Volume on the recent rally has been declining, indicating a lack of conviction from buyers. We are looking for a break below the neckline at $192 to confirm the reversal."
  }
];

// --- User Profile Logic & Components ---

interface UserProfile {
  username: string;
  displayName: string;
  bio: string;
  joinDate: string;
  followers: number;
  following: number;
  ideas: number;
  reputation: number;
  coverUrl: string;
  avatarUrl?: string;
  badges: string[];
}

// Helper to generate a profile based on username
const getProfile = (username: string): UserProfile => {
    // Deterministic pseudo-random based on username length/chars
    const seed = username.length;

    // specific overrides for mock users to look good
    const userImages: Record<string, { avatar: string, cover: string }> = {
        "Liquidity_Hunter_Inst": {
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
            cover: "https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=1000"
        },
        "Cable_Strategist": {
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
            cover: "https://images.unsplash.com/photo-1526304640152-d4619684e484?auto=format&fit=crop&q=80&w=1000"
        },
        "Quant_Eq": {
            avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200",
            cover: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=1000"
        },
        "Futures_Algo_Desk": {
            avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=200",
            cover: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&q=80&w=1000"
        },
        "Gold_Standard": {
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
            cover: "https://images.unsplash.com/photo-1610375461246-83df859cd871?auto=format&fit=crop&q=80&w=1000"
        },
         "Altcoin_Macro": {
            avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200",
            cover: "https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=1000"
        },
        "Solana_Bull": {
             avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
             cover: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&q=80&w=1000"
        }
    };

    const specific = userImages[username];

    return {
        username: username,
        displayName: username.replace(/_/g, ' '),
        bio: `Full-time trader focusing on ${seed % 2 === 0 ? 'Crypto and FX' : 'Equities and Indices'}. Pure price action and SMC concepts. ${seed % 3 === 0 ? 'Macro analyst.' : 'Scalping specialist.'}`,
        joinDate: `Member since 20${20 + (seed % 4)}`,
        followers: 1000 + (seed * 153),
        following: 10 + (seed * 5),
        ideas: 50 + (seed * 2),
        reputation: 500 + (seed * 200),
        coverUrl: specific ? specific.cover : `https://images.unsplash.com/photo-${seed % 2 === 0 ? '1611974765270-ca12586343bb' : '1642543494231-29e20b513038'}?auto=format&fit=crop&q=80&w=1000`,
        avatarUrl: specific ? specific.avatar : `https://ui-avatars.com/api/?name=${username}&background=random&color=fff`,
        badges: seed % 3 === 0 ? ['Pro', 'Top Author'] : ['Pro'],
    };
};

const UserProfileModal = ({ username, onClose }: { username: string, onClose: () => void }) => {
    const profile = getProfile(username);
    const userIdeas = MOCK_IDEAS.filter(i => i.author === username);

    return (
        <div className="fixed inset-0 z-[110] flex justify-center items-start pt-10 pb-10 overflow-y-auto bg-black/90 backdrop-blur-md" onClick={onClose}>
            <div className="bg-[#1e222d] w-full max-w-3xl rounded-xl border border-tv-border shadow-2xl relative animate-in zoom-in-95 duration-200 mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
               {/* Cover Image */}
               <div className="h-32 w-full relative">
                   <img src={profile.coverUrl} className="w-full h-full object-cover opacity-60" alt="Cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#1e222d] to-transparent"></div>
                   <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors z-20"><X size={20} /></button>
               </div>

               {/* Profile Info */}
               <div className="px-8 relative -mt-12 mb-6">
                   <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
                       <div className="flex items-end gap-4">
                           <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-tv-blue to-purple-600 p-1 shadow-xl flex-shrink-0">
                               <div className="w-full h-full rounded-full bg-[#1e222d] flex items-center justify-center text-3xl font-bold text-white overflow-hidden">
                                   {profile.avatarUrl ? <img src={profile.avatarUrl} className="w-full h-full object-cover" alt="Avatar" /> : username.substring(0,2).toUpperCase()}
                               </div>
                           </div>
                           <div className="mb-2">
                               <h2 className="text-2xl font-bold text-white flex items-center gap-2 flex-wrap">
                                   {profile.displayName}
                                   {profile.badges.map(b => (
                                       <span key={b} className="bg-tv-blue text-white text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">{b}</span>
                                   ))}
                               </h2>
                               <p className="text-tv-muted text-sm">@{profile.username}</p>
                           </div>
                       </div>
                       <div className="flex gap-3 mb-2 w-full sm:w-auto">
                           <button className="flex-1 sm:flex-none bg-tv-blue hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-md transition-colors text-sm">Follow</button>
                           <button className="flex-1 sm:flex-none bg-[#2a2e39] hover:bg-[#363a45] text-white font-bold py-2 px-4 rounded-md transition-colors text-sm">Message</button>
                       </div>
                   </div>
               </div>

               {/* Bio & Stats */}
               <div className="px-8 pb-8 border-b border-tv-border">
                   <p className="text-tv-text mb-6 leading-relaxed max-w-2xl">{profile.bio}</p>
                   
                   <div className="flex flex-wrap gap-6 text-sm mb-6">
                       <div className="flex items-center gap-2 text-white"><span className="font-bold text-lg">{profile.followers.toLocaleString()}</span> <span className="text-tv-muted">Followers</span></div>
                       <div className="flex items-center gap-2 text-white"><span className="font-bold text-lg">{profile.following}</span> <span className="text-tv-muted">Following</span></div>
                       <div className="flex items-center gap-2 text-white"><span className="font-bold text-lg">{profile.reputation.toLocaleString()}</span> <span className="text-tv-muted">Reputation</span></div>
                       <div className="flex items-center gap-2 text-white"><span className="font-bold text-lg">{userIdeas.length}</span> <span className="text-tv-muted">Ideas</span></div>
                   </div>

                   <div className="flex flex-wrap gap-4 text-xs text-tv-muted">
                        <span className="flex items-center gap-1"><CalendarIcon size={12} /> {profile.joinDate}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> Global</span>
                   </div>
               </div>

               {/* User's Ideas List */}
               <div className="p-8 bg-[#131722]">
                   <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><StarIcon size={18} className="text-tv-blue" /> Latest Ideas</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {userIdeas.map(idea => (
                           <div key={idea.id} className="bg-[#1e222d] border border-tv-border rounded-lg overflow-hidden group hover:border-tv-blue/30 transition-all cursor-pointer">
                               <div className="h-32 overflow-hidden relative">
                                    <img src={idea.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={idea.title} />
                                    <span className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${idea.type === 'Long' ? 'bg-tv-green text-white' : idea.type === 'Short' ? 'bg-tv-red text-white' : 'bg-gray-500 text-white'}`}>{idea.type}</span>
                               </div>
                               <div className="p-4">
                                   <div className="text-xs text-tv-muted mb-1">{idea.asset} • {idea.timeframe}</div>
                                   <h4 className="text-sm font-bold text-white mb-2 line-clamp-1">{idea.title}</h4>
                                   <div className="flex items-center gap-4 text-xs text-tv-muted">
                                       <span className="flex items-center gap-1"><ThumbsUp size={12} /> {idea.likes}</span>
                                       <span className="flex items-center gap-1"><MessageSquare size={12} /> {idea.comments}</span>
                                   </div>
                               </div>
                           </div>
                       ))}
                       {userIdeas.length === 0 && <div className="text-tv-muted italic col-span-2 text-center py-8">No ideas published yet.</div>}
                   </div>
               </div>
            </div>
        </div>
    );
};

// --- End User Profile Components ---


const SentimentPoll: React.FC = () => {
  return (
    <div className="bg-[#1e222d] border border-tv-border rounded-lg p-4 mb-6">
      <h3 className="text-white font-bold mb-3 flex items-center gap-2">
        <Activity size={18} className="text-tv-blue" />
        Market Sentiment
      </h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs text-tv-muted mb-1">
            <span>Bullish</span>
            <span>65%</span>
          </div>
          <div className="h-2 bg-[#2a2e39] rounded-full overflow-hidden flex">
            <div className="h-full bg-tv-green w-[65%]"></div>
            <div className="h-full bg-tv-red flex-1"></div>
          </div>
        </div>
        <div className="flex justify-between gap-2">
           <button className="flex-1 bg-tv-green/10 text-tv-green hover:bg-tv-green/20 py-2 rounded text-sm font-bold transition-colors">Bullish</button>
           <button className="flex-1 bg-tv-red/10 text-tv-red hover:bg-tv-red/20 py-2 rounded text-sm font-bold transition-colors">Bearish</button>
        </div>
      </div>
    </div>
  );
};

const CommunityView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedIdea, setSelectedIdea] = useState<TradeIdea | null>(null);
  const [viewingProfile, setViewingProfile] = useState<string | null>(null);
  
  const categories = ['All', 'Crypto', 'Forex', 'Stocks', 'Indices', 'Futures'];

  const filteredIdeas = activeCategory === 'All' 
    ? MOCK_IDEAS 
    : MOCK_IDEAS.filter(idea => idea.category === activeCategory);

  const handleAuthorClick = (e: React.MouseEvent, username: string) => {
      e.stopPropagation();
      setViewingProfile(username);
  };

  return (
    <div className="py-8 animate-in fade-in duration-300 max-w-[1600px] mx-auto px-4">
      
      {/* User Profile Modal */}
      {viewingProfile && (
          <UserProfileModal username={viewingProfile} onClose={() => setViewingProfile(null)} />
      )}

      {/* Article Detail Modal */}
      {selectedIdea && (
         <div className="fixed inset-0 z-[100] flex justify-center items-start pt-4 sm:pt-10 pb-10 overflow-y-auto bg-black/80 backdrop-blur-sm" onClick={() => setSelectedIdea(null)}>
            <div className="bg-[#1e222d] w-full max-w-4xl rounded-xl border border-tv-border shadow-2xl relative animate-in zoom-in-95 duration-200 mx-4" onClick={e => e.stopPropagation()}>
                <button 
                    onClick={() => setSelectedIdea(null)}
                    className="absolute top-4 right-4 p-2 bg-[#2a2e39] hover:bg-[#363a45] rounded-full text-white transition-colors z-10"
                >
                    <X size={20} />
                </button>
                
                <div className="p-0">
                    <div className="relative h-64 sm:h-80 w-full">
                        <img src={selectedIdea.imageUrl} alt={selectedIdea.title} className="w-full h-full object-cover rounded-t-xl" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1e222d] to-transparent"></div>
                        <div className="absolute bottom-6 left-8 right-8">
                             <h1 className="text-3xl font-bold text-white mb-2 leading-tight drop-shadow-lg">{selectedIdea.title}</h1>
                             <div className="flex items-center gap-3 text-sm text-tv-muted">
                                <div 
                                    className="flex items-center gap-2 bg-[#131722]/80 backdrop-blur px-2 py-1 rounded-full cursor-pointer hover:bg-white/10 transition-colors"
                                    onClick={(e) => handleAuthorClick(e, selectedIdea.author)}
                                >
                                    <User size={14} /> <span className="text-white font-semibold">{selectedIdea.author}</span>
                                </div>
                                <span className="flex items-center gap-1 bg-[#131722]/80 backdrop-blur px-2 py-1 rounded-full"><Clock size={14} /> {selectedIdea.date}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase backdrop-blur ${
                                                selectedIdea.type === 'Long' ? 'bg-tv-green/20 text-tv-green' : 
                                                selectedIdea.type === 'Short' ? 'bg-tv-red/20 text-tv-red' : 
                                                'bg-tv-muted/20 text-tv-muted'
                                            }`}>
                                    {selectedIdea.type}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {selectedIdea.takeaways && selectedIdea.takeaways.length > 0 && (
                            <div className="bg-[#2a2e39]/50 p-6 rounded-lg mb-8 border-l-4 border-tv-blue">
                                <h3 className="text-white font-bold mb-3 uppercase text-xs tracking-wider">Key Takeaways</h3>
                                <ul className="space-y-2">
                                    {selectedIdea.takeaways.map((t, i) => (
                                        <li key={i} className="flex gap-2 text-tv-text text-sm">
                                            <span className="text-tv-blue">•</span> {t}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="prose prose-invert max-w-none text-tv-text mb-8 text-lg leading-relaxed">
                            {selectedIdea.fullContent.split('\n\n').map((para, i) => (
                                <p key={i} className="mb-4">{para}</p>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-8 border-t border-tv-border pt-6">
                            {selectedIdea.tags.map(tag => (
                                <span key={tag} className="text-sm text-tv-blue bg-tv-blue/10 px-3 py-1 rounded-full hover:bg-tv-blue/20 cursor-pointer">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-tv-border">
                            <div className="flex gap-6">
                                <button className="flex items-center gap-2 text-tv-muted hover:text-white transition-colors">
                                    <ThumbsUp size={20} /> <span className="font-bold">{selectedIdea.likes}</span>
                                </button>
                                <button className="flex items-center gap-2 text-tv-muted hover:text-white transition-colors">
                                    <MessageSquare size={20} /> <span className="font-bold">{selectedIdea.comments}</span>
                                </button>
                            </div>
                            <button className="flex items-center gap-2 text-tv-muted hover:text-white transition-colors">
                                <Share2 size={20} /> Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      )}

      <div className="flex flex-col xl:flex-row gap-10">
        
        {/* Main Feed */}
        <div className="flex-1">
            {/* Row 1: Title */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white tracking-tight">Community Ideas</h1>
            </div>
            
            {/* Row 2: Categories */}
            <div className="mb-10">
                 <div className="inline-flex items-center gap-2 bg-[#1e222d] p-1.5 rounded-xl border border-tv-border overflow-x-auto max-w-full no-scrollbar shadow-sm">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2.5 text-sm font-bold rounded-lg whitespace-nowrap transition-all duration-200 ${
                                activeCategory === cat 
                                ? 'bg-[#2a2e39] text-white shadow-md transform scale-105' 
                                : 'text-tv-muted hover:text-white hover:bg-[#2a2e39]/50'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredIdeas.map(idea => {
                    const profile = getProfile(idea.author);
                    return (
                        <div 
                            key={idea.id} 
                            onClick={() => setSelectedIdea(idea)}
                            className="bg-[#1e222d] border border-tv-border rounded-2xl overflow-hidden hover:border-tv-blue/30 transition-all duration-300 group flex flex-col cursor-pointer hover:-translate-y-1 hover:shadow-2xl h-full"
                        >
                            <div className="p-5 flex items-center justify-between border-b border-[#2a2e39]">
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="w-10 h-10 rounded-full bg-gradient-to-tr from-tv-blue to-purple-500 p-0.5 shadow-lg cursor-pointer hover:scale-110 transition-transform overflow-hidden"
                                        onClick={(e) => handleAuthorClick(e, idea.author)}
                                    >
                                        <img src={profile.avatarUrl} alt={profile.displayName} className="w-full h-full object-cover rounded-full" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span 
                                                className="text-sm font-bold text-white hover:underline cursor-pointer truncate max-w-[100px]"
                                                onClick={(e) => handleAuthorClick(e, idea.author)}
                                            >
                                                {idea.author}
                                            </span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                                                idea.type === 'Long' ? 'bg-tv-green/10 text-tv-green' : 
                                                idea.type === 'Short' ? 'bg-tv-red/10 text-tv-red' : 
                                                'bg-tv-muted/10 text-tv-muted'
                                            }`}>
                                                {idea.type}
                                            </span>
                                        </div>
                                        <div className="text-xs text-tv-muted font-medium">{idea.asset} • {idea.timeframe}</div>
                                    </div>
                                </div>
                                <button className="text-tv-muted hover:text-white p-2 rounded-full hover:bg-[#2a2e39] transition-colors"><MoreHorizontal size={18} /></button>
                            </div>
                            
                            <div className="p-5 flex-1 flex flex-col">
                                <h2 className="text-lg font-bold text-white mb-3 group-hover:text-tv-blue transition-colors cursor-pointer line-clamp-2 leading-snug">{idea.title}</h2>
                                <p className="text-tv-muted text-sm line-clamp-2 mb-4 leading-relaxed">{idea.description}</p>
                                
                                <div className="relative aspect-video bg-black rounded-xl overflow-hidden mb-4 border border-[#2a2e39] mt-auto">
                                    <img src={idea.imageUrl} alt={idea.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {idea.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-[10px] font-medium text-tv-blue bg-tv-blue/5 px-2.5 py-1 rounded-md hover:bg-tv-blue/10 cursor-pointer border border-tv-blue/10">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-[#2a2e39] mt-2">
                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-1.5 text-tv-muted hover:text-tv-blue transition-colors text-xs font-medium group/btn">
                                            <ThumbsUp size={16} className="group-hover/btn:scale-110 transition-transform" /> <span>{idea.likes}</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 text-tv-muted hover:text-tv-blue transition-colors text-xs font-medium group/btn">
                                            <MessageSquare size={16} className="group-hover/btn:scale-110 transition-transform" /> <span>{idea.comments}</span>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-tv-muted text-[10px] font-medium bg-[#2a2e39] px-2 py-1 rounded">
                                        <Eye size={12} /> <span>{idea.views}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Sidebar */}
        <div className="w-full xl:w-96 space-y-8 flex-shrink-0">
            <SentimentPoll />
            
            <div className="bg-[#1e222d] border border-tv-border rounded-xl p-6 shadow-sm">
                <h3 className="text-white font-bold mb-5 flex items-center gap-2 text-lg">
                    <TrendingUp size={20} className="text-tv-blue" />
                    Trending Assets
                </h3>
                <div className="space-y-4">
                    {[
                        { s: 'BTCUSD', n: 'Bitcoin', c: '+2.4%' },
                        { s: 'NVDA', n: 'NVIDIA', c: '+1.8%' },
                        { s: 'XAUUSD', n: 'Gold', c: '-0.2%' },
                        { s: 'EURUSD', n: 'Euro', c: '+0.1%' },
                        { s: 'TSLA', n: 'Tesla', c: '-1.5%' },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between group cursor-pointer p-2 hover:bg-[#2a2e39] rounded-lg transition-colors">
                            <div className="flex items-center gap-3">
                                <span className="text-tv-muted text-xs font-mono w-4 font-bold">{i+1}</span>
                                <div>
                                    <div className="text-sm font-bold text-white group-hover:text-tv-blue transition-colors">{item.s}</div>
                                    <div className="text-xs text-tv-muted">{item.n}</div>
                                </div>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${item.c.startsWith('+') ? 'text-tv-green bg-tv-green/10' : 'text-tv-red bg-tv-red/10'}`}>{item.c}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-tv-blue/20 to-purple-500/20 border border-tv-blue/30 text-center shadow-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-tv-blue/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <h3 className="text-white font-bold mb-2 text-lg relative z-10">Share your analysis</h3>
                <p className="text-tv-muted text-sm mb-6 relative z-10">Join 50M+ traders and investors sharing ideas.</p>
                <button className="w-full bg-tv-blue hover:bg-blue-600 text-white font-bold py-3 rounded-lg text-sm transition-all shadow-lg hover:shadow-tv-blue/25 relative z-10 transform active:scale-[0.98]">
                    Publish Idea
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default CommunityView;
