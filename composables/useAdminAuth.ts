import { useState } from 'nuxt/app'
import type { User } from '@supabase/supabase-js'
import { useSupabaseClient } from './useSupabaseClient'

export const useAdminAuth = () => {
  const supabase = useSupabaseClient()
  const user = useState<User | null>('adminUser', () => null)
  const idToken = useState<string | null>('adminToken', () => null)
  const loading = useState<boolean>('adminAuthLoading', () => false)
  const error = useState<string | null>('adminAuthError', () => null)

  const ensureSession = async () => {
    const { data, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      throw sessionError
    }
    user.value = data.session?.user ?? null
    idToken.value = data.session?.access_token ?? null
    return idToken.value
  }

  const listenerRegistered = useState<boolean>('adminAuthListenerRegistered', () => false)

  if (!listenerRegistered.value) {
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
      idToken.value = session?.access_token ?? null
    })

    ensureSession().catch((sessionError) => {
      console.warn('[admin-auth] Initial session fetch failed', sessionError)
    })
    listenerRegistered.value = true
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) {
        throw authError
      }
      if (!data.session) {
        throw new Error('Prijava nije dovršena. Pokušaj ponovno.')
      }
      user.value = data.session.user
      idToken.value = data.session.access_token
      return data.session.user
    } catch (err) {
      error.value = (err as Error).message
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    user.value = null
    idToken.value = null
  }

  const adminFetch = async <T>(url: string, options: RequestInit = {}) => {
    let token = idToken.value

    if (!token) {
      try {
        token = await ensureSession()
      } catch (sessionError) {
        console.error('[admin-auth] Failed to refresh session', sessionError)
        throw new Error('Admin nije prijavljen.')
      }
    } else {
      try {
        await ensureSession()
        token = idToken.value
      } catch (sessionError) {
        console.error('[admin-auth] Failed to refresh session', sessionError)
        throw new Error('Admin nije prijavljen.')
      }
    }

    if (!token) {
      throw new Error('Admin nije prijavljen.')
    }

    const headers = new Headers(options.headers || {})
    headers.set('Authorization', `Bearer ${token}`)
    if (options.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }

    const response = await fetch(url, {
      ...options,
      headers
    })

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || 'Neuspješan admin zahtjev.')
    }

    if (response.status === 204) {
      return null as T
    }

    return (await response.json()) as T
  }

  return {
    user,
    idToken,
    loading,
    error,
    login,
    logout,
    adminFetch
  }
}

