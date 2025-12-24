/**
 * AI Provider Configuration
 * Supports multiple LLM providers with fallback support
 */

import Groq from 'groq-sdk';
import Together from 'together-ai';
import { OpenAI } from 'openai';

export type AIProvider = 'groq' | 'together' | 'openai' | 'ollama';


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
  ollama: {
    name: 'ollama',
    model: process.env['OLLAMA_MODEL'] || 'llama3.1',
    maxTokens: 4096,
    temperature: 0.2,
    priority: 0,
  },
};


/**
 * Initialize AI clients with proper type overloads
 */
export function getAIClient(provider: 'groq'): Groq;
export function getAIClient(provider: 'together'): Together;
export function getAIClient(provider: 'openai'): OpenAI;
export function getAIClient(provider: 'ollama'): never;

export function getAIClient(provider: AIProvider): Groq | Together | OpenAI {
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

    case 'ollama':
      throw new Error('Ollama provider does not use the shared SDK client helper.');

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
  if (process.env['OLLAMA_BASE_URL'] || process.env['OLLAMA_MODEL']) providers.push('ollama');

  return providers.sort((a, b) => AI_PROVIDERS[a].priority - AI_PROVIDERS[b].priority);
}


/**
 * Get the best available provider
 */
export function getBestProvider(): AIProvider {
  const available = getAvailableProviders();
  if (available.length === 0) {
    throw new Error('No AI providers configured. Please set GROQ_API_KEY, TOGETHER_API_KEY, OPENAI_API_KEY, or OLLAMA_BASE_URL');
  }

  const provider = available[0];
  if (!provider) {
    throw new Error('No AI providers available');
  }
  return provider;
}
