import { eq, sql } from 'drizzle-orm'
import { db } from '../../../utils/db'
import { mediaKits } from '../../../database/schema/media-kits'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'Missing id' })

  await db
    .update(mediaKits)
    .set({ downloadsCount: sql`${mediaKits.downloadsCount} + 1` })
    .where(eq(mediaKits.id, id))

  return { ok: true }
})
