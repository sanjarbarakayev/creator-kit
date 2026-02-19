# CreatorKit MVP Roadmap

Sprint-based timeline. 12 weeks total, ~15-20 hours/week.

---

## Summary

| Sprint | Weeks | Focus | Deliverable |
|--------|-------|-------|-------------|
| 0 | 1 | Setup | Boilerplate + Auth working |
| 1 | 2-3 | Instagram | IG connect + data sync working |
| 2 | 4-5 | Dashboard | Dashboard UI with charts |
| 3 | 6-7 | Media Kit | Media Kit creation + PDF export |
| 4 | 8-9 | Directory | Creator directory + public profiles |
| 5 | 10 | Automation | Telegram bot + cron jobs |
| 6 | 11-12 | Launch | Landing, SEO, i18n, beta launch |

---

## Sprint 0 - Foundation (Week 1)

**Goal:** Nuxt 4 boilerplate with auth working

- [ ] Nuxt 4.3 init with app/ directory structure
- [ ] Supabase project setup + local dev
- [ ] Drizzle ORM config for PostgreSQL
- [ ] DB migrations: profiles, social_accounts, analytics_snapshots, media_kits, creator_categories
- [ ] Nuxt UI v4 + Tailwind CSS v4 config
- [ ] Auth: email/password + Google OAuth via Supabase
- [ ] Auth middleware + layouts (default, public)
- [ ] Environment variables setup
- [ ] RLS policies on all tables

---

## Sprint 1 - Instagram Integration (Weeks 2-3)

**Goal:** Connect Instagram account and pull analytics

- [ ] Instagram OAuth flow (Meta Business Login)
- [ ] Token exchange: code -> access_token -> long-lived token
- [ ] Token encryption (AES-256-GCM) + storage
- [ ] Instagram Graph API wrapper (server/utils/instagram.ts)
- [ ] Sync endpoint: pull followers, insights, media, demographics
- [ ] Analytics snapshot creation (daily data point)
- [ ] Disconnect endpoint
- [ ] Error handling: expired tokens, rate limits, permission errors
- [ ] TikTok OAuth flow (stretch goal)

**IG API constraints:**
- Business/Creator account only (not personal)
- Facebook Page must be linked
- Rate limit: 200 calls/user/hour
- Demographics: 100+ followers required, top 45 segments only
- Insights may be delayed up to 48 hours

---

## Sprint 2 - Dashboard (Weeks 4-5)

**Goal:** Visual analytics dashboard

- [ ] Dashboard layout with overview cards
- [ ] Overview cards: total followers, avg ER, weekly growth, connected accounts
- [ ] Growth chart: follower growth (7/30/90 day filter) — chart.js
- [ ] Engagement chart: ER over time
- [ ] Top posts grid: best 6 posts with metrics
- [ ] Platform summary cards per connected account
- [ ] Quick actions: connect account, sync, create media kit
- [ ] Instagram detailed analytics page
- [ ] TikTok detailed analytics page (if Sprint 1 stretch completed)

---

## Sprint 3 - Media Kit (Weeks 6-7)

**Goal:** Create and export media kits as PDF

- [ ] Media kit editor page
- [ ] Template selection: minimal, professional, creative
- [ ] Editable fields: tagline, portfolio URLs, pricing tiers
- [ ] Analytics toggle (show/hide specific metrics)
- [ ] Live preview component
- [ ] PDF generation endpoint (@react-pdf/renderer or Puppeteer)
- [ ] PDF storage in Supabase Storage
- [ ] Public media kit view page with view counter
- [ ] Download counter

---

## Sprint 4 - Creator Directory (Weeks 8-9)

**Goal:** Public directory with filters + SEO profiles

- [ ] Creator directory page (SSR)
- [ ] Filter by: niche, platform, follower range, ER, language, city
- [ ] Follower tiers: Nano (1K-10K), Micro (10K-50K), Mid (50K-500K), Macro (500K+)
- [ ] Sort by: followers, ER, newest
- [ ] Search by username/name
- [ ] Pagination
- [ ] Public creator profile page (SSR + ISR, 1h cache)
- [ ] Profile SEO: useHead() with dynamic meta tags
- [ ] Onboarding flow for new users
- [ ] Profile settings page

---

## Sprint 5 - Automation (Week 10)

**Goal:** Telegram bot and automated syncing

- [ ] Telegram bot setup (grammY + webhook)
- [ ] Bot commands: /start, /stats, /mediakit
- [ ] Daily digest: automated morning stats via Telegram
- [ ] Alert: ER spike or follower surge notification
- [ ] Cron: daily Instagram analytics sync (03:00 UTC)
- [ ] Cron: daily TikTok analytics sync (04:00 UTC)
- [ ] Cron: token refresh every 6 hours
- [ ] Cron: daily Telegram digest (09:00 UZT)

---

## Sprint 6 - Launch Prep (Weeks 11-12)

**Goal:** Polish and beta launch

- [ ] Landing page (SSG)
- [ ] SEO optimization: sitemap, robots, OG images
- [ ] i18n: O'zbek (default), Rus, Ingliz
- [ ] Mobile responsive pass (Nuxt UI default + fine-tuning)
- [ ] Error tracking: Sentry setup
- [ ] Performance: LCP < 2.5s (landing), TTFB < 1s (profiles), API < 500ms
- [ ] Bug fixes and edge cases
- [ ] Beta launch

---

## Definition of Done (MVP)

- [ ] User signs up (email or Google) and logs in
- [ ] Instagram Business/Creator account connects via OAuth
- [ ] Dashboard shows followers, ER, growth chart, top posts
- [ ] Analytics auto-update daily via cron
- [ ] Media Kit created, edited, exported as PDF
- [ ] Creator directory with filtering and search
- [ ] Public profiles are SEO-optimized (SSR)
- [ ] Telegram bot sends daily statistics
- [ ] 3 languages working (UZ, RU, EN)
- [ ] Mobile responsive

---

*Created: February 2026*
