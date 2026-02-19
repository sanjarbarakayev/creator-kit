# Common Patterns

## API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}
```

## API Route Pattern (Supabase Auth)

```typescript
// server/api/example.get.ts
export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const results = await db.select().from(table).where(eq(table.profileId, user.id))
  return { success: true, data: results }
})
```

## Public API Route Pattern

```typescript
// server/api/creators/index.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const filters = creatorFilterSchema.parse(query)

  const results = await db
    .select()
    .from(profiles)
    .where(eq(profiles.isPublic, true))
    .limit(filters.limit)
    .offset(filters.offset)

  return { success: true, data: results, meta: { total, page, limit } }
})
```

## Pinia Store Pattern

```typescript
export const useAnalyticsStore = defineStore('analytics', () => {
  const snapshots = ref<AnalyticsSnapshot[]>([])
  const loading = ref(false)

  const latestSnapshot = computed(() => snapshots.value[0] ?? null)

  async function fetchSnapshots(accountId: string, days = 30) {
    loading.value = true
    try {
      const data = await $fetch('/api/analytics', {
        params: { accountId, days }
      })
      snapshots.value = data
    } finally {
      loading.value = false
    }
  }

  return { snapshots, loading, latestSnapshot, fetchSnapshots }
})
```

## Vue Composable Pattern

```typescript
export function useDebounce<T>(value: Ref<T>, delay: number): Ref<T> {
  const debouncedValue = ref(value.value) as Ref<T>

  let timeout: ReturnType<typeof setTimeout>
  watch(value, (newVal) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      debouncedValue.value = newVal
    }, delay)
  })

  return debouncedValue
}
```

## Token Encryption Pattern

```typescript
// server/utils/encryption.ts
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY = Buffer.from(process.env.NUXT_TOKEN_ENCRYPTION_KEY!, 'hex')

export function encrypt(text: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv(ALGORITHM, KEY, iv)
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return [iv, tag, encrypted].map(b => b.toString('hex')).join(':')
}

export function decrypt(encoded: string): string {
  const [ivHex, tagHex, encHex] = encoded.split(':')
  const decipher = createDecipheriv(ALGORITHM, KEY, Buffer.from(ivHex, 'hex'))
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'))
  return decipher.update(Buffer.from(encHex, 'hex')) + decipher.final('utf8')
}
```

## Instagram API Wrapper Pattern

```typescript
// server/utils/instagram.ts
const BASE_URL = 'https://graph.instagram.com/v21.0'

export async function getProfile(accessToken: string) {
  return $fetch(`${BASE_URL}/me`, {
    params: {
      fields: 'id,username,name,biography,followers_count,follows_count,media_count',
      access_token: accessToken
    }
  })
}

export async function getInsights(accessToken: string, metric: string, period: string) {
  return $fetch(`${BASE_URL}/me/insights`, {
    params: { metric, period, access_token: accessToken }
  })
}
```

## Cron Job / Nuxt Task Pattern

```typescript
// server/tasks/sync-instagram.ts
export default defineTask({
  meta: { name: 'sync:instagram', description: 'Daily Instagram analytics sync' },
  async run() {
    const accounts = await db
      .select()
      .from(socialAccounts)
      .where(and(
        eq(socialAccounts.platform, 'instagram'),
        eq(socialAccounts.isConnected, true)
      ))

    for (const account of accounts) {
      const token = decrypt(account.accessToken!)
      const profile = await getProfile(token)
      await db.insert(analyticsSnapshots).values({
        socialAccountId: account.id,
        snapshotDate: new Date().toISOString().split('T')[0],
        followersCount: profile.followers_count,
        // ...
      })
    }
    return { result: `Synced ${accounts.length} accounts` }
  }
})
```

## Zod Validation Pattern

```typescript
import { z } from 'zod'

const creatorFilterSchema = z.object({
  niche: z.string().optional(),
  platform: z.enum(['instagram', 'tiktok', 'youtube', 'telegram']).optional(),
  minFollowers: z.coerce.number().min(0).optional(),
  maxFollowers: z.coerce.number().optional(),
  minEr: z.coerce.number().min(0).max(100).optional(),
  language: z.string().optional(),
  city: z.string().optional(),
  sort: z.enum(['followers', 'er', 'newest']).default('followers'),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
})
```
