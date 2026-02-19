# CreatorKit MVP

Nuxt 4.3 + Supabase + Drizzle ORM (PostgreSQL) + Pinia + Instagram Graph API + TikTok API

## Structure

- `app/` - Pages, composables, components (by feature), stores (Pinia), middleware, plugins
- `app/components/analytics/` - EngagementChart, GrowthCard, etc.
- `app/components/creator/` - CreatorCard, CreatorGrid
- `app/components/mediakit/` - MediaKitPreview, MediaKitPDF
- `app/composables/` - useCreatorAnalytics, useMediaKit
- `server/api/` - Nitro routes: auth/*, instagram/*, tiktok/*, creators/*, mediakit/*, telegram/*
- `server/utils/` - instagram.ts, tiktok.ts, supabase.ts (API wrappers)
- `server/tasks/` - Cron jobs (sync-analytics, refresh-tokens, daily-digest)
- `shared/types/` - creator.ts, analytics.ts, mediakit.ts
- `supabase/migrations/` - SQL migrations

## Key Patterns

- `defineEventHandler` + Supabase auth for protected API routes
- `Pinia` stores for shared state (auth, analytics, creators, mediakit)
- Supabase RLS on all tables — server uses `service_role` for cron jobs
- OAuth flows: Instagram (Meta Business Login) + TikTok Login Kit
- Token encryption: AES-256-GCM via `NUXT_TOKEN_ENCRYPTION_KEY`
- Drizzle ORM with `eq()`, `and()`, `desc()` query builders (PostgreSQL)
- Nuxt UI v4 components (UButton, UInput, UCard, UModal, etc.)
- i18n: 3 languages (UZ default, RU, EN) via @nuxtjs/i18n with URL prefix
- SSR strategy: Landing=SSG, Creator profiles=SSR+ISR, Dashboard=CSR

## Commands

- Dev: `pnpm dev` (run in tmux)
- Build: `pnpm build`
- Typecheck: `pnpm typecheck`
- DB push: `pnpm db:push`
- DB studio: `pnpm db:studio`

## Database Tables (Supabase PostgreSQL)

- `profiles` - User profiles (username, niche[], language[], city, country, is_public)
- `social_accounts` - Connected platforms (instagram, tiktok) with encrypted tokens
- `analytics_snapshots` - Daily analytics (followers, ER, demographics, top_posts)
- `media_kits` - Media kit config + PDF generation history
- `creator_categories` - Lookup table (slug, name_uz, name_ru, name_en)

## API Endpoints

- Auth: signup, login, Google OAuth, logout
- Instagram: connect, callback, sync, disconnect
- TikTok: connect, callback, sync
- Creators: directory listing (public), profile by username (public)
- Media Kit: get, update, generate PDF, public view
- Telegram: webhook (grammY bot)

## Environment Variables

- `NUXT_SUPABASE_URL`, `NUXT_SUPABASE_KEY` - Supabase connection
- `SUPABASE_SERVICE_ROLE_KEY` - Server-only service role
- `NUXT_META_APP_ID`, `NUXT_META_APP_SECRET` - Instagram/Meta OAuth
- `NUXT_TIKTOK_CLIENT_KEY`, `NUXT_TIKTOK_CLIENT_SECRET` - TikTok OAuth
- `NUXT_TOKEN_ENCRYPTION_KEY` - AES-256-GCM for token encryption
- `NUXT_TELEGRAM_BOT_TOKEN` - Telegram bot
- `NUXT_PUBLIC_APP_URL` - Public app URL

## Key Modules

@nuxt/ui v4, @nuxtjs/supabase, @nuxtjs/i18n, @nuxtjs/seo, nuxt-security, @sentry/nuxt, drizzle-orm, zod, grammy, chart.js + vue-chartjs
