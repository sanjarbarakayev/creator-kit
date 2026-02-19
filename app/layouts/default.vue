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
</script>

<template>
  <div class="flex min-h-screen bg-zinc-950">
    <!-- Sidebar -->
    <aside class="hidden w-64 flex-col border-r border-zinc-800 bg-zinc-900 lg:flex">
      <div class="flex h-16 items-center gap-2 border-b border-zinc-800 px-6">
        <span class="text-xl font-bold text-white">CreatorKit</span>
      </div>

      <nav class="flex-1 space-y-1 px-3 py-4">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
          :class="route.path === item.to
            ? 'bg-zinc-800 text-white'
            : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'"
        >
          <UIcon :name="item.icon" class="size-5" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="border-t border-zinc-800 p-4">
        <div class="flex items-center gap-3">
          <UAvatar :alt="authStore.user?.email || 'U'" size="sm" />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-white">
              {{ authStore.user?.email }}
            </p>
          </div>
          <UButton
            icon="i-lucide-log-out"
            variant="ghost"
            color="neutral"
            size="xs"
            @click="authStore.signOut()"
          />
        </div>
      </div>
    </aside>

    <!-- Mobile header -->
    <div class="flex flex-1 flex-col">
      <header class="flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 lg:hidden">
        <span class="text-lg font-bold text-white">CreatorKit</span>
        <div class="flex items-center gap-2">
          <UButton
            icon="i-lucide-log-out"
            variant="ghost"
            color="neutral"
            size="sm"
            @click="authStore.signOut()"
          />
        </div>
      </header>

      <!-- Mobile nav -->
      <nav class="flex gap-1 overflow-x-auto border-b border-zinc-800 bg-zinc-900 px-2 py-2 lg:hidden">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors"
          :class="route.path === item.to
            ? 'bg-zinc-800 text-white'
            : 'text-zinc-400 hover:text-white'"
        >
          <UIcon :name="item.icon" class="size-4" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
