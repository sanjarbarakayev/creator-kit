<script setup lang="ts">
definePageMeta({
  layout: 'public',
  auth: false,
})

const { t } = useI18n()
const runtimeConfig = useRuntimeConfig()
const appUrl = runtimeConfig.public.appUrl || 'https://creator-kit-hazel.vercel.app'

useSeoMeta({
  title: 'CreatorKit — O\'zbek kreatorlar uchun platforma',
  description: 'Instagram va TikTok analitikasi, professional media-kit va kreatorlar katalogi. O\'zbek kreatorlar uchun yagona platforma.',
  ogTitle: 'CreatorKit — O\'zbek kreatorlar uchun platforma',
  ogDescription: 'Instagram va TikTok analitikasi, professional media-kit va kreatorlar katalogi.',
  ogImage: `${appUrl}/og-image.png`,
  ogType: 'website',
  ogSiteName: 'CreatorKit',
  twitterCard: 'summary_large_image',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'CreatorKit',
        url: appUrl,
        logo: `${appUrl}/og-image.png`,
        description: 'Platform for Uzbek content creators — analytics, media kits, and creator directory.',
        sameAs: [
          'https://instagram.com/creatorkit.uz',
          'https://t.me/creatorkit_uz',
        ],
      }),
    },
  ],
})

const features = computed(() => [
  { icon: 'i-lucide-bar-chart-3', title: t('landing.features.analytics'), desc: t('landing.features.analyticsDesc'), gradient: 'from-violet-500/20 to-indigo-500/10', iconColor: 'text-violet-400', glow: '#7c3aed' },
  { icon: 'i-lucide-file-text', title: t('landing.features.mediaKit'), desc: t('landing.features.mediaKitDesc'), gradient: 'from-pink-500/20 to-rose-500/10', iconColor: 'text-pink-400', glow: '#ec4899' },
  { icon: 'i-lucide-search', title: t('landing.features.directory'), desc: t('landing.features.directoryDesc'), gradient: 'from-blue-500/20 to-indigo-500/10', iconColor: 'text-blue-400', glow: '#3b82f6' },
  { icon: 'i-lucide-bot', title: t('landing.features.telegram'), desc: t('landing.features.telegramDesc'), gradient: 'from-orange-500/20 to-amber-500/10', iconColor: 'text-orange-400', glow: '#f97316' },
])

const steps = computed(() => [
  { num: '01', title: t('landing.steps.step1'), desc: t('landing.steps.step1Desc'), icon: 'i-lucide-user-plus', color: 'from-violet-500 to-indigo-500' },
  { num: '02', title: t('landing.steps.step2'), desc: t('landing.steps.step2Desc'), icon: 'i-lucide-link', color: 'from-pink-500 to-rose-500' },
  { num: '03', title: t('landing.steps.step3'), desc: t('landing.steps.step3Desc'), icon: 'i-lucide-share-2', color: 'from-orange-500 to-amber-500' },
])

const testimonials = computed(() => [
  { ...getTestimonial('t1'), gradient: 'from-violet-500 to-indigo-500', initials: 'NK' },
  { ...getTestimonial('t2'), gradient: 'from-pink-500 to-rose-500', initials: 'SA' },
  { ...getTestimonial('t3'), gradient: 'from-orange-500 to-amber-500', initials: 'MU' },
])

function getTestimonial(key: string) {
  return {
    name: t(`landing.testimonials.${key}.name`),
    role: t(`landing.testimonials.${key}.role`),
    quote: t(`landing.testimonials.${key}.quote`),
  }
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
  )
  document.documentElement.classList.add('scroll-animations-enabled')
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))
})
</script>

<template>
  <div class="text-white">

    <!-- ════════════════════════════════════════════════
         HERO
    ════════════════════════════════════════════════ -->
    <section class="relative overflow-hidden mesh-bg min-h-screen flex items-center">
      <!-- Decorative orbs -->
      <div class="orb orb-1" />
      <div class="orb orb-2" />
      <div class="orb orb-3" />

      <!-- Grid overlay -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div class="relative mx-auto max-w-7xl px-4 py-28 sm:px-6 lg:px-8 w-full">
        <div class="grid items-center gap-16 lg:grid-cols-2">

          <!-- Left: Text content -->
          <div class="animate-on-scroll">
            <!-- Badge -->
            <div class="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300 mb-8">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-violet-400"></span>
              </span>
              {{ t('landing.statsHeadline') }}
            </div>

            <h1 class="text-5xl font-extrabold tracking-tight leading-[1.1] sm:text-6xl lg:text-7xl">
              <span class="gradient-text">{{ t('landing.titleHighlight') }}</span>
              <br />
              <span class="text-white/90 text-4xl sm:text-5xl lg:text-6xl font-bold">{{ t('landing.title') }}</span>
            </h1>

            <p class="mt-7 max-w-lg text-lg leading-8 text-white/55 lg:text-xl">
              {{ t('landing.subtitle') }}
            </p>

            <div class="mt-10 flex flex-wrap items-center gap-4">
              <NuxtLink
                to="/auth/login"
                class="btn-gradient inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold shadow-lg shadow-violet-500/25"
              >
                <UIcon name="i-lucide-zap" class="h-4.5 w-4.5" />
                {{ t('landing.cta') }}
              </NuxtLink>
              <NuxtLink
                to="/creators"
                class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-white/80 hover:bg-white/[0.08] hover:text-white transition-all duration-200"
              >
                {{ t('landing.browse') }}
                <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
              </NuxtLink>
            </div>

            <!-- Trust badges -->
            <div class="mt-10 flex items-center gap-6 text-sm text-white/30">
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-shield-check" class="h-4 w-4 text-violet-400" />
                <span>Instagram OAuth</span>
              </div>
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-lock" class="h-4 w-4 text-pink-400" />
                <span>Supabase secure</span>
              </div>
              <div class="flex items-center gap-1.5">
                <UIcon name="i-lucide-bot" class="h-4 w-4 text-orange-400" />
                <span>Telegram bot</span>
              </div>
            </div>
          </div>

          <!-- Right: Dashboard Mockup + Hero Illustration -->
          <div class="relative animate-on-scroll" style="transition-delay:150ms">
            <!-- Glow behind mockup -->
            <div class="absolute -inset-8 rounded-3xl bg-gradient-to-r from-violet-600/20 via-pink-600/10 to-indigo-600/20 blur-3xl" />

            <!-- Hero Illustration: Creator at desk SVG -->
            <div class="absolute -top-10 -right-8 w-32 h-32 opacity-70">
              <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Camera body -->
                <rect x="25" y="48" width="70" height="48" rx="8" fill="url(#cam1)" opacity="0.9"/>
                <rect x="42" y="38" width="36" height="18" rx="5" fill="url(#cam2)" opacity="0.8"/>
                <!-- Lens -->
                <circle cx="60" cy="72" r="18" fill="#0d0d1a" stroke="url(#cam1)" stroke-width="3"/>
                <circle cx="60" cy="72" r="12" fill="#1e1b4b" stroke="rgba(139,92,246,0.4)" stroke-width="2"/>
                <circle cx="60" cy="72" r="6" fill="url(#cam3)" opacity="0.9"/>
                <circle cx="56" cy="68" r="2" fill="white" opacity="0.5"/>
                <!-- Flash -->
                <rect x="78" y="52" width="10" height="6" rx="2" fill="url(#flash)"/>
                <!-- Stars -->
                <path d="M15 20l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#a78bfa" opacity="0.8"/>
                <path d="M100 10l1.5 4.5 4.5 1.5-4.5 1.5L100 22l-1.5-4.5L94 16l4.5-1.5z" fill="#f472b6" opacity="0.7"/>
                <path d="M108 55l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill="#fb923c" opacity="0.6"/>
                <defs>
                  <linearGradient id="cam1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#7c3aed"/>
                    <stop offset="100%" stop-color="#4f46e5"/>
                  </linearGradient>
                  <linearGradient id="cam2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#6d28d9"/>
                    <stop offset="100%" stop-color="#4338ca"/>
                  </linearGradient>
                  <radialGradient id="cam3">
                    <stop offset="0%" stop-color="#a78bfa"/>
                    <stop offset="100%" stop-color="#7c3aed"/>
                  </radialGradient>
                  <linearGradient id="flash" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#fbbf24"/>
                    <stop offset="100%" stop-color="#f59e0b"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <!-- Floating stat pill -->
            <div class="absolute -left-6 top-12 glass rounded-2xl px-4 py-3 z-20 shadow-xl">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                  <UIcon name="i-lucide-trending-up" class="w-4 h-4 text-white" />
                </div>
                <div>
                  <p class="text-[10px] text-white/40">Followers</p>
                  <p class="text-sm font-bold text-white">+2.4K <span class="text-green-400 text-[10px]">this week</span></p>
                </div>
              </div>
            </div>

            <!-- Floating ER pill -->
            <div class="absolute -right-4 bottom-16 glass rounded-2xl px-4 py-3 z-20 shadow-xl">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                  <UIcon name="i-lucide-heart" class="w-4 h-4 text-white" />
                </div>
                <div>
                  <p class="text-[10px] text-white/40">Engagement</p>
                  <p class="text-sm font-bold text-white">4.2% <span class="text-pink-400 text-[10px]">avg ER</span></p>
                </div>
              </div>
            </div>

            <!-- Dashboard mockup card -->
            <div class="relative glass rounded-2xl overflow-hidden shadow-2xl z-10">
              <!-- Title bar -->
              <div class="flex items-center gap-2 border-b border-white/[0.07] bg-white/[0.03] px-4 py-3">
                <div class="flex gap-1.5">
                  <div class="h-3 w-3 rounded-full bg-red-400/80" />
                  <div class="h-3 w-3 rounded-full bg-amber-400/80" />
                  <div class="h-3 w-3 rounded-full bg-green-400/80" />
                </div>
                <div class="ml-3 flex-1 rounded-md bg-white/[0.06] px-3 py-1 text-xs text-white/30 font-mono">
                  creator-kit.uz/dashboard
                </div>
              </div>
              <!-- Content -->
              <div class="p-5">
                <!-- Mini stat cards -->
                <div class="grid grid-cols-3 gap-3 mb-4">
                  <div v-for="(stat, i) in [
                    { label: 'Followers', value: '125K', trend: '+12.5%', color: 'from-violet-500/20 to-indigo-500/10' },
                    { label: 'Engagement', value: '4.2%', trend: '+0.8%', color: 'from-pink-500/20 to-rose-500/10' },
                    { label: 'Growth', value: '+2.4K', trend: 'this week', color: 'from-orange-500/20 to-amber-500/10' },
                  ]" :key="i" :class="`rounded-xl bg-gradient-to-br ${stat.color} border border-white/[0.06] p-3`">
                    <p class="text-[10px] text-white/40">{{ stat.label }}</p>
                    <p class="text-base font-bold text-white">{{ stat.value }}</p>
                    <p class="text-[10px] text-green-400">{{ stat.trend }}</p>
                  </div>
                </div>
                <!-- Chart -->
                <div class="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <svg viewBox="0 0 300 70" class="w-full" fill="none">
                    <defs>
                      <linearGradient id="heroChartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#7c3aed" stop-opacity="0.4"/>
                        <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
                      </linearGradient>
                    </defs>
                    <path d="M0 55 C40 50 60 40 90 35 S150 38 180 20 S240 8 270 12 L300 8 L300 70 L0 70Z" fill="url(#heroChartGrad)"/>
                    <path d="M0 55 C40 50 60 40 90 35 S150 38 180 20 S240 8 270 12 L300 8" stroke="#7c3aed" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                    <circle cx="180" cy="20" r="4" fill="#7c3aed"/>
                    <circle cx="180" cy="20" r="7" fill="#7c3aed" fill-opacity="0.2"/>
                    <circle cx="300" cy="8" r="3" fill="#f472b6"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom fade -->
      <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0d0d1a] to-transparent pointer-events-none" />
    </section>

    <!-- ════════════════════════════════════════════════
         FEATURES
    ════════════════════════════════════════════════ -->
    <section class="bg-[#0d0d1a] relative">
      <!-- Divider glow -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

      <div class="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div class="text-center animate-on-scroll">
          <p class="text-sm font-semibold uppercase tracking-widest text-violet-400 mb-3">Features</p>
          <h2 class="text-4xl font-bold text-white">
            {{ t('landing.featuresTitle') }}
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-white/50 text-lg">
            {{ t('landing.featuresSubtitle') }}
          </p>
        </div>
        <div class="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(f, i) in features"
            :key="f.title"
            class="animate-on-scroll glass-card p-6 group cursor-default"
            :style="{ transitionDelay: `${i * 80}ms` }"
          >
            <div :class="`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${f.gradient} mb-5 transition-transform duration-300 group-hover:scale-110`">
              <UIcon :name="f.icon" :class="[f.iconColor, 'h-6 w-6']" />
            </div>
            <h3 class="text-base font-semibold text-white mb-2">{{ f.title }}</h3>
            <p class="text-sm leading-relaxed text-white/45">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════
         MID CTA 1
    ════════════════════════════════════════════════ -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(255,255,255,0.06),transparent)]" />
      <div class="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h3 class="text-3xl font-bold text-white">{{ t('landing.midCta1') }}</h3>
        <p class="mt-3 text-violet-200">{{ t('landing.midCta1Sub') }}</p>
        <div class="mt-8">
          <NuxtLink
            to="/auth/login"
            class="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-violet-700 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
          >
            <UIcon name="i-lucide-arrow-right" class="h-4.5 w-4.5" />
            {{ t('landing.cta') }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════
         HOW IT WORKS
    ════════════════════════════════════════════════ -->
    <section class="bg-[#0f0f20]">
      <div class="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <div class="text-center animate-on-scroll">
          <p class="text-sm font-semibold uppercase tracking-widest text-pink-400 mb-3">How it works</p>
          <h2 class="text-4xl font-bold text-white">{{ t('landing.howTitle') }}</h2>
        </div>
        <div class="mt-16 grid gap-10 sm:grid-cols-3">
          <div
            v-for="(s, i) in steps"
            :key="s.num"
            class="animate-on-scroll flex flex-col items-center text-center group"
            :style="{ transitionDelay: `${i * 120}ms` }"
          >
            <div class="relative mb-6">
              <!-- Connecting line desktop -->
              <div
                v-if="i < steps.length - 1"
                class="absolute left-[calc(50%+2.5rem)] top-1/2 hidden h-px w-[calc(100vw/3-5rem)] bg-gradient-to-r from-white/15 to-transparent sm:block"
              />
              <div :class="`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} shadow-lg transition-transform duration-300 group-hover:scale-110`">
                <UIcon :name="s.icon" class="size-7 text-white" />
              </div>
              <span class="absolute -top-2 -right-2 text-[10px] font-bold text-white/30 font-mono">{{ s.num }}</span>
            </div>
            <p class="text-lg font-semibold text-white">{{ s.title }}</p>
            <p class="mt-2 text-sm text-white/45">{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════
         MID CTA 2
    ════════════════════════════════════════════════ -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-pink-600 via-rose-600 to-orange-600" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(255,255,255,0.06),transparent)]" />
      <div class="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h3 class="text-3xl font-bold text-white">{{ t('landing.midCta2') }}</h3>
        <p class="mt-3 text-rose-200">{{ t('landing.midCta2Sub') }}</p>
        <div class="mt-8">
          <NuxtLink
            to="/auth/login"
            class="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-rose-700 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
          >
            <UIcon name="i-lucide-file-text" class="h-4.5 w-4.5" />
            {{ t('landing.ctaButton') }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════
         TESTIMONIALS
    ════════════════════════════════════════════════ -->
    <section class="bg-[#0d0d1a]">
      <div class="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div class="text-center animate-on-scroll">
          <p class="text-sm font-semibold uppercase tracking-widest text-orange-400 mb-3">Testimonials</p>
          <h2 class="text-4xl font-bold text-white">{{ t('landing.testimonials.title') }}</h2>
        </div>
        <div class="mt-16 grid gap-6 md:grid-cols-3">
          <div
            v-for="(tm, i) in testimonials"
            :key="tm.name"
            class="animate-on-scroll glass-card p-6 group"
            :style="{ transitionDelay: `${i * 100}ms` }"
          >
            <!-- Quote icon -->
            <div class="text-3xl text-white/10 font-serif mb-3">"</div>
            <p class="text-sm leading-relaxed text-white/60 italic mb-5">{{ tm.quote }}</p>
            <div class="flex items-center gap-3 mt-auto">
              <div :class="`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${tm.gradient} text-xs font-bold text-white flex-shrink-0`">
                {{ tm.initials }}
              </div>
              <div>
                <p class="text-sm font-semibold text-white">{{ tm.name }}</p>
                <p class="text-xs text-white/35">{{ tm.role }}</p>
              </div>
              <div class="ml-auto flex gap-0.5">
                <UIcon v-for="n in 5" :key="n" name="i-lucide-star" class="h-3.5 w-3.5 text-amber-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════
         BOTTOM CTA
    ════════════════════════════════════════════════ -->
    <section class="relative overflow-hidden bg-[#0d0d1a]">
      <!-- Bottom hero glow -->
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-violet-900/10 to-violet-900/20" />
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-violet-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div class="relative mx-auto max-w-3xl px-4 py-28 text-center sm:px-6 lg:px-8 animate-on-scroll">
        <!-- Illustration: Sparkle burst -->
        <div class="flex justify-center mb-8">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <path d="M32 4L36 28L60 32L36 36L32 60L28 36L4 32L28 28Z" fill="url(#sparkle)" opacity="0.9"/>
            <path d="M32 15L34.5 28L47 32L34.5 35.5L32 49L29.5 35.5L17 32L29.5 28Z" fill="white" opacity="0.15"/>
            <defs>
              <linearGradient id="sparkle" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#a78bfa"/>
                <stop offset="50%" stop-color="#818cf8"/>
                <stop offset="100%" stop-color="#f472b6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h2 class="text-4xl font-extrabold text-white sm:text-5xl leading-tight">
          {{ t('landing.ctaTitle') }}
        </h2>
        <p class="mt-5 text-lg text-white/50">
          {{ t('landing.ctaSubtitle') }}
        </p>
        <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <NuxtLink
            to="/auth/login"
            class="btn-gradient inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-bold shadow-xl shadow-violet-500/25"
          >
            <UIcon name="i-lucide-zap" class="h-5 w-5" />
            {{ t('landing.ctaButton') }}
          </NuxtLink>
          <NuxtLink
            to="/creators"
            class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-8 py-4 text-base font-semibold text-white/70 hover:bg-white/[0.08] hover:text-white transition-all duration-200"
          >
            {{ t('landing.browse') }}
            <UIcon name="i-lucide-users" class="h-4.5 w-4.5" />
          </NuxtLink>
        </div>
      </div>
    </section>

  </div>
</template>
