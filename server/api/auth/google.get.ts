import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const config = useRuntimeConfig()
  const redirectTo = `${config.public.appUrl}/auth/callback`

  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  })

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to initiate Google sign-in',
    })
  }

  return sendRedirect(event, data.url)
})
