import { socialAccounts } from '~~/server/database/schema'
import { eq, and } from 'drizzle-orm'
import { db } from '~~/server/utils/db'

export default defineEventHandler(async (event) => {
  const user = (event.context as any).user
  if (!user?.id) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  await db.delete(socialAccounts)
    .where(and(
      eq(socialAccounts.profileId, user.id),
      eq(socialAccounts.platform, 'instagram'),
    ))

  return { success: true }
})
