<script setup lang="ts">
definePageMeta({
  layout: false,
})

const router = useRouter()
const user = useSupabaseUser()

watchEffect(() => {
  if (user.value) {
    router.push('/dashboard')
  }
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="text-center">
      <div class="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      <p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Completing sign in...
      </p>
    </div>
  </div>
</template>
