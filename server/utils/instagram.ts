const GRAPH_API = 'https://graph.instagram.com/v21.0'
const GRAPH_FB_API = 'https://graph.facebook.com/v21.0'

interface InstagramConfig {
  appId: string
  appSecret: string
  redirectUri: string
}

function getConfig(): InstagramConfig {
  const rc = useRuntimeConfig()
  return {
    appId: rc.metaAppId,
    appSecret: rc.metaAppSecret,
    redirectUri: rc.instagramRedirectUri || `${rc.public.appUrl}/api/instagram/callback`,
  }
}

export function getInstagramAuthUrl(state: string): string {
  const { appId, redirectUri } = getConfig()
  const scopes = [
    'instagram_basic',
    'instagram_manage_insights',
    'pages_show_list',
    'pages_read_engagement',
  ].join(',')
  return `${GRAPH_FB_API}/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&response_type=code&state=${state}`
}

export async function exchangeCodeForToken(code: string): Promise<{
  accessToken: string
  expiresIn: number
}> {
  const { appId, appSecret, redirectUri } = getConfig()
  // Exchange code for short-lived token
  const res = await $fetch<any>(`${GRAPH_FB_API}/oauth/access_token`, {
    params: {
      client_id: appId,
      client_secret: appSecret,
      redirect_uri: redirectUri,
      code,
    },
  })
  // Exchange for long-lived token
  const longLived = await $fetch<any>(`${GRAPH_FB_API}/oauth/access_token`, {
    params: {
      grant_type: 'fb_exchange_token',
      client_id: appId,
      client_secret: appSecret,
      fb_exchange_token: res.access_token,
    },
  })
  return {
    accessToken: longLived.access_token,
    expiresIn: longLived.expires_in || 5184000, // ~60 days
  }
}

export async function getInstagramAccount(accessToken: string): Promise<{
  igUserId: string
  username: string
  pageAccessToken: string
}> {
  // Get Facebook pages
  const pages = await $fetch<any>(`${GRAPH_FB_API}/me/accounts`, {
    params: { access_token: accessToken },
  })
  const page = pages.data?.[0]
  if (!page) throw createError({ statusCode: 400, message: 'No Facebook page found' })

  // Get Instagram Business Account linked to the page
  const igAccount = await $fetch<any>(`${GRAPH_FB_API}/${page.id}`, {
    params: {
      fields: 'instagram_business_account',
      access_token: page.access_token,
    },
  })
  const igUserId = igAccount.instagram_business_account?.id
  if (!igUserId) throw createError({ statusCode: 400, message: 'No Instagram Business account linked' })

  // Get username
  const profile = await $fetch<any>(`${GRAPH_API}/${igUserId}`, {
    params: { fields: 'username', access_token: page.access_token },
  })

  return {
    igUserId,
    username: profile.username,
    pageAccessToken: page.access_token,
  }
}

export async function fetchInstagramInsights(igUserId: string, accessToken: string) {
  const [profile, media, insights] = await Promise.all([
    // Profile info
    $fetch<any>(`${GRAPH_API}/${igUserId}`, {
      params: {
        fields: 'followers_count,follows_count,media_count,username',
        access_token: accessToken,
      },
    }),
    // Recent media
    $fetch<any>(`${GRAPH_API}/${igUserId}/media`, {
      params: {
        fields: 'id,caption,like_count,comments_count,timestamp,media_type,permalink,thumbnail_url,media_url',
        limit: 25,
        access_token: accessToken,
      },
    }),
    // Account insights
    $fetch<any>(`${GRAPH_API}/${igUserId}/insights`, {
      params: {
        metric: 'follower_count',
        period: 'day',
        metric_type: 'total_value',
        access_token: accessToken,
      },
    }).catch(() => null),
  ])

  const posts = media.data || []
  const totalLikes = posts.reduce((s: number, p: any) => s + (p.like_count || 0), 0)
  const totalComments = posts.reduce((s: number, p: any) => s + (p.comments_count || 0), 0)
  const postCount = posts.length || 1

  const avgLikes = totalLikes / postCount
  const avgComments = totalComments / postCount
  const engagementRate = profile.followers_count > 0
    ? ((avgLikes + avgComments) / profile.followers_count) * 100
    : 0

  return {
    followersCount: profile.followers_count,
    followingCount: profile.follows_count,
    postsCount: profile.media_count,
    avgLikes: Math.round(avgLikes * 100) / 100,
    avgComments: Math.round(avgComments * 100) / 100,
    avgViews: 0,
    engagementRate: Math.round(engagementRate * 100) / 100,
    topPosts: posts.slice(0, 5).map((p: any) => ({
      id: p.id,
      caption: p.caption?.substring(0, 100),
      likes: p.like_count,
      comments: p.comments_count,
      type: p.media_type,
      permalink: p.permalink,
      timestamp: p.timestamp,
    })),
  }
}

export async function refreshInstagramToken(currentToken: string): Promise<{
  accessToken: string
  expiresIn: number
}> {
  const res = await $fetch<any>(`${GRAPH_API}/refresh_access_token`, {
    params: {
      grant_type: 'ig_refresh_token',
      access_token: currentToken,
    },
  })
  return {
    accessToken: res.access_token,
    expiresIn: res.expires_in,
  }
}
