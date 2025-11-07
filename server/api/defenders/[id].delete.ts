import { defineEventHandler, createError } from 'h3'
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

  const { error: deleteError } = await supabase.from('branitelji').delete().eq('id', id)

  if (deleteError) {
    console.error('[defenders.delete] Greška pri brisanju', deleteError)
    throw createError({ statusCode: 500, statusMessage: 'Greška pri brisanju branitelja.' })
  }

  return { success: true }
})

