# Installation Instructions

## Step 1: Navigate to Project Directory

```bash
cd C:\Users\sysadmin\cesium-cyber-nextjs
```

## Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages. It may take 2-5 minutes.

## Step 3: Configure Environment Variables

Edit the `.env.local` file that has been created for you:

```bash
# Open in your editor
code .env.local
# or
notepad .env.local
```

**Required:** Add your Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL` - From Supabase project settings
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - From Supabase project settings
- `SUPABASE_SERVICE_ROLE_KEY` - From Supabase project settings (API > Service Role Key)

**Optional:** Add other API keys if you have them:
- `OPENAI_API_KEY` - For AI features
- `ELEVENLABS_API_KEY` - For text-to-speech
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - For Google Analytics

## Step 4: Start Development Server

```bash
npm run dev
```

The app will start on http://localhost:3000

## Step 5: Verify Installation

Open http://localhost:3000 in your browser. You should see:
- CesiumCyber homepage
- Hero section with gold branding
- Four feature cards
- Responsive design

## Step 6: Run Tests (Optional)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## Troubleshooting

### Problem: npm install fails
**Solution:** Make sure you have Node.js 18+ installed
```bash
node --version  # Should be v18.0.0 or higher
```

### Problem: Environment validation error
**Solution:** Make sure all required variables in `.env.local` are filled in:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

### Problem: Port 3000 already in use
**Solution:** Use a different port
```bash
npm run dev -- -p 3001
```

## What's Next?

Once installed and running:

1. **Explore the codebase** - Check out the organized folder structure
2. **Read the docs** - See `GETTING_STARTED.md` for next steps
3. **Start migrating** - Begin moving features from the old project
4. **Deploy to Vercel** - When ready, deploy with `vercel`

## Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server

# Testing
npm run test            # Run unit tests
npm run test:e2e        # Run E2E tests

# Linting
npm run lint            # Check for code issues

# Database (when set up)
npm run db:push         # Push schema to database
npm run db:studio       # Open Drizzle Studio
```

## Need Help?

Check these files in order:
1. `PROJECT_SUMMARY.md` - What has been built
2. `GETTING_STARTED.md` - Detailed guide
3. `README.md` - Full documentation

---

**Estimated Time:** 10-15 minutes for full installation and setup
