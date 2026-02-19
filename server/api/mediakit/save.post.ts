import { eq } from 'drizzle-orm'
import { db } from '../../utils/db'
import { mediaKits } from '../../database/schema/media-kits'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { template, customData, includeAnalytics, profileId } = body

  if (!profileId) {
    // For now, upsert based on a placeholder profile ID
    // In production, get from auth session
    throw createError({ statusCode: 400, message: 'profileId is required' })
  }

  const existing = await db
    .select()
    .from(mediaKits)
    .where(eq(mediaKits.profileId, profileId))
    .limit(1)

  if (existing.length > 0) {
    const [updated] = await db
      .update(mediaKits)
      .set({
        template,
        customData,
        includeAnalytics,
        updatedAt: new Date(),
      })
      .where(eq(mediaKits.id, existing[0].id))
      .returning()
    return updated
  }

  const [created] = await db
    .insert(mediaKits)
    .values({
      profileId,
      template,
      customData,
      includeAnalytics,
    })
    .returning()

  return created
})
