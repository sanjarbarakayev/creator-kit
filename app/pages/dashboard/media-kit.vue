<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { t } = useI18n()
const toast = useToast()

type Template = 'minimal' | 'professional' | 'creative'
const selectedTemplate = ref<Template>('minimal')

const templates = computed(() => [
  {
    id: 'minimal' as Template,
    label: t('mediakit.templateMinimal'),
    description: t('mediakit.templateMinimalDesc'),
    icon: 'i-lucide-minus',
    preview: 'from-zinc-700/40 to-zinc-800/30',
    accent: '#a1a1aa',
  },
  {
    id: 'professional' as Template,
    label: t('mediakit.templateProfessional'),
    description: t('mediakit.templateProfessionalDesc'),
    icon: 'i-lucide-briefcase',
    preview: 'from-blue-700/40 to-indigo-800/30',
    accent: '#60a5fa',
  },
  {
    id: 'creative' as Template,
    label: t('mediakit.templateCreative'),
    description: t('mediakit.templateCreativeDesc'),
    icon: 'i-lucide-palette',
    preview: 'from-violet-700/40 to-pink-800/30',
    accent: '#a78bfa',
  },
])

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

function addPortfolioUrl() { form.portfolioUrls.push('') }
function removePortfolioUrl(index: number) { form.portfolioUrls.splice(index, 1) }

const mockAnalytics = { followers: 12450, engagementRate: 4.2, avgLikes: 523, avgComments: 47 }

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
  catch { toast.add({ title: t('mediakit.error'), color: 'error' }) }
  finally { saving.value = false }
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
    if (result.url) window.open(result.url, '_blank')
    toast.add({ title: t('mediakit.pdfGenerated'), color: 'success' })
  }
  catch { toast.add({ title: t('mediakit.error'), color: 'error' }) }
  finally { generating.value = false }
}

function copyPublicLink() {
  const link = `${window.location.origin}/mediakit/preview`
  navigator.clipboard.writeText(link)
  toast.add({ title: t('mediakit.linkCopied'), color: 'success' })
}

const previewStyles = computed(() => {
  switch (selectedTemplate.value) {
    case 'professional':
      return { bg: 'bg-gradient-to-br from-blue-950 to-indigo-950', accent: 'text-blue-400', border: 'border-blue-800/50', badge: 'bg-blue-500/15 text-blue-300 border-blue-500/20', accentHex: '#60a5fa' }
    case 'creative':
      return { bg: 'bg-gradient-to-br from-violet-950 to-fuchsia-950', accent: 'text-violet-400', border: 'border-violet-800/50', badge: 'bg-violet-500/15 text-violet-300 border-violet-500/20', accentHex: '#a78bfa' }
    default:
      return { bg: 'bg-zinc-900', accent: 'text-white', border: 'border-zinc-700/50', badge: 'bg-zinc-700/50 text-zinc-300 border-zinc-600/30', accentHex: '#a1a1aa' }
  }
})
</script>

<template>
  <div class="space-y-6">
    <!-- ── Header ────────────────────────────────────────────── -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white">{{ t('mediakit.title') }}</h1>
        <p class="mt-1 text-sm text-white/40">{{ t('mediakit.subtitle') }}</p>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          class="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/60 hover:text-white/90 transition-all"
          @click="copyPublicLink"
        >
          <UIcon name="i-lucide-link" class="size-3.5" />
          {{ t('mediakit.copyLink') }}
        </button>
        <button
          class="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/60 hover:text-white/90 transition-all"
          :disabled="generating"
          @click="downloadPdf"
        >
          <UIcon :name="generating ? 'i-lucide-loader-circle' : 'i-lucide-download'" :class="['size-3.5', generating && 'animate-spin']" />
          {{ t('mediakit.downloadPdf') }}
        </button>
        <button
          class="btn-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold"
          :disabled="saving"
          @click="saveMediaKit"
        >
          <UIcon :name="saving ? 'i-lucide-loader-circle' : 'i-lucide-save'" :class="['size-3.5', saving && 'animate-spin']" />
          {{ t('mediakit.save') }}
        </button>
      </div>
    </div>

    <!-- ── Template Selector ─────────────────────────────────── -->
    <div>
      <p class="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">{{ t('mediakit.chooseTemplate') }}</p>
      <div class="grid grid-cols-3 gap-4">
        <button
          v-for="tmpl in templates"
          :key="tmpl.id"
          class="relative rounded-2xl border-2 p-4 text-left transition-all duration-200 cursor-pointer"
          :class="selectedTemplate === tmpl.id
            ? 'border-violet-500 ring-2 ring-violet-500/20 bg-violet-500/5'
            : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15'"
          @click="selectedTemplate = tmpl.id"
        >
          <!-- Selected indicator -->
          <div v-if="selectedTemplate === tmpl.id" class="absolute top-3 right-3 h-5 w-5 rounded-full bg-violet-600 flex items-center justify-center">
            <UIcon name="i-lucide-check" class="h-3 w-3 text-white" />
          </div>
          <div :class="`mb-3 h-16 rounded-xl bg-gradient-to-br ${tmpl.preview} flex items-center justify-center border border-white/[0.06]`">
            <UIcon :name="tmpl.icon" class="size-6 text-white/50" />
          </div>
          <p class="text-sm font-semibold text-white">{{ tmpl.label }}</p>
          <p class="mt-1 text-xs text-white/35">{{ tmpl.description }}</p>
        </button>
      </div>
    </div>

    <!-- ── Editor + Preview ─────────────────────────────────── -->
    <div class="grid gap-6 lg:grid-cols-5">
      <!-- Editor (3/5) -->
      <div class="space-y-5 lg:col-span-3">

        <!-- Basic Info -->
        <div class="glass-card p-5 space-y-4">
          <div class="flex items-center gap-2 mb-1">
            <div class="h-5 w-5 rounded bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
              <UIcon name="i-lucide-user" class="h-3 w-3 text-white" />
            </div>
            <h3 class="text-sm font-semibold text-white">{{ t('mediakit.basicInfo') }}</h3>
          </div>
          <div>
            <label class="block text-xs text-white/50 mb-1.5 font-medium">{{ t('mediakit.tagline') }}</label>
            <input
              v-model="form.tagline"
              :placeholder="t('mediakit.taglinePlaceholder')"
              class="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/30 transition-all"
            />
          </div>
          <div>
            <label class="block text-xs text-white/50 mb-1.5 font-medium">{{ t('mediakit.bio') }}</label>
            <textarea
              v-model="form.bio"
              :placeholder="t('mediakit.bioPlaceholder')"
              rows="4"
              class="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/30 transition-all resize-none"
            />
          </div>
        </div>

        <!-- Portfolio URLs -->
        <div class="glass-card p-5 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="h-5 w-5 rounded bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                <UIcon name="i-lucide-link" class="h-3 w-3 text-white" />
              </div>
              <h3 class="text-sm font-semibold text-white">{{ t('mediakit.portfolio') }}</h3>
            </div>
            <button
              class="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-white/60 hover:text-white/90 transition-all"
              @click="addPortfolioUrl"
            >
              <UIcon name="i-lucide-plus" class="h-3 w-3" />
              {{ t('mediakit.addUrl') }}
            </button>
          </div>
          <div v-for="(_, index) in form.portfolioUrls" :key="index" class="flex gap-2">
            <input
              v-model="form.portfolioUrls[index]"
              placeholder="https://"
              class="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
            />
            <button
              v-if="form.portfolioUrls.length > 1"
              class="flex-shrink-0 rounded-xl border border-red-500/20 bg-red-500/10 px-3 text-red-400 hover:bg-red-500/20 transition-all"
              @click="removePortfolioUrl(index)"
            >
              <UIcon name="i-lucide-trash-2" class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Pricing -->
        <div class="glass-card p-5 space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="h-5 w-5 rounded bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <UIcon name="i-lucide-dollar-sign" class="h-3 w-3 text-white" />
              </div>
              <h3 class="text-sm font-semibold text-white">{{ t('mediakit.pricing') }}</h3>
            </div>
            <UToggle v-model="form.showPricing" />
          </div>
          <div v-if="form.showPricing" class="grid grid-cols-2 gap-4">
            <div v-for="[key, placeholder] in [['story','$50'],['post','$100'],['reel','$200'],['package','$500']]" :key="key">
              <label class="block text-xs text-white/50 mb-1.5 font-medium">{{ t(`mediakit.pricing${key.charAt(0).toUpperCase() + key.slice(1)}`) }}</label>
              <input
                v-model="(form.pricing as any)[key]"
                :placeholder="placeholder"
                class="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
              />
            </div>
          </div>
        </div>

        <!-- Analytics Toggle -->
        <div class="glass-card p-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold text-white">{{ t('mediakit.includeAnalytics') }}</p>
              <p class="mt-1 text-xs text-white/35">{{ t('mediakit.includeAnalyticsDesc') }}</p>
            </div>
            <UToggle v-model="form.includeAnalytics" />
          </div>
        </div>
      </div>

      <!-- Live Preview (2/5) -->
      <div class="lg:col-span-2">
        <div class="sticky top-6">
          <div class="flex items-center gap-2 mb-3">
            <div class="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            <p class="text-xs font-medium text-white/40">{{ t('mediakit.preview') }}</p>
          </div>

          <div :class="[previewStyles.bg, 'rounded-2xl border overflow-hidden shadow-2xl', previewStyles.border]">
            <!-- Header -->
            <div class="p-6 text-center border-b" :class="previewStyles.border">
              <!-- Avatar placeholder -->
              <div class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/30 to-indigo-500/20 border border-white/10">
                <UIcon name="i-lucide-user" class="size-6 text-white/40" />
              </div>
              <h4 :class="['text-base font-bold', previewStyles.accent]">
                {{ form.tagline || t('mediakit.previewTagline') }}
              </h4>
              <p class="mt-2 text-xs text-white/40 leading-relaxed">
                {{ form.bio || t('mediakit.previewBio') }}
              </p>
              <!-- Template badge -->
              <span :class="['mt-3 inline-block rounded-full border px-3 py-0.5 text-[10px] font-medium', previewStyles.badge]">
                {{ selectedTemplate }} template
              </span>
            </div>

            <!-- Analytics -->
            <div v-if="form.includeAnalytics" class="px-5 py-4 border-b" :class="previewStyles.border">
              <p class="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-3">Analytics</p>
              <div class="grid grid-cols-2 gap-2.5">
                <div v-for="[val, label] in [
                  [mockAnalytics.followers.toLocaleString(), t('mediakit.previewFollowers')],
                  [mockAnalytics.engagementRate + '%', t('mediakit.previewER')],
                  [mockAnalytics.avgLikes.toString(), t('mediakit.previewAvgLikes')],
                  [mockAnalytics.avgComments.toString(), t('mediakit.previewAvgComments')],
                ]" :key="label" class="rounded-xl bg-white/[0.05] border border-white/[0.06] p-3 text-center">
                  <p class="text-sm font-bold text-white">{{ val }}</p>
                  <p class="text-[10px] text-white/35 mt-0.5">{{ label }}</p>
                </div>
              </div>
            </div>

            <!-- Top Posts thumbnails -->
            <div v-if="form.includeAnalytics" class="px-5 py-4 border-b" :class="previewStyles.border">
              <p class="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-3">{{ t('mediakit.previewTopPosts') }}</p>
              <div class="grid grid-cols-3 gap-2">
                <div
                  v-for="i in 3"
                  :key="i"
                  class="aspect-square rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center"
                >
                  <UIcon name="i-lucide-image" class="size-4 text-white/20" />
                </div>
              </div>
            </div>

            <!-- Pricing -->
            <div v-if="form.showPricing && (form.pricing.story || form.pricing.post || form.pricing.reel || form.pricing.package)" class="px-5 py-4 border-b" :class="previewStyles.border">
              <p class="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-3">{{ t('mediakit.pricing') }}</p>
              <div class="space-y-2">
                <div v-if="form.pricing.story" class="flex items-center justify-between">
                  <span class="text-xs text-white/40">Instagram Story</span>
                  <span :class="['text-xs font-semibold', previewStyles.accent]">{{ form.pricing.story }}</span>
                </div>
                <div v-if="form.pricing.post" class="flex items-center justify-between">
                  <span class="text-xs text-white/40">Instagram Post</span>
                  <span :class="['text-xs font-semibold', previewStyles.accent]">{{ form.pricing.post }}</span>
                </div>
                <div v-if="form.pricing.reel" class="flex items-center justify-between">
                  <span class="text-xs text-white/40">Instagram Reel</span>
                  <span :class="['text-xs font-semibold', previewStyles.accent]">{{ form.pricing.reel }}</span>
                </div>
                <div v-if="form.pricing.package" class="flex items-center justify-between border-t pt-2" :class="previewStyles.border">
                  <span class="text-xs font-medium text-white/60">{{ t('mediakit.pricingPackage') }}</span>
                  <span :class="['text-xs font-bold', previewStyles.accent]">{{ form.pricing.package }}</span>
                </div>
              </div>
            </div>

            <!-- Portfolio Links -->
            <div v-if="form.portfolioUrls.some(u => u.trim())" class="px-5 py-4" >
              <p class="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-3">{{ t('mediakit.portfolio') }}</p>
              <div class="space-y-1.5">
                <a
                  v-for="(url, i) in form.portfolioUrls.filter(u => u.trim())"
                  :key="i"
                  :href="url"
                  target="_blank"
                  :class="['block truncate text-xs hover:underline', previewStyles.accent]"
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
