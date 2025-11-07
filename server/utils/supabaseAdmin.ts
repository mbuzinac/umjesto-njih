import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#imports'

let cachedClient: SupabaseClient | null = null

export const useSupabaseAdmin = () => {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl
  const serviceRoleKey = config.supabaseServiceRoleKey

  if (!url || !serviceRoleKey) {
    console.warn('[supabase-admin] Missing Supabase URL ili service role ključ.')
    return null
  }

  if (!cachedClient) {
    cachedClient = createClient(url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })
  }

  return cachedClient
}

