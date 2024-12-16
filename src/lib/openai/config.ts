import OpenAI from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn('OpenAI API key is not configured. Manual entry will be used as fallback.');
}

export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
  maxRetries: 2,
  timeout: 20000
});

export const isConfigured = Boolean(OPENAI_API_KEY);