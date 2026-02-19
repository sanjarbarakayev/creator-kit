import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const username = getRouterParam(event, 'username')
  if (!username) {
    throw createError({ statusCode: 400, statusMessage: 'Username required' })
  }

  const config = useRuntimeConfig()
  const supabase = createClient(
    process.env.SUPABASE_URL || config.supabase?.url || '',
    config.supabaseServiceRoleKey,
  )

  // Fetch profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, full_name, username, bio, avatar_url, city, country, niches, content_languages')
    .eq('username', username)
    .eq('onboarding_complete', true)
    .single()

  if (error || !profile) {
    throw createError({ statusCode: 404, statusMessage: 'Creator not found' })
  }

  // Fetch social accounts
  const { data: socialAccounts } = await supabase
    .from('social_accounts')
    .select('id, platform, username, followers_count, following_count, media_count, avatar_url')
    .eq('profile_id', profile.id)

  // Fetch latest analytics
  const accountIds = (socialAccounts || []).map(a => a.id)
  let latestAnalytics: any = null
  if (accountIds.length) {
    const { data } = await supabase
      .from('analytics_snapshots')
      .select('*')
      .in('social_account_id', accountIds)
      .order('snapshot_date', { ascending: false })
      .limit(1)
      .maybeSingle()
    latestAnalytics = data
  }

  // Fetch media kit slug
  const { data: mediaKit } = await supabase
    .from('media_kits')
    .select('slug')
    .eq('profile_id', profile.id)
    .eq('is_public', true)
    .maybeSingle()

  const totalFollowers = (socialAccounts || []).reduce((sum, a) => sum + (a.followers_count || 0), 0)
  const er = latestAnalytics?.engagement_rate || null

  return {
    ...profile,
    social_accounts: socialAccounts || [],
    media_kit_slug: mediaKit?.slug || null,
    stats: [
      { label: 'Followers', value: totalFollowers >= 1000 ? (totalFollowers / 1000).toFixed(0) + 'K' : totalFollowers.toString() },
      { label: 'ER', value: er ? er.toFixed(1) + '%' : 'N/A' },
      { label: 'Posts', value: (socialAccounts || []).reduce((sum, a) => sum + (a.media_count || 0), 0).toString() },
      { label: 'Platforms', value: (socialAccounts || []).length.toString() },
    ],
  }
})
