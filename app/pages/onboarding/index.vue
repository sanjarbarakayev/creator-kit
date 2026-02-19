<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
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

function nextStep() {
  if (step.value < totalSteps) step.value++
}

function prevStep() {
  if (step.value > 1) step.value--
}

function connectInstagram() {
  navigateTo('/api/instagram/connect', { external: true })
}

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
  } catch (e) {
    console.error('Onboarding error:', e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-xl">
      <!-- Progress -->
      <div class="flex items-center gap-2 mb-8">
        <div
          v-for="s in totalSteps"
          :key="s"
          class="h-2 flex-1 rounded-full transition-colors"
          :class="s <= step ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'"
        />
      </div>

      <UCard>
        <template #header>
          <h1 class="text-2xl font-bold">{{ t(`onboarding.step${step}.title`) }}</h1>
          <p class="text-sm text-gray-500 mt-1">{{ t(`onboarding.step${step}.subtitle`) }}</p>
        </template>

        <!-- Step 1: Profile Info -->
        <div v-if="step === 1" class="space-y-4">
          <UFormField :label="t('onboarding.fullName')">
            <UInput v-model="form.full_name" :placeholder="t('onboarding.fullNamePlaceholder')" class="w-full" />
          </UFormField>

          <UFormField :label="t('onboarding.username')" :hint="checkingUsername ? '...' : usernameAvailable === true ? '✅' : usernameAvailable === false ? '❌' : ''">
            <UInput
              v-model="form.username"
              placeholder="username"
              class="w-full"
              @input="checkUsername"
            />
          </UFormField>

          <UFormField :label="t('onboarding.bio')">
            <UTextarea v-model="form.bio" :placeholder="t('onboarding.bioPlaceholder')" class="w-full" />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField :label="t('onboarding.city')">
              <UInput v-model="form.city" :placeholder="t('onboarding.cityPlaceholder')" class="w-full" />
            </UFormField>
            <UFormField :label="t('onboarding.country')">
              <USelect v-model="form.country" :items="countries" class="w-full" />
            </UFormField>
          </div>
        </div>

        <!-- Step 2: Niches -->
        <div v-if="step === 2">
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              v-for="niche in niches"
              :key="niche.key"
              class="p-4 rounded-xl border-2 text-center transition-all hover:scale-105"
              :class="form.niches.includes(niche.key) ? 'border-primary bg-primary/10' : 'border-gray-200 dark:border-gray-700'"
              @click="toggleNiche(niche.key)"
            >
              <span class="text-2xl block mb-1">{{ niche.icon }}</span>
              <span class="text-sm font-medium">{{ t(`onboarding.niches.${niche.key}`) }}</span>
            </button>
          </div>
        </div>

        <!-- Step 3: Connect Socials -->
        <div v-if="step === 3" class="space-y-4">
          <UButton
            icon="i-lucide-instagram"
            color="primary"
            size="lg"
            block
            @click="connectInstagram"
          >
            {{ t('onboarding.connectInstagram') }}
          </UButton>

          <UButton
            icon="i-lucide-music"
            color="neutral"
            variant="outline"
            size="lg"
            block
            disabled
          >
            {{ t('onboarding.connectTiktok') }}
          </UButton>

          <p class="text-xs text-center text-gray-400">{{ t('onboarding.skipSocials') }}</p>
        </div>

        <!-- Step 4: Language & Contact -->
        <div v-if="step === 4" class="space-y-4">
          <UFormField :label="t('onboarding.contentLanguages')">
            <div class="flex gap-2 flex-wrap">
              <UButton
                v-for="lang in languages"
                :key="lang.value"
                :variant="form.content_languages.includes(lang.value) ? 'solid' : 'outline'"
                :color="form.content_languages.includes(lang.value) ? 'primary' : 'neutral'"
                size="sm"
                @click="toggleLanguage(lang.value)"
              >
                {{ lang.label }}
              </UButton>
            </div>
          </UFormField>

          <UFormField :label="t('onboarding.contactEmail')">
            <UInput v-model="form.contact_email" type="email" placeholder="email@example.com" class="w-full" />
          </UFormField>

          <UFormField :label="t('onboarding.telegramUsername')">
            <UInput v-model="form.telegram_username" placeholder="@username" class="w-full" />
          </UFormField>
        </div>

        <template #footer>
          <div class="flex justify-between">
            <UButton
              v-if="step > 1"
              variant="ghost"
              color="neutral"
              @click="prevStep"
            >
              {{ t('onboarding.back') }}
            </UButton>
            <div v-else />

            <UButton
              v-if="step < totalSteps"
              color="primary"
              @click="nextStep"
            >
              {{ t('onboarding.next') }}
            </UButton>
            <UButton
              v-else
              color="primary"
              :loading="loading"
              @click="completeOnboarding"
            >
              {{ t('onboarding.complete') }}
            </UButton>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>
