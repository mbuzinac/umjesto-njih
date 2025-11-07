import { defineEventHandler, createError } from 'h3'
import { useSupabaseAdmin } from '../../utils/supabaseAdmin'

export default defineEventHandler(async () => {
  const supabase = useSupabaseAdmin()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase admin nije konfiguriran.' })
  }

  const { data, error } = await supabase
    .from('branitelji')
    .select('*')
    .order('prezime', { ascending: true })

  if (error) {
    console.error('[defenders.index] Greška pri dohvaćanju branitelja', error)
    throw createError({ statusCode: 500, statusMessage: 'Greška pri dohvaćanju branitelja.' })
  }

  return data ?? []
})

