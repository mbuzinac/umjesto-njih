import { defineEventHandler, createError } from 'h3'
import { useRuntimeConfig } from '#imports'
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

  const { data: memory, error: fetchError } = await supabase
    .from('sjecanja')
    .select('slika_storage_path')
    .eq('id', id)
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('[memories.delete] Greška pri dohvaćanju sjećanja', fetchError)
    throw createError({ statusCode: 500, statusMessage: 'Greška pri dohvaćanju sjećanja.' })
  }

  const { error } = await supabase.from('sjecanja').delete().eq('id', id)

  if (error) {
    console.error('[memories.delete] Greška pri brisanju', error)
    throw createError({ statusCode: 500, statusMessage: 'Greška pri brisanju sjećanja.' })
  }

  if (memory?.slika_storage_path) {
    const config = useRuntimeConfig()
    const bucket = config.supabaseBucket || config.public.supabaseBucket || 'memories'
    const { error: storageError } = await supabase.storage.from(bucket).remove([memory.slika_storage_path])

    if (storageError) {
      console.warn('[memories.delete] Greška pri brisanju datoteke iz storagea', storageError)
    }
  }

  return { success: true }
})

