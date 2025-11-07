import { useNuxtApp } from 'nuxt/app'
import type { SupabaseClient } from '@supabase/supabase-js'

export const useSupabaseClient = <Database = Record<string, unknown>>(): SupabaseClient<Database> => {
  const nuxtApp = useNuxtApp()
  const client = nuxtApp.$supabase as SupabaseClient<Database> | undefined

  if (!client) {
    throw new Error('Supabase client nije inicijaliziran. Provjeri runtime konfiguraciju.')
  }

  return client
}

