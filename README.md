# CesiumCyber - Next.js Migration

Modern cybersecurity company website built with Next.js 15, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Vercel Postgres + Drizzle ORM
- **Auth:** Supabase Auth
- **State Management:** TanStack Query (React Query)
- **Testing:** Vitest + Playwright
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm or yarn or pnpm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd cesium-cyber-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your credentials:
- Supabase URL and keys
- Vercel Postgres connection strings
- API keys for AI services

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (marketing)/       # Public pages group
│   ├── (dashboard)/       # Protected pages group
│   ├── api/              # API routes
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Homepage
│   └── error.tsx         # Error boundary
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── shared/           # Shared components
│   ├── marketing/        # Marketing components
│   └── dashboard/        # Dashboard components
├── lib/
│   ├── db/              # Database schema and queries
│   ├── auth/            # Authentication utilities
│   ├── utils.ts         # Utility functions
│   └── env.ts           # Environment validation
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── styles/              # Global styles
```

## Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Testing
```bash
npm run test         # Run unit tests with Vitest
npm run test:ui      # Run tests with UI
npm run test:e2e     # Run end-to-end tests with Playwright
```

### Database
```bash
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
```

## Features

### Implemented
- ✅ TypeScript strict mode
- ✅ Environment variable validation
- ✅ Error boundaries
- ✅ Loading states
- ✅ 404 page
- ✅ SEO optimization
- ✅ Security headers
- ✅ Testing infrastructure
- ✅ Responsive design
- ✅ Dark mode support

### Planned
- [ ] Privacy consent system
- [ ] Browser fingerprinting
- [ ] Blog system
- [ ] Admin dashboard
- [ ] Client dashboard
- [ ] Contact forms
- [ ] Newsletter management
- [ ] Policy generator
- [ ] Security scanner

## Environment Variables

Required environment variables (see `.env.local.example`):

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `POSTGRES_URL` - Vercel Postgres connection URL
- `NEXT_PUBLIC_APP_URL` - Application URL

Optional:
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `ELEVENLABS_API_KEY` - ElevenLabs API key for text-to-speech
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics ID

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository in Vercel
3. Configure environment variables
4. Deploy

```bash
# Or use Vercel CLI
vercel
```

### Manual Deployment

```bash
npm run build
npm run start
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Write tests
4. Run linting and tests
5. Submit a pull request

## License

Proprietary - CesiumCyber

## Support

For support, email support@cesiumcyber.com
