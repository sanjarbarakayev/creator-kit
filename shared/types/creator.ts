export interface Profile {
  readonly id: string
  readonly username: string
  readonly fullName: string | null
  readonly bio: string | null
  readonly avatarUrl: string | null
  readonly niche: readonly string[]
  readonly language: readonly string[]
  readonly city: string | null
  readonly country: string | null
  readonly isPublic: boolean
  readonly onboardingComplete: boolean
  readonly createdAt: string
  readonly updatedAt: string
}

export interface SocialAccount {
  readonly id: string
  readonly profileId: string
  readonly platform: 'instagram' | 'tiktok' | 'youtube' | 'telegram'
  readonly platformUserId: string | null
  readonly platformUsername: string | null
  readonly isConnected: boolean
  readonly followersCount: number
  readonly createdAt: string
  readonly updatedAt: string
}

export interface CreatorCategory {
  readonly id: number
  readonly slug: string
  readonly nameUz: string
  readonly nameRu: string
  readonly nameEn: string
  readonly icon: string | null
}
