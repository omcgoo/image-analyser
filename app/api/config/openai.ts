// This file should only be accessible server-side
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export function getOpenAIApiKey() {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not set');
  }
  return OPENAI_API_KEY;
} 