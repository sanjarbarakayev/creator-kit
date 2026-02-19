export interface AudienceDemographics {
  readonly ageRanges: ReadonlyArray<{
    readonly range: string
    readonly percentage: number
  }>
  readonly genderSplit: {
    readonly male: number
    readonly female: number
    readonly other: number
  }
  readonly topCountries: ReadonlyArray<{
    readonly country: string
    readonly percentage: number
  }>
  readonly topCities: ReadonlyArray<{
    readonly city: string
    readonly percentage: number
  }>
}

export interface TopPost {
  readonly id: string
  readonly type: 'image' | 'video' | 'carousel' | 'reel' | 'story'
  readonly caption: string | null
  readonly thumbnailUrl: string | null
  readonly permalink: string | null
  readonly likesCount: number
  readonly commentsCount: number
  readonly engagementRate: number
  readonly timestamp: string
}

export interface AnalyticsSnapshot {
  readonly id: string
  readonly socialAccountId: string
  readonly snapshotDate: string
  readonly followersCount: number | null
  readonly followingCount: number | null
  readonly mediaCount: number | null
  readonly engagementRate: string | null
  readonly avgLikes: number | null
  readonly avgComments: number | null
  readonly audienceDemographics: AudienceDemographics | null
  readonly topPosts: readonly TopPost[] | null
  readonly createdAt: string
}
