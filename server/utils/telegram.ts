import { Bot } from 'grammy'

let _bot: Bot | null = null

export function useTelegramBot(): Bot {
  if (!_bot) {
    const config = useRuntimeConfig()
    const token = config.telegramBotToken
    if (!token) {
      throw new Error('NUXT_TELEGRAM_BOT_TOKEN is not configured')
    }
    _bot = new Bot(token)
  }
  return _bot
}

export function formatAnalyticsMessage(account: {
  platform: string
  platformUsername?: string | null
  followersCount?: number | null
}, snapshot: {
  followersCount?: number | null
  engagementRate?: string | null
  growthRate?: string | null
} | null): string {
  const followers = snapshot?.followersCount ?? account.followersCount ?? 0
  const engagement = snapshot?.engagementRate ?? '0'
  const growth = snapshot?.growthRate ?? '0'

  const platform = account.platform.charAt(0).toUpperCase() + account.platform.slice(1)

  return [
    `📊 Sizning statistikangiz:`,
    ``,
    `👥 Followers: ${followers.toLocaleString()} (${Number(growth) >= 0 ? '+' : ''}${growth}%)`,
    `💬 Engagement Rate: ${engagement}%`,
    `📈 Haftalik o'sish: ${Number(growth) >= 0 ? '+' : ''}${growth}%`,
    `📱 Platform: ${platform}`,
    account.platformUsername ? `🔗 @${account.platformUsername}` : '',
  ].filter(Boolean).join('\n')
}

export function formatDigestMessage(username: string, accounts: Array<{
  platform: string
  followersCount?: number | null
}>): string {
  const lines = [`🌅 Kunlik hisobot — ${username}`, '']
  for (const acc of accounts) {
    const p = acc.platform.charAt(0).toUpperCase() + acc.platform.slice(1)
    lines.push(`📱 ${p}: ${(acc.followersCount ?? 0).toLocaleString()} followers`)
  }
  if (accounts.length === 0) {
    lines.push('Hech qanday ulangan hisob topilmadi.')
  }
  return lines.join('\n')
}
