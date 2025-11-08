import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { createClient } from '@supabase/supabase-js'

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
      persistSession: process.client,
      autoRefreshToken: process.client
    }
  })

  return {
    provide: {
      supabase
    }
  }
})


