import { socialAccounts } from '~~/server/database/schema'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code as string
  const state = query.state as string
  const error = query.error as string

  if (error) {
    return sendRedirect(event, '/dashboard/socials?error=access_denied')
  }

  if (!code || !state) {
    throw createError({ statusCode: 400, message: 'Missing code or state' })
  }

  const savedState = getCookie(event, 'ig_oauth_state')
  if (state !== savedState) {
    throw createError({ statusCode: 403, message: 'Invalid state' })
  }
  deleteCookie(event, 'ig_oauth_state')

  const userId = state.split(':')[0]!

  try {
    const { accessToken, expiresIn } = await exchangeCodeForToken(code)
    const { igUserId, username, pageAccessToken } = await getInstagramAccount(accessToken)

    const tokenToStore = pageAccessToken || accessToken
    const expiresAt = new Date(Date.now() + expiresIn * 1000)

    const existing = await db.select().from(socialAccounts)
      .where(and(
        eq(socialAccounts.profileId, userId),
        eq(socialAccounts.platform, 'instagram'),
      ))
      .limit(1)

    if (existing.length > 0) {
      await db.update(socialAccounts)
        .set({
          platformUserId: igUserId,
          platformUsername: username,
          accessToken: encrypt(tokenToStore),
          tokenExpiresAt: expiresAt,
          isConnected: true,
        })
        .where(eq(socialAccounts.id, existing[0]!.id))
    } else {
      await db.insert(socialAccounts).values({
        profileId: userId,
        platform: 'instagram',
        platformUserId: igUserId,
        platformUsername: username,
        accessToken: encrypt(tokenToStore),
        tokenExpiresAt: expiresAt,
        isConnected: true,
      })
    }

    return sendRedirect(event, '/dashboard/socials?connected=instagram')
  } catch (err: any) {
    console.error('Instagram OAuth error:', err)
    return sendRedirect(event, '/dashboard/socials?error=oauth_failed')
  }
})
