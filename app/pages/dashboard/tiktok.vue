<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20">
    <div class="rounded-full bg-cyan-500/10 p-6">
      <UIcon name="i-lucide-music" class="size-12 text-cyan-400" />
    </div>
    <h1 class="mt-6 text-2xl font-bold text-white">
      TikTok
    </h1>
    <div class="mt-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-6 py-3">
      <p class="text-sm font-medium text-cyan-400">
        🚀 {{ t('tiktok.comingSoon') }}
      </p>
    </div>
    <p class="mt-4 max-w-md text-center text-zinc-400">
      {{ t('tiktok.comingSoonDescription') }}
    </p>
  </div>
</template>
