<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <header class="border-b border-gray-200 dark:border-gray-800">
      <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex items-center gap-6">
            <NuxtLink to="/" class="text-xl font-bold">
              CreatorKit
            </NuxtLink>
            <NuxtLink to="/creators" class="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              {{ t('nav.creators') }}
            </NuxtLink>
          </div>
          <div class="flex items-center gap-4">
            <NuxtLink to="/auth/login">
              <UButton variant="soft" size="sm">
                {{ t('nav.signIn') }}
              </UButton>
            </NuxtLink>
          </div>
        </div>
      </nav>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>
