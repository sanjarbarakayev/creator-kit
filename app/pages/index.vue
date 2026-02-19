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
  { icon: 'i-lucide-bar-chart-3', title: t('landing.features.analytics'), desc: t('landing.features.analyticsDesc'), color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { icon: 'i-lucide-file-text', title: t('landing.features.mediaKit'), desc: t('landing.features.mediaKitDesc'), color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  { icon: 'i-lucide-search', title: t('landing.features.directory'), desc: t('landing.features.directoryDesc'), color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { icon: 'i-lucide-bot', title: t('landing.features.telegram'), desc: t('landing.features.telegramDesc'), color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
])

const steps = computed(() => [
  { num: '1', title: t('landing.steps.step1'), desc: t('landing.steps.step1Desc'), icon: 'i-lucide-user-plus' },
  { num: '2', title: t('landing.steps.step2'), desc: t('landing.steps.step2Desc'), icon: 'i-lucide-link' },
  { num: '3', title: t('landing.steps.step3'), desc: t('landing.steps.step3Desc'), icon: 'i-lucide-share-2' },
])

const testimonials = computed(() => [
  { ...getTestimonial('t1'), gradient: 'from-pink-500 to-rose-500', initials: 'NK' },
  { ...getTestimonial('t2'), gradient: 'from-blue-500 to-indigo-500', initials: 'SA' },
  { ...getTestimonial('t3'), gradient: 'from-amber-500 to-orange-500', initials: 'MU' },
])

function getTestimonial(key: string) {
  return {
    name: t(`landing.testimonials.${key}.name`),
    role: t(`landing.testimonials.${key}.role`),
    quote: t(`landing.testimonials.${key}.quote`),
  }
}

// Scroll animation
const observedElements = ref<Element[]>([])

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

  // Enable animations only after hydration
  document.documentElement.classList.add('scroll-animations-enabled')

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el)
  })
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-amber-50/50 dark:from-gray-950 dark:via-gray-950 dark:to-emerald-950/20" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.12),transparent)]" />
      <div class="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <!-- Left: Text -->
          <div class="text-center lg:text-left">
            <div class="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <UIcon name="i-lucide-sparkles" class="h-4 w-4" />
              {{ t('landing.statsHeadline') }}
            </div>
            <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              <span class="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">{{ t('landing.titleHighlight') }}</span>
              <br class="hidden sm:block">
              <span class="text-3xl sm:text-4xl lg:text-5xl">{{ t('landing.title') }}</span>
            </h1>
            <p class="mt-6 max-w-xl text-lg leading-8 text-gray-600 dark:text-gray-400 lg:text-xl">
              {{ t('landing.subtitle') }}
            </p>
            <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <UButton to="/auth/login" size="xl" class="shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow">
                <UIcon name="i-lucide-arrow-right" class="mr-2 h-5 w-5" />
                {{ t('landing.cta') }}
              </UButton>
              <UButton to="/creators" variant="outline" size="xl" class="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                {{ t('landing.browse') }}
              </UButton>
            </div>
          </div>

          <!-- Right: Dashboard Mockup -->
          <div class="relative mx-auto w-full max-w-lg lg:max-w-none animate-on-scroll">
            <div class="absolute -inset-4 rounded-3xl bg-gradient-to-r from-emerald-500/20 to-amber-500/20 blur-2xl" />
            <div class="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
              <!-- Mockup Title Bar -->
              <div class="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
                <div class="flex gap-1.5">
                  <div class="h-3 w-3 rounded-full bg-red-400" />
                  <div class="h-3 w-3 rounded-full bg-amber-400" />
                  <div class="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div class="ml-4 flex-1 rounded-md bg-gray-200 px-3 py-1 text-xs text-gray-500 dark:bg-gray-800">
                  creator-kit.uz/dashboard
                </div>
              </div>
              <!-- Mockup Content -->
              <div class="p-5">
                <div class="mb-4 flex items-center justify-between">
                  <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ t('landing.dashboardMockup.analytics') }}</h3>
                  <div class="rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Live</div>
                </div>
                <!-- Stats Row -->
                <div class="mb-4 grid grid-cols-3 gap-3">
                  <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                    <p class="text-xs text-gray-500">{{ t('landing.dashboardMockup.followers') }}</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">125K</p>
                    <p class="text-xs text-emerald-600">+12.5%</p>
                  </div>
                  <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                    <p class="text-xs text-gray-500">{{ t('landing.dashboardMockup.engagement') }}</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">4.2%</p>
                    <p class="text-xs text-emerald-600">+0.8%</p>
                  </div>
                  <div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                    <p class="text-xs text-gray-500">{{ t('landing.dashboardMockup.growth') }}</p>
                    <p class="text-lg font-bold text-gray-900 dark:text-white">+2.4K</p>
                    <p class="text-xs text-amber-600">this week</p>
                  </div>
                </div>
                <!-- Chart Mockup -->
                <div class="rounded-lg border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
                  <div class="mb-2 flex items-center justify-between">
                    <span class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ t('landing.dashboardMockup.topContent') }}</span>
                  </div>
                  <svg viewBox="0 0 300 80" class="w-full" fill="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#10b981" stop-opacity="0.3" />
                        <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0 60 Q30 55 60 45 Q90 35 120 40 Q150 45 180 25 Q210 5 240 15 Q270 25 300 10 L300 80 L0 80 Z" fill="url(#chartGrad)" />
                    <path d="M0 60 Q30 55 60 45 Q90 35 120 40 Q150 45 180 25 Q210 5 240 15 Q270 25 300 10" stroke="#10b981" stroke-width="2.5" fill="none" stroke-linecap="round" />
                    <circle cx="180" cy="25" r="4" fill="#10b981" />
                    <circle cx="240" cy="15" r="4" fill="#f59e0b" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="bg-white dark:bg-gray-950">
      <div class="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div class="text-center animate-on-scroll">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ t('landing.featuresTitle') }}
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-400">
            {{ t('landing.featuresSubtitle') }}
          </p>
        </div>
        <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="(f, i) in features"
            :key="f.title"
            class="animate-on-scroll group rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
            :style="{ transitionDelay: `${i * 100}ms` }"
          >
            <div :class="[f.bg, 'mx-auto flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110']">
              <UIcon :name="f.icon" :class="['h-7 w-7', f.color]" />
            </div>
            <h3 class="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{{ f.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Mid CTA 1 -->
    <section class="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700">
      <div class="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <h3 class="text-2xl font-bold text-white">{{ t('landing.midCta1') }}</h3>
        <p class="mt-2 text-emerald-100">{{ t('landing.midCta1Sub') }}</p>
        <div class="mt-6">
          <UButton to="/auth/login" color="neutral" size="xl" class="shadow-lg">
            <UIcon name="i-lucide-arrow-right" class="mr-2 h-5 w-5" />
            {{ t('landing.cta') }}
          </UButton>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="bg-gray-50 dark:bg-gray-900/50">
      <div class="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 class="text-center text-3xl font-bold text-gray-900 dark:text-white animate-on-scroll">
          {{ t('landing.howTitle') }}
        </h2>
        <div class="mt-12 grid gap-8 sm:grid-cols-3">
          <div v-for="(s, i) in steps" :key="s.num" class="animate-on-scroll relative flex flex-col items-center text-center" :style="{ transitionDelay: `${i * 150}ms` }">
            <!-- Connecting line -->
            <div v-if="i < steps.length - 1" class="absolute left-[calc(50%+2rem)] top-7 hidden h-0.5 w-[calc(100%-4rem)] bg-gradient-to-r from-emerald-300 to-emerald-100 dark:from-emerald-700 dark:to-emerald-900 sm:block" />
            <div class="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xl font-bold text-white shadow-lg shadow-emerald-500/25 transition-transform duration-300 hover:scale-110">
              {{ s.num }}
            </div>
            <UIcon :name="s.icon" class="mt-4 h-6 w-6 text-gray-400 dark:text-gray-500" />
            <p class="mt-3 text-lg font-semibold text-gray-900 dark:text-white">{{ s.title }}</p>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Mid CTA 2 -->
    <section class="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600">
      <div class="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <h3 class="text-2xl font-bold text-white">{{ t('landing.midCta2') }}</h3>
        <p class="mt-2 text-amber-100">{{ t('landing.midCta2Sub') }}</p>
        <div class="mt-6">
          <UButton to="/auth/login" color="neutral" size="xl" class="shadow-lg">
            <UIcon name="i-lucide-file-text" class="mr-2 h-5 w-5" />
            {{ t('landing.ctaButton') }}
          </UButton>
        </div>
      </div>
    </section>

    <!-- Testimonials / Social Proof -->
    <section class="bg-white dark:bg-gray-950">
      <div class="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 class="text-center text-3xl font-bold text-gray-900 dark:text-white animate-on-scroll">
          {{ t('landing.testimonials.title') }}
        </h2>
        <div class="mt-12 grid gap-8 md:grid-cols-3">
          <div
            v-for="(tm, i) in testimonials"
            :key="tm.name"
            class="animate-on-scroll group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-900"
            :style="{ transitionDelay: `${i * 100}ms` }"
          >
            <div class="flex items-center gap-3">
              <div :class="['flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white', tm.gradient]">
                {{ tm.initials }}
              </div>
              <div>
                <p class="font-semibold text-gray-900 dark:text-white">{{ tm.name }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">{{ tm.role }}</p>
              </div>
            </div>
            <p class="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400 italic">
              "{{ tm.quote }}"
            </p>
            <div class="mt-3 flex gap-0.5">
              <UIcon v-for="n in 5" :key="n" name="i-lucide-star" class="h-4 w-4 text-amber-400" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Headline -->
    <section class="bg-gray-50 dark:bg-gray-900/50">
      <div class="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div class="animate-on-scroll text-center">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            <span class="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">{{ t('landing.statsHeadline') }}</span>
          </h2>
          <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div class="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900 transition-transform duration-300 hover:scale-105">
              <UIcon name="i-lucide-bar-chart-3" class="mx-auto h-8 w-8 text-emerald-500" />
              <p class="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">Real-time analitika</p>
            </div>
            <div class="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900 transition-transform duration-300 hover:scale-105">
              <UIcon name="i-lucide-file-text" class="mx-auto h-8 w-8 text-amber-500" />
              <p class="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">Professional media-kit</p>
            </div>
            <div class="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900 transition-transform duration-300 hover:scale-105">
              <UIcon name="i-lucide-users" class="mx-auto h-8 w-8 text-blue-500" />
              <p class="mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">Kreatorlar katalogi</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900">
      <div class="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8 animate-on-scroll">
        <h2 class="text-3xl font-bold text-white sm:text-4xl">
          {{ t('landing.ctaTitle') }}
        </h2>
        <p class="mt-4 text-lg text-gray-300">
          {{ t('landing.ctaSubtitle') }}
        </p>
        <div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <UButton to="/auth/login" size="xl" class="shadow-lg shadow-emerald-500/25">
            <UIcon name="i-lucide-arrow-right" class="mr-2 h-5 w-5" />
            {{ t('landing.ctaButton') }}
          </UButton>
          <UButton to="/creators" variant="outline" size="xl" color="neutral" class="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
            {{ t('landing.browse') }}
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
.scroll-animations-enabled .animate-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.scroll-animations-enabled .animate-on-scroll.animate-in {
  opacity: 1;
  transform: translateY(0);
}
</style>
