# Email Header Analyzer — Design Document

## Overview

A client-side email header analysis tool that parses raw email headers and provides authentication verdicts, sender identity checks, routing analysis, and red flag detection with plain-English explanations.

All processing happens in the browser — no email content is sent to Cesium servers.

## Route

`/tools/email-header-analyzer`

## Files

| File | Purpose |
|------|---------|
| `src/app/tools/email-header-analyzer/page.tsx` | Tool page component |
| `src/lib/email-headers/header-parser.ts` | RFC 5322 header parser |
| `src/lib/email-headers/auth-analyzer.ts` | SPF/DKIM/DMARC result parser |
| `src/lib/email-headers/sender-analyzer.ts` | Sender identity checks |
| `src/lib/email-headers/routing-analyzer.ts` | Received header chain parser |
| `src/lib/email-headers/red-flags.ts` | Pattern-based red flag detection |
| `src/lib/email-headers/types.ts` | Shared TypeScript interfaces |
| `src/config/tools-config.ts` | Register new tool (update) |

## UX Flow

1. Landing: large textarea with "Paste your email headers here"
2. Helper accordion: how to get headers from Gmail, Outlook, Apple Mail, Yahoo
3. Click "Analyze Headers" — client-side processing
4. Results render in expandable cards below

## Analysis Modules

### A. Authentication Summary (top card)

Parse `Authentication-Results` header for:
- SPF result: pass / fail / softfail / neutral / none
- DKIM result: pass / fail / none (with signing domain)
- DMARC result: pass / fail / none

Overall verdict badge:
- "Fully Authenticated" (all pass)
- "Partially Authenticated" (some pass)
- "Failed Authentication" (SPF or DKIM fail)
- "No Authentication" (no auth headers found)

Each result gets a collapsible "What does this mean?" explanation.

### B. Sender Identity Check

Compare these headers for mismatches:
- `From` (display name + email)
- `Reply-To`
- `Return-Path` / `Envelope-From`

Detections:
- Display name vs email domain mismatch
- From vs Reply-To domain mismatch
- Lookalike domain detection (Levenshtein distance against common brands)
- Free email provider posing as organization

### C. Routing Path

Parse `Received` headers into a timeline:
- Each hop: server hostname, IP, timestamp
- Flag: unusual delays (>30min between hops)
- Flag: missing or malformed Received headers

Display as vertical timeline with newest on top.

### D. Red Flags

Pattern checks derived from Sublime Security's rule taxonomy:
- Bulk mail indicators: `X-Mailer`, `X-Campaignid`, `List-Unsubscribe`, `Precedence: bulk`
- Missing standard headers (`Message-ID`, `Date`, `MIME-Version`)
- Suspicious `X-Originating-IP`
- Known abused mail platforms in headers
- `X-MS-Exchange-Organization-AuthAs: Anonymous` (unauthenticated relay)
- Encoded/obfuscated header values

### E. Verdict + Lead CTA

Risk level: Low / Medium / High / Critical based on weighted scoring:
- Authentication failures: +30 risk
- Sender mismatches: +25 risk
- Red flags: +5-15 each
- Routing anomalies: +10 each

Score thresholds: 0-15 Low, 16-40 Medium, 41-70 High, 71+ Critical

Plain-English summary of top findings.

CTA card: "Want us to review your organization's email security?" → /contact

## Implementation Order

1. Types and interfaces (`types.ts`)
2. Header parser (`header-parser.ts`) — RFC 5322 parsing
3. Auth analyzer (`auth-analyzer.ts`)
4. Sender analyzer (`sender-analyzer.ts`)
5. Routing analyzer (`routing-analyzer.ts`)
6. Red flags detector (`red-flags.ts`)
7. Page component (`page.tsx`)
8. Register in tools config
9. Test with real email headers

## Design Patterns

- Match existing tool UX: navy-800/900 cards, sky-400 accents, grade badges
- Client-side only — no API route needed
- No external dependencies in parser library
- Collapsible sections for explanations (mobile-friendly)
- Quick example button with sample suspicious headers for demo
