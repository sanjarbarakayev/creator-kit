export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  future: {
    compatibilityVersion: 4,
  },

  devtools: { enabled: true },

  app: {
    head: {
      title: 'CreatorKit — O\'zbek kreatorlar uchun platforma',
      meta: [
        { name: 'description', content: 'Instagram va TikTok analitikasi, professional media-kit va kreatorlar katalogi. O\'zbek kreatorlar uchun yagona platforma.' },
        { property: 'og:title', content: 'CreatorKit — O\'zbek kreatorlar uchun platforma' },
        { property: 'og:description', content: 'Instagram va TikTok analitikasi, professional media-kit va kreatorlar katalogi.' },
        { property: 'og:image', content: 'https://creator-kit-hazel.vercel.app/og-image.png' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'CreatorKit' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      htmlAttrs: { lang: 'uz' },
    },
  },

  modules: [
    '@nuxt/ui',
    '@nuxtjs/supabase',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    '@pinia/nuxt',
    'nuxt-security',
  ],

  css: ['~/assets/css/main.css'],

  supabase: {
    redirect: false,
  },

  i18n: {
    locales: [
      { code: 'uz', name: "O'zbekcha", file: 'uz.json' },
      { code: 'ru', name: 'Русский', file: 'ru.json' },
      { code: 'en', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'uz',
    strategy: 'prefix_except_default',
    langDir: '../app/locales',
  },

  security: {
    headers: {
      crossOriginEmbedderPolicy: false,
    },
  },

  runtimeConfig: {
    metaAppId: '',
    metaAppSecret: '',
    instagramRedirectUri: '',
    tiktokClientKey: '',
    tiktokClientSecret: '',
    tokenEncryptionKey: '',
    telegramBotToken: '',
    supabaseServiceRoleKey: '',
    public: {
      appUrl: 'http://localhost:3000',
    },
  },
})
