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
    if (error) { errorMessage.value = error.message; return }
    router.push('/dashboard')
  }
  finally { loading.value = false }
}

function handleGoogleLogin() {
  navigateTo('/api/auth/google', { external: true })
}
</script>

<template>
  <div class="relative flex min-h-screen items-center justify-center mesh-bg px-4 overflow-hidden">
    <!-- Orbs -->
    <div class="orb orb-1" style="width:500px;height:500px;top:-150px;left:-150px;" />
    <div class="orb orb-2" style="width:350px;height:350px;" />

    <!-- Grid -->
    <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

    <!-- Left illustration panel (desktop) -->
    <div class="hidden lg:flex flex-col items-center justify-center w-96 mr-16 text-center">
      <!-- Creator illustration -->
      <svg viewBox="0 0 280 260" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-72 mb-8">
        <!-- Desk -->
        <rect x="30" y="190" width="220" height="14" rx="4" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
        <rect x="60" y="204" width="12" height="40" rx="3" fill="rgba(255,255,255,0.05)"/>
        <rect x="208" y="204" width="12" height="40" rx="3" fill="rgba(255,255,255,0.05)"/>
        <!-- Monitor -->
        <rect x="80" y="110" width="120" height="78" rx="8" fill="rgba(124,58,237,0.15)" stroke="rgba(139,92,246,0.3)" stroke-width="1.5"/>
        <rect x="84" y="114" width="112" height="65" rx="5" fill="rgba(255,255,255,0.03)"/>
        <!-- Screen content -->
        <rect x="90" y="120" width="60" height="5" rx="2" fill="rgba(167,139,250,0.6)"/>
        <rect x="90" y="130" width="100" height="3" rx="1.5" fill="rgba(255,255,255,0.12)"/>
        <rect x="90" y="137" width="80" height="3" rx="1.5" fill="rgba(255,255,255,0.08)"/>
        <!-- Mini chart on screen -->
        <polyline points="90,165 105,158 120,162 135,150 150,152 165,145 180,148" stroke="rgba(167,139,250,0.7)" stroke-width="2" fill="none" stroke-linecap="round"/>
        <!-- Monitor stand -->
        <rect x="133" y="188" width="14" height="12" rx="2" fill="rgba(255,255,255,0.07)"/>
        <rect x="123" y="196" width="34" height="4" rx="2" fill="rgba(255,255,255,0.06)"/>
        <!-- Creator character (simple) -->
        <circle cx="55" cy="148" r="16" fill="url(#personGrad)"/>
        <path d="M32 190 Q55 172 78 190" fill="rgba(124,58,237,0.35)" stroke="rgba(139,92,246,0.4)" stroke-width="1"/>
        <!-- Arms working -->
        <path d="M40 162 Q50 175 65 180" stroke="rgba(167,139,250,0.5)" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M70 162 Q65 175 75 182" stroke="rgba(167,139,250,0.5)" stroke-width="4" stroke-linecap="round" fill="none"/>
        <!-- Phone -->
        <rect x="195" y="155" width="24" height="42" rx="4" fill="rgba(244,63,94,0.15)" stroke="rgba(244,63,94,0.3)" stroke-width="1.5"/>
        <rect x="198" y="160" width="18" height="28" rx="2" fill="rgba(255,255,255,0.04)"/>
        <!-- Instagram grid on phone -->
        <rect x="200" y="162" width="5" height="5" rx="1" fill="rgba(244,63,94,0.5)"/>
        <rect x="207" y="162" width="5" height="5" rx="1" fill="rgba(251,146,60,0.5)"/>
        <rect x="200" y="169" width="5" height="5" rx="1" fill="rgba(167,139,250,0.5)"/>
        <rect x="207" y="169" width="5" height="5" rx="1" fill="rgba(244,63,94,0.5)"/>
        <!-- Floating elements -->
        <circle cx="230" cy="100" r="5" fill="rgba(167,139,250,0.6)"/>
        <circle cx="45" cy="110" r="4" fill="rgba(244,63,94,0.5)"/>
        <circle cx="250" cy="145" r="3" fill="rgba(251,146,60,0.5)"/>
        <!-- Sparkles -->
        <path d="M240 80 l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#a78bfa" opacity="0.8"/>
        <path d="M25 80 l1.5 4.5 4.5 1.5-4.5 1.5L25 92l-1.5-4.5L19 86l4.5-1.5z" fill="#f472b6" opacity="0.7"/>
        <path d="M260 120 l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill="#fb923c" opacity="0.6"/>
        <defs>
          <radialGradient id="personGrad">
            <stop offset="0%" stop-color="#ddd6fe"/>
            <stop offset="100%" stop-color="#a78bfa"/>
          </radialGradient>
        </defs>
      </svg>

      <h2 class="text-2xl font-bold text-white mb-3">Welcome back,<br/>Creator 👋</h2>
      <p class="text-white/45 text-sm leading-relaxed max-w-xs">
        Your analytics, media kit, and creator network are waiting for you.
      </p>

      <!-- Mini feature pills -->
      <div class="mt-6 flex flex-wrap gap-2 justify-center">
        <span class="niche-badge">📊 Analytics</span>
        <span class="niche-badge">📄 Media Kit</span>
        <span class="niche-badge">👥 Directory</span>
        <span class="niche-badge">🤖 Telegram Bot</span>
      </div>
    </div>

    <!-- Auth Card -->
    <div class="w-full max-w-sm relative z-10">
      <div class="glass-card p-8 shadow-2xl shadow-violet-900/20">
        <!-- Logo -->
        <div class="text-center mb-8">
          <NuxtLink to="/" class="inline-flex items-center gap-2 mb-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fill="white" fill-opacity="0.9"/>
                <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="white" fill-opacity="0.4"/>
              </svg>
            </div>
            <span class="text-xl font-bold gradient-text">CreatorKit</span>
          </NuxtLink>
          <p class="text-sm text-white/45">{{ t('auth.loginSubtitle') }}</p>
        </div>

        <!-- Google Sign In -->
        <button
          class="w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/[0.08] hover:text-white transition-all duration-200 mb-6"
          @click="handleGoogleLogin"
        >
          <svg class="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {{ t('auth.googleSignIn') }}
        </button>

        <!-- Divider -->
        <div class="relative mb-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-white/[0.08]" />
          </div>
          <div class="relative flex justify-center text-xs">
            <span class="px-3 text-white/30 bg-transparent">{{ t('auth.or') }}</span>
          </div>
        </div>

        <!-- Email/Password form -->
        <form class="space-y-4" @submit.prevent="handleLogin">
          <div>
            <label class="block text-xs font-medium text-white/60 mb-1.5">{{ t('auth.email') }}</label>
            <input
              v-model="email"
              type="email"
              :placeholder="t('auth.emailPlaceholder')"
              required
              class="w-full rounded-xl border bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/25 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              :class="emailError ? 'border-red-500/50' : 'border-white/[0.08] focus:border-violet-500/40'"
              @blur="emailTouched = true"
            />
            <p v-if="emailError" class="mt-1 text-xs text-red-400">{{ emailError }}</p>
          </div>

          <div>
            <label class="block text-xs font-medium text-white/60 mb-1.5">{{ t('auth.password') }}</label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="t('auth.passwordPlaceholder')"
                required
                class="w-full rounded-xl border bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/25 transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/40 pr-10"
                :class="passwordError ? 'border-red-500/50' : 'border-white/[0.08] focus:border-violet-500/40'"
                @blur="passwordTouched = true"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                @click="showPassword = !showPassword"
              >
                <UIcon :name="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="h-4 w-4" />
              </button>
            </div>
            <p v-if="passwordError" class="mt-1 text-xs text-red-400">{{ passwordError }}</p>
          </div>

          <div class="text-right">
            <button type="button" class="text-xs text-violet-400 hover:text-violet-300 transition-colors">
              {{ t('auth.forgotPassword') }}
            </button>
          </div>

          <p v-if="errorMessage" class="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
            {{ errorMessage }}
          </p>

          <button
            type="submit"
            class="btn-gradient w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold"
            :disabled="loading"
          >
            <UIcon v-if="loading" name="i-lucide-loader-circle" class="h-4 w-4 animate-spin" />
            <span>{{ loading ? 'Signing in…' : t('auth.signIn') }}</span>
          </button>
        </form>

        <p class="mt-6 text-center text-xs text-white/35">
          {{ t('auth.noAccount') }}
          <NuxtLink to="/onboarding" class="text-violet-400 hover:text-violet-300 font-medium transition-colors">
            {{ t('auth.signUp') }}
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
