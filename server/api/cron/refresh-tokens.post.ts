import { socialAccounts } from '~~/server/database/schema'
import { eq, and, lt, isNotNull } from 'drizzle-orm'

export async function refreshExpiringTokens() {
  const sevenDaysFromNow = new Date()
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

  const accounts = await db.select().from(socialAccounts)
    .where(and(
      eq(socialAccounts.isConnected, true),
      isNotNull(socialAccounts.tokenExpiresAt),
      lt(socialAccounts.tokenExpiresAt, sevenDaysFromNow),
    ))

  const results: Array<{ accountId: string; platform: string; success: boolean; error?: string }> = []

  for (const account of accounts) {
    try {
      if (account.platform === 'instagram') {
        if (!account.accessToken) {
          results.push({ accountId: account.id, platform: account.platform, success: false, error: 'No access token' })
          continue
        }
        const currentToken = decrypt(account.accessToken)
        const refreshed = await refreshInstagramToken(currentToken)
        const newExpiresAt = new Date(Date.now() + refreshed.expiresIn * 1000)

        await db.update(socialAccounts)
          .set({
            accessToken: encrypt(refreshed.accessToken),
            tokenExpiresAt: newExpiresAt,
          })
          .where(eq(socialAccounts.id, account.id))

        results.push({ accountId: account.id, platform: account.platform, success: true })
      }
      else {
        // TikTok and other platforms — TODO
        results.push({ accountId: account.id, platform: account.platform, success: false, error: 'Platform not supported yet' })
      }
    }
    catch (err: any) {
      results.push({ accountId: account.id, platform: account.platform, success: false, error: err.message })
    }
  }

  return { total: accounts.length, results }
}

// POST /api/cron/refresh-tokens — manual trigger
export default defineEventHandler(async () => {
  // TODO: Add auth check (cron secret or admin only)
  const result = await refreshExpiringTokens()
  return { success: true, ...result }
})
