
import { DaySection } from './types';

export const CATEGORIES = ['Economic', 'Earnings', 'Revenue', 'Dividends'] as const;

export const MOCK_DATA: DaySection[] = [
  {
    date: 'Monday, December 8',
    events: [
       // Economic (Added)
       { id: 'econ-dec8-1', time: '08:00', country: 'Germany', countryCode: 'DE', title: 'Industrial Production MoM', volatility: 2, category: 'Economic', actual: '-0.4%', forecast: '-0.2%', prior: '-1.3%' },
       // Earnings
       {
        id: 'earn-dec8-1',
        time: '07:00',
        country: 'Germany',
        countryCode: 'DE',
        title: 'Stabilus SE',
        ticker: '0QUL',
        volatility: 1,
        category: 'Earnings',
        actual: '-0.54 USD',
        forecast: '12.45 USD',
        surprise: '+5.23%',
        marketCap: '587.50 M USD',
        period: 'pre',
        logo: 'S'
       },
       // Revenue (Added)
       {
        id: 'rev-dec8-1',
        time: '16:05',
        country: 'USA',
        countryCode: 'US',
        title: 'Casey\'s General Stores',
        ticker: 'CASY',
        volatility: 2,
        category: 'Revenue',
        actual: '3.33 B USD',
        forecast: '3.29 B USD',
        surprise: '+1.21%',
        marketCap: '14.2 B USD',
        period: 'post',
        logo: 'C'
       }
    ]
  },
  {
      date: 'Tuesday, December 9',
      events: [
          // Economic
          { id: 'dec9-1', time: '04:35', country: 'Japan', countryCode: 'JP', title: '5-Year JGB Auction', volatility: 1, category: 'Economic', actual: '1.435%', forecast: '0.95%', prior: '1.245%' },
          { id: 'dec9-2', time: '04:35', country: 'Japan', countryCode: 'JP', title: '6-Month Bill Auction', volatility: 1, category: 'Economic', actual: '0.6942%', forecast: '0.65%', prior: '0.5893%' },
          { id: 'dec9-3', time: '19:00', country: 'USA', countryCode: 'US', title: '10-Year Note Auction', volatility: 1, category: 'Economic', actual: '4.175%', forecast: '0.99%', prior: '4.074%' },
          // Earnings
          { 
            id: 'earn-dec9-1', time: '00:51', country: 'Canada', countryCode: 'CA', title: 'Troilus Mining Corp', ticker: 'A41VGG', 
            volatility: 1, category: 'Earnings', actual: '-0.03 USD', 
            forecast: '4.20 USD', 
            surprise: '-2.15%', 
            marketCap: '681.89 M USD', period: 'pre', logo: 'T'
          },
          { 
            id: 'earn-dec9-2', time: '06:55', country: 'USA', countryCode: 'US', title: 'AutoZone, Inc.', ticker: 'AZO', 
            volatility: 3, category: 'Earnings', actual: '32.55 USD', forecast: '31.60 USD', surprise: '+3.01%', marketCap: '54.1 B USD', period: 'pre', logo: 'A'
          },
          // Revenue (Added)
          { 
            id: 'rev-dec9-1', time: '06:55', country: 'USA', countryCode: 'US', title: 'AutoZone, Inc.', ticker: 'AZO', 
            volatility: 3, category: 'Revenue', actual: '4.19 B USD', forecast: '4.18 B USD', surprise: '+0.24%', marketCap: '54.1 B USD', period: 'pre', logo: 'A'
          },
          // Dividends (Added)
          {
            id: 'div-dec9-1', time: '08:00', country: 'USA', countryCode: 'US', title: 'Best Buy Co., Inc.', ticker: 'BBY',
            volatility: 1, category: 'Dividends', dividendAmount: '0.94 USD', exDividendDate: 'Dec 9, 2025', paymentDate: 'Jan 2, 2026', dividendYield: '4.32%', logo: 'B'
          }
      ]
  },
  {
      date: 'Wednesday, December 10',
      events: [
          // Economic
          { id: 'dec10-1', time: '11:00', country: 'United Kingdom', countryCode: 'GB', title: 'Treasury Gilt 2035 Auction', volatility: 1, category: 'Economic', actual: '4.613%', forecast: '0.88%', prior: '4.608%' },
          { id: 'dec10-2', time: '11:10', country: 'Italy', countryCode: 'IT', title: '12-Month BOT Auction', volatility: 1, category: 'Economic', actual: '2.181%', forecast: '0.75%', prior: '2.063%' },
          { id: 'dec10-3', time: '17:30', country: 'USA', countryCode: 'US', title: '17-Week Bill Auction', volatility: 1, category: 'Economic', actual: '3.61%', forecast: '0.92%', prior: '3.62%' },
          // Earnings (Added)
          { 
            id: 'earn-dec10-1', time: '16:05', country: 'USA', countryCode: 'US', title: 'Adobe Inc.', ticker: 'ADBE', 
            volatility: 3, category: 'Earnings', actual: '4.27 USD', forecast: '4.14 USD', surprise: '+3.14%', marketCap: '235.4 B USD', period: 'post', logo: 'A'
          },
          // Revenue (Added)
          { 
            id: 'rev-dec10-1', time: '16:05', country: 'USA', countryCode: 'US', title: 'Adobe Inc.', ticker: 'ADBE', 
            volatility: 3, category: 'Revenue', actual: '5.05 B USD', forecast: '5.01 B USD', surprise: '+0.80%', marketCap: '235.4 B USD', period: 'post', logo: 'A'
          }
      ]
  },
  {
      date: 'Monday, December 15',
      events: [
          // Economic
          { id: 'dec15-1', time: '03:30', country: 'South Korea', countryCode: 'KR', title: '10-Year KTB Auction', volatility: 1, category: 'Economic', actual: '3.41%', forecast: '0.82%', prior: '3.285%' },
          { id: 'dec15-2', time: '15:00', country: 'France', countryCode: 'FR', title: '12-Month BTF Auction', volatility: 1, category: 'Economic', actual: '2.146%', forecast: '0.45%', prior: '2.148%' },
          { id: 'dec15-3', time: '15:00', country: 'France', countryCode: 'FR', title: '3-Month BTF Auction', volatility: 1, category: 'Economic', actual: '2.079%', forecast: '0.35%', prior: '2.088%' },
          { id: 'dec15-4', time: '15:00', country: 'France', countryCode: 'FR', title: '6-Month BTF Auction', volatility: 1, category: 'Economic', actual: '2.117%', forecast: '0.55%', prior: '2.103%' },
          { id: 'dec15-5', time: '17:30', country: 'USA', countryCode: 'US', title: '3-Month Bill Auction', volatility: 1, category: 'Economic', actual: '3.56%', forecast: '0.85%', prior: '3.65%' },
          { id: 'dec15-6', time: '17:30', country: 'USA', countryCode: 'US', title: '6-Month Bill Auction', volatility: 1, category: 'Economic', actual: '3.495%', forecast: '0.94%', prior: '3.58%' },
          // Earnings
          { 
            id: 'earn-dec15-1', time: '05:00', country: 'Japan', countryCode: 'JP', title: 'JAIC Co., Ltd.', ticker: '7073', volatility: 1, category: 'Earnings', actual: '0.45 USD', 
            forecast: '15.50 USD', 
            surprise: '+3.45%', 
            marketCap: '15.50 M USD', period: 'post', logo: 'JA' 
          },
          { 
            id: 'earn-dec15-2', time: '07:00', country: 'Japan', countryCode: 'JP', title: 'Berg Earth Co., Ltd.', ticker: '1383', volatility: 1, category: 'Earnings', actual: '0.48 USD', 
            forecast: '18.25 USD', 
            surprise: '+7.12%', 
            marketCap: '33.05 M USD', period: 'post', logo: 'B' 
          },
          // Revenue (Added)
          { id: 'rev-dec15-1', time: '05:00', country: 'Japan', countryCode: 'JP', title: 'JAIC Co., Ltd.', ticker: '7073', volatility: 1, category: 'Revenue', actual: '12.5 M USD', forecast: '13.25 USD', surprise: '+4.12%', marketCap: '15.50 M USD', period: 'post', logo: 'JA' }
      ]
  },
  {
      date: 'Wednesday, December 17',
      events: [
          // Economic
          { id: 'dec17-1', time: '04:35', country: 'Japan', countryCode: 'JP', title: '52-Week Bill Auction', volatility: 1, category: 'Economic', actual: '0.8627%', forecast: '0.62%', prior: '0.7475%' },
          { id: 'dec17-2', time: '17:30', country: 'USA', countryCode: 'US', title: '17-Week Bill Auction', volatility: 1, category: 'Economic', actual: '3.54%', forecast: '0.91%', prior: '3.61%' },
          { id: 'dec17-3', time: '18:00', country: 'Canada', countryCode: 'CA', title: '5-Year Bond Auction', volatility: 1, category: 'Economic', actual: '3.038%', forecast: '0.89%', prior: '2.868%' },
          { id: 'dec17-4', time: '19:00', country: 'USA', countryCode: 'US', title: '20-Year Bond Auction', volatility: 1, category: 'Economic', actual: '4.798%', forecast: '0.98%', prior: '4.706%' },
          // Earnings (Added)
          { id: 'earn-dec17-1', time: '06:50', country: 'USA', countryCode: 'US', title: 'General Mills, Inc.', ticker: 'GIS', volatility: 2, category: 'Earnings', actual: '1.25 USD', forecast: '1.16 USD', surprise: '+7.75%', marketCap: '37.8 B USD', period: 'pre', logo: 'G' },
          // Revenue (Added)
          { id: 'rev-dec17-1', time: '06:50', country: 'USA', countryCode: 'US', title: 'General Mills, Inc.', ticker: 'GIS', volatility: 2, category: 'Revenue', actual: '5.14 B USD', forecast: '5.10 B USD', surprise: '+0.78%', marketCap: '37.8 B USD', period: 'pre', logo: 'G' },
          // Dividends (Added)
          { id: 'div-dec17-1', time: '07:30', country: 'USA', countryCode: 'US', title: 'The Coca-Cola Company', ticker: 'KO', volatility: 1, category: 'Dividends', dividendAmount: '0.46 USD', exDividendDate: 'Dec 17, 2025', paymentDate: 'Jan 15, 2026', dividendYield: '3.12%', logo: 'KO' }
      ]
  },
  {
      date: 'Monday, December 22',
      events: [
          // Dividends
          { id: 'div-dec22-1', time: '08:30', country: 'Canada', countryCode: 'CA', title: 'Sun Life Crescent Specialty Credit Private Pool Trust Unit', ticker: 'SLSC', volatility: 1, category: 'Dividends', dividendAmount: '0.08 USD', exDividendDate: 'Dec 22, 2025', paymentDate: 'Dec 31, 2025', dividendYield: '6.51%', logo: 'S' },
          { id: 'div-dec22-3', time: '16:15', country: 'USA', countryCode: 'US', title: 'Fundstrat Granny Shots US Large Cap & Income ETF', ticker: 'GRNI', volatility: 1, category: 'Dividends', dividendAmount: '0.17 USD', exDividendDate: 'Dec 22, 2025', paymentDate: 'Dec 23, 2025', dividendYield: '4.87%', logo: 'G' },
          { id: 'div-dec22-5', time: '09:00', country: 'USA', countryCode: 'US', title: 'Alliance Global Group, Inc.', ticker: 'ALGGY', volatility: 1, category: 'Dividends', dividendAmount: '0.05 USD', exDividendDate: 'Dec 22, 2025', paymentDate: 'Feb 2, 2026', dividendYield: '0.69%', logo: 'A' },
          // Economic (Added)
          { id: 'dec22-1', time: '08:30', country: 'USA', countryCode: 'US', title: 'Chicago Fed National Activity Index', volatility: 2, category: 'Economic', actual: '0.03', forecast: '0.00', prior: '-0.49' },
          // Earnings (Added)
          { id: 'earn-dec22-1', time: '16:00', country: 'USA', countryCode: 'US', title: 'Heico Corp.', ticker: 'HEI', volatility: 2, category: 'Earnings', actual: '0.82 USD', forecast: '0.78 USD', surprise: '+5.12%', marketCap: '24.1 B USD', period: 'post', logo: 'H' }
      ]
  },
  {
      date: 'Monday, December 29',
      events: [
          // Dividends
          { id: 'div-dec29-1', time: '07:00', country: 'USA', countryCode: 'US', title: 'Eventide International ETF', ticker: 'ESIM', volatility: 1, category: 'Dividends', dividendAmount: '0.01 USD', exDividendDate: 'Dec 29, 2025', paymentDate: 'Dec 30, 2025', dividendYield: '0.11%', logo: 'E' },
          { id: 'div-dec29-2', time: '16:30', country: 'USA', countryCode: 'US', title: 'VistaShares Target 15 S&P 100 Distribution ETF', ticker: 'SIOO', volatility: 1, category: 'Dividends', dividendAmount: '0.25 USD', exDividendDate: 'Dec 29, 2025', paymentDate: 'Dec 30, 2025', dividendYield: '15.29%', logo: 'S' },
          { id: 'div-dec29-3', time: '02:30', country: 'South Korea', countryCode: 'KR', title: 'Hana 1Q Hyundai Motor Company Group Bond(A+)KTB/MSB ETF Units', ticker: '492500', volatility: 1, category: 'Dividends', dividendAmount: '0.52 USD', exDividendDate: 'Dec 29, 2025', paymentDate: 'Jan 2, 2026', dividendYield: '1.48%', logo: '1Q' },
          // Economic (Added)
          { id: 'dec29-1', time: '10:00', country: 'USA', countryCode: 'US', title: 'Pending Home Sales MoM', volatility: 3, category: 'Economic', actual: '0.0%', forecast: '-0.95%', prior: '-1.5%' },
          { id: 'dec29-2', time: '10:30', country: 'USA', countryCode: 'US', title: 'Dallas Fed Mfg Business Index', volatility: 1, category: 'Economic', actual: '-10.5', forecast: '-0.85', prior: '-19.9' }
      ]
  },
  {
    date: 'Monday, January 5',
    events: [
      // Earnings
      { id: 'earn-jan5-1', time: '04:26', country: 'India', countryCode: 'IN', title: 'Metropolis Healthcare Ltd.', ticker: 'METROPOLIS', volatility: 2, category: 'Earnings', actual: '0.10 USD', forecast: '0.10 USD', surprise: '+4.33%', marketCap: '1.16 B USD', period: 'pre', logo: 'M' },
      { 
        id: 'earn-jan5-3', time: '07:30', country: 'Japan', countryCode: 'JP', title: 'Karula Co., Ltd.', ticker: '2789', volatility: 1, category: 'Earnings', actual: '0.02 USD', 
        forecast: '11.15 USD', 
        surprise: '-4.30%', 
        marketCap: '18.74 M USD', period: 'post', logo: 'K' 
      },
      // Revenue
      { id: 'rev-jan5-1', time: '04:26', country: 'India', countryCode: 'IN', title: 'Metropolis Healthcare Ltd.', ticker: 'METROPOLIS', volatility: 2, category: 'Revenue', actual: '45.19 M USD', forecast: '44.18 M USD', surprise: '+2.27%', marketCap: '1.16 B USD', period: 'pre', logo: 'M' },
      { id: 'rev-jan5-3', time: '07:30', country: 'Japan', countryCode: 'JP', title: 'Nextage Co., Ltd.', ticker: '3186', volatility: 2, category: 'Revenue', actual: '1.12 B USD', forecast: '1.07 B USD', surprise: '+5.31%', marketCap: '1.58 B USD', period: 'post', logo: 'N' },
      // Dividends
      { id: 'div-jan5-1', time: '16:05', country: 'USA', countryCode: 'US', title: 'Westwood Salient Enhanced Midstream Income ETF', ticker: 'MDST', volatility: 1, category: 'Dividends', dividendAmount: '0.22 USD', exDividendDate: 'Jan 5, 2026', paymentDate: 'Jan 9, 2026', dividendYield: '10.29%', logo: 'W' },
      { id: 'div-jan5-2', time: '17:00', country: 'USA', countryCode: 'US', title: 'Werner Enterprises, Inc.', ticker: 'WERN', volatility: 1, category: 'Dividends', dividendAmount: '0.14 USD', exDividendDate: 'Jan 5, 2026', paymentDate: 'Jan 21, 2026', dividendYield: '1.74%', logo: 'W' },
      // Economic
      { id: 'd1-1', time: '03:30', country: 'South Korea', countryCode: 'KR', title: '2-Year KTB Auction', volatility: 1, category: 'Economic', actual: '2.876%', forecast: '0.85%', prior: '2.66%' },
      { id: 'd1-2', time: '11:30', country: 'Germany', countryCode: 'DE', title: '3-Month Bubill Auction', volatility: 1, category: 'Economic', actual: '4.5%', forecast: '0.95%', prior: '1.9171%' },
    ]
  },
  {
    date: 'Tuesday, January 6',
    events: [
      // Economic
      { id: 'd2-1', time: '03:30', country: 'South Korea', countryCode: 'KR', title: '30-Year KTB Auction', volatility: 1, category: 'Economic', actual: '3.225%', forecast: '0.72%', prior: '3.06%' },
      { id: 'd2-2', time: '04:35', country: 'Japan', countryCode: 'JP', title: '10-Year JGB Auction', volatility: 1, category: 'Economic', actual: '1.872%', forecast: '0.68%', prior: '1.658%' },
      // Earnings
      { id: 'earn-jan6-1', time: '12:00', country: 'USA', countryCode: 'US', title: 'AngioDynamics, Inc.', ticker: 'ANGO', volatility: 2, category: 'Earnings', actual: '0.00 USD', forecast: '-0.10 USD', surprise: '+100.00%', marketCap: '471.33 M USD', period: 'pre', logo: 'A' },
      { id: 'earn-jan6-6', time: '22:05', country: 'USA', countryCode: 'US', title: 'AAR CORP.', ticker: 'AIR', volatility: 2, category: 'Earnings', actual: '1.18 USD', forecast: '1.03 USD', surprise: '+14.19%', marketCap: '3.54 B USD', period: 'post', logo: 'A' },
      // Revenue
      { id: 'rev-jan6-1', time: '07:00', country: 'Japan', countryCode: 'JP', title: 'Hiday Hidaka Corp.', ticker: '7611', volatility: 1, category: 'Revenue', actual: '98.73 M USD', forecast: '95.06 M USD', surprise: '+3.87%', marketCap: '811.87 M USD', period: 'post', logo: 'H' },
      { id: 'rev-jan6-3', time: '07:30', country: 'Japan', countryCode: 'JP', title: 'Takashimaya Company, Limited', ticker: '8233', volatility: 2, category: 'Revenue', actual: '758.49 M USD', forecast: '770.07 M USD', surprise: '-1.50%', marketCap: '3.30 B USD', period: 'post', logo: 'T' },
      // Dividends
      { id: 'div-jan6-1', time: '06:45', country: 'Canada', countryCode: 'CA', title: 'National Bank of Canada Non-Cum Conv Red Perp Pfd', ticker: 'NA.PR.G', volatility: 1, category: 'Dividends', dividendAmount: '0.32 USD', exDividendDate: 'Jan 6, 2026', paymentDate: 'Feb 15, 2026', dividendYield: '2.84%', logo: 'NBC' },
      { id: 'div-jan6-4', time: '16:10', country: 'USA', countryCode: 'US', title: 'Agilent Technologies, Inc.', ticker: 'A', volatility: 1, category: 'Dividends', dividendAmount: '0.25 USD', exDividendDate: 'Jan 6, 2026', paymentDate: 'Jan 28, 2026', dividendYield: '0.71%', logo: 'A' },
    ]
  },
  {
      date: 'Wednesday, January 7',
      events: [
          // Earnings
          { id: 'earn-jan7-1', time: '07:30', country: 'Japan', countryCode: 'JP', title: 'ABC-MART, INC.', ticker: '2670', volatility: 2, category: 'Earnings', actual: '0.24 USD', forecast: '0.27 USD', surprise: '-10.31%', marketCap: '4.18 B USD', period: 'post', logo: 'ABC' },
          { id: 'earn-jan7-9', time: '12:00', country: 'USA', countryCode: 'US', title: 'Cal-Maine Foods, Inc.', ticker: 'CALM', volatility: 2, category: 'Earnings', actual: '2.13 USD', forecast: '1.95 USD', surprise: '+9.12%', marketCap: '3.84 B USD', period: 'pre', logo: 'CM' },
          // Revenue
          { id: 'rev-jan7-1', time: '07:00', country: 'Japan', countryCode: 'JP', title: 'SAN-A CO., LTD.', ticker: '2659', volatility: 1, category: 'Revenue', actual: '385.75 M USD', forecast: '376.85 M USD', surprise: '+2.36%', marketCap: '1.18 B USD', period: 'post', logo: 'S' },
          { id: 'rev-jan7-2', time: '07:30', country: 'Japan', countryCode: 'JP', title: 'ABC-MART, INC.', ticker: '2670', volatility: 2, category: 'Revenue', actual: '570.85 M USD', forecast: '583.29 M USD', surprise: '-2.13%', marketCap: '4.18 B USD', period: 'post', logo: 'A' },
          // Dividends (Added)
          { id: 'div-jan7-1', time: '16:05', country: 'USA', countryCode: 'US', title: 'Cisco Systems, Inc.', ticker: 'CSCO', volatility: 1, category: 'Dividends', dividendAmount: '0.40 USD', exDividendDate: 'Jan 7, 2026', paymentDate: 'Jan 28, 2026', dividendYield: '2.85%', logo: 'C' },
          // Economic (Added)
          { id: 'econ-jan7-1', time: '07:00', country: 'USA', countryCode: 'US', title: 'MBA Mortgage Applications', volatility: 2, category: 'Economic', actual: '4.2%', forecast: '0.5%', prior: '-2.1%' },
          { id: 'econ-jan7-2', time: '10:30', country: 'USA', countryCode: 'US', title: 'EIA Crude Oil Inventories', volatility: 3, category: 'Economic', actual: '-2.5M', forecast: '-0.45M', prior: '1.2M' }
      ]
  },
  {
      date: 'Monday, January 12',
      events: [
          // Dividends
          { id: 'div-jan12-1', time: '03:15', country: 'Indonesia', countryCode: 'ID', title: 'PT ALAMTRI RES INDONESIA TBK', ticker: 'ADOOY', volatility: 2, category: 'Dividends', dividendAmount: '0.27 USD', exDividendDate: 'Jan 12, 2026', paymentDate: 'Jan 30, 2026', dividendYield: '71.15%', logo: 'A' },
          { id: 'div-jan12-2', time: '09:30', country: 'USA', countryCode: 'US', title: 'Allspring Multi-Sector Income Fund', ticker: 'ERC', volatility: 1, category: 'Dividends', dividendAmount: '0.07 USD', exDividendDate: 'Jan 12, 2026', paymentDate: 'Feb 2, 2026', dividendYield: '9.26%', logo: 'AS' },
          { id: 'div-jan12-6', time: '10:00', country: 'Brazil', countryCode: 'BR', title: 'Sendas Distribuidora S.A.', ticker: 'ASAIY', volatility: 1, category: 'Dividends', dividendAmount: '0.06 USD', exDividendDate: 'Jan 12, 2026', paymentDate: 'Jul 6, 2026', dividendYield: '0.84%', logo: 'S' },
          // Earnings (Added)
          { id: 'earn-jan12-1', time: '16:15', country: 'USA', countryCode: 'US', title: 'KB Home', ticker: 'KBH', volatility: 2, category: 'Earnings', actual: '1.85 USD', forecast: '1.70 USD', surprise: '+8.82%', marketCap: '5.2 B USD', period: 'post', logo: 'K' },
          // Economic (Added)
          { id: 'econ-jan12-1', time: '11:00', country: 'USA', countryCode: 'US', title: 'Consumer Inflation Expectations', volatility: 2, category: 'Economic', actual: '3.0%', forecast: '0.98%', prior: '3.4%' }
      ]
  }
];
