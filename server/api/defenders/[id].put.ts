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
    throw createError({ statusCode: 400, statusMessage: 'Missing defender id.' })
  }

  const body = await readBody(event)

  const { data, error: updateError } = await supabase
    .from('branitelji')
    .update({
      ...body,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (updateError) {
    console.error('[defenders.update] Greška pri ažuriranju', updateError)
    throw createError({ statusCode: 500, statusMessage: 'Greška pri ažuriranju branitelja.' })
  }

  return data
})

