<script setup lang="ts">
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
</script>

<template>
  <div v-if="creator" class="max-w-4xl mx-auto py-8 px-4">
    <!-- Hero -->
    <div class="flex flex-col sm:flex-row items-center gap-6 mb-8">
      <div class="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary shrink-0">
        {{ creator.full_name?.charAt(0) || '?' }}
      </div>
      <div class="text-center sm:text-left">
        <h1 class="text-3xl font-bold">{{ creator.full_name }}</h1>
        <p class="text-gray-500 text-lg">@{{ creator.username }}</p>
        <p v-if="creator.bio" class="mt-2 text-gray-600 dark:text-gray-400">{{ creator.bio }}</p>
        <div class="flex flex-wrap gap-1.5 mt-3 justify-center sm:justify-start">
          <UBadge v-for="niche in (creator.niches || [])" :key="niche" variant="subtle">
            {{ t(`onboarding.niches.${niche}`) }}
          </UBadge>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <UCard v-for="stat in creator.stats" :key="stat.label">
        <div class="text-center">
          <p class="text-2xl font-bold text-primary">{{ stat.value }}</p>
          <p class="text-sm text-gray-500">{{ stat.label }}</p>
        </div>
      </UCard>
    </div>

    <!-- Platforms -->
    <UCard class="mb-8">
      <template #header>
        <h2 class="font-semibold">{{ t('creatorProfile.platforms') }}</h2>
      </template>
      <div v-if="creator.social_accounts?.length" class="flex flex-wrap gap-3">
        <div v-for="account in creator.social_accounts" :key="account.id" class="flex items-center gap-2">
          <UBadge :color="account.platform === 'instagram' ? 'error' : 'info'" size="lg">
            {{ account.platform }}
          </UBadge>
          <span>@{{ account.username }} · {{ formatFollowers(account.followers_count) }}</span>
        </div>
      </div>
      <p v-else class="text-gray-500 text-sm">{{ t('creatorProfile.noPlatforms') }}</p>
    </UCard>

    <!-- Media Kit Button -->
    <div class="text-center">
      <UButton
        v-if="creator.media_kit_slug"
        size="lg"
        color="primary"
        :to="`/kit/${creator.media_kit_slug}`"
      >
        {{ t('creatorProfile.viewMediaKit') }}
      </UButton>
    </div>
  </div>
</template>
