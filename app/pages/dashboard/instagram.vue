<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20">
    <div class="rounded-full bg-pink-500/10 p-6">
      <UIcon name="i-lucide-instagram" class="size-12 text-pink-400" />
    </div>
    <h1 class="mt-6 text-2xl font-bold text-white">
      {{ t('instagram.title') }}
    </h1>
    <p class="mt-2 max-w-md text-center text-zinc-400">
      {{ t('instagram.notConnected') }}
    </p>
    <p class="mt-1 max-w-md text-center text-sm text-zinc-500">
      {{ t('instagram.connectDescription') }}
    </p>
    <UButton class="mt-6" color="primary" size="lg" icon="i-lucide-link">
      {{ t('instagram.connect') }}
    </UButton>
  </div>
</template>
