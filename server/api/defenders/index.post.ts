import { defineEventHandler, readBody, createError } from 'h3'
import { requireAdmin } from '../../utils/requireAdmin'
import { useSupabaseAdmin } from '../../utils/supabaseAdmin'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const supabase = useSupabaseAdmin()
  if (!supabase) {
    throw createError({ statusCode: 500, statusMessage: 'Supabase admin nije konfiguriran.' })
  }

  const body = await readBody(event)

  const requiredFields = ['ime', 'prezime']
  for (const field of requiredFields) {
    if (!body?.[field]) {
      throw createError({ statusCode: 400, statusMessage: `Missing field: ${field}` })
    }
  }

  const payload = {
    ime: body.ime,
    prezime: body.prezime,
    godina_rođenja: body.godina_rođenja || null,
    godina_pogibije: body.godina_pogibije || null,
    mjesto_rođenja: body.mjesto_rođenja || '',
    mjesto_pogibije: body.mjesto_pogibije || '',
    fotka_url: body.fotka_url || '',
    jedinica: body.jedinica || ''
  }

  const { data, error: insertError } = await supabase
    .from('branitelji')
    .insert(payload)
    .select()
    .single()

  if (insertError) {
    console.error('[defenders.create] Greška pri spremanju', insertError)
    throw createError({ statusCode: 500, statusMessage: 'Greška pri spremanju branitelja.' })
  }

  return data
})

