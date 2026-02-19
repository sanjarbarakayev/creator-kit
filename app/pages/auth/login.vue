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
const showPassword = ref(false)
const emailTouched = ref(false)
const passwordTouched = ref(false)

const emailError = computed(() => {
  if (!emailTouched.value || !email.value) return ''
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value) ? '' : t('auth.invalidEmail')
})

const passwordError = computed(() => {
  if (!passwordTouched.value) return ''
  if (!password.value) return t('auth.passwordRequired')
  if (password.value.length < 6) return t('auth.passwordMinLength')
  return ''
})

async function handleLogin() {
  emailTouched.value = true
  passwordTouched.value = true

  if (emailError.value || passwordError.value || !email.value || !password.value) return

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
  <div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-amber-50/30 dark:from-gray-950 dark:via-gray-950 dark:to-emerald-950/20 px-4">
    <div class="w-full max-w-sm">
      <UCard>
        <div class="space-y-6">
          <div class="text-center">
            <NuxtLink to="/" class="inline-block">
              <h1 class="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">CreatorKit</h1>
            </NuxtLink>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {{ t('auth.loginSubtitle') }}
            </p>
          </div>

          <!-- Google Sign In -->
          <UButton
            variant="outline"
            block
            size="lg"
            @click="handleGoogleLogin"
            class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <template #leading>
              <svg class="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </template>
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
            <UFormField :label="t('auth.email')" :error="emailError">
              <UInput
                v-model="email"
                type="email"
                :placeholder="t('auth.emailPlaceholder')"
                required
                class="w-full"
                :color="emailError ? 'error' : undefined"
                @blur="emailTouched = true"
              />
            </UFormField>

            <UFormField :label="t('auth.password')" :error="passwordError">
              <div class="relative">
                <UInput
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  :placeholder="t('auth.passwordPlaceholder')"
                  required
                  class="w-full"
                  :color="passwordError ? 'error' : undefined"
                  @blur="passwordTouched = true"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  :aria-label="showPassword ? t('auth.hidePassword') : t('auth.showPassword')"
                  @click="showPassword = !showPassword"
                >
                  <UIcon :name="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="h-4 w-4" />
                </button>
              </div>
            </UFormField>

            <div class="text-right">
              <button type="button" class="text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 transition-colors">
                {{ t('auth.forgotPassword') }}
              </button>
            </div>

            <p v-if="errorMessage" class="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {{ errorMessage }}
            </p>

            <UButton type="submit" block size="lg" :loading="loading" class="shadow-sm">
              {{ t('auth.signIn') }}
            </UButton>
          </form>

          <p class="text-center text-sm text-gray-600 dark:text-gray-400">
            {{ t('auth.noAccount') }}
            <NuxtLink to="/onboarding" class="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 transition-colors">
              {{ t('auth.signUp') }}
            </NuxtLink>
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>
