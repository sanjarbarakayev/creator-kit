<script setup lang="ts">
const { t, locale, locales, setLocale } = useI18n()

const availableLocales = computed(() =>
  (locales.value as Array<{ code: string; name: string }>).filter(l => l.code !== locale.value),
)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-950">
    <!-- Header -->
    <header class="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80">
      <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center gap-6">
            <NuxtLink to="/" class="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              CreatorKit
            </NuxtLink>
            <NuxtLink to="/creators" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors">
              {{ t('nav.creators') }}
            </NuxtLink>
          </div>
          <div class="flex items-center gap-3">
            <!-- Language Switcher -->
            <div class="flex items-center gap-1">
              <button
                v-for="l in availableLocales"
                :key="l.code"
                class="rounded-md px-2 py-1 text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition-colors"
                @click="setLocale(l.code)"
              >
                {{ l.code.toUpperCase() }}
              </button>
            </div>
            <NuxtLink to="/auth/login">
              <UButton variant="soft" size="sm">
                {{ t('nav.signIn') }}
              </UButton>
            </NuxtLink>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Brand -->
          <div>
            <NuxtLink to="/" class="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              CreatorKit
            </NuxtLink>
            <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
              {{ t('footer.description') }}
            </p>
          </div>

          <!-- Navigation -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white">{{ t('footer.navigation') }}</h4>
            <ul class="mt-3 space-y-2">
              <li><NuxtLink to="/" class="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">{{ t('nav.home') }}</NuxtLink></li>
              <li><NuxtLink to="/creators" class="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">{{ t('nav.creators') }}</NuxtLink></li>
              <li><NuxtLink to="/auth/login" class="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">{{ t('nav.signIn') }}</NuxtLink></li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white">{{ t('footer.legal') }}</h4>
            <ul class="mt-3 space-y-2">
              <li><span class="text-sm text-gray-500 dark:text-gray-400">{{ t('nav.privacy') }}</span></li>
              <li><span class="text-sm text-gray-500 dark:text-gray-400">{{ t('nav.terms') }}</span></li>
            </ul>
          </div>

          <!-- Social -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white">{{ t('footer.social') }}</h4>
            <div class="mt-3 flex gap-3">
              <a href="https://instagram.com/creatorkit.uz" target="_blank" rel="noopener" class="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white transition-colors">
                <UIcon name="i-lucide-instagram" class="h-4 w-4" />
              </a>
              <a href="https://t.me/creatorkit_uz" target="_blank" rel="noopener" class="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white transition-colors">
                <UIcon name="i-lucide-send" class="h-4 w-4" />
              </a>
              <a href="https://twitter.com/creatorkit_uz" target="_blank" rel="noopener" class="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white transition-colors">
                <UIcon name="i-lucide-twitter" class="h-4 w-4" />
              </a>
            </div>
            <!-- Language Switcher in Footer -->
            <div class="mt-4 flex gap-2">
              <button
                v-for="l in (locales as Array<{ code: string; name: string }>)"
                :key="l.code"
                :class="[
                  'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                  l.code === locale
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
                ]"
                @click="setLocale(l.code)"
              >
                {{ l.name }}
              </button>
            </div>
          </div>
        </div>

        <div class="mt-8 border-t border-gray-200 pt-8 dark:border-gray-800">
          <p class="text-center text-sm text-gray-500 dark:text-gray-400">
            {{ t('footer.copyright') }}
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
