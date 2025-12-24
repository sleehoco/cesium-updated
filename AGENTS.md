# AGENTS
1. **Build/Lint/Test**:
   - Build: `npm run build` (Must pass before shipping).
   - Lint: `npm run lint` (ESLint config in `.eslintrc.json`).
   - Test: `npm run test` (Vitest). Run single spec: `npx vitest src/path/to/file.test.ts`.
   - E2E: `npm run test:e2e` (Playwright).
2. **Code Style & Conventions**:
   - **Imports**: Use aliases (`@/components`, `@/lib`) over relative paths. Order: Node/React -> 3rd party -> local.
   - **Types**: Strict TypeScript. Avoid `any`. Use discriminated unions/helpers. No `as` casts if possible.
   - **Components**: Default to Server Components. Add `'use client'` only for state/effects/browser APIs.
   - **Naming**: `PascalCase.tsx` for components, `kebab-case.ts` for utils/hooks/files.
   - **Env Vars**: Access via `process.env['KEY']` (bracket notation) to satisfy type checking.
   - **Styling**: Tailwind utility classes with `cesium` palette tokens. Avoid inline styles.
3. **Architecture & Safety**:
   - **API**: Follow `zod` validation + `rateLimit` pattern. Return typed `NextResponse`.
   - **Errors**: Log with context (`console.error`). Never leak secrets/stack traces to client.
   - **DB**: Use Drizzle schemas in `src/db`. No direct Supabase queries from UI.
   - **AI**: Prompts live in `src/lib/ai/prompts.ts`. Reuse shared logic in `src/lib`.
   - **Security**: Escape JSX text (`&apos;`). Sanitize user inputs.
4. **Reference**: See `CLAUDE.md` for detailed architecture, patterns, and examples.