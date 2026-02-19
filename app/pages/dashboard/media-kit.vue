<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()
const toast = useToast()

// Template selection
type Template = 'minimal' | 'professional' | 'creative'
const selectedTemplate = ref<Template>('minimal')

const templates = computed(() => [
  {
    id: 'minimal' as Template,
    label: t('mediakit.templateMinimal'),
    description: t('mediakit.templateMinimalDesc'),
    icon: 'i-lucide-minus',
    colors: 'from-zinc-800 to-zinc-900',
  },
  {
    id: 'professional' as Template,
    label: t('mediakit.templateProfessional'),
    description: t('mediakit.templateProfessionalDesc'),
    icon: 'i-lucide-briefcase',
    colors: 'from-blue-900 to-indigo-900',
  },
  {
    id: 'creative' as Template,
    label: t('mediakit.templateCreative'),
    description: t('mediakit.templateCreativeDesc'),
    icon: 'i-lucide-palette',
    colors: 'from-purple-900 to-pink-900',
  },
])

// Form state
const form = reactive({
  tagline: '',
  bio: '',
  portfolioUrls: [''] as string[],
  pricing: {
    story: '',
    post: '',
    reel: '',
    package: '',
  },
  showPricing: true,
  includeAnalytics: true,
})

function addPortfolioUrl() {
  form.portfolioUrls.push('')
}

function removePortfolioUrl(index: number) {
  form.portfolioUrls.splice(index, 1)
}

// Mock analytics for preview
const mockAnalytics = {
  followers: 12450,
  engagementRate: 4.2,
  avgLikes: 523,
  avgComments: 47,
}

// Actions
const saving = ref(false)
const generating = ref(false)

async function saveMediaKit() {
  saving.value = true
  try {
    await $fetch('/api/mediakit/save', {
      method: 'POST',
      body: {
        template: selectedTemplate.value,
        customData: {
          tagline: form.tagline,
          bio: form.bio,
          portfolioUrls: form.portfolioUrls.filter(u => u.trim()),
          pricing: form.pricing,
          showPricing: form.showPricing,
        },
        includeAnalytics: form.includeAnalytics,
      },
    })
    toast.add({ title: t('mediakit.saved'), color: 'success' })
  }
  catch {
    toast.add({ title: t('mediakit.error'), color: 'error' })
  }
  finally {
    saving.value = false
  }
}

async function downloadPdf() {
  generating.value = true
  try {
    const result = await $fetch<{ url: string }>('/api/mediakit/generate', {
      method: 'POST',
      body: {
        template: selectedTemplate.value,
        customData: {
          tagline: form.tagline,
          bio: form.bio,
          portfolioUrls: form.portfolioUrls.filter(u => u.trim()),
          pricing: form.pricing,
          showPricing: form.showPricing,
        },
        includeAnalytics: form.includeAnalytics,
        analytics: form.includeAnalytics ? mockAnalytics : null,
      },
    })
    if (result.url) {
      window.open(result.url, '_blank')
    }
    toast.add({ title: t('mediakit.pdfGenerated'), color: 'success' })
  }
  catch {
    toast.add({ title: t('mediakit.error'), color: 'error' })
  }
  finally {
    generating.value = false
  }
}

function copyPublicLink() {
  const link = `${window.location.origin}/mediakit/preview`
  navigator.clipboard.writeText(link)
  toast.add({ title: t('mediakit.linkCopied'), color: 'success' })
}

// Template-specific styles for preview
const previewStyles = computed(() => {
  switch (selectedTemplate.value) {
    case 'professional':
      return {
        bg: 'bg-gradient-to-br from-blue-950 to-indigo-950',
        accent: 'text-blue-400',
        border: 'border-blue-800',
        badge: 'bg-blue-500/20 text-blue-300',
      }
    case 'creative':
      return {
        bg: 'bg-gradient-to-br from-purple-950 to-pink-950',
        accent: 'text-purple-400',
        border: 'border-purple-800',
        badge: 'bg-purple-500/20 text-purple-300',
      }
    default:
      return {
        bg: 'bg-zinc-900',
        accent: 'text-white',
        border: 'border-zinc-700',
        badge: 'bg-zinc-700 text-zinc-300',
      }
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">{{ t('mediakit.title') }}</h1>
        <p class="mt-1 text-sm text-zinc-400">{{ t('mediakit.subtitle') }}</p>
      </div>
      <div class="flex gap-2">
        <UButton variant="outline" color="neutral" icon="i-lucide-link" @click="copyPublicLink">
          {{ t('mediakit.copyLink') }}
        </UButton>
        <UButton variant="soft" color="neutral" icon="i-lucide-download" :loading="generating" @click="downloadPdf">
          {{ t('mediakit.downloadPdf') }}
        </UButton>
        <UButton color="primary" icon="i-lucide-save" :loading="saving" @click="saveMediaKit">
          {{ t('mediakit.save') }}
        </UButton>
      </div>
    </div>

    <!-- Template Selector -->
    <div>
      <h2 class="mb-3 text-sm font-medium text-zinc-400">{{ t('mediakit.chooseTemplate') }}</h2>
      <div class="grid grid-cols-3 gap-4">
        <div
          v-for="tmpl in templates"
          :key="tmpl.id"
          class="cursor-pointer rounded-xl border-2 p-4 transition-all"
          :class="selectedTemplate === tmpl.id
            ? 'border-primary-500 ring-2 ring-primary-500/20'
            : 'border-zinc-800 hover:border-zinc-600'"
          @click="selectedTemplate = tmpl.id"
        >
          <div :class="['mb-3 h-20 rounded-lg bg-gradient-to-br', tmpl.colors, 'flex items-center justify-center']">
            <UIcon :name="tmpl.icon" class="size-8 text-white/60" />
          </div>
          <p class="font-medium text-white">{{ tmpl.label }}</p>
          <p class="mt-1 text-xs text-zinc-500">{{ tmpl.description }}</p>
        </div>
      </div>
    </div>

    <!-- Editor + Preview -->
    <div class="grid gap-6 lg:grid-cols-5">
      <!-- Editor Form (60%) -->
      <div class="space-y-6 lg:col-span-3">
        <!-- Tagline -->
        <UCard class="border-zinc-800 bg-zinc-900">
          <div class="space-y-4">
            <h3 class="text-sm font-medium text-white">{{ t('mediakit.basicInfo') }}</h3>
            <div>
              <label class="mb-1.5 block text-xs text-zinc-400">{{ t('mediakit.tagline') }}</label>
              <UInput v-model="form.tagline" :placeholder="t('mediakit.taglinePlaceholder')" />
            </div>
            <div>
              <label class="mb-1.5 block text-xs text-zinc-400">{{ t('mediakit.bio') }}</label>
              <UTextarea v-model="form.bio" :placeholder="t('mediakit.bioPlaceholder')" :rows="4" />
            </div>
          </div>
        </UCard>

        <!-- Portfolio URLs -->
        <UCard class="border-zinc-800 bg-zinc-900">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-medium text-white">{{ t('mediakit.portfolio') }}</h3>
              <UButton size="xs" variant="soft" icon="i-lucide-plus" @click="addPortfolioUrl">
                {{ t('mediakit.addUrl') }}
              </UButton>
            </div>
            <div v-for="(_, index) in form.portfolioUrls" :key="index" class="flex gap-2">
              <UInput v-model="form.portfolioUrls[index]" placeholder="https://" class="flex-1" />
              <UButton
                v-if="form.portfolioUrls.length > 1"
                icon="i-lucide-trash-2"
                variant="ghost"
                color="error"
                size="xs"
                @click="removePortfolioUrl(index)"
              />
            </div>
          </div>
        </UCard>

        <!-- Pricing -->
        <UCard class="border-zinc-800 bg-zinc-900">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-medium text-white">{{ t('mediakit.pricing') }}</h3>
              <UToggle v-model="form.showPricing" />
            </div>
            <div v-if="form.showPricing" class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1.5 block text-xs text-zinc-400">{{ t('mediakit.pricingStory') }}</label>
                <UInput v-model="form.pricing.story" placeholder="$50" />
              </div>
              <div>
                <label class="mb-1.5 block text-xs text-zinc-400">{{ t('mediakit.pricingPost') }}</label>
                <UInput v-model="form.pricing.post" placeholder="$100" />
              </div>
              <div>
                <label class="mb-1.5 block text-xs text-zinc-400">{{ t('mediakit.pricingReel') }}</label>
                <UInput v-model="form.pricing.reel" placeholder="$200" />
              </div>
              <div>
                <label class="mb-1.5 block text-xs text-zinc-400">{{ t('mediakit.pricingPackage') }}</label>
                <UInput v-model="form.pricing.package" placeholder="$500" />
              </div>
            </div>
          </div>
        </UCard>

        <!-- Analytics Toggle -->
        <UCard class="border-zinc-800 bg-zinc-900">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-sm font-medium text-white">{{ t('mediakit.includeAnalytics') }}</h3>
              <p class="mt-1 text-xs text-zinc-500">{{ t('mediakit.includeAnalyticsDesc') }}</p>
            </div>
            <UToggle v-model="form.includeAnalytics" />
          </div>
        </UCard>
      </div>

      <!-- Live Preview (40%) -->
      <div class="lg:col-span-2">
        <div class="sticky top-6">
          <h3 class="mb-3 text-sm font-medium text-zinc-400">{{ t('mediakit.preview') }}</h3>
          <div
            :class="[previewStyles.bg, 'rounded-2xl border', previewStyles.border, 'overflow-hidden']"
          >
            <!-- Preview Header -->
            <div class="p-6 text-center">
              <div class="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-white/10">
                <UIcon name="i-lucide-user" class="size-8 text-white/60" />
              </div>
              <h4 :class="['text-lg font-bold', previewStyles.accent]">
                {{ form.tagline || t('mediakit.previewTagline') }}
              </h4>
              <p class="mt-2 text-sm text-zinc-400">
                {{ form.bio || t('mediakit.previewBio') }}
              </p>
            </div>

            <!-- Analytics Section -->
            <div v-if="form.includeAnalytics" class="border-t px-6 py-4" :class="previewStyles.border">
              <div class="grid grid-cols-2 gap-3">
                <div class="rounded-lg bg-white/5 p-3 text-center">
                  <p class="text-lg font-bold text-white">{{ mockAnalytics.followers.toLocaleString() }}</p>
                  <p class="text-xs text-zinc-500">{{ t('mediakit.previewFollowers') }}</p>
                </div>
                <div class="rounded-lg bg-white/5 p-3 text-center">
                  <p class="text-lg font-bold text-white">{{ mockAnalytics.engagementRate }}%</p>
                  <p class="text-xs text-zinc-500">{{ t('mediakit.previewER') }}</p>
                </div>
                <div class="rounded-lg bg-white/5 p-3 text-center">
                  <p class="text-lg font-bold text-white">{{ mockAnalytics.avgLikes }}</p>
                  <p class="text-xs text-zinc-500">{{ t('mediakit.previewAvgLikes') }}</p>
                </div>
                <div class="rounded-lg bg-white/5 p-3 text-center">
                  <p class="text-lg font-bold text-white">{{ mockAnalytics.avgComments }}</p>
                  <p class="text-xs text-zinc-500">{{ t('mediakit.previewAvgComments') }}</p>
                </div>
              </div>
            </div>

            <!-- Top Posts Thumbnails -->
            <div v-if="form.includeAnalytics" class="border-t px-6 py-4" :class="previewStyles.border">
              <p class="mb-2 text-xs font-medium text-zinc-400">{{ t('mediakit.previewTopPosts') }}</p>
              <div class="grid grid-cols-3 gap-2">
                <div v-for="i in 3" :key="i" class="aspect-square rounded-lg bg-white/5 flex items-center justify-center">
                  <UIcon name="i-lucide-image" class="size-5 text-zinc-600" />
                </div>
              </div>
            </div>

            <!-- Pricing Section -->
            <div v-if="form.showPricing" class="border-t px-6 py-4" :class="previewStyles.border">
              <p class="mb-3 text-xs font-medium text-zinc-400">{{ t('mediakit.pricing') }}</p>
              <div class="space-y-2">
                <div v-if="form.pricing.story" class="flex items-center justify-between">
                  <span class="text-sm text-zinc-400">Instagram Story</span>
                  <span :class="['text-sm font-medium', previewStyles.accent]">{{ form.pricing.story }}</span>
                </div>
                <div v-if="form.pricing.post" class="flex items-center justify-between">
                  <span class="text-sm text-zinc-400">Instagram Post</span>
                  <span :class="['text-sm font-medium', previewStyles.accent]">{{ form.pricing.post }}</span>
                </div>
                <div v-if="form.pricing.reel" class="flex items-center justify-between">
                  <span class="text-sm text-zinc-400">Instagram Reel</span>
                  <span :class="['text-sm font-medium', previewStyles.accent]">{{ form.pricing.reel }}</span>
                </div>
                <div v-if="form.pricing.package" class="flex items-center justify-between border-t pt-2" :class="previewStyles.border">
                  <span class="text-sm font-medium text-zinc-300">{{ t('mediakit.pricingPackage') }}</span>
                  <span :class="['text-sm font-bold', previewStyles.accent]">{{ form.pricing.package }}</span>
                </div>
              </div>
            </div>

            <!-- Portfolio Links -->
            <div v-if="form.portfolioUrls.some(u => u.trim())" class="border-t px-6 py-4" :class="previewStyles.border">
              <p class="mb-2 text-xs font-medium text-zinc-400">{{ t('mediakit.portfolio') }}</p>
              <div class="space-y-1.5">
                <a
                  v-for="(url, i) in form.portfolioUrls.filter(u => u.trim())"
                  :key="i"
                  :href="url"
                  target="_blank"
                  :class="['block truncate text-sm', previewStyles.accent, 'hover:underline']"
                >
                  {{ url }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
