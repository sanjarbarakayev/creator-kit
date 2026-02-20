<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: false,
})

const { t } = useI18n()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const step = ref(1)
const totalSteps = 4
const loading = ref(false)
const usernameAvailable = ref<boolean | null>(null)
const checkingUsername = ref(false)

const form = reactive({
  full_name: '',
  username: '',
  bio: '',
  city: '',
  country: 'UZ',
  niches: [] as string[],
  content_languages: [] as string[],
  contact_email: '',
  telegram_username: '',
})

const countries = [
  { label: "O'zbekiston", value: 'UZ' },
  { label: 'Россия', value: 'RU' },
  { label: 'Kazakhstan', value: 'KZ' },
  { label: 'Turkey', value: 'TR' },
  { label: 'USA', value: 'US' },
  { label: 'Other', value: 'OTHER' },
]

const niches = [
  { key: 'beauty', icon: '💄' },
  { key: 'tech', icon: '💻' },
  { key: 'food', icon: '🍕' },
  { key: 'travel', icon: '✈️' },
  { key: 'education', icon: '📚' },
  { key: 'fashion', icon: '👗' },
  { key: 'lifestyle', icon: '🌿' },
  { key: 'entertainment', icon: '🎬' },
  { key: 'sports', icon: '⚽' },
  { key: 'health', icon: '💪' },
]

const languages = [
  { label: "O'zbekcha", value: 'uz' },
  { label: 'Русский', value: 'ru' },
  { label: 'English', value: 'en' },
]

const stepMeta = computed(() => [
  { icon: 'i-lucide-user', gradient: 'from-violet-500 to-indigo-500', color: 'text-violet-400' },
  { icon: 'i-lucide-sparkles', gradient: 'from-pink-500 to-rose-500', color: 'text-pink-400' },
  { icon: 'i-lucide-link-2', gradient: 'from-blue-500 to-cyan-500', color: 'text-blue-400' },
  { icon: 'i-lucide-globe', gradient: 'from-orange-500 to-amber-500', color: 'text-orange-400' },
])

let usernameTimeout: ReturnType<typeof setTimeout>

function checkUsername() {
  usernameAvailable.value = null
  if (!form.username || form.username.length < 3) return
  clearTimeout(usernameTimeout)
  checkingUsername.value = true
  usernameTimeout = setTimeout(async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', form.username.toLowerCase())
      .neq('id', user.value!.id)
      .maybeSingle()
    usernameAvailable.value = !data
    checkingUsername.value = false
  }, 500)
}

function toggleNiche(key: string) {
  const idx = form.niches.indexOf(key)
  if (idx >= 0) form.niches.splice(idx, 1)
  else form.niches.push(key)
}

function toggleLanguage(val: string) {
  const idx = form.content_languages.indexOf(val)
  if (idx >= 0) form.content_languages.splice(idx, 1)
  else form.content_languages.push(val)
}

function nextStep() { if (step.value < totalSteps) step.value++ }
function prevStep() { if (step.value > 1) step.value-- }
function connectInstagram() { navigateTo('/api/instagram/connect', { external: true }) }

async function completeOnboarding() {
  loading.value = true
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name,
        username: form.username.toLowerCase(),
        bio: form.bio,
        city: form.city,
        country: form.country,
        niches: form.niches,
        content_languages: form.content_languages,
        contact_email: form.contact_email,
        telegram_username: form.telegram_username,
        onboarding_complete: true,
      })
      .eq('id', user.value!.id)
    if (error) throw error
    await router.push('/dashboard')
  }
  catch (e) { console.error('Onboarding error:', e) }
  finally { loading.value = false }
}
</script>

<template>
  <div class="relative min-h-screen mesh-bg flex items-center justify-center px-4 py-12 overflow-hidden">
    <!-- Orbs -->
    <div class="orb orb-1" />
    <div class="orb orb-2" />
    <!-- Grid -->
    <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

    <div class="w-full max-w-xl relative z-10">
      <!-- Logo -->
      <div class="flex items-center justify-center gap-2 mb-8">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fill="white" fill-opacity="0.9"/>
            <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="white" fill-opacity="0.4"/>
          </svg>
        </div>
        <span class="text-xl font-bold gradient-text">CreatorKit</span>
      </div>

      <!-- Step progress -->
      <div class="flex items-center gap-2 mb-8">
        <div
          v-for="s in totalSteps"
          :key="s"
          class="relative h-1.5 flex-1 rounded-full overflow-hidden"
          :class="s <= step ? '' : 'bg-white/[0.07]'"
        >
          <div
            class="absolute inset-0 rounded-full transition-all duration-500"
            :class="s < step
              ? 'bg-gradient-to-r from-violet-500 to-indigo-500'
              : s === step
                ? 'bg-gradient-to-r from-violet-500/80 to-indigo-500/60 animate-pulse'
                : 'bg-transparent'"
          />
        </div>
        <span class="text-xs text-white/35 ml-1 flex-shrink-0">{{ step }}/{{ totalSteps }}</span>
      </div>

      <!-- Card -->
      <div class="glass-card p-8 shadow-2xl shadow-violet-900/20">
        <!-- Step header with icon -->
        <div class="flex items-start gap-4 mb-8">
          <div :class="`flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stepMeta[step-1].gradient} shadow-lg`">
            <UIcon :name="stepMeta[step-1].icon" class="size-5.5 text-white" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-white">{{ t(`onboarding.step${step}.title`) }}</h1>
            <p class="text-sm text-white/45 mt-0.5">{{ t(`onboarding.step${step}.subtitle`) }}</p>
          </div>
        </div>

        <!-- ── Step 1: Profile Info ────────────────────────── -->
        <div v-if="step === 1" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-white/55 mb-1.5">{{ t('onboarding.fullName') }}</label>
            <input
              v-model="form.full_name"
              :placeholder="t('onboarding.fullNamePlaceholder')"
              class="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/30 transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-white/55 mb-1.5">
              {{ t('onboarding.username') }}
              <span v-if="checkingUsername" class="ml-2 text-white/30">checking…</span>
              <span v-else-if="usernameAvailable === true" class="ml-2 text-green-400">✓ available</span>
              <span v-else-if="usernameAvailable === false" class="ml-2 text-red-400">✗ taken</span>
            </label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/30">@</span>
              <input
                v-model="form.username"
                placeholder="your_username"
                class="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] pl-8 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
                :class="usernameAvailable === false ? 'border-red-500/40' : usernameAvailable === true ? 'border-green-500/40' : ''"
                @input="checkUsername"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-white/55 mb-1.5">{{ t('onboarding.bio') }}</label>
            <textarea
              v-model="form.bio"
              :placeholder="t('onboarding.bioPlaceholder')"
              rows="3"
              class="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all resize-none"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-white/55 mb-1.5">{{ t('onboarding.city') }}</label>
              <input
                v-model="form.city"
                :placeholder="t('onboarding.cityPlaceholder')"
                class="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-white/55 mb-1.5">{{ t('onboarding.country') }}</label>
              <select
                v-model="form.country"
                class="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
              >
                <option v-for="c in countries" :key="c.value" :value="c.value" class="bg-gray-900">{{ c.label }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- ── Step 2: Niches ─────────────────────────────── -->
        <div v-if="step === 2">
          <p class="text-xs text-white/40 mb-5">Choose your content niches (select all that apply)</p>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              v-for="niche in niches"
              :key="niche.key"
              class="relative p-4 rounded-2xl border-2 text-center transition-all duration-200"
              :class="form.niches.includes(niche.key)
                ? 'border-violet-500 bg-violet-500/15 ring-2 ring-violet-500/20'
                : 'border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'"
              @click="toggleNiche(niche.key)"
            >
              <div v-if="form.niches.includes(niche.key)" class="absolute top-2 right-2 h-4 w-4 rounded-full bg-violet-600 flex items-center justify-center">
                <UIcon name="i-lucide-check" class="h-2.5 w-2.5 text-white" />
              </div>
              <span class="text-2xl block mb-1.5">{{ niche.icon }}</span>
              <span class="text-xs font-semibold" :class="form.niches.includes(niche.key) ? 'text-violet-300' : 'text-white/60'">
                {{ t(`onboarding.niches.${niche.key}`) }}
              </span>
            </button>
          </div>
          <p v-if="form.niches.length" class="mt-4 text-xs text-center text-violet-400">
            {{ form.niches.length }} niche{{ form.niches.length !== 1 ? 's' : '' }} selected
          </p>
        </div>

        <!-- ── Step 3: Connect Socials ─────────────────────── -->
        <div v-if="step === 3" class="space-y-4">
          <!-- Instagram connect -->
          <button
            class="w-full flex items-center gap-4 rounded-2xl border-2 border-pink-500/30 bg-gradient-to-r from-pink-500/10 to-rose-500/5 p-5 text-left hover:border-pink-500/50 hover:from-pink-500/15 transition-all duration-200 group"
            @click="connectInstagram"
          >
            <div class="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-orange-500 shadow-lg shadow-pink-500/25">
              <UIcon name="i-lucide-instagram" class="size-5.5 text-white" />
            </div>
            <div class="flex-1">
              <p class="font-semibold text-white">{{ t('onboarding.connectInstagram') }}</p>
              <p class="text-xs text-white/40 mt-0.5">Connect your Instagram account for analytics</p>
            </div>
            <UIcon name="i-lucide-arrow-right" class="size-4 text-white/30 group-hover:text-white/60 transition-colors" />
          </button>

          <!-- TikTok (disabled) -->
          <button
            class="w-full flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-left opacity-50 cursor-not-allowed"
            disabled
          >
            <div class="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.07]">
              <UIcon name="i-lucide-music" class="size-5.5 text-white/50" />
            </div>
            <div class="flex-1">
              <p class="font-semibold text-white/60">{{ t('onboarding.connectTiktok') }}</p>
              <p class="text-xs text-white/30 mt-0.5">Coming soon</p>
            </div>
            <span class="text-[10px] rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-white/30">Soon</span>
          </button>

          <p class="text-xs text-center text-white/30 pt-2">{{ t('onboarding.skipSocials') }}</p>
        </div>

        <!-- ── Step 4: Language & Contact ────────────────────── -->
        <div v-if="step === 4" class="space-y-5">
          <div>
            <label class="block text-xs font-medium text-white/55 mb-3">{{ t('onboarding.contentLanguages') }}</label>
            <div class="flex gap-2 flex-wrap">
              <button
                v-for="lang in languages"
                :key="lang.value"
                class="rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200"
                :class="form.content_languages.includes(lang.value)
                  ? 'bg-violet-600 text-white shadow shadow-violet-500/20'
                  : 'border border-white/[0.08] bg-white/[0.03] text-white/50 hover:text-white/80'"
                @click="toggleLanguage(lang.value)"
              >
                {{ lang.label }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-white/55 mb-1.5">{{ t('onboarding.contactEmail') }}</label>
            <input
              v-model="form.contact_email"
              type="email"
              placeholder="email@example.com"
              class="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-white/55 mb-1.5">{{ t('onboarding.telegramUsername') }}</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-white/30">@</span>
              <input
                v-model="form.telegram_username"
                placeholder="telegram_handle"
                class="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] pl-8 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all"
              />
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <div class="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.06]">
          <button
            v-if="step > 1"
            class="inline-flex items-center gap-2 text-sm text-white/45 hover:text-white/80 transition-colors"
            @click="prevStep"
          >
            <UIcon name="i-lucide-arrow-left" class="h-4 w-4" />
            {{ t('onboarding.back') }}
          </button>
          <div v-else />

          <button
            v-if="step < totalSteps"
            class="btn-gradient inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold"
            @click="nextStep"
          >
            {{ t('onboarding.next') }}
            <UIcon name="i-lucide-arrow-right" class="h-4 w-4" />
          </button>
          <button
            v-else
            class="btn-gradient inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold"
            :disabled="loading"
            @click="completeOnboarding"
          >
            <UIcon v-if="loading" name="i-lucide-loader-circle" class="h-4 w-4 animate-spin" />
            <UIcon v-else name="i-lucide-check" class="h-4 w-4" />
            {{ loading ? 'Saving…' : t('onboarding.complete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
