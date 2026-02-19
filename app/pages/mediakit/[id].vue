<script setup lang="ts">
definePageMeta({
  layout: 'public',
})

const { t } = useI18n()
const route = useRoute()
const id = route.params.id as string

const { data: mediaKit, error } = await useFetch(`/api/mediakit/${id}`)

// Increment view count
if (!error.value) {
  await $fetch(`/api/mediakit/${id}/view`, { method: 'POST' }).catch(() => {})
}

const downloading = ref(false)

async function downloadPdf() {
  downloading.value = true
  try {
    await $fetch(`/api/mediakit/${id}/download`, { method: 'POST' })
    // If the media kit has a PDF URL, open it
    if (mediaKit.value?.pdfUrl) {
      window.open(mediaKit.value.pdfUrl, '_blank')
    }
  }
  catch {
    // fallback
  }
  finally {
    downloading.value = false
  }
}

const customData = computed(() => {
  if (!mediaKit.value?.customData) return null
  return mediaKit.value.customData as {
    tagline?: string
    bio?: string
    portfolioUrls?: string[]
    pricing?: { story?: string; post?: string; reel?: string; package?: string }
    showPricing?: boolean
  }
})

const templateStyles = computed(() => {
  switch (mediaKit.value?.template) {
    case 'professional':
      return { bg: 'bg-gradient-to-br from-blue-950 to-indigo-950', accent: 'text-blue-400', border: 'border-blue-800' }
    case 'creative':
      return { bg: 'bg-gradient-to-br from-purple-950 to-pink-950', accent: 'text-purple-400', border: 'border-purple-800' }
    default:
      return { bg: 'bg-zinc-900', accent: 'text-white', border: 'border-zinc-700' }
  }
})

// SEO
useHead({
  title: customData.value?.tagline || 'Media Kit',
  meta: [
    { name: 'description', content: customData.value?.bio || 'Creator Media Kit' },
  ],
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
    <div v-if="error" class="text-center">
      <UIcon name="i-lucide-file-x" class="mx-auto mb-4 size-12 text-zinc-600" />
      <h1 class="text-xl font-bold text-white">{{ t('mediakit.notFound') }}</h1>
      <p class="mt-2 text-sm text-zinc-400">{{ t('mediakit.notFoundDesc') }}</p>
    </div>

    <div v-else-if="mediaKit" class="w-full max-w-lg">
      <div :class="[templateStyles.bg, 'rounded-2xl border overflow-hidden', templateStyles.border]">
        <!-- Header -->
        <div class="p-8 text-center">
          <div class="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-white/10">
            <UIcon name="i-lucide-user" class="size-10 text-white/60" />
          </div>
          <h1 :class="['text-2xl font-bold', templateStyles.accent]">
            {{ customData?.tagline || 'Creator' }}
          </h1>
          <p class="mt-3 text-sm leading-relaxed text-zinc-400">
            {{ customData?.bio }}
          </p>
        </div>

        <!-- Analytics -->
        <div v-if="mediaKit.includeAnalytics" class="border-t px-8 py-6" :class="templateStyles.border">
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-lg bg-white/5 p-4 text-center">
              <p class="text-xl font-bold text-white">12.4K</p>
              <p class="text-xs text-zinc-500">{{ t('mediakit.previewFollowers') }}</p>
            </div>
            <div class="rounded-lg bg-white/5 p-4 text-center">
              <p class="text-xl font-bold text-white">4.2%</p>
              <p class="text-xs text-zinc-500">{{ t('mediakit.previewER') }}</p>
            </div>
          </div>
        </div>

        <!-- Pricing -->
        <div v-if="customData?.showPricing && customData?.pricing" class="border-t px-8 py-6" :class="templateStyles.border">
          <h3 class="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">{{ t('mediakit.pricing') }}</h3>
          <div class="space-y-2.5">
            <div v-if="customData.pricing.story" class="flex justify-between text-sm">
              <span class="text-zinc-400">Instagram Story</span>
              <span :class="['font-medium', templateStyles.accent]">{{ customData.pricing.story }}</span>
            </div>
            <div v-if="customData.pricing.post" class="flex justify-between text-sm">
              <span class="text-zinc-400">Instagram Post</span>
              <span :class="['font-medium', templateStyles.accent]">{{ customData.pricing.post }}</span>
            </div>
            <div v-if="customData.pricing.reel" class="flex justify-between text-sm">
              <span class="text-zinc-400">Instagram Reel</span>
              <span :class="['font-medium', templateStyles.accent]">{{ customData.pricing.reel }}</span>
            </div>
            <div v-if="customData.pricing.package" class="flex justify-between border-t pt-2 text-sm" :class="templateStyles.border">
              <span class="font-medium text-zinc-300">{{ t('mediakit.pricingPackage') }}</span>
              <span :class="['font-bold', templateStyles.accent]">{{ customData.pricing.package }}</span>
            </div>
          </div>
        </div>

        <!-- Portfolio -->
        <div v-if="customData?.portfolioUrls?.length" class="border-t px-8 py-6" :class="templateStyles.border">
          <h3 class="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">{{ t('mediakit.portfolio') }}</h3>
          <div class="space-y-1.5">
            <a
              v-for="(url, i) in customData.portfolioUrls"
              :key="i"
              :href="url"
              target="_blank"
              :class="['block truncate text-sm hover:underline', templateStyles.accent]"
            >
              {{ url }}
            </a>
          </div>
        </div>
      </div>

      <!-- Download button -->
      <div class="mt-6 text-center">
        <UButton icon="i-lucide-download" :loading="downloading" @click="downloadPdf">
          {{ t('mediakit.downloadPdf') }}
        </UButton>
      </div>
    </div>
  </div>
</template>
