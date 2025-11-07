import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

type TypedSupabaseClient = SupabaseClient<Record<string, unknown>, 'public', Record<string, unknown>>

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl
  const anonKey = config.public.supabaseAnonKey

  if (!url || !anonKey) {
    console.warn('[supabase] Missing runtime configuration; client not initialised.')
    return
  }

  const supabase = createClient(url, anonKey, {
    auth: {
      persistSession: !process.server,
      autoRefreshToken: !process.server
    }
  }) as TypedSupabaseClient

  return {
    provide: {
      supabase
    }
  }
})

