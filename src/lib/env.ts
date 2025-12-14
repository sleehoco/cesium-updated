import { z } from 'zod';

/**
 * Environment variable validation schema
 * This ensures all required environment variables are present and valid at runtime
 */
const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().describe('Supabase project URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).describe('Supabase anonymous key'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional().describe('Supabase service role key (server-side only)'),

  // Vercel Postgres (optional - only needed when using Vercel Postgres)
  POSTGRES_URL: z.string().url().optional().or(z.literal('')).describe('Vercel Postgres connection URL'),
  POSTGRES_PRISMA_URL: z.string().url().optional().or(z.literal('')).describe('Vercel Postgres Prisma URL'),
  POSTGRES_URL_NON_POOLING: z.string().url().optional().or(z.literal('')).describe('Vercel Postgres non-pooling URL'),

  // AI Services (Required for AI Security Co-Pilot)
  TOGETHER_API_KEY: z.string().min(1).optional().describe('Together.ai API key'),
  GROQ_API_KEY: z.string().min(1).optional().describe('Groq API key'),
  OPENAI_API_KEY: z.string().startsWith('sk-').optional().describe('OpenAI API key'),

  // Threat Intelligence APIs
  VIRUSTOTAL_API_KEY: z.string().min(1).optional().describe('VirusTotal API key'),

  // Email Service
  RESEND_API_KEY: z.string().min(1).optional().describe('Resend API key for sending emails'),

  // Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z
    .string()
    .regex(/^G-[A-Z0-9]+$/, 'Invalid Google Analytics Measurement ID format')
    .optional()
    .describe('Google Analytics Measurement ID (format: G-XXXXXXXXXX)'),

  // App Configuration
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000').describe('Application URL'),
});

/**
 * Server-side environment variables
 * Only available in server components and API routes
 */
const serverEnvSchema = envSchema;

/**
 * Client-side environment variables
 * Only variables prefixed with NEXT_PUBLIC_ are available
 */
const clientEnvSchema = envSchema.pick({
  NODE_ENV: true,
  NEXT_PUBLIC_SUPABASE_URL: true,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: true,
  NEXT_PUBLIC_GA_MEASUREMENT_ID: true,
  NEXT_PUBLIC_APP_URL: true,
});

/**
 * Validate and parse environment variables
 * Throws an error if validation fails
 */
function validateEnv() {
  // Skip validation in browser
  if (typeof window !== 'undefined') {
    const clientEnv = {
      NODE_ENV: process.env['NODE_ENV'],
      NEXT_PUBLIC_SUPABASE_URL: process.env['NEXT_PUBLIC_SUPABASE_URL'],
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
      NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env['NEXT_PUBLIC_GA_MEASUREMENT_ID'],
      NEXT_PUBLIC_APP_URL: process.env['NEXT_PUBLIC_APP_URL'],
    };

    const parsed = clientEnvSchema.safeParse(clientEnv);

    if (!parsed.success) {
      console.error('❌ Invalid client environment variables:', parsed.error.flatten().fieldErrors);
      throw new Error('Invalid client environment variables');
    }

    return parsed.data;
  }

  // Server-side validation
  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}

/**
 * Validated and typed environment variables
 * Use this instead of process.env for type safety
 */
export const env = validateEnv();

/**
 * Type-safe environment variable access
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Check if we're in a specific environment
 */
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
