import { defineEventHandler, createError } from 'h3'
import { useSupabaseAdmin } from '../../utils/supabaseAdmin'

export default defineEventHandler(async (event) => {
  const supabase = useSupabaseAdmin()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase admin nije konfiguriran.' })
  }

  const { id } = event.context.params || {}

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Nedostaje ID branitelja.' })
  }

  const { data, error } = await supabase
    .from('branitelji')
    .select('*')
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('[defenders.get] Greška pri dohvaćanju branitelja', error)
    throw createError({ statusCode: 500, statusMessage: 'Greška pri dohvaćanju branitelja.' })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Branitelj nije pronađen.' })
  }

  return data
})

