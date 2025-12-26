# AGENTS.md - Development Guidelines for AI Coding Agents

This file provides essential guidance for AI agents (Claude, Copilot, etc.) working in the CesiumCyber Next.js repository.

---

## 1. BUILD, LINT & TEST COMMANDS

### Development
```bash
npm run dev              # Start dev server (localhost:3000)
npm run build            # Production build - MUST PASS before committing
npm run start            # Start production server
npm run lint             # Run ESLint checks
```

### Testing
```bash
npm run test             # Run all Vitest unit tests
npm run test:ui          # Vitest UI mode
npm run test:e2e         # Playwright E2E tests

# Run single test file
npx vitest src/app/api/analyze/threat/route.test.ts

# Run tests in watch mode
npx vitest --watch

# Run specific test pattern
npx vitest --grep="phishing"
```

### Database (Drizzle ORM)
```bash
npm run db:generate      # Generate migrations from schema.ts changes
npm run db:push          # Push schema directly (dev only)
npm run db:migrate       # Run migrations (production)
npm run db:studio        # Open Drizzle Studio GUI
```

---

## 2. CODE STYLE & CONVENTIONS

### Import Organization
```typescript
// ✅ GOOD: Path aliases, grouped by type
import { NextRequest, NextResponse } from 'next/server';  // 1. Node/Framework
import { z } from 'zod';                                   // 2. Third-party
import { generateCompletion } from '@/lib/ai/completions'; // 3. Local (@/ aliases)
import { requireAuth } from '@/lib/auth/api-auth';

// ❌ BAD: Relative paths, mixed order
import { generateCompletion } from '../../../lib/ai/completions';
import { z } from 'zod';
```

**Rules**:
- **Always use** `@/` path aliases (never `../../../`)
- **Order**: Node/React → Third-party → Local
- **Group** related imports together

### TypeScript Strict Mode

```typescript
// ✅ GOOD: Explicit types, no 'any'
interface GameState {
  score: number;
  phase: 'initial' | 'active' | 'complete';
}

function processGame(state: GameState): Result {
  return { success: true, data: state };
}

// ❌ BAD: 'any', implicit types, type assertions
function processGame(state: any) {
  return state as Result;
}
```

**Rules**:
- Avoid `any` - use `unknown` if type truly unknown
- No `as` type assertions (use type guards instead)
- Enable strict mode features (already configured)
- Use discriminated unions for variants

### Component Architecture

```typescript
// ✅ GOOD: Server Component (default)
export default async function AnalyticsPage() {
  const data = await fetchData();
  return <Dashboard data={data} />;
}

// ✅ GOOD: Client Component (when needed)
'use client';

import { useState } from 'react';

export function InteractiveChart() {
  const [data, setData] = useState([]);
  // ... state/effects/browser APIs
}

// ❌ BAD: Unnecessary 'use client'
'use client';  // Not needed - no state/effects

export default function StaticPage() {
  return <div>Hello</div>;
}
```

**Rules**:
- Default to **Server Components**
- Add `'use client'` ONLY for: `useState`, `useEffect`, browser APIs, event handlers
- Keep client bundles small

### Naming Conventions

```
✅ Components:     PascalCase.tsx       (HomePage.tsx, Button.tsx)
✅ Utils/Hooks:    kebab-case.ts        (api-auth.ts, use-retro-sounds.ts)
✅ Types:          PascalCase           (interface User, type APIResponse)
✅ Constants:      SCREAMING_SNAKE      (RATE_LIMITS, API_ENDPOINTS)
✅ Functions:      camelCase            (generateCompletion, checkAuth)
```

### Environment Variables

```typescript
// ✅ GOOD: Bracket notation (satisfies TypeScript)
const apiKey = process.env['GROQ_API_KEY'];
const url = process.env['NEXT_PUBLIC_APP_URL'];

// ❌ BAD: Dot notation (TypeScript error)
const apiKey = process.env.GROQ_API_KEY;
```

**Rules**:
- **Always** use bracket notation: `process.env['KEY']`
- Server-only vars: NO prefix
- Client vars: `NEXT_PUBLIC_` prefix
- Validate in `src/lib/env.ts`

### Styling with Tailwind

```tsx
// ✅ GOOD: Utility classes, theme tokens
<div className="bg-cyber-dark border-2 border-cesium/30 hover:border-cesium transition-all">

// ❌ BAD: Inline styles, hardcoded colors
<div style={{ background: '#000', borderColor: '#d4af37' }}>
```

**Theme Tokens**:
- `cesium` - Gold (#D4AF37)
- `cyber-dark` - Dark background
- `cyber-light` - Light variant

---

## 3. ARCHITECTURE & PATTERNS

### API Route Pattern

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth/api-auth';
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

// ✅ Define schema with size limits
const schema = z.object({
  content: z.string().min(1).max(50000),  // Always add max limits
  type: z.enum(['email', 'url', 'text']),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication (for protected endpoints)
    const auth = await requireAuth(req);
    if (!auth.authorized) return auth.error!;
    
    // 2. Rate limiting
    const rateCheck = rateLimit(req, RATE_LIMITS.AI_ENDPOINT);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }
    
    // 3. Validate input
    const body = await req.json();
    const data = schema.parse(body);
    
    // 4. Business logic
    const result = await processData(data);
    
    // 5. Return typed response
    return NextResponse.json({
      success: true,
      data: result,
    });
    
  } catch (error) {
    console.error('API error:', error);  // Log with context
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    // NEVER leak error details to client
    return NextResponse.json(
      { error: 'Internal error occurred' },
      { status: 500 }
    );
  }
}
```

### Error Handling

```typescript
// ✅ GOOD: Safe error handling
try {
  await riskyOperation();
} catch (error) {
  console.error('Context about what failed:', error);  // Server-side log
  return NextResponse.json(
    { error: 'Operation failed. Please try again.' },  // Generic client message
    { status: 500 }
  );
}

// ❌ BAD: Leaking error details
catch (error) {
  return NextResponse.json(
    { error: error.message },  // ❌ Exposes internals
    { status: 500 }
  );
}
```

### Database Queries

```typescript
// ✅ GOOD: Use Drizzle ORM
import { db } from '@/db';
import { threatAnalyses } from '@/db/schema';
import { eq } from 'drizzle-orm';

const results = await db
  .select()
  .from(threatAnalyses)
  .where(eq(threatAnalyses.userId, user.id))
  .limit(10);

// ❌ BAD: Direct Supabase queries from client
const { data } = await supabase
  .from('threat_analyses')
  .select('*');
```

### AI Integration

```typescript
// ✅ GOOD: Reuse shared AI logic
import { generateCompletion } from '@/lib/ai/completions';
import { SECURITY_PROMPTS } from '@/lib/ai/prompts';

const analysis = await generateCompletion({
  systemPrompt: SECURITY_PROMPTS.THREAT_INTELLIGENCE,
  userMessage: `Analyze this IOC: ${ioc}`,
  temperature: 0.3,
  provider: 'groq',
});

// ❌ BAD: Duplicate AI logic in routes
const client = new Groq({ apiKey: process.env['GROQ_API_KEY'] });
const result = await client.chat.completions.create({ ... });
```

---

## 4. SECURITY REQUIREMENTS

### Input Validation
- **ALWAYS** use Zod schemas with `.max()` limits
- Validate all user inputs (query params, body, headers)
- Use enums for controlled values
- Sanitize before using in prompts/queries

### Output Sanitization
```typescript
// ✅ Escape HTML in JSX
<p>{user.name}</p>  // Auto-escaped by React

// ✅ For HTML content, use SafeMarkdown
import { SafeMarkdown } from '@/components/shared/SafeMarkdown';
<SafeMarkdown content={aiResponse} />

// ❌ NEVER use dangerouslySetInnerHTML without DOMPurify
<div dangerouslySetInnerHTML={{ __html: userContent }} />  // ❌ XSS risk
```

### Authentication
- Public endpoints: Contact form only
- Protected endpoints: ALL AI tools, scans, analyses
- Use `requireAuth()` helper from `@/lib/auth/api-auth`

### Environment Variables
- Server-only keys: NO `NEXT_PUBLIC_` prefix
- Validate in `src/lib/env.ts` with Zod
- Never log or expose API keys

---

## 5. CRITICAL RULES

### Before Every Commit
1. ✅ Run `npm run build` - must pass
2. ✅ Run `npm run lint` - fix all errors
3. ✅ Test affected features manually
4. ✅ Check for console errors in browser

### Security Checklist
- [ ] Added authentication to new API routes?
- [ ] Input validation with size limits?
- [ ] No `any` types?
- [ ] Errors sanitized (no stack traces to client)?
- [ ] Using `@/` imports (not relative)?
- [ ] Escaped user content in JSX?

### Performance Checklist
- [ ] Server Component by default?
- [ ] Client component only when needed?
- [ ] Images using next/image?
- [ ] Large dependencies lazy-loaded?

---

## 6. COMMON PATTERNS

### Rate Limiting
```typescript
import { rateLimit, RATE_LIMITS } from '@/lib/rate-limit';

const result = rateLimit(req, RATE_LIMITS.AI_ENDPOINT);
if (!result.success) {
  return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
}
```

### Response Format
```typescript
// Success
return NextResponse.json({
  success: true,
  data: { ... }
});

// Error
return NextResponse.json({
  success: false,
  error: 'User-friendly message'
}, { status: 400 });
```

---

## 7. PROJECT STRUCTURE

```
src/
├── app/              # Next.js 16 app router
│   ├── api/          # API routes (serverless functions)
│   ├── tools/        # Tool pages (client components)
│   └── (auth)/       # Auth pages
├── components/
│   ├── shared/       # Reusable components (Navbar, Footer)
│   └── ui/           # shadcn/ui primitives
├── lib/
│   ├── ai/           # AI provider logic
│   ├── auth/         # Authentication helpers
│   ├── supabase/     # Supabase clients
│   └── threat-intel/ # Security integrations
├── db/               # Drizzle ORM schema
└── types/            # TypeScript type definitions
```

---

## 8. DEPLOYMENT (Vercel)

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`
- `GROQ_API_KEY` or `TOGETHER_API_KEY` (at least one)
- `RESEND_API_KEY` (for contact form)
- `VIRUSTOTAL_API_KEY` (optional)

### Pre-Deploy Checklist
1. Build passes locally: `npm run build`
2. All tests pass: `npm run test`
3. No TypeScript errors
4. Environment variables set in Vercel dashboard
5. Review `SECURITY_AUDIT_REPORT.md` for known issues

---

## 9. SECURITY NOTES ⚠️

**Known Vulnerabilities** (see `SECURITY_AUDIT_REPORT.md`):
1. **CRITICAL**: Missing authentication on some API routes
2. **HIGH**: SSRF risk in URL checker (now fixed)
3. **HIGH**: Wildcard CORS on 4 routes
4. **MEDIUM**: In-memory rate limiting (use Upstash for production)

**When Adding New Features**:
- Add auth check first
- Validate ALL inputs with size limits
- Never trust user input
- Test for injection attacks
- Use prepared statements/ORMs only

---

## 10. REFERENCE DOCUMENTATION

- **Full Architecture**: `CLAUDE.md` (detailed patterns, examples)
- **Security Audit**: `SECURITY_AUDIT_REPORT.md` (known vulnerabilities)
- **Deployment**: `DEPLOYMENT_GUIDE.md` (Vercel deployment process)
- **Tools Architecture**: `TOOLS-ARCHITECTURE.md` (AI tools design)

---

**Last Updated**: December 25, 2025  
**Next.js Version**: 16.1.1 (Turbopack)  
**Framework**: React 19, TypeScript 5.6