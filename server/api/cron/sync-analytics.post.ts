import { socialAccounts, analyticsSnapshots } from '~~/server/database/schema'
import { eq, and } from 'drizzle-orm'

export async function syncAllAnalytics() {
  const accounts = await db.select().from(socialAccounts)
    .where(and(
      eq(socialAccounts.isConnected, true),
      eq(socialAccounts.platform, 'instagram'),
    ))

  const results: Array<{ accountId: string; success: boolean; error?: string }> = []

  for (const account of accounts) {
    try {
      if (!account.accessToken) {
        results.push({ accountId: account.id, success: false, error: 'No access token' })
        continue
      }

      const accessToken = decrypt(account.accessToken)
      const insights = await fetchInstagramInsights(account.platformUserId!, accessToken)
      const today = new Date().toISOString().split('T')[0]!

      await db.insert(analyticsSnapshots)
        .values({
          socialAccountId: account.id,
          snapshotDate: today,
          followersCount: insights.followersCount,
          followingCount: insights.followingCount,
          postsCount: insights.postsCount,
          avgLikes: String(insights.avgLikes),
          avgComments: String(insights.avgComments),
          avgViews: String(insights.avgViews),
          engagementRate: String(insights.engagementRate),
          topPosts: insights.topPosts,
        })
        .onConflictDoUpdate({
          target: [analyticsSnapshots.socialAccountId, analyticsSnapshots.snapshotDate],
          set: {
            followersCount: insights.followersCount,
            followingCount: insights.followingCount,
            postsCount: insights.postsCount,
            avgLikes: String(insights.avgLikes),
            avgComments: String(insights.avgComments),
            avgViews: String(insights.avgViews),
            engagementRate: String(insights.engagementRate),
            topPosts: insights.topPosts,
          },
        })

      await db.update(socialAccounts)
        .set({ followersCount: insights.followersCount, lastSyncedAt: new Date() })
        .where(eq(socialAccounts.id, account.id))

      results.push({ accountId: account.id, success: true })
    }
    catch (err: any) {
      results.push({ accountId: account.id, success: false, error: err.message })
    }
  }

  return { total: accounts.length, results }
}

// POST /api/cron/sync-analytics — manual trigger
export default defineEventHandler(async () => {
  // TODO: Add auth check (cron secret or admin only)
  const result = await syncAllAnalytics()
  return { success: true, ...result }
})
