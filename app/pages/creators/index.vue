<script setup lang="ts">
definePageMeta({ auth: false })

const { t } = useI18n()

const search = ref('')
const selectedNiches = ref<string[]>([])
const selectedPlatform = ref('all')
const selectedLanguage = ref('all')
const selectedCity = ref('')

const allNiches = ['beauty', 'tech', 'food', 'travel', 'education', 'fashion', 'lifestyle', 'entertainment', 'sports', 'health']
const platforms = [
  { label: 'All', value: 'all' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'TikTok', value: 'tiktok' },
]
const languageOptions = [
  { label: 'All', value: 'all' },
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
  return mockCreators.filter((c) => {
    if (search.value && !c.full_name.toLowerCase().includes(search.value.toLowerCase()) && !c.username.includes(search.value.toLowerCase())) return false
    if (selectedNiches.value.length && !selectedNiches.value.some(n => c.niches.includes(n))) return false
    if (selectedPlatform.value && selectedPlatform.value !== 'all' && !c.platforms.includes(selectedPlatform.value)) return false
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

const avatarGradients = [
  'from-violet-500 to-indigo-500',
  'from-pink-500 to-rose-500',
  'from-orange-500 to-amber-500',
  'from-emerald-500 to-teal-500',
  'from-blue-500 to-cyan-500',
  'from-fuchsia-500 to-purple-500',
]

const nicheIcons: Record<string, string> = {
  beauty: '💄', tech: '💻', food: '🍕', travel: '✈️',
  education: '📚', fashion: '👗', lifestyle: '🌿',
  entertainment: '🎬', sports: '⚽', health: '💪',
}

useHead({ title: t('creators.title') })
</script>

<template>
  <div class="min-h-screen mesh-bg">
    <!-- Hero header -->
    <div class="relative overflow-hidden border-b border-white/[0.05]">
      <div class="absolute inset-0 bg-gradient-to-b from-violet-600/10 to-transparent pointer-events-none" />
      <div class="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div class="text-center">
          <div class="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300 mb-5">
            <UIcon name="i-lucide-users" class="h-4 w-4" />
            Creator Directory
          </div>
          <h1 class="text-4xl font-extrabold text-white sm:text-5xl">{{ t('creators.title') }}</h1>
          <p class="mt-4 max-w-xl mx-auto text-white/50 text-lg">{{ t('creators.subtitle') }}</p>

          <!-- Search bar centered -->
          <div class="mt-8 max-w-lg mx-auto">
            <div class="relative">
              <UIcon name="i-lucide-search" class="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-white/30" />
              <input
                v-model="search"
                type="text"
                :placeholder="t('creators.searchPlaceholder')"
                class="w-full rounded-2xl border border-white/[0.09] bg-white/[0.05] pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/30 backdrop-blur-sm transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row gap-8">

        <!-- ── Filters Sidebar ──────────────────────────────── -->
        <div class="w-full lg:w-60 shrink-0 space-y-6">
          <div class="glass-card p-5 space-y-5">
            <!-- Niches -->
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">{{ t('creators.niche') }}</p>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="niche in allNiches"
                  :key="niche"
                  class="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all duration-200"
                  :class="selectedNiches.includes(niche)
                    ? 'bg-violet-600 text-white shadow shadow-violet-500/25'
                    : 'border border-white/[0.08] bg-white/[0.03] text-white/50 hover:text-white/80 hover:border-white/15'"
                  @click="toggleNiche(niche)"
                >
                  <span>{{ nicheIcons[niche] }}</span>
                  {{ t(`onboarding.niches.${niche}`) }}
                </button>
              </div>
            </div>

            <!-- Platform -->
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">{{ t('creators.platform') }}</p>
              <div class="flex gap-1.5">
                <button
                  v-for="pl in platforms"
                  :key="pl.value"
                  class="flex-1 rounded-xl py-2 text-xs font-medium transition-all duration-200"
                  :class="selectedPlatform === pl.value
                    ? 'bg-violet-600 text-white'
                    : 'border border-white/[0.08] bg-white/[0.03] text-white/50 hover:text-white/80'"
                  @click="selectedPlatform = pl.value"
                >
                  {{ pl.label }}
                </button>
              </div>
            </div>

            <!-- Language -->
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">{{ t('creators.language') }}</p>
              <select
                v-model="selectedLanguage"
                class="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
              >
                <option v-for="lo in languageOptions" :key="lo.value" :value="lo.value" class="bg-gray-900">{{ lo.label }}</option>
              </select>
            </div>

            <!-- City -->
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">{{ t('creators.city') }}</p>
              <input
                v-model="selectedCity"
                type="text"
                :placeholder="t('creators.cityPlaceholder')"
                class="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
              />
            </div>

            <!-- Clear filters -->
            <button
              v-if="selectedNiches.length || selectedPlatform !== 'all' || selectedCity"
              class="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2 text-xs font-medium text-white/50 hover:text-white/80 transition-all"
              @click="selectedNiches = []; selectedPlatform = 'all'; selectedCity = ''"
            >
              ✕ Clear filters
            </button>
          </div>

          <!-- Stats pill -->
          <div class="glass-card p-4 text-center">
            <p class="text-2xl font-bold gradient-text">{{ filteredCreators.length }}</p>
            <p class="text-xs text-white/35 mt-1">creators found</p>
          </div>
        </div>

        <!-- ── Creator Grid ──────────────────────────────────── -->
        <div class="flex-1">
          <!-- Result count -->
          <div class="flex items-center justify-between mb-6">
            <p class="text-sm text-white/40">
              Showing <span class="text-white/70 font-medium">{{ filteredCreators.length }}</span> creators
            </p>
          </div>

          <div v-if="filteredCreators.length" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            <NuxtLink
              v-for="(creator, i) in filteredCreators"
              :key="creator.username"
              :to="`/creators/${creator.username}`"
              class="creator-card gradient-border p-5 block group"
            >
              <!-- Top: Avatar + Name -->
              <div class="flex items-center gap-3.5 mb-4">
                <div class="relative flex-shrink-0">
                  <div :class="`h-12 w-12 rounded-2xl bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} flex items-center justify-center text-base font-bold text-white shadow-lg`">
                    {{ creator.full_name.charAt(0) }}
                  </div>
                  <!-- Active indicator -->
                  <div class="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#0d0d1a] bg-green-400" />
                </div>
                <div class="min-w-0">
                  <p class="font-semibold text-white truncate">{{ creator.full_name }}</p>
                  <p class="text-xs text-white/40">@{{ creator.username }}</p>
                </div>
              </div>

              <!-- Niches -->
              <div class="flex flex-wrap gap-1.5 mb-4">
                <span v-for="niche in creator.niches" :key="niche" class="niche-badge">
                  {{ nicheIcons[niche] }} {{ t(`onboarding.niches.${niche}`) }}
                </span>
              </div>

              <!-- Stats row -->
              <div class="grid grid-cols-3 gap-2 mb-4">
                <div class="rounded-xl bg-white/[0.04] border border-white/[0.05] p-2.5 text-center">
                  <p class="text-sm font-bold text-white">{{ formatFollowers(creator.followers) }}</p>
                  <p class="text-[10px] text-white/35 mt-0.5">Followers</p>
                </div>
                <div class="rounded-xl bg-white/[0.04] border border-white/[0.05] p-2.5 text-center">
                  <p class="text-sm font-bold text-violet-400">{{ creator.er }}%</p>
                  <p class="text-[10px] text-white/35 mt-0.5">ER</p>
                </div>
                <div class="rounded-xl bg-white/[0.04] border border-white/[0.05] p-2.5 text-center">
                  <p class="text-sm font-bold text-white/70 truncate text-xs">{{ creator.city }}</p>
                  <p class="text-[10px] text-white/35 mt-0.5">City</p>
                </div>
              </div>

              <!-- Platforms + CTA -->
              <div class="flex items-center justify-between">
                <div class="flex gap-1.5">
                  <span
                    v-for="p in creator.platforms"
                    :key="p"
                    class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                    :class="p === 'instagram'
                      ? 'bg-pink-500/15 text-pink-400 border border-pink-500/20'
                      : 'bg-blue-500/15 text-blue-400 border border-blue-500/20'"
                  >
                    <UIcon :name="p === 'instagram' ? 'i-lucide-instagram' : 'i-lucide-music'" class="h-3 w-3" />
                    {{ p }}
                  </span>
                </div>
                <span class="text-[10px] text-violet-400 font-medium group-hover:text-violet-300 transition-colors">
                  View profile →
                </span>
              </div>
            </NuxtLink>
          </div>

          <!-- Empty state -->
          <div v-else class="flex flex-col items-center justify-center py-24 text-center">
            <!-- Empty state illustration -->
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" class="mb-6 opacity-50">
              <circle cx="60" cy="60" r="50" fill="rgba(139,92,246,0.06)" stroke="rgba(139,92,246,0.12)" stroke-width="1.5"/>
              <circle cx="60" cy="60" r="30" fill="rgba(139,92,246,0.04)" stroke="rgba(139,92,246,0.1)" stroke-width="1"/>
              <path d="M42 72 Q60 52 78 72" stroke="rgba(167,139,250,0.4)" stroke-width="2" fill="none" stroke-linecap="round"/>
              <circle cx="50" cy="54" r="5" fill="rgba(167,139,250,0.3)"/>
              <circle cx="70" cy="54" r="5" fill="rgba(167,139,250,0.3)"/>
              <path d="M80 25 l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#a78bfa" opacity="0.5"/>
              <path d="M35 88 l1.5 4.5 4.5 1.5-4.5 1.5L35 100l-1.5-4.5L29 94l4.5-1.5z" fill="#f472b6" opacity="0.4"/>
            </svg>
            <h3 class="text-lg font-semibold text-white mb-2">{{ t('creators.noResults') }}</h3>
            <p class="text-sm text-white/40 max-w-xs">Try adjusting your filters or search terms to find creators.</p>
            <button
              class="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-white/60 hover:text-white/90 transition-all"
              @click="selectedNiches = []; selectedPlatform = 'all'; selectedCity = ''; search = ''"
            >
              Clear all filters
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
