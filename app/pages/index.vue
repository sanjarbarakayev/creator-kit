<script setup lang="ts">
definePageMeta({
  layout: 'public',
  auth: false,
})

const { t } = useI18n()

useSeoMeta({
  title: 'CreatorKit — O\'zbek kreatorlar uchun platforma',
  description: 'Instagram va TikTok analitikasi, professional media-kit va kreatorlar katalogi. O\'zbek kreatorlar uchun yagona platforma.',
  ogTitle: 'CreatorKit — O\'zbek kreatorlar uchun platforma',
  ogDescription: 'Instagram va TikTok analitikasi, professional media-kit va kreatorlar katalogi.',
  ogImage: '/og-image.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

const features = computed(() => [
  { icon: 'i-lucide-bar-chart-3', title: t('landing.features.analytics'), desc: t('landing.features.analyticsDesc') },
  { icon: 'i-lucide-file-text', title: t('landing.features.mediaKit'), desc: t('landing.features.mediaKitDesc') },
  { icon: 'i-lucide-search', title: t('landing.features.directory'), desc: t('landing.features.directoryDesc') },
  { icon: 'i-lucide-bot', title: t('landing.features.telegram'), desc: t('landing.features.telegramDesc') },
])

const steps = computed(() => [
  { num: '1', title: t('landing.steps.step1'), icon: 'i-lucide-user-plus' },
  { num: '2', title: t('landing.steps.step2'), icon: 'i-lucide-link' },
  { num: '3', title: t('landing.steps.step3'), icon: 'i-lucide-share-2' },
])

const stats = computed(() => [
  { value: '100+', label: t('landing.stats.creators') },
  { value: '50K+', label: t('landing.stats.followers') },
  { value: '500+', label: t('landing.stats.mediaKits') },
])
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100/50 dark:from-primary-950/20 dark:via-gray-950 dark:to-primary-900/10" />
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(var(--color-primary-400),0.15),transparent)]" />
      <div class="relative mx-auto max-w-5xl px-4 py-28 text-center sm:px-6 sm:py-36 lg:px-8">
        <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
          {{ t('landing.title') }}
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-400">
          {{ t('landing.subtitle') }}
        </p>
        <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <UButton to="/auth/login" size="xl">
            {{ t('landing.cta') }}
          </UButton>
          <UButton to="/creators" variant="outline" size="xl">
            {{ t('landing.browse') }}
          </UButton>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <h2 class="text-center text-3xl font-bold text-gray-900 dark:text-white">
        {{ t('landing.featuresTitle') }}
      </h2>
      <p class="mx-auto mt-4 max-w-2xl text-center text-gray-600 dark:text-gray-400">
        {{ t('landing.featuresSubtitle') }}
      </p>
      <div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <UCard v-for="f in features" :key="f.title" class="text-center">
          <div class="flex flex-col items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-900/30">
              <UIcon :name="f.icon" class="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ f.title }}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ f.desc }}</p>
          </div>
        </UCard>
      </div>
    </section>

    <!-- How It Works -->
    <section class="bg-gray-50 dark:bg-gray-900/50">
      <div class="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 class="text-center text-3xl font-bold text-gray-900 dark:text-white">
          {{ t('landing.howTitle') }}
        </h2>
        <div class="mt-12 grid gap-8 sm:grid-cols-3">
          <div v-for="s in steps" :key="s.num" class="flex flex-col items-center text-center">
            <div class="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-xl font-bold text-white">
              {{ s.num }}
            </div>
            <UIcon :name="s.icon" class="mt-4 h-6 w-6 text-gray-500" />
            <p class="mt-3 text-lg font-medium text-gray-900 dark:text-white">{{ s.title }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <div class="grid grid-cols-3 gap-8 text-center">
        <div v-for="s in stats" :key="s.label">
          <div class="text-4xl font-extrabold text-primary-600 dark:text-primary-400">{{ s.value }}</div>
          <div class="mt-2 text-sm text-gray-600 dark:text-gray-400">{{ s.label }}</div>
        </div>
      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="bg-primary-600 dark:bg-primary-700">
      <div class="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-white">
          {{ t('landing.ctaTitle') }}
        </h2>
        <p class="mt-4 text-lg text-primary-100">
          {{ t('landing.ctaSubtitle') }}
        </p>
        <div class="mt-8">
          <UButton to="/auth/login" color="neutral" size="xl">
            {{ t('landing.ctaButton') }}
          </UButton>
        </div>
      </div>
    </section>
  </div>
</template>
