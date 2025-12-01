/**
 * AI Provider Configuration
 * Supports multiple LLM providers with fallback support
 */

import Groq from 'groq-sdk';
import Together from 'together-ai';
import { OpenAI } from 'openai';

export type AIProvider = 'groq' | 'together' | 'openai';

export interface AIProviderConfig {
  name: AIProvider;
  model: string;
  maxTokens?: number;
  temperature?: number;
  priority: number;
}

/**
 * Available AI providers with their configurations
 */
export const AI_PROVIDERS: Record<AIProvider, AIProviderConfig> = {
  groq: {
    name: 'groq',
    model: 'llama-3.3-70b-versatile', // Fast inference - Updated model
    maxTokens: 8000,
    temperature: 0.1,
    priority: 1, // Highest priority (fastest)
  },
  together: {
    name: 'together',
    model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
    maxTokens: 8000,
    temperature: 0.1,
    priority: 2,
  },
  openai: {
    name: 'openai',
    model: 'gpt-4o-mini', // Cost-effective
    maxTokens: 8000,
    temperature: 0.1,
    priority: 3,
  },
};

/**
 * Initialize AI clients
 */
export function getAIClient(provider: AIProvider) {
  switch (provider) {
    case 'groq':
      if (!process.env['GROQ_API_KEY']) {
        throw new Error('GROQ_API_KEY is not set');
      }
      return new Groq({
        apiKey: process.env['GROQ_API_KEY'],
      });

    case 'together':
      if (!process.env['TOGETHER_API_KEY']) {
        throw new Error('TOGETHER_API_KEY is not set');
      }
      return new Together({
        apiKey: process.env['TOGETHER_API_KEY'],
      });

    case 'openai':
      if (!process.env['OPENAI_API_KEY']) {
        throw new Error('OPENAI_API_KEY is not set');
      }
      return new OpenAI({
        apiKey: process.env['OPENAI_API_KEY'],
      });

    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

/**
 * Get available providers based on environment configuration
 */
export function getAvailableProviders(): AIProvider[] {
  const providers: AIProvider[] = [];

  if (process.env['GROQ_API_KEY']) providers.push('groq');
  if (process.env['TOGETHER_API_KEY']) providers.push('together');
  if (process.env['OPENAI_API_KEY']) providers.push('openai');

  return providers.sort((a, b) => AI_PROVIDERS[a].priority - AI_PROVIDERS[b].priority);
}

/**
 * Get the best available provider
 */
export function getBestProvider(): AIProvider {
  const available = getAvailableProviders();
  if (available.length === 0) {
    throw new Error('No AI providers configured. Please set GROQ_API_KEY, TOGETHER_API_KEY, or OPENAI_API_KEY');
  }
  const provider = available[0];
  if (!provider) {
    throw new Error('No AI providers available');
  }
  return provider;
}
