export type MediaKitTemplate = 'default' | 'minimal' | 'premium'

export interface PricingTier {
  readonly name: string
  readonly description: string
  readonly price: number
  readonly currency: string
}

export interface MediaKitCustomData {
  readonly headline: string | null
  readonly tagline: string | null
  readonly aboutMe: string | null
  readonly brandLogos: readonly string[]
  readonly pricing: readonly PricingTier[]
  readonly contactEmail: string | null
  readonly contactPhone: string | null
  readonly showDemographics: boolean
  readonly showTopPosts: boolean
  readonly showPricing: boolean
}

export interface MediaKit {
  readonly id: string
  readonly profileId: string
  readonly template: MediaKitTemplate
  readonly customData: MediaKitCustomData | null
  readonly pdfUrl: string | null
  readonly viewsCount: number
  readonly downloadsCount: number
  readonly createdAt: string
  readonly updatedAt: string
}
