<script setup lang="ts">
const { t } = useI18n()
const authStore = useAuthStore()
const route = useRoute()

const navItems = computed(() => [
  { label: t('nav.dashboard'), to: '/dashboard', icon: 'i-lucide-layout-dashboard' },
  { label: t('nav.instagram'), to: '/dashboard/instagram', icon: 'i-lucide-instagram' },
  { label: t('nav.tiktok'), to: '/dashboard/tiktok', icon: 'i-lucide-music' },
  { label: t('nav.mediaKit'), to: '/dashboard/media-kit', icon: 'i-lucide-file-text' },
  { label: t('nav.settings'), to: '/dashboard/settings', icon: 'i-lucide-settings' },
])

const mobileOpen = ref(false)
</script>

<template>
  <div class="flex min-h-screen mesh-bg">
    <!-- ── Sidebar Desktop ──────────────────────────────────── -->
    <aside class="hidden lg:flex w-64 flex-col sidebar-gradient border-r border-white/[0.06] relative">
      <!-- subtle top glow -->
      <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-violet-600/10 to-transparent pointer-events-none" />

      <!-- Logo -->
      <div class="flex h-16 items-center gap-3 px-6 border-b border-white/[0.06] relative z-10">
        <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/30">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fill="white" fill-opacity="0.9"/>
            <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="white" fill-opacity="0.4"/>
          </svg>
        </div>
        <span class="text-lg font-bold text-white tracking-tight">CreatorKit</span>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-5 space-y-0.5 relative z-10">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group"
          :class="route.path === item.to
            ? 'bg-gradient-to-r from-violet-600/25 to-indigo-600/10 text-violet-300 border border-violet-500/20'
            : 'text-white/50 hover:text-white/90 hover:bg-white/[0.05]'"
        >
          <UIcon
            :name="item.icon"
            class="size-4.5 transition-colors"
            :class="route.path === item.to ? 'text-violet-400' : 'text-white/40 group-hover:text-white/70'"
          />
          {{ item.label }}
          <div
            v-if="route.path === item.to"
            class="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400"
          />
        </NuxtLink>
      </nav>

      <!-- User footer -->
      <div class="border-t border-white/[0.06] p-4 relative z-10">
        <div class="flex items-center gap-3 rounded-xl p-2 hover:bg-white/[0.04] transition-colors">
          <div class="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
            {{ (authStore.user?.email || 'U').charAt(0).toUpperCase() }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-xs font-medium text-white/80">
              {{ authStore.user?.email }}
            </p>
            <p class="text-[10px] text-white/30">Creator</p>
          </div>
          <button
            class="text-white/30 hover:text-white/70 transition-colors"
            @click="authStore.signOut()"
          >
            <UIcon name="i-lucide-log-out" class="size-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- ── Mobile ─────────────────────────────────────────────── -->
    <div class="flex flex-1 flex-col min-w-0">
      <!-- Mobile header -->
      <header class="flex h-14 items-center justify-between px-4 border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-xl lg:hidden">
        <div class="flex items-center gap-2">
          <div class="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" fill="white" fill-opacity="0.9"/>
            </svg>
          </div>
          <span class="text-base font-bold text-white">CreatorKit</span>
        </div>
        <button
          class="text-white/50 hover:text-white/90 transition-colors"
          @click="authStore.signOut()"
        >
          <UIcon name="i-lucide-log-out" class="size-5" />
        </button>
      </header>

      <!-- Mobile bottom nav -->
      <nav class="flex gap-0.5 overflow-x-auto border-b border-white/[0.06] bg-white/[0.02] px-2 py-1.5 lg:hidden">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all"
          :class="route.path === item.to
            ? 'bg-violet-500/20 text-violet-300'
            : 'text-white/40 hover:text-white/80'"
        >
          <UIcon :name="item.icon" class="size-3.5" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Main content -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
