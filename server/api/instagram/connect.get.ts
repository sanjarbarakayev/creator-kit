import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const user = (event.context as any).user
  if (!user?.id) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const state = `${user.id}:${randomUUID()}`
  setCookie(event, 'ig_oauth_state', state, {
    httpOnly: true,
    secure: true,
    maxAge: 600,
    path: '/',
  })

  const url = getInstagramAuthUrl(state)
  return sendRedirect(event, url)
})
