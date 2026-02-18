# Cesium Platform Redesign — Design Document

## Vision

Transform Cesium from a cybersecurity consultancy website into a consumer-facing security platform. The core idea: **enterprise-grade protection, for everyone.**

Businesses pay $50K+ for the kind of security testing and threat intelligence that Cesium will offer for free (basic tier) or $9/mo (full). Regular people — not just CISOs — can protect themselves with the same tools used by Fortune 500 security teams.

### Inspirations

- **intuitive.ai** — cinematic visuals, bold typography, AI-forward branding, premium vibe
- **delivr.to** — purple team payload testing platform; we democratize this for individuals
- **HaveIBeenPwned** — viral because anyone can use it; personal and shareable

### Success Metric

Viral traffic. People share tools and results organically on social media, Reddit, Slack, and LinkedIn. The shareable scorecard is the growth engine.

---

## Audience

**Primary (traffic engine):** Individuals who care about their personal security. Non-technical. They want to know "am I safe?" and share the result.

**Secondary (revenue engine):** Small-to-mid businesses and enterprise clients who see the authority and convert into consulting engagements.

The homepage defaults to the personal experience. Business/enterprise is accessible via navigation but is not the first thing visitors see.

---

## Phase 1 — Launch (Build Now)

### 1.1 Visual Overhaul

Complete redesign of the site's look and feel. Move from corporate cybersecurity (navy cards, shield icons, compliance badges) to cinematic and premium.

**Color palette:**
- Background: true black (#000000) to charcoal (#0A0A0A), not navy
- Text: white (#FFFFFF) and gray-400 (#9CA3AF)
- Primary accent: electric violet (#8B5CF6) or cyan (#06B6D4) — one color used sparingly
- Danger: warm red (#EF4444) / orange (#F97316) for security warnings
- Success: emerald (#10B981) for "you're safe" states only

**Typography:**
- Headlines: 80-120px on desktop. Clean geometric sans-serif (Inter or Geist). Massive, confident, breathing.
- Body: 16-18px Inter. Generous line height (1.6-1.75).
- No clutter. No badge strips. Whitespace is a feature.

**Visual effects:**
- Full-viewport WebGL particle canvas (React Three Fiber) as hero background
- Particles form abstract shapes — not literal shields or locks
- Subtle mouse-tracking reactivity
- Glassmorphic cards: backdrop-blur, thin borders, floating over the canvas
- Smooth scroll-triggered section reveals (Framer Motion)
- The particle visualization persists through scroll, subtly transforming per section

**Fonts:**
- Keep Inter (body) — already loaded
- Consider switching Space Grotesk → Geist Sans or Satoshi for display — sharper, more modern
- Alternatively keep Space Grotesk if it tests well at large sizes

**Tech:** React Three Fiber (`@react-three/fiber`, `@react-three/drei`) for WebGL. Framer Motion for scroll animations (already installed). CSS backdrop-filter for glassmorphism.

### 1.2 Homepage — Single Scroll Experience

The entire homepage is one continuous flow. No card grids.

**Above the fold:**
```
[Full-viewport black canvas with particle visualization]

    Enterprise security.
    For everyone.

    Free tools. No signup. Enterprise grade.

    [  Enter your email address  ] [Scan →]
```

**Email verification flow:**
1. User enters email
2. We send a 6-digit verification code via Resend
3. Input transforms: "Enter the code we sent to you@example.com"
4. User enters code → verified → scan begins
5. Code expires in 10 minutes, max 3 attempts
6. After verification, cache verified status for 24 hours (localStorage)

**Verification storage (Supabase):**
```sql
email_verifications (
  id uuid primary key,
  email text not null,
  code text not null,
  expires_at timestamptz not null,
  attempts int default 0,
  verified boolean default false,
  created_at timestamptz default now()
)
```

**Scan flow (after verification):**
- Particles react — scatter and reform around a scan visualization
- Run checks in parallel:
  - Breach exposure (HaveIBeenPwned API)
  - Email domain authentication (reuse `email-security/dns-checker.ts` — SPF/DKIM/DMARC)
  - Domain security headers (reuse `security-headers/header-checker.ts` if domain has a website)
- Results appear as floating glassmorphic cards with animation
- Overall grade: A-F with risk score
- Shareable scorecard: "Your security score: B+ — better than 71% of users"

**Shareability:**
- Auto-generated OG image via Next.js `ImageResponse` API (or `/api/og` route)
- Unique URL per result: `/scan/[hash]`
- One-click copy link
- Twitter/LinkedIn share buttons with pre-filled text

**Below the fold (scroll sections):**

1. **"This Week's Top Threats"** — 3 trending attack technique cards
2. **"Can You Spot the Phish?"** — interactive challenge teaser with CTA
3. **"Free Security Tools"** — the existing tools, redesigned with new aesthetic
4. **"For Businesses"** — enterprise path (services, industries, consulting CTA)

### 1.3 Threat Feed — "This Week in Attacks"

A visual, shareable threat intelligence feed. Not a blog — an interactive breakdown of real attack techniques, translated for regular people.

**Each threat entry:**
- Bold title: "QR Code Phishing is Surging — Here's How It Works"
- Visual step-by-step: animated attack flow diagram (attacker → email → victim → payload)
- Difficulty rating (Beginner / Intermediate / Advanced)
- Target audience: Individuals, Small Business, Enterprise
- "Would this get past your defenses?" — CTA to scan tool
- 2-3 plain-English mitigation actions
- Shareable page with own OG image

**Content sources:**
- Sublime Security rules taxonomy (864 rules, MIT licensed, already reviewed)
- delivr.to's monthly top 10 payloads (public blog posts)
- CISA alerts and advisories
- Public phishing report databases

**Update cadence:** Weekly. Each post is its own page for SEO.

**Tech:**
- Content as structured data files (JSON or MDX):
  ```typescript
  interface ThreatEntry {
    id: string;
    title: string;
    slug: string;
    summary: string;
    date: string;
    category: 'phishing' | 'malware' | 'social-engineering' | 'credential-theft' | 'supply-chain';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    targets: ('individuals' | 'small-business' | 'enterprise')[];
    steps: { title: string; description: string; icon: string }[];
    mitigations: string[];
    relatedTool?: string; // link to a Cesium tool
  }
  ```
- Rendered as Next.js pages: `/threats/[slug]`
- Feed page at `/threats` with filters by category and difficulty
- RSS feed for subscribers

### 1.4 "Spot the Phish" — Interactive Challenges

Gamified phishing detection. The viral centerpiece.

**User experience:**
1. See a realistic email rendered in a fake inbox UI
2. Email contains embedded red flags (lookalike domain, mismatched reply-to, urgency language, suspicious link, encoding tricks)
3. Click on elements you think are suspicious
4. Submit → reveal all flags with plain-English explanations
5. Score: "You caught 4 of 7 red flags — 57%"
6. Shareable result: "I scored 57% on Cesium's phishing challenge. Can you beat me?"

**Challenge structure:**
```typescript
interface PhishingChallenge {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  email: {
    from: { name: string; address: string };
    to: { name: string; address: string };
    subject: string;
    date: string;
    body: string; // HTML
    headers?: Record<string, string>;
  };
  redFlags: {
    id: string;
    element: string; // CSS selector or region identifier
    category: string;
    description: string;
    explanation: string;
    severity: 'low' | 'medium' | 'high';
  }[];
}
```

**Tech:**
- Pure client-side rendering
- Challenge data as JSON files in `/src/data/challenges/`
- Fake inbox UI as a React component (styled to look like a real email client)
- Scoring is instant, no backend needed
- OG image generation for shareable results
- New challenges weekly, tied to threat feed content

**Reuse:** The `email-headers/` analysis library already detects these patterns. We invert it — instead of analyzing unknown headers, we craft emails with known red flags and test human detection.

**Routes:**
- `/challenges` — list of all challenges
- `/challenges/[id]` — individual challenge
- `/challenges/[id]/result` — shareable result page

### 1.5 Existing Tools — Redesigned

All six existing tools get the new visual treatment but keep their functionality:

- Threat Intelligence Analyzer → dark theme, glassmorphic inputs
- Password Strength Tester → dark theme, animated strength visualization
- Email Security Checker → dark theme, grade cards with glow effects
- Email Header Analyzer → dark theme, timeline visualization upgrades
- Website Security Headers Scanner → dark theme, radar-chart style results
- Compliance Readiness Quiz → dark theme, progress rings

Each tool gets a shareable OG image for its results.

### 1.6 Navigation Restructure

**Current:** Services | Industries | Resources | Company
**New:**

```
[Cesium logo]    Scan    Tools    Threats    Challenges    [For Business ▾]    [Sign In]
```

- **Scan** — the homepage email scan
- **Tools** — free security tools
- **Threats** — weekly threat feed
- **Challenges** — Spot the Phish game
- **For Business** (dropdown) — Services, Industries, About, Contact
- **Sign In** — Phase 2 (greyed out or hidden initially)

### 1.7 API Routes (New)

```
POST /api/verify/send     — Send verification code to email
POST /api/verify/check    — Validate code, return verified token
POST /api/scan/email      — Run combined email security scan
GET  /api/og/scan/[hash]  — Generate OG image for scan result
GET  /api/og/challenge/[id] — Generate OG image for challenge result
GET  /api/threats/feed     — RSS feed for threat entries
```

### 1.8 Database Schema (Supabase)

```sql
-- Email verification codes
create table email_verifications (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  code char(6) not null,
  expires_at timestamptz not null,
  attempts int default 0,
  verified boolean default false,
  created_at timestamptz default now()
);

-- Scan results (for shareable URLs)
create table scan_results (
  id uuid primary key default gen_random_uuid(),
  hash char(12) unique not null,
  email_domain text not null, -- never store full email
  breach_count int,
  spf_status text,
  dkim_status text,
  dmarc_status text,
  headers_grade char(1),
  overall_grade char(1),
  overall_score int,
  percentile int,
  created_at timestamptz default now()
);

-- Aggregate stats (for "better than X% of users")
create table scan_stats (
  id serial primary key,
  score int not null,
  created_at timestamptz default now()
);
```

Note: We NEVER store full email addresses in scan_results — only the domain. The email is only stored temporarily in email_verifications and purged after 24h.

---

## Phase 2 — Accounts & Retention

- User accounts via Supabase Auth (email/password + Google + Microsoft OAuth)
- Personal security dashboard: scan history, score trends over time
- Save challenge scores, track improvement
- Weekly email digest: new threats + your score changes
- Leaderboards for phishing challenges
- Notification when new threats match your domain's vulnerabilities

---

## Phase 3 — Full Payload Testing Platform

- Domain verification: DNS TXT record (`cesium-verify=abc123`) or OAuth workspace admin
- Connect Gmail/O365 inbox via OAuth (send + read permissions)
- Benign payload library: start with 20-30 techniques, grow to 600+
  - HTML smuggling, macro docs, QR phishing, callback phishing, archive smuggling, PDF exploits, reply-chain hijacking, lookalike domains, credential harvesting
- Automated delivery: send payloads → check delivery status → report
- Defense score: A-F per category, comparison to other users/industries
- Paid tiers: Free (Quick Scan — 5 payloads), $9/mo personal (full library), $49/mo business (team dashboard, API access)

---

## Technical Decisions

### What We Reuse
- **Next.js 15 + App Router** — keep the framework
- **Supabase** — auth (Phase 2), database (Phase 1 for verification + scan results)
- **Resend** — email verification codes + future digest emails
- **`email-security/dns-checker.ts`** — SPF/DKIM/DMARC checks for scan
- **`security-headers/header-checker.ts`** — headers check for scan
- **`email-headers/`** — analysis engine for challenges + header analyzer tool
- **`password-analyzer.ts`** — password tool
- **`compliance/quiz-data.ts`** — compliance tool
- **`ai/`** — AI providers for future threat analysis features
- **`rate-limit.ts`** — API rate limiting
- **Framer Motion** — scroll animations, page transitions
- **React Query** — data fetching for scan results
- **Zod** — validation for all API inputs
- **Lucide React** — icons

### What We Add
- **`@react-three/fiber` + `@react-three/drei`** — WebGL particle visualization
- **HaveIBeenPwned API** — breach exposure checks
- **Supabase client setup** — move from devDependency to production, create client helpers
- **OG image generation** — Next.js `ImageResponse` or `@vercel/og`

### What We Change
- **Tailwind config** — new color palette (black/charcoal base, violet or cyan accent)
- **Root layout** — new fonts if switching from Space Grotesk
- **Navbar** — complete redesign for new nav structure
- **Footer** — simplified, matches new dark aesthetic
- **All page components** — visual redesign with new design system

### What We Remove
- Navy-800/900 color scheme
- Corporate card-grid layouts
- Trust badges above the fold ("500+ businesses protected")
- Shield/lock iconography as primary visual language

---

## Implementation Order

1. **New design system** — Tailwind config, colors, typography, glassmorphic component primitives
2. **Particle canvas component** — React Three Fiber hero visualization
3. **Email verification API** — `/api/verify/send` + `/api/verify/check` + Supabase table
4. **Combined scan API** — breach check + email auth + headers → unified score
5. **Scan results + OG images** — shareable URLs + auto-generated social cards
6. **Homepage rebuild** — hero with scan flow + scroll sections
7. **Threat feed** — data structure, pages, first 5-10 entries
8. **Spot the Phish** — challenge engine, fake inbox UI, scoring, first 5 challenges
9. **Existing tools reskin** — apply new design to all 6 tools
10. **Navigation + layout** — new navbar, footer, page transitions
11. **For Business section** — services, industries, about, contact with new design

---

## Privacy & Security Considerations

- Email addresses are used only for verification; never stored permanently in scan results
- Verification codes are purged after 24 hours
- Scan results store only the domain, not the full email address
- All client-side tools (password tester, header analyzer, phishing challenges) process data locally — nothing sent to servers
- HaveIBeenPwned API is called server-side to avoid exposing the API key
- Rate limiting on all API endpoints
- CSP headers updated for WebGL (canvas) and any new external resources
