import { defineEventHandler, createError } from 'h3'
import { useSupabaseAdmin } from '../../utils/supabaseAdmin'

export default defineEventHandler(async () => {
  const supabase = useSupabaseAdmin()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase admin nije konfiguriran.' })
  }

  const { count, error } = await supabase
    .from('branitelji')
    .select('*', { head: true, count: 'exact' })

  if (error) {
    console.error('[defenders.count] Greška pri brojanje branitelja', error)
    throw createError({ statusCode: 500, statusMessage: 'Greška pri dohvaćanju statistike.' })
  }

  return { total: count ?? 0 }
})

