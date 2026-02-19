import { z } from 'zod/v4'
import { serverSupabaseClient } from '#supabase/server'

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, loginSchema.parse)
  const client = await serverSupabaseClient(event)

  const { data, error } = await client.auth.signInWithPassword({
    email: body.email,
    password: body.password,
  })

  if (error) {
    throw createError({
      statusCode: 401,
      message: error.message,
    })
  }

  return { success: true, data: { user: data.user, session: data.session } }
})
