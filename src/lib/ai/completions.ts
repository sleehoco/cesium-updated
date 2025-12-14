/**
 * AI Completion Service
 * Handles chat completions across multiple providers
 */

import { getAIClient, getBestProvider, AI_PROVIDERS, type AIProvider } from './providers';

// Default timeout for AI completions (60 seconds)
const DEFAULT_TIMEOUT_MS = 60000;

export interface CompletionRequest {
  systemPrompt: string;
  userMessage: string;
  provider?: AIProvider;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  timeoutMs?: number; // Optional custom timeout
}

export interface CompletionResponse {
  content: string;
  provider: AIProvider;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Utility function to add timeout to a promise
 */
function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  operation: string
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`${operation} timed out after ${timeoutMs}ms`)),
        timeoutMs
      )
    ),
  ]);
}

/**
 * Generate AI completion
 */
export async function generateCompletion(request: CompletionRequest): Promise<CompletionResponse> {
  const provider = request.provider || getBestProvider();
  const config = AI_PROVIDERS[provider];

  const temperature = request.temperature ?? config.temperature ?? 0.1;
  const maxTokens = request.maxTokens ?? config.maxTokens ?? 8000;
  const timeoutMs = request.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  try {
    switch (provider) {
      case 'groq': {
        const client = getAIClient('groq');
        const completion = await withTimeout(
          client.chat.completions.create({
            model: config.model,
            messages: [
              { role: 'system', content: request.systemPrompt },
              { role: 'user', content: request.userMessage },
            ],
            temperature,
            max_tokens: maxTokens,
          }),
          timeoutMs,
          `Groq API call`
        );

        return {
          content: completion.choices[0]?.message?.content || '',
          provider,
          model: config.model,
          usage: {
            promptTokens: completion.usage?.prompt_tokens || 0,
            completionTokens: completion.usage?.completion_tokens || 0,
            totalTokens: completion.usage?.total_tokens || 0,
          },
        };
      }

      case 'together': {
        const client = getAIClient('together');
        const completion = await withTimeout(
          client.chat.completions.create({
            model: config.model,
            messages: [
              { role: 'system', content: request.systemPrompt },
              { role: 'user', content: request.userMessage },
            ],
            temperature,
            max_tokens: maxTokens,
          }),
          timeoutMs,
          `Together.ai API call`
        );

        return {
          content: completion.choices[0]?.message?.content || '',
          provider,
          model: config.model,
          usage: {
            promptTokens: completion.usage?.prompt_tokens || 0,
            completionTokens: completion.usage?.completion_tokens || 0,
            totalTokens: completion.usage?.total_tokens || 0,
          },
        };
      }

      case 'openai': {
        const client = getAIClient('openai');
        const completion = await withTimeout(
          client.chat.completions.create({
            model: config.model,
            messages: [
              { role: 'system', content: request.systemPrompt },
              { role: 'user', content: request.userMessage },
            ],
            temperature,
            max_tokens: maxTokens,
          }),
          timeoutMs,
          `OpenAI API call`
        );

        return {
          content: completion.choices[0]?.message?.content || '',
          provider,
          model: config.model,
          usage: {
            promptTokens: completion.usage?.prompt_tokens || 0,
            completionTokens: completion.usage?.completion_tokens || 0,
            totalTokens: completion.usage?.total_tokens || 0,
          },
        };
      }

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  } catch (error) {
    console.error(`AI completion error with ${provider}:`, error);
    throw new Error(`Failed to generate completion: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate streaming completion (for real-time UI)
 */
export async function* generateStreamingCompletion(
  request: CompletionRequest
): AsyncGenerator<string, void, unknown> {
  const provider = request.provider || getBestProvider();
  const config = AI_PROVIDERS[provider];

  const temperature = request.temperature ?? config.temperature ?? 0.1;
  const maxTokens = request.maxTokens ?? config.maxTokens ?? 8000;

  try {
    switch (provider) {
      case 'groq': {
        const client = getAIClient('groq');
        const stream = await client.chat.completions.create({
          model: config.model,
          messages: [
            { role: 'system', content: request.systemPrompt },
            { role: 'user', content: request.userMessage },
          ],
          temperature,
          max_tokens: maxTokens,
          stream: true,
        });

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            yield content;
          }
        }
        break;
      }

      case 'together': {
        const client = getAIClient('together');
        const stream = await client.chat.completions.create({
          model: config.model,
          messages: [
            { role: 'system', content: request.systemPrompt },
            { role: 'user', content: request.userMessage },
          ],
          temperature,
          max_tokens: maxTokens,
          stream: true,
        });

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            yield content;
          }
        }
        break;
      }

      case 'openai': {
        const client = getAIClient('openai');
        const stream = await client.chat.completions.create({
          model: config.model,
          messages: [
            { role: 'system', content: request.systemPrompt },
            { role: 'user', content: request.userMessage },
          ],
          temperature,
          max_tokens: maxTokens,
          stream: true,
        });

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            yield content;
          }
        }
        break;
      }
    }
  } catch (error) {
    console.error(`Streaming completion error with ${provider}:`, error);
    throw new Error(`Failed to generate streaming completion: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
