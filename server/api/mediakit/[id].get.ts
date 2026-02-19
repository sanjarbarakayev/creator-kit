import { eq } from 'drizzle-orm'
import { db } from '../../utils/db'
import { mediaKits } from '../../database/schema/media-kits'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'Missing id' })
  }

  const [kit] = await db
    .select()
    .from(mediaKits)
    .where(eq(mediaKits.id, id))
    .limit(1)

  if (!kit) {
    throw createError({ statusCode: 404, message: 'Media kit not found' })
  }

  return kit
})
