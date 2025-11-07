import { defineEventHandler, readBody, createError } from 'h3'
import { requireAdmin } from '../../utils/requireAdmin'
import { useSupabaseAdmin } from '../../utils/supabaseAdmin'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const supabase = useSupabaseAdmin()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase admin nije konfiguriran.' })
  }

  const { id } = event.context.params || {}
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Nedostaje ID sjećanja.' })
  }

  const body = await readBody(event)
  const allowedStatuses = ['approved', 'rejected', 'pending']

  if (body.status && !allowedStatuses.includes(body.status)) {
    throw createError({ statusCode: 400, statusMessage: 'Neispravan status.' })
  }

  const { data, error } = await supabase
    .from('sjecanja')
    .update({
      ...body,
      moderated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[memories.update] Greška pri ažuriranju', error)
    throw createError({ statusCode: 500, statusMessage: 'Greška pri spremanju promjena.' })
  }

  return data
})

