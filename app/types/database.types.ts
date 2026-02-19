export interface Profile {
  id: string
  created_at: string
  updated_at: string
  email: string
  full_name: string | null
  avatar_url: string | null
  username: string | null
  bio: string | null
  city: string | null
  country: string | null
  niches: string[] | null
  content_languages: string[] | null
  contact_email: string | null
  telegram_username: string | null
  onboarding_complete: boolean
}

export interface SocialAccount {
  id: string
  created_at: string
  updated_at: string
  profile_id: string
  platform: 'instagram' | 'tiktok'
  platform_user_id: string
  username: string
  access_token: string
  refresh_token: string | null
  token_expires_at: string | null
  followers_count: number
  following_count: number
  media_count: number
  avatar_url: string | null
}

export interface AnalyticsSnapshot {
  id: string
  created_at: string
  social_account_id: string
  followers_count: number
  following_count: number
  media_count: number
  engagement_rate: number | null
  avg_likes: number | null
  avg_comments: number | null
  avg_views: number | null
  snapshot_date: string
}

export interface MediaKit {
  id: string
  created_at: string
  updated_at: string
  profile_id: string
  slug: string
  title: string | null
  bio: string | null
  is_public: boolean
  theme: string | null
  custom_links: Record<string, string>[] | null
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      social_accounts: {
        Row: SocialAccount
        Insert: Omit<SocialAccount, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<SocialAccount, 'id' | 'created_at'>>
      }
      analytics_snapshots: {
        Row: AnalyticsSnapshot
        Insert: Omit<AnalyticsSnapshot, 'id' | 'created_at'>
        Update: Partial<Omit<AnalyticsSnapshot, 'id' | 'created_at'>>
      }
      media_kits: {
        Row: MediaKit
        Insert: Omit<MediaKit, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<MediaKit, 'id' | 'created_at'>>
      }
    }
  }
}
