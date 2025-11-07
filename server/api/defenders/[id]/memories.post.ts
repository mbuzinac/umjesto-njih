import { defineEventHandler, readBody, createError } from 'h3'
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

  const body = await readBody(event)

  if (!body?.ime_autora || !body?.poruka) {
    throw createError({ statusCode: 400, statusMessage: 'Ime i poruka su obavezni.' })
  }

  const payload = {
    branitelj_id: id,
    ime_autora: body.ime_autora,
    email: body.email || '',
    poruka: body.poruka,
    slika_url: body.slika_url || '',
    slika_storage_path: body.slika_storage_path || '',
    dopusti_javno: Boolean(body.dopusti_javno),
    status: 'pending',
    created_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('sjecanja')
    .insert(payload)
    .select()
    .single()

  if (error) {
    console.error('[memories.create] Greška pri spremanju sjećanja', error)
    throw createError({ statusCode: 500, statusMessage: 'Greška pri slanju sjećanja.' })
  }

  return data
})

