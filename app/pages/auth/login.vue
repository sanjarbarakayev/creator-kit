<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { t } = useI18n()
const supabaseClient = useSupabaseClient()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  loading.value = true
  errorMessage.value = ''

  try {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) {
      errorMessage.value = error.message
      return
    }

    router.push('/dashboard')
  }
  finally {
    loading.value = false
  }
}

function handleGoogleLogin() {
  navigateTo('/api/auth/google', { external: true })
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100/50 dark:from-gray-950 dark:via-gray-950 dark:to-primary-950/20 px-4">
    <UCard class="w-full max-w-sm">
      <div class="space-y-6">
        <div class="text-center">
          <NuxtLink to="/" class="inline-block">
            <h1 class="text-2xl font-bold text-primary-600 dark:text-primary-400">CreatorKit</h1>
          </NuxtLink>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {{ t('auth.loginSubtitle') }}
          </p>
        </div>

        <UButton
          variant="outline"
          block
          icon="i-lucide-chrome"
          size="lg"
          @click="handleGoogleLogin"
        >
          {{ t('auth.googleSignIn') }}
        </UButton>

        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="bg-white dark:bg-gray-900 px-2 text-gray-500">
              {{ t('auth.or') }}
            </span>
          </div>
        </div>

        <form class="space-y-4" @submit.prevent="handleLogin">
          <UFormField :label="t('auth.email')">
            <UInput
              v-model="email"
              type="email"
              :placeholder="t('auth.emailPlaceholder')"
              required
              class="w-full"
            />
          </UFormField>

          <UFormField :label="t('auth.password')">
            <UInput
              v-model="password"
              type="password"
              :placeholder="t('auth.passwordPlaceholder')"
              required
              class="w-full"
            />
          </UFormField>

          <p v-if="errorMessage" class="text-sm text-red-600">
            {{ errorMessage }}
          </p>

          <UButton type="submit" block size="lg" :loading="loading">
            {{ t('auth.signIn') }}
          </UButton>
        </form>

        <p class="text-center text-sm text-gray-600 dark:text-gray-400">
          {{ t('auth.noAccount') }}
          <NuxtLink to="/auth/login" class="font-medium text-primary-600 hover:text-primary-500">
            {{ t('auth.signUp') }}
          </NuxtLink>
        </p>
      </div>
    </UCard>
  </div>
</template>
