# CreatorKit Architecture

## Overview

CreatorKit is a creator analytics platform built with Nuxt 4.3. Creators connect their Instagram/TikTok accounts, view analytics dashboards, generate media kits, and appear in a public creator directory.

---

## Application Structure

```
creatorkit/
├── app/
│   ├── pages/
│   │   ├── index.vue                 # Landing page (SSG)
│   │   ├── auth/
│   │   │   ├── login.vue             # Login/signup
│   │   │   └── callback.vue          # OAuth callback
│   │   ├── onboarding/
│   │   │   └── index.vue             # Post-signup onboarding
│   │   ├── dashboard/
│   │   │   ├── index.vue             # Analytics overview
│   │   │   ├── instagram.vue         # IG detailed analytics
│   │   │   ├── tiktok.vue            # TT detailed analytics
│   │   │   └── mediakit.vue          # Media Kit editor
│   │   ├── creators/
│   │   │   ├── index.vue             # Creator directory (SSR)
│   │   │   └── [username].vue        # Public creator profile (SSR+ISR)
│   │   └── settings/
│   │       └── index.vue             # Profile settings
│   │
│   ├── stores/
│   │   ├── auth.ts                   # Auth state + Supabase session
│   │   ├── analytics.ts              # Analytics data + snapshots
│   │   ├── creators.ts               # Creator directory + filters
│   │   └── mediakit.ts               # Media kit config + generation
│   │
│   ├── components/
│   │   ├── analytics/                # Charts, cards, growth indicators
│   │   │   ├── EngagementChart.vue
│   │   │   ├── GrowthCard.vue
│   │   │   ├── TopPostsGrid.vue
│   │   │   └── PlatformSummary.vue
│   │   ├── creator/                  # Directory and profile
│   │   │   ├── CreatorCard.vue
│   │   │   ├── CreatorGrid.vue
│   │   │   └── CreatorFilters.vue
│   │   ├── mediakit/                 # Media kit editor and preview
│   │   │   ├── MediaKitPreview.vue
│   │   │   ├── MediaKitEditor.vue
│   │   │   └── TemplateSelector.vue
│   │   └── ui/                       # App-level UI overrides
│   │
│   ├── composables/
│   │   ├── useCreatorAnalytics.ts    # Analytics data fetching + formatting
│   │   └── useMediaKit.ts            # Media kit operations
│   │
│   ├── middleware/
│   │   └── auth.ts                   # Supabase auth guard
│   │
│   └── layouts/
│       ├── default.vue               # App layout (auth required)
│       └── public.vue                # Public pages (profiles, landing)
│
├── server/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signup.post.ts        # Email/password registration
│   │   │   ├── login.post.ts         # Login
│   │   │   ├── google.get.ts         # Google OAuth redirect
│   │   │   ├── callback.get.ts       # OAuth callback handler
│   │   │   └── logout.post.ts        # Logout
│   │   ├── instagram/
│   │   │   ├── connect.get.ts        # Meta Business Login redirect
│   │   │   ├── callback.get.ts       # OAuth callback, token storage
│   │   │   ├── sync.post.ts          # Pull analytics from Graph API
│   │   │   └── disconnect.delete.ts  # Remove connection
│   │   ├── tiktok/
│   │   │   ├── connect.get.ts        # TikTok Login Kit OAuth
│   │   │   ├── callback.get.ts       # OAuth callback
│   │   │   └── sync.post.ts          # Pull TikTok stats
│   │   ├── creators/
│   │   │   ├── index.get.ts          # Directory: filter, search, paginate
│   │   │   └── [username].get.ts     # Public profile + analytics summary
│   │   ├── mediakit/
│   │   │   ├── index.get.ts          # Get own media kit
│   │   │   ├── index.put.ts          # Update media kit config
│   │   │   ├── generate.post.ts      # Generate PDF
│   │   │   └── [id]/view.get.ts      # Public view + counter
│   │   └── telegram/
│   │       └── webhook.post.ts       # grammY bot webhook
│   │
│   ├── utils/
│   │   ├── instagram.ts              # IG Graph API wrapper
│   │   ├── tiktok.ts                 # TT API wrapper
│   │   ├── supabase.ts               # Server-side Supabase client
│   │   └── encryption.ts             # AES-256-GCM token encrypt/decrypt
│   │
│   └── tasks/
│       ├── sync-instagram.ts         # Cron: daily IG analytics (03:00 UTC)
│       ├── sync-tiktok.ts            # Cron: daily TT analytics (04:00 UTC)
│       ├── refresh-tokens.ts         # Cron: refresh expiring tokens (6h)
│       └── daily-digest.ts           # Cron: Telegram digest (09:00 UZT)
│
├── shared/
│   ├── types/
│   │   ├── creator.ts                # Profile, SocialAccount types
│   │   ├── analytics.ts              # Snapshot, demographics types
│   │   └── mediakit.ts               # MediaKit, template types
│   └── utils/
│
└── supabase/
    └── migrations/                   # SQL migrations
```

---

## Key Patterns

### 1. Instagram OAuth Flow

```
1. User clicks "Connect Instagram"
2. Server redirects to Meta Business Login URL
3. User grants permissions (instagram_basic, instagram_manage_insights, pages_show_list)
4. Meta sends code to /api/instagram/callback
5. Server exchanges code for access_token -> long-lived token (60 days)
6. Token encrypted (AES-256-GCM) and saved to social_accounts
7. Initial analytics sync triggered
```

### 2. Analytics Snapshot System

Daily cron jobs pull data from platform APIs and store snapshots:
```
Cron (03:00 UTC) -> For each connected IG account:
  -> /me (followers, following, media_count)
  -> /me/insights (reach, impressions, profile_views)
  -> /me/media (last 12 posts for ER calculation)
  -> /me/insights (demographics)
  -> INSERT analytics_snapshots (one per account per day)
```

UNIQUE constraint: `(social_account_id, snapshot_date)` prevents duplicates.

### 3. Pinia Store Pattern

```typescript
export const useAnalyticsStore = defineStore('analytics', () => {
  const snapshots = ref<AnalyticsSnapshot[]>([])
  const loading = ref(false)

  const latestSnapshot = computed(() => snapshots.value[0] ?? null)
  const growthRate = computed(() => latestSnapshot.value?.growth_rate ?? 0)

  async function fetchSnapshots(accountId: string, days: number) {
    loading.value = true
    try {
      snapshots.value = await $fetch(`/api/analytics/${accountId}`, {
        params: { days }
      })
    } finally {
      loading.value = false
    }
  }

  return { snapshots, loading, latestSnapshot, growthRate, fetchSnapshots }
})
```

### 4. API Route Pattern (Supabase Auth)

```typescript
export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401 })

  const body = await readBody(event)
  // Validate with Zod
  const result = await db.insert(table).values(data).returning()
  return result
})
```

### 5. Token Encryption

```typescript
// server/utils/encryption.ts
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY = Buffer.from(process.env.NUXT_TOKEN_ENCRYPTION_KEY!, 'hex')

export function encrypt(text: string): string { ... }
export function decrypt(encrypted: string): string { ... }
```

### 6. Media Kit Generation

Creator configures -> live preview -> PDF generation:
- Template selection: minimal, professional, creative
- Toggle analytics visibility
- Custom tagline, portfolio URLs, pricing tiers
- PDF stored in Supabase Storage, URL saved to media_kits table

---

## Data Flow

```
Platform APIs (IG/TT) -> Cron Jobs -> analytics_snapshots (DB)
                                          |
User Dashboard <- Pinia Store <- $fetch('/api/...') <- Drizzle ORM <- Supabase PostgreSQL

Creator Directory (SSR) <- /api/creators <- profiles + analytics_snapshots (aggregated)

Public Profile (SSR+ISR) <- /api/creators/[username] <- profile + latest snapshot
```

---

## Auth System

Using Supabase Auth:
- Email/password signup + login
- Google OAuth
- Server-side: `serverSupabaseClient(event)` + `serverSupabaseUser(event)`
- Client-side: `useSupabaseClient()` + `useSupabaseUser()`
- RLS policies enforce row-level access on all tables

---

## SSR/SSG Strategy

| Page | Strategy | Reason |
|------|----------|--------|
| Landing `/` | SSG | Fast initial load |
| Auth pages | CSR | No SEO needed |
| Dashboard | CSR | Private data, real-time |
| Creator directory `/creators` | SSR | SEO, filterable |
| Creator profile `/creators/[user]` | SSR + ISR (1h cache) | SEO + performance |
| Settings | CSR | Private |

---

*Last updated: February 2026*
