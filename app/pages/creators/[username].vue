<script setup lang="ts">
definePageMeta({ auth: false })

const { t } = useI18n()
const route = useRoute()

const { data: creator, error } = await useAsyncData(
  `creator-${route.params.username}`,
  () => $fetch(`/api/creators/${route.params.username}`)
)

if (error.value || !creator.value) {
  throw createError({ statusCode: 404, statusMessage: 'Creator not found' })
}

useHead({
  title: `${creator.value.full_name} (@${creator.value.username})`,
  meta: [
    { name: 'description', content: creator.value.bio || `${creator.value.full_name} on CreatorKit` },
  ],
})

function formatFollowers(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K'
  return n.toString()
}

const nicheIcons: Record<string, string> = {
  beauty: '💄', tech: '💻', food: '🍕', travel: '✈️',
  education: '📚', fashion: '👗', lifestyle: '🌿',
  entertainment: '🎬', sports: '⚽', health: '💪',
}
</script>

<template>
  <div v-if="creator" class="min-h-screen bg-[#0d0d1a]">
    <!-- Hero section -->
    <div class="relative overflow-hidden">
      <!-- Gradient backdrop -->
      <div class="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-transparent to-[#0d0d1a]" />
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-violet-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div class="relative mx-auto max-w-4xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <!-- Back link -->
        <NuxtLink
          to="/creators"
          class="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors mb-8"
        >
          <UIcon name="i-lucide-arrow-left" class="h-4 w-4" />
          Creator Directory
        </NuxtLink>

        <!-- Profile header -->
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <!-- Avatar -->
          <div class="relative flex-shrink-0">
            <div class="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-violet-500/25">
              {{ creator.full_name?.charAt(0) || '?' }}
            </div>
            <div class="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-[#0d0d1a] bg-green-400" />
          </div>

          <!-- Name + info -->
          <div class="text-center sm:text-left flex-1">
            <h1 class="text-3xl font-extrabold text-white">{{ creator.full_name }}</h1>
            <p class="text-white/45 text-base mt-0.5">@{{ creator.username }}</p>
            <p v-if="creator.bio" class="mt-3 text-white/60 text-sm leading-relaxed max-w-lg">{{ creator.bio }}</p>
            <div class="flex flex-wrap gap-1.5 mt-4 justify-center sm:justify-start">
              <span v-for="niche in (creator.niches || [])" :key="niche" class="niche-badge">
                {{ nicheIcons[niche] || '' }} {{ t(`onboarding.niches.${niche}`) }}
              </span>
            </div>
          </div>

          <!-- CTA -->
          <div class="flex-shrink-0">
            <NuxtLink
              v-if="creator.media_kit_slug"
              :to="`/kit/${creator.media_kit_slug}`"
              class="btn-gradient inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold"
            >
              <UIcon name="i-lucide-file-text" class="h-4 w-4" />
              {{ t('creatorProfile.viewMediaKit') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats + Details -->
    <div class="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8 space-y-6">
      <!-- Stat cards -->
      <div v-if="creator.stats?.length" class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          v-for="(stat, i) in creator.stats"
          :key="stat.label"
          :class="[
            'glass-card p-5 text-center',
            i === 0 ? 'stat-glow-purple' : i === 1 ? 'stat-glow-pink' : i === 2 ? 'stat-glow-blue' : 'stat-glow-orange',
          ]"
        >
          <p class="text-2xl font-extrabold gradient-text">{{ stat.value }}</p>
          <p class="text-xs text-white/40 mt-1">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Platforms -->
      <div class="glass-card p-6">
        <h2 class="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <UIcon name="i-lucide-link-2" class="h-4 w-4 text-violet-400" />
          {{ t('creatorProfile.platforms') }}
        </h2>
        <div v-if="creator.social_accounts?.length" class="flex flex-wrap gap-3">
          <div
            v-for="account in creator.social_accounts"
            :key="account.id"
            class="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3"
          >
            <div
              class="flex h-8 w-8 items-center justify-center rounded-lg"
              :class="account.platform === 'instagram'
                ? 'bg-gradient-to-br from-pink-500 to-orange-500'
                : 'bg-gradient-to-br from-blue-500 to-cyan-500'"
            >
              <UIcon
                :name="account.platform === 'instagram' ? 'i-lucide-instagram' : 'i-lucide-music'"
                class="h-4 w-4 text-white"
              />
            </div>
            <div>
              <p class="text-xs font-medium text-white">@{{ account.username }}</p>
              <p class="text-[10px] text-white/40">{{ formatFollowers(account.followers_count) }} followers</p>
            </div>
          </div>
        </div>
        <p v-else class="text-sm text-white/35">{{ t('creatorProfile.noPlatforms') }}</p>
      </div>
    </div>
  </div>
</template>
