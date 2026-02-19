<script setup lang="ts">
definePageMeta({ auth: false })

const { t } = useI18n()

const search = ref('')
const selectedNiches = ref<string[]>([])
const selectedPlatform = ref('')
const selectedLanguage = ref('')
const selectedCity = ref('')

const allNiches = ['beauty', 'tech', 'food', 'travel', 'education', 'fashion', 'lifestyle', 'entertainment', 'sports', 'health']
const platforms = [
  { label: 'All', value: '' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'TikTok', value: 'tiktok' },
]
const languageOptions = [
  { label: 'All', value: '' },
  { label: "O'zbekcha", value: 'uz' },
  { label: 'Русский', value: 'ru' },
  { label: 'English', value: 'en' },
]

const mockCreators = [
  { username: 'nodira_style', full_name: 'Nodira Karimova', avatar_url: null, niches: ['beauty', 'fashion'], followers: 125000, er: 4.2, city: 'Tashkent', platforms: ['instagram'] },
  { username: 'tech_sardor', full_name: 'Sardor Alimov', avatar_url: null, niches: ['tech', 'education'], followers: 89000, er: 3.8, city: 'Tashkent', platforms: ['instagram', 'tiktok'] },
  { username: 'foodie_malika', full_name: 'Malika Usmanova', avatar_url: null, niches: ['food', 'lifestyle'], followers: 210000, er: 5.1, city: 'Samarkand', platforms: ['instagram'] },
  { username: 'travel_bobur', full_name: 'Bobur Rahimov', avatar_url: null, niches: ['travel', 'entertainment'], followers: 67000, er: 6.3, city: 'Bukhara', platforms: ['tiktok'] },
  { username: 'fit_dilfuza', full_name: 'Dilfuza Nazarova', avatar_url: null, niches: ['health', 'sports'], followers: 45000, er: 7.1, city: 'Tashkent', platforms: ['instagram'] },
  { username: 'edu_jasur', full_name: 'Jasur Toshmatov', avatar_url: null, niches: ['education', 'tech'], followers: 156000, er: 4.5, city: 'Namangan', platforms: ['instagram', 'tiktok'] },
]

const filteredCreators = computed(() => {
  return mockCreators.filter(c => {
    if (search.value && !c.full_name.toLowerCase().includes(search.value.toLowerCase()) && !c.username.includes(search.value.toLowerCase())) return false
    if (selectedNiches.value.length && !selectedNiches.value.some(n => c.niches.includes(n))) return false
    if (selectedPlatform.value && !c.platforms.includes(selectedPlatform.value)) return false
    if (selectedCity.value && c.city.toLowerCase() !== selectedCity.value.toLowerCase()) return false
    return true
  })
})

function toggleNiche(niche: string) {
  const idx = selectedNiches.value.indexOf(niche)
  if (idx >= 0) selectedNiches.value.splice(idx, 1)
  else selectedNiches.value.push(niche)
}

function formatFollowers(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K'
  return n.toString()
}

useHead({
  title: t('creators.title'),
})
</script>

<template>
  <div class="max-w-7xl mx-auto py-8 px-4">
    <h1 class="text-3xl font-bold mb-2">{{ t('creators.title') }}</h1>
    <p class="text-gray-500 mb-8">{{ t('creators.subtitle') }}</p>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Filters Sidebar -->
      <div class="w-full lg:w-64 space-y-6 shrink-0">
        <UFormField :label="t('creators.search')">
          <UInput v-model="search" :placeholder="t('creators.searchPlaceholder')" icon="i-lucide-search" class="w-full" />
        </UFormField>

        <div>
          <p class="text-sm font-medium mb-2">{{ t('creators.niche') }}</p>
          <div class="flex flex-wrap gap-1.5">
            <UButton
              v-for="niche in allNiches"
              :key="niche"
              :variant="selectedNiches.includes(niche) ? 'solid' : 'outline'"
              :color="selectedNiches.includes(niche) ? 'primary' : 'neutral'"
              size="xs"
              @click="toggleNiche(niche)"
            >
              {{ t(`onboarding.niches.${niche}`) }}
            </UButton>
          </div>
        </div>

        <UFormField :label="t('creators.platform')">
          <USelect v-model="selectedPlatform" :items="platforms" class="w-full" />
        </UFormField>

        <UFormField :label="t('creators.language')">
          <USelect v-model="selectedLanguage" :items="languageOptions" class="w-full" />
        </UFormField>

        <UFormField :label="t('creators.city')">
          <UInput v-model="selectedCity" :placeholder="t('creators.cityPlaceholder')" class="w-full" />
        </UFormField>
      </div>

      <!-- Creators Grid -->
      <div class="flex-1">
        <div v-if="filteredCreators.length" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <NuxtLink
            v-for="creator in filteredCreators"
            :key="creator.username"
            :to="`/creators/${creator.username}`"
          >
            <UCard class="hover:ring-2 hover:ring-primary transition-all h-full">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                  {{ creator.full_name.charAt(0) }}
                </div>
                <div>
                  <p class="font-semibold">{{ creator.full_name }}</p>
                  <p class="text-sm text-gray-500">@{{ creator.username }}</p>
                </div>
              </div>

              <div class="flex flex-wrap gap-1 mb-3">
                <UBadge v-for="niche in creator.niches" :key="niche" variant="subtle" size="xs">
                  {{ t(`onboarding.niches.${niche}`) }}
                </UBadge>
              </div>

              <div class="flex items-center justify-between text-sm">
                <span>{{ formatFollowers(creator.followers) }} {{ t('creators.followers') }}</span>
                <span class="text-primary font-medium">{{ creator.er }}% ER</span>
              </div>

              <div class="flex gap-1 mt-2">
                <UBadge v-for="p in creator.platforms" :key="p" :color="p === 'instagram' ? 'error' : 'info'" variant="soft" size="xs">
                  {{ p }}
                </UBadge>
              </div>
            </UCard>
          </NuxtLink>
        </div>

        <div v-else class="text-center py-16 text-gray-500">
          <p class="text-lg">{{ t('creators.noResults') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
