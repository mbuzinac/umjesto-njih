import { defineEventHandler, getQuery, createError } from 'h3'
import { useSupabaseAdmin } from '../../../utils/supabaseAdmin'

export default defineEventHandler(async (event) => {
  const supabase = useSupabaseAdmin()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase admin nije konfiguriran.' })
  }

  const { id } = event.context.params || {}
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Nedostaje ID branitelja.' })
  }

  const query = getQuery(event)
  const status = (query.status as string) || 'approved'

  let request = supabase
    .from('sjecanja')
    .select('*')
    .eq('branitelj_id', id)
    .order('created_at', { ascending: false })

  if (status) {
    request = request.eq('status', status)
  }

  const { data, error } = await request

  if (error) {
    console.error('[memories.byDefender] Greška pri dohvaćanju', error)
    throw createError({ statusCode: 500, statusMessage: 'Greška pri dohvaćanju sjećanja.' })
  }

  return data ?? []
})

