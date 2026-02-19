// TODO: TikTok API integration
// - OAuth flow (TikTok Login Kit)
// - Fetch user profile & stats
// - Sync analytics snapshots
// - Token refresh

export function getTikTokAuthUrl(_state: string): string {
  // TODO: Implement TikTok OAuth URL generation
  throw new Error('TikTok integration not yet implemented')
}

export async function exchangeTikTokCode(_code: string): Promise<{ accessToken: string; expiresIn: number }> {
  // TODO: Exchange auth code for access token
  throw new Error('TikTok integration not yet implemented')
}

export async function fetchTikTokInsights(_userId: string, _accessToken: string) {
  // TODO: Fetch TikTok user insights
  throw new Error('TikTok integration not yet implemented')
}
