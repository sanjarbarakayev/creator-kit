import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const supabaseUser = useSupabaseUser()
  const supabaseClient = useSupabaseClient()

  const user = computed(() => supabaseUser.value)
  const isAuthenticated = computed(() => !!supabaseUser.value)

  async function signOut() {
    await supabaseClient.auth.signOut()
    navigateTo('/auth/login')
  }

  async function signInWithGoogle() {
    navigateTo('/api/auth/google', { external: true })
  }

  return {
    user,
    isAuthenticated,
    signOut,
    signInWithGoogle,
  }
})
