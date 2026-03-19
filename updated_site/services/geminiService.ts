

import { GoogleGenAI } from "@google/genai";
import { EconomicEvent } from "../types";

// IMPORTANT:
// In the browser build (Vite), `process.env.API_KEY` is replaced at build-time by vite.config.ts.
// If the key is missing/empty, constructing the SDK can throw and would blank the whole app.
// So we lazy-init the client only when a valid key exists.
const API_KEY = (process.env.API_KEY || process.env.GEMINI_API_KEY || '') as string;
let ai: GoogleGenAI | null = null;

function getClient(): GoogleGenAI | null {
  if (!API_KEY) return null;
  if (!ai) ai = new GoogleGenAI({ apiKey: API_KEY });
  return ai;
}

export const analyzeEconomicEvent = async (event: EconomicEvent): Promise<string> => {
  const client = getClient();
  if (!client) {
    return "API Key not configured. Unable to fetch analysis.";
  }

  try {
    const prompt = `
      Act as a senior financial analyst. Provide a concise (max 2 sentences) analysis of the following economic event.
      Focus on what the 'Actual' vs 'Forecast' deviation implies for the currency or market.
      
      Event: ${event.title} ${event.ticker ? `(${event.ticker})` : ''}
      Country: ${event.country}
      Category: ${event.category}
      ${event.actual ? `Actual Value: ${event.actual}` : ''}
      ${event.forecast ? `Forecast Value: ${event.forecast}` : ''}
      ${event.prior ? `Prior Value: ${event.prior}` : ''}
      ${event.surprise ? `Surprise: ${event.surprise}` : ''}
      ${event.revenue ? `Revenue: ${event.revenue}` : ''}
      ${event.dividendAmount ? `Dividend Amount: ${event.dividendAmount}` : ''}
      ${event.exDividendDate ? `Ex-Dividend Date: ${event.exDividendDate}` : ''}
      ${event.paymentDate ? `Payment Date: ${event.paymentDate}` : ''}
      ${event.dividendYield ? `Dividend Yield: ${event.dividendYield}` : ''}
      Volatility/Importance: ${event.volatility}/3
      
      If the actual value is '—' (undefined), explain what a high or low reading *would* typically mean.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Low latency
      }
    });

    return response.text || "Analysis currently unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to generate analysis at this time.";
  }
};

export interface MarketAnalysisResult {
  text: string;
  sources: { title: string; uri: string }[];
}

export const analyzeMarketSymbol = async (symbol: string, sector?: string): Promise<MarketAnalysisResult> => {
  const client = getClient();
  if (!client) {
    return { text: "API Key not configured.", sources: [] };
  }

  try {
    const prompt = `
      Act as a stock market analyst. Provide a concise (max 3-4 sentences) summary of the current market sentiment for ${symbol} (${sector || 'General'}).
      Use Google Search to find the very latest news, price action catalysts, and analyst ratings from the last 24-48 hours.
      Focus on a short-term trading outlook.
    `;

    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const text = response.text || "Market analysis unavailable.";
    
    // Extract sources from grounding metadata
    const sources: { title: string; uri: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
        chunks.forEach((chunk: any) => {
            if (chunk.web) {
                sources.push({
                    title: chunk.web.title || "Source",
                    uri: chunk.web.uri
                });
            }
        });
    }

    return { text, sources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { text: "Unable to analyze market symbol. Please try again later.", sources: [] };
  }
};