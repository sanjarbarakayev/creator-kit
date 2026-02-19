import { z } from 'zod/v4'
import { serverSupabaseClient } from '#supabase/server'

const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  username: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/),
  fullName: z.string().min(1).max(100).optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, signupSchema.parse)
  const client = await serverSupabaseClient(event)

  const { data, error } = await client.auth.signUp({
    email: body.email,
    password: body.password,
    options: {
      data: {
        username: body.username,
        full_name: body.fullName,
      },
    },
  })

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message,
    })
  }

  return { success: true, data: { user: data.user } }
})
