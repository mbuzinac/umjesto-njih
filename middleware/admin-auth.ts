import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useAdminAuth } from '~/composables/useAdminAuth'
import { useSupabaseClient } from '~/composables/useSupabaseClient'

export default defineNuxtRouteMiddleware(async () => {
  const { user, idToken } = useAdminAuth()

  if (user.value && idToken.value) {
    return
  }

  const supabase = useSupabaseClient()
  const { data, error } = await supabase.auth.getSession()

  if (error || !data.session?.user || !data.session?.access_token) {
    return navigateTo('/admin')
  }

  user.value = data.session.user
  idToken.value = data.session.access_token
})

