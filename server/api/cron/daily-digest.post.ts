import { profiles, socialAccounts } from '~~/server/database/schema'
import { eq, and, isNotNull } from 'drizzle-orm'

export async function sendDailyDigest() {
  const bot = useTelegramBot()

  // Get all profiles with telegram_username
  const users = await db.select().from(profiles)
    .where(isNotNull(profiles.telegramUsername))

  const results: Array<{ profileId: string; success: boolean; error?: string }> = []

  for (const profile of users) {
    try {
      if (!profile.telegramUsername) continue

      const accounts = await db.select().from(socialAccounts)
        .where(and(
          eq(socialAccounts.profileId, profile.id),
          eq(socialAccounts.isConnected, true),
        ))

      const message = formatDigestMessage(
        profile.fullName ?? profile.username,
        accounts,
      )

      // We need the Telegram chat ID. Since we only have username,
      // we can't send proactively without storing chat_id from /start.
      // For now, skip users without stored chat — TODO: store chat_id on /start
      // This is a known limitation; for MVP we log the message.
      console.log(`[daily-digest] Would send to @${profile.telegramUsername}:`, message)

      results.push({ profileId: profile.id, success: true })
    }
    catch (err: any) {
      results.push({ profileId: profile.id, success: false, error: err.message })
    }
  }

  return { total: users.length, results }
}

// POST /api/cron/daily-digest — manual trigger
export default defineEventHandler(async () => {
  // TODO: Add auth check (cron secret or admin only)
  const result = await sendDailyDigest()
  return { success: true, ...result }
})
