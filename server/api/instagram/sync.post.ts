import { socialAccounts, analyticsSnapshots } from '~~/server/database/schema'
import { eq, and } from 'drizzle-orm'
import { db } from '~~/server/utils/db'
import { decrypt } from '~~/server/utils/encryption'
import { fetchInstagramInsights } from '~~/server/utils/instagram'

export default defineEventHandler(async (event) => {
  const user = (event.context as any).user
  if (!user?.id) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const accounts = await db.select().from(socialAccounts)
    .where(and(
      eq(socialAccounts.profileId, user.id),
      eq(socialAccounts.platform, 'instagram'),
      eq(socialAccounts.isConnected, true),
    ))
    .limit(1)

  const account = accounts[0]
  if (!account || !account.accessToken) {
    throw createError({ statusCode: 404, message: 'Instagram not connected' })
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
    .set({
      followersCount: insights.followersCount,
      lastSyncedAt: new Date(),
    })
    .where(eq(socialAccounts.id, account.id))

  return { success: true, snapshot: { date: today, ...insights } }
})
