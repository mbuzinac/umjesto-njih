import { defineEventHandler, getQuery, createError } from 'h3'
import { requireAdmin } from '../../utils/requireAdmin'
import { useSupabaseAdmin } from '../../utils/supabaseAdmin'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const supabase = useSupabaseAdmin()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase admin nije konfiguriran.' })
  }

  const query = getQuery(event)
  const status = query.status as string | undefined

  let request = supabase
    .from('sjecanja')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (status) {
    request = request.eq('status', status)
  }

  const { data, error } = await request

  if (error) {
    console.error('[memories.list] Greška pri dohvaćanju sjećanja', error)
    throw createError({ statusCode: 500, statusMessage: 'Greška pri dohvaćanju sjećanja.' })
  }

  return data ?? []
})

