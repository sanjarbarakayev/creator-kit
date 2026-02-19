# CreatorKit - Global Context

This file is read by Claude at session start. Keep it concise and up-to-date.

---

## Project Overview

**What:** Creator analytics platform for Instagram/TikTok influencers in Uzbekistan
**Framework:** Nuxt 4.3 with Nuxt UI v4 (app/ directory structure)
**Target Users:** Content creators, influencers, brands looking for creators

---

## Architecture

```
creatorkit/
├── app/
│   ├── pages/              # Nuxt pages (landing, auth, dashboard, creators, settings)
│   ├── composables/        # Shared logic (useCreatorAnalytics, useMediaKit)
│   ├── components/         # Vue SFCs by feature
│   │   ├── analytics/      # EngagementChart, GrowthCard, etc.
│   │   ├── creator/        # CreatorCard, CreatorGrid
│   │   ├── mediakit/       # MediaKitPreview, MediaKitPDF
│   │   └── ui/             # App-level UI overrides
│   ├── stores/             # Pinia stores (auth, analytics, creators, mediakit)
│   ├── middleware/          # Route guards (auth)
│   ├── layouts/            # default (auth required), public
│   └── plugins/
│
├── server/
│   ├── api/
│   │   ├── auth/           # Signup, login, Google OAuth, callback, logout
│   │   ├── instagram/      # OAuth connect, callback, sync, disconnect
│   │   ├── tiktok/         # OAuth connect, callback, sync
│   │   ├── creators/       # Directory listing, public profile
│   │   ├── mediakit/       # CRUD, PDF generate, public view
│   │   └── telegram/       # Bot webhook (grammY)
│   ├── utils/
│   │   ├── instagram.ts    # IG Graph API wrapper
│   │   ├── tiktok.ts       # TT API wrapper
│   │   └── supabase.ts     # Server-side Supabase client
│   └── tasks/
│       └── sync-analytics.ts  # Cron: daily analytics sync
│
├── shared/
│   ├── types/              # creator.ts, analytics.ts, mediakit.ts
│   └── utils/
│
├── supabase/
│   └── migrations/         # SQL migrations
│
└── nuxt.config.ts
```

**Key files:**
- `supabase/migrations/` - Database schema (PostgreSQL via Drizzle ORM)
- `shared/types/` - Shared TypeScript types
- `server/utils/instagram.ts` - Instagram Graph API wrapper
- `server/utils/tiktok.ts` - TikTok API wrapper
- `app/stores/` - Pinia stores for analytics, creators, media kits

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Supabase over custom backend | Auth, RLS, Storage, Edge Functions — no backend to maintain |
| Drizzle ORM + PostgreSQL | Type-safe, works well with Supabase |
| Nuxt UI v4 | 110+ components, free, Nuxt 4 optimized |
| Pinia + useState | SSR-compatible state management |
| grammY for Telegram | TypeScript-first, webhook mode with Nuxt server routes |
| AES-256-GCM token encryption | Secure storage of OAuth tokens in DB |
| ISR for creator profiles | SEO + performance (1 hour cache) |
| i18n with URL prefix | /uz/, /ru/, /en/ for 3 languages |

---

## Tech Stack

- **Framework:** Nuxt 4.3 (Vue 3, TypeScript)
- **Database:** Supabase (PostgreSQL) via Drizzle ORM
- **UI:** Nuxt UI v4 + Tailwind CSS v4
- **State:** Pinia stores
- **Auth:** Supabase Auth (email, Google OAuth)
- **APIs:** Instagram Graph API, TikTok API
- **Bot:** Telegram (grammY framework)
- **PDF:** @react-pdf/renderer or Puppeteer
- **Charts:** chart.js + vue-chartjs
- **i18n:** @nuxtjs/i18n (UZ, RU, EN)
- **Package manager:** pnpm

---

## Database

Tables (Supabase PostgreSQL via Drizzle):
- `profiles` - User profiles linked to Supabase Auth (username, niche[], language[], city, is_public)
- `social_accounts` - Connected Instagram/TikTok accounts with encrypted OAuth tokens
- `analytics_snapshots` - Daily analytics (followers, ER, demographics, top_posts) — UNIQUE per account+date
- `media_kits` - Media kit config, template choice, PDF URL, view/download counts
- `creator_categories` - Lookup table with multilingual names (uz, ru, en)

RLS enabled on all tables. Server uses `service_role` key for cron jobs.

---

## Current State

**Phase:** Sprint 0 — Project setup
**Stack:** Nuxt 4.3 + Supabase + Drizzle ORM

**Sprint Plan:**
- Sprint 0 (Week 1): Nuxt 4 setup, Supabase init, DB migrations, Auth
- Sprint 1 (Week 2-3): Instagram OAuth + Graph API + Analytics sync
- Sprint 2 (Week 4-5): Dashboard UI, charts, top posts
- Sprint 3 (Week 6-7): Media Kit editor, templates, PDF generation
- Sprint 4 (Week 8-9): Creator directory (SSR), filters, public profiles, onboarding
- Sprint 5 (Week 10): Telegram bot, cron jobs, daily digest
- Sprint 6 (Week 11-12): Landing page, SEO, i18n, polish, beta launch

---

*Last updated: February 2026*
