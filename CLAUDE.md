# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build (ALWAYS run before committing)
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Testing
```bash
npm run test         # Run all Vitest unit tests
npm run test:ui      # Run tests with Vitest UI
npm run test:e2e     # Run Playwright E2E tests

# Run single test file
npx vitest src/app/api/analyze/threat/route.test.ts
```

### Database (Drizzle ORM)
```bash
npm run db:generate  # Generate migrations from schema changes
npm run db:push      # Push schema directly to database (dev)
npm run db:migrate   # Run migrations (production)
npm run db:studio    # Open Drizzle Studio GUI
```

## Architecture Overview

### Multi-Provider AI System

The platform supports 3 AI providers with priority-based fallback:

**Provider Priority:** Groq (1) → Together.ai (2) → OpenAI (3)

**Key Files:**
- `src/lib/ai/providers.ts` - Provider configuration and client initialization
- `src/lib/ai/completions.ts` - Unified completion interface with timeout handling
- `src/lib/ai/prompts.ts` - Security-focused system prompts

**Pattern:**
```typescript
// Function overloads provide type-safe client access
export function getAIClient(provider: 'groq'): Groq;
export function getAIClient(provider: 'together'): Together;
export function getAIClient(provider: 'openai'): OpenAI;

// All completions have 60s timeout by default
const analysis = await generateCompletion({
  systemPrompt: SECURITY_PROMPTS.THREAT_INTELLIGENCE,
  userMessage: `Analyze: ${ioc}`,
  provider: 'groq',
  temperature: 0.3,
});
```

### Authentication Flow

**Supabase SSR Pattern:**
- `src/lib/supabase/client.ts` - Browser client (client components)
- `src/lib/supabase/server.ts` - Server client (server components, API routes)
- `src/lib/supabase/middleware.ts` - Session refresh handler
- `middleware.ts` - Route protection

**Protected Routes:** `/dashboard`, `/profile`, `/settings`

**Pattern:**
```typescript
// Server component
import { getCurrentUser } from '@/lib/auth/utils';
const user = await getCurrentUser();
if (!user) redirect('/auth/login');

// Client component
import { createClient } from '@/lib/supabase/client';
const supabase = createClient();
await supabase.auth.signInWithPassword({ email, password });
```

### Database Schema (Drizzle ORM)

**Location:** `src/db/schema.ts`

**6 Main Tables:**
1. `users` - User profiles (extends Supabase auth.users)
2. `threat_analyses` - IOC analysis history
3. `security_logs` - Log analysis records
4. `vulnerability_scans` - Vulnerability scan results
5. `phishing_analyses` - Phishing detection records
6. `incident_responses` - Incident response playbooks

**Pattern:**
```typescript
import { db } from '@/db';
import { threatAnalyses } from '@/db/schema';

// Insert
await db.insert(threatAnalyses).values({
  userId: user.id,
  iocType: 'ip',
  iocValue: '8.8.8.8',
  analysisResult: { /* JSON */ },
});

// Query with relations
const analyses = await db.query.threatAnalyses.findMany({
  where: eq(threatAnalyses.userId, userId),
  with: { user: true },
});
```

### Rate Limiting

**In-memory implementation** (use Redis/Upstash for production).

**Location:** `src/lib/rate-limit.ts`

**Preset Limits:**
- `AI_ENDPOINT`: 10 requests/60s
- `CONTACT_FORM`: 3 requests/300s
- `STANDARD`: 100 requests/60s

**Pattern:**
```typescript
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const rateLimitResult = rateLimit(req, RATE_LIMITS.AI_ENDPOINT);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
        },
      }
    );
  }
  // ... rest of handler
}
```

### Security Tools Configuration

**Location:** `src/config/tools-config.ts`

Centralized configuration for all security tools. Adding a new tool requires:

1. Add tool definition to `tools` array
2. Create page at `src/app/tools/[tool-id]/page.tsx`
3. Create API at `src/app/api/[endpoint]/route.ts` (if needed)

**Current Active Tools:**
- Threat Intelligence Analyzer
- AI Writing Assistant
- Vulnerability Scanner (NEW)
- Security Log Analyzer (NEW)
- AI Phishing Detector (NEW)
- Incident Response Assistant (NEW)

### API Route Pattern

**Standard structure for all API routes:**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

const schema = z.object({
  field: z.string().min(1),
});

export async function POST(req: NextRequest) {
  // 1. Rate limiting
  const rateLimitResult = rateLimit(req, RATE_LIMITS.AI_ENDPOINT);
  if (!rateLimitResult.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    // 2. Parse and validate
    const body = await req.json();
    const validated = schema.parse(body);

    // 3. Process request
    const result = await processRequest(validated);

    // 4. Return response
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    // 5. Handle errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// CORS support
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
```

### XSS Protection

**DOMPurify sanitization** for all user-generated markdown.

**Pattern:**
```tsx
import { SafeMarkdown } from '@/components/shared/SafeMarkdown';

<SafeMarkdown
  content={userGeneratedContent}
  className="prose prose-invert"
/>
```

The `SafeMarkdown` component strips all HTML tags before rendering markdown.

### Error Tracking

**Sentry integration** (optional - gracefully degrades if not configured).

**Files:**
- `sentry.client.config.ts` - Client-side tracking + session replay
- `sentry.server.config.ts` - Server-side tracking
- `sentry.edge.config.ts` - Edge runtime tracking
- `instrumentation.ts` - Auto-initialization

**Config Pattern:**
```typescript
// Sentry only initializes if DSN is set
beforeSend(event, _hint) {
  if (!process.env['SENTRY_DSN']) {
    return null; // Don't send if not configured
  }
  // Filter sensitive data...
  return event;
}
```

## Critical TypeScript Patterns

### Process.env Access
**ALWAYS use bracket notation:**
```typescript
// ✅ CORRECT
const key = process.env['GROQ_API_KEY'];

// ❌ WRONG (fails strict mode)
const key = process.env.GROQ_API_KEY;
```

### Type Inference Without Casts
**Use function overloads instead of `as` casts:**
```typescript
// ✅ CORRECT
export function getAIClient(provider: 'groq'): Groq;
export function getAIClient(provider: 'together'): Together;
export function getAIClient(provider: AIProvider): Groq | Together {
  switch (provider) {
    case 'groq': return new Groq({ apiKey: process.env['GROQ_API_KEY'] });
    case 'together': return new Together({ apiKey: process.env['TOGETHER_API_KEY'] });
  }
}

// ❌ WRONG
const client = getGenericClient(provider) as Groq;
```

### Type Guards for JSON Parsing
**Use type guards instead of type assertions:**
```typescript
// ✅ CORRECT
function isIPReport(data: unknown): data is IPReport {
  return (
    typeof data === 'object' &&
    data !== null &&
    'country' in data
  );
}

const parsed = JSON.parse(response);
if (isIPReport(parsed)) {
  // TypeScript knows parsed is IPReport
}

// ❌ WRONG
const parsed = JSON.parse(response) as IPReport;
```

## Environment Variables

### Required
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database
DATABASE_URL=postgresql://...

# AI (at least ONE required)
GROQ_API_KEY=
TOGETHER_API_KEY=
OPENAI_API_KEY=
```

### Optional
```bash
# Threat Intelligence
VIRUSTOTAL_API_KEY=

# Email
RESEND_API_KEY=

# Error Tracking
SENTRY_DSN=
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Build Requirements

### Before Every Commit
```bash
npm run build  # MUST pass with zero errors
```

### Common Build Errors

**1. Process.env access:**
```
Property 'VAR' comes from an index signature
```
**Fix:** Use `process.env['VAR']` instead of `process.env.VAR`

**2. Unescaped entities in JSX:**
```
`'` can be escaped with `&apos;`
```
**Fix:** Replace `'` with `&apos;` in JSX text

**3. Unused variables:**
```
'variable' is declared but never used
```
**Fix:** Remove or prefix with `_variable`

## Testing Patterns

### API Route Tests
```typescript
// Mock Next.js request
const mockRequest = {
  json: async () => ({ ioc: '8.8.8.8' }),
  headers: new Headers(),
} as NextRequest;

const response = await POST(mockRequest);
const data = await response.json();

expect(response.status).toBe(200);
expect(data.success).toBe(true);
```

### Component Tests
```typescript
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

test('renders component', () => {
  render(<Component />);
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

## Common Development Tasks

### Adding a New Security Tool

1. **Define tool in config:**
```typescript
// src/config/tools-config.ts
{
  id: 'new-tool',
  name: 'New Security Tool',
  path: '/tools/new-tool',
  category: 'AI Security Tools',
  status: 'new',
  // ... other fields
}
```

2. **Create API route:**
```bash
src/app/api/new-tool/route.ts
```

3. **Create page:**
```bash
src/app/tools/new-tool/page.tsx
```

4. **Add system prompt:**
```typescript
// src/lib/ai/prompts.ts
export const SECURITY_PROMPTS = {
  NEW_TOOL: `You are an expert...`,
  // ... other prompts
};
```

### Updating Database Schema

1. **Modify schema:**
```typescript
// src/db/schema.ts
export const newTable = pgTable('new_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  // ... fields
});
```

2. **Generate migration:**
```bash
npm run db:generate
```

3. **Apply to development:**
```bash
npm run db:push
```

4. **For production:**
```bash
npm run db:migrate
```

## Code Quality Standards

### CRITICAL: No Claude Attribution
- **NEVER** add "Generated with Claude Code" to commits
- **NEVER** add "Co-Authored-By: Claude" to commits
- All code should appear developer-written

### TypeScript Strict Mode
All code must pass with:
- `strict: true`
- `noImplicitAny: true`
- `strictNullChecks: true`
- `noUnusedLocals: true`

### ESLint Rules
- No unused imports
- No unused variables (prefix with `_` if intentionally unused)
- Escape apostrophes in JSX: `&apos;`
- Escape quotes in JSX: `&quot;`

## Project-Specific Conventions

### Client vs Server Components
- **Default:** Server components (no 'use client')
- **Use 'use client' only when:** useState, useEffect, onClick handlers, browser APIs

### Import Aliases
```typescript
import { Component } from '@/components/ui/button';  // ✅
import { util } from '../../../lib/utils';          // ❌
```

### Color Scheme
```typescript
// Tailwind custom colors
cesium: '#D4AF37'     // Gold accent
cyber-dark: '#0a0a0a' // Dark background
cyber: '#1a1a1a'      // Default background
```

### File Naming
- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`
- API routes: `route.ts`
- Pages: `page.tsx`

## Deployment

### Vercel (Primary)
```bash
# Push to trigger automatic deployment
git push origin main

# Or manual CLI deploy
vercel --prod
```

### Pre-Deployment Checklist
- [ ] `npm run build` passes
- [ ] All tests pass
- [ ] Environment variables configured in Vercel
- [ ] Database migrations applied
- [ ] No secrets in code

## Additional Context

- **Next.js Version:** 15.5.9 (App Router)
- **TypeScript:** 5.6.3 (Strict Mode)
- **Node Version:** 20.x required
- **Database:** PostgreSQL via Supabase
- **Deployment:** Vercel Edge Network
