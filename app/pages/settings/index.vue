<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const toast = useToast()

const loading = ref(false)
const deleteLoading = ref(false)
const showDeleteConfirm = ref(false)

const schema = z.object({
  full_name: z.string().min(2),
  username: z.string().min(3).regex(/^[a-z0-9_]+$/),
  bio: z.string().max(500).optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal('')),
  telegram_username: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const state = reactive<FormData>({
  full_name: '',
  username: '',
  bio: '',
  city: '',
  country: 'UZ',
  contact_email: '',
  telegram_username: '',
})

const niches = ref<string[]>([])
const contentLanguages = ref<string[]>([])
const connectedAccounts = ref<{ id: string; platform: string; username: string }[]>([])

const countries = [
  { label: "O'zbekiston", value: 'UZ' },
  { label: 'Россия', value: 'RU' },
  { label: 'Kazakhstan', value: 'KZ' },
  { label: 'Turkey', value: 'TR' },
  { label: 'USA', value: 'US' },
  { label: 'Other', value: 'OTHER' },
]

const allNiches = ['beauty', 'tech', 'food', 'travel', 'education', 'fashion', 'lifestyle', 'entertainment', 'sports', 'health']
const languages = [
  { label: "O'zbekcha", value: 'uz' },
  { label: 'Русский', value: 'ru' },
  { label: 'English', value: 'en' },
]

onMounted(async () => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.value!.id)
    .single()

  if (profile) {
    state.full_name = profile.full_name || ''
    state.username = profile.username || ''
    state.bio = profile.bio || ''
    state.city = profile.city || ''
    state.country = profile.country || 'UZ'
    state.contact_email = profile.contact_email || ''
    state.telegram_username = profile.telegram_username || ''
    niches.value = profile.niches || []
    contentLanguages.value = profile.content_languages || []
  }

  const { data: accounts } = await supabase
    .from('social_accounts')
    .select('id, platform, username')
    .eq('profile_id', user.value!.id)

  if (accounts) connectedAccounts.value = accounts
})

async function saveProfile() {
  loading.value = true
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: state.full_name,
        username: state.username.toLowerCase(),
        bio: state.bio,
        city: state.city,
        country: state.country,
        contact_email: state.contact_email,
        telegram_username: state.telegram_username,
        niches: niches.value,
        content_languages: contentLanguages.value,
      })
      .eq('id', user.value!.id)

    if (error) throw error
    toast.add({ title: t('settings.saved'), color: 'success' })
  } catch (e) {
    toast.add({ title: t('settings.error'), color: 'error' })
  } finally {
    loading.value = false
  }
}

async function disconnectAccount(id: string) {
  await supabase.from('social_accounts').delete().eq('id', id)
  connectedAccounts.value = connectedAccounts.value.filter(a => a.id !== id)
  toast.add({ title: t('settings.disconnected'), color: 'success' })
}

async function deleteAccount() {
  deleteLoading.value = true
  try {
    await $fetch('/api/account/delete', { method: 'POST' })
    await supabase.auth.signOut()
    await navigateTo('/')
  } catch {
    toast.add({ title: t('settings.error'), color: 'error' })
  } finally {
    deleteLoading.value = false
  }
}

function toggleNiche(key: string) {
  const idx = niches.value.indexOf(key)
  if (idx >= 0) niches.value.splice(idx, 1)
  else niches.value.push(key)
}

function toggleLang(val: string) {
  const idx = contentLanguages.value.indexOf(val)
  if (idx >= 0) contentLanguages.value.splice(idx, 1)
  else contentLanguages.value.push(val)
}
</script>

<template>
  <div class="max-w-2xl mx-auto py-8 px-4 space-y-6">
    <h1 class="text-2xl font-bold">{{ t('settings.title') }}</h1>

    <!-- Profile -->
    <UCard>
      <template #header>
        <h2 class="font-semibold">{{ t('settings.profile') }}</h2>
      </template>

      <UForm :schema="schema" :state="state" class="space-y-4" @submit="saveProfile">
        <UFormField :label="t('onboarding.fullName')" name="full_name">
          <UInput v-model="state.full_name" class="w-full" />
        </UFormField>

        <UFormField :label="t('onboarding.username')" name="username">
          <UInput v-model="state.username" class="w-full" />
        </UFormField>

        <UFormField :label="t('onboarding.bio')" name="bio">
          <UTextarea v-model="state.bio" class="w-full" />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField :label="t('onboarding.city')" name="city">
            <UInput v-model="state.city" class="w-full" />
          </UFormField>
          <UFormField :label="t('onboarding.country')" name="country">
            <USelect v-model="state.country" :items="countries" class="w-full" />
          </UFormField>
        </div>

        <UFormField :label="t('onboarding.contactEmail')" name="contact_email">
          <UInput v-model="state.contact_email" type="email" class="w-full" />
        </UFormField>

        <UFormField :label="t('onboarding.telegramUsername')" name="telegram_username">
          <UInput v-model="state.telegram_username" class="w-full" />
        </UFormField>

        <UButton type="submit" color="primary" :loading="loading">
          {{ t('settings.save') }}
        </UButton>
      </UForm>
    </UCard>

    <!-- Niches -->
    <UCard>
      <template #header>
        <h2 class="font-semibold">{{ t('settings.niches') }}</h2>
      </template>
      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="niche in allNiches"
          :key="niche"
          :variant="niches.includes(niche) ? 'solid' : 'outline'"
          :color="niches.includes(niche) ? 'primary' : 'neutral'"
          size="sm"
          @click="toggleNiche(niche)"
        >
          {{ t(`onboarding.niches.${niche}`) }}
        </UButton>
      </div>
    </UCard>

    <!-- Languages -->
    <UCard>
      <template #header>
        <h2 class="font-semibold">{{ t('onboarding.contentLanguages') }}</h2>
      </template>
      <div class="flex gap-2">
        <UButton
          v-for="lang in languages"
          :key="lang.value"
          :variant="contentLanguages.includes(lang.value) ? 'solid' : 'outline'"
          :color="contentLanguages.includes(lang.value) ? 'primary' : 'neutral'"
          size="sm"
          @click="toggleLang(lang.value)"
        >
          {{ lang.label }}
        </UButton>
      </div>
    </UCard>

    <!-- Connected Accounts -->
    <UCard>
      <template #header>
        <h2 class="font-semibold">{{ t('settings.connectedAccounts') }}</h2>
      </template>
      <div v-if="connectedAccounts.length" class="space-y-3">
        <div v-for="account in connectedAccounts" :key="account.id" class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UBadge :color="account.platform === 'instagram' ? 'error' : 'info'">{{ account.platform }}</UBadge>
            <span>@{{ account.username }}</span>
          </div>
          <UButton variant="ghost" color="error" size="xs" @click="disconnectAccount(account.id)">
            {{ t('settings.disconnect') }}
          </UButton>
        </div>
      </div>
      <p v-else class="text-gray-500 text-sm">{{ t('settings.noAccounts') }}</p>
    </UCard>

    <!-- Danger Zone -->
    <UCard>
      <template #header>
        <h2 class="font-semibold text-red-500">{{ t('settings.dangerZone') }}</h2>
      </template>
      <p class="text-sm text-gray-500 mb-4">{{ t('settings.deleteWarning') }}</p>
      <UButton
        v-if="!showDeleteConfirm"
        color="error"
        variant="outline"
        @click="showDeleteConfirm = true"
      >
        {{ t('settings.deleteAccount') }}
      </UButton>
      <div v-else class="flex gap-2">
        <UButton color="error" :loading="deleteLoading" @click="deleteAccount">
          {{ t('settings.confirmDelete') }}
        </UButton>
        <UButton variant="ghost" color="neutral" @click="showDeleteConfirm = false">
          {{ t('settings.cancel') }}
        </UButton>
      </div>
    </UCard>
  </div>
</template>
