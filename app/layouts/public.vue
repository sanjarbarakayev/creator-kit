<script setup lang="ts">
const { t, locale, locales, setLocale } = useI18n()

const availableLocales = computed(() =>
  (locales.value as Array<{ code: string; name: string }>).filter(l => l.code !== locale.value),
)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#0d0d1a] text-white">
    <!-- ── Header ──────────────────────────────────────────── -->
    <header class="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0d0d1a]/80 backdrop-blur-xl">
      <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <!-- Left: Logo + Nav -->
          <div class="flex items-center gap-8">
            <NuxtLink to="/" class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fill="white" fill-opacity="0.9"/>
                  <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="white" fill-opacity="0.4"/>
                </svg>
              </div>
              <span class="text-lg font-bold gradient-text">CreatorKit</span>
            </NuxtLink>
            <NuxtLink
              to="/creators"
              class="hidden sm:block text-sm text-white/50 hover:text-white/90 transition-colors"
            >
              {{ t('nav.creators') }}
            </NuxtLink>
          </div>

          <!-- Right: Lang + Auth -->
          <div class="flex items-center gap-3">
            <!-- Language switcher -->
            <div class="flex items-center gap-0.5">
              <button
                v-for="l in availableLocales"
                :key="l.code"
                class="rounded-lg px-2.5 py-1 text-xs font-medium text-white/35 hover:text-white/80 hover:bg-white/[0.05] transition-all"
                @click="setLocale(l.code)"
              >
                {{ l.code.toUpperCase() }}
              </button>
            </div>
            <!-- Auth CTA -->
            <NuxtLink
              to="/auth/login"
              class="btn-gradient inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-lg shadow-violet-500/20"
            >
              {{ t('nav.signIn') }}
              <UIcon name="i-lucide-arrow-right" class="h-3.5 w-3.5" />
            </NuxtLink>
          </div>
        </div>
      </nav>
    </header>

    <!-- ── Main Content ────────────────────────────────────── -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- ── Footer ──────────────────────────────────────────── -->
    <footer class="border-t border-white/[0.05] bg-[#0a0a16]">
      <div class="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <!-- Brand -->
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fill="white" fill-opacity="0.9"/>
                </svg>
              </div>
              <span class="text-base font-bold gradient-text">CreatorKit</span>
            </div>
            <p class="text-sm text-white/35 leading-relaxed">{{ t('footer.description') }}</p>
          </div>

          <!-- Navigation -->
          <div>
            <h4 class="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">{{ t('footer.navigation') }}</h4>
            <ul class="space-y-2.5">
              <li><NuxtLink to="/" class="text-sm text-white/45 hover:text-white/80 transition-colors">{{ t('nav.home') }}</NuxtLink></li>
              <li><NuxtLink to="/creators" class="text-sm text-white/45 hover:text-white/80 transition-colors">{{ t('nav.creators') }}</NuxtLink></li>
              <li><NuxtLink to="/auth/login" class="text-sm text-white/45 hover:text-white/80 transition-colors">{{ t('nav.signIn') }}</NuxtLink></li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h4 class="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">{{ t('footer.legal') }}</h4>
            <ul class="space-y-2.5">
              <li><span class="text-sm text-white/35">{{ t('nav.privacy') }}</span></li>
              <li><span class="text-sm text-white/35">{{ t('nav.terms') }}</span></li>
            </ul>
          </div>

          <!-- Social + Language -->
          <div>
            <h4 class="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">{{ t('footer.social') }}</h4>
            <div class="flex gap-2 mb-5">
              <a href="https://instagram.com/creatorkit.uz" target="_blank" rel="noopener"
                class="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-pink-400 hover:border-pink-500/30 transition-all">
                <UIcon name="i-lucide-instagram" class="h-4 w-4" />
              </a>
              <a href="https://t.me/creatorkit_uz" target="_blank" rel="noopener"
                class="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-blue-400 hover:border-blue-500/30 transition-all">
                <UIcon name="i-lucide-send" class="h-4 w-4" />
              </a>
            </div>
            <!-- Language in footer -->
            <div class="flex gap-1.5 flex-wrap">
              <button
                v-for="l in (locales as Array<{ code: string; name: string }>)"
                :key="l.code"
                :class="[
                  'rounded-lg px-2.5 py-1 text-xs font-medium transition-all',
                  l.code === locale
                    ? 'bg-violet-600/20 text-violet-400 border border-violet-500/20'
                    : 'text-white/35 hover:text-white/70 border border-transparent hover:border-white/[0.07]',
                ]"
                @click="setLocale(l.code)"
              >
                {{ l.name }}
              </button>
            </div>
          </div>
        </div>

        <div class="border-t border-white/[0.05] pt-8">
          <p class="text-center text-xs text-white/25">{{ t('footer.copyright') }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>
