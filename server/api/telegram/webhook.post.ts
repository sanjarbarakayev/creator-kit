import { webhookCallback } from 'grammy'
import { profiles, socialAccounts, analyticsSnapshots, mediaKits } from '~~/server/database/schema'
import { eq, desc, and } from 'drizzle-orm'
import { db } from '~~/server/utils/db'
import { useTelegramBot, formatAnalyticsMessage } from '~~/server/utils/telegram'

let _initialized = false

function ensureBotHandlers() {
  if (_initialized) return
  _initialized = true

  const bot = useTelegramBot()
  const config = useRuntimeConfig()
  const appUrl = config.public.appUrl

  bot.command('start', async (ctx) => {
    await ctx.reply(
      `👋 CreatorKit botiga xush kelibsiz!\n\n`
      + `Bu bot orqali statistikangizni ko'rishingiz va media-kit havolangizni olishingiz mumkin.\n\n`
      + `📝 Ro'yxatdan o'tish: ${appUrl}/auth/signup\n`
      + `🔑 Kirish: ${appUrl}/auth/login\n\n`
      + `⚙️ Sozlamalarda Telegram username'ingizni kiriting, bot sizni avtomatik topadi.`,
    )
  })

  bot.command('stats', async (ctx) => {
    const tgUsername = ctx.from?.username
    if (!tgUsername) {
      await ctx.reply('❌ Telegram username topilmadi. Iltimos, Telegram sozlamalarida username o\'rnating.')
      return
    }

    const profile = await db.select().from(profiles)
      .where(eq(profiles.telegramUsername, tgUsername))
      .limit(1)
      .then(r => r[0])

    if (!profile) {
      await ctx.reply(`❌ Profil topilmadi. CreatorKit'da ro'yxatdan o'ting va sozlamalarda Telegram username'ingizni kiriting.\n\n${appUrl}/auth/signup`)
      return
    }

    const accounts = await db.select().from(socialAccounts)
      .where(and(
        eq(socialAccounts.profileId, profile.id),
        eq(socialAccounts.isConnected, true),
      ))

    if (accounts.length === 0) {
      await ctx.reply('📱 Hech qanday ijtimoiy tarmoq hisobi ulanmagan. Dashboard\'dan ulang.')
      return
    }

    const messages: string[] = []
    for (const account of accounts) {
      const snapshot = await db.select().from(analyticsSnapshots)
        .where(eq(analyticsSnapshots.socialAccountId, account.id))
        .orderBy(desc(analyticsSnapshots.snapshotDate))
        .limit(1)
        .then(r => r[0] ?? null)

      messages.push(formatAnalyticsMessage(account, snapshot))
    }

    await ctx.reply(messages.join('\n\n---\n\n'))
  })

  bot.command('mediakit', async (ctx) => {
    const tgUsername = ctx.from?.username
    if (!tgUsername) {
      await ctx.reply('❌ Telegram username topilmadi.')
      return
    }

    const profile = await db.select().from(profiles)
      .where(eq(profiles.telegramUsername, tgUsername))
      .limit(1)
      .then(r => r[0])

    if (!profile) {
      await ctx.reply(`❌ Profil topilmadi.\n${appUrl}/auth/signup`)
      return
    }

    const kit = await db.select().from(mediaKits)
      .where(eq(mediaKits.profileId, profile.id))
      .limit(1)
      .then(r => r[0])

    if (!kit) {
      await ctx.reply(`📋 Media-kit hali yaratilmagan. Dashboard'dan yarating:\n${appUrl}/dashboard`)
      return
    }

    await ctx.reply(`📋 Sizning media-kit havolangiz:\n${appUrl}/creators/${profile.username}`)
  })
}

export default defineEventHandler(async (event) => {
  ensureBotHandlers()
  const bot = useTelegramBot()
  const handler = webhookCallback(bot, 'h3')
  return handler(event)
})
