import { EconomicEvent } from '../types';
import { withCsrfHeaders } from './csrf';

type ApiErrorShape = { error?: string };

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const requestInit = await withCsrfHeaders({
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const res = await fetch(url, requestInit);

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const payload = (isJson ? await res.json() : null) as T & ApiErrorShape;

  if (!res.ok) {
    throw new Error(payload?.error || `HTTP_${res.status}`);
  }

  return payload as T;
}

export const analyzeEconomicEvent = async (event: EconomicEvent): Promise<string> => {
  try {
    const payload = await postJson<{ text?: string }>('/api/ai/event-analysis', { event });
    return payload.text || 'Analysis currently unavailable.';
  } catch (error) {
    console.error('AI event analysis error:', error);
    if (error instanceof Error && error.message === 'AI_NOT_CONFIGURED') {
      return 'AI analysis is disabled. Set GEMINI_API_KEY on the backend.';
    }
    return 'Unable to generate analysis at this time.';
  }
};

export interface MarketAnalysisResult {
  text: string;
  sources: { title: string; uri: string }[];
}

export const analyzeMarketSymbol = async (
  symbol: string,
  sector?: string
): Promise<MarketAnalysisResult> => {
  try {
    const payload = await postJson<MarketAnalysisResult>('/api/ai/market-analysis', {
      symbol,
      sector,
    });
    return {
      text: payload.text || 'Market analysis unavailable.',
      sources: Array.isArray(payload.sources) ? payload.sources : [],
    };
  } catch (error) {
    console.error('AI market analysis error:', error);
    if (error instanceof Error && error.message === 'AI_NOT_CONFIGURED') {
      return {
        text: 'AI analysis is disabled. Set GEMINI_API_KEY on the backend.',
        sources: [],
      };
    }
    return {
      text: 'Unable to analyze market symbol. Please try again later.',
      sources: [],
    };
  }
};
