/**
 * xAI (Grok) Provider Configuration
 * Used by the Security Robot chat assistant
 */

import { createXai } from '@ai-sdk/xai';

export const xai = createXai({
  apiKey: process.env['XAI_API_KEY'],
});

export const XAI_MODEL = 'grok-3-mini';
