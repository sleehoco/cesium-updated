# Getting Started with CesiumCyber Next.js

## Quick Start

### 1. Install Dependencies

```bash
cd cesium-cyber-nextjs
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Fill in the required values in `.env.local`:

```env
# Supabase (from your existing Supabase project)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Vercel Postgres (will be auto-populated when you deploy to Vercel)
# For local development, you can use your Supabase database or set up a local Postgres
POSTGRES_URL=postgresql://...
POSTGRES_PRISMA_URL=postgresql://...

# Optional: AI Services
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...

# Optional: Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

## What's Been Set Up

### ✅ Core Infrastructure
- **Next.js 15** with App Router
- **TypeScript** with strict mode enabled
- **Tailwind CSS** with custom Cesium theme
- **Environment validation** using Zod

### ✅ Code Quality
- **ESLint** configured for Next.js and TypeScript
- **Strict TypeScript** - all safety features enabled
- **Type-safe environment variables**

### ✅ Testing
- **Vitest** for unit/component tests
- **Playwright** for E2E tests
- **Testing Library** for React component testing

### ✅ UI Components
- **shadcn/ui** components (Button, Card)
- **Lucide Icons**
- **Dark mode** support with next-themes
- **Toast notifications** with Sonner

### ✅ Production Ready
- **Error boundaries** for graceful error handling
- **Loading states** for better UX
- **404 page** custom design
- **SEO optimization** with metadata
- **Security headers** configured
- **Analytics** ready (Vercel Analytics + Speed Insights)

### ✅ Developer Experience
- **Hot reload** for fast development
- **Path aliases** (`@/` for `src/`)
- **Organized folder structure**
- **Comprehensive README**

## Next Steps

### 1. Test the Setup

Run the tests to make sure everything works:

```bash
# Unit tests
npm run test

# E2E tests (will start dev server automatically)
npm run test:e2e
```

### 2. Start Migrating Features

The original project had these features. Here's the recommended migration order:

**Phase 1: Core Pages (Week 1)**
- [ ] Services page
- [ ] Contact page
- [ ] About page
- [ ] Footer component
- [ ] Navbar component

**Phase 2: Database Setup (Week 1-2)**
- [ ] Set up Drizzle schema
- [ ] Create migrations
- [ ] Set up Supabase Auth integration
- [ ] Migrate existing data

**Phase 3: Privacy & Consent (Week 2)**
- [ ] Cookie consent banner
- [ ] Privacy policy page
- [ ] Terms of service page
- [ ] Fingerprint consent dialog

**Phase 4: User Features (Week 3)**
- [ ] Authentication pages (login/signup)
- [ ] Client dashboard
- [ ] Protected routes middleware

**Phase 5: Admin Features (Week 3-4)**
- [ ] Admin dashboard
- [ ] Role management
- [ ] User management
- [ ] Security monitoring

**Phase 6: Advanced Features (Week 4-5)**
- [ ] Browser fingerprinting system
- [ ] Blog system with AI generation
- [ ] Newsletter management
- [ ] Policy generator
- [ ] M365 security assessment
- [ ] Security scanner

**Phase 7: API Routes (Week 5)**
- [ ] Fingerprint analysis API
- [ ] Blog API
- [ ] Contact form API
- [ ] Newsletter API

### 3. Deploy to Vercel

When ready to deploy:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## File Structure Explained

```
cesium-cyber-nextjs/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Homepage (/)
│   │   ├── layout.tsx         # Root layout
│   │   ├── providers.tsx      # Client-side providers
│   │   ├── error.tsx          # Error boundary
│   │   ├── not-found.tsx      # 404 page
│   │   └── loading.tsx        # Loading state
│   │
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── shared/            # Shared across all pages
│   │   ├── marketing/         # Public website components
│   │   ├── dashboard/         # Dashboard components
│   │   └── admin/             # Admin-only components
│   │
│   ├── lib/
│   │   ├── env.ts             # Environment validation ⭐
│   │   ├── utils.ts           # Utility functions
│   │   ├── db/                # Database schema & queries
│   │   └── auth/              # Authentication helpers
│   │
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript types
│   └── styles/                 # Global styles
│       └── globals.css        # Tailwind + custom CSS
│
├── e2e/                        # Playwright E2E tests
├── public/                     # Static assets
│
├── .env.local                  # Environment variables (create this)
├── .env.local.example         # Example env file
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json              # TypeScript configuration ⭐
├── vitest.config.ts           # Vitest configuration
├── playwright.config.ts       # Playwright configuration
└── package.json               # Dependencies & scripts
```

⭐ = Has strict settings for better code quality

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run linter

# Testing
npm run test            # Run unit tests
npm run test:ui         # Run tests with UI
npm run test:e2e        # Run E2E tests

# Database (when you set it up)
npm run db:generate     # Generate migrations
npm run db:push         # Push schema to DB
npm run db:studio       # Open Drizzle Studio
```

## Need Help?

1. Check the main [README.md](./README.md) for detailed docs
2. Review [Next.js docs](https://nextjs.org/docs)
3. Check [shadcn/ui docs](https://ui.shadcn.com)
4. Review [Tailwind docs](https://tailwindcss.com)

## Tips for Migration

1. **Start Small** - Migrate one page at a time
2. **Test As You Go** - Write tests for each component
3. **Use Strict Types** - Let TypeScript catch bugs early
4. **Follow the Plan** - Use the phase-by-phase approach above
5. **Keep Security in Mind** - Always validate inputs, use environment vars for secrets

---

Happy coding! 🚀
